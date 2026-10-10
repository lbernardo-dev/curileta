import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales, Locale, isValidLocale } from '@curileta/i18n';
import { cmsProvider } from '@/lib/cms';
import { getCharacterImageAspectRatio } from '@/lib/character-image';
import { CharacterAvatarImage } from '@/components/CharacterAvatarImage';
import { ShareActions } from '@/components/ShareActions';
import { CharacterFavoriteButton, CharacterFavoritesProvider } from '@/components/CharacterFavoritesProvider';
import { CharacterPassportSpread } from '@/components/CharacterPassportSpread';
import { getCharacterFavoriteRankings } from '@/lib/character-favorites.server';
import {
  Sparkles,
  ArrowLeft,
  Compass,
  BookOpen,
  Briefcase,
  Lightbulb,
  Shield,
  Zap,
  MapPin,
} from 'lucide-react';

export async function generateStaticParams() {
  const characters = await cmsProvider.getCharacters('es');
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    for (const char of characters) {
      params.push({ locale, slug: char.slug });
    }
    params.push({ locale, slug: 'joey-canguro' });
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
  const character = await cmsProvider.getCharacterBySlug(slug, locale);

  if (!character) {
    return { title: 'Personaje no encontrado' };
  }

  const desc = character.shortDescription[locale] || character.shortDescription.es;
  return {
    title: `${character.name} — Pasaporte Oficial de Explorador`,
    description: desc,
  };
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const [character, locations, books, videos, milestones, rankings] = await Promise.all([
    cmsProvider.getCharacterBySlug(slug, locale),
    cmsProvider.getLocations(locale),
    cmsProvider.getBooks(locale),
    cmsProvider.getVideos(locale),
    cmsProvider.getNarrativeMilestones(locale),
    getCharacterFavoriteRankings(locale),
  ]);

  if (!character) {
    notFound();
  }

  const bio = character.biography?.[locale] || character.biography?.es;
  const shortDesc = character.shortDescription[locale] || character.shortDescription.es;
  const roleText = character.passportRole
    ? character.passportRole[locale] || character.passportRole.es
    : character.species;
  const relatedBooks = books.filter((book) => character.relatedBooks?.includes(book.slug) || character.relatedBooks?.includes(book.id) || book.characters?.includes(character.slug));
  const relatedEpisodes = videos.filter((video) => video.type === 'episode'
    && (character.relatedEpisodes?.includes(video.slug) || character.relatedEpisodes?.includes(video.id)
      || video.tags?.includes(character.slug) || video.tags?.includes(character.id)));
  const storyMoments = milestones.filter((milestone) => milestone.charactersPresent.includes(character.slug) || milestone.charactersPresent.includes(character.id));
  const relationToCurileta = character.slug === 'curileta'
    ? (locale === 'en' ? 'The main explorer and storyteller of the journey.' : 'La exploradora protagonista y narradora del viaje.')
    : character.slug === 'pompon'
      ? (locale === 'en' ? 'Curileta’s best friend. Their letters keep them close across every ocean.' : 'El mejor amigo de Curileta. Sus cartas los mantienen cerca a través de cada océano.')
      : character.slug === 'joey' || character.slug === 'joey-peluche'
        ? (locale === 'en' ? 'A close companion Curileta helped reunite with family in Australia.' : 'Un compañero al que Curileta ayudó a reencontrarse con su familia en Australia.')
        : (locale === 'en' ? `${character.name} becomes one of Curileta’s friends during the journey.` : `${character.name} se convierte en amistad de Curileta durante la travesía.`);
  const stats = character.explorerStats ? [
    { key: 'curiosity', label: locale === 'en' ? 'Curiosity' : 'Curiosidad', value: character.explorerStats.curiosity },
    { key: 'courage', label: locale === 'en' ? 'Courage' : 'Valentía', value: character.explorerStats.courage },
    { key: 'agility', label: locale === 'en' ? 'Agility' : 'Agilidad', value: character.explorerStats.agility },
    { key: 'wisdom', label: locale === 'en' ? 'Wisdom' : 'Sabiduría', value: character.explorerStats.wisdom },
  ] : [];
  const growthArea = [...stats].sort((left, right) => left.value - right.value)[0];

  return (
    <CharacterFavoritesProvider locale={locale as Locale} initialRankings={rankings}>
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen relative overflow-hidden">
      {/* Resplandor ambiental */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Barra superior de navegación */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/${locale}/personajes`}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          <span>{locale === 'en' ? 'Back to all characters' : 'Volver a todos los personajes'}</span>
          </Link>

        </div>

        {/* Ficha Principal de Pasaporte de Explorador */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-emerald-500/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Marca de agua */}
          <div className="absolute right-4 -bottom-10 opacity-5 pointer-events-none font-black text-9xl text-amber-400 select-none">
            {character.id.toUpperCase()}
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-12">
            {/* Retrato 3D con halo */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-56 sm:w-64 overflow-hidden relative group" style={{ aspectRatio: getCharacterImageAspectRatio(character.mainImage.url, character.mainImage.aspectRatio) }}>
                  <img
                    src={character.mainImage.url}
                    alt={character.mainImage.alt[locale] || character.mainImage.alt.es}
                    className="h-full w-full object-cover object-[50%_100%] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.025]"
                  />
              </div>
            </div>

            {/* Datos del Pasaporte */}
            <div className="space-y-4 text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 shadow-md">
                  ★ PASAPORTE OFICIAL
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  {character.species}
                </span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                  {character.name}
                </h1>
                <p className="text-sm sm:text-base font-extrabold text-emerald-400 mt-1 uppercase tracking-wide">
                  {roleText}
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
                {shortDesc}
              </p>
              <ShareActions contentType="character" contentSlug={character.slug} title={character.name} description={shortDesc} locale={locale} />
              <CharacterFavoriteButton slug={character.slug} locale={locale as Locale} />

              {/* Nota canónica si es Pompón o Joey */}
              {character.id === 'pompon' && (
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs leading-relaxed">
                  <strong>Nota Canónica:</strong> Pompón permanece siempre en el Bosque Encantado custodiando el árbol más alto y el buzón postal. No viaja físicamente con Curileta, pero la acompaña en cada carta y recuerdo.
                </div>
              )}

              {character.id === 'joey' && (
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs leading-relaxed">
                  <strong>Familia del Outback:</strong> Mamá Canguro y Bebé Canguro son dos personajes distintos. Joey es el koala de peluche de Bebé Canguro, rescatado por Curileta en Uluru.
                </div>
              )}

              {/* Rasgos de Personalidad */}
              {character.personality && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-2">
                  {character.personality.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      ✨ {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <CharacterPassportSpread
          character={character}
          locale={locale as Locale}
          locations={locations}
          milestones={storyMoments}
          relationship={relationToCurileta}
        />

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8" aria-labelledby="character-appearances">
          <h2 id="character-appearances" className="flex items-center gap-2 text-xl font-bold text-white">
            <BookOpen className="h-5 w-5 text-amber-300" />
            {locale === 'en' ? 'Stories and chapters' : 'Historias y capítulos'}
          </h2>
          {(relatedBooks.length || relatedEpisodes.length || storyMoments.length) ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {relatedBooks.map((book) => <Link key={book.slug} href={`/${locale}/libros/${book.slug}`} className="rounded-2xl border border-slate-700 bg-slate-950 p-4 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"><span className="text-xs font-semibold uppercase tracking-wide text-amber-300">{locale === 'en' ? 'Book' : 'Libro'}</span><span className="mt-1 block font-semibold text-white">{book.title[locale] || book.title.es}</span>{book.subtitle && <span className="mt-1 block text-sm text-slate-300">{book.subtitle[locale] || book.subtitle.es}</span>}</Link>)}
              {relatedEpisodes.map((episode) => <a key={episode.slug} href={episode.youtubeId ? `https://www.youtube.com/watch?v=${episode.youtubeId}` : `/${locale}/videos`} target={episode.youtubeId ? '_blank' : undefined} rel={episode.youtubeId ? 'noopener noreferrer' : undefined} className="rounded-2xl border border-slate-700 bg-slate-950 p-4 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"><span className="text-xs font-semibold uppercase tracking-wide text-amber-300">{locale === 'en' ? 'Episode' : 'Episodio'}{episode.episodeNumber ? ` ${episode.episodeNumber}` : ''}</span><span className="mt-1 block font-semibold text-white">{episode.title[locale] || episode.title.es}</span></a>)}
              {storyMoments.slice(0, 6).map((moment) => <article key={`${moment.order}-${moment.place.es}`} className="rounded-2xl border border-slate-700 bg-slate-950 p-4"><span className="text-xs font-semibold uppercase tracking-wide text-emerald-300">{locale === 'en' ? `Story moment ${moment.order}` : `Momento ${moment.order} del relato`}</span><h3 className="mt-1 font-semibold text-white">{moment.place[locale] || moment.place.es}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{moment.whatHappens[locale] || moment.whatHappens.es}</p></article>)}
            </div>
          ) : <p className="mt-4 text-sm text-slate-300">{locale === 'en' ? 'Story appearances will appear when this character is linked to a published book or episode.' : 'Las apariciones aparecerán cuando el personaje se vincule a un libro o episodio publicado.'}</p>}
        </section>

        {/* Cita Célebre de Expedición */}
        {character.voiceQuote && (
          <div className="mt-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 p-6 sm:p-8 flex items-start gap-4 text-amber-200">
            <CharacterAvatarImage
              slug={character.slug}
              name={character.name}
              size={56}
              alt={locale === 'en' ? `${character.name} portrait` : `Retrato de ${character.name}`}
            />
            <div>
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-amber-400 block mb-1">
                Voz & Lema de Expedición:
              </span>
              <p className="text-lg sm:text-xl font-bold leading-snug">
                {character.voiceQuote[locale] || character.voiceQuote.es}
              </p>
            </div>
          </div>
        )}

        {/* Estadísticas de Explorador en 4 Dimensiones */}
        {character.explorerStats && (
          <div className="mt-8 rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-xl">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Habilidades de Expedición</span>
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Curiosidad */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-amber-400 uppercase">{locale === 'en' ? 'Curiosity' : 'Curiosidad'}</span>
                  <span className="text-white font-mono">{character.explorerStats.curiosity}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${character.explorerStats.curiosity}%` }}
                  />
                </div>
              </div>

              {/* Valentía */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-emerald-400 uppercase">{locale === 'en' ? 'Courage' : 'Valentía'}</span>
                  <span className="text-white font-mono">{character.explorerStats.courage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${character.explorerStats.courage}%` }}
                  />
                </div>
              </div>

              {/* Agilidad */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-sky-400 uppercase">{locale === 'en' ? 'Agility' : 'Agilidad'}</span>
                  <span className="text-white font-mono">{character.explorerStats.agility}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${character.explorerStats.agility}%` }}
                  />
                </div>
              </div>

              {/* Sabiduría */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-purple-400 uppercase">{locale === 'en' ? 'Wisdom' : 'Sabiduría'}</span>
                  <span className="text-white font-mono">{character.explorerStats.wisdom}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${character.explorerStats.wisdom}%` }}
                  />
                </div>
              </div>
            </div>
            {growthArea && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-800 bg-emerald-950/50 p-4 text-sm text-emerald-100">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                <p>
                  <span className="font-semibold text-amber-200">{locale === 'en' ? 'A skill in progress: ' : 'Una habilidad que sigue creciendo: '}</span>
                  {growthArea.label}. {locale === 'en' ? 'Every new adventure gives this explorer another chance to practise it.' : 'Cada nueva aventura le da otra oportunidad para ponerla en práctica.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Biografía & Mochila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Historia Completa */}
          {bio && (
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 space-y-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>Historia en la Expedición</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">{bio}</p>
            </div>
          )}

          {/* Mochila de Expedición */}
          {character.backpackItems && character.backpackItems.length > 0 && (
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 space-y-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                <span>Mochila & Objetos Clave</span>
              </h2>
              <ul className="space-y-3">
                {character.backpackItems.map((item, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{item[locale] || item.es}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Secretos & Curiosidades */}
        {character.curiosityFacts && character.curiosityFacts.length > 0 && (
          <div className="mt-8 rounded-3xl bg-slate-900/80 border border-slate-800 p-8">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>Secretos & Datos Curiosos</span>
            </h2>
            <div className="space-y-3">
              {character.curiosityFacts.map((fact, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 leading-relaxed flex items-start gap-3">
                  <span className="text-amber-400 font-bold text-base mt-0.5">✦</span>
                  <p>{fact[locale] || fact.es}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Valores */}
        {character.values && character.values.length > 0 && (
          <div className="mt-8 rounded-3xl bg-slate-900/80 border border-slate-800 p-8">
            <h2 className="text-xl font-black text-white mb-4">Valores que transmite</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {character.values.map((v) => (
                <div key={v} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-xs font-bold text-emerald-400">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA relacionado con la historia */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-center">
          <Link
            href={`/${locale}/libros`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-950" />
            <span>Descubrir libros con {character.name}</span>
          </Link>

        </div>
      </div>
    </div>
    </CharacterFavoritesProvider>
  );
}
