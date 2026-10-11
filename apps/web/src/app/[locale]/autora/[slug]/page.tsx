import { ContentImage } from '@/components/ContentImage';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { isValidLocale } from '@curileta/i18n';
import { cmsProvider } from '@/lib/cms';
import { getAuthorPageBySlug } from '@/lib/author-pages.server';
import { getBookAuthorPage } from '@/lib/author-pages';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.curileta.com').replace(/\/$/, '');

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const author = await getAuthorPageBySlug(slug);
  if (!author) return { title: locale === 'en' ? 'Author not found' : 'Autora no encontrada' };
  const contentLocale = locale === 'en' ? 'en' : 'es';
  const name = author.name[contentLocale] || author.name.es;
  const description = author.biography[contentLocale] || author.biography.es;
  return {
    title: name,
    description,
    alternates: { canonical: `${siteUrl}/${locale}/autora/${slug}` },
    openGraph: { title: name, description, url: `${siteUrl}/${locale}/autora/${slug}`, images: author.portrait_url ? [author.portrait_url] : undefined },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const [author, books] = await Promise.all([getAuthorPageBySlug(slug), cmsProvider.getBooks(locale)]);
  if (!author) notFound();
  const authoredBooks = books.filter((book) => getBookAuthorPage(book, [author]));
  const isEn = locale === 'en';
  const links = [
    { label: isEn ? 'Website' : 'Sitio web', url: author.website_url },
    { label: 'Instagram', url: author.instagram_url },
    { label: 'YouTube', url: author.youtube_url },
  ].filter((link) => link.url);

  return <article className="min-h-[70vh] bg-[#f8f6ef] py-12 text-slate-900 dark:bg-[#181818] dark:text-white sm:py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <Link href={`/${locale}/autora`} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-emerald-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200 dark:hover:bg-[#272727]"><ArrowLeft className="h-4 w-4" />{isEn ? 'All authors' : 'Todas las autoras'}</Link>
      <header className="mt-8 grid items-center gap-8 rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        {author.portrait_url ? <ContentImage src={author.portrait_url} alt={isEn ? `Portrait of ${author.name.en || author.name.es}` : `Retrato de ${author.name.es}`} className="aspect-[4/3] w-full rounded-2xl object-cover" /> : <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-[#f0eee6] text-6xl font-semibold text-emerald-900 dark:bg-[#272727] dark:text-emerald-200" aria-hidden="true">{(author.name[locale] || author.name.es).slice(0, 1)}</div>}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">{isEn ? 'Author of Curileta books' : 'Autora de los libros de Curileta'}</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">{author.name[locale] || author.name.es}</h1>
          <p className="mt-5 whitespace-pre-line text-pretty text-base leading-7 text-slate-700 dark:text-slate-200">{author.biography[locale] || author.biography.es}</p>
          {author.quote[locale] && <blockquote className="mt-6 rounded-xl bg-[#f4f3ec] px-5 py-4 text-base font-medium text-emerald-950 dark:bg-[#272727] dark:text-emerald-100">“{author.quote[locale]}”</blockquote>}
          {links.length > 0 && <nav aria-label={isEn ? 'Author links' : 'Enlaces de la autora'} className="mt-6 flex flex-wrap gap-3">{links.map((link) => <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:hover:bg-[#272727]">{link.label}<ArrowUpRight className="h-4 w-4" /></a>)}</nav>}
        </div>
      </header>

      <section className="mt-12" aria-labelledby="author-books-heading">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">{isEn ? 'Her books' : 'Sus libros'}</p><h2 id="author-books-heading" className="mt-2 text-2xl font-bold">{isEn ? 'Books by this author' : 'Libros de esta autora'}</h2></div><span className="text-sm text-slate-600 dark:text-slate-300">{authoredBooks.length} {isEn ? 'books' : authoredBooks.length === 1 ? 'libro' : 'libros'}</span></div>
        {authoredBooks.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{authoredBooks.map((book) => <Link key={book.slug} href={`/${locale}/libros/${book.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#1f1f1f]"><ContentImage src={book.coverImage.url} alt={book.coverImage.alt[locale] || book.coverImage.alt.es} className="aspect-[4/3] w-full bg-[#131209] object-contain p-4" /><div className="p-4"><h3 className="text-lg font-semibold group-hover:text-emerald-800 dark:group-hover:text-emerald-300">{book.title[locale] || book.title.es}</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{book.subtitle?.[locale] || book.subtitle?.es || author.name[locale] || author.name.es}</p></div></Link>)}</div> : <p className="mt-5 rounded-xl bg-white px-5 py-8 text-sm text-slate-600 dark:bg-[#1f1f1f] dark:text-slate-300">{isEn ? 'No published books are linked to this author yet.' : 'Todavía no hay libros publicados vinculados a esta autora.'}</p>}
      </section>
    </div>
  </article>;
}
