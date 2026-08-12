import {GatsbyBrowser} from 'gatsby'
import {bootstrapCookieConsent} from 'jaen'
import * as Sentry from '@sentry/gatsby'
import {JaenPluginOptions} from './types'

export const onClientEntry: GatsbyBrowser['onClientEntry'] = async (
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
