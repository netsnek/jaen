/**
 * The one place the colour mode is read from.
 *
 * v3 has no colour mode of its own; it delegates to next-themes, which knows
 * nothing about Chakra. This module keeps the four v2 names alive on top of it,
 * so the swap cost one file instead of the forty-odd call sites across jaen,
 * netsnek.com and the example site.
 *
 * Import from `jaen`, not from `@chakra-ui/react` or `next-themes` directly, in
 * the packages and in the sites alike. The colour mode belongs to the provider
 * that gatsby-plugin-jaen mounts, so it is jaen's to hand out.
 *
 * What this fixes on the way past: nothing synced before. gatsby-ssr rendered
 * <ColorModeScript initialColorMode={theme.config.initialColorMode}/>, jaen's
 * theme set no config, so the emitted script's mode was the literal "light".
 * The site's own initialColorMode:'system' was read by v2's ColorModeProvider,
 * and the only provider in the tree was jaen's, so the site's setting never
 * applied. Its own source says as much: `//? This doesnt sync`.
 */
import {Theme} from '@chakra-ui/react'
import {useTheme} from 'next-themes'
import {useCallback, type ReactNode} from 'react'

/** v3 exports neither of these; they described a v2 concept. */
export type ColorMode = 'light' | 'dark'
export type ColorModeWithSystem = ColorMode | 'system'

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (mode: ColorModeWithSystem) => void
  toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
  const {resolvedTheme, setTheme, forcedTheme} = useTheme()

  // resolvedTheme is undefined until next-themes has read storage on the
  // client, which is exactly the first render SSR produces. Light is the same
  // assumption the no-flash script makes, so the two agree.
  const colorMode = (forcedTheme ?? resolvedTheme ?? 'light') as ColorMode

  const toggleColorMode = useCallback(() => {
    setTheme(colorMode === 'dark' ? 'light' : 'dark')
  }, [colorMode, setTheme])

  return {colorMode, setColorMode: setTheme, toggleColorMode}
}

export function useColorModeValue<L, D>(light: L, dark: D): L | D {
  return useColorMode().colorMode === 'dark' ? dark : light
}

/**
 * v2's DarkMode and LightMode were context-only and rendered no DOM. v3 has no
 * colour-mode context at all, its conditions are plain class selectors, so an
 * element is unavoidable: <Theme> emits `class="chakra-theme dark"` and
 * re-declares the token block for the subtree.
 *
 * `display: contents` keeps the new element out of layout, which matters at the
 * two call sites that wrap a flex child (TopNav's search control and
 * ThemeChooser's menu list). `hasBackground={false}` stops it painting a
 * surface v2 never painted.
 */
export const DarkMode = ({children}: {children: ReactNode}) => (
  <Theme appearance="dark" hasBackground={false} display="contents">
    {children}
  </Theme>
)

export const LightMode = ({children}: {children: ReactNode}) => (
  <Theme appearance="light" hasBackground={false} display="contents">
    {children}
  </Theme>
)
