'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, Locale } from '@curileta/i18n';
import { Globe } from 'lucide-react';

export const LocaleSwitcher: React.FC<{ currentLocale: Locale }> = ({ currentLocale }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Sustituir el segmento de locale en la ruta actual sin perder el contexto
    const segments = pathname.split('/');
    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.unshift('', newLocale);
    }
    const newPath = segments.join('/') || `/${newLocale}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1.5 bg-emerald-950/60 p-1 rounded-full border border-emerald-800/50 text-xs font-bold text-slate-200">
      <Globe className="w-3.5 h-3.5 ml-1 text-emerald-400" aria-hidden="true" />
      {locales.map((loc) => {
        const isActive = loc === currentLocale;
        return (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                : 'hover:text-emerald-300 text-slate-300'
            }`}
            aria-label={`Cambiar a ${localeNames[loc]}`}
            aria-pressed={isActive}
          >
            {loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};
