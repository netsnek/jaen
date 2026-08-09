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
