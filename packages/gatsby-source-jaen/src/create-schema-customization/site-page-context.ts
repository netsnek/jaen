import {CreateSchemaCustomizationArgs} from 'gatsby'

/**
 * Type the locale fields localized page generation writes into
 * SitePage.context, so sites can query them (language switchers, hreflang).
 */
export const createSchemaCustomization = async ({
  actions
}: CreateSchemaCustomizationArgs) => {
  actions.createTypes(`
    type SitePage implements Node {
      context: SitePageContext
    }

    type SitePageContext {
      locale: String
      localePagesId: String
      prefix: String
      translations: [SitePageContextTranslation]
    }

    type SitePageContextTranslation {
      locale: String
      prefix: String
      path: String
    }
  `)
}
