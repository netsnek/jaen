/**
 * jaen's global styles, ported from the v2 `foundations/styles.ts`.
 *
 * Two changes beyond the shape:
 *
 * `transparentize('brand.400', 0.5)(theme)` is gone. It was the reason this file
 * had to be a function of the theme at all. v3 spells the same thing as a token
 * suffix, `brand.400/50`, which emits `color-mix(in srgb, ... 50%, transparent)`
 * and needs no access to the theme object.
 *
 * The `#__next, #root` rule is dropped. Those are Next.js and CRA root ids;
 * Gatsby's is `#___gatsby`. The selector has never matched anything in this
 * repo, so porting it would only have carried the mistake forward.
 */
import {defineGlobalStyles} from '@chakra-ui/react'

export const globalCss = defineGlobalStyles({
  body: {
    color: 'fg.default',
    bg: 'bg.canvas'
  },
  '*::placeholder': {
    opacity: 1,
    color: 'fg.muted'
  },
  // v2 wrote `&::after` here, which inside a global block is not the same
  // selector as `*::after`; the third of the three never applied.
  '*, *::before, *::after': {
    borderColor: 'border.default'
  },
  'html, body': {
    height: '100%'
  },
  '.jaen-highlight-frame': {
    borderRadius: '11px',
    pointerEvents: 'none',
    zIndex: 1
  },
  '.jaen-highlight-frame::before': {
    content: '""',
    position: 'absolute',
    // border 2px + offset 4px, on every side
    top: '-6px',
    right: '-6px',
    bottom: '-6px',
    left: '-6px',
    border: '2px solid',
    borderColor: 'brand.400/50',
    // the frame's 11px plus the same 4px offset
    borderRadius: '15px',
    pointerEvents: 'none'
  }
})
