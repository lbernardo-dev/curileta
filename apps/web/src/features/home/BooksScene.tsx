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
  currentTimestamp: number;
}

export const BooksScene: React.FC<BooksSceneProps> = ({ locale, books = [], amazonCountry, imageFrames, currentTimestamp }) => {
  const isEn = locale === 'en';
  const destinationNamesEn: Record<string, string> = {
    México: 'Mexico', Perú: 'Peru', Egipto: 'Egypt', Islandia: 'Iceland', Japón: 'Japan',
    Australia: 'Australia', 'Nueva Zelanda': 'New Zealand', China: 'China', Italia: 'Italy',
    Francia: 'France', España: 'Spain',
  };

  return (
    <section id="escena-libros" className="relative z-10 overflow-hidden border-t border-[var(--border-subtle)] bg-[#12382E] px-5 py-24 text-white transition-colors duration-500 dark:border-[#272727] dark:bg-[#0E2620] sm:px-8 sm:py-28 lg:px-12">
      <div className="relative mx-auto max-w-7xl">
        <header className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <SectionEmblem icon={BookOpen} tone="amber" label={isEn ? 'Curileta books' : 'Libros de Curileta'} />
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            {isEn ? 'Every page opens a new place.' : 'Cada página abre un lugar nuevo.'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            {isEn
              ? 'Follow Curileta across the world and read the letters she sends home to Pompón.'
              : 'Acompaña a Curileta por el mundo y descubre las cartas que envía a casa para Pompón.'}
          </p>
        </header>

        <div className={`grid gap-6 ${books.length === 1 ? 'grid-cols-1' : 'lg:grid-cols-2 xl:grid-cols-3'}`}>
          {books.map((book) => {
            const isCuriletaBook = book.slug === CURILETA_BOOK_SLUG || book.id === CURILETA_BOOK_SLUG;
            const isPublished = isBookPublished(book, currentTimestamp);
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
                className={`group ${books.length === 1 ? 'mx-auto w-full max-w-5xl lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]' : 'flex flex-col'} h-full min-w-0 overflow-hidden rounded-3xl border border-emerald-950/40 bg-white text-slate-900 shadow-[0_24px_70px_rgba(2,18,13,0.3)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-2xl dark:border-[#383838] dark:bg-[#1F1F1F] dark:text-white`}
              >
                <div className={`relative overflow-hidden ${books.length === 1 ? 'aspect-[5/4] lg:aspect-auto lg:min-h-[30rem]' : 'aspect-[5/4] sm:aspect-[16/10]'}`}>
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

                  <div className="flex min-w-0 flex-1 flex-col p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${isPublished ? 'bg-emerald-100 text-emerald-900 dark:bg-[#313131] dark:text-emerald-200' : 'bg-amber-100 text-amber-950 dark:bg-[#313131] dark:text-amber-200'}`}>
                        {isPublished ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />}
                        {badge || (isPublished ? (isEn ? 'Published' : 'Publicado') : (isEn ? 'Coming soon' : 'Próximamente'))}
                      </span>
                      {book.ageRange && <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:bg-[#272727] dark:text-slate-300">{isEn ? `${book.ageRange.replace(/\baños\b/i, 'years')}${book.languages?.length === 1 && book.languages.includes('Español') ? ' · Spanish edition' : ''}` : book.ageRange}</span>}
                    </div>

                    <h3 className="mt-5 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl">{title}</h3>
                    {subtitle && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800 dark:text-emerald-300">{subtitle}</p>}
                    <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {format && <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:border-[#313131] dark:bg-[#272727] dark:text-slate-300">{format}</span>}
                      {book.pageCount && <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:border-[#313131] dark:bg-[#272727] dark:text-slate-300">{book.pageCount} {isEn ? 'pages' : 'páginas'}</span>}
                      {book.author && <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:border-[#313131] dark:bg-[#272727] dark:text-slate-300">{isEn ? `By ${book.author}` : `De ${book.author}`}</span>}
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

                    <div className="mt-auto flex flex-col items-stretch gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
                      <Link
                        href={`/${locale}/libros/${book.slug || book.id}`}
                        className="inline-flex min-h-11 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[#1c493b] px-5 py-2.5 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#27634e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                      >
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                        {isEn ? 'Book details' : 'Detalles del libro'}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      {isCuriletaBook && isPublished && (
                        <div className="flex w-full justify-start">
                          <AmazonMarketplaceLink locale={locale} initialCountry={amazonCountry} compact />
                        </div>
                      )}
                    </div>
                  </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href={`/${locale}/libros`} className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-slate-950/40 px-6 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-300 hover:text-slate-950">
            {isEn ? 'Explore the book catalogue' : 'Explorar el catálogo de libros'}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
