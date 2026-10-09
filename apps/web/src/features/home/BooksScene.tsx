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

        {/* 3D-feeling Books Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {FEATURED_BOOKS.map((book) => (
            <div
              key={book.id}
              className="relative rounded-3xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-center shadow-xl dark:shadow-2xl hover:border-amber-400 dark:hover:border-amber-500/50 transition-all duration-300 group"
            >
              {/* 3D Book Cover Simulator */}
              <div className="relative w-48 sm:w-52 aspect-[3/4] shrink-0 rounded-2xl bg-gradient-to-tr shadow-2xl shadow-black/40 dark:shadow-black/80 flex flex-col justify-between p-6 border-r-4 border-b-4 border-slate-950 group-hover:-rotate-2 group-hover:scale-105 transition-all duration-500 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${book.color} opacity-90`} />
                <div className="absolute top-0 left-0 bottom-0 w-4 bg-white/20 backdrop-blur-sm shadow-inner" />

                <div className="relative z-10">
                  <span className="text-[10px] font-black tracking-widest uppercase text-white/90 bg-black/30 px-2.5 py-1 rounded-full">
                    {book.age}
                  </span>
                </div>

                <div className="relative z-10">
                  <h4 className="font-black text-xl leading-tight text-white drop-shadow">
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-amber-200 font-bold mt-1">Curileta</p>
                </div>
              </div>

              {/* Book Info */}
              <div className="space-y-4 flex-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/40 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{book.badge}</span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{book.title}</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {book.subtitle}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {book.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {book.destinations.map((dest) => (
                    <span
                      key={dest}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-sm"
                    >
                      📍 {dest}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Link
                    href={`/${locale}/libros/${book.id}`}
                    className="px-5 py-2.5 rounded-full font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-md"
                  >
                    Detalles y Tiendas
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Link */}
        <div className="mt-14 text-center">
          <Link
            href={`/${locale}/libros`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20 transition-all shadow-sm"
          >
            <span>Ver catálogo editorial completo</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
