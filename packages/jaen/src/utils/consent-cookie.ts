/**
 * The `cc_cookie` contract, reimplemented without vanilla-cookieconsent.
 *
 * The banner's first layer is a React component now (see
 * contexts/cookie-consent.tsx) and paints out of the static HTML, so accepting
 * or rejecting has to write the exact cookie the plugin would have written.
 * The plugin is loaded later, or never, and whatever it eventually reads it
 * has to recognise: it treats a stored consent as valid only if
 * `consent_uuid`, `consent_date` and `last_consent_update` are all there, and
 * one missing field re-prompts every visitor who has already answered.
 *
 * Everything below is taken from vanilla-cookieconsent 2.9.2's
 * dist/cookieconsent.js, not from its README.
 */

/** The plugin's default, which the config in cookie-consent.tsx never overrides. */
const CONSENT_COOKIE_NAME = 'cc_cookie'
const CONSENT_COOKIE_EXPIRATION_DAYS = 182
const CONSENT_COOKIE_PATH = '/'
const CONSENT_COOKIE_SAME_SITE = 'Lax'

/**
 * The plugin only compares revisions when `revision` is passed to `run()`,
 * which it is not, so it accepts any stored value. It still writes its own
 * default into every cookie, hence 0 here and in the pre-paint script that
 * gatsby-plugin-jaen injects.
 */
const CONSENT_REVISION = 0

/** Always on, and forced into every stored consent, readonly in the settings modal. */
export const NECESSARY_CATEGORY = 'necessary'

/** The only category anything reads: Google Analytics and the Maps embed. */
export const ANALYTICS_CATEGORY = 'analytics'

/** Declared by the settings modal. Nothing reads it, but accept_all granted it. */
export const TARGETING_CATEGORY = 'targeting'

/**
 * What the first layer decides over.
 *
 * `targeting` is in the list although nothing in jaen or in the sites reads it.
 * It is there because v2's primary button carried the plugin role `accept_all`,
 * which grants every category the settings modal declares, and this layer has
 * to store what that button stored. Leaving it out would make the two layers
 * disagree about what "Accept all" means: a visitor who accepted everything
 * here would open the settings and find one switch off.
 */
export const CONSENT_CATEGORIES = [
  NECESSARY_CATEGORY,
  ANALYTICS_CATEGORY,
  TARGETING_CATEGORY
]

/** Categories the visitor cannot switch off; the plugin re-adds these on every accept. */
const READONLY_CATEGORIES = [NECESSARY_CATEGORY]

/**
 * A v4 uuid, in the plugin's shape.
 *
 * The plugin builds one from `crypto.getRandomValues`; `crypto.randomUUID`
 * does the same in one call but exists only in a secure context, so an http
 * origin still needs the arithmetic.
 */
const createConsentUuid = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
    const random = Math.floor(Math.random() * 16)

    return (character === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}

/**
 * The stored consent, or null when there is none that parses.
 *
 * Both encodings have to be read. The plugin writes the JSON unencoded
 * (`use_rfc_cookie` is false) while this module percent-encodes it, so every
 * visitor who consented before this change carries the raw form. The order of
 * the two attempts is the plugin's own.
 */
export const readConsentCookie = (): SavedCookieContent | null => {
  if (typeof document === 'undefined') return null

  const match = document.cookie.match(
    `(^|;)\\s*${CONSENT_COOKIE_NAME}\\s*=\\s*([^;]+)`
  )

  const raw = match?.[2]

  if (!raw) return null

  try {
    return JSON.parse(raw) as SavedCookieContent
  } catch {
    try {
      return JSON.parse(decodeURIComponent(raw)) as SavedCookieContent
    } catch {
      return null
    }
  }
}

/**
 * Whether a stored consent is one the plugin would honour.
 *
 * The three timestamp/id fields are the plugin's own test. A cookie from
 * before `revision` existed has none, which counts as the default rather than
 * as a mismatch, because the plugin ignores the field entirely here.
 */
export const isConsentValid = (
  cookie: SavedCookieContent | null
): cookie is SavedCookieContent => {
  if (!cookie) return false

  const revision =
    typeof cookie.revision === 'number' ? cookie.revision : CONSENT_REVISION

  return (
    revision === CONSENT_REVISION &&
    Boolean(cookie.consent_uuid) &&
    Boolean(cookie.consent_date) &&
    Boolean(cookie.last_consent_update)
  )
}

/** Whether the visitor has answered the banner. */
export const hasValidConsent = (): boolean =>
  isConsentValid(readConsentCookie())

/**
 * The categories the visitor allows, empty while there is no valid consent.
 *
 * The plugin reads `categories` out of whatever the cookie holds without
 * validating it first, which would let a half-written cookie allow a category
 * while the banner is still asking. Gating on the same test the banner uses
 * keeps the two answers in step: nothing is allowed for as long as the banner
 * is up.
 */
export const readAllowedCategories = (): string[] => {
  const cookie = readConsentCookie()

  return isConsentValid(cookie) ? (cookie.categories ?? []) : []
}

/**
 * Resolve the plugin's `accept(categories, exclusions)` arguments the way it
 * does: 'all' or a single name or a list, minus the exclusions, plus the
 * readonly categories which are never optional. Passing nothing means "take
 * the settings modal's toggles", and with no modal in the document the stored
 * consent is the closest equivalent.
 */
export const resolveAcceptedCategories = (
  categories?: string | string[],
  exclusions?: string[]
): string[] => {
  let accepted: string[]

  if (typeof categories === 'string') {
    accepted =
      categories === 'all'
        ? [...CONSENT_CATEGORIES]
        : CONSENT_CATEGORIES.includes(categories)
          ? [categories]
          : []
  } else if (Array.isArray(categories)) {
    accepted = categories.filter(category =>
      CONSENT_CATEGORIES.includes(category)
    )
  } else {
    accepted = readAllowedCategories()
  }

  if (exclusions && exclusions.length > 0) {
    accepted = accepted.filter(category => !exclusions.includes(category))
  }

  for (const category of READONLY_CATEGORIES) {
    if (!accepted.includes(category)) accepted.push(category)
  }

  return accepted
}

const writeCookie = (value: string): void => {
  const expires = new Date(
    Date.now() + CONSENT_COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
  )

  let cookie =
    `${CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}` +
    `; expires=${expires.toUTCString()}` +
    `; Path=${CONSENT_COOKIE_PATH};`

  cookie += ` SameSite=${CONSENT_COOKIE_SAME_SITE};`

  // The plugin sets Domain to location.hostname for any host that is not a
  // single label. A cookie written with a Domain is a different cookie from
  // one written without: leave this out and the two writers end up with two
  // cc_cookies, of which document.cookie hands back whichever the browser
  // happens to list first.
  if (location.hostname.indexOf('.') > -1) {
    cookie += ` Domain=${location.hostname};`
  }

  if (location.protocol === 'https:') cookie += ' Secure;'

  document.cookie = cookie
}

/**
 * Store a consent and hand back what was stored.
 *
 * `level` is the pre-2.6 name for `categories` and the plugin still writes
 * both, `data` survives a change untouched, and a returning visitor keeps the
 * date of their first consent while only `last_consent_update` moves.
 *
 * `rfc_cookie` records the plugin's `use_rfc_cookie` setting, which is false,
 * and stays false even though the value is percent-encoded here: the plugin
 * rewrites the cookie when the flag disagrees with its config, and its reader
 * decodes either form anyway.
 */
export const writeConsent = (categories: string[]): SavedCookieContent => {
  const previous = readConsentCookie()
  const now = new Date().toISOString()

  const cookie: SavedCookieContent = {
    categories,
    level: categories,
    revision: CONSENT_REVISION,
    data: previous?.data ?? null,
    rfc_cookie: false,
    consent_date: previous?.consent_date ?? now,
    consent_uuid: previous?.consent_uuid ?? createConsentUuid(),
    last_consent_update: now
  }

  writeCookie(JSON.stringify(cookie))

  return cookie
}

/**
 * The categories whose value flipped, in the plugin's sense: it reports a
 * change only for a consent that already existed, and reports nothing on the
 * first acceptance.
 */
export const diffCategories = (
  previous: string[],
  next: string[]
): string[] => {
  const changed = previous.filter(category => !next.includes(category))

  for (const category of next) {
    if (!previous.includes(category)) changed.push(category)
  }

  return changed
}

/**
 * Delete cookies by name, the plugin's `eraseCookies` without the plugin.
 * Both the bare host and its dot form are cleared, because a cookie written
 * with a Domain is not removed by a delete without one.
 */
export const eraseCookies = (
  names: string[],
  path?: string,
  domains?: string[]
): void => {
  if (typeof document === 'undefined') return

  const targets = domains ?? [location.hostname, `.${location.hostname}`]

  for (const name of names) {
    for (const domain of targets) {
      document.cookie =
        `${name}=; path=${path ?? CONSENT_COOKIE_PATH}` +
        `; domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    }
  }
}
