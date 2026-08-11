export {
  MdxField,
  UncontrolledMdxField,
  MdxFieldProps,
  useInjectMdxPropContext
} from './MdxField'

// A consumer that supplies its own tabsTemplate needs the props that
// template is called with, including the document health the field reports.
export type {TabsProps} from './MdxField/components/TabsTemplate'
