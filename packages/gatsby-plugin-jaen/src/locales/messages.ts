// src/locales/messages.ts
import {getI18n} from './i18n'

export const messagesByLocale = {
  'en-US': getI18n('en-US').messages,
  'de-AT': getI18n('de-AT').messages,
  'sl-SI': getI18n('sl-SI').messages,
  'it-IT': getI18n('it-IT').messages,
  'ja-JP': getI18n('ja-JP').messages,
  'tr-TR': getI18n('tr-TR').messages,
  'ar-EG': getI18n('ar-EG').messages
} as const
