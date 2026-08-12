import {PluginOptions} from 'gatsby'
import type {feedbackIntegration} from '@sentry/gatsby'

export interface JaenPluginOptions extends PluginOptions {
  /**
   * The OIDC provider jaen signs in against, and the Zitadel API it manages
   * users through. The two are separate concerns that happen to share a host
   * in the deployment this was written for.
   *
   * The sign-in half is plain OIDC and works against any provider. The two
   * places that were Zitadel-shaped are now options:
   *
   *   `scope`      Zitadel needs its own URN scopes to put the roles claim in
   *                the token and to set the audience. Another provider needs
   *                none of that. Left unset, the Zitadel scopes are derived
   *                from organizationId and projectIds, which is what every
   *                existing site expects.
   *
   *   `rolesClaim` where the roles live in the token. Zitadel writes an array
   *                of objects keyed by role name; most providers write a plain
   *                array of strings. Both shapes are read.
   *
   * `organizationId` and `projectIds` are only consulted while deriving the
   * default scope, so a non-Zitadel site can leave them out.
   */
  zitadelGql: {
    organizationId?: string
    clientId: string
    authority: string
    redirectUri: string
    projectIds?: string[]
    /** Overrides the derived scope entirely. */
    scope?: string
    /** Default: `urn:zitadel:iam:org:project:roles`. */
    rolesClaim?: string
  }

  googleAnalytics?: {
    trackingIds?: string[]
  }

  sentry?: {
    org: string
    project: string
    dsn: string
    feedbackIntegration?: Parameters<typeof feedbackIntegration>[0]
  }
}
