import {CreatePagesArgs, Page} from 'gatsby'

import {onCreatePage} from '../on-create-page/jaen-page'
import {readPageConfig} from '../utils/page-config-reader'
import {generatePageOriginPath} from '../utils/path'
import {
  createLocalePagesId,
  isPathBlacklisted,
  localeForPrefix,
  parsePathPrefix,
  resolveLocales,
  translatePagePaths,
  JaenI18nOptions
} from '../utils/i18n'
import {isSystemPath, normalizePath} from '../utils/path-filters'

interface QueriedJaenTemplate {
  id: string
  absolutePath: string
  relativePath: string
}

interface QueriedJaenPage {
  id: string
  template: string | null
  slug: string
  parentPage: {
    id: string
  } | null
}

export const createPages = async (
  args: CreatePagesArgs,
  i18n?: JaenI18nOptions
) => {
  const {actions, graphql, reporter, getNode} = args

  reporter.info('Creating pages...')

  const result = await graphql<{
    allJaenTemplate: {
      nodes: QueriedJaenTemplate[]
    }
    allJaenPage: {
      nodes: QueriedJaenPage[]
    }
  }>(`
    query {
      allJaenTemplate {
        nodes {
          id
          absolutePath
          relativePath
        }
      }
      allJaenPage {
        nodes {
          id
          template
          slug
          parentPage {
            id
          }
        }
      }
    }
  `)

  if (result.errors || !result.data) {
    reporter.panicOnBuild(`Error while running GraphQL query. ${result.errors}`)

    return
  }

  const {allJaenTemplate, allJaenPage} = result.data

  // Create a page and run the jaen onCreatePage hook manually: Gatsby
  // suppresses onCreatePage for pages a plugin creates itself
  // (infinite-loop guard), but the hook is what assures the JaenPage node.
  const createOne = async (page: Partial<Page>) => {
    actions.createPage(page as any)

    await onCreatePage(
      {
        page,
        ...args
      } as any,
      i18n
    )
  }

  // ---------------------------------------------------------------------
  // Resolve every templated CMS page to its template and origin path first,
  // so the locale fan-out below can look siblings up by path.
  // ---------------------------------------------------------------------

  interface ResolvedPage {
    node: QueriedJaenPage
    pagePath: string
    template: QueriedJaenTemplate
  }

  const resolvedPages: ResolvedPage[] = []
  const templatedNodeByPath = new Map<string, ResolvedPage>()

  for (const node of allJaenPage.nodes) {
    if (!node.template) continue

    const pagePath = generatePageOriginPath(allJaenPage.nodes, node)

    if (!pagePath) {
      reporter.panicOnBuild(`Error while generating path for page ${node.id}`)
      return
    }

    const jaenTemplate = allJaenTemplate.nodes.find(
      template => template.id === node.template
    )

    if (!jaenTemplate) {
      reporter.panicOnBuild(`Template ${node.template} not found`)
      return
    }

    const resolved: ResolvedPage = {node, pagePath, template: jaenTemplate}

    resolvedPages.push(resolved)
    templatedNodeByPath.set(normalizePath(pagePath), resolved)
  }

  // Localized paths the canonical fan-out already covers. A CMS node that
  // lives at such a path (a natively localized page tree) is folded into the
  // fan-out instead of being created twice.
  const fannedOutPaths = new Set<string>()

  // ---------------------------------------------------------------------
  // Canonical (unprefixed) pages: fan out per locale, mirroring the
  // stateful src/pages mechanism.
  // ---------------------------------------------------------------------

  for (const {node, pagePath, template} of resolvedPages) {
    // A page whose path already starts with a configured non-default locale
    // prefix is a localized variant, handled in the second pass below.
    const pathPrefixLocale = i18n
      ? localeForPrefix(parsePathPrefix(pagePath), i18n)
      : undefined

    if (pathPrefixLocale && !pathPrefixLocale.isDefault) continue

    const pageConfig = readPageConfig(template.absolutePath)

    // System routes (and single-locale sites) keep the untranslated
    // single-page behavior.
    if (!i18n || isSystemPath(pagePath)) {
      await createOne({
        path: pagePath,
        component: template.absolutePath,
        context: {
          jaenPageId: node.id,
          pageConfig
        }
      })

      continue
    }

    const locales = resolveLocales(i18n)
    const localePagesId = createLocalePagesId(pagePath)

    const entries = translatePagePaths(pagePath, i18n).filter(entry => {
      const locale = locales.find(l => l.locale === entry.locale)!
      return !isPathBlacklisted(entry.path, locale)
    })

    for (const entry of entries) {
      const locale = locales.find(l => l.locale === entry.locale)!

      const translations = entries.filter(
        other => other.locale !== entry.locale
      )

      // The localized variant renders localized CMS content when it exists:
      // either a full CMS page tree at the prefixed path or a JaenPage node
      // keyed by the localized path (`JaenPage /en/docs/foo/`). Without one,
      // the canonical node id is kept so the variant renders the source
      // language instead of an empty page.
      let jaenPageId = node.id
      let component = template.absolutePath

      if (!locale.isDefault) {
        fannedOutPaths.add(normalizePath(entry.path))

        const localizedResolved = templatedNodeByPath.get(
          normalizePath(entry.path)
        )

        if (localizedResolved) {
          jaenPageId = localizedResolved.node.id
          component = localizedResolved.template.absolutePath
        } else if (getNode(`JaenPage ${entry.path}`)) {
          jaenPageId = `JaenPage ${entry.path}`
        }
      }

      await createOne({
        path: entry.path,
        component,
        context: {
          jaenPageId,
          pageConfig,
          locale: entry.locale,
          prefix: entry.prefix,
          localePagesId,
          translations
        }
      })
    }
  }

  // ---------------------------------------------------------------------
  // Locale-prefixed CMS pages the fan-out did not cover (a localized page
  // without a canonical sibling) are created standalone; onCreatePage
  // detects the prefix and attaches their locale context.
  // ---------------------------------------------------------------------

  for (const {node, pagePath, template} of resolvedPages) {
    const pathPrefixLocale = i18n
      ? localeForPrefix(parsePathPrefix(pagePath), i18n)
      : undefined

    if (!pathPrefixLocale || pathPrefixLocale.isDefault) continue
    if (fannedOutPaths.has(normalizePath(pagePath))) continue

    await createOne({
      path: pagePath,
      component: template.absolutePath,
      context: {
        jaenPageId: node.id,
        pageConfig: readPageConfig(template.absolutePath)
      }
    })
  }
}
