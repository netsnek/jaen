import {PageConfig} from 'jaen'
import {CreatePageArgs, Node} from 'gatsby'

import {getJaenPageParentId} from '../utils/get-jaen-page-parent-id'
import {readPageConfig} from '../utils/page-config-reader'
import {
  createLocalePagesId,
  defaultLocale,
  localeForPrefix,
  parsePathPrefix,
  resolveLocales,
  translatePagePath,
  translatePagePaths,
  isPathBlacklisted,
  JaenI18nOptions
} from '../utils/i18n'
import {
  isLocalizedSystemPath,
  isSystemPath,
  normalizePath
} from '../utils/path-filters'

// Gatsby attaches this property at runtime, but it's not declared on the
// Page TS type. Narrowed shape keeps TypeScript happy without changing
// runtime behavior.
type MaybeStateful = {
  isCreatedByStatefulCreatePages?: boolean
}

interface LocaleContext {
  locale?: unknown
  localePagesId?: unknown
  prefix?: unknown
  translations?: unknown
  // programmatic opt-in keys, consumed and stripped
  basePath?: unknown
  adjustPath?: unknown
  referTranslations?: unknown
}

const NEVER_FANNED_SEGMENTS = new Set(['404', '404.html', '500'])

const isFanOutCandidate = (path: string): boolean => {
  const first = normalizePath(path).split('/').filter(Boolean)[0]
  if (!first) return true // the index page fans out

  if (NEVER_FANNED_SEGMENTS.has(first.toLowerCase())) return false
  if (first.startsWith('dev-404')) return false

  return !isSystemPath(path)
}

export const onCreatePage = async (
  {actions, page, getNode, createContentDigest}: CreatePageArgs,
  i18n?: JaenI18nOptions
) => {
  // A locale-prefixed clone of a system route (`/de/cms`, `/en/login`) is
  // deleted outright: system pages exist exactly once, unlocalized. Their UI
  // language follows the signed-in account, not the URL.
  if (isLocalizedSystemPath(page.path)) {
    actions.deletePage(page)
    return
  }

  const isStateful = Boolean(
    (page as unknown as MaybeStateful).isCreatedByStatefulCreatePages
  )

  const localeContext = (page.context ?? {}) as LocaleContext
  const hasLocaleContext = Boolean(
    localeContext.locale && localeContext.localePagesId
  )

  let jaenPageId = page.context?.jaenPageId as string | undefined
  let pageConfig = page.context?.pageConfig as PageConfig | undefined

  // -------------------------------------------------------------------------
  // Localized page generation
  // -------------------------------------------------------------------------

  if (i18n && !hasLocaleContext && isFanOutCandidate(page.path)) {
    if (isStateful) {
      // Stateful pages (src/pages) fan out into one page per locale. Every
      // clone gets its own jaenPageId derived from the localized path, so
      // each locale's content is edited independently in the CMS.
      pageConfig = pageConfig ?? readPageConfig(page.component)

      const paths = translatePagePaths(page.path, i18n)
      const locales = resolveLocales(i18n)
      const localePagesId = createLocalePagesId(page.path)

      actions.deletePage(page)

      for (const entry of paths) {
        const locale = locales.find(l => l.locale === entry.locale)!

        if (isPathBlacklisted(entry.path, locale)) continue

        const translations = paths.filter(other => {
          if (other.locale === entry.locale) return false
          const otherLocale = locales.find(l => l.locale === other.locale)!
          return !isPathBlacklisted(other.path, otherLocale)
        })

        // A client-only route's matchPath must be scoped per locale, or all
        // clones would claim the origin's pattern (one shadows the others
        // and the prefixed routes go dead).
        const matchPath = page.matchPath
          ? locale.isDefault
            ? page.matchPath
            : `/${locale.prefix}${page.matchPath === '/' ? '' : page.matchPath}`
          : undefined

        const localizedPage = {
          ...page,
          path: entry.path,
          ...(matchPath ? {matchPath} : {}),
          context: {
            ...page.context,
            locale: entry.locale,
            prefix: entry.prefix,
            localePagesId,
            translations,
            jaenPageId: `JaenPage ${entry.path}`,
            pageConfig
          }
        }

        actions.createPage(localizedPage)

        // Gatsby suppresses onCreatePage for pages a plugin creates itself
        // (infinite-loop guard), so run the hook manually for every clone —
        // it re-enters with locale context set, falls through the i18n
        // branches and creates the clone's JaenPage node.
        await onCreatePage(
          {actions, page: localizedPage, getNode, createContentDigest} as any,
          i18n
        )
      }

      // The origin page is gone; its clones were handled above.
      return
    }

    // Programmatic pages (createPages) are translated once. They keep their
    // explicit context; `basePath`, `adjustPath` and `referTranslations` are
    // the opt-in keys for localized template pages, consumed here.
    const optIn =
      localeContext.adjustPath === true ||
      Array.isArray(localeContext.referTranslations) ||
      typeof localeContext.locale === 'string'
    const prefix = parsePathPrefix(page.path)
    // A path segment only counts as a locale signal when it maps to a
    // configured locale — /it/... is Italian only if 'it' is configured,
    // never an excuse to hijack arbitrary two-letter segments.
    const prefixLocale = localeForPrefix(prefix, i18n)

    if (optIn || prefixLocale) {
      const locales = resolveLocales(i18n)
      const explicit =
        typeof localeContext.locale === 'string'
          ? locales.find(l => l.locale === localeContext.locale)
          : undefined
      const locale =
        explicit ?? prefixLocale ?? (optIn ? defaultLocale(i18n) : undefined)

      if (locale) {
        const basePath =
          typeof localeContext.basePath === 'string'
            ? localeContext.basePath
            : page.path
        const nextPath =
          localeContext.adjustPath === true
            ? translatePagePath(basePath, locale, i18n.trailingSlash)
            : page.path

        const referTranslations = Array.isArray(localeContext.referTranslations)
          ? (localeContext.referTranslations as string[])
          : []
        const translations = translatePagePaths(basePath, i18n).filter(
          other =>
            other.locale !== locale.locale &&
            referTranslations.includes(other.locale)
        )

        const {
          basePath: _basePath,
          adjustPath: _adjustPath,
          referTranslations: _referTranslations,
          ...keptContext
        } = (page.context ?? {}) as Record<string, unknown>

        actions.deletePage(page)

        const recreatedPage = {
          ...page,
          path: nextPath,
          context: {
            ...keptContext,
            locale: locale.locale,
            prefix: locale.prefix,
            localePagesId: createLocalePagesId(basePath, locale.prefix),
            ...(translations.length > 0 ? {translations} : {})
          }
        }

        actions.createPage(recreatedPage)

        // Same manual re-entry as above: the recreated page has locale
        // context set, so it falls through to id assurance + node creation.
        await onCreatePage(
          {actions, page: recreatedPage, getNode, createContentDigest} as any,
          i18n
        )

        return
      }
    }
  }

  // -------------------------------------------------------------------------
  // JaenPage id assurance
  // -------------------------------------------------------------------------

  const expectedJaenPageId = `JaenPage ${page.path}`

  // A stateful page whose context carries a foreign jaenPageId (an external
  // i18n plugin cloning `/foo/` to `/de/foo/` copies the old context) gets
  // its id recomputed from its own path. Programmatic pages keep their
  // explicit id untouched.
  const shouldEnsureJaenPageId =
    jaenPageId === undefined ||
    (isStateful && jaenPageId !== expectedJaenPageId)

  const shouldEnsurePageConfig = pageConfig === undefined

  if (shouldEnsureJaenPageId || shouldEnsurePageConfig) {
    pageConfig = pageConfig ?? readPageConfig(page.component)

    const nextJaenPageId = isStateful
      ? expectedJaenPageId
      : (jaenPageId ?? expectedJaenPageId)

    actions.deletePage(page)

    actions.createPage({
      ...page,
      context: {
        ...page.context,
        jaenPageId: nextJaenPageId,
        pageConfig
      }
    })

    jaenPageId = nextJaenPageId
  }

  // -------------------------------------------------------------------------
  // JaenPage node creation
  // -------------------------------------------------------------------------

  // Find the JaenPage node with the same id
  const jaenPageNode = getNode(jaenPageId) as any | undefined

  const path = page.path.replace(/\/+$/, '') // Remove trailing slashes from the path
  const lastPathElement = path.split('/').pop() || '' // Extract the last element

  const createdAt = (page as any).createdAt
    ? new Date((page as any).createdAt)
    : new Date()
  const modifiedAt = (page as any).updatedAt
    ? new Date((page as any).updatedAt)
    : new Date()

  const newJaenPageNode = {
    id: jaenPageId!,
    slug: lastPathElement,

    jaenPageMetadata: {
      // pageConfig.label may be a serialized intlText marker (an object) —
      // only a plain string may land in the String!-typed node title.
      title:
        typeof pageConfig?.label === 'string'
          ? pageConfig.label
          : lastPathElement.charAt(0).toUpperCase() + lastPathElement.slice(1)
    },
    jaenFields: null,
    sections: [],
    template: null,
    createdAt: createdAt.toISOString(),
    modifiedAt: modifiedAt.toISOString(),
    ...jaenPageNode,
    createdBy: jaenPageNode?.createdBy || 'gatsby-source-jaen',
    parentPage: getJaenPageParentId({
      parentPage: jaenPageNode?.parentPage
        ? {id: jaenPageNode.parentPage as string}
        : null,
      id: jaenPageId!
    }),
    childPages: jaenPageNode?.childPages || [],
    childPagesOrder:
      jaenPageNode?.childPagesOrder ||
      jaenPageNode?.childPages?.map((child: Node) => child.id) ||
      [],
    pageConfig
  }

  const node = {
    ...newJaenPageNode,
    internal: {
      type: 'JaenPage',
      contentDigest: createContentDigest(newJaenPageNode),
      content: JSON.stringify(newJaenPageNode)
    }
  }

  await actions.createNode(node)
}
