export * from './config';
import esMessages from './messages/es.json';
import enMessages from './messages/en.json';

export const messages = {
  es: esMessages,
  en: enMessages,
} as const;

export function getMessages(locale: string) {
  if (locale === 'en') return enMessages;
  return esMessages;
}
