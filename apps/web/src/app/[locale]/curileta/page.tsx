import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Locale, isValidLocale } from '@curileta/i18n';
import { cmsProvider } from '@/lib/cms';
import { CharacterAvatarImage } from '@/components/CharacterAvatarImage';
import { ArrowRight, BookOpen, Compass, Heart, Map } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Meet Curileta', description: 'Meet Curileta, the curious explorer who follows maps, makes friends, and sends letters home.' }
    : { title: 'Conoce a Curileta', description: 'Conoce a Curileta, la exploradora curiosa que sigue mapas, hace amigos y envía cartas a casa.' };
}

export default async function CuriletaBioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const character = await cmsProvider.getCharacterBySlug('curileta', locale as Locale);
  if (!character) notFound();

  const isEn = locale === 'en';
  const quote = character.voiceQuote?.[locale] || character.voiceQuote?.es;
  const biography = character.biography?.[locale] || character.biography?.es;
  const items = character.backpackItems || [];
  const facts = character.curiosityFacts || [];
  const qualities = isEn
    ? ['Curious', 'Brave', 'Loyal', 'Observant', 'Empathetic']
    : ['Curiosa', 'Valiente', 'Leal', 'Observadora', 'Empática'];

  return (
    <div className="min-h-screen bg-[var(--background-canvas)] py-12 text-[var(--text-primary)] sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <section className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(25,57,42,0.12)] ring-1 ring-[#20352c]/10 dark:bg-slate-900 dark:ring-white/10 md:grid-cols-[0.88fr_1.12fr]">
          <div className="relative min-h-[28rem] bg-[#f1ead7] dark:bg-slate-800 sm:min-h-[34rem]">
            <Image
              src={character.mainImage.url}
              alt={character.mainImage.alt[locale] || character.mainImage.alt.es}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-contain object-bottom p-5 sm:p-8"
            />
            <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#254537] shadow-sm dark:bg-slate-950/85 dark:text-emerald-100">
              <Compass className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
              {isEn ? 'Explorer and mapmaker' : 'Exploradora y cartógrafa'}
            </span>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
              <Map className="h-4 w-4" />
              {character.passportRole?.[locale] || character.passportRole?.es}
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">Curileta</h1>
            {quote && (
              <blockquote className="mt-5 flex max-w-xl items-center gap-3 text-xl font-medium leading-8 text-emerald-900 dark:text-emerald-200">
                <CharacterAvatarImage
                  slug={character.slug}
                  name={character.name}
                  size={48}
                  alt={isEn ? `${character.name} portrait` : `Retrato de ${character.name}`}
                />
                <span>{quote}</span>
              </blockquote>
            )}
            {biography && <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">{biography}</p>}

            <div className="mt-7 flex flex-wrap gap-2" aria-label={isEn ? 'Curileta’s qualities' : 'Cualidades de Curileta'}>
              {qualities.map((quality) => (
                <span key={quality} className="rounded-full bg-[#f2f3ec] px-3 py-1.5 text-xs font-medium text-[#3e5548] dark:bg-slate-800 dark:text-slate-200">{quality}</span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={`/${locale}/libros/las-aventuras-de-curileta`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1c493b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27634e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                <BookOpen className="h-4 w-4" />{isEn ? 'Read her story' : 'Leer su historia'}<ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={`/${locale}/personajes`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#cbd6c8] px-5 py-3 text-sm font-semibold text-[#254537] transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
                <Heart className="h-4 w-4" />{isEn ? 'Meet her friends' : 'Conocer a sus amigos'}
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[1.5rem] bg-white p-7 shadow-sm ring-1 ring-[#20352c]/10 dark:bg-slate-900 dark:ring-white/10 sm:p-9">
            <h2 className="font-display text-2xl font-semibold">{isEn ? 'What she carries' : 'Lo que lleva en la mochila'}</h2>
            <ul className="mt-5 space-y-3">
              {items.map((item, index) => (
                <li key={`${index}-${item.es}`} className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--seasonal-accent)]" />
                  {item[locale] || item.es}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-[1.5rem] bg-white p-7 shadow-sm ring-1 ring-[#20352c]/10 dark:bg-slate-900 dark:ring-white/10 sm:p-9">
            <h2 className="font-display text-2xl font-semibold">{isEn ? 'Little discoveries' : 'Pequeños descubrimientos'}</h2>
            <ul className="mt-5 space-y-3">
              {facts.map((fact, index) => (
                <li key={`${index}-${fact.es}`} className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--seasonal-accent)]" />
                  {fact[locale] || fact.es}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
