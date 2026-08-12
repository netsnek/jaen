/**
 * The async light build ships no types of its own.
 *
 * @types/react-syntax-highlighter declares the package root and the `light`
 * and `prism` entry points, but not `light-async`, so importing it fails the
 * build under noImplicitAny even though the runtime export is the same
 * component. This declares the shape we use rather than turning the check off.
 */
declare module 'react-syntax-highlighter/dist/esm/light-async' {
  import type {ComponentType} from 'react'

  const SyntaxHighlighter: ComponentType<{
    language?: string
    style?: any
    PreTag?: any
    children?: any
    [key: string]: any
  }>

  export default SyntaxHighlighter
}
