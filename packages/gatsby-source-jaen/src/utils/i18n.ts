/**
 * Locale path logic for localized page generation.
 *
 * The model follows the gatsby-plugin-i18n-l10n contract the earlier i18n
 * work targeted, implemented natively so jaen needs no external plugin:
 *
 * - Stateful pages (src/pages) fan out into one page per configured locale.
 *   The default locale keeps the bare path, every other locale gets its
 *   prefix (`/en/about/`). Each clone carries `locale`, `prefix`,
 *   `localePagesId` and `translations` in its context.
 * - Programmatic pages (createPages) are translated once. They keep their
 *   explicit context and may opt into path adjustment and translation links
 *   through the `basePath`, `adjustPath` and `referTranslations` context keys.
 */

export interface JaenLocaleOption {
  /** BCP-47 locale, e.g. `de-AT` or `en` */
  locale: string
  /** Path prefix. Defaults to the language part of `locale`. */
  prefix?: string
  /** Slug translations keyed by the untranslated path segment. */
  slugs?: Record<string, string>
  /**
   * Path prefixes never cloned for this locale (system pages etc).
   * An entry may be written in either form of a page's path: the canonical
   * (unprefixed, untranslated) path (`/nur-de`) or the localized (prefixed,
   * slug-translated) path (`/en/only-de`). Both match.
   */
  pageBlacklist?: string[]
}

export interface JaenI18nOptions {
  defaultLocale: string
  locales: JaenLocaleOption[]
  trailingSlash?: 'always' | 'never' | 'ignore'
}

export interface ResolvedLocale {
  locale: string
  prefix: string
  slugs: Record<string, string>
  pageBlacklist: string[]
  isDefault: boolean
}

export interface TranslatedPath {
  locale: string
  prefix: string
  path: string
}

export const resolveLocales = (options: JaenI18nOptions): ResolvedLocale[] => {
  return options.locales.map(locale => ({
    locale: locale.locale,
    prefix: locale.prefix ?? locale.locale.split('-')[0]!.toLowerCase(),
    slugs: locale.slugs ?? {},
    pageBlacklist: locale.pageBlacklist ?? [],
    isDefault: locale.locale === options.defaultLocale
  }))
}

export const handleTrailingSlash = (
  path: string,
  mode: JaenI18nOptions['trailingSlash'] = 'always'
): string => {
  if (path === '/') return path

  switch (mode) {
    case 'never':
      return path.replace(/\/+$/, '')
    case 'ignore':
      return path
    case 'always':
    default:
      return path.endsWith('/') ? path : `${path}/`
  }
}

/** Translate one path segment through a locale's slug table. */
const translateSegment = (
  segment: string,
  slugs: Record<string, string>
): string => slugs[segment] ?? segment

/**
 * Build the localized path for one locale: slug substitution per segment,
 * prefix for non-default locales, trailing slash policy applied.
 */
export const translatePagePath = (
  path: string,
  locale: ResolvedLocale,
  trailingSlash: JaenI18nOptions['trailingSlash'] = 'always'
): string => {
  const segments = path.split('/').filter(Boolean)
  const translated = segments.map(segment =>
    translateSegment(segment, locale.slugs)
  )

  const bare = `/${translated.join('/')}`
  const prefixed = locale.isDefault
    ? bare
    : `/${locale.prefix}${bare === '/' ? '' : bare}`

  return handleTrailingSlash(prefixed === '' ? '/' : prefixed, trailingSlash)
}

/**
 * All localized variants of a path, one entry per configured locale.
 */
export const translatePagePaths = (
  path: string,
  options: JaenI18nOptions
): TranslatedPath[] => {
  return resolveLocales(options).map(locale => ({
    locale: locale.locale,
    prefix: locale.prefix,
    path: translatePagePath(path, locale, options.trailingSlash)
  }))
}

/**
 * A locale-independent identity key linking sibling translations:
 * slashes become dots, a leading locale prefix is stripped, the root
 * becomes `index`.
 */
export const createLocalePagesId = (path: string, prefix?: string): string => {
  const trimmed = path.replace(/^\/+|\/+$/g, '')

  if (trimmed.length === 0) return 'index'

  const dotted = trimmed.replace(/\//g, '.')

  if (prefix && dotted === prefix) return 'index'
  if (prefix && dotted.startsWith(`${prefix}.`)) {
    return dotted.slice(prefix.length + 1)
  }

  return dotted
}

const PATH_PREFIX_PATTERN = /^\/([a-z]{2}(?:-[a-zA-Z]{2})?)(?=\/|$)/

/** Extract a locale prefix (`de`, `de-AT`) from a path, if present. */
export const parsePathPrefix = (path: string): string | undefined => {
  const match = PATH_PREFIX_PATTERN.exec(path)
  return match?.[1]
}

/** Find the configured locale a path prefix belongs to. */
export const localeForPrefix = (
  prefix: string | undefined,
  options: JaenI18nOptions
): ResolvedLocale | undefined => {
  if (!prefix) return undefined
  const lowered = prefix.toLowerCase()
  return resolveLocales(options).find(
    locale => locale.prefix.toLowerCase() === lowered
  )
}

/** The default locale's resolved entry. */
export const defaultLocale = (
  options: JaenI18nOptions
): ResolvedLocale | undefined =>
  resolveLocales(options).find(locale => locale.isDefault)

/** True when `path` starts with one of the blacklist prefixes. */
export const isPathBlacklisted = (
  path: string,
  locale: ResolvedLocale
): boolean => {
  const normalized = path.replace(/\/+$/, '') || '/'
  return locale.pageBlacklist.some(entry => {
    const prefix = entry.replace(/\/+$/, '') || '/'
    return normalized === prefix || normalized.startsWith(`${prefix}/`)
  })
}

/**
 * True when either form of a localized page's path is blacklisted for its
 * locale: the localized (prefixed, slug-translated) variant path or the
 * canonical (unprefixed, untranslated) origin path. Blacklist entries may
 * be written in either form — see `JaenLocaleOption.pageBlacklist`.
 */
export const isLocalizedPathBlacklisted = (
  canonicalPath: string,
  localizedPath: string,
  locale: ResolvedLocale
): boolean =>
  isPathBlacklisted(localizedPath, locale) ||
  isPathBlacklisted(canonicalPath, locale)
