import {ChakraProvider} from '@chakra-ui/react'
import {ThemeProvider as NextThemeProvider} from 'next-themes'
import {
  AuthenticationProvider,
  MediaModalProvider,
  NotificationsProvider,
  JaenUpdateModalProvider,
  CookieConsentProvider,
  useAuth,
  useAuthUser
} from 'jaen'
import {GatsbyBrowser} from 'gatsby'
import {
  lazy,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode
} from 'react'
import {IntlProvider} from 'react-intl'

import {JaenWidgetProvider} from '../contexts/jaen-widget'
import {SiteMetadataProvider} from '../connectors/site-metadata'
import {system} from '../theme'
import {JaenFrameMenuProvider} from '../contexts/jaen-frame-menu'
import {Toaster} from '../components/ui/toaster'
import {Popup} from '../components/Popup'
import {messagesByLocale} from '../locales/messages'

type LocaleKey = keyof typeof messagesByLocale

const DEFAULT_LOCALE: LocaleKey = 'en-US'

const AVAILABLE_LOCALES = Object.keys(messagesByLocale) as LocaleKey[]

/**
 * Match a language tag against the available CMS locales: exact match first,
 * then the first locale sharing the base language (de -> de-AT). Derived
 * from the catalog, so adding a locale needs no code change here.
 */
const matchLocale = (candidate?: string | null): LocaleKey | undefined => {
  if (!candidate) return undefined

  const normalized = candidate.replace(/_/g, '-').toLowerCase()

  const exact = AVAILABLE_LOCALES.find(
    locale => locale.toLowerCase() === normalized
  )

  if (exact) return exact

  const base = normalized.split('-')[0]

  return AVAILABLE_LOCALES.find(
    locale => locale.split('-')[0].toLowerCase() === base
  )
}

/**
 * The CMS follows the language set on the account: the Zitadel profile's
 * preferredLanguage wins, then the OIDC locale claim (available right after
 * sign-in, before the profile query resolves), then the browser languages,
 * then en-US.
 */
export const JaenIntlProvider: FC<{children: ReactNode}> = ({children}) => {
  const authUser = useAuthUser()
  const auth = useAuth()

  const preferredLanguage = authUser?.user?.human?.profile?.preferredLanguage
  const claimLocale = auth.user?.profile?.locale

  const [browserLocale, setBrowserLocale] = useState<string | undefined>()

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const languages = Array.isArray(navigator.languages)
        ? navigator.languages
        : [navigator.language]

      setBrowserLocale(languages.find(Boolean))
    }
  }, [])

  const locale = useMemo<LocaleKey>(() => {
    return (
      matchLocale(preferredLanguage) ??
      matchLocale(claimLocale) ??
      matchLocale(browserLocale) ??
      DEFAULT_LOCALE
    )
  }, [preferredLanguage, claimLocale, browserLocale])

  // No key={locale}: react-intl propagates locale/messages changes through
  // context, so strings update in place instead of remounting (and thereby
  // resetting) the entire app subtree on sign-in.
  return (
    <IntlProvider
      messages={messagesByLocale[locale]}
      locale={locale}
      defaultLocale={DEFAULT_LOCALE}>
      {children}
    </IntlProvider>
  )
}

const MediaModalComponent = lazy(
  async () => await import('../containers/media-modal')
)

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = (
  {element},
  pluginOptions
) => {
  if (element?.type?.name === '' || element?.type?.name === 'Head') {
    return (
      <IntlProvider
        messages={messagesByLocale[DEFAULT_LOCALE]}
        locale={DEFAULT_LOCALE}
        defaultLocale={DEFAULT_LOCALE}>
        <SiteMetadataProvider>{element}</SiteMetadataProvider>
      </IntlProvider>
    )
  }

  return (
    /**
     * Two things changed here, and they are the same change seen from two ends.
     *
     * next-themes sits OUTSIDE Chakra because it writes the class onto <html>
     * that v3's dark condition selects on, so the provider reading tokens has
     * to be inside the one setting the class. defaultTheme="system" with
     * enableSystem is what the site asked for in v2 and never actually got.
     *
     * cssVarsRoot="#momo" is gone, and its absence is what lets that work. In
     * v3 only the base bucket honours cssVarsRoot; the dark bucket always lands
     * on `.dark, .dark .chakra-theme:not(.light)`. With `.dark` on <html> and
     * #momo a descendant, the scoped block would win every time and dark mode
     * would be dead inside the CMS. The two systems are kept apart by their
     * variable prefix instead, which no selector can defeat. #momo stays on the
     * elements, as the portal container id it also always was.
     */
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <ChakraProvider value={system}>
        <NotificationsProvider>
          <AuthenticationProvider>
            <JaenIntlProvider>
              <Toaster />

              <CookieConsentProvider>
                <JaenUpdateModalProvider>
                  <SiteMetadataProvider>
                    <JaenFrameMenuProvider>
                      <MediaModalProvider
                        MediaModalComponent={MediaModalComponent}>
                        <JaenWidgetProvider>
                          <Popup />
                          {element}
                        </JaenWidgetProvider>
                      </MediaModalProvider>
                    </JaenFrameMenuProvider>
                  </SiteMetadataProvider>
                </JaenUpdateModalProvider>
              </CookieConsentProvider>
            </JaenIntlProvider>
          </AuthenticationProvider>
        </NotificationsProvider>
      </ChakraProvider>
    </NextThemeProvider>
  )
}
