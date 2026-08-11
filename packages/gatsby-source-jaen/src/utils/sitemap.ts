/**
 * Pure sitemap/robots builders. No Gatsby, no filesystem — the onPostBuild
 * glue feeds pages in and writes the returned strings out, which keeps this
 * logic independently testable.
 *
 * The XML carries `xhtml:link rel="alternate" hreflang` entries per
 * translation plus `x-default` pointing at the default locale's variant,
 * mirroring how the page generator writes `locale`/`translations` context.
 * changefreq/priority are deliberately not emitted: they would either be
 * guesses or depend on build time, and crawlers ignore them anyway. lastmod
 * is only emitted when a real modification date is known.
 */

export interface SitemapTranslation {
  locale: string
  path: string
}

export interface SitemapPage {
  path: string
  /** ISO-8601 date of the last real content modification, if known. */
  lastmod?: string
  /** The page's own locale, when localized page generation ran. */
  locale?: string
  /** Sibling variants of this page in other locales. */
  translations?: SitemapTranslation[]
}

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const absoluteUrl = (siteUrl: string, path: string): string => {
  const base = siteUrl.replace(/\/+$/, '')

  if (path === '/') return `${base}/`

  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

interface AlternateLink {
  hreflang: string
  href: string
}

const buildAlternates = (
  page: SitemapPage,
  siteUrl: string,
  defaultLocaleName?: string
): AlternateLink[] => {
  if (!page.locale) return []

  const variants = new Map<string, string>()
  variants.set(page.locale, page.path)

  for (const translation of page.translations ?? []) {
    if (translation.locale && translation.path) {
      variants.set(translation.locale, translation.path)
    }
  }

  // A single-variant page carries no useful alternate information.
  if (variants.size < 2) return []

  const links: AlternateLink[] = Array.from(variants.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([locale, path]) => ({
      hreflang: locale,
      href: absoluteUrl(siteUrl, path)
    }))

  const defaultPath = defaultLocaleName
    ? variants.get(defaultLocaleName)
    : undefined

  if (defaultPath) {
    links.push({
      hreflang: 'x-default',
      href: absoluteUrl(siteUrl, defaultPath)
    })
  }

  return links
}

const renderUrlEntry = (
  page: SitemapPage,
  siteUrl: string,
  defaultLocaleName?: string
): string => {
  const lines = [
    '  <url>',
    `    <loc>${escapeXml(absoluteUrl(siteUrl, page.path))}</loc>`
  ]

  if (page.lastmod) {
    lines.push(`    <lastmod>${escapeXml(page.lastmod)}</lastmod>`)
  }

  for (const link of buildAlternates(page, siteUrl, defaultLocaleName)) {
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="${escapeXml(
        link.hreflang
      )}" href="${escapeXml(link.href)}"/>`
    )
  }

  lines.push('  </url>')

  return lines.join('\n')
}

export const buildSitemapXml = (
  pages: SitemapPage[],
  siteUrl: string,
  defaultLocaleName?: string
): string => {
  const sorted = [...pages].sort((a, b) => a.path.localeCompare(b.path))

  const urlEntries = sorted
    .map(page => renderUrlEntry(page, siteUrl, defaultLocaleName))
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urlEntries,
    '</urlset>',
    ''
  ].join('\n')
}

export const buildRobotsTxt = (siteUrl: string): string =>
  [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${absoluteUrl(siteUrl, '/sitemap.xml')}`,
    ''
  ].join('\n')
