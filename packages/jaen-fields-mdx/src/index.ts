export {
  MdxField,
  UncontrolledMdxField,
  MdxFieldProps,
  useInjectMdxPropContext
} from './MdxField'

// A consumer that supplies its own tabsTemplate needs the props that
// template is called with, including the document health the field reports.
export type {TabsProps} from './MdxField/components/TabsTemplate'

// onMdast hands this out and consumers store it, so it belongs to the public
// surface rather than to a path inside dist.
export type {MdastRoot} from './MdxField/components/types'
