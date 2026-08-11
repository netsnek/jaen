/**
 * The one place the colour mode is read from.
 *
 * Today this is a plain re-export of Chakra v2's hooks and changes nothing.
 * It exists so that the change to v3 is a change to this file rather than to
 * the forty-odd call sites spread over jaen and the sites that consume it.
 *
 * v3 has no colour mode of its own: it delegates to next-themes, whose
 * `useTheme` returns `{theme, setTheme, resolvedTheme}` and knows nothing
 * about Chakra. `useColorModeValue` disappears entirely there and has to be
 * rebuilt on top of the resolved theme. Both are a handful of lines here and
 * an afternoon of grep everywhere else, which is the whole reason for this
 * module.
 *
 * Import from `jaen` rather than from `@chakra-ui/react`, in the packages and
 * in the sites alike. The colour mode belongs to the provider that
 * gatsby-plugin-jaen mounts, so it is jaen's to hand out.
 */
export {
  DarkMode,
  LightMode,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react'
export type {ColorMode, ColorModeWithSystem} from '@chakra-ui/react'
