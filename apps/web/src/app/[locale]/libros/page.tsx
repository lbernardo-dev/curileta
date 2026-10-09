import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { BookOpen, Sparkles, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Catálogo de Libros Publicados — Las Aventuras de Curileta',
  description: 'Descubre los libros ilustrados de Curileta: historias para leer en familia, edades recomendadas y dónde conseguirlos.',
};

const BOOKS = [
  {
    id: 'el-misterio-del-quetzal',
    title: 'El Misterio del Quetzal Dorado',
    volume: 'Volumen 1',
    destinations: 'México & Teotihuacán',
    ageRange: '5–10 años',
    pages: '48 páginas a todo color',
    description: 'Curileta y Pompón viajan a las selvas de México para encontrar las plumas sagradas del Quetzal y descubrir que la mayor magia es la amistad compartida.',
    status: 'Disponible en librerías',
    color: 'from-amber-600 via-orange-600 to-amber-700',
  },
  {
    id: 'las-auroras-de-hielo',
    title: 'Las Auroras del Confín Helado',
    volume: 'Volumen 2',
    destinations: 'Islandia & Los Géiseres',
    ageRange: '6–12 años',
    pages: '56 páginas ilustradas',
    description: 'Bajo cielos iluminados por auroras boreales, una expedición sobre glaciares y aguas termales revela el poder del coraje y la protección del medio ambiente.',
    status: 'Próxima publicación',
    color: 'from-cyan-600 via-blue-600 to-teal-700',
  },
];

export default async function BooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Colección Oficial de Libros</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Historias que despiertan la imaginación
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Libros de gran formato, encuadernación cuidada e ilustraciones que transportan a pequeños y mayores al corazón de cada país.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {BOOKS.map((book) => (
            <div
              key={book.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-10 flex flex-col justify-between hover:border-amber-400/40 transition-all shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                    {book.volume} • 📍 {book.destinations}
                  </span>
                  <span className="text-xs font-bold bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                    {book.ageRange}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{book.title}</h2>
                <p className="text-xs text-slate-400 font-semibold mb-4">{book.pages}</p>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">{book.description}</p>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {book.status}
                </span>

                <Link
                  href={`/${locale}/contacto`}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-md"
                >
                  Información & Puntos de Venta
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
