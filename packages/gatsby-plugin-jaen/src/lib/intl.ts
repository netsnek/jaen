import {IntlShape} from 'react-intl'

type IntlContext = {
  intl: IntlShape
}

type IntlField<T> = (context: IntlContext) => T

export const intlText = (
  id: string,
  defaultMessage?: string
): IntlField<string> & string =>
  (({intl}) => intl.formatMessage({id, defaultMessage})) as unknown as string
