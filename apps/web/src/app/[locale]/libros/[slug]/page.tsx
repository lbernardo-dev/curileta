import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales, Locale, isValidLocale } from '@curileta/i18n';
import { cmsProvider } from '@curileta/cms';
import { generateBookSchema } from '@curileta/seo';
import { BookOpen, ArrowLeft, ExternalLink, CheckCircle2, Bookmark, Calendar, Globe } from 'lucide-react';

export async function generateStaticParams() {
  const books = await cmsProvider.getBooks('es');
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    for (const b of books) {
      params.push({ locale, slug: b.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;
  const book = await cmsProvider.getBookBySlug(slug, locale);

  if (!book) {
    return { title: 'Libro no encontrado' };
  }

  const title = book.title[locale] || book.title.es;
  const desc = book.description[locale] || book.description.es;

  return {
    title: `${title} — Las Aventuras de Curileta`,
    description: desc,
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const book = await cmsProvider.getBookBySlug(slug, locale);

  if (!book) {
    notFound();
  }

  const title = book.title[locale] || book.title.es;
  const subtitle = book.subtitle?.[locale] || book.subtitle?.es;
  const desc = book.description[locale] || book.description.es;

  // JSON-LD structured data
  const jsonLd = generateBookSchema({
    title,
    isbn: book.isbn?.[0],
    datePublished: book.publicationDate,
    description: desc,
    image: book.coverImage.url,
    inLanguage: locale,
  });

  return (
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen">
      {/* Schema.org JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/libros`}
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo de libros</span>
        </Link>

        {/* Book Hero Showcase */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row gap-10 items-center">
          {/* Cover */}
          <div className="w-60 sm:w-72 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative group">
            <img
              src={book.coverImage.url}
              alt={book.coverImage.alt[locale] || book.coverImage.alt.es}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Details */}
          <div className="space-y-4 flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                Edad: {book.ageRange}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {book.pageCount} páginas
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-base text-amber-300 font-bold uppercase tracking-wider">
                {subtitle}
              </p>
            )}

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">{desc}</p>

            {/* Purchase Points */}
            {book.purchaseLinks && book.purchaseLinks.length > 0 && (
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Puntos de venta recomendados:
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  {book.purchaseLinks.map((store) => (
                    <a
                      key={store.storeName}
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <span>{store.storeName}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
