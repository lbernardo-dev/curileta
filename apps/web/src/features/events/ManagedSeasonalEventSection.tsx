'use client';

import type { SeasonalEvent } from '@curileta/cms';
import type { Locale } from '@curileta/i18n';
import { CalendarDays, Sparkles } from 'lucide-react';

export function ManagedSeasonalEventSection({ event, locale }: { event: SeasonalEvent; locale: Locale }) {
  const isEn = locale === 'en';
  const name = event.name[locale] || event.name.es;
  const description = event.tagline[locale] || event.tagline.es;
  const dateLocale = isEn ? 'en-GB' : 'es-ES';
  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', timeZone: event.timeZone || 'Europe/Madrid' };

  return <section id="evento-temporada" aria-labelledby="seasonal-event-title" className="bg-[var(--background-canvas)] px-5 py-16 text-[var(--text-primary)] sm:px-8 sm:py-24">
    <div className="mx-auto max-w-7xl rounded-2xl bg-[var(--background-secondary)] p-6 ring-1 ring-[var(--border-subtle)] sm:p-10">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--seasonal-accent-strong)]"><Sparkles className="h-4 w-4" />{isEn ? 'Seasonal story' : 'Historia de temporada'}</p>
          <h2 id="seasonal-event-title" className="mt-4 text-balance font-display text-3xl font-semibold sm:text-5xl">{name}</h2>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-[var(--text-secondary)]">{description}</p>
          <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><CalendarDays className="h-4 w-4 text-[var(--seasonal-accent-strong)]" />
            {new Intl.DateTimeFormat(dateLocale, dateOptions).format(new Date(event.startDate))} – {new Intl.DateTimeFormat(dateLocale, dateOptions).format(new Date(event.endDate))}
          </p>
        </div>
        {event.heroVideoUrl && <video controls playsInline preload="metadata" className="max-h-72 w-full rounded-xl bg-black sm:max-w-md" src={event.heroVideoUrl} />}
      </div>
    </div>
  </section>;
}
