import Text from './TextField'
import Image from './ImageField'
import Index from './IndexField'
import Section from './SectionField'
import Editor from './EditorField'

export const Field = {
  Text,
  Image,
  Index,
  Section,
  Editor
}

// Consumers that wrap a field need its props. Without these they reached into
// jaen/dist/fields/..., which classic node resolution allowed and "bundler"
// refuses, because the package publishes no such subpath.
export type {ImageFieldProps} from './ImageField/ImageField'
export type {TextFieldProps} from './TextField/TextField'
