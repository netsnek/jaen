import {useColorMode} from '../hooks/use-color-mode'

import {createContext, useContext, useEffect, useState} from 'react'
import 'vanilla-cookieconsent'

/**
 * Event dispatched on `window` whenever the visitor accepts the banner for
 * the first time or changes their categories later on.
 *
 * The context value is the plugin instance and its identity never changes,
 * so a consumer that only reads `allowedCategory` inside an effect keyed on
 * the context never learns about a consent change. The event is the missing
 * signal; it also crosses component trees, which matters because the plugin
 * renders its own modals outside of React.
 *
 * Consumers should not need this constant: `useCookieConsentCategory` wraps
 * both the event and the read.
 */
export const COOKIE_CONSENT_CHANGE_EVENT = 'jaen:cookie-consent-change'

export interface CookieConsentChangeDetail {
  /** Categories the visitor allows after the change. */
  categories: string[]
  /** Categories whose value flipped, empty on the first acceptance. */
  changedCategories: string[]
}

/**
 * Language the plugin falls back to when the page locale has no
 * translation of its own.
 */
const FALLBACK_LANGUAGE = 'en'

const analyticsCookieTable = (
  settings: {useGoogleAnalytics?: boolean} | undefined,
  labels: {twoYears: string; oneDay: string; description: string}
): Array<Record<string, string | boolean>> => {
  if (!settings?.useGoogleAnalytics) return []

  return [
    {
      col1: '^_ga', // Google Analytics cookies
      col2: 'google.com',
      col3: labels.twoYears,
      col4: labels.description,
      is_regex: true
    },
    {
      col1: '_gid',
      col2: 'google.com',
      col3: labels.oneDay,
      col4: labels.description
    }
  ]
}

/**
 * The banner copy per language. Every language carries the same blocks in
 * the same order, including the `data-cc="c-settings"` button that opens
 * the settings modal and the links of the closing block.
 */
const buildLanguages = (settings?: {
  useGoogleAnalytics?: boolean
}): Record<string, LanguageSetting> => ({
  en: {
    consent_modal: {
      title: 'We use cookies!',
      description:
        'Hi, this website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent. <button type="button" data-cc="c-settings" class="cc-link">Let me choose</button>',
      primary_btn: {
        text: 'Accept all',
        role: 'accept_all'
      },
      secondary_btn: {
        text: 'Reject all',
        role: 'accept_necessary'
      }
    },
    settings_modal: {
      title: 'Cookie Settings',
      save_settings_btn: 'Save settings',
      accept_all_btn: 'Accept all',
      reject_all_btn: 'Reject all',
      close_btn_label: 'Close',
      cookie_table_headers: [
        {col1: 'Name'},
        {col2: 'Domain'},
        {col3: 'Expiration'},
        {col4: 'Description'}
      ],
      blocks: [
        {
          title: 'Cookie usage 📢',
          description:
            'I use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="#" class="cc-link">privacy policy</a>.'
        },
        {
          title: 'Strictly necessary cookies',
          description:
            'These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly',
          toggle: {
            value: 'necessary',
            enabled: true,
            readonly: true // cookie categories with readonly=true are all treated as "necessary cookies"
          }
        },
        {
          title: 'Performance and Analytics cookies',
          description:
            'These cookies allow the website to remember the choices you have made in the past',
          toggle: {
            value: 'analytics', // your cookie category
            enabled: false,
            readonly: false
          },
          cookie_table: analyticsCookieTable(settings, {
            twoYears: '2 years',
            oneDay: '1 day',
            description:
              'Used to distinguish users in Google Analytics. This cookie helps us understand how visitors interact with our website.'
          })
        },
        {
          title: 'Advertisement and Targeting cookies',
          description:
            'These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you',
          toggle: {
            value: 'targeting',
            enabled: false,
            readonly: false
          }
        },
        {
          title: 'More information',
          description:
            'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="/contakt">contact us</a>.'
        }
      ]
    }
  },
  de: {
    consent_modal: {
      title: 'Wir verwenden Cookies!',
      description:
        'Hallo, diese Website verwendet notwendige Cookies für ihren ordnungsgemäßen Betrieb und Tracking-Cookies, um zu verstehen, wie Sie mit ihr umgehen. Letztere werden erst nach Ihrer Zustimmung gesetzt. <button type="button" data-cc="c-settings" class="cc-link">Selbst auswählen</button>',
      primary_btn: {
        text: 'Alle akzeptieren',
        role: 'accept_all'
      },
      secondary_btn: {
        text: 'Alle ablehnen',
        role: 'accept_necessary'
      }
    },
    settings_modal: {
      title: 'Cookie-Einstellungen',
      save_settings_btn: 'Einstellungen speichern',
      accept_all_btn: 'Alle akzeptieren',
      reject_all_btn: 'Alle ablehnen',
      close_btn_label: 'Schließen',
      cookie_table_headers: [
        {col1: 'Name'},
        {col2: 'Domain'},
        {col3: 'Ablauf'},
        {col4: 'Beschreibung'}
      ],
      blocks: [
        {
          title: 'Verwendung von Cookies 📢',
          description:
            'Wir verwenden Cookies, um die grundlegenden Funktionen der Website sicherzustellen und Ihr Online-Erlebnis zu verbessern. Für jede Kategorie können Sie sich jederzeit dafür oder dagegen entscheiden. Weitere Einzelheiten zu Cookies und anderen sensiblen Daten finden Sie in der vollständigen <a href="#" class="cc-link">Datenschutzerklärung</a>.'
        },
        {
          title: 'Unbedingt erforderliche Cookies',
          description:
            'Diese Cookies sind für den ordnungsgemäßen Betrieb unserer Website unerlässlich. Ohne diese Cookies würde die Website nicht richtig funktionieren',
          toggle: {
            value: 'necessary',
            enabled: true,
            readonly: true
          }
        },
        {
          title: 'Cookies für Leistung und Analyse',
          description:
            'Diese Cookies ermöglichen es der Website, sich an Ihre früheren Entscheidungen zu erinnern',
          toggle: {
            value: 'analytics',
            enabled: false,
            readonly: false
          },
          cookie_table: analyticsCookieTable(settings, {
            twoYears: '2 Jahre',
            oneDay: '1 Tag',
            description:
              'Dient dazu, Nutzer in Google Analytics zu unterscheiden. Dieses Cookie hilft uns zu verstehen, wie Besucher mit unserer Website umgehen.'
          })
        },
        {
          title: 'Cookies für Werbung und Targeting',
          description:
            'Diese Cookies erfassen Informationen darüber, wie Sie die Website nutzen, welche Seiten Sie besucht und welche Links Sie angeklickt haben. Alle Daten werden anonymisiert und können nicht zu Ihrer Identifizierung verwendet werden',
          toggle: {
            value: 'targeting',
            enabled: false,
            readonly: false
          }
        },
        {
          title: 'Weitere Informationen',
          description:
            'Bei Fragen zu unserer Cookie-Richtlinie und zu Ihren Auswahlmöglichkeiten <a class="cc-link" href="/contakt">kontaktieren Sie uns bitte</a>.'
        }
      ]
    }
  },
  sl: {
    consent_modal: {
      title: 'Uporabljamo piškotke!',
      description:
        'Pozdravljeni, to spletno mesto uporablja nujne piškotke za pravilno delovanje in piškotke za sledenje, da razumemo, kako ga uporabljate. Slednji se nastavijo šele po vaši privolitvi. <button type="button" data-cc="c-settings" class="cc-link">Želim izbrati sam</button>',
      primary_btn: {
        text: 'Sprejmi vse',
        role: 'accept_all'
      },
      secondary_btn: {
        text: 'Zavrni vse',
        role: 'accept_necessary'
      }
    },
    settings_modal: {
      title: 'Nastavitve piškotkov',
      save_settings_btn: 'Shrani nastavitve',
      accept_all_btn: 'Sprejmi vse',
      reject_all_btn: 'Zavrni vse',
      close_btn_label: 'Zapri',
      cookie_table_headers: [
        {col1: 'Ime'},
        {col2: 'Domena'},
        {col3: 'Veljavnost'},
        {col4: 'Opis'}
      ],
      blocks: [
        {
          title: 'Uporaba piškotkov 📢',
          description:
            'Piškotke uporabljamo za zagotavljanje osnovnih funkcij spletnega mesta in za izboljšanje vaše spletne izkušnje. Za vsako kategorijo se lahko kadar koli odločite za privolitev ali zavrnitev. Več podrobnosti o piškotkih in drugih občutljivih podatkih najdete v celotni <a href="#" class="cc-link">izjavi o varstvu podatkov</a>.'
        },
        {
          title: 'Nujno potrebni piškotki',
          description:
            'Ti piškotki so nujni za pravilno delovanje našega spletnega mesta. Brez teh piškotkov spletno mesto ne bi delovalo pravilno',
          toggle: {
            value: 'necessary',
            enabled: true,
            readonly: true
          }
        },
        {
          title: 'Piškotki za zmogljivost in analitiko',
          description:
            'Ti piškotki spletnemu mestu omogočajo, da si zapomni vaše pretekle izbire',
          toggle: {
            value: 'analytics',
            enabled: false,
            readonly: false
          },
          cookie_table: analyticsCookieTable(settings, {
            twoYears: '2 leti',
            oneDay: '1 dan',
            description:
              'Uporablja se za razlikovanje uporabnikov v storitvi Google Analytics. Ta piškotek nam pomaga razumeti, kako obiskovalci uporabljajo naše spletno mesto.'
          })
        },
        {
          title: 'Piškotki za oglaševanje in ciljanje',
          description:
            'Ti piškotki zbirajo informacije o tem, kako uporabljate spletno mesto, katere strani ste obiskali in na katere povezave ste kliknili. Vsi podatki so anonimizirani in vas z njimi ni mogoče identificirati',
          toggle: {
            value: 'targeting',
            enabled: false,
            readonly: false
          }
        },
        {
          title: 'Več informacij',
          description:
            'Za vsa vprašanja o naši politiki piškotkov in o vaših izbirah nas <a class="cc-link" href="/contakt">kontaktirajte</a>.'
        }
      ]
    }
  },
  it: {
    consent_modal: {
      title: 'Utilizziamo i cookie!',
      description:
        'Ciao, questo sito web utilizza cookie essenziali per il suo corretto funzionamento e cookie di tracciamento per capire come interagite con esso. Questi ultimi vengono impostati solo dopo il vostro consenso. <button type="button" data-cc="c-settings" class="cc-link">Scelgo io</button>',
      primary_btn: {
        text: 'Accetta tutti',
        role: 'accept_all'
      },
      secondary_btn: {
        text: 'Rifiuta tutti',
        role: 'accept_necessary'
      }
    },
    settings_modal: {
      title: 'Impostazioni dei cookie',
      save_settings_btn: 'Salva le impostazioni',
      accept_all_btn: 'Accetta tutti',
      reject_all_btn: 'Rifiuta tutti',
      close_btn_label: 'Chiudi',
      cookie_table_headers: [
        {col1: 'Nome'},
        {col2: 'Dominio'},
        {col3: 'Scadenza'},
        {col4: 'Descrizione'}
      ],
      blocks: [
        {
          title: 'Utilizzo dei cookie 📢',
          description:
            'Utilizziamo i cookie per garantire le funzionalità di base del sito web e per migliorare la vostra esperienza online. Per ogni categoria potete scegliere in qualsiasi momento se attivarla o disattivarla. Per maggiori dettagli sui cookie e sugli altri dati sensibili consultate l\'<a href="#" class="cc-link">informativa sulla privacy</a> completa.'
        },
        {
          title: 'Cookie strettamente necessari',
          description:
            'Questi cookie sono essenziali per il corretto funzionamento del nostro sito web. Senza questi cookie il sito non funzionerebbe correttamente',
          toggle: {
            value: 'necessary',
            enabled: true,
            readonly: true
          }
        },
        {
          title: 'Cookie di prestazione e analisi',
          description:
            'Questi cookie consentono al sito web di ricordare le scelte che avete fatto in passato',
          toggle: {
            value: 'analytics',
            enabled: false,
            readonly: false
          },
          cookie_table: analyticsCookieTable(settings, {
            twoYears: '2 anni',
            oneDay: '1 giorno',
            description:
              'Utilizzato per distinguere gli utenti in Google Analytics. Questo cookie ci aiuta a capire come i visitatori interagiscono con il nostro sito web.'
          })
        },
        {
          title: 'Cookie di pubblicità e targeting',
          description:
            'Questi cookie raccolgono informazioni su come utilizzate il sito web, quali pagine avete visitato e su quali link avete fatto clic. Tutti i dati sono anonimizzati e non possono essere utilizzati per identificarvi',
          toggle: {
            value: 'targeting',
            enabled: false,
            readonly: false
          }
        },
        {
          title: 'Maggiori informazioni',
          description:
            'Per qualsiasi domanda sulla nostra politica dei cookie e sulle vostre scelte <a class="cc-link" href="/contakt">contattateci</a>.'
        }
      ]
    }
  },
  ja: {
    consent_modal: {
      title: 'Cookie を使用しています',
      description:
        '当ウェブサイトでは、正常な動作に必要な Cookie と、ご利用状況を把握するためのトラッキング Cookie を使用しています。後者はお客様の同意をいただいた後にのみ設定されます。<button type="button" data-cc="c-settings" class="cc-link">個別に選択する</button>',
      primary_btn: {
        text: 'すべて許可',
        role: 'accept_all'
      },
      secondary_btn: {
        text: 'すべて拒否',
        role: 'accept_necessary'
      }
    },
    settings_modal: {
      title: 'Cookie 設定',
      save_settings_btn: '設定を保存',
      accept_all_btn: 'すべて許可',
      reject_all_btn: 'すべて拒否',
      close_btn_label: '閉じる',
      cookie_table_headers: [
        {col1: '名称'},
        {col2: 'ドメイン'},
        {col3: '有効期限'},
        {col4: '説明'}
      ],
      blocks: [
        {
          title: 'Cookie の使用について 📢',
          description:
            'ウェブサイトの基本的な機能を確保し、オンライン体験を向上させるために Cookie を使用しています。カテゴリごとに、いつでも有効または無効をお選びいただけます。Cookie およびその他の機微な情報の詳細については、<a href="#" class="cc-link">プライバシーポリシー</a>の全文をご覧ください。'
        },
        {
          title: '必須 Cookie',
          description:
            'これらの Cookie は当ウェブサイトが正しく動作するために不可欠です。これらの Cookie がない場合、ウェブサイトは正常に機能しません',
          toggle: {
            value: 'necessary',
            enabled: true,
            readonly: true
          }
        },
        {
          title: 'パフォーマンスおよび分析 Cookie',
          description:
            'これらの Cookie により、ウェブサイトはお客様がこれまでに行った選択を記憶できます',
          toggle: {
            value: 'analytics',
            enabled: false,
            readonly: false
          },
          cookie_table: analyticsCookieTable(settings, {
            twoYears: '2 年',
            oneDay: '1 日',
            description:
              'Google アナリティクスでユーザーを識別するために使用されます。この Cookie は、訪問者が当ウェブサイトをどのように利用しているかを把握するために役立ちます。'
          })
        },
        {
          title: '広告およびターゲティング Cookie',
          description:
            'これらの Cookie は、ウェブサイトの利用方法、閲覧したページ、クリックしたリンクに関する情報を収集します。すべてのデータは匿名化されており、お客様個人を特定することはできません',
          toggle: {
            value: 'targeting',
            enabled: false,
            readonly: false
          }
        },
        {
          title: '詳細情報',
          description:
            'Cookie に関する当社の方針やお客様の選択についてご不明な点がございましたら、<a class="cc-link" href="/contakt">お問い合わせください</a>。'
        }
      ]
    }
  }
})

const buildPluginConfig = (settings?: {
  useGoogleAnalytics?: boolean
}): UserConfig => {
  const pluginConfig: UserConfig = {
    current_lang: FALLBACK_LANGUAGE,
    autoclear_cookies: true,
    page_scripts: true,

    gui_options: {
      settings_modal: {
        layout: 'box'
      },
      consent_modal: {
        layout: 'cloud'
      }
    },

    languages: buildLanguages(settings)
  }

  return pluginConfig
}

/**
 * Pick the banner language for a locale.
 *
 * The locale that reaches the provider is whatever the site labels its
 * pages with, which is usually a full tag such as `de-AT` or `ja-JP`, while
 * the copy above is keyed by base language. Region and script subtags are
 * therefore dropped, and a language without copy of its own falls back to
 * english instead of being handed to the plugin, which would otherwise
 * resolve it against the first key of the map.
 */
const resolveLanguage = (
  locale: string | null | undefined,
  languages: Record<string, LanguageSetting>
): string => {
  const [base = ''] = (locale ?? '').replace(/_/g, '-').toLowerCase().split('-')

  return Object.prototype.hasOwnProperty.call(languages, base)
    ? base
    : FALLBACK_LANGUAGE
}

const dispatchConsentChange = (detail: CookieConsentChangeDetail): void => {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent<CookieConsentChangeDetail>(COOKIE_CONSENT_CHANGE_EVENT, {
      detail
    })
  )
}

const CookieContext = createContext<CookieConsent | null>(null)

/**
 * Build and show the consent banner, outside React.
 *
 * This used to live in the provider's effect, which meant the banner was only
 * created once the whole tree had hydrated. Lighthouse measured the result on
 * netsnek.com: the banner is the largest element it sees, so it became the LCP
 * element at 18.3 s, of which 17.6 s was render delay. Nothing else on the page
 * mattered next to that number.
 *
 * vanilla-cookieconsent is a plain DOM library and needs neither React nor the
 * provider. Everything it wants is available before hydration: the flag comes
 * from the plugin options and the language from `<html lang>`, which
 * gatsby-plugin-jaen has already stamped. Calling this from onClientEntry
 * paints the banner as soon as the bundle runs instead of after the last
 * component has mounted.
 *
 * It is idempotent. The provider calls it too, and on the second call it just
 * hands back the instance that is already running.
 */
export const bootstrapCookieConsent = (settings?: {
  useGoogleAnalytics?: boolean
  locale?: string
}): CookieConsent | null => {
  if (typeof window === 'undefined') return null

  if (window.cookieConsent && document.getElementById('cc--main')) {
    return window.cookieConsent
  }

  const cc = window.initCookieConsent()
  const pluginConfig = buildPluginConfig({
    useGoogleAnalytics: settings?.useGoogleAnalytics
  })

  // Without an explicit locale the language of the rendered document is the
  // best signal: gatsby-plugin-jaen stamps `<html lang>` with the locale of
  // the localized page.
  const currentLang = resolveLanguage(
    settings?.locale ?? document.documentElement.lang,
    pluginConfig.languages ?? {}
  )

  cc.run({
    ...pluginConfig,
    current_lang: currentLang,
    onAccept: cookie => {
      dispatchConsentChange({
        categories: cookie?.categories ?? [],
        changedCategories: []
      })
    },
    onChange: (cookie, changedCookieCategories) => {
      dispatchConsentChange({
        categories: cookie?.categories ?? [],
        changedCategories: changedCookieCategories ?? []
      })
    }
  })

  window.cookieConsent = cc

  return cc
}

export interface CookieConsentProviderProps {
  locale?: string
  useGoogleAnalytics?: boolean
  children: React.ReactNode
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({
  children,
  useGoogleAnalytics,
  locale
}) => {
  const [cc, setCC] = useState<CookieConsent | null>(null)

  const {colorMode} = useColorMode()

  useEffect(() => {
    // onClientEntry has usually built it already, in which case this only
    // adopts the running instance.
    setCC(bootstrapCookieConsent({useGoogleAnalytics, locale}))
  }, [locale, useGoogleAnalytics])

  useEffect(() => {
    if (cc) {
      const hasDarkMode = document.body.classList.contains('c_darkmode')

      if (colorMode === 'dark' && !hasDarkMode) {
        document.body.classList.add('c_darkmode')
      } else if (colorMode === 'light' && hasDarkMode) {
        document.body.classList.remove('c_darkmode')
      }
    }
  }, [colorMode, cc])

  return <CookieContext.Provider value={cc}>{children}</CookieContext.Provider>
}

export default CookieConsentProvider

export function useCookieConsentContext(): CookieConsent | null {
  const context = useContext(CookieContext)

  return context
}

/**
 * Whether the visitor currently allows a cookie category, re-read whenever
 * consent changes.
 *
 * Returns `false` until the plugin is up, so a gated embed stays closed
 * during server rendering and hydration instead of flickering.
 */
export function useCookieConsentCategory(category: string): boolean {
  const cc = useCookieConsentContext()

  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    const plugin =
      cc ?? (typeof window !== 'undefined' ? window.cookieConsent : null)

    const read = (): void => {
      if (!plugin) {
        setIsAllowed(false)
        return
      }

      try {
        setIsAllowed(plugin.allowedCategory(category))
      } catch {
        setIsAllowed(false)
      }
    }

    read()

    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, read)

    return () => {
      window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, read)
    }
  }, [cc, category])

  return isAllowed
}
