import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cmsProvider } from '@/lib/cms';
import { isValidLocale, type Locale } from '@curileta/i18n';
import { ArrowRight, BookOpen, CalendarDays, Newspaper, Sparkles } from 'lucide-react';
import { SitePageCard, SitePageLayout } from '@/components/SitePageLayout';
import { getBookCoverImage } from '@/lib/book-art';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'News and updates', description: 'Published books and active seasonal stories from the Curileta universe.' }
    : { title: 'Novedades', description: 'Libros publicados e historias de temporada activas del universo Curileta.' };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isEn = locale === 'en';
  const [books, event] = await Promise.all([cmsProvider.getBooks(locale), cmsProvider.getActiveEvent(locale)]);
  const now = Date.now();
  const publishedBooks = books.filter((book) => Date.parse(book.publicationDate + 'T23:59:59.999Z') <= now);
  const upcomingBooks = books.filter((book) => Date.parse(book.publicationDate + 'T23:59:59.999Z') > now);
  const dateLocale = isEn ? 'en-GB' : 'es-ES';
  const formatDate = (value: string) => new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));

  return (
    <SitePageLayout
      locale={locale as Locale}
      eyebrow={isEn ? 'Dispatches from the adventure' : 'Noticias de la aventura'}
      title={isEn ? 'The latest from Curileta' : 'Lo último de Curileta'}
      description={isEn
        ? 'A small journal of real releases and current stories, linked to their full pages.'
        : 'Un pequeño diario de publicaciones reales e historias activas, enlazadas a sus páginas completas.'}
      icon={<Newspaper className="h-4 w-4" />}
      width="wide"
    >
      {event && (
        <Link href={'/' + locale + '/eventos'} className="group block">
          <SitePageCard className="flex flex-col gap-5 border-l-4 border-l-[var(--seasonal-accent-strong)] transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--seasonal-accent-strong)]"><Sparkles className="h-3.5 w-3.5" />{isEn ? 'Current seasonal story' : 'Historia de temporada activa'}</span>
              <h2 className="mt-3 font-display text-2xl font-semibold">{event.name[locale] || event.name.es}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{event.tagline[locale] || event.tagline.es}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--seasonal-accent-strong)]">{isEn ? 'See the story' : 'Ver la historia'}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </SitePageCard>
        </Link>
      )}

      {(publishedBooks.length > 0 || upcomingBooks.length > 0) ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[...publishedBooks.map((book) => ({ book, upcoming: false })), ...upcomingBooks.map((book) => ({ book, upcoming: true }))].map(({ book, upcoming }) => {
            const coverImage = getBookCoverImage(book);
            return (
              <article key={book.id} className="overflow-hidden rounded-3xl bg-[var(--background-primary)] shadow-sm ring-1 ring-[var(--border-subtle)] sm:grid sm:grid-cols-[minmax(150px,0.42fr)_1fr]">
                <div className="relative aspect-[4/5] bg-[#f1ead5] p-4 sm:aspect-auto sm:min-h-64">
                  <Image src={coverImage.url} alt={coverImage.alt[locale] || coverImage.alt.es} fill className="object-contain p-5" sizes="(max-width: 640px) 100vw, 320px" />
                </div>
                <div className="flex flex-col p-6 sm:p-7">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--seasonal-accent-strong)]">
                    {upcoming ? <CalendarDays className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                    {upcoming ? (isEn ? 'Coming soon' : 'Próximamente') : (isEn ? 'Published' : 'Publicado')}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-semibold">{book.title[locale] || book.title.es}</h2>
                  {book.subtitle && <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">{book.subtitle[locale] || book.subtitle.es}</p>}
                  <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{book.description[locale] || book.description.es}</p>
                  <p className="mt-4 text-xs font-medium text-[var(--text-secondary)]">{upcoming ? (isEn ? 'Planned publication' : 'Fecha prevista') : (isEn ? 'Published' : 'Publicado')} · {formatDate(book.publicationDate)}</p>
                  <Link href={'/' + locale + '/libros/' + book.slug} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-semibold text-[var(--seasonal-accent-strong)]">
                    {isEn ? 'Book details' : 'Ficha del libro'}<ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : !event ? (
        <SitePageCard className="py-12 text-center">
          <Newspaper className="mx-auto h-9 w-9 text-[var(--seasonal-accent-strong)]" />
          <h2 className="mt-4 font-display text-2xl font-semibold">{isEn ? 'No updates published yet' : 'Todavía no hay novedades publicadas'}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">{isEn ? 'New releases and confirmed stories will appear here.' : 'Aquí aparecerán las nuevas publicaciones e historias confirmadas.'}</p>
        </SitePageCard>
      ) : null}
    </SitePageLayout>
  );
}
