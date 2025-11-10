import {GQtyError} from 'gqty'
import {EnvelopeInput, resolve} from './client'

type SendTemplateMailResult =
  | {ok: true; message: string}
  | {ok: false; message: string; errors?: unknown[]}

export const sendTemplateMail = async (
  id: string,
  options?: {
    envelope?: Partial<EnvelopeInput>
    values?: Record<string, unknown>
  }
): Promise<SendTemplateMailResult> => {
  try {
    await resolve(
      ({mutation}) => {
        const mail = mutation.sendTemplateMail({
          id,
          envelope: options?.envelope,
          values: options?.values
        })
        return mail
      },
      {cachePolicy: 'no-store'}
    )

    return {ok: true, message: 'Mail sent successfully'}
  } catch (error: unknown) {
    if (error instanceof GQtyError) {
      return {
        ok: false,
        message: 'Failed to send mail',
        // avoid leaking graphql types into your public return type
        errors: (error.graphQLErrors ?? []) as unknown[]
      }
    }

    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
