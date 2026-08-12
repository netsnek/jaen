import {GatsbyBrowser} from 'gatsby'
import {bootstrapCookieConsent} from 'jaen'
import * as Sentry from '@sentry/gatsby'
import {JaenPluginOptions} from './types'

export const onClientEntry: GatsbyBrowser['onClientEntry'] = async (
  _,
  pluginOptions: JaenPluginOptions
) => {
  /**
   * Build and show the banner here rather than in the provider's effect.
   *
   * onClientEntry runs before hydration, the effect ran after the whole tree
   * had mounted. Since the banner is the largest thing on the page it was
   * being measured as the LCP element, at 18.3 s on netsnek.com with 17.6 s of
   * that pure render delay. It needs no React, so it has no reason to wait for
   * it.
   */
  const cc = bootstrapCookieConsent({
    useGoogleAnalytics: Boolean(pluginOptions.googleAnalytics?.trackingIds?.[0])
  })

  // Check if analytics is enabled
  if (cc && !cc.allowedCategory('analytics')) {
    const googleAnaltyticsTrackingId =
      pluginOptions.googleAnalytics?.trackingIds?.[0]

    if (googleAnaltyticsTrackingId) {
      // @ts-ignore
      window[`ga-disable-${googleAnaltyticsTrackingId}`] = true
    }
  }

  Sentry.addIntegration(
    Sentry.browserTracingIntegration({
      enableInp: true,
      _experiments: {
        enableInteractions: true
      }
    })
  )
  Sentry.addIntegration(Sentry.browserProfilingIntegration())
  Sentry.addIntegration(Sentry.replayIntegration())

  if (pluginOptions.sentry?.feedbackIntegration) {
    Sentry.addIntegration(
      Sentry.feedbackIntegration({
        colorScheme: 'light',
        showBranding: false,
        formTitle: 'Give Feedback',
        buttonLabel: 'Feedback',
        submitButtonLabel: 'Send Feedback',
        messagePlaceholder: 'Report an issue or share your ideas.',
        // Allows for customizing the feedback form
        ...pluginOptions.sentry.feedbackIntegration
      })
    )
  }
}
