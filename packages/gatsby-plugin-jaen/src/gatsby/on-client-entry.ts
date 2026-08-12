import {globalHistory} from '@reach/router'
import type {HistoryUnsubscribe} from '@reach/router'
import {GatsbyBrowser} from 'gatsby'
import {bootstrapCookieConsent, COOKIE_CONSENT_CHANGE_EVENT} from 'jaen'
import type {CookieConsentChangeDetail} from 'jaen'

import {
  JaenGoogleAnalyticsOptions,
  JaenPluginOptions,
  JaenSentryOptions
} from './types'

/**
 * Neither of the two third parties this file starts is a gatsby plugin any
 * more, and both are started for the same reason at the same moment: the
 * visitor allowed the category the banner asks about.
 *
 * Sentry is documented below. Google Analytics is documented over its own
 * section further down and in gatsby/gatsby-config.ts. What they share is
 * `watchConsentCategory`, which is the whole of the wiring — the cookie is the
 * state, the event is the only signal that it changed, and there is no reason
 * for a third consumer to write either of those out again.
 */
const DEFAULT_CONSENT_CATEGORY = 'analytics'

type ConsentApi = ReturnType<typeof bootstrapCookieConsent>

/**
 * Answer `react` with the visitor's decision about `category`, now and on
 * every later change.
 *
 * The initial call is synchronous and comes straight out of the cookie,
 * because the consent object's identity never changes and nothing would ever
 * think to ask it again; the event is what carries a change made on a page
 * that is already open. Consumers therefore only have to be idempotent, which
 * both of the ones below are.
 */
const watchConsentCategory = (
  cc: ConsentApi,
  category: string,
  react: (granted: boolean) => void
): void => {
  window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, event => {
    const detail = (event as CustomEvent<CookieConsentChangeDetail>).detail

    react(Boolean(detail?.categories?.includes(category)))
  })

  react(Boolean(cc?.allowedCategory(category)))
}

/**
 * Sentry is no longer a gatsby plugin.
 *
 * `@sentry/gatsby` registers a `gatsby-browser` that calls `init` for every
 * visitor as soon as the runtime starts, and this file then added tracing,
 * profiling and session replay on top of it. None of that asked the visitor
 * anything, while Google Analytics was at least nominally gated on
 * `allowedCategory('analytics')` — nominally, because that gate only set
 * `ga-disable` and the script had been fetched long before, see below.
 *
 * So the plugin is gone from gatsby-config and the SDK is imported here, by
 * hand, only once the visitor has allowed the category. Two things follow from
 * that. Session replay stops recording people who never agreed to it, and a
 * measured run (Lighthouse, PageSpeed, any bot) never grants consent, so it
 * never pays for the SDK either.
 */

/**
 * How many pre-consent errors are kept. The buffer exists to not lose the
 * first crash of a session, not to become a log, and it has to stay bounded
 * because a page that throws in a loop would otherwise grow it forever.
 */
const PRE_CONSENT_BUFFER_LIMIT = 20

type SentryModule = typeof import('@sentry/gatsby')

interface PreConsentError {
  value: unknown
  occurredAt: number
}

const preConsentErrors: PreConsentError[] = []

let bufferAttached = false
let sentryModule: SentryModule | null = null
let sentryLoading: Promise<SentryModule> | null = null
let sentryRunning = false

const rememberPreConsentError = (value: unknown): void => {
  if (preConsentErrors.length >= PRE_CONSENT_BUFFER_LIMIT) return

  preConsentErrors.push({value, occurredAt: Date.now()})
}

const handleWindowError = (event: ErrorEvent): void => {
  // A failed image or stylesheet fires a plain Event with no error on it.
  // Those only reach window in the capture phase, which this listener is not
  // in, but the guard costs nothing and keeps empty events out of Sentry.
  const value = event.error ?? (event.message || null)

  if (value === null) return

  rememberPreConsentError(value)
}

const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
  rememberPreConsentError(event.reason)
}

const attachPreConsentBuffer = (): void => {
  if (bufferAttached) return

  bufferAttached = true
  window.addEventListener('error', handleWindowError)
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
}

const detachPreConsentBuffer = (): void => {
  if (!bufferAttached) return

  bufferAttached = false
  window.removeEventListener('error', handleWindowError)
  window.removeEventListener('unhandledrejection', handleUnhandledRejection)
}

/**
 * Hand the buffered errors to Sentry.
 *
 * The event carries the time it is sent, not the time it happened, so the
 * original moment goes in as an extra and a tag marks where these came from.
 */
const flushPreConsentErrors = (Sentry: SentryModule): void => {
  detachPreConsentBuffer()

  const buffered = preConsentErrors.splice(0, preConsentErrors.length)

  for (const entry of buffered) {
    Sentry.captureException(entry.value, {
      captureContext: {
        tags: {jaen_pre_consent: 'true'},
        extra: {
          occurred_at: new Date(entry.occurredAt).toISOString()
        }
      }
    })
  }
}

const loadSentry = async (): Promise<SentryModule> => {
  if (sentryModule) return sentryModule

  // Assigned before the await so that two consent events in the same tick
  // share one import instead of racing two.
  sentryLoading = sentryLoading ?? import('@sentry/gatsby')

  sentryModule = await sentryLoading

  return sentryModule
}

const startSentry = async (options: JaenSentryOptions): Promise<void> => {
  if (sentryRunning) return

  sentryRunning = true

  const Sentry = await loadSentry()

  // The visitor may have withdrawn again while the chunk was in flight.
  if (!sentryRunning) return

  const requested = options.integrations ?? []

  const integrations: Array<Parameters<typeof Sentry.addIntegration>[0]> = []

  if (requested.includes('browserTracing')) {
    integrations.push(
      Sentry.browserTracingIntegration({
        enableInp: true,
        _experiments: {
          enableInteractions: true
        }
      })
    )
  }

  if (requested.includes('browserProfiling')) {
    integrations.push(Sentry.browserProfilingIntegration())
  }

  if (requested.includes('replay')) {
    integrations.push(Sentry.replayIntegration())
  }

  if (options.feedbackIntegration) {
    integrations.push(
      Sentry.feedbackIntegration({
        colorScheme: 'light',
        showBranding: false,
        formTitle: 'Give Feedback',
        buttonLabel: 'Feedback',
        submitButtonLabel: 'Send Feedback',
        messagePlaceholder: 'Report an issue or share your ideas.',
        // Allows for customizing the feedback form
        ...options.feedbackIntegration
      })
    )
  }

  const tracesSampleRate = options.tracesSampleRate ?? 0
  const profilesSampleRate = options.profilesSampleRate ?? 0
  const replaysSessionSampleRate = options.replaysSessionSampleRate ?? 0
  const replaysOnErrorSampleRate = options.replaysOnErrorSampleRate ?? 0

  Sentry.init({
    dsn: options.dsn,
    debug: options.debug ?? false,
    sampleRate: options.sampleRate ?? 1,
    integrations,
    /**
     * The rates are spread in only when they are actually used.
     *
     * `hasTracingEnabled` in @sentry/core answers `'tracesSampleRate' in
     * options`, so writing a plain 0 still counts as tracing being on and the
     * gatsby SDK then appends `browserTracingIntegration()` by itself. Leaving
     * the key out is the difference between the tracing bundle being loaded
     * and not.
     */
    ...(tracesSampleRate > 0 ? {tracesSampleRate} : {}),
    ...(profilesSampleRate > 0 ? {profilesSampleRate} : {}),
    ...(replaysSessionSampleRate > 0 ? {replaysSessionSampleRate} : {}),
    ...(replaysOnErrorSampleRate > 0 ? {replaysOnErrorSampleRate} : {})
  })

  flushPreConsentErrors(Sentry)
}

/**
 * Withdrawal has to be as easy as consent, so a visitor who switches the
 * category back off stops being recorded and stops being reported.
 *
 * The SDK cannot be unloaded. `close` detaches the client, so nothing is sent
 * any more, and the replay recorder is stopped explicitly because it would
 * otherwise keep serialising the DOM into a buffer nobody may look at. The
 * global error handlers the SDK installed stay installed and keep running,
 * they just have nowhere to deliver to.
 */
const stopSentry = (): void => {
  if (!sentryRunning) return

  sentryRunning = false

  const Sentry = sentryModule

  if (!Sentry) return

  void Sentry.getReplay()?.stop()
  void Sentry.close()
}

/**
 * Google Analytics, for the same reason and by the same route.
 *
 * `gatsby-plugin-google-gtag` is not registered any more, because its
 * `onRenderBody` puts a preconnect, a dns-prefetch and the gtag.js script tag
 * into every page and offers no option that stops any of the three. The whole
 * of what it did is reproduced below, deliberately close to its source so the
 * two can be compared: the queue snippet and the `js` and `config` commands
 * from its gatsby-ssr.js, the page views from its gatsby-browser.js, and the
 * `gaOptout` helper it emitted whenever `anonymize_ip` was set.
 *
 * What changes is when. Nothing here touches the network until the visitor has
 * allowed the category, and if they never do, the origin is never resolved.
 */
const DEFAULT_GTAG_ORIGIN = 'https://www.googletagmanager.com'

/** The plugin's own far-future expiry for the opt-out cookie. */
const GA_OPTOUT_COOKIE_EXPIRES = 'Thu, 31 Dec 2099 23:59:59 UTC'

interface ResolvedGtagOptions {
  trackingIds: string[]
  gtagConfig: Record<string, unknown>
  origin: string
}

type GtagCommand = (...args: unknown[]) => void

interface GtagWindow {
  dataLayer?: unknown[]
  gtag?: GtagCommand
  gaOptout?: () => void
}

const gtagWindow = (): GtagWindow => window as unknown as GtagWindow

let gtagRunning = false
let gtagScript: HTMLScriptElement | null = null
let stopHistoryListener: HistoryUnsubscribe | null = null

/**
 * `window['ga-disable-<id>']` silences gtag.js completely, wherever it came
 * from. It was already being set here for a visitor without consent, and it
 * now also has to be cleared: a visitor who accepts halfway through a visit
 * would otherwise get a library that loads and then reports nothing.
 */
const setGaDisabled = (trackingIds: string[], disabled: boolean): void => {
  const flags = window as unknown as Record<string, boolean>

  for (const trackingId of trackingIds) {
    flags[`ga-disable-${trackingId}`] = disabled
  }
}

/** The plugin's `document.cookie.indexOf(disableStr+'=true')>-1`, per id. */
const hasGaOptOutCookie = (trackingIds: string[]): boolean =>
  trackingIds.some(
    trackingId => document.cookie.indexOf(`ga-disable-${trackingId}=true`) > -1
  )

/**
 * The opt-out function German privacy pages link to as `javascript:gaOptout()`.
 *
 * The plugin wrote it into the head of every page whenever `anonymize_ip` was
 * set, which it is here, so it has to keep existing or such a link silently
 * does nothing. It is defined before consent, unlike everything else in this
 * section, because it has to work for a visitor who wants out.
 */
const installGaOptout = (
  options: ResolvedGtagOptions,
  cc: ConsentApi
): void => {
  gtagWindow().gaOptout = () => {
    for (const trackingId of options.trackingIds) {
      document.cookie =
        `ga-disable-${trackingId}=true` +
        `; expires=${GA_OPTOUT_COOKIE_EXPIRES}; path=/`
    }

    setGaDisabled(options.trackingIds, true)
    stopGtag(cc)
  }
}

/**
 * The dataLayer and the `gtag` shim, Google's own snippet.
 *
 * It has to push the `arguments` object rather than a rest array: gtag.js
 * reads the queue back expecting what `function gtag(){dataLayer.push(
 * arguments)}` puts there. Filling the queue before the library is requested
 * is also why the commands below can be issued straight away — gtag.js drains
 * whatever it finds as it evaluates.
 */
const ensureGtagQueue = (): GtagCommand => {
  const w = gtagWindow()

  w.dataLayer = w.dataLayer ?? []

  if (typeof w.gtag !== 'function') {
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer?.push(arguments)
    }
  }

  return w.gtag
}

/**
 * One page view, in the exact shape the plugin's gatsby-browser.js sent it.
 *
 * Keeping `event page_view` with `page_path` rather than letting the `config`
 * command send its own view is what makes this invisible in the property: the
 * events carry on looking like the ones it has been receiving for years.
 * `send_page_view` stays false for the same reason, which is what the plugin
 * forced it to as well.
 */
const sendGtagPageView = (): void => {
  if (!gtagRunning) return

  const gtag = gtagWindow().gtag

  if (typeof gtag !== 'function') return

  const {pathname, search, hash} = window.location

  gtag('event', 'page_view', {page_path: `${pathname}${search}${hash}`})
}

/**
 * `globalHistory` notifies its listeners from inside `navigate`, before react
 * has rendered the route that was navigated to, and gtag stamps
 * `document.title` onto every event it sends. The plugin waited two animation
 * frames and a task before sending, for that reason (gatsbyjs/gatsby#11592),
 * and this keeps its delay rather than inventing a shorter one.
 */
const scheduleGtagPageView = (): void => {
  if ('requestAnimationFrame' in window) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(sendGtagPageView, 0)
      })
    })
  } else {
    setTimeout(sendGtagPageView, 32)
  }
}

const startGtag = (options: ResolvedGtagOptions): void => {
  if (gtagRunning) return

  const [primaryTrackingId] = options.trackingIds

  if (!primaryTrackingId) return

  gtagRunning = true

  const gtag = ensureGtagQueue()

  gtag('js', new Date())

  for (const trackingId of options.trackingIds) {
    gtag('config', trackingId, options.gtagConfig)
  }

  // The one request to Google in this file, and the first one of the visit.
  if (!gtagScript) {
    gtagScript = document.createElement('script')
    gtagScript.async = true
    gtagScript.src = `${options.origin}/gtag/js?id=${encodeURIComponent(
      primaryTrackingId
    )}`

    document.head.appendChild(gtagScript)
  }

  /**
   * The view for the page the visitor is on, which the plugin got from
   * gatsby's `onRouteUpdate` firing on mount. Consent may have been given many
   * seconds and several routes into the visit, so this is the page they are
   * looking at now, not the one they arrived on.
   */
  sendGtagPageView()

  /**
   * And every route change after it. This is the same history object gatsby's
   * own cache-dir/navigation.js subscribes to — gatsby aliases `@reach/router`
   * onto `@gatsbyjs/reach-router` in its webpack config, and the plugin's
   * `onRouteUpdate` was a hook on the very same navigations. Listening here
   * rather than exporting another gatsby-browser API keeps the whole of the
   * gate in one file.
   */
  stopHistoryListener = globalHistory.listen(() => {
    scheduleGtagPageView()
  })
}

/**
 * Withdrawal, as for Sentry: gtag.js cannot be unloaded, so what can be
 * stopped is stopped and what it left behind is removed.
 *
 * The `ga-disable-<id>` flag the caller sets is what makes the library inert.
 * The identifiers it wrote go too, because the banner is not configured with
 * `autoclear_cookies` and nothing else would ever remove them.
 */
const stopGtag = (cc: ConsentApi): void => {
  if (!gtagRunning) return

  gtagRunning = false

  stopHistoryListener?.()
  stopHistoryListener = null

  /**
   * The container id is part of the cookie name (`_ga_G-XXXXXXXXXX`), so the
   * set cannot be written down and is read back off the document instead.
   * `_ga` and `_gid` are the two the banner's own cookie table declares.
   */
  const gaCookieNames = document.cookie
    .split(';')
    .map(entry => entry.split('=')[0]?.trim() ?? '')
    .filter(name => name === '_gid' || name.startsWith('_ga'))

  if (gaCookieNames.length > 0) {
    cc?.eraseCookies(gaCookieNames, '/')
  }
}

/**
 * Fold the plugin option into what the tag actually needs, or answer null when
 * there is no id, in which case nothing below ever runs and Google is never
 * contacted at all.
 */
const resolveGtagOptions = (
  options: JaenGoogleAnalyticsOptions | undefined
): ResolvedGtagOptions | null => {
  const trackingIds = (options?.trackingIds ?? []).filter(Boolean)

  if (trackingIds.length === 0) return null

  return {
    trackingIds,
    origin: options?.origin ?? DEFAULT_GTAG_ORIGIN,
    gtagConfig: {
      // The theme's own default, previously written into the plugin's
      // registration in gatsby-config.
      anonymize_ip: true,
      ...options?.gtagConfig,
      // Not negotiable: page views are sent by hand, above. The plugin
      // overwrote this on its way out too.
      send_page_view: false
    }
  }
}

export const onClientEntry: GatsbyBrowser['onClientEntry'] = (
  _,
  pluginOptions: JaenPluginOptions
) => {
  /**
   * Nothing is built or shown here any more: the banner is a React component
   * that gatsby writes into the static HTML, so it has already painted by the
   * time this runs. What is left is the consent state, and that is read
   * straight out of the cookie — the plugin is not loaded unless a visitor
   * opens the settings modal, and this must not wait for it.
   */
  const cc = bootstrapCookieConsent({
    useGoogleAnalytics: Boolean(pluginOptions.googleAnalytics?.trackingIds?.[0])
  })

  const gtagOptions = resolveGtagOptions(pluginOptions.googleAnalytics)

  if (gtagOptions) {
    installGaOptout(gtagOptions, cc)

    watchConsentCategory(
      cc,
      pluginOptions.googleAnalytics?.consentCategory ??
        DEFAULT_CONSENT_CATEGORY,
      granted => {
        const allowed = granted && !hasGaOptOutCookie(gtagOptions.trackingIds)

        setGaDisabled(gtagOptions.trackingIds, !allowed)

        if (allowed) {
          startGtag(gtagOptions)
        } else {
          stopGtag(cc)
        }
      }
    )
  }

  const sentry = pluginOptions.sentry

  // Without a dsn there is nothing to initialise and the SDK is never fetched.
  if (!sentry?.dsn) return

  const category = sentry.consentCategory ?? DEFAULT_CONSENT_CATEGORY

  if (
    !cc?.allowedCategory(category) &&
    (sentry.bufferPreConsentErrors ?? true)
  ) {
    attachPreConsentBuffer()
  }

  watchConsentCategory(cc, category, granted => {
    if (granted) {
      void startSentry(sentry)
    } else {
      stopSentry()
    }
  })
}
