/**
 * jaen's own half of the theme. The consuming site contributes only its brand
 * palette, which ../index.ts reads off the shadowed system.
 *
 * Two settings here are load-bearing and neither is obvious.
 *
 * cssVarsPrefix: 'jaen'
 *   v2 scoped the CMS variables with `cssVarsRoot="#coco"`. That cannot be
 *   carried forward: in v3 only the `base` bucket honours cssVarsRoot, while
 *   `_dark` always lands on the raw condition selector `.dark, .dark
 *   .chakra-theme:not(.light)`. Since `.dark` sits on <html> and the scoped root
 *   is a descendant, the scoped block wins and dark mode dies inside the CMS.
 *   Two systems with different variable prefixes cannot collide whatever
 *   selector they land on, which is the same isolation without the trap. The
 *   site keeps the `chakra` prefix because roughly forty of its strings hard-code
 *   var(--chakra-colors-brand-500), including every locale catalogue.
 *
 * disableLayers: true
 *   gatsby-browser and gatsby-ssr both import dist/jaen.css, which still carries
 *   Tailwind's UNLAYERED preflight: h1..h6 {font-size: inherit}, a {color:
 *   inherit}, ol,ul {list-style: none}. An unlayered normal declaration beats
 *   every cascade layer regardless of specificity, so with layers on, every
 *   Heading and Link in both repos would flatten. This can be removed once the
 *   Tailwind bundle is gone. It does not weaken the style-prop-over-recipe
 *   guarantee: those are merged in JS before serialisation, so their precedence
 *   never came from the cascade.
 */
import {defineConfig} from '@chakra-ui/react'

import {globalCss} from './foundations/global-css'
import {semanticTokens} from './foundations/semantic-tokens'
import {textStyles} from './foundations/text-styles'
import {breakpoints, tokens} from './foundations/tokens'
import {buttonRecipe} from './recipes/button'
import {
  badgeRecipe,
  containerRecipe,
  headingRecipe,
  inputAddonRecipe,
  inputRecipe,
  linkRecipe,
  textareaRecipe
} from './recipes'
import {
  cardSlotRecipe,
  checkboxSlotRecipe,
  drawerSlotRecipe,
  fieldSlotRecipe,
  menuSlotRecipe,
  progressSlotRecipe,
  tableSlotRecipe,
  tabsSlotRecipe
} from './slot-recipes'

export const jaenConfig = defineConfig({
  cssVarsPrefix: 'jaen',
  disableLayers: true,
  // jaen's provider is mounted on every route, CMS and site alike, so it is the
  // one that owns the reset. The site's system sets preflight: false.
  preflight: true,
  globalCss,
  theme: {
    breakpoints,
    tokens,
    semanticTokens,
    textStyles,
    recipes: {
      badge: badgeRecipe,
      button: buttonRecipe,
      container: containerRecipe,
      heading: headingRecipe,
      input: inputRecipe,
      inputAddon: inputAddonRecipe,
      link: linkRecipe,
      textarea: textareaRecipe
    },
    slotRecipes: {
      card: cardSlotRecipe,
      checkbox: checkboxSlotRecipe,
      drawer: drawerSlotRecipe,
      field: fieldSlotRecipe,
      menu: menuSlotRecipe,
      progress: progressSlotRecipe,
      table: tableSlotRecipe,
      tabs: tabsSlotRecipe
    }
  }
})
