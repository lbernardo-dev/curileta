import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Locale, isValidLocale } from '@curileta/i18n';
import { cmsProvider } from '@/lib/cms';
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock3 } from 'lucide-react';
import { AmazonMarketplaceLink } from '@/components/AmazonMarketplaceLink';
import { CURILETA_BOOK_SLUG, detectAmazonCountryFromHeaders } from '@/lib/amazon-marketplace';
import { getBookCoverImage } from '@/lib/book-art';
import { getImageFrameSettings } from '@/lib/image-frame-settings.server';
import { getImageFrame } from '@/lib/image-frames';
import { BookCoverPanel } from '@/components/BookCoverPanel';
import { getBookCatalogSettings } from '@/lib/book-catalog.server';
import { isBookPublished, mergeBookCatalog } from '@/lib/book-catalog';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Books', description: 'Discover illustrated Curileta stories and see which journeys are available.' }
    : { title: 'Libros', description: 'Descubre las historias ilustradas de Curileta y consulta qué aventuras están publicadas.' };
}

export default async function BooksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const [baseBooks, requestHeaders, imageFrames, catalogSettings] = await Promise.all([
    cmsProvider.getBooks(locale),
    headers(),
    getImageFrameSettings(),
    getBookCatalogSettings(),
  ]);
  const books = mergeBookCatalog(baseBooks, catalogSettings);
  const amazonCountry = detectAmazonCountryFromHeaders(requestHeaders);
  const isEn = locale === 'en';
  const now = Date.now();

  return (
    <div className="min-h-screen bg-[#faf9f4] py-16 text-[#20352c] sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <header className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
            <BookOpen className="h-4 w-4" />
            {isEn ? 'Stories to share' : 'Historias para compartir'}
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
            {isEn ? 'A little book. A very big world.' : 'Un libro pequeño. Un mundo enorme.'}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#5c6b61]">
            {isEn
              ? 'Follow Curileta’s journeys through illustrated stories made for curious readers and shared reading time.'
              : 'Acompaña a Curileta por historias ilustradas para lectores curiosos y momentos de lectura en familia.'}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {books.map((book) => {
            const isPublished = isBookPublished(book, now);
            const title = book.title[locale] || book.title.es;
            const subtitle = book.subtitle?.[locale] || book.subtitle?.es;
            const description = book.description[locale] || book.description.es;
            const format = book.format?.[locale] || book.format?.es;
            const coverImage = getBookCoverImage(book);
            const isCuriletaBook = book.slug === CURILETA_BOOK_SLUG || book.id === CURILETA_BOOK_SLUG;
            const coverFrame = isCuriletaBook ? getImageFrame(imageFrames, 'catalog-book-cover') : null;
            const formattedDate = book.publicationDate
              ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${book.publicationDate}T12:00:00Z`))
              : (isEn ? 'To be announced' : 'Fecha por anunciar');

            return (
              <article key={book.id} className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_60px_rgba(24,54,41,0.08)] ring-1 ring-[#20352c]/[0.08]">
                <div className="relative">
                  <BookCoverPanel
                    src={coverImage.url}
                    alt={coverImage.alt[locale] || coverImage.alt.es}
                    locale={locale as Locale}
                    upcoming={!isPublished}
                    frame={coverFrame}
                  />
                  <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#254537] shadow-sm">
                    {isPublished ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> : <Clock3 className="h-3.5 w-3.5 text-amber-700" />}
                    {isPublished ? (isEn ? 'Published' : 'Publicado') : (isEn ? 'Coming soon' : 'Próximamente')}
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[#647268]">
                    {(isPublished || book.publicationDate) && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{isPublished ? (isEn ? 'Published' : 'Publicado') : (isEn ? 'Expected' : 'Previsto')}: {formattedDate}</span>}
                    {book.ageRange && <span className="rounded-full bg-[#f1f3eb] px-2.5 py-1">{book.ageRange}</span>}
                    {book.pageCount && <span>{book.pageCount} {isEn ? 'pages' : 'páginas'}</span>}
                    {format && <span>{format}</span>}
                    {book.author && <span>{isEn ? `By ${book.author}` : `De ${book.author}`}</span>}
                  </div>
                  <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{title}</h2>
                  {subtitle && <p className="mt-2 text-sm font-medium text-emerald-800">{subtitle}</p>}
                  <p className="mt-4 text-sm leading-6 text-[#5c6b61]">{description}</p>
                  <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-[#e7eae2] pt-5">
                    <Link href={`/${locale}/libros/${book.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1c493b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#27634e]">
                      {isEn ? 'Book details' : 'Detalles del libro'} <ArrowRight className="h-4 w-4" />
                    </Link>
                    {book.slug === CURILETA_BOOK_SLUG && isPublished && (
                      <AmazonMarketplaceLink locale={locale} initialCountry={amazonCountry} compact />
                    )}
                    {isPublished && (!book.purchaseLinks || book.purchaseLinks.length === 0) && (
                      <span className="text-xs text-[#718076]">{isEn ? 'Retail links will appear when confirmed.' : 'Los puntos de venta se mostrarán cuando estén confirmados.'}</span>
                    )}
                    {!isPublished && <span className="text-xs text-[#718076]">{isEn ? 'Publication details may change.' : 'La fecha prevista puede cambiar.'}</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
