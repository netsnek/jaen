/**
 * Base tokens: raw values, no light/dark axis. The semantic layer in
 * `semantic-tokens.ts` is what reads these.
 *
 * Only deltas against v3's defaults are declared. Everything jaen used to
 * restate and v3 already provides identically has been dropped, so what remains
 * is exactly the set of values jaen actually disagrees with.
 */
import {defineTokens} from '@chakra-ui/react'

export const tokens = defineTokens({
  colors: {
    gray: {
      // v3 has no gray.25 at all, and its gray.50/950 are neutral greys
      // (#fafafa, #111111) where jaen's carry a blue cast. The CMS chrome is
      // built on those three, so they are a real disagreement, not a restatement.
      25: {value: '#fcfdfe'},
      50: {value: '#f4f8fa'},
      950: {value: '#14151e'}
    }
  },
  fonts: {
    heading: {
      value: '"Spline Sans Variable", -apple-system, system-ui, sans-serif'
    },
    body: {value: '"Open Sans Variable", -apple-system, system-ui, sans-serif'}
  },
  sizes: {
    // v3 stops at 12/14/16, so `size="2xl"` on a Button would emit `height: 15`
    // and render at the browser default. sizes.11 needs no override: v3 already
    // has it at the same 2.75rem.
    15: {value: '3.75rem'},
    /**
     * v3 dropped the whole `container.*` namespace, and JaenPageLayout picks
     * between container.md and container.xl on every CMS page. An unresolvable
     * size is not an error in v3: `maxW` would receive the literal string
     * 'container.xl' and the layout would go full-bleed. v2's four values.
     */
    container: {
      sm: {value: '640px'},
      md: {value: '768px'},
      lg: {value: '1024px'},
      xl: {value: '1280px'}
    }
  },
  spacing: {
    // v3's scale steps 4 -> 5 with nothing between.
    4.5: {value: '1.125rem'}
  }
})

/**
 * v2's breakpoints, pinned.
 *
 * v3 moved `lg` from 62em (992px) to 1024px and switched the unit to px. The
 * other four are unchanged. Every responsive array in both repos was authored
 * against 992, so adopting v3's value would shift layouts at a width nobody
 * chose. The px spelling is v3's own; only the lg value is jaen's.
 */
export const breakpoints = {
  sm: '480px',
  md: '768px',
  lg: '992px',
  xl: '1280px',
  '2xl': '1536px'
}
