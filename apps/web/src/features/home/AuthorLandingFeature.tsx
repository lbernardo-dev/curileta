import { ContentImage } from '@/components/ContentImage';
import Link from 'next/link';
import type { Locale } from '@curileta/i18n';
import { ArrowRight } from 'lucide-react';
import type { AuthorPage } from '@/lib/author-pages';
import type { Book } from '@curileta/cms';

export function AuthorLandingFeature({
  locale,
  authors,
  books,
  headingId = 'home-authors-heading',
  showEmptyState = false,
}: {
  locale: Locale;
  authors: AuthorPage[];
  books: Book[];
  headingId?: string;
  showEmptyState?: boolean;
}) {
  if (!authors.length && !showEmptyState) return null;
  const isEn = locale === 'en';

  return (
    <section aria-labelledby={headingId} className="relative z-10 border-t border-[var(--border-subtle)] bg-[#FAFDF7] px-5 py-20 text-slate-900 transition-colors duration-500 dark:border-[#272727] dark:bg-[#181818] dark:text-white sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-400">
            {isEn ? 'Behind the books' : 'Detrás de los libros'}
          </p>
          <h2 id={headingId} className="mt-2 text-balance font-display text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            {isEn ? 'Meet the authors' : 'Conoce a sus autoras'}
          </h2>
          <p className="mt-3 text-pretty text-base leading-6 text-slate-600 dark:text-slate-300">
            {isEn ? 'Meet the people who write Curileta’s adventures.' : 'Conoce a las personas que escriben las aventuras de Curileta.'}
          </p>
        </header>
        {authors.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {authors.map((author) => {
              const count = books.filter((book) => book.author?.trim().toLocaleLowerCase() === author.author_name.trim().toLocaleLowerCase()).length;
              return (
                <article key={author.slug} className="grid items-center gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl dark:border-[#313131] dark:bg-[#1F1F1F] sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                  {author.portrait_url ? (
                    <ContentImage src={author.portrait_url} alt={isEn ? `Portrait of ${author.name.en || author.name.es}` : `Retrato de ${author.name.es}`} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm" />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-[#f0eee6] text-5xl font-semibold text-emerald-900 dark:bg-[#272727] dark:text-emerald-200" aria-hidden="true">
                      {(author.name[locale] || author.name.es).slice(0, 1)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">{author.name[locale] || author.name.es}</h3>
                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{author.biography[locale] || author.biography.es}</p>
                    <p className="mt-3 text-xs font-semibold text-emerald-800 dark:text-amber-400">{count} {isEn ? (count === 1 ? 'book' : 'books') : (count === 1 ? 'libro' : 'libros')}</p>
                    <Link href={`/${locale}/autora/${author.slug}`} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
                      {isEn ? 'Read the author page' : 'Leer la página de autora'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200/80 bg-white px-6 py-10 text-center dark:border-[#313131] dark:bg-[#1F1F1F]">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {isEn ? 'Author profiles will appear here when they are published.' : 'Los perfiles de autoras aparecerán aquí cuando se publiquen.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
