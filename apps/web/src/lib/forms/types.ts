export type ContactFieldType = 'text' | 'email' | 'textarea' | 'select' | 'checkbox';
export type ContactSystemField = 'name' | 'email' | 'company' | 'country' | 'category' | 'message' | 'adultConsent' | 'privacyConsent' | 'privacyAcknowledgement';

export interface LocalizedValue {
  es: string;
  en?: string;
}

export interface ContactFormOption {
  value: string;
  label: LocalizedValue;
}

export interface ContactFormField {
  key: string;
  type: ContactFieldType;
  system?: ContactSystemField;
  required: boolean;
  maxLength?: number;
  label: LocalizedValue;
  placeholder?: LocalizedValue;
  options?: ContactFormOption[];
}

export interface ContactFormConfig {
  id: string;
  slug: string;
  title: LocalizedValue;
  description: LocalizedValue;
  enabled: boolean;
  fields: ContactFormField[];
  notification_settings?: {
    defaultTo?: string;
    categoryRecipients?: Record<string, string>;
  };
}

export function localized(value: LocalizedValue | undefined, locale: string, fallback = '') {
  if (!value) return fallback;
  return locale === 'en' ? value.en || value.es || fallback : value.es || value.en || fallback;
}
