/**
 * Reading the access token out of a stored OIDC session, without importing
 * oidc-client-ts.
 *
 * The three GraphQL clients (this package's, gatsby-jaen-emailwerk's and
 * gatsby-jaen-lens's) each used the library for a single call:
 * `User.fromStorageString(s).access_token`. That is a value import, so it
 * cannot be erased as a type, and it attributes 201 KB of source to
 * oidc-client-ts in the always-loaded `app` chunk — measured by source-map
 * attribution on a cold load of netsnek.com's home page. Every anonymous
 * visitor downloads and parses it, and an anonymous visitor never has a
 * session to read in the first place.
 *
 * Nothing is being reimplemented here. `User.fromStorageString` is, in full
 * (oidc-client-ts 2.4.0, dist/esm/oidc-client-ts.js):
 *
 *     static fromStorageString(storageString) {
 *       Logger.createStatic("User", "fromStorageString");
 *       return new User(JSON.parse(storageString));
 *     }
 *
 * and its counterpart writes a flat object keyed by the constructor's own
 * argument names:
 *
 *     toStorageString() {
 *       new Logger("User").create("toStorageString");
 *       return JSON.stringify({
 *         id_token: this.id_token,
 *         session_state: this.session_state,
 *         access_token: this.access_token,
 *         refresh_token: this.refresh_token,
 *         token_type: this.token_type,
 *         scope: this.scope,
 *         profile: this.profile,
 *         expires_at: this.expires_at
 *       });
 *     }
 *
 * So `access_token` is a plain top-level string that the constructor copies
 * across verbatim. Rebuilding the class adds a logger call and seven other
 * assignments, none of which the callers read.
 *
 * The key this is stored under stays the library's — `oidc.user:{authority}:
 * {clientId}` — because oidc-client-ts, loaded lazily elsewhere, is still the
 * only writer.
 */
export function accessTokenFromOidcStorage(
  storageString: string | null | undefined
): string | null {
  if (!storageString) return null

  try {
    const stored = JSON.parse(storageString) as {access_token?: unknown} | null
    const accessToken = stored?.access_token

    return typeof accessToken === 'string' && accessToken !== ''
      ? accessToken
      : null
  } catch {
    // Malformed session state is no session. `JSON.parse` is the only step
    // that can throw, and it is the same one `User.fromStorageString` hit.
    return null
  }
}
