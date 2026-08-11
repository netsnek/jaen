/**
 * jaen's semantic layer, ported from the v2 `foundations/tokens.ts`.
 *
 * Two things changed shape, and both matter more than they look.
 *
 * NESTED, NOT DOTTED. v2 wrote every one of these as a flat string key
 * (`'bg.canvas'`). In v3 that is a different token: a dotted key is escaped into
 * its own variable (`--jaen-colors-bg\.subtle`) that sits BESIDE v3's built-in
 * `--jaen-colors-bg-subtle` instead of overriding it. Both would be emitted,
 * `token('colors.bg.subtle')` would return the escaped one, and recipes would
 * disagree about which they meant. Nesting is what makes these overrides.
 *
 * WHICH ONES ACTUALLY COLLIDE. Overriding is the intent, but v3's own Card,
 * Menu, Dialog, Alert and Table consume these names internally, so the blast
 * radius is wider than jaen's own components. Measured against v3.36.1, exactly
 * five differ in value: bg.subtle, bg.muted, fg.muted, fg.subtle, fg.inverted.
 * border.emphasized collides but agrees. bg.canvas, bg.surface, bg.translucent,
 * fg.emphasized and border.active are new names. And fg.default / border.default
 * do NOT collide, because v3 spells its fallback `DEFAULT` in capitals while a
 * lowercase `default` is an ordinary path segment.
 */
import {defineSemanticTokens} from '@chakra-ui/react'

export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      canvas: {value: {base: '{colors.gray.25}', _dark: '{colors.gray.950}'}},
      surface: {value: {base: '{colors.white}', _dark: '{colors.gray.900}'}},
      subtle: {value: {base: '{colors.gray.50}', _dark: '{colors.gray.800}'}},
      muted: {value: {base: '{colors.gray.100}', _dark: '{colors.gray.700}'}},
      translucent: {
        value: {
          base: 'rgba(255, 255, 255, 0.8)',
          _dark: 'rgba(26, 32, 44, 0.8)'
        }
      },
      accent: {
        default: {value: '{colors.brand.600}'},
        subtle: {value: '{colors.brand.500}'},
        muted: {value: '{colors.brand.400}'}
      }
    },

    fg: {
      default: {value: {base: '{colors.gray.900}', _dark: '{colors.white}'}},
      emphasized: {
        value: {base: '{colors.gray.700}', _dark: '{colors.gray.200}'}
      },
      muted: {value: {base: '{colors.gray.600}', _dark: '{colors.gray.300}'}},
      subtle: {value: {base: '{colors.gray.500}', _dark: '{colors.gray.400}'}},
      inverted: {value: {base: '{colors.white}', _dark: '{colors.gray.950}'}},
      accent: {
        default: {value: '{colors.white}'},
        subtle: {value: '{colors.brand.100}'},
        muted: {value: '{colors.brand.50}'}
      }
    },

    border: {
      default: {value: {base: '{colors.gray.200}', _dark: '{colors.gray.800}'}},
      emphasized: {
        value: {base: '{colors.gray.300}', _dark: '{colors.gray.700}'}
      },
      active: {value: {base: '{colors.gray.400}', _dark: '{colors.gray.600}'}}
    },

    accent: {value: {base: '{colors.brand.500}', _dark: '{colors.brand.200}'}},
    success: {value: {base: '{colors.green.500}', _dark: '{colors.green.200}'}},
    error: {value: {base: '{colors.red.500}', _dark: '{colors.red.200}'}},

    /**
     * v3's colorPalette contract. `colorPalette: 'brand'` rewrites every
     * `colorPalette.*` reference in a recipe to `brand.*`, but only for the
     * eight slots v3 defines: contrast, fg, subtle, muted, emphasized, solid,
     * focusRing, border. A palette missing one of them silently emits the
     * literal token path as a CSS value.
     *
     * solidHover and solidActive are jaen's own additions. v3's contract has no
     * slot one step past `solid`, and the CMS buttons need one.
     *
     * The brand scale itself comes from the consuming site through the shadow;
     * see ../index.ts.
     */
    brand: {
      solid: {value: {base: '{colors.brand.500}', _dark: '{colors.brand.200}'}},
      solidHover: {
        value: {base: '{colors.brand.600}', _dark: '{colors.brand.300}'}
      },
      solidActive: {
        value: {base: '{colors.brand.700}', _dark: '{colors.brand.400}'}
      },
      contrast: {value: {base: '{colors.white}', _dark: '{colors.gray.800}'}},
      fg: {value: {base: '{colors.brand.600}', _dark: '{colors.brand.200}'}},
      muted: {value: {base: '{colors.brand.100}', _dark: '{colors.brand.800}'}},
      subtle: {value: {base: '{colors.brand.50}', _dark: '{colors.brand.900}'}},
      emphasized: {
        value: {base: '{colors.brand.600}', _dark: '{colors.brand.300}'}
      },
      focusRing: {
        value: {base: '{colors.brand.500}', _dark: '{colors.brand.200}'}
      },
      border: {value: {base: '{colors.brand.500}', _dark: '{colors.brand.400}'}}
    }
  },

  shadows: {
    xs: {
      value: {
        base: '0px 0px 1px rgba(45, 55, 72, 0.05), 0px 1px 2px rgba(45, 55, 72,  0.1)',
        _dark:
          '0px 0px 1px rgba(13, 14, 20, 1), 0px 1px 2px rgba(13, 14, 20, 0.9)'
      }
    },
    sm: {
      value: {
        base: '0px 0px 1px rgba(45, 55, 72, 0.05), 0px 2px 4px rgba(45, 55, 72,  0.1)',
        _dark:
          '0px 0px 1px rgba(13, 14, 20, 1), 0px 2px 4px rgba(13, 14, 20, 0.9)'
      }
    },
    md: {
      value: {
        base: '0px 0px 1px rgba(45, 55, 72, 0.05), 0px 4px 8px rgba(45, 55, 72,  0.1)',
        _dark:
          '0px 0px 1px rgba(13, 14, 20, 1), 0px 4px 8px rgba(13, 14, 20, 0.9)'
      }
    },
    lg: {
      value: {
        base: '0px 0px 1px rgba(45, 55, 72, 0.05), 0px 8px 16px rgba(45, 55, 72,  0.1)',
        _dark:
          '0px 0px 1px rgba(13, 14, 20, 1), 0px 8px 16px rgba(13, 14, 20, 0.9)'
      }
    },
    xl: {
      value: {
        base: '0px 0px 1px rgba(45, 55, 72, 0.05), 0px 16px 24px rgba(45, 55, 72,  0.1)',
        _dark:
          '0px 0px 1px rgba(13, 14, 20, 1), 0px 16px 24px rgba(13, 14, 20, 0.9)'
      }
    },
    focus: {
      value: {base: '0 0 0 4px #EDF2F7', _dark: '0 0 0 4px #2D3748'}
    }
  }
})
