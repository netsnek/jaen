# Localized pages, zitadel-gql identity and emailwerk

This branch teaches jaen three things: native localized page generation with
an hreflang-aware sitemap, identity through the zitadel-gql GraphQL API, and
mailing through emailwerk (mailpress v3). This document is the option
reference for sites.

## Localized page generation

Configured on `gatsby-plugin-jaen` and forwarded to `gatsby-source-jaen`:

```ts
{
  resolve: `gatsby-plugin-jaen`,
  options: {
    // ...
    siteUrl: 'https://example.com',
    i18n: {
      defaultLocale: 'de-AT',
      locales: [
        {locale: 'de-AT', prefix: 'de'},
        {locale: 'en-US', prefix: 'en'},
        {locale: 'sl-SI', prefix: 'sl'},
        {locale: 'it-IT', prefix: 'it'},
        {locale: 'ja-JP', prefix: 'ja'}
      ],
      trailingSlash: 'always' // 'always' | 'never' | 'ignore'
    }
  }
}
```

Behavior:

- **Stateful pages** (`src/pages`) fan out into one page per locale. The
  default locale keeps the bare path (`/about/`), every other locale gets its
  prefix (`/en/about/`). Every clone carries `locale`, `prefix`,
  `localePagesId` and `translations` in its page context and its own
  `jaenPageId` derived from the localized path — each locale's content is
  edited independently in the CMS.
- **Programmatic pages** (`createPages`) are translated once. Localized
  template pages opt in through the context keys `basePath` (the
  untranslated origin path), `adjustPath: true` (rewrite the path for the
  locale) and `referTranslations: ['en-US', ...]` (link sibling locales).
- **System routes** (`/cms`, `/login`, `/logout`, `/signup`,
  `/password_reset`, `/settings`, `/emailwerk`, `/app`, `/resources`) are
  never localized; locale-prefixed clones are deleted. Their UI language
  follows the signed-in account, not the URL.
- Per-locale `slugs` translate path segments; `pageBlacklist` excludes paths
  from a locale entirely.
- At build time every localized page gets `<html lang>`, hreflang alternate
  links (including `x-default`) and `og:locale` in its head.

### Sitemap and robots.txt

`gatsby-source-jaen` writes `public/sitemap.xml` and `public/robots.txt` in
`onPostBuild`, replacing `gatsby-plugin-sitemap`:

- URL entries carry `xhtml:link rel="alternate" hreflang` for every
  translation sibling plus `x-default` (the default locale's variant).
- System routes, build artifacts and dynamic `[param]` routes are excluded.
- `lastmod` comes from the JaenPage's `modifiedAt` and is omitted when
  unknown. `changefreq`/`priority` are not emitted.
- `siteUrl` resolves from the plugin option, `GATSBY_SITE_URL`/`SITE_URL` or
  the jaen site metadata; without one the emission is skipped with a warning.
- A `robots.txt` the site ships in `static/` is never overwritten.

## CMS language

The CMS interface ships in seven languages (`en-US`, `de-AT`, `sl-SI`,
`it-IT`, `ja-JP`, `tr-TR`, `ar-EG`) and follows the language configured on
the signed-in account: the Zitadel profile's `preferredLanguage` wins, then
the OIDC `locale` claim, then the browser languages, then `en-US`. Changing
the language in the CMS settings updates the Zitadel profile, so every jaen
CMS follows along.

## Identity: zitadel-gql

jaen talks to [zitadel-gql](https://github.com/kleberbaum/zitadel-gql) — one
identity server speaking OIDC *and* GraphQL. The option block (renamed from
`zitadel`):

```ts
zitadelGql: {
  organizationId: '...',
  clientId: '...@cms',
  authority: 'https://accounts.example.com',
  redirectUri: 'https://example.com',
  projectIds: ['...'],
  // optional; defaults to `${authority}/graphql`
  graphqlUrl: 'https://accounts.example.com/graphql'
}
```

- Roles come from a `currentUser` GraphQL query (plain role keys plus
  `projectId:role` pairs from authorizations), with the token's
  `urn:zitadel:iam:org:project:roles` claim as synchronous fallback.
- The profile (settings page) reads and writes through
  `currentUser`/`updateUser`/`setUserPhone`. REST remains only where the
  GraphQL surface has no equivalent: avatar upload (assets API), phone
  verification codes, the password-complexity policy and the
  old-password-checked change.
- The typed client is exported as `zitadelGql` from `jaen` and covers the
  full user-management surface (create/update/delete, de/reactivate,
  lock/unlock, passwords, email verification, authorizations, project
  roles).
- **CMS accounts**: `/cms/accounts/` lists every user of the tenant;
  `/cms/accounts/<id>` manages profile, state, passwords, verification and
  project roles. Requires `jaen:admin`.

## Mailing: emailwerk

`gatsby-jaen-mailpress` became `gatsby-jaen-emailwerk` (emailwerk =
mailpress v3). CMS routes moved from `/mailpress/*` to `/emailwerk/*`.

```ts
{
  resolve: `gatsby-jaen-emailwerk`,
  options: {
    url: 'https://emailwerk.example.com/graphql'
  }
}
```

`sendTemplateMail(id, {envelope?, values?})` keeps its mailpress-shaped
signature and returns `{ok: true} | {ok: false, errors}`. Multi-recipient
envelopes map onto emailwerk's list-typed `to`. Sending requires the
`emailwerk:admin` or `emailwerk:send` role; production deployments behind
Cloudflare Access authenticate through the CF cookie (the client sends
credentials), self-hosted ones through the Zitadel bearer token.
