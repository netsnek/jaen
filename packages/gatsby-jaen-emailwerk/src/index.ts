import {GQtyError} from 'gqty'
import {resolve} from './client'

/**
 * Mailpress-shaped envelope accepted by {@link sendTemplateMail}. Kept for
 * drop-in compatibility with existing gatsby-jaen-mailpress consumers.
 */
export interface Envelope {
  to?: string[]
  subject?: string
  replyTo?: string
}

export type SendTemplateMailResult =
  | {ok: true; message: string}
  | {ok: false; message: string; errors?: unknown[]}

/**
 * Send a templated mail through emailwerk.
 *
 * This is the ONE send helper, for both kinds of caller — mailpress parity
 * means one mutation, and emailwerk keeps it that way: authenticated CMS code
 * and an anonymous website visitor post the same `sendTemplateMail` operation
 * to the same `/graphql`. Which branch runs is decided by the server from the
 * presence of a principal, never by the caller picking a different call. The
 * client attaches an `Authorization` header only when an OIDC session exists in
 * `sessionStorage` (see `./client`), so a public contact form reaches the
 * anonymous branch simply by having no session. There is deliberately no second
 * helper, no separate endpoint and no anonymous flag to pass.
 *
 * The public shape stays mailpress-compatible (`id` + optional envelope /
 * values) and is mapped onto emailwerk's
 * `sendTemplateMail(args: {templateId, to, values, envelopeOverride})`:
 *
 * - `envelope.to`      -> `to` (optional: an empty list falls back to the
 *   template's STORED envelope recipients server-side, so sending only
 *   needs the emailwerk:send role — no template read required)
 * - `envelope.subject` -> `envelopeOverride.subject`
 * - `envelope.replyTo` -> `envelopeOverride.replyTo`
 * - `values`           -> `values`
 *
 * ## Authenticated callers (a Jaen CMS session)
 *
 * Unchanged, and unrestricted: explicit recipients, a subject override,
 * scheduling and signature holds all work as before.
 *
 * ## Anonymous callers (a public website form, no session)
 *
 * The template must be flagged `isPublic` by an admin; the id alone is never an
 * authorization, and a missing template and a non-public one report the same
 * error so the mutation cannot be used as an existence oracle. Only these two
 * inputs may be passed:
 *
 * - `envelope.replyTo` — the requester's own address, so the recipient can just
 *   hit reply. Must be a single valid address.
 * - `values` — the form fields. Primitives only (string / number / boolean /
 *   null), 16 KB serialized.
 *
 * **Recipients come from the template's stored envelope, server-side.** Passing
 * `envelope.to` is rejected rather than ignored — that is exactly the mailpress
 * open relay this replaces, where whoever knew a template id chose where the
 * mail went. `envelope.subject` is rejected for the same reason (the subject is
 * part of what the template owner published; rewriting it is a phishing
 * vector), as are scheduling and any signature/PGP argument. Templates with
 * `verifyReplyTo` or `requiresSignature` are not publicly sendable at all. Every
 * refusal is an error, never a silent drop, so a misconfigured form fails
 * loudly. The path is rate limited per client IP and globally.
 *
 * **Do not send the confirmation mail yourself.** The server enqueues the
 * linked public child template — one level of `links` children that are
 * themselves `isPublic` — to the requester (`envelope.replyTo`, else a valid
 * `values.email`), exactly as mailpress delivered linked templates. It is best
 * effort: a failing child never fails this call. A second explicit call for the
 * confirmation would deliver it twice.
 *
 * The resolved value is always the INQUIRY's message row, for both branches, so
 * the result-union handling below is identical either way.
 *
 * @see emailwerk `docs/public-send.md` for the full contract.
 */
export const sendTemplateMail = async (
  id: string,
  options?: {
    envelope?: Partial<Envelope>
    values?: Record<string, unknown>
  }
): Promise<SendTemplateMailResult> => {
  try {
    const to = options?.envelope?.to?.filter(Boolean) ?? []

    const subject = options?.envelope?.subject
    const replyTo = options?.envelope?.replyTo
    const envelopeOverride =
      subject || replyTo
        ? {
            subject: subject || undefined,
            replyTo: replyTo || undefined
          }
        : undefined

    await resolve(
      ({mutation}) => {
        const message = mutation.sendTemplateMail({
          args: {
            templateId: id,
            ...(to.length > 0 ? {to} : {}),
            values: options?.values,
            envelopeOverride
          }
        })

        // Select the fields of the queued message we care about.
        return {id: message.id, status: message.status}
      },
      {
        cachePolicy: 'no-store'
      }
    )

    return {
      ok: true,
      message: 'Mail sent successfully'
    }
  } catch (error: unknown) {
    if (error instanceof GQtyError) {
      return {
        ok: false,
        message: 'Failed to send mail',
        errors: (error.graphQLErrors ?? []) as unknown[]
      }
    }

    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
