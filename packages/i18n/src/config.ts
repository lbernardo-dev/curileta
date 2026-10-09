export const defaultLocale = 'es' as const;
export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
