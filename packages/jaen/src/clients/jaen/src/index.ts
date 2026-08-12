import {makeSnekQuery} from 'snek-query'

import {accessTokenFromOidcStorage} from '../../../utils/oidc-session'
import {Query, Mutation} from './schema.generated.js'

const apiURL = __JAEN_PYLON_URL__ || 'https://jaen-pylon.cronit.io/graphql'

export const sqJaen = makeSnekQuery(
  {Query, Mutation},
  {
    apiURL: apiURL,
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
