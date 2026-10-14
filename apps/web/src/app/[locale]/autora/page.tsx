import { ContentImage } from '@/components/ContentImage';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@curileta/i18n';
import { getAuthorPages } from '@/lib/author-pages.server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'en' ? 'Authors' : 'Autoras', description: locale === 'en' ? 'Meet the authors behind Curileta books.' : 'Conoce a las autoras de los libros de Curileta.' };
}

export default async function AuthorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const authors = await getAuthorPages();
  const isEn = locale === 'en';

  return <section className="min-h-[70vh] bg-[#f8f6ef] py-16 text-slate-900 dark:bg-[#181818] dark:text-white sm:py-24">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">{isEn ? 'Stories and storytellers' : 'Historias y autoras'}</p><h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">{isEn ? 'Meet the authors' : 'Conoce a las autoras'}</h1><p className="mt-4 text-pretty text-base leading-6 text-slate-600 dark:text-slate-300">{isEn ? 'Discover the people who bring Curileta books to life.' : 'Descubre quién da vida a los libros de Curileta.'}</p></header>
      {authors.length ? <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => <article key={author.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#313131] dark:bg-[#1f1f1f]">
          {author.portrait_url && <ContentImage src={author.portrait_url} alt={isEn ? `Portrait of ${author.name.en || author.name.es}` : `Retrato de ${author.name.es}`} className="aspect-4/3 w-full object-cover" />}
          <div className="p-5"><h2 className="text-xl font-semibold">{author.name[locale] || author.name.es}</h2><p className="mt-2 line-clamp-4 text-sm leading-5 text-slate-600 dark:text-slate-300">{author.biography[locale] || author.biography.es}</p><Link href={`/${locale}/autora/${author.slug}`} className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-fluid hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600">{isEn ? 'Meet the author' : 'Conocer a la autora'}</Link></div>
        </article>)}
      </div> : <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-[#313131] dark:bg-[#1f1f1f]"><h2 className="text-xl font-semibold">{isEn ? 'Author pages are in preparation' : 'Las páginas de autoras están en preparación'}</h2><p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-300">{isEn ? 'New author profiles will appear here when they are published.' : 'Los nuevos perfiles aparecerán aquí cuando se publiquen.'}</p></div>}
    </div>
  </section>;
}
