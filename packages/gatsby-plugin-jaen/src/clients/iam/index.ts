import {User as OIDCUser} from 'oidc-client-ts'

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

declare const __JAEN_ZITADEL__: {authority: string; clientId: string}
declare const __JAEN_IAM_PYLON_URL__: string | undefined

const apiURL =
  typeof __JAEN_IAM_PYLON_URL__ !== 'undefined' && __JAEN_IAM_PYLON_URL__
    ? __JAEN_IAM_PYLON_URL__
    : 'https://iam-limosen.netsnek.workers.dev/graphql'

const queryFetcher: QueryFetcher = async (
  {query, variables, operationName},
  fetchOptions
) => {
  const headers: Record<string, string> = {}

  if (typeof sessionStorage !== 'undefined') {
    const oidcStorage = sessionStorage.getItem(
      `oidc.user:${__JAEN_ZITADEL__.authority}:${__JAEN_ZITADEL__.clientId}`
    )

    if (oidcStorage) {
      const user = OIDCUser.fromStorageString(oidcStorage)

      if (user?.access_token) {
        headers['Authorization'] = `Bearer ${user.access_token}`
      }
    }
  }

  const response = await fetch(apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify({query, variables, operationName}),
    mode: 'cors',
    ...fetchOptions
  })

  return await defaultResponseHandler(response)
}

const cache = new Cache(undefined, {
  maxAge: 0,
  staleWhileRevalidate: 5 * 60 * 1000,
  normalization: true
})

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher
  }
})

export const {resolve, subscribe, schema} = client

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
    suspense: true,
    initialLoadingState: true
  }
})

export * from './schema.generated'
