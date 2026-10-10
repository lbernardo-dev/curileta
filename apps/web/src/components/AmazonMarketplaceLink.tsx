'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import type { Locale } from '@curileta/i18n';
import { ExternalLink } from 'lucide-react';
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
  const [country, setCountry] = useState(() => normalizeAmazonCountry(initialCountry, locale));
  const marketplace = useMemo(() => findAmazonMarketplace(country), [country]);
  const isEn = locale === 'en';

  useEffect(() => {
    let savedCountry: string | null = null;
    try {
      savedCountry = localStorage.getItem('curileta-amazon-market');
    } catch {
      // Storage may be unavailable in private browsing; use the request region instead.
    }

    // Browser language is not a reliable location signal (for example, an English browser in Spain).
    setCountry(normalizeAmazonCountry(savedCountry || initialCountry, locale));
  }, [initialCountry, locale]);

  function changeCountry(value: string) {
    setCountry(value);
    try {
      localStorage.setItem('curileta-amazon-market', value);
    } catch {
      // The current selection remains usable even when persistence is unavailable.
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${compact ? 'items-start' : 'items-start sm:flex-row sm:items-center'}`}>
      <a
        href={getAmazonBookUrl(country, identifier)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ffcf65] px-5 py-3 text-sm font-bold text-[#20352c] shadow-md transition hover:-translate-y-0.5 hover:bg-[#ffd980] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
      >
        <span>{isEn ? 'Buy on Amazon' : 'Comprar en Amazon'}</span>
        <span className="text-xs font-semibold text-[#4b5846]">{marketplace.name[locale]}</span>
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
      <label htmlFor={selectId} className="flex items-center gap-2 text-xs font-medium text-current/75">
        <span>{isEn ? 'Store:' : 'Tienda:'}</span>
        <select
          id={selectId}
          value={country}
          onChange={(event) => changeCountry(event.target.value)}
          aria-label={isEn ? 'Choose Amazon marketplace' : 'Elegir tienda de Amazon'}
          className="max-w-[190px] rounded-full border border-current/20 bg-white/75 px-3 py-2 text-xs text-[#20352c] shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-700"
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
