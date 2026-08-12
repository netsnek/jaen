/**
 * GQty client for the emailwerk GraphQL API.
 */

import {createReactClient} from '@gqty/react'
import {
  Cache,
  createClient,
  defaultResponseHandler,
  type QueryFetcher
} from 'gqty'
import {
  generatedSchema,
  scalarsEnumsHash,
  type GeneratedSchema
} from './schema.generated'

/**
 * Endpoint resolution: the `__JAEN_EMAILWERK_URL__` webpack define (fed by the
 * plugin's `url` option or the `GATSBY_EMAILWERK_URL` env var, see
 * `gatsby/gatsby-node.ts`), falling back to the default public emailwerk
 * instance.
 */
const apiURL = __JAEN_EMAILWERK_URL__ || 'https://emailwerk.com/graphql'

/**
 * The Zitadel access token of the current Jaen CMS session, or `null` when
 * there is no session.
 *
 * `null` is a first-class, expected outcome, not a failure: the same client
 * serves anonymous website visitors. emailwerk's anonymous branch of
 * `sendTemplateMail` is reachable *only* by a request that carries no
 * credentials at all — a present-but-invalid token is treated as a forgery and
 * still 401s (emailwerk `docs/public-send.md`, "Per adapter"). So there is
 * deliberately no fallback and no placeholder header here: when there is no
 * session we send nothing and let the server take the public branch.
 *
 * It must also never throw, because it runs in contexts that have no session
 * machinery at all: Gatsby SSR/build, where `sessionStorage` is undefined, and
 * sites that configure no `zitadelGql`, where the webpack define is absent.
 * Every one of those cases is simply "no session".
 */
function sessionAccessToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null
  if (typeof __JAEN_ZITADEL_GQL__ === 'undefined' || !__JAEN_ZITADEL_GQL__) {
    return null
  }

  try {
    const oidcStorage = sessionStorage.getItem(
      `oidc.user:${__JAEN_ZITADEL_GQL__.authority}:${__JAEN_ZITADEL_GQL__.clientId}`
    )

    if (!oidcStorage) return null

    // Parsed by hand instead of through oidc-client-ts's
    // `User.fromStorageString`, which is only
    // `new User(JSON.parse(storageString))` (2.4.0,
    // dist/esm/oidc-client-ts.js) while its counterpart `toStorageString`
    // writes `access_token` as a plain top-level string. The value import cost
    // 201 KB of source in the always-loaded `app` chunk, measured by
    // source-map attribution on a cold load of netsnek.com's home page, for
    // this one `JSON.parse` — and the anonymous visitors paying for it are
    // exactly the ones who never have a session to read.
    //
    // Duplicated from jaen's `utils/oidc-session.ts` rather than imported:
    // jaen's exports map exposes no subpath for it, and going through the
    // barrel would pull the whole framework into this client.
    const stored = JSON.parse(oidcStorage) as {access_token?: unknown} | null
    const accessToken = stored?.access_token

    return typeof accessToken === 'string' && accessToken !== ''
      ? accessToken
      : null
  } catch {
    // Unreadable or malformed session state is no session either.
    return null
  }
}

const queryFetcher: QueryFetcher = async function (
  {query, variables, operationName},
  fetchOptions
) {
  const headers: Record<string, string> = {}

  // Authentication is two-layered, and both layers are OPTIONAL:
  //
  // 1. `credentials: 'include'` — production emailwerk sits behind Cloudflare
  //    Access; the CF_Authorization cookie set by the Access login carries the
  //    auth there (emailwerk itself only trusts the Cf-Access-Jwt-Assertion
  //    header CF Access derives from it). Kept unconditionally, and harmless
  //    for an anonymous visitor: they simply have no such cookie, so the
  //    request arrives with no assertion and emailwerk's anonymous gate offers
  //    it to the public branch. (A *missing* assertion is anonymous; only a
  //    present-but-invalid one 401s.) The public-form deployment needs a CF
  //    Access bypass policy on `/graphql` regardless.
  // 2. The Zitadel Bearer access token of the current Jaen session — for
  //    deployments that accept it directly (dev/basic modes, or a future
  //    Bearer introspection path). Harmless to send alongside the cookie.
  //
  // With no CMS session, no Authorization header is attached at all. That is
  // what makes the one exported `sendTemplateMail` helper work unchanged for
  // anonymous callers.
  const accessToken = sessionAccessToken()

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const response = await fetch(apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify({
      query,
      variables,
      operationName
    }),
    mode: 'cors',
    // Credentials only when there is something to send. An anonymous
    // visitor has no session and no Access cookie, and asking the browser
    // to include credentials anyway turns a plain cross-origin request into
    // a credentialed one, which the server must then answer with
    // Access-Control-Allow-Credentials or the browser blocks it outright.
    // That is what broke the public contact form: the preflight was
    // answered correctly and rejected anyway.
    credentials: accessToken ? 'include' : 'omit',
    ...fetchOptions
  })

  return await defaultResponseHandler(response)
}

const cache = new Cache(
  undefined,
  /**
   * Default option is immediate cache expiry but keep it for 5 minutes,
   * allowing soft refetches in background.
   */
  {
    maxAge: 0,
    staleWhileRevalidate: 5 * 60 * 1000,
    normalization: true
  }
)

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher
  }
})

// Core functions
export const {resolve, subscribe, schema} = client

// Legacy functions
export const {query, mutation, mutate, subscription, resolved, refetch, track} =
  client

export const {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    // Enable Suspense, you can override this option for each hook.
    suspense: true,
    initialLoadingState: true
  }
})

export * from './schema.generated'
