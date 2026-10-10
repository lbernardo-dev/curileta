import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cmsProvider } from '@curileta/cms';
import { isValidLocale, type Locale } from '@curileta/i18n';
import { ArrowRight, CalendarDays, Clock3, Mail, Sparkles } from 'lucide-react';
import { SitePageCard, SitePageLayout } from '@/components/SitePageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Events and seasonal stories', description: 'Current seasonal stories and announced Curileta events.' }
    : { title: 'Eventos y aventuras de temporada', description: 'Historias de temporada y eventos de Curileta anunciados.' };
}

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isEn = locale === 'en';
  const event = await cmsProvider.getActiveEvent(locale);
  const dateLocale = isEn ? 'en-GB' : 'es-ES';
  const formatDate = (value: string) => new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));

  return (
    <SitePageLayout
      locale={locale as Locale}
      eyebrow={isEn ? 'Seasonal adventures' : 'Aventuras de temporada'}
      title={isEn ? 'Stories to share all year' : 'Historias para compartir todo el año'}
      description={isEn
        ? 'Special chapters and public appearances are listed here when they are announced. Seasonal themes may also bring new activities to the site.'
        : 'Aquí aparecerán los capítulos especiales y encuentros públicos cuando se anuncien. Las temporadas también pueden traer nuevas actividades a la web.'}
      icon={<CalendarDays className="h-4 w-4" />}
    >
      {event ? (
        <SitePageCard className="overflow-hidden !p-0">
          <div className="relative overflow-hidden bg-[var(--background-secondary)]">
            <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 78% 16%, ' + event.ambientDecorations.glowColor + ', transparent 50%)' }} />
            <div className="relative grid gap-8 p-6 sm:p-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-[var(--background-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--seasonal-accent-strong)] ring-1 ring-[var(--border-subtle)]">
                  <Sparkles className="h-3.5 w-3.5" />{isEn ? 'Now in the Curileta world' : 'Ahora en el mundo de Curileta'}
                </p>
                <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">{event.name[locale] || event.name.es}</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">{event.tagline[locale] || event.tagline.es}</p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[var(--seasonal-accent-strong)]" />{formatDate(event.startDate)} – {formatDate(event.endDate)}</span>
                  <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[var(--seasonal-accent-strong)]" />{event.specialChapter.status === 'published' ? (isEn ? 'Available now' : 'Disponible') : (isEn ? 'Coming soon' : 'Próximamente')}</span>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--background-primary)] p-6 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--seasonal-accent-strong)]">{isEn ? 'Seasonal chapter' : 'Capítulo de temporada'}</span>
                <h3 className="mt-3 font-display text-2xl font-semibold">{event.specialChapter.title[locale] || event.specialChapter.title.es}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{event.specialChapter.synopsis[locale] || event.specialChapter.synopsis.es}</p>
                <p className="mt-4 text-sm font-medium text-[var(--text-secondary)]">{isEn ? 'Release date' : 'Fecha prevista'}: {formatDate(event.specialChapter.releaseDate)}</p>
                <Link href={event.specialChapter.status === 'published' && event.specialChapter.youtubeId ? '/' + locale + '/videos' : '/' + locale + (event.themeKey === 'halloween' ? '#evento-halloween' : '')} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1c493b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27634e]">
                  {event.specialChapter.status === 'published' && event.specialChapter.youtubeId
                    ? (isEn ? 'Watch the special' : 'Ver el especial')
                    : (isEn ? 'Explore the seasonal feature' : 'Ver la experiencia de temporada')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </SitePageCard>
      ) : (
        <SitePageCard className="py-12 text-center sm:py-16">
          <CalendarDays className="mx-auto h-10 w-10 text-[var(--seasonal-accent-strong)]" />
          <h2 className="mt-4 font-display text-2xl font-semibold">{isEn ? 'No public events announced yet' : 'Todavía no hay eventos públicos anunciados'}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
            {isEn ? 'When a seasonal story or public event is confirmed, it will appear here.' : 'Cuando se confirme una historia de temporada o un encuentro público, aparecerá aquí.'}
          </p>
        </SitePageCard>
      )}
      <SitePageCard className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-semibold">{isEn ? 'Invite Curileta to a school or library' : 'Invita a Curileta a tu centro o biblioteca'}</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{isEn ? 'Ask about a possible reading, workshop or collaboration.' : 'Consulta la posibilidad de organizar una lectura, taller o colaboración.'}</p>
        </div>
        <Link href={'/' + locale + '/contacto'} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[var(--background-secondary)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] ring-1 ring-[var(--border-subtle)] transition hover:text-[var(--seasonal-accent-strong)]">
          <Mail className="h-4 w-4" />{isEn ? 'Make an enquiry' : 'Hacer una consulta'}
        </Link>
      </SitePageCard>
    </SitePageLayout>
  );
}
