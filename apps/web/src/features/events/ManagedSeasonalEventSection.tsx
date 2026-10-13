'use client';

import { useState } from 'react';
import type { SeasonalEvent } from '@curileta/cms';
import type { Locale } from '@curileta/i18n';
import { ContentImage } from '@/components/ContentImage';
import { CalendarDays, Download, Sparkles } from 'lucide-react';

export function ManagedSeasonalEventSection({ event, locale }: { event: SeasonalEvent; locale: Locale }) {
  const isEn = locale === 'en';
  const [revealed, setRevealed] = useState<string[]>([]);
  const name = event.name[locale] || event.name.es;
  const campaign = event.campaignContent;
  const campaignTitle = campaign?.title[locale] || campaign?.title.es || name;
  const campaignIntro = campaign?.intro[locale] || campaign?.intro.es || event.tagline[locale] || event.tagline.es;
  const activities = campaign?.activities || [];
  const dateLocale = isEn ? 'en-GB' : 'es-ES';
  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', timeZone: event.timeZone || 'Europe/Madrid' };

  function toggleReveal(id: string) {
    setRevealed((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return <section id="evento-temporada" aria-labelledby="seasonal-event-title" data-seasonal-section={event.themeKey} className="relative isolate overflow-hidden bg-[var(--background-canvas)] px-5 py-16 text-[var(--text-primary)] sm:px-8 sm:py-24">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--seasonal-accent)]" aria-hidden="true" />
    <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[var(--background-secondary)] ring-1 ring-[var(--border-subtle)]">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--seasonal-accent-strong)]"><Sparkles className="h-4 w-4" />{isEn ? 'A story for this season' : 'Una historia de temporada'}</p>
          <h2 id="seasonal-event-title" className="mt-4 max-w-3xl text-balance font-display text-3xl font-semibold sm:text-5xl">{campaignTitle}</h2>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[var(--text-secondary)]">{campaignIntro}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><CalendarDays className="h-4 w-4 text-[var(--seasonal-accent-strong)]" />
            {new Intl.DateTimeFormat(dateLocale, dateOptions).format(new Date(event.startDate))} – {new Intl.DateTimeFormat(dateLocale, dateOptions).format(new Date(event.endDate))}
          </p>
          <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--seasonal-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--seasonal-accent-strong)]"><span aria-hidden="true">{themeGlyph(event.themeKey)}</span>{isEn ? 'Explore the event' : 'Explora el evento'}</span>
        </div>
        <div className="relative min-h-64 bg-[var(--seasonal-surface-light)] dark:bg-[var(--seasonal-surface-dark)] lg:min-h-[26rem]">
          {event.bannerImage
            ? <ContentImage width={1200} height={900} src={event.bannerImage} alt={isEn ? `Illustration for ${name}` : `Ilustración de ${name}`} className="absolute inset-0 h-full w-full object-cover" />
            : <div className="flex h-full min-h-64 items-center justify-center text-8xl" aria-hidden="true">{themeGlyph(event.themeKey)}</div>}
          <div className="pointer-events-none absolute inset-0 border-[12px] border-white/20" aria-hidden="true" />
          {event.heroVideoUrl && <video controls playsInline preload="none" aria-label={isEn ? `Seasonal video for ${name}` : `Vídeo de temporada de ${name}`} className="absolute inset-x-4 bottom-4 max-h-48 w-[calc(100%-2rem)] rounded-xl bg-black shadow-xl sm:inset-x-6 sm:bottom-6 sm:w-[calc(100%-3rem)]" src={event.heroVideoUrl} />}
        </div>
      </div>

      <div className="border-t border-[var(--border-subtle)] px-6 py-7 sm:px-10 sm:py-9 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--seasonal-accent-strong)]">{isEn ? 'Play and make something' : 'Juega y crea algo'}</p>
            <h3 className="mt-2 text-xl font-semibold sm:text-2xl">{isEn ? 'Choose your next little adventure' : 'Elige tu próxima pequeña aventura'}</h3>
          </div>
          <span className="text-sm text-[var(--text-secondary)]">{activities.length} {isEn ? (activities.length === 1 ? 'activity' : 'activities') : (activities.length === 1 ? 'actividad' : 'actividades')}</span>
        </div>
        {activities.length ? <div className="mt-6 grid gap-4 md:grid-cols-2">
          {activities.map((activity) => {
            const title = activity.title[locale] || activity.title.es;
            const description = activity.description[locale] || activity.description.es;
            const isRevealed = revealed.includes(activity.id);
            return <article key={activity.id} className="flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--background-canvas)] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--seasonal-surface-light)] text-2xl dark:bg-[var(--seasonal-surface-dark)]" aria-hidden="true">{activity.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-semibold">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
                </div>
              </div>
              {activity.kind === 'download' ? <a href={activity.resourceUrl} download target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[var(--seasonal-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--seasonal-accent)]">
                <Download className="h-4 w-4" />{isEn ? 'Download and print' : 'Descargar e imprimir'}
              </a> : <>
                <button type="button" aria-expanded={isRevealed} onClick={() => toggleReveal(activity.id)} className="mt-5 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg border border-[var(--seasonal-accent)] px-4 py-2 text-sm font-semibold text-[var(--seasonal-accent-strong)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--seasonal-surface-light)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--seasonal-accent)] dark:hover:bg-[var(--seasonal-surface-dark)]">
                  <Sparkles className="h-4 w-4" />{isRevealed ? (isEn ? 'Hide the answer' : 'Ocultar respuesta') : (isEn ? 'Reveal the answer' : 'Descubrir la respuesta')}
                </button>
                {isRevealed && <p role="status" className="mt-4 rounded-lg bg-[var(--seasonal-surface-light)] p-4 text-sm leading-6 dark:bg-[var(--seasonal-surface-dark)]">{activity.reveal[locale] || activity.reveal.es}</p>}
              </>}
            </article>;
          })}
        </div> : <p className="mt-5 rounded-xl border border-[var(--border-subtle)] p-5 text-sm text-[var(--text-secondary)]">{isEn ? 'The story is ready. Activities will appear here when they are added in the event editor.' : 'La historia está lista. Las actividades aparecerán aquí cuando se añadan desde la edición del evento.'}</p>}
      </div>
    </div>
  </section>;
}

function themeGlyph(themeKey: string) {
  const glyphs: Record<string, string> = {
    halloween: '🎃', christmas: '❄️', easter: '🐣', valentines: '💗', 'new-year': '✨',
    'lunar-new-year': '🏮', spring: '🌸', summer: '🌊', autumn: '🍂', 'earth-day': '🌍',
    'world-book-day': '📚', pride: '🌈', 'st-patrick': '🍀', 'day-of-the-dead': '🌼',
    'world-childrens-day': '🧩', diwali: '🪔',
  };
  return glyphs[themeKey] || '✨';
}
