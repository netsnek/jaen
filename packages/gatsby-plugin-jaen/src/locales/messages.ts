// src/locales/messages.ts
import {getI18n} from './i18n'

export const messagesByLocale = {
  'en-US': getI18n('en-US').messages,
  'de-AT': getI18n('de-AT').messages,
  'tr-TR': getI18n('tr-TR').messages,
  'ar-EG': getI18n('ar-EG').messages
} as const
