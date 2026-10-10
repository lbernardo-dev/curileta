import type { Locale } from '@curileta/i18n';

export const CURILETA_BOOK_SLUG = 'las-aventuras-de-curileta';
export const CURILETA_BOOK_ASIN = 'B0H2CT8S14';
export const CURILETA_BOOK_ISBN = '9798196216145';

export interface AmazonMarketplace {
  country: string;
  name: { es: string; en: string };
  domain: string;
}

export const AMAZON_MARKETPLACES: AmazonMarketplace[] = [
  { country: 'ES', name: { es: 'España', en: 'Spain' }, domain: 'amazon.es' },
  { country: 'US', name: { es: 'Estados Unidos', en: 'United States' }, domain: 'amazon.com' },
  { country: 'MX', name: { es: 'México', en: 'Mexico' }, domain: 'amazon.com.mx' },
  { country: 'GB', name: { es: 'Reino Unido', en: 'United Kingdom' }, domain: 'amazon.co.uk' },
  { country: 'DE', name: { es: 'Alemania', en: 'Germany' }, domain: 'amazon.de' },
  { country: 'FR', name: { es: 'Francia', en: 'France' }, domain: 'amazon.fr' },
  { country: 'IT', name: { es: 'Italia', en: 'Italy' }, domain: 'amazon.it' },
  { country: 'NL', name: { es: 'Países Bajos', en: 'Netherlands' }, domain: 'amazon.nl' },
  { country: 'BE', name: { es: 'Bélgica', en: 'Belgium' }, domain: 'amazon.com.be' },
  { country: 'PL', name: { es: 'Polonia', en: 'Poland' }, domain: 'amazon.pl' },
  { country: 'SE', name: { es: 'Suecia', en: 'Sweden' }, domain: 'amazon.se' },
  { country: 'CA', name: { es: 'Canadá', en: 'Canada' }, domain: 'amazon.ca' },
  { country: 'AU', name: { es: 'Australia', en: 'Australia' }, domain: 'amazon.com.au' },
  { country: 'JP', name: { es: 'Japón', en: 'Japan' }, domain: 'amazon.co.jp' },
  { country: 'BR', name: { es: 'Brasil', en: 'Brazil' }, domain: 'amazon.com.br' },
  { country: 'SG', name: { es: 'Singapur', en: 'Singapore' }, domain: 'amazon.sg' },
  { country: 'IN', name: { es: 'India', en: 'India' }, domain: 'amazon.in' },
  { country: 'AE', name: { es: 'Emiratos Árabes Unidos', en: 'United Arab Emirates' }, domain: 'amazon.ae' },
  { country: 'SA', name: { es: 'Arabia Saudí', en: 'Saudi Arabia' }, domain: 'amazon.sa' },
  { country: 'TR', name: { es: 'Turquía', en: 'Turkey' }, domain: 'amazon.com.tr' },
  { country: 'EG', name: { es: 'Egipto', en: 'Egypt' }, domain: 'amazon.eg' },
];

const COUNTRY_ALIASES: Record<string, string> = {
  AT: 'DE', CH: 'DE', LI: 'DE', LU: 'DE',
  IE: 'GB', PT: 'ES',
  DK: 'SE', NO: 'SE', FI: 'SE',
  NZ: 'AU',
};

export function normalizeAmazonCountry(countryCode: string | null | undefined, locale: Locale): string {
  const normalized = countryCode?.trim().toUpperCase();
  const country = normalized ? (COUNTRY_ALIASES[normalized] || normalized) : '';
  if (AMAZON_MARKETPLACES.some((marketplace) => marketplace.country === country)) return country;
  return locale === 'es' ? 'ES' : 'US';
}

export function detectAmazonCountryFromHeaders(headers: Pick<Headers, 'get'>): string | null {
  const value =
    headers.get('x-vercel-ip-country') ||
    headers.get('cf-ipcountry') ||
    headers.get('cloudfront-viewer-country') ||
    headers.get('x-country-code');
  const country = value?.trim().toUpperCase();
  return country && /^[A-Z]{2}$/.test(country) && country !== 'XX' && country !== 'T1'
    ? country
    : null;
}

export function findAmazonMarketplace(country: string): AmazonMarketplace {
  return AMAZON_MARKETPLACES.find((marketplace) => marketplace.country === country) ||
    AMAZON_MARKETPLACES.find((marketplace) => marketplace.country === 'US')!;
}

export function getAmazonBookUrl(country: string, identifier = CURILETA_BOOK_ASIN): string {
  const marketplace = findAmazonMarketplace(country);
  return `https://www.${marketplace.domain}/dp/${encodeURIComponent(identifier)}`;
}

export function getAmazonIdentifier(purchaseLinks: Array<{ storeName: string; url: string }> = []): string | undefined {
  for (const link of purchaseLinks) {
    if (!/amazon/i.test(link.storeName) && !/amazon\./i.test(link.url)) continue;
    const match = link.url.match(/\/dp\/([A-Z0-9]{10})(?:[/?]|$)/i);
    if (match) return match[1].toUpperCase();
  }
}
