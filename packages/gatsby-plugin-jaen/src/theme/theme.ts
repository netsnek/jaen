/**
 * THE SHADOW POINT.
 *
 * A consuming Gatsby site overrides this file at
 * `src/gatsby-plugin-jaen/theme/theme.ts` to hand jaen its brand palette. The
 * path must not change: if jaen imported some other name, a site's stale shadow
 * would simply orphan itself, jaen would fall back to this default, and the
 * brand would silently revert to pink. Keeping the path is what turns a
 * forgotten migration into a build failure instead of a wrong colour.
 *
 * What a shadow must export changed in v3. It is no longer a theme object but a
 * SystemContext from createSystem(), and ../index.ts asserts that with
 * isValidSystem before using it. The reason is that a config-shaped contract
 * cannot fail loudly: mergeConfigs is a permissive deep merge, so a leftover v2
 * extendTheme() result has every key at the wrong nesting level, gets dropped
 * without a word, and the site ships 95% correct.
 *
 * Only `theme.tokens.colors.brand` is read. Everything else a site puts in its
 * own system stays in its own system.
 */
import {createSystem, defaultConfig, defineConfig} from '@chakra-ui/react'

export default createSystem(
  defaultConfig,
  defineConfig({
    theme: {
      tokens: {
        colors: {
          // jaen's own default. References rather than copies, so the scale
          // stays whatever v3 ships.
          brand: {
            50: {value: '{colors.pink.50}'},
            100: {value: '{colors.pink.100}'},
            200: {value: '{colors.pink.200}'},
            300: {value: '{colors.pink.300}'},
            400: {value: '{colors.pink.400}'},
            500: {value: '{colors.pink.500}'},
            600: {value: '{colors.pink.600}'},
            700: {value: '{colors.pink.700}'},
            800: {value: '{colors.pink.800}'},
            900: {value: '{colors.pink.900}'},
            950: {value: '{colors.pink.950}'}
          }
        }
      }
    }
  })
)
