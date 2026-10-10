import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { locales, Locale, isValidLocale } from '@curileta/i18n';
import { cmsProvider } from '@/lib/cms';
import { generateBookSchema } from '@curileta/seo';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { AmazonMarketplaceLink } from '@/components/AmazonMarketplaceLink';
import { ShareActions } from '@/components/ShareActions';
import { CURILETA_BOOK_SLUG, detectAmazonCountryFromHeaders } from '@/lib/amazon-marketplace';

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
    title,
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
  const format = book.format?.[locale] || book.format?.es;
  const amazonCountry = detectAmazonCountryFromHeaders(await headers());
  const imageUrl = book.coverImage.url.startsWith('http')
    ? book.coverImage.url
    : new URL(book.coverImage.url, process.env.NEXT_PUBLIC_SITE_URL || 'https://curileta.com').toString();

  // JSON-LD structured data
  const jsonLd = generateBookSchema({
    title,
    isbn: book.isbn?.[0],
    datePublished: book.publicationDate,
    description: desc,
    image: imageUrl,
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
          <span>{locale === 'en' ? 'Back to books' : 'Volver al catálogo de libros'}</span>
        </Link>

        {/* Book Hero Showcase */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row gap-10 items-center">
          {/* Cover */}
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl border border-slate-700 bg-[#102925] shadow-2xl md:w-[48%]">
            <img
              src={book.coverImage.url}
              alt={book.coverImage.alt[locale] || book.coverImage.alt.es}
              className="h-full w-full object-contain transition-transform duration-500"
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/70 px-3 py-1 text-[10px] font-semibold text-white/90">
              {locale === 'en' ? 'Story illustration' : 'Ilustración de la aventura'}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-4 flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                {locale === 'en' ? `Ages ${book.ageRange}` : `Edad: ${book.ageRange}`}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {locale === 'en' ? `${book.pageCount} pages` : `${book.pageCount} páginas`}
              </span>
              {format && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {format}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-base text-amber-300 font-bold uppercase tracking-wider">
                {subtitle}
              </p>
            )}

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">{desc}</p>
            <ShareActions contentType="book" contentSlug={book.slug} title={title} description={desc} locale={locale} />
            {book.author && (
              <p className="text-xs text-slate-400">
                {locale === 'en' ? 'Author:' : 'Autoría:'} <span className="font-semibold text-slate-200">{book.author}</span>
              </p>
            )}

            {/* Purchase Points */}
            {book.slug === CURILETA_BOOK_SLUG && (
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'en' ? 'Order from your local Amazon store' : 'Compra en tu tienda local de Amazon'}
                </h2>
                <AmazonMarketplaceLink locale={locale} initialCountry={amazonCountry} />
                {book.isbn?.[0] && (
                  <p className="text-xs text-slate-500">ISBN-13: {book.isbn[0]}</p>
                )}
              </div>
            )}
            {book.slug !== CURILETA_BOOK_SLUG && book.purchaseLinks && book.purchaseLinks.length > 0 && (
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'en' ? 'Where to find it:' : 'Puntos de venta:'}
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
            {(!book.purchaseLinks || book.purchaseLinks.length === 0) && (
              <div className="pt-6">
                <Link href={`/${locale}/contacto`} className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200">
                  {locale === 'en' ? 'Ask about availability' : 'Consultar disponibilidad'} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
