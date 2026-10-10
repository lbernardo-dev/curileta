'use client';

import React from 'react';
import { Locale } from '@curileta/i18n';
import { useSeasonalTheme } from '@/providers/SeasonalThemeProvider';
import { Calendar, ChevronRight, Eye, Palette, Sparkles } from 'lucide-react';

const EVENT_SYMBOL: Record<string, string> = {
  halloween: '🎃',
  christmas: '✦',
  spring: '🌼',
  easter: '🐣',
  summer: '☀️',
  valentines: '♥',
};

export const SeasonalBanner: React.FC<{ locale: Locale }> = ({ locale }) => {
  const { activeEvent, isSeasonalActive, isUserDismissed, toggleSeasonalTheme } = useSeasonalTheme();

  if (!activeEvent || !activeEvent.active) return null;

  const isEn = locale === 'en';
  const eventName = activeEvent.name[locale] || activeEvent.name.es;
  const endDate = new Intl.DateTimeFormat(isEn ? 'en-US' : 'es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(activeEvent.endDate));
  const canExploreEvent = activeEvent.themeKey === 'halloween';

  return (
    <div
      role="banner"
      aria-label={isEn ? 'Seasonal event announcement' : 'Aviso de evento estacional'}
      className="relative z-50 w-full border-b border-white/10 bg-[linear-gradient(105deg,var(--seasonal-banner-start),var(--seasonal-banner-end))] px-3 py-2.5 text-white shadow-md sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-base shadow-inner">
            {EVENT_SYMBOL[activeEvent.themeKey] || <Sparkles className="h-4 w-4" />}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">
                {isEn ? 'A little seasonal magic' : 'Una magia de temporada'}
              </span>
              <span className="hidden items-center gap-1 text-[10px] font-medium text-white/55 sm:inline-flex">
                <Calendar className="h-3 w-3" />
                {isEn ? `Through ${endDate}` : `Hasta el ${endDate}`}
              </span>
            </div>
            <p className="truncate text-xs font-semibold text-white sm:text-sm">{eventName}</p>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {canExploreEvent && isSeasonalActive && (
            <a
              href="#evento-halloween"
              className="inline-flex min-h-8 items-center gap-1 rounded-full bg-[var(--seasonal-accent)] px-3 py-1.5 text-xs font-bold text-slate-950 shadow-sm transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>{isEn ? 'Explore' : 'Explorar'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          )}

          <button
            type="button"
            onClick={toggleSeasonalTheme}
            aria-pressed={isSeasonalActive}
            className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/90 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            title={isEn
              ? isUserDismissed ? 'Restore the seasonal theme' : 'Temporarily view the regular theme'
              : isUserDismissed ? 'Volver a activar el tema de temporada' : 'Ver temporalmente el tema habitual'}
          >
            {isUserDismissed ? <Eye className="h-3.5 w-3.5" /> : <Palette className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">
              {isUserDismissed
                ? isEn ? 'Restore theme' : 'Activar ambiente'
                : isEn ? 'View regular theme' : 'Ver tema habitual'}
            </span>
            <span className="sm:hidden" aria-hidden="true">{isUserDismissed ? '↺' : '◐'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
