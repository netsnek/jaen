import {makeSnekQuery} from 'snek-query'
import 'jaen/dist/types'

import {Query, Mutation} from './schema.generated'

const apiURL = process.env.GATSBY_LENS_API_URL

if (!apiURL) {
  throw new Error('GATSBY_LENS_API_URL is not set')
}

/**
 * The access token of the current Jaen CMS session, read without
 * oidc-client-ts.
 *
 * This used to be `User.fromStorageString(s).access_token`, a value import
 * that could not be erased as a type and attributed 201 KB of source to
 * oidc-client-ts in the always-loaded `app` chunk, measured by source-map
 * attribution on a cold load of netsnek.com's home page. The library call is
 * only `new User(JSON.parse(storageString))` (2.4.0,
 * dist/esm/oidc-client-ts.js), and its `toStorageString` counterpart writes
 * `access_token` as a plain top-level string.
 *
 * Duplicated from jaen's `utils/oidc-session.ts` rather than imported: jaen's
 * exports map exposes no subpath for it, and going through the barrel would
 * pull the whole framework into this client.
 */
function accessTokenFromOidcStorage(
  storageString: string | null
): string | null {
  if (!storageString) return null

  try {
    const stored = JSON.parse(storageString) as {access_token?: unknown} | null
    const accessToken = stored?.access_token

    return typeof accessToken === 'string' && accessToken !== ''
      ? accessToken
      : null
  } catch {
    // Malformed session state is no session, and an unparseable string must
    // not take the whole request down: the old code let `JSON.parse` throw
    // straight out of the middleware.
    return null
  }
}

export const sq = makeSnekQuery(
  {Query, Mutation},
  {
    apiURL,
    middlewares: [
      ({context}) => {
        const accessToken = accessTokenFromOidcStorage(
          sessionStorage.getItem(
            `oidc.user:${__JAEN_ZITADEL_GQL__.authority}:${__JAEN_ZITADEL_GQL__.clientId}`
          )
        )

        if (accessToken) {
          context.headers['Authorization'] = `Bearer ${accessToken}`
        }
      }
    ]
  }
)
