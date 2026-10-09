'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { BookOpen, Sparkles, ExternalLink, Bookmark, CheckCircle2 } from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  subtitle: string;
  age: string;
  description: string;
  destinations: string[];
  color: string;
  badge: string;
}

const FEATURED_BOOKS: BookItem[] = [
  {
    id: 'las-aventuras-de-curileta',
    title: 'Las Aventuras de Curileta',
    subtitle: 'La Vuelta al Mundo de una Pequeña Lagartija',
    age: '4–10 años',
    description:
      'La historia oficial de una curiosa lagartija que viaja por México, Perú, Egipto, Islandia, Japón, Australia, Nueva Zelanda, China, Italia y Francia, enviando cartas y sellos a su amigo Pompón, hasta descubrir que el mayor tesoro es el hogar.',
    destinations: ['México', 'Perú', 'Egipto', 'Islandia', 'Japón', 'Australia', 'Nueva Zelanda', 'China', 'Italia', 'Francia', 'España'],
    color: 'from-emerald-600 via-amber-600 to-teal-700',
    badge: 'Libro Oficial • Novedad 2026',
  },
  {
    id: 'curileta-y-el-misterio-marino',
    title: 'Curileta y el Misterio Marino',
    subtitle: 'Volumen 2 — El Mar de Filipinas y las Marianas',
    age: '5–11 años',
    description:
      'Inspirado en la travesía en velero con el pez volador Glub y las aguas bioluminiscentes, una expedición a las profundidades más secretas de la Tierra.',
    destinations: ['Mar de Filipinas', 'Fosa de las Marianas', 'Arrecifes'],
    color: 'from-cyan-600 via-blue-600 to-indigo-800',
    badge: 'Próxima Expedición',
  },
];

export const BooksScene: React.FC<{ locale: Locale }> = ({ locale }) => {
  return (
    <section className="py-28 bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Escena 05 — Los Libros</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            La aventura cobra forma entre páginas
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Ilustraciones vibrantes, valores de empatía y curiosidad geográfica encuadernados para leer juntos en familia antes de dormir.
          </p>
        </div>

        {/* Encabezado con Curileta 3D integrado */}
        <div className="relative max-w-4xl mx-auto mb-16 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-300 p-1 shadow-2xl shadow-amber-500/30 group-hover:rotate-3 transition-transform duration-300">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center overflow-hidden relative">
                  <img
                    src="/images/characters/curileta-main.webp"
                    alt="Curileta leyendo"
                    className="w-24 h-24 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow border border-amber-200">
                📖 LIBROS
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/50 text-amber-900 dark:text-amber-300 text-xs font-black uppercase tracking-widest mb-3 shadow-md backdrop-blur-md">
                <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Colección Oficial de Cuentos Ilustrados</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                La aventura cobra vida<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-600 dark:from-amber-300 dark:via-emerald-300 dark:to-teal-200">
                  en formato libro 3D de tapa dura.
                </span>
              </h2>
            </div>
          </div>

          <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Ilustraciones vibrantes estilo Pixar, mapas desplegables y valores de empatía y curiosidad geográfica. Diseñados para disfrutar en familia y leer antes de dormir.
          </p>
        </div>

        {/* 3D Storybook Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {FEATURED_BOOKS.map((book) => {
            const isBookOne = book.id === 'las-aventuras-de-curileta';
            return (
              <div
                key={book.id}
                className="relative rounded-[2.5rem] bg-gradient-to-b from-white via-slate-50 to-amber-50/30 dark:from-slate-900/90 dark:via-slate-950/90 dark:to-slate-900/90 border-2 border-amber-300/60 dark:border-amber-500/30 p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-center shadow-[0_20px_50px_rgba(245,158,11,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-amber-400 dark:hover:border-amber-400/80 transition-all duration-300 group hover:-translate-y-1"
              >
                {/* 3D Volumetric Hardcover Book with Ribbon & Foil */}
                <div className="relative w-52 sm:w-56 aspect-[3/4.2] shrink-0 rounded-2xl shadow-2xl shadow-slate-900/40 dark:shadow-black/90 flex flex-col justify-between p-6 border-r-6 border-b-6 border-slate-900 group-hover:-rotate-3 group-hover:scale-105 transition-all duration-500 overflow-hidden bg-slate-950">
                  {/* Glowing cover background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${book.color} opacity-95`} />
                  
                  {/* Leather spine emboss & inner pages border */}
                  <div className="absolute top-0 left-0 bottom-0 w-5 bg-gradient-to-r from-black/50 via-white/20 to-transparent shadow-inner" />
                  <div className="absolute top-1 bottom-1 right-0 w-1.5 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-100 rounded-r shadow-xs" />

                  {/* Golden Foil Corners */}
                  <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-amber-300 via-amber-400 to-transparent opacity-80" />
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-gradient-to-tl from-amber-300 via-amber-400 to-transparent opacity-80" />

                  {/* Character Illustration on Book Cover */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-950 bg-amber-300 px-2.5 py-1 rounded-full shadow-md">
                      {book.age}
                    </span>
                    <span className="text-xs">⭐ 5.0</span>
                  </div>

                  {/* 3D Character Avatar on cover */}
                  <div className="relative z-10 my-auto flex justify-center items-center py-2">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <img
                        src={isBookOne ? '/images/characters/curileta-main.webp' : '/images/characters/glub-main.webp'}
                        alt={book.title}
                        className="w-24 h-24 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:scale-115 transition-transform duration-500"
                      />
                      {isBookOne && (
                        <img
                          src="/images/characters/quetzal-main.webp"
                          alt="Quetzal"
                          className="absolute -right-2 -bottom-1 w-14 h-14 object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.7)] group-hover:rotate-6 transition-transform duration-500"
                        />
                      )}
                    </div>
                  </div>

                  {/* Title & Author */}
                  <div className="relative z-10 text-center">
                    <h4 className="font-black text-lg leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-amber-200 font-black tracking-wide mt-1 uppercase">
                      Curileta & Amigos
                    </p>
                  </div>

                  {/* Dangling Silk Bookmark Ribbon */}
                  <div className="absolute -bottom-3 right-8 w-4 h-8 bg-amber-400 shadow-md transform rotate-6 border-b-4 border-amber-600 rounded-b-sm" />
                </div>

                {/* Book Info & Playful Details */}
                <div className="space-y-4 flex-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-200/70 dark:bg-amber-950/80 border border-amber-400 dark:border-amber-700/60 px-3.5 py-1 rounded-full shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>{book.badge}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {book.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {book.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {book.destinations.slice(0, 5).map((dest) => (
                      <span
                        key={dest}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs"
                      >
                        📍 {dest}
                      </span>
                    ))}
                    {book.destinations.length > 5 && (
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        +{book.destinations.length - 5} más
                      </span>
                    )}
                  </div>

                  {/* Chunky Tactile 3D Action Buttons */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/${locale}/libros/${book.id}`}
                      className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 border-b-4 border-amber-600 hover:border-b-2 hover:translate-y-[2px] active:border-b-0 active:translate-y-[4px] shadow-[0_6px_16px_rgba(245,158,11,0.35)] transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Explorar Libro</span>
                    </Link>

                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold">
                      Tapa Dura • 48 págs
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Link con botón 3D */}
        <div className="mt-16 text-center">
          <Link
            href={`/${locale}/libros`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-sm bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <span>Ver catálogo editorial y puntos de venta</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
