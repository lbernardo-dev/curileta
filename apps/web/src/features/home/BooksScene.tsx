'use client';

import React from 'react';
import Link from 'next/link';
import type { Locale } from '@curileta/i18n';
import type { Book } from '@curileta/cms';
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, MapPin } from 'lucide-react';
import { AmazonMarketplaceLink } from '@/components/AmazonMarketplaceLink';
import { CURILETA_BOOK_SLUG } from '@/lib/amazon-marketplace';
import { getBookCoverImage } from '@/lib/book-art';
import { getImageFrame, type ImageFrameMap } from '@/lib/image-frames';
import { BookCoverPanel } from '@/components/BookCoverPanel';
import { SectionEmblem } from '@/components/SectionEmblem';
import { isBookPublished } from '@/lib/book-catalog';

interface BooksSceneProps {
  locale: Locale;
  books: Book[];
  amazonCountry: string | null;
  imageFrames: ImageFrameMap;
}

export const BooksScene: React.FC<BooksSceneProps> = ({ locale, books = [], amazonCountry, imageFrames }) => {
  const isEn = locale === 'en';
  const now = Date.now();
  const destinationNamesEn: Record<string, string> = {
    México: 'Mexico', Perú: 'Peru', Egipto: 'Egypt', Islandia: 'Iceland', Japón: 'Japan',
    Australia: 'Australia', 'Nueva Zelanda': 'New Zealand', China: 'China', Italia: 'Italy',
    Francia: 'France', España: 'Spain',
  };

  return (
    <section id="escena-libros" className="relative z-10 overflow-hidden bg-white py-24 text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-white sm:py-28">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <header className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <SectionEmblem icon={BookOpen} tone="amber" label={isEn ? 'Curileta books' : 'Libros de Curileta'} />
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/70 dark:text-amber-200">
            {isEn ? 'Stories to read together' : 'Historias para leer en familia'}
          </div>
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
            {isEn ? 'Every page opens a new place.' : 'Cada página abre un lugar nuevo.'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            {isEn
              ? 'Follow Curileta across the world and read the letters she sends home to Pompón.'
              : 'Acompaña a Curileta por el mundo y descubre las cartas que envía a casa para Pompón.'}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => {
            const isCuriletaBook = book.slug === CURILETA_BOOK_SLUG || book.id === CURILETA_BOOK_SLUG;
            const isPublished = isBookPublished(book, now);
            const title = book.title[locale] || book.title.es;
            const subtitle = book.subtitle?.[locale] || book.subtitle?.es;
            const description = book.description[locale] || book.description.es;
            const badge = book.badge?.[locale] || book.badge?.es;
            const format = book.format?.[locale] || book.format?.es;
            const coverImage = getBookCoverImage(book);
            const coverFrame = isCuriletaBook ? getImageFrame(imageFrames, 'home-books-cover') : null;

            return (
              <article
                key={book.id || book.slug}
                className="group h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-[#fbfaf5] shadow-[0_20px_60px_rgba(24,54,41,0.08)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(24,54,41,0.14)] dark:border-[#313131] dark:bg-[#181818]"
              >
                <div className="grid h-full md:min-h-[34rem] md:grid-cols-[0.7fr_1.3fr]">
                  <div className="relative min-h-[24rem] overflow-hidden md:min-h-full">
                    <BookCoverPanel
                      src={coverImage.url}
                      alt={coverImage.alt[locale] || coverImage.alt.es}
                      locale={locale}
                      upcoming={!isPublished}
                      frame={coverFrame}
                      fillContainer
                    />
                    {!isCuriletaBook && isPublished && (
                      <span className="absolute bottom-4 left-4 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#20352c] shadow-sm">
                        {isEn ? 'Story illustration' : 'Ilustración del relato'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${isPublished ? 'bg-emerald-100 text-emerald-900 dark:bg-[#313131] dark:text-emerald-200' : 'bg-amber-100 text-amber-950 dark:bg-[#313131] dark:text-amber-200'}`}>
                        {isPublished ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />}
                        {badge || (isPublished ? (isEn ? 'Published' : 'Publicado') : (isEn ? 'Coming soon' : 'Próximamente'))}
                      </span>
                      {book.ageRange && <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:bg-[#272727] dark:text-slate-300">{isEn ? `${book.ageRange.replace(/\baños\b/i, 'years')}${book.languages?.length === 1 && book.languages.includes('Español') ? ' · Spanish edition' : ''}` : book.ageRange}</span>}
                    </div>

                    <h3 className="mt-5 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">{title}</h3>
                    {subtitle && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800 dark:text-emerald-300">{subtitle}</p>}
                    <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {format && <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:border-[#313131] dark:bg-[#272727] dark:text-slate-300">{format}</span>}
                      {book.pageCount && <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:border-[#313131] dark:bg-[#272727] dark:text-slate-300">{book.pageCount} {isEn ? 'pages' : 'páginas'}</span>}
                      {book.author && <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:border-[#313131] dark:bg-[#272727] dark:text-slate-300">{isEn ? `By ${book.author}` : `De ${book.author}`}</span>}
                    </div>

                    {book.destinations && book.destinations.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {book.destinations.slice(0, 4).map((destination) => (
                          <span key={destination} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900 dark:bg-[#313131] dark:text-emerald-200">
                            <MapPin className="h-3 w-3" aria-hidden="true" />{isEn ? destinationNamesEn[destination] || destination : destination}
                          </span>
                        ))}
                        {book.destinations.length > 4 && <span className="px-1 py-1 text-xs text-slate-500">+{book.destinations.length - 4}</span>}
                      </div>
                    )}

                    <div className="mt-auto flex flex-col items-start gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:flex-wrap sm:items-center">
                      <Link
                        href={`/${locale}/libros/${book.slug || book.id}`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1c493b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#27634e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                      >
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                        {isEn ? 'Book details' : 'Detalles del libro'}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      {isCuriletaBook && isPublished && (
                        <AmazonMarketplaceLink locale={locale} initialCountry={amazonCountry} compact />
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href={`/${locale}/libros`} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-800 hover:bg-emerald-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">
            {isEn ? 'Explore the book catalogue' : 'Explorar el catálogo de libros'}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
