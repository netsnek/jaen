import {promises as fs} from 'fs'
import path from 'path'

import {BuildArgs} from 'gatsby'

import {shouldExcludeFromSitemap} from '../utils/path-filters'
import {
  buildRobotsTxt,
  buildSitemapXml,
  SitemapPage,
  SitemapTranslation
} from '../utils/sitemap'
import type {JaenI18nOptions} from '../utils/i18n'

interface PageContextShape {
  jaenPageId?: string
  locale?: string
  translations?: SitemapTranslation[]
}

/**
 * Emit `public/sitemap.xml` and `public/robots.txt` once, after the build.
 *
 * The final page set is read straight from Gatsby's store — every delete/
 * recreate the page generator performed has already settled, so there is no
 * tracking state to keep in sync and nothing survives between builds.
 * lastmod comes from the page's JaenPage node (`modifiedAt`), the only real
 * modification date jaen has. A site-provided static robots.txt wins.
 */
export const onPostBuild = async (
  {store, getNode, graphql, reporter}: BuildArgs,
  options: {siteUrl?: string; i18n?: JaenI18nOptions}
) => {
  let siteUrl = options.siteUrl

  if (!siteUrl) {
    const result = await graphql<{
      jaenSite: {siteMetadata: {siteUrl: string | null} | null} | null
    }>(`
      query {
        jaenSite {
          siteMetadata {
            siteUrl
          }
        }
      }
    `)

    siteUrl = result.data?.jaenSite?.siteMetadata?.siteUrl ?? undefined
  }

  siteUrl = siteUrl?.replace(/\/+$/, '')

  if (!siteUrl) {
    reporter.warn(
      '[gatsby-source-jaen] No siteUrl configured (plugin option, ' +
        'GATSBY_SITE_URL or jaen site metadata) — skipping sitemap.xml ' +
        'and robots.txt generation.'
    )
    return
  }

  const pages: SitemapPage[] = []

  // Array.from, not a bare for..of over the Map iterator: the package
  // compiles to ES5 without downlevelIteration, where the iterator loop
  // silently never runs (an always-empty sitemap).
  for (const page of Array.from(store.getState().pages.values())) {
    if (shouldExcludeFromSitemap(page.path)) continue

    const context = (page.context ?? {}) as PageContextShape

    let lastmod: string | undefined

    if (context.jaenPageId) {
      const jaenPageNode = getNode(context.jaenPageId) as
        | {modifiedAt?: string}
        | undefined

      lastmod = jaenPageNode?.modifiedAt
    }

    pages.push({
      path: page.path,
      lastmod,
      locale: context.locale,
      translations: Array.isArray(context.translations)
        ? context.translations
        : undefined
    })
  }

  const programDirectory = store.getState().program.directory
  const publicDirectory = path.join(programDirectory, 'public')

  await fs.mkdir(publicDirectory, {recursive: true})

  const sitemapXml = buildSitemapXml(
    pages,
    siteUrl,
    options.i18n?.defaultLocale
  )
  await fs.writeFile(
    path.join(publicDirectory, 'sitemap.xml'),
    sitemapXml,
    'utf8'
  )

  // A robots.txt the site ships in static/ has already been copied into
  // public/ at this point; never overwrite it.
  const robotsPath = path.join(publicDirectory, 'robots.txt')
  const robotsExists = await fs
    .access(robotsPath)
    .then(() => true)
    .catch(() => false)

  if (!robotsExists) {
    await fs.writeFile(robotsPath, buildRobotsTxt(siteUrl), 'utf8')
  }

  reporter.info(
    `[gatsby-source-jaen] sitemap.xml written (${pages.length} pages)` +
      (robotsExists ? ', robots.txt kept from static/' : ', robots.txt written')
  )
}
