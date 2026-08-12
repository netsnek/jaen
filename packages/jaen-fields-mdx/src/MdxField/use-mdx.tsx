import {evaluateSync} from '@mdx-js/mdx'
import {useDebounceFn} from 'ahooks'
import {frontmatterToMarkdown} from 'mdast-util-frontmatter'
import {gfmToMarkdown} from 'mdast-util-gfm'
import {mathToMarkdown} from 'mdast-util-math'
import {mdxToMarkdown} from 'mdast-util-mdx'
import {useEffect, useState} from 'react'
import * as runtime from 'react/jsx-runtime'
import rehypeSlug from 'rehype-slug-custom-id'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import {rehypeUnwrapImages} from './rehype-unwrap-images'
/**
 * MathJax is fetched when a document actually contains mathematics.
 *
 * `rehype-mathjax/svg` carries mathjax-full, 1.77 MB of source and the largest
 * package in a consuming site's bundle. A static import put it in the chunk
 * graph of every page that mounts an MdxField, so netsnek.com's home page
 * downloaded a full TeX typesetter to render a hero illustration that contains
 * no formula at all.
 *
 * `evaluateSync` cannot await, so the plugin cannot simply be imported on
 * demand inside it. Instead the source is checked for math first: documents
 * without it never load the typesetter, documents with it start the fetch and
 * are re-evaluated once it lands. The rendered result is unchanged in both
 * cases, it only arrives a moment later the first time.
 */
let rehypeMathjax: any = null
let mathjaxPromise: Promise<any> | null = null
const mathReadyListeners = new Set<() => void>()

/** `$…$`, `$$…$$`, `\(…\)`, `\[…\]` and `\begin{…}`, which is what remark-math reads. */
const HAS_MATH = /\$\$|\$[^$\n]+\$|\\\(|\\\[|\\begin\{/

const loadMathjax = () => {
  if (!mathjaxPromise) {
    mathjaxPromise = import(
      /* webpackChunkName: "rehype-mathjax" */
      'rehype-mathjax/svg'
    ).then(m => {
      rehypeMathjax = (m as any).default || m
      for (const fn of mathReadyListeners) fn()
      return rehypeMathjax
    })
  }
  return mathjaxPromise
}

import {directiveToMarkdown} from 'mdast-util-directive'
import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import {VFile} from 'vfile'
import {VFileMessage} from 'vfile-message'

import {toMarkdown} from 'mdast-util-to-markdown'

import {MdastRoot} from './components/types.js'

import rehypeSanitize from '../rehype-sanitize-mdx/index.js'

const parseMdast = (tree: MdastRoot) => {
  const out = toMarkdown(tree as any, {
    extensions: [
      mdxToMarkdown(),
      gfmToMarkdown(),
      mathToMarkdown(),
      directiveToMarkdown,
      frontmatterToMarkdown()
    ] as any
  })

  return out
}

function createFile(value: string) {
  return new VFile({basename: 'example.mdx', value})
}

function evaluateFile(file: VFile, components: {[key: string]: any}) {
  const capture = (name: string) => () => (tree: any) => {
    file.data[name] = tree
  }

  // Only a document that carries math pays for the typesetter, and it pays on
  // the second pass rather than blocking the first.
  const needsMath = HAS_MATH.test(String(file.value ?? ''))
  if (needsMath && !rehypeMathjax) void loadMathjax()

  try {
    file.result = evaluateSync(file as any, {
      ...(runtime as any),
      development: false,

      useDynamicImport: true,
      remarkPlugins: [
        remarkGfm,
        remarkFrontmatter,
        remarkMath,
        remarkDirective,
        capture('mdast')
      ],
      rehypePlugins: [
        rehypeSlug,
        rehypeUnwrapImages,
        rehypeSanitize(Object.keys(components)),
        [
          rehypeMdxCodeProps,
          {
            tagName: 'code'
          }
        ],
        ...(needsMath && rehypeMathjax ? [rehypeMathjax] : [])
      ],
      recmaPlugins: []
    }).default
  } catch (error) {
    const message =
      error instanceof VFileMessage ? error : new VFileMessage(error)

    if (!file.messages.includes(message as any)) {
      file.messages.push(message as any)
    }

    message.fatal = true
  }
}
interface Defaults {
  gfm: boolean
  frontmatter: boolean
  value?: string
  math: boolean
  directive: boolean
  mdast?: MdastRoot
}
const initializeState = (
  defaults: Defaults,
  components: {
    [key: string]: any
  } = {}
) => {
  const markdown = defaults.mdast
    ? parseMdast(defaults.mdast)
    : defaults.value || ''

  const file = createFile(markdown)

  evaluateFile(file, components)

  return {
    ...defaults,
    value: markdown,
    file
  }
}

export function useMdx(
  defaults: Defaults,
  live: boolean = false,
  components: {
    [key: string]: any
  } = {}
) {
  const [state, setState] = useState(() =>
    initializeState(defaults, components)
  )

  useEffect(() => {
    if (live) {
      setState(initializeState(defaults, components))
    }
  }, [defaults, live])

  // The typesetter arrives after the first pass, so the document that asked for
  // it is evaluated once more. Documents without math never subscribe to
  // anything that fires.
  useEffect(() => {
    const reevaluate = () => {
      setState(s => {
        const file = createFile(s.value)
        evaluateFile(file, components)
        return {...s, file}
      })
    }

    mathReadyListeners.add(reevaluate)

    return () => {
      mathReadyListeners.delete(reevaluate)
    }
  }, [])

  const {run: setConfig} = useDebounceFn(
    async config => {
      const file = createFile(config.value)

      evaluateFile(file, components)

      setState({...config, file})
    },
    {leading: true, trailing: true, wait: 200}
  )

  return [state, setConfig]
}
