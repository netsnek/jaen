/**
 * GQty client for the emailwerk GraphQL API.
 */

import {User} from 'oidc-client-ts'

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

const queryFetcher: QueryFetcher = async function (
  {query, variables, operationName},
  fetchOptions
) {
  const headers: Record<string, string> = {}

  // Authentication is two-layered:
  //
  // 1. `credentials: 'include'` — production emailwerk sits behind Cloudflare
  //    Access; the CF_Authorization cookie set by the Access login carries the
  //    auth there (emailwerk itself only trusts the Cf-Access-Jwt-Assertion
  //    header CF Access derives from it).
  // 2. The Zitadel Bearer access token of the current Jaen session — for
  //    deployments that accept it directly (dev/basic modes, or a future
  //    Bearer introspection path). Harmless to send alongside the cookie.
  const oidcStorage = sessionStorage.getItem(
    `oidc.user:${__JAEN_ZITADEL_GQL__.authority}:${__JAEN_ZITADEL_GQL__.clientId}`
  )

  if (oidcStorage) {
    const user = User.fromStorageString(oidcStorage)

    if (user?.access_token) {
      headers['Authorization'] = `Bearer ${user.access_token}`
    }
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
    credentials: 'include',
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
