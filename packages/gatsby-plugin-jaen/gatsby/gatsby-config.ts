import {GatsbyConfig} from 'gatsby'

interface JaenThemeI18nOptions {
  defaultLocale: string
  locales: Array<{
    locale: string
    prefix?: string
    slugs?: Record<string, string>
    pageBlacklist?: string[]
  }>
  trailingSlash?: 'always' | 'never' | 'ignore'
}

interface JaenThemeOptions {
  i18n?: JaenThemeI18nOptions
  siteUrl?: string
}

/**
 * Theme config. i18n and siteUrl options are forwarded to gatsby-source-jaen,
 * which owns localized page generation and the hreflang-aware sitemap.xml /
 * robots.txt emission (the former gatsby-plugin-sitemap had neither i18n
 * awareness nor system-route knowledge and is gone).
 */
const Config = (themeOptions: JaenThemeOptions): GatsbyConfig => ({
  jsxRuntime: 'automatic',
  jsxImportSource: '@emotion/react',
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-jaen`,
      options: {
        ...(themeOptions.i18n ? {i18n: themeOptions.i18n} : {}),
        ...(themeOptions.siteUrl ? {siteUrl: themeOptions.siteUrl} : {})
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Jaen App`,
        short_name: `Jaen`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
        icon: `src/favicon.ico`
      }
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [],
        gtagConfig: {
          anonymize_ip: true
        },
        pluginConfig: {
          head: true
        }
      }
    },
    {
      resolve: '@sentry/gatsby',
      options: {
        sampleRate: 1,
        enableTracing: true,
        debug: true,
        // Performance Monitoring
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        // Session Replay
        replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      }
    },
    {
      resolve: 'gatsby-plugin-remove-console',
      options: {
        exclude: ['error', 'warn'] // <- Errors should not be removed
      }
    }
  ]
})

export default Config
