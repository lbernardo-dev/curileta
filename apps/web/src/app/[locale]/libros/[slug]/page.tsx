import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { locales, isValidLocale, type Locale } from '@curileta/i18n';
import { cmsProvider } from '@/lib/cms';
import { generateBookSchema } from '@curileta/seo';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { AmazonMarketplaceLink } from '@/components/AmazonMarketplaceLink';
import { ShareActions } from '@/components/ShareActions';
import { CURILETA_BOOK_SLUG, detectAmazonCountryFromHeaders } from '@/lib/amazon-marketplace';
import { CURILETA_BOOK_APLUS, CURILETA_BOOK_BACK_COVER, getBookCoverImage } from '@/lib/book-art';
import { getImageFrameSettings } from '@/lib/image-frame-settings.server';
import { getImageFrame } from '@/lib/image-frames';

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
  const coverImage = getBookCoverImage(book);
  const imageUrl = coverImage.url.startsWith('http')
    ? coverImage.url
    : new URL(coverImage.url, process.env.NEXT_PUBLIC_SITE_URL || 'https://curileta.com').toString();

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: [{ url: imageUrl }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [imageUrl] },
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
  const isCuriletaBook = book.slug === CURILETA_BOOK_SLUG || book.id === CURILETA_BOOK_SLUG;
  const coverImage = getBookCoverImage(book);
  const imageFrames = isCuriletaBook ? await getImageFrameSettings() : {};
  const detailCoverFrame = isCuriletaBook ? getImageFrame(imageFrames, 'book-detail-cover') : null;
  const coverAlt = coverImage.alt[locale] || coverImage.alt.es;
  const imageUrl = coverImage.url.startsWith('http')
    ? coverImage.url
    : new URL(coverImage.url, process.env.NEXT_PUBLIC_SITE_URL || 'https://curileta.com').toString();

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
    <div className="min-h-screen bg-[#000000] py-16 text-white sm:py-24">
      {/* Schema.org JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/libros`}
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-amber-400 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === 'en' ? 'Back to books' : 'Volver al catálogo de libros'}</span>
        </Link>

        {/* Book Hero Showcase */}
        <div className="flex flex-col items-center gap-10 rounded-3xl border border-[#313131] bg-[#181818] p-6 shadow-2xl sm:p-10 md:flex-row md:p-12">
          {isCuriletaBook ? (
            <div className="flex w-full max-w-lg shrink-0 items-end justify-center gap-4 md:w-[44%] md:max-w-none">
              <figure className="w-7/12 max-w-72">
                <a
                  href={coverImage.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={locale === 'en' ? 'Open the full size front cover' : 'Abrir la portada a tamaño completo'}
                  className="relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <Image
                    src={coverImage.url}
                    alt={coverAlt}
                    fill
                    sizes="(max-width: 768px) 58vw, 280px"
                    className="object-cover"
                    style={detailCoverFrame ? {
                      objectPosition: `${detailCoverFrame.positionX}% ${detailCoverFrame.positionY}%`,
                      transform: `scale(${detailCoverFrame.zoom})`,
                      transformOrigin: `${detailCoverFrame.positionX}% ${detailCoverFrame.positionY}%`,
                    } : undefined}
                    priority
                  />
                </a>
                <figcaption className="mt-3 text-center text-xs font-semibold text-slate-300">
                  {locale === 'en' ? 'Front cover' : 'Portada'}
                </figcaption>
              </figure>
              <figure className="w-5/12 max-w-52">
                <a
                  href={CURILETA_BOOK_BACK_COVER.src}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={locale === 'en' ? 'Open the full size back cover' : 'Abrir la contraportada a tamaño completo'}
                  className="block rounded-2xl bg-[#fff8e7] p-2 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <Image src={CURILETA_BOOK_BACK_COVER.src} alt={CURILETA_BOOK_BACK_COVER.alt[locale] || CURILETA_BOOK_BACK_COVER.alt.es} width={CURILETA_BOOK_BACK_COVER.width} height={CURILETA_BOOK_BACK_COVER.height} sizes="(max-width: 768px) 40vw, 200px" className="h-auto w-full rounded-lg" />
                </a>
                <figcaption className="mt-3 text-center text-xs font-semibold text-slate-300">
                  {locale === 'en' ? 'Back cover' : 'Contraportada'}
                </figcaption>
              </figure>
            </div>
          ) : (
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl border border-[#313131] bg-[#131209] shadow-2xl md:w-[48%]">
              <img
                src={coverImage.url}
                alt={coverAlt}
                className="h-full w-full object-contain transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white/90">
                {locale === 'en' ? 'Story illustration' : 'Ilustración de la aventura'}
              </span>
            </div>
          )}

          {/* Details */}
          <div className="space-y-4 flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-slate-950">
                {locale === 'en' ? `Ages ${book.ageRange}` : `Edad: ${book.ageRange}`}
              </span>
              <span className="rounded-full border border-[#313131] bg-[#272727] px-3 py-1 text-xs font-semibold text-slate-300">
                {locale === 'en' ? `${book.pageCount} pages` : `${book.pageCount} páginas`}
              </span>
              {format && (
                <span className="rounded-full border border-[#313131] bg-[#272727] px-3 py-1 text-xs font-semibold text-slate-300">
                  {format}
                </span>
              )}
            </div>

            <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
            {subtitle && (
              <p className="text-base text-amber-300 font-bold uppercase tracking-wider">
                {subtitle}
              </p>
            )}

            <p className="text-pretty pt-2 text-sm leading-relaxed text-slate-300 sm:text-base">{desc}</p>
            <ShareActions contentType="book" contentSlug={book.slug} title={title} description={desc} locale={locale} />
            {book.author && (
              <p className="text-xs text-slate-400">
                {locale === 'en' ? 'Author:' : 'Autoría:'} <span className="font-semibold text-slate-200">{book.author}</span>
              </p>
            )}

            {/* Purchase Points */}
            {isCuriletaBook && (
              <div className="space-y-3 pt-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'en' ? 'Order from your local Amazon store' : 'Compra en tu tienda local de Amazon'}
                </h2>
                <AmazonMarketplaceLink locale={locale} initialCountry={amazonCountry} />
                {book.isbn?.[0] && (
                  <p className="text-xs text-slate-500">ISBN-13: {book.isbn[0]}</p>
                )}
              </div>
            )}
            {!isCuriletaBook && book.purchaseLinks && book.purchaseLinks.length > 0 && (
              <div className="space-y-3 pt-6">
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
                      className="flex items-center gap-1.5 rounded-xl border border-[#313131] bg-[#000000] px-4 py-2 text-xs font-semibold text-slate-200 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#272727] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    >
                      <span>{store.storeName}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            {!isCuriletaBook && (!book.purchaseLinks || book.purchaseLinks.length === 0) && (
              <div className="pt-6">
                <Link href={`/${locale}/contacto`} className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
                  {locale === 'en' ? 'Ask about availability' : 'Consultar disponibilidad'} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {isCuriletaBook && (
          <section aria-labelledby="book-aplus-heading" className="mt-16 sm:mt-24">
            <header className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
                {locale === 'en' ? 'Inside the Spanish edition' : 'Así se presenta la edición española'}
              </p>
              <h2 id="book-aplus-heading" className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                {locale === 'en' ? 'A world of stories on every page' : 'Un mundo de historias en cada página'}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-6 text-slate-300 sm:text-base">
                {locale === 'en'
                  ? 'Explore the original A+ images from the published Amazon listing. Their artwork and Spanish text are shown as they appear in the book presentation.'
                  : 'Explora las imágenes A+ originales de la ficha publicada en Amazon. Conservan la ilustración y los textos de la presentación del libro.'}
              </p>
            </header>

            <div className="space-y-8">
              {CURILETA_BOOK_APLUS.map((panel, index) => (
                <figure key={panel.src} className="overflow-hidden rounded-3xl bg-[#fff8e7] p-3 shadow-xl ring-1 ring-[#e7d6ae] sm:p-4">
                  <a
                    href={panel.src}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={locale === 'en' ? `Open full size image: ${panel.title.en}` : `Abrir imagen a tamaño completo: ${panel.title.es}`}
                    className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
                  >
                    <Image
                      src={panel.src}
                      alt={panel.alt[locale] || panel.alt.es}
                      width={panel.width}
                      height={panel.height}
                      sizes="(max-width: 768px) 100vw, 1152px"
                      className="h-auto w-full rounded-xl"
                    />
                  </a>
                  <figcaption className="flex flex-wrap items-center justify-between gap-3 px-2 pb-2 pt-4 text-slate-800 sm:px-3 sm:pb-3">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1c493b] text-sm font-semibold text-white">{index + 1}</span>
                      <span className="text-base font-semibold">{panel.title[locale] || panel.title.es}</span>
                    </span>
                    <a href={panel.src} target="_blank" rel="noreferrer" className="text-xs font-medium text-slate-600 underline decoration-[#9b8a66] underline-offset-4 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800">
                      {locale === 'en' ? 'Open full size' : 'Ver imagen completa'}
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-12 rounded-3xl bg-[#181818] px-6 py-10 text-center ring-1 ring-[#313131] sm:px-10">
              <h3 className="text-balance text-2xl font-semibold text-white sm:text-3xl">
                {locale === 'en' ? 'Ready to travel with Curileta?' : '¿Te unes al viaje de Curileta?'}
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-6 text-slate-300">
                {locale === 'en' ? 'Choose your local Amazon store to see the published edition.' : 'Elige tu tienda local de Amazon para consultar la edición publicada.'}
              </p>
              <div className="mt-6 flex justify-center">
                <AmazonMarketplaceLink locale={locale} initialCountry={amazonCountry} />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
