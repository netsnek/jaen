import {ChakraProvider} from '@chakra-ui/react'
import {
  AuthenticationProvider,
  MediaModalProvider,
  NotificationsProvider,
  JaenUpdateModalProvider,
  CookieConsentProvider,
  useAuthUser
} from 'jaen'
import {GatsbyBrowser} from 'gatsby'
import {lazy, useMemo, type FC, type ReactNode} from 'react'
import {IntlProvider, FormattedMessage, FormattedNumber} from 'react-intl'

import {JaenWidgetProvider} from '../contexts/jaen-widget'
import {SiteMetadataProvider} from '../connectors/site-metadata'
import {theme} from '../theme/jaen-theme/index'
import {JaenFrameMenuProvider} from '../contexts/jaen-frame-menu'
import {Toaster} from '../components/ui/toaster'
import {Popup} from '../components/Popup'
import {messagesByLocale} from '../locales/messages'

type LocaleKey = keyof typeof messagesByLocale

const DEFAULT_LOCALE: LocaleKey = 'en-US'

const resolveLocale = (preferredLanguage?: string): LocaleKey => {
  if (!preferredLanguage) {
    return DEFAULT_LOCALE
  }

  const normalized = preferredLanguage.replace(/_/g, '-').toLowerCase()

  const availableLocales = Object.keys(messagesByLocale) as LocaleKey[]
  const exactMatch = availableLocales.find(
    locale => locale.toLowerCase() === normalized
  )

  if (exactMatch) {
    return exactMatch
  }

  const base = normalized.split('-')[0]

  switch (base) {
    case 'de':
      return 'de-AT'
    case 'en':
      return 'en-US'
    case 'tr':
      return 'tr-TR'
    case 'ar':
      return 'ar-EG'
    default:
      return DEFAULT_LOCALE
  }
}

const JaenIntlProvider: FC<{children: ReactNode}> = ({children}) => {
  const authUser = useAuthUser()

  const preferredLanguage = authUser?.user?.human?.profile?.preferredLanguage

  const locale = useMemo<LocaleKey>(() => {
    return resolveLocale(preferredLanguage)
  }, [preferredLanguage])

  return (
    <IntlProvider
      key={locale}
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
    <ChakraProvider theme={theme} cssVarsRoot="#coco">
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
  )
}
