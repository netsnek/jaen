import {Root as MdastRoot} from 'mdast'
import {TabsProps} from './TabsTemplate'

export interface BaseEditorProps {
  components: Record<string, React.ComponentType<any>>
  onMdast?(value: MdastRoot | undefined): void
  onUpdateValue: (mdast: any, value: string) => void
  mdast?: any
  value?: string
  tabsTemplate?: React.FC<TabsProps> // Update this line
  mode?: 'preview' | 'build' | 'editAndPreview' | 'editAndBuild'
  /**
   * CodeMirror extensions for the source view. Defaults to markdown with
   * embedded code languages, which is right for prose. A consumer whose
   * documents are something else, an SVG for instance, passes the language
   * of that thing instead and gets highlighting that means something.
   */
  editorExtensions?: any[]
}

export {MdastRoot}
