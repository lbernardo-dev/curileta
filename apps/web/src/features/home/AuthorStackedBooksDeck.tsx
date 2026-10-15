'use client';

import React, { useState } from 'react';
import { ContentImage } from '@/components/ContentImage';
import Link from 'next/link';
import type { Locale } from '@curileta/i18n';
import { BookOpen, Sparkles, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import type { Book } from '@curileta/cms';

export interface AuthorDeckBook {
  id: string;
  slug?: string;
  title: { es: string; en: string };
  subtitle: { es: string; en: string };
  theme: { es: string; en: string };
  badge: { es: string; en: string };
  ageRange: string;
  pageCount: number;
  coverUrl: string;
  description: { es: string; en: string };
  url: string;
  isExternal?: boolean;
}

interface AuthorStackedBooksDeckProps {
  locale: Locale;
  books?: Book[];
  authorSlug: string;
  authorName: string;
}

export function AuthorStackedBooksDeck({
  locale,
  books = [],
  authorName,
}: AuthorStackedBooksDeckProps) {
  const isEn = locale === 'en';

  // Base list of published and collection works by the author
  const deckBooks: AuthorDeckBook[] = [
    {
      id: 'las-aventuras-de-curileta',
      slug: 'las-aventuras-de-curileta',
      title: {
        es: 'Las Aventuras de Curileta',
        en: 'The Adventures of Curileta',
      },
      subtitle: {
        es: 'La Vuelta al Mundo de una Pequeña Lagartija',
        en: 'The Round the World Journey of a Little Lizard',
      },
      theme: {
        es: 'Viajes, Geografía y Amistad',
        en: 'Travel, Geography & Friendship',
      },
      badge: {
        es: 'Libro Oficial • Novedad 2026',
        en: 'Official Book • 2026 Novelty',
      },
      ageRange: '5–12 años',
      pageCount: 80,
      coverUrl: '/images/hero/curileta-world-expedition-clean-v1.png',
      description: {
        es: 'La historia oficial de una pequeña lagartija que viaja por diez países enviando cartas a su amigo Pompón.',
        en: 'The official story of a curious lizard traveling ten countries while mailing letters to her friend Pompón.',
      },
      url: `/${locale}/libros/las-aventuras-de-curileta`,
      isExternal: false,
    },
    {
      id: 'curileta-y-el-misterio-marino',
      slug: 'curileta-y-el-misterio-marino',
      title: {
        es: 'Curileta y el Misterio Marino',
        en: 'Curileta and the Marine Mystery',
      },
      subtitle: {
        es: 'Volumen 2 — El Mar de Filipinas y las Marianas',
        en: 'Volume 2 — The Philippine Sea & the Marianas',
      },
      theme: {
        es: 'Océanos, Misterio y Arrecifes',
        en: 'Oceans, Mystery & Coral Reefs',
      },
      badge: {
        es: 'Volumen 2 • Próxima Expedición',
        en: 'Volume 2 • Upcoming Expedition',
      },
      ageRange: '5–11 años',
      pageCount: 56,
      coverUrl: '/images/characters/pez-volador-main.webp',
      description: {
        es: 'Inspirado en la travesía en velero con el pez volador Glub y las aguas bioluminiscentes de las Marianas.',
        en: 'Inspired by the sailboat crossing alongside Glub the flying fish and the bioluminescent abyssal waters.',
      },
      url: `/${locale}/libros/curileta-y-el-misterio-marino`,
      isExternal: false,
    },
    {
      id: 'cuaderno-actividades-curileta',
      title: {
        es: 'El Cuaderno Secreto de Curileta & Pompón',
        en: 'Curileta & Pompón Secret Activity Book',
      },
      subtitle: {
        es: 'Actividades, Mapas y Colorear por el Mundo',
        en: 'Activities, World Maps & Creative Coloring',
      },
      theme: {
        es: 'Creatividad, Pasatiempos y Destreza',
        en: 'Creativity, Puzzles & World Games',
      },
      badge: {
        es: 'Actividades & Creatividad',
        en: 'Activities & Creativity',
      },
      ageRange: '4–10 años',
      pageCount: 64,
      coverUrl: '/images/books/las-aventuras-de-curileta/portada.webp',
      description: {
        es: 'Laberintos, sellos de pasaporte, banderas del mundo y láminas para colorear con personajes de la historia.',
        en: 'Mazes, passport stamps, world flags, and coloring sheets featuring characters from the story.',
      },
      url: 'https://www.amazon.com/dp/B0H2CT8S14',
      isExternal: true,
    },
    {
      id: 'cuentos-buenas-noches-bosque',
      title: {
        es: 'Cuentos de Buenas Noches del Bosque Encantado',
        en: 'Bedtime Tales of the Enchanted Forest',
      },
      subtitle: {
        es: 'Historias Breves de Amistad y Naturaleza',
        en: 'Gentle Stories of Friendship & Nature',
      },
      theme: {
        es: 'Lecturas de Buenas Noches y Valores',
        en: 'Bedtime Stories & Calm Values',
      },
      badge: {
        es: 'Cuentos para Soñar',
        en: 'Bedtime Tales',
      },
      ageRange: '3–8 años',
      pageCount: 48,
      coverUrl: '/images/characters/curileta-main.webp',
      description: {
        es: 'Relatos breves y tiernos sobre las criaturas del bosque antes de que caiga la noche y comiencen los sueños.',
        en: 'Short and gentle stories about forest animals before evening falls and dreams begin.',
      },
      url: `/${locale}/autora/sweety-taless`,
      isExternal: false,
    },
  ];

  // Merge any additional CMS books matching this author if not already in deck
  if (books.length > 0) {
    for (const b of books) {
      if (!deckBooks.some((d) => d.slug === b.slug)) {
        deckBooks.push({
          id: b.id,
          slug: b.slug,
          title: { es: b.title.es, en: b.title.en || b.title.es },
          subtitle: { es: b.subtitle?.es || '', en: b.subtitle?.en || b.subtitle?.es || '' },
          theme: { es: 'Colección de literatura infantil', en: 'Children literature collection' },
          badge: { es: b.badge?.es || 'Publicación', en: b.badge?.en || 'Published' },
          ageRange: b.ageRange || '5–12 años',
          pageCount: b.pageCount || 60,
          coverUrl: b.coverImage?.url || '/images/books/las-aventuras-de-curileta/portada.webp',
          description: { es: b.description.es, en: b.description.en || b.description.es },
          url: `/${locale}/libros/${b.slug}`,
          isExternal: false,
        });
      }
    }
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const activeBook = deckBooks[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % deckBooks.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + deckBooks.length) % deckBooks.length);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera y solapas interactivas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-300">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              {isEn ? `Books by ${authorName} & other series` : `Obras de ${authorName} y otras temáticas`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label={isEn ? 'Previous book' : 'Libro anterior'}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#272727] dark:text-slate-200 dark:hover:bg-[#313131]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={isEn ? 'Next book' : 'Libro siguiente'}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#272727] dark:text-slate-200 dark:hover:bg-[#313131]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Barra de Solapas (Tabs) */}
        <div className="flex flex-wrap gap-2 pt-1" role="tablist" aria-label={isEn ? 'Author books tabs' : 'Solapas de libros de la autora'}>
          {deckBooks.map((book, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={book.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveIndex(idx)}
                className={`group relative flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-800 text-white shadow-md dark:border-emerald-500 dark:bg-emerald-700'
                    : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-white dark:border-[#383838] dark:bg-[#272727] dark:text-slate-300 dark:hover:bg-[#313131]'
                }`}
              >
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-amber-300 text-slate-950' : 'bg-slate-200 text-slate-700 dark:bg-[#383838] dark:text-slate-300'
                }`}>
                  {idx + 1}
                </span>
                <span className="truncate max-w-[130px] sm:max-w-[160px]">
                  {book.title[locale] || book.title.es}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Escaparate visual con cartas solapadas una encima de otra */}
      <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#FAFDF7] p-4 sm:p-6 shadow-inner dark:border-[#313131] dark:bg-[#181818]">
        {/* Contenedor de cartas solapadas en 3D / Abanico */}
        <div className="relative mx-auto h-56 sm:h-64 w-full flex items-center justify-center">
          {deckBooks.map((book, idx) => {
            // Posición relativa al libro activo
            const offset = (idx - activeIndex + deckBooks.length) % deckBooks.length;
            const isFront = offset === 0;

            // Clases de solapamiento en capas
            let layerClasses = 'z-0 translate-x-16 scale-[0.80] opacity-0 pointer-events-none';
            if (offset === 0) {
              layerClasses = 'z-30 translate-x-0 translate-y-0 scale-100 rotate-0 shadow-2xl opacity-100 ring-2 ring-emerald-600/40';
            } else if (offset === 1) {
              layerClasses = 'z-20 translate-x-8 sm:translate-x-12 translate-y-2 scale-[0.93] rotate-2 shadow-lg opacity-85 hover:opacity-100 cursor-pointer';
            } else if (offset === 2) {
              layerClasses = 'z-10 translate-x-16 sm:translate-x-24 translate-y-4 scale-[0.86] rotate-4 shadow-md opacity-60 hover:opacity-90 cursor-pointer';
            } else if (offset === deckBooks.length - 1) {
              layerClasses = 'z-20 -translate-x-8 sm:-translate-x-12 translate-y-2 scale-[0.93] -rotate-2 shadow-lg opacity-85 hover:opacity-100 cursor-pointer';
            }

            return (
              <div
                key={book.id}
                onClick={() => setActiveIndex(idx)}
                className={`absolute w-44 sm:w-52 h-52 sm:h-60 rounded-2xl border border-slate-300 bg-white p-2.5 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] dark:border-[#383838] dark:bg-[#272727] ${layerClasses}`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#131209] flex flex-col justify-between p-2">
                  <ContentImage
                    src={book.coverUrl}
                    alt={book.title[locale] || book.title.es}
                    className="absolute inset-0 h-full w-full object-contain p-2"
                  />
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="rounded-md bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-slate-800">
                      #{idx + 1}
                    </span>
                    {isFront && (
                      <span className="rounded-md bg-emerald-500/90 px-2 py-0.5 text-[9px] font-bold text-slate-950">
                        {isEn ? 'Selected' : 'Viendo'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detalle del libro activo en la solapa frontal */}
        {activeBook && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:border-[#383838] dark:bg-[#1F1F1F]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900 dark:bg-[#272727] dark:text-emerald-300">
                {activeBook.badge[locale] || activeBook.badge.es}
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>{activeBook.ageRange}</span>
                <span>•</span>
                <span>{activeBook.pageCount} {isEn ? 'pages' : 'páginas'}</span>
              </div>
            </div>

            <h4 className="mt-2 font-display text-base sm:text-lg font-bold text-slate-950 dark:text-white">
              {activeBook.title[locale] || activeBook.title.es}
            </h4>
            <p className="text-xs font-semibold text-emerald-800 dark:text-amber-400">
              {activeBook.subtitle[locale] || activeBook.subtitle.es}
            </p>
            <p className="mt-2 text-xs sm:text-sm leading-5 text-slate-600 dark:text-slate-300 line-clamp-2">
              {activeBook.description[locale] || activeBook.description.es}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#313131]">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span className="font-semibold">{activeBook.theme[locale] || activeBook.theme.es}</span>
              </div>

              {activeBook.isExternal ? (
                <a
                  href={activeBook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-amber-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <span>{isEn ? 'View on Amazon' : 'Ver en Amazon'}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : (
                <Link
                  href={activeBook.url}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-emerald-800 px-4 py-2 text-xs font-bold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <span>{isEn ? 'Discover this book' : 'Descubrir este libro'}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
