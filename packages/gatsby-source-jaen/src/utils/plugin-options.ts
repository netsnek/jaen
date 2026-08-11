import {PluginOptions} from 'gatsby'

import type {JaenI18nOptions} from './i18n'

/**
 * Options of gatsby-source-jaen. Both are usually forwarded by
 * gatsby-plugin-jaen's gatsby-config rather than set by the site directly.
 */
export interface JaenSourceOptions extends PluginOptions {
  /** Localized page generation. Absent = single-locale site, no fan-out. */
  i18n?: JaenI18nOptions
  /** Absolute site origin, used by the sitemap and hreflang emission. */
  siteUrl?: string
}

/** Narrow raw plugin options to the i18n config, if one was provided. */
export const i18nFromPluginOptions = (
  pluginOptions: unknown
): JaenI18nOptions | undefined => {
  const options = pluginOptions as Partial<JaenSourceOptions> | undefined
  const i18n = options?.i18n

  if (!i18n || !i18n.defaultLocale || !Array.isArray(i18n.locales)) {
    return undefined
  }

  return i18n
}

/** The site origin from plugin options or environment, normalized. */
export const siteUrlFromPluginOptions = (
  pluginOptions: unknown
): string | undefined => {
  const options = pluginOptions as Partial<JaenSourceOptions> | undefined
  const raw =
    options?.siteUrl ||
    process.env.GATSBY_SITE_URL ||
    process.env.SITE_URL ||
    undefined

  return raw?.replace(/\/+$/, '')
}
