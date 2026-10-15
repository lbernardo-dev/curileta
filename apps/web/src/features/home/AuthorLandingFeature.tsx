import { ContentImage } from '@/components/ContentImage';
import Link from 'next/link';
import type { Locale } from '@curileta/i18n';
import { ArrowRight, Feather, ShieldCheck } from 'lucide-react';
import type { AuthorPage } from '@/lib/author-pages';
import type { Book } from '@curileta/cms';
import { AuthorStackedBooksDeck } from './AuthorStackedBooksDeck';

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
    <section
      aria-labelledby={headingId}
      className="relative z-10 border-t border-[var(--border-subtle)] bg-[#FAFDF7] px-5 py-20 text-slate-900 transition-colors duration-500 dark:border-[#272727] dark:bg-[#181818] dark:text-white sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-400">
            {isEn ? 'Behind the stories' : 'Detrás de las historias'}
          </p>
          <h2
            id={headingId}
            className="mt-2 text-balance font-display text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
          >
            {isEn ? 'Meet the author' : 'Conoce a la autora'}
          </h2>
          <p className="mt-3 text-pretty text-base leading-6 text-slate-600 dark:text-slate-300">
            {isEn
              ? 'Meet the creative mind who writes Curileta’s adventures and creates books for young readers.'
              : 'Conoce la voz creadora que da vida a las aventuras de Curileta y a sus publicaciones infantiles.'}
          </p>
        </header>

        {authors.length === 1 ? (
          // Disposición especial de ancho completo cuando hay una única autora
          (() => {
            const author = authors[0];
            const authorName = author.name[locale] || author.name.es;
            const authorBio = author.biography[locale] || author.biography.es;
            const authorQuote = author.quote[locale] || author.quote.es;
            const authoredBooksCount = books.filter(
              (book) =>
                book.author?.trim().toLocaleLowerCase() ===
                author.author_name.trim().toLocaleLowerCase()
            ).length;

            return (
              <article className="w-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] dark:border-[#313131] dark:bg-[#1F1F1F] sm:p-10 lg:p-12">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12 items-center">
                  {/* Columna Izquierda: Perfil, Avatar Circular y Biografía */}
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      {/* Avatar en círculo impecable */}
                      <div className="relative shrink-0">
                        {author.portrait_url ? (
                          <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full border-4 border-amber-300/40 shadow-xl ring-4 ring-emerald-900/10 dark:ring-white/10">
                            <ContentImage
                              src={author.portrait_url}
                              alt={isEn ? `Portrait of ${authorName}` : `Retrato de ${authorName}`}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full bg-[#f0eee6] text-5xl font-semibold text-emerald-900 border-4 border-amber-300/40 shadow-xl dark:bg-[#272727] dark:text-emerald-200"
                            aria-hidden="true"
                          >
                            {authorName.slice(0, 1)}
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-amber-300 shadow-md border-2 border-white dark:border-[#1F1F1F]">
                          <Feather className="h-4 w-4" />
                        </span>
                      </div>

                      {/* Identidad y Distintivo */}
                      <div className="space-y-2 text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-[#272727] dark:text-emerald-300">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{isEn ? 'Official Author & Illustrator' : 'Autora e ilustradora oficial'}</span>
                        </div>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                          {authorName}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {isEn ? 'Author alias on Amazon KDP' : 'Firma editorial en Amazon KDP'}
                        </p>
                      </div>
                    </div>

                    {/* Cita destacada si existe */}
                    {authorQuote && (
                      <blockquote className="rounded-2xl border border-emerald-500/20 bg-[#FAFDF7] p-4 text-sm font-medium text-emerald-950 dark:border-[#383838] dark:bg-[#272727] dark:text-emerald-100">
                        {authorQuote}
                      </blockquote>
                    )}

                    {/* Biografía */}
                    <p className="text-pretty text-base leading-7 text-slate-600 dark:text-slate-300">
                      {authorBio}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Link
                        href={`/${locale}/autora/${author.slug}`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                      >
                        <span>{isEn ? 'Read full author profile' : 'Ver perfil completo de la autora'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {authoredBooksCount > 0 ? (
                          <>
                            {authoredBooksCount}{' '}
                            {isEn
                              ? authoredBooksCount === 1 ? 'official book in catalog' : 'official books in catalog'
                              : authoredBooksCount === 1 ? 'libro oficial en catálogo' : 'libros oficiales en catálogo'}
                          </>
                        ) : (
                          <>{isEn ? 'Curileta Official Series' : 'Serie oficial Curileta'}</>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Columna Derecha: Libros solapados con solapas interactivas */}
                  <div className="lg:pl-4">
                    <AuthorStackedBooksDeck
                      locale={locale}
                      books={books}
                      authorSlug={author.slug}
                      authorName={authorName}
                    />
                  </div>
                </div>
              </article>
            );
          })()
        ) : authors.length > 1 ? (
          // Disposición para múltiples autoras con avatar circular
          <div className="grid gap-8 md:grid-cols-2">
            {authors.map((author) => {
              const authorName = author.name[locale] || author.name.es;
              const count = books.filter(
                (book) =>
                  book.author?.trim().toLocaleLowerCase() ===
                  author.author_name.trim().toLocaleLowerCase()
              ).length;

              return (
                <article
                  key={author.slug}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl dark:border-[#313131] dark:bg-[#1F1F1F]"
                >
                  {author.portrait_url ? (
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-amber-300/40 shadow-md">
                      <ContentImage
                        src={author.portrait_url}
                        alt={isEn ? `Portrait of ${authorName}` : `Retrato de ${authorName}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[#f0eee6] text-4xl font-semibold text-emerald-900 dark:bg-[#272727] dark:text-emerald-200"
                      aria-hidden="true"
                    >
                      {authorName.slice(0, 1)}
                    </div>
                  )}

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                      {authorName}
                    </h3>
                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {author.biography[locale] || author.biography.es}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-emerald-800 dark:text-amber-400">
                      {count} {isEn ? (count === 1 ? 'book' : 'books') : (count === 1 ? 'libro' : 'libros')}
                    </p>
                    <Link
                      href={`/${locale}/autora/${author.slug}`}
                      className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-emerald-800 px-5 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                    >
                      <span>{isEn ? 'Read author page' : 'Leer la página de autora'}</span>
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
              {isEn
                ? 'Author profiles will appear here when they are published.'
                : 'Los perfiles de autoras aparecerán aquí cuando se publiquen.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

