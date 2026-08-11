/**
 * Path classification shared by localized page generation and the sitemap.
 *
 * Jaen ships system routes (CMS, auth, settings, emailwerk...) that must
 * neither be cloned per locale nor appear in the sitemap.
 */

/** Route segments owned by jaen system pages. */
export const SYSTEM_SEGMENTS = [
  'cms',
  'login',
  'logout',
  'signup',
  'password_reset',
  'settings',
  'emailwerk',
  'app',
  'resources'
] as const

const BUILD_ARTIFACT_PREFIXES = [
  '/dev-404-page',
  '/404',
  '/404.html',
  '/500',
  '/offline-plugin-app-shell-fallback',
  '/__'
] as const

const SYSTEM_SEGMENT_SET = new Set<string>(SYSTEM_SEGMENTS)

const LOCALE_PREFIX_PATTERN = /^\/[a-z]{2}(?:-[a-zA-Z]{2})?(?=\/|$)/

/** Trim trailing slashes, guarantee a leading one. `/` stays `/`. */
export const normalizePath = (rawPath: string): string => {
  const trimmed = rawPath.trim()

  if (trimmed.length === 0 || trimmed === '/') return '/'

  const withoutTrailing = trimmed.replace(/\/+$/, '')
  return withoutTrailing.startsWith('/')
    ? withoutTrailing
    : `/${withoutTrailing}`
}

const firstSegment = (path: string): string =>
  path.split('/').filter(Boolean)[0]?.toLowerCase() ?? ''

/** True for jaen system routes (`/cms/...`, `/login`, ...). */
export const isSystemPath = (path: string): boolean =>
  SYSTEM_SEGMENT_SET.has(firstSegment(normalizePath(path)))

/**
 * True for a locale-prefixed clone of a system route (`/de/cms`, `/en/login`).
 * These are deleted outright: system pages exist exactly once, unlocalized
 * in the URL space (their UI language follows the account, not the URL).
 */
export const isLocalizedSystemPath = (path: string): boolean => {
  const normalized = normalizePath(path)
  const match = LOCALE_PREFIX_PATTERN.exec(normalized)

  if (!match) return false

  const rest = normalized.slice(match[0].length)
  return SYSTEM_SEGMENT_SET.has(firstSegment(rest))
}

const hasDynamicMarker = (path: string): boolean =>
  path.includes('[') || path.includes(']')

/**
 * True when a path has no business in the sitemap: build artifacts,
 * system routes (localized or not) and dynamic `[param]` routes.
 */
export const shouldExcludeFromSitemap = (path: string): boolean => {
  const normalized = normalizePath(path)

  if (
    BUILD_ARTIFACT_PREFIXES.some(
      prefix => normalized === prefix || normalized.startsWith(`${prefix}/`)
    )
  ) {
    return true
  }

  if (hasDynamicMarker(normalized)) return true

  if (isSystemPath(normalized) || isLocalizedSystemPath(normalized)) {
    return true
  }

  const segments = normalized.split('/').filter(Boolean)
  return segments.some(segment =>
    ['404', '404.html', '500'].includes(segment.toLowerCase())
  )
}
