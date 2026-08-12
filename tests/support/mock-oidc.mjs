/**
 * A real OIDC provider for local development, small enough to read.
 *
 *   node tests/support/mock-oidc.mjs [port]        default 9099
 *
 * Point a site's jaen plugin options at it and sign in with admin / jaen:
 *
 *   zitadelGql: {
 *     authority:   'http://127.0.0.1:9099',
 *     clientId:    'jaen-dev',
 *     redirectUri: 'http://127.0.0.1:8000/cms/',
 *     rolesClaim:  'roles'
 *   }
 *
 * Leave organizationId out. Without it jaen derives a plain OIDC scope instead
 * of Zitadel's URN scopes, which is the point: this server is deliberately NOT
 * a Zitadel imitation. If jaen only works against something Zitadel-shaped,
 * that is a coupling worth finding, and running against this is how you find
 * it.
 *
 * Authorization code with PKCE, RS256, discovery and JWKS, so oidc-client-ts
 * validates the token the same way it would against a real provider. Nothing
 * is persisted and the key is generated per start: it exists to be thrown away.
 *
 * NOT FOR ANYTHING BUT LOCALHOST. It accepts one hard-coded credential and
 * issues admin tokens to whoever asks correctly.
 */
import {
  createHash,
  generateKeyPairSync,
  randomUUID,
  createSign
} from 'node:crypto'
import {createServer} from 'node:http'

const PORT = Number(process.argv[2] || 9099)
const ISSUER = `http://127.0.0.1:${PORT}`

const USERNAME = 'admin'
const PASSWORD = 'jaen'

/** The one account, shaped like a normal OIDC profile. */
const USER = {
  sub: '00000000-0000-4000-8000-000000000001',
  name: 'Admin',
  given_name: 'Admin',
  family_name: 'Local',
  preferred_username: 'admin',
  email: 'admin@localhost',
  email_verified: true,
  locale: 'de',
  // Plain array of strings, which is what most providers emit. jaen reads that
  // shape and Zitadel's object shape alike.
  roles: ['jaen:admin']
}

const {publicKey, privateKey} = generateKeyPairSync('rsa', {
  modulusLength: 2048
})
const KID = randomUUID()
const jwk = publicKey.export({format: 'jwk'})

const b64 = input =>
  Buffer.from(
    typeof input === 'string' ? input : JSON.stringify(input)
  ).toString('base64url')

const sign = claims => {
  const head = b64({alg: 'RS256', typ: 'JWT', kid: KID})
  const body = b64(claims)
  const signer = createSign('RSA-SHA256')
  signer.update(`${head}.${body}`)

  return `${head}.${body}.${signer.sign(privateKey, 'base64url')}`
}

/** code -> what /token needs to honour the exchange. Single use. */
const codes = new Map()

const send = (res, status, body, type = 'application/json') => {
  const payload = type === 'application/json' ? JSON.stringify(body) : body
  res.writeHead(status, {
    'content-type': type,
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'cache-control': 'no-store'
  })
  res.end(payload)
}

const loginPage = (params, error) => `<!doctype html>
<meta charset="utf-8"><title>jaen dev login</title>
<style>
 body{font:16px system-ui;display:grid;place-items:center;height:100vh;margin:0;background:#f4f8fa}
 form{background:#fff;padding:2rem;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.1);min-width:18rem}
 h1{font-size:1rem;margin:0 0 1rem;color:#f77f00}
 label{display:block;margin:.75rem 0 .25rem;font-size:.85rem;color:#4A5568}
 input{width:100%;padding:.5rem;border:1px solid #CBD5E0;border-radius:6px;font:inherit;box-sizing:border-box}
 button{margin-top:1.25rem;width:100%;padding:.6rem;border:0;border-radius:8px;background:#f77f00;color:#fff;font:inherit;cursor:pointer}
 .e{color:#c53030;font-size:.85rem;margin-top:.75rem}
 .h{margin-top:1rem;font-size:.8rem;color:#718096}
</style>
<form method="post">
  <h1>jaen &middot; lokale Anmeldung</h1>
  ${[...params].map(([k, v]) => `<input type="hidden" name="${k}" value="${String(v).replace(/"/g, '&quot;')}">`).join('')}
  <label>Benutzer</label><input name="username" value="admin" autofocus>
  <label>Passwort</label><input name="password" type="password" value="jaen">
  <button>Anmelden</button>
  ${error ? `<div class="e">${error}</div>` : ''}
  <div class="h">Mock-Provider. Nur fuer localhost.</div>
</form>`

const server = createServer(async (req, res) => {
  const url = new URL(req.url, ISSUER)

  if (req.method === 'OPTIONS') return send(res, 204, '')

  if (url.pathname === '/.well-known/openid-configuration') {
    return send(res, 200, {
      issuer: ISSUER,
      authorization_endpoint: `${ISSUER}/authorize`,
      token_endpoint: `${ISSUER}/token`,
      userinfo_endpoint: `${ISSUER}/userinfo`,
      jwks_uri: `${ISSUER}/keys`,
      end_session_endpoint: `${ISSUER}/logout`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      code_challenge_methods_supported: ['S256'],
      scopes_supported: ['openid', 'profile', 'email', 'offline_access'],
      claims_supported: [...Object.keys(USER), 'iss', 'aud', 'exp', 'iat']
    })
  }

  if (url.pathname === '/keys') {
    return send(res, 200, {
      keys: [{...jwk, kid: KID, use: 'sig', alg: 'RS256'}]
    })
  }

  if (url.pathname === '/authorize') {
    if (req.method === 'GET') {
      return send(
        res,
        200,
        loginPage(url.searchParams),
        'text/html; charset=utf-8'
      )
    }

    const body = await new Promise(resolve => {
      let s = ''
      req.on('data', c => (s += c))
      req.on('end', () => resolve(new URLSearchParams(s)))
    })

    if (
      body.get('username') !== USERNAME ||
      body.get('password') !== PASSWORD
    ) {
      body.delete('username')
      body.delete('password')
      return send(
        res,
        200,
        loginPage(body, 'Falsche Zugangsdaten.'),
        'text/html; charset=utf-8'
      )
    }

    const code = randomUUID()
    codes.set(code, {
      client_id: body.get('client_id'),
      redirect_uri: body.get('redirect_uri'),
      nonce: body.get('nonce'),
      code_challenge: body.get('code_challenge'),
      code_challenge_method: body.get('code_challenge_method')
    })

    const back = new URL(body.get('redirect_uri'))
    back.searchParams.set('code', code)
    if (body.get('state')) back.searchParams.set('state', body.get('state'))

    res.writeHead(302, {location: back.toString()})
    return res.end()
  }

  if (url.pathname === '/token') {
    const body = await new Promise(resolve => {
      let s = ''
      req.on('data', c => (s += c))
      req.on('end', () => resolve(new URLSearchParams(s)))
    })

    const grant = body.get('grant_type')
    let stored = {}

    if (grant === 'authorization_code') {
      const code = body.get('code')
      stored = codes.get(code)
      if (!stored) return send(res, 400, {error: 'invalid_grant'})
      codes.delete(code)

      // PKCE, verified rather than waved through, so the client's own checks
      // exercise the same path they would against a real provider.
      if (stored.code_challenge) {
        const verifier = body.get('code_verifier') || ''
        const got = createHash('sha256').update(verifier).digest('base64url')
        if (got !== stored.code_challenge) {
          return send(res, 400, {
            error: 'invalid_grant',
            error_description: 'PKCE mismatch'
          })
        }
      }
    } else if (grant !== 'refresh_token') {
      return send(res, 400, {error: 'unsupported_grant_type'})
    }

    const now = Math.floor(Date.now() / 1000)
    const aud = stored.client_id || body.get('client_id') || 'jaen-dev'
    const claims = {
      ...USER,
      iss: ISSUER,
      aud,
      exp: now + 3600,
      iat: now,
      auth_time: now,
      ...(stored.nonce ? {nonce: stored.nonce} : {})
    }

    return send(res, 200, {
      access_token: sign(claims),
      id_token: sign(claims),
      refresh_token: 'dev-refresh',
      token_type: 'Bearer',
      expires_in: 3600,
      scope: body.get('scope') || 'openid profile email offline_access'
    })
  }

  if (url.pathname === '/userinfo') return send(res, 200, USER)

  if (url.pathname === '/logout') {
    const back = url.searchParams.get('post_logout_redirect_uri')
    if (back) {
      res.writeHead(302, {location: back})
      return res.end()
    }
    return send(res, 200, {ok: true})
  }

  send(res, 404, {error: 'not_found'})
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`mock OIDC auf ${ISSUER}   Anmeldung: ${USERNAME} / ${PASSWORD}`)
})
