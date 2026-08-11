/**
 * Emits everything 08-theme.ipynb asserts on, as one JSON object on stdout.
 *
 * The notebook is the test; this is only the probe. It has to be TypeScript
 * because the thing under test is a Chakra system, which only exists once its
 * TypeScript config has been evaluated. Nothing here decides anything: it
 * measures, prints, and lets the notebook judge.
 *
 *   node -r ts-node/register/transpile-only tests/support/dump-theme-facts.ts
 *
 * Run from the monorepo root, so that `@chakra-ui/react` resolves to the
 * installed v3 and the relative import below finds the plugin.
 */
const {system} = require('../../packages/gatsby-plugin-jaen/src/theme')

const tokenOf = (path: string) => {
  try {
    const v = system.token(path)
    return v === undefined ? null : String(v)
  } catch {
    return null
  }
}

const recipeVariants = (name: string, axis: string) => {
  try {
    return Object.keys(system.getRecipe(name)?.variants?.[axis] ?? {})
  } catch {
    return []
  }
}

const slotRecipeVariants = (name: string, axis: string) => {
  try {
    return Object.keys(system.getSlotRecipe(name)?.variants?.[axis] ?? {})
  } catch {
    return []
  }
}

const globalCssText = JSON.stringify(system._global)

const facts = {
  config: {
    cssVarsPrefix: system._config.cssVarsPrefix ?? null,
    disableLayers: system._config.disableLayers ?? null,
    preflight: system._config.preflight ?? null,
    breakpoints: system._config.theme?.breakpoints ?? null
  },

  // Values a call site can reach. null means the path does not resolve, which
  // in v3 means the literal path string reaches the CSS as a value.
  tokens: Object.fromEntries(
    [
      'colors.gray.25',
      'colors.gray.50',
      'colors.gray.950',
      'sizes.11',
      'sizes.15',
      'spacing.4.5',
      'fontSizes.2xs',
      'fontSizes.3xs',
      'fonts.heading',
      'fonts.body',
      'colors.bg.canvas',
      'colors.bg.surface',
      'colors.bg.subtle',
      'colors.bg.muted',
      'colors.bg.translucent',
      'colors.bg.accent.default',
      'colors.bg.accent.subtle',
      'colors.bg.accent.muted',
      'colors.fg.default',
      'colors.fg.emphasized',
      'colors.fg.muted',
      'colors.fg.subtle',
      'colors.fg.inverted',
      'colors.fg.accent.default',
      'colors.fg.accent.subtle',
      'colors.fg.accent.muted',
      'colors.border.default',
      'colors.border.emphasized',
      'colors.border.active',
      'colors.accent',
      'colors.success',
      'colors.error',
      'colors.brand.solid',
      'colors.brand.solidHover',
      'colors.brand.solidActive',
      'colors.brand.contrast',
      'colors.brand.fg',
      'colors.brand.muted',
      'colors.brand.subtle',
      'colors.brand.emphasized',
      'colors.brand.focusRing',
      'colors.brand.border',
      'shadows.xs',
      'shadows.focus'
    ].map(p => [p, tokenOf(p)])
  ),

  recipes: {
    button: {
      variant: recipeVariants('button', 'variant'),
      size: recipeVariants('button', 'size')
    },
    heading: {
      size: recipeVariants('heading', 'size'),
      // the size axis changed meaning in v3, so the resolved values matter
      resolved: (system.getRecipe('heading')?.variants?.size ?? {}) as Record<
        string,
        unknown
      >
    },
    link: {variant: recipeVariants('link', 'variant')},
    input: {
      variant: recipeVariants('input', 'variant'),
      size: recipeVariants('input', 'size')
    },
    textarea: {variant: recipeVariants('textarea', 'variant')},
    badge: {size: recipeVariants('badge', 'size')}
  },

  slotRecipes: {
    card: {
      variant: slotRecipeVariants('card', 'variant'),
      size: slotRecipeVariants('card', 'size')
    },
    checkbox: {size: slotRecipeVariants('checkbox', 'size')},
    table: {
      variant: slotRecipeVariants('table', 'variant'),
      striped: slotRecipeVariants('table', 'striped')
    },
    drawer: {},
    menu: {},
    field: {},
    progress: {},
    tabs: {}
  },

  // Every custom property the system emits, so the notebook can diff the name
  // set and prove nothing leaked into the other system's namespace.
  emittedVars: {
    jaen: [...new Set(globalCssText.match(/--jaen-[a-z0-9-]+/g) ?? [])].sort(),
    chakra: [
      ...new Set(globalCssText.match(/--chakra-[a-z0-9-]+/g) ?? [])
    ].sort()
  },

  // A handful of resolutions that only show up once css() has run.
  css: {
    colorPaletteSolid: system.css({
      colorPalette: 'brand',
      bg: 'colorPalette.solid'
    }),
    opacitySuffix: system.css({bg: 'brand.400/50'}),
    unresolvable: system.css({bgColor: 'components.nope.missing'})
  }
}

process.stdout.write(JSON.stringify(facts, null, 2))
