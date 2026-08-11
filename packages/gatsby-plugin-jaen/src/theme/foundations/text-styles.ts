/**
 * v2 restated all eleven text styles; v3 already ships them with the same
 * font sizes and line heights. Diffing the two leaves exactly five values that
 * jaen actually disagrees with, so that is all this declares.
 *
 * `mergeConfigs` deep-merges into v3's entry rather than replacing it (verified:
 * overriding only `lineHeight` keeps `fontSize`), so a partial value is safe.
 */
import {defineTextStyles} from '@chakra-ui/react'

export const textStyles = defineTextStyles({
  // v3 sets 1rem; jaen has always given the smallest size a little more room.
  xs: {value: {lineHeight: '1.125rem'}},

  // v3 tightens the display sizes to -0.025em. jaen's headings were spaced at
  // -0.02em, and at 72px the difference is visible.
  '4xl': {value: {letterSpacing: '-0.02em'}},
  '5xl': {value: {letterSpacing: '-0.02em'}},
  '6xl': {value: {letterSpacing: '-0.02em'}},
  '7xl': {value: {letterSpacing: '-0.02em'}}
})
