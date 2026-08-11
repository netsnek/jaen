import {GatsbySSR} from 'gatsby'

import './dist/jaen.css'

export {wrapPageElement} from './src/gatsby/wrap-page-element'
export {wrapRootElement} from './src/gatsby/wrap-root-element'

/**
 * The no-flash script, hand-written because next-themes only ships a Next.js
 * one. It has to agree with next-themes' storage contract exactly, or the two
 * disagree for one paint: key `theme`, values light|dark|system, class on the
 * <html> element. The class is what v3's conditions select on
 * (`.dark, .dark .chakra-theme:not(.light)`), and `color-scheme` is what stops
 * the browser painting white scrollbars over a dark page.
 *
 * It moves from setPreBodyComponents to setHeadComponents so it runs before the
 * first paint rather than after the opening body tag.
 *
 * No suppressHydrationWarning is needed, unlike in Next.js: Gatsby renders
 * <html> from its own default-html.js and hydrates only #___gatsby, so React
 * never diffs the class this writes.
 */
const NO_FLASH = `(function(){try{
var d=document.documentElement,s=localStorage.getItem('theme')||'system',
m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light',
r=s==='system'?m:s;
d.classList.remove('light','dark');d.classList.add(r);d.style.colorScheme=r;
}catch(e){}})()`

interface I18nRenderOptions {
  siteUrl?: string
  i18n?: {
    defaultLocale: string
  }
}

interface LocalePageContext {
  locale?: string
  translations?: Array<{locale: string; path: string}>
}

export const onRenderBody: GatsbySSR['onRenderBody'] = (
  args,
  pluginOptions
) => {
  const {setHtmlAttributes, setHeadComponents, pathname} = args

  setHeadComponents([
    <script
      key="jaen-color-mode"
      dangerouslySetInnerHTML={{__html: NO_FLASH}}
    />
  ])

  // Localized pages: <html lang>, hreflang alternates and og:locale, built
  // from the locale context the page generator wrote. loadPageDataSync only
  // exists during build-html, hence the guard.
  const loadPageDataSync = (args as {loadPageDataSync?: (path: string) => any})
    .loadPageDataSync

  if (!loadPageDataSync || !pathname) return

  let pageContext: LocalePageContext | undefined

  try {
    pageContext = loadPageDataSync(pathname)?.result?.pageContext
  } catch {
    return
  }

  const locale = pageContext?.locale

  if (!locale) return

  setHtmlAttributes({lang: locale})

  const {siteUrl, i18n} = (pluginOptions ?? {}) as I18nRenderOptions
  const base = siteUrl?.replace(/\/+$/, '')

  if (!base) return

  const absolute = (path: string): string =>
    path === '/' ? `${base}/` : `${base}${path}`

  const translations = pageContext?.translations ?? []
  const variants = new Map<string, string>([[locale, pathname]])

  for (const translation of translations) {
    if (translation.locale && translation.path) {
      variants.set(translation.locale, translation.path)
    }
  }

  const headComponents = [
    <meta
      id="og-locale"
      property="og:locale"
      content={locale.replace('-', '_')}
      key="jaen-og-locale"
    />
  ]

  if (variants.size > 1) {
    for (const [variantLocale, variantPath] of Array.from(
      variants.entries()
    ).sort(([a], [b]) => a.localeCompare(b))) {
      headComponents.push(
        <link
          rel="alternate"
          hrefLang={variantLocale}
          href={absolute(variantPath)}
          key={`jaen-hreflang-${variantLocale}`}
        />
      )

      if (variantLocale !== locale) {
        headComponents.push(
          <meta
            property="og:locale:alternate"
            content={variantLocale.replace('-', '_')}
            key={`jaen-og-locale-alt-${variantLocale}`}
          />
        )
      }
    }

    const defaultPath = i18n?.defaultLocale
      ? variants.get(i18n.defaultLocale)
      : undefined

    if (defaultPath) {
      headComponents.push(
        <link
          rel="alternate"
          hrefLang="x-default"
          href={absolute(defaultPath)}
          key="jaen-hreflang-x-default"
        />
      )
    }
  }

  setHeadComponents(headComponents)
}
