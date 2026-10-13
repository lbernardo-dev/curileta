'use client';

import { useId, useMemo } from 'react';
import type { Locale } from '@curileta/i18n';
import { analytics } from '@curileta/analytics';
import { ExternalLink } from 'lucide-react';
import { setBrowserStorageValue, useBrowserStorageValue } from '@/lib/browser-storage';
import {
  AMAZON_MARKETPLACES,
  CURILETA_BOOK_ASIN,
  findAmazonMarketplace,
  getAmazonBookUrl,
  normalizeAmazonCountry,
} from '@/lib/amazon-marketplace';

interface AmazonMarketplaceLinkProps {
  locale: Locale;
  initialCountry: string | null;
  identifier?: string;
  compact?: boolean;
}

export function AmazonMarketplaceLink({
  locale,
  initialCountry,
  identifier = CURILETA_BOOK_ASIN,
  compact = false,
}: AmazonMarketplaceLinkProps) {
  const selectId = useId();
  const defaultCountry = normalizeAmazonCountry(initialCountry, locale);
  const savedCountry = useBrowserStorageValue('local', 'curileta-amazon-market', defaultCountry);
  const country = normalizeAmazonCountry(savedCountry, locale);
  const marketplace = useMemo(() => findAmazonMarketplace(country), [country]);
  const isEn = locale === 'en';

  function changeCountry(value: string) {
    setBrowserStorageValue('local', 'curileta-amazon-market', value);
  }

  return (
    <div className={`flex flex-col gap-3 ${compact ? 'w-full max-w-sm items-stretch' : 'items-start sm:flex-row sm:items-center'}`}>
      <a
        href={getAmazonBookUrl(country, identifier)}
        onClick={() => analytics.track({ name: 'book_purchase_click', properties: { bookId: identifier, storeName: 'Amazon' } })}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex min-h-12 min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full bg-[#ffcf65] px-5 py-3 text-base font-semibold !text-[#20352c] shadow-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#ffd980] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${compact ? "w-full" : ""}`}
      >
        <span>{isEn ? 'Buy on Amazon' : 'Comprar en Amazon'}</span>
        {!compact && <span className="min-w-0 text-center text-xs font-semibold text-[#4b5846]">{marketplace.name[locale]}</span>}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
      <label htmlFor={selectId} className={`text-xs font-medium text-current/75 ${compact ? "flex w-full flex-col items-start gap-1.5" : "flex items-center gap-2"}`}>
        <span>{isEn ? 'Store:' : 'Tienda:'}</span>
        <select
          id={selectId}
          value={country}
          onChange={(event) => changeCountry(event.target.value)}
          aria-label={isEn ? 'Choose Amazon marketplace' : 'Elegir tienda de Amazon'}
          className={`max-w-[190px] rounded-full border border-current/20 bg-white/75 px-3 py-2 text-xs !text-[#20352c] shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${compact ? "w-full max-w-none" : "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"}`}
        >
          {AMAZON_MARKETPLACES.map((market) => (
            <option key={market.country} value={market.country}>
              {market.name[locale]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
