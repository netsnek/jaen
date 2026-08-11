/**
 * Composes jaen's system: v3's defaults, jaen's own config, and the brand
 * palette the consuming site hands over through the shadow at ./theme.
 *
 * v2 did this by mutating a shared object (`jaenTheme.colors.brand =
 * userTheme.colors.brand`). Reading a public field off a validated system is
 * the same idea without the mutation, and it can say what went wrong.
 */
import {
  createSystem,
  defaultConfig,
  defineConfig,
  isValidSystem
} from '@chakra-ui/react'

import {jaenConfig} from './jaen-system'
import userSystem from './theme'

/**
 * The failure this guards against is silent by nature. A v2 `extendTheme()`
 * result is a plain object with `colors` at the top level, where v3 wants
 * `theme.tokens.colors`. mergeConfigs would deep-merge it, find nothing it
 * recognises, drop it all, and build a site that is entirely correct except
 * that every brand-coloured thing is pink.
 *
 * isValidSystem is Chakra's own discriminator: it checks for the `$$chakra`
 * marker that only createSystem() sets.
 */
if (!isValidSystem(userSystem)) {
  throw new Error(
    '[gatsby-plugin-jaen] src/gatsby-plugin-jaen/theme/theme.ts must ' +
      'default-export a Chakra v3 SystemContext created with createSystem(), ' +
      'not a v2 theme object. Replace `export default extendTheme(...)` with ' +
      '`export default createSystem(...)`.'
  )
}

const userTheme = userSystem._config.theme ?? {}
const brand = userTheme.tokens?.colors?.brand

if (!brand) {
  throw new Error(
    '[gatsby-plugin-jaen] the system exported from ' +
      'src/gatsby-plugin-jaen/theme/theme.ts defines no ' +
      'theme.tokens.colors.brand. The CMS chrome is coloured from it.'
  )
}

export const system = createSystem(
  defaultConfig,
  jaenConfig,
  defineConfig({
    theme: {
      tokens: {colors: {brand}},
      semanticTokens: {
        colors: {brand: userTheme.semanticTokens?.colors?.brand ?? {}}
      }
    }
  })
)
