import React, {useEffect, useState} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {VFileMessage} from 'vfile-message'
import {Statistics} from 'vfile-statistics'

import {ErrorFallback} from './ErrorFallback.js'
import {BaseEditorProps} from './types.js'

import {Stack} from '@chakra-ui/react'
import StatsReporterError from './StatsReporterError.js'

const FallbackComponent: React.FC<{error: Error}> = ({error}) => {
  const message = new VFileMessage(error)
  message.fatal = true
  return (
    <pre>
      <code>{String(message)}</code>
    </pre>
  )
}

export interface PreviewComponentProps {
  state: any
  stats: Statistics
  components: BaseEditorProps['components']
}

const processContent = ({
  state,
  components
}: {
  state: PreviewComponentProps['state']
  components: PreviewComponentProps['components']
}) => {
  try {
    // check if state.file.result is a functio, if not throw error

    if (typeof state.file.result !== 'function') {
      console.error(state)
      throw new Error(`Preview could not be generated.`)
    }

    return state.file.result({
      components: {
        code: ({className, ...props}: any) => {
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter language={match[1]} PreTag="div" {...props} />
          ) : (
            <code className={className} {...props} />
          )
        },
        ...components,
        wrapper: ({children}: any) => {
          const Wrapper = components?.wrapper
          const el = (
            <Stack
              w="full"
              css={{
                '& mjx-container': {
                  display: 'inline-block !important',
                  verticalAlign: 'text-bottom !important'
                }
              }}>
              {children}
            </Stack>
          )

          if (Wrapper) {
            return <Wrapper>{el}</Wrapper>
          }

          return el
        }
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * processContent, with the throw turned into a value.
 *
 * Every caller here needs the failure as data rather than as an exception:
 * during render because a throw would escape the boundary below, and in the
 * effect because the last good content has to survive it.
 */
const safeProcess = (args: {
  state: PreviewComponentProps['state']
  components: PreviewComponentProps['components']
}): {content: React.ReactNode; error: Error | null} => {
  try {
    return {content: processContent(args), error: null}
  } catch (error) {
    return {content: null, error: error as Error}
  }
}

export const PreviewComponent: React.FC<PreviewComponentProps> = React.memo(
  ({state, stats, components}) => {
    // Never throws. processContent does, whenever the document failed to
    // compile and file.result is therefore not a function, and it used to be
    // called straight from the state initializer below. A throw there happens
    // during THIS component's render, so the ErrorBoundary this component
    // renders cannot catch it: it escapes upwards and takes the surrounding
    // page down. That is reachable in practice, because switching away from
    // the preview and back remounts this component, and the document may well
    // be broken by then.
    const [result, setResult] = useState<{
      content: React.ReactNode
      error: Error | null
    }>(() => safeProcess({state, components}))

    useEffect(() => {
      const next = safeProcess({state, components})

      // Hold on to the last render that worked. A document that stops
      // compiling must not blank what is already on screen: the author keeps
      // looking at their last working version while the messages below tell
      // them what broke.
      setResult(previous =>
        next.error ? {content: previous.content, error: next.error} : next
      )
    }, [state.file?.value, components])

    return (
      // resetKeys, or the boundary would latch. Once a render throws, the
      // fallback stays up for the life of the component no matter what the
      // author types next, and the only way back is a reload.
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        resetKeys={[state.file?.value]}>
        <noscript>Enable JavaScript for the rendered result.</noscript>

        {result.content}

        {result.error && <FallbackComponent error={result.error} />}

        <StatsReporterError state={state} stats={stats} />
      </ErrorBoundary>
    )
  }
)
