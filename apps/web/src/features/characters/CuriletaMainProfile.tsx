import { ContentImage } from '@/components/ContentImage';
import { CharacterAvatarImage } from '@/components/CharacterAvatarImage';
import { CharacterFavoriteButton, CharacterFavoritesProvider } from '@/components/CharacterFavoritesProvider';
import { CharacterPassportSpread } from '@/components/CharacterPassportSpread';
import { ShareActions } from '@/components/ShareActions';
import { CuriletaFieldJournal } from '@/components/CuriletaFieldJournal';
import type { Locale } from '@curileta/i18n';
import type { Book, Character, Location, NarrativeMilestone, Video } from '@curileta/cms';
import type { CharacterFavoriteRanking } from '@/lib/character-favorites';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  Heart,
  MapPin,
  Sparkles,
  Star,
} from 'lucide-react';

function localized(value: { es: string; en?: string }, locale: Locale) {
  return value[locale] || value.es;
}

export function CuriletaMainProfile({
  locale,
  character,
  locations,
  books,
  episodes,
  milestones,
  characters,
  initialRankings,
}: {
  locale: Locale;
  character: Character;
  locations: Location[];
  books: Book[];
  episodes: Video[];
  milestones: NarrativeMilestone[];
  characters: Character[];
  initialRankings: CharacterFavoriteRanking[];
}) {
  const isEn = locale === 'en';
  const role = character.passportRole ? localized(character.passportRole, locale) : character.species;
  const description = localized(character.shortDescription, locale);
  const biography = character.biography ? localized(character.biography, locale) : description;
  const relatedBooks = books.filter((book) => character.relatedBooks?.includes(book.slug)
    || character.relatedBooks?.includes(book.id) || book.characters?.includes(character.slug));
  const relatedEpisodes = episodes.filter((video) => video.type === 'episode'
    && (character.relatedEpisodes?.includes(video.slug) || character.relatedEpisodes?.includes(video.id)
      || video.tags?.includes(character.slug) || video.tags?.includes(character.id)));
  const routeLocations = locations.filter((location) => character.relatedLocations?.includes(location.id)
    || character.relatedLocations?.includes(location.slug));
  const companionsInStory = new Set(milestones.flatMap((moment) => moment.charactersPresent)
    .filter((slug) => slug !== character.slug && slug !== character.id));
  const companions = characters.filter((item) => companionsInStory.has(item.slug) || companionsInStory.has(item.id));
  const companionOrder = ['pompon', 'lola', 'quetzal', 'lulu', 'emi', 'picu', 'zipi-bot'];
  companions.sort((left, right) => {
    const leftIndex = companionOrder.indexOf(left.slug);
    const rightIndex = companionOrder.indexOf(right.slug);
    return (leftIndex < 0 ? companionOrder.length : leftIndex) - (rightIndex < 0 ? companionOrder.length : rightIndex);
  });
  const home = routeLocations.find((location) => location.slug === 'espana-inicio') || routeLocations[0];
  const stats = character.explorerStats ? [
    { key: 'curiosity', label: isEn ? 'Curiosity' : 'Curiosidad', value: character.explorerStats.curiosity, color: 'bg-amber-400' },
    { key: 'courage', label: isEn ? 'Courage' : 'Valentía', value: character.explorerStats.courage, color: 'bg-emerald-400' },
    { key: 'agility', label: isEn ? 'Agility' : 'Agilidad', value: character.explorerStats.agility, color: 'bg-sky-400' },
    { key: 'wisdom', label: isEn ? 'Wisdom' : 'Sabiduría', value: character.explorerStats.wisdom, color: 'bg-purple-400' },
  ] : [];
  const relationship = isEn
    ? 'Curileta leads the expedition and tells the story through the places she visits and the letters she sends home.'
    : 'Curileta guía la expedición y cuenta la historia a través de los lugares que visita y las cartas que envía a casa.';
  const title = isEn ? 'Curileta, the little explorer with a world to discover' : 'Curileta, una pequeña exploradora con un mundo por descubrir';

  return (
    <CharacterFavoritesProvider locale={locale} initialRankings={initialRankings}>
      <div className="min-h-screen bg-slate-50 pb-12 pt-8 text-slate-950 transition-colors duration-500 dark:bg-black dark:text-white sm:pb-16 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href={`/${locale}/personajes`} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-emerald-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:text-emerald-200 dark:hover:bg-[#181818]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {isEn ? 'All characters' : 'Todos los personajes'}
          </Link>

          <section id="ficha" className="mt-6 scroll-mt-32 grid overflow-hidden rounded-3xl border border-emerald-900/20 bg-white shadow-xl dark:border-[#313131] dark:bg-[#181818] lg:grid-cols-[1.12fr_0.88fr]" aria-labelledby="curileta-title">
            <div className="flex min-w-0 flex-col justify-center p-5 sm:p-10 lg:p-12">
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                <CharacterAvatarImage
                  slug={character.slug}
                  name={character.name}
                  size={104}
                  alt={localized(character.mainImage.alt, locale)}
                  className="h-20 w-20 border-4 border-white shadow-lg ring-2 ring-emerald-700/20 dark:border-[#272727] sm:h-24 sm:w-24"
                />
                <div className="min-w-0">
                  <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200">
                    <Star className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {isEn ? 'Main character' : 'Personaje protagonista'}
                  </span>
                  <h1 id="curileta-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">{character.name}</h1>
                  {role && <p className="mt-1 text-sm font-semibold leading-5 text-amber-900 dark:text-amber-200 sm:text-base">{role}</p>}
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-xl font-semibold leading-8 text-emerald-900 dark:text-emerald-200">{title}</p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300">{description}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href={`/${locale}/mundo#escena-mapa`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600">
                  <Compass className="h-4 w-4" aria-hidden="true" />{isEn ? 'Follow her route' : 'Seguir su ruta'}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <CharacterFavoriteButton slug={character.slug} locale={locale} />
              </div>
              <div className="mt-2"><ShareActions contentType="character" contentSlug={character.slug} title={character.name} description={description} locale={locale} /></div>

              <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3" aria-label={isEn ? 'Expedition overview' : 'Resumen de la expedición'}>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-[#1f1f1f] sm:p-4">
                  <p className="text-2xl font-bold text-slate-950 dark:text-white">{routeLocations.length}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{isEn ? 'route stops' : 'paradas en la ruta'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-[#1f1f1f] sm:p-4">
                  <p className="text-2xl font-bold text-slate-950 dark:text-white">{milestones.length}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{isEn ? 'story moments' : 'momentos del relato'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-[#1f1f1f] sm:p-4">
                  <p className="text-2xl font-bold text-slate-950 dark:text-white">{companions.length}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{isEn ? 'friends met' : 'amistades en el camino'}</p>
                </div>
              </div>
            </div>

            <div className="relative flex min-h-[24rem] items-center justify-center overflow-hidden bg-[#e9dfc5] p-5 dark:bg-[#272727] sm:min-h-[34rem] sm:p-8">
              <div className="pointer-events-none absolute inset-5 rounded-3xl border border-emerald-900/20 dark:border-emerald-300/20" />
              <div className="relative h-full max-h-[42rem] w-full max-w-lg overflow-hidden rounded-2xl bg-[#f7f0dd] dark:bg-[#313131]">
                <ContentImage src={character.mainImage.url} alt={localized(character.mainImage.alt, locale)} className="h-full min-h-[23rem] w-full object-contain object-bottom sm:min-h-[32rem]" />
              </div>
              <div className="absolute bottom-8 left-8 flex max-w-[calc(100%-4rem)] items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm dark:border-[#444] dark:bg-[#181818]/90">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"><MapPin className="h-5 w-5" aria-hidden="true" /></span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{isEn ? 'Her home' : 'Su hogar'}</span>
                  <span className="block truncate font-semibold text-slate-950 dark:text-white">{home ? localized(home.name, locale) : (isEn ? 'Enchanted Forest' : 'Bosque Encantado')}</span>
                </span>
              </div>
            </div>
          </section>

          <nav aria-label={isEn ? 'Curileta profile sections' : 'Secciones de la ficha de Curileta'} className="mt-5 overflow-x-auto rounded-full border border-slate-200 bg-white p-1.5 shadow-md dark:border-[#313131] dark:bg-[#181818]">
            <ul className="flex min-w-max items-center gap-1">
              {[
                ['#pasaporte', isEn ? 'Passport' : 'Pasaporte'],
                ['#cuaderno', isEn ? 'Activities' : 'Actividades'],
                ['#historias', isEn ? 'Stories' : 'Historias'],
                ['#amigos', isEn ? 'Friends' : 'Amistades'],
                ['#habilidades', isEn ? 'Explorer skills' : 'Habilidades'],
              ].map(([href, label]) => (
                <li key={href}><a href={href} className="inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-100 hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:text-slate-200 dark:hover:bg-emerald-950 dark:hover:text-white">{label}</a></li>
              ))}
            </ul>
          </nav>

          <section className="mt-12 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end" aria-labelledby="curileta-story-title">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:text-emerald-300">{isEn ? 'A story that starts at home' : 'Una historia que empieza en casa'}</p>
              <h2 id="curileta-story-title" className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">{isEn ? 'Small steps. A very big world.' : 'Pasitos pequeños. Un mundo inmenso.'}</h2>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#181818] sm:p-8">
              <p className="text-base leading-7 text-slate-700 dark:text-slate-300">{biography}</p>
              {character.voiceQuote && <blockquote className="mt-5 border-l-4 border-amber-500 pl-4 text-lg font-semibold leading-7 text-amber-900 dark:text-amber-200">{localized(character.voiceQuote, locale)}</blockquote>}
              {character.personality && character.personality.length > 0 && !isEn && <ul className="mt-6 flex flex-wrap gap-2" aria-label="Rasgos de Curileta">{character.personality.map((trait) => <li key={trait} className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100">{trait}</li>)}</ul>}
            </div>
          </section>

          <div id="pasaporte" className="scroll-mt-28 mt-8">
            <CharacterPassportSpread character={character} locale={locale} locations={locations} milestones={milestones} relationship={relationship} />
          </div>

          <div className="mt-8">
            <CuriletaFieldJournal
              locale={locale}
              milestones={milestones}
              backpackItems={character.backpackItems || []}
              maskHref={`/api/masks/curileta/download?locale=${locale}`}
            />
          </div>

          <section id="historias" className="scroll-mt-28 mt-12" aria-labelledby="curileta-stories-title">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-300">{isEn ? 'Read and watch' : 'Leer y ver'}</p>
                <h2 id="curileta-stories-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{isEn ? 'Follow the story' : 'Sigue la historia'}</h2>
              </div>
              <Link href={`/${locale}/libros`} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-emerald-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:text-emerald-200 dark:hover:bg-emerald-950">
                {isEn ? 'All books' : 'Todos los libros'}<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {relatedBooks.map((book) => (
                <Link key={book.slug} href={`/${locale}/libros/${book.slug}`} className="group grid overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:border-[#313131] dark:bg-[#181818]">
                  <div className="relative aspect-[16/7] overflow-hidden bg-slate-100 dark:bg-[#272727]">
                    <ContentImage src={book.coverImage.url} alt={localized(book.coverImage.alt, locale)} className="h-full w-full object-contain p-3 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.025]" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">{isEn ? 'The book' : 'El libro'}</span>
                    <h3 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{localized(book.title, locale)}</h3>
                    {book.subtitle && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{localized(book.subtitle, locale)}</p>}
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-200">{isEn ? 'Open the book page' : 'Ver la ficha del libro'}<ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                  </div>
                </Link>
              ))}
              {relatedEpisodes.map((episode) => (
                <a key={episode.slug} href={episode.youtubeId ? `https://www.youtube.com/watch?v=${episode.youtubeId}` : `/${locale}/videos`} target={episode.youtubeId ? '_blank' : undefined} rel={episode.youtubeId ? 'noopener noreferrer' : undefined} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-[#313131] dark:bg-[#181818]">
                  <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-[#272727]">
                    <ContentImage src={episode.thumbnail} alt={localized(episode.title, locale)} className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.025]" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">{isEn ? 'Episode' : 'Capítulo'}{episode.episodeNumber ? ` ${episode.episodeNumber}` : ''}</span>
                    <h3 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{localized(episode.title, locale)}</h3>
                    {episode.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{localized(episode.description, locale)}</p>}
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-200">{isEn ? 'Watch on YouTube' : 'Ver en YouTube'}<ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {companions.length > 0 && (
            <section id="amigos" className="scroll-mt-28 mt-12" aria-labelledby="curileta-friends-title">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:text-emerald-300">{isEn ? 'The journey is shared' : 'El viaje se comparte'}</p>
                <h2 id="curileta-friends-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{isEn ? 'Friends along the way' : 'Amistades que hacen camino'}</h2>
                <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">{isEn ? 'Some friends welcome Curileta at a stop. Pompón stays at home and receives the letters that connect them.' : 'Algunas amistades reciben a Curileta en una parada. Pompón la espera en casa y recibe las cartas que los mantienen cerca.'}</p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {companions.slice(0, 8).map((friend) => (
                  <Link key={friend.slug} href={`/${locale}/personajes/${friend.slug}`} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:border-[#313131] dark:bg-[#181818]">
                    <CharacterAvatarImage slug={friend.slug} name={friend.name} size={48} alt={localized(friend.mainImage.alt, locale)} />
                    <span className="min-w-0"><span className="block truncate font-semibold text-slate-950 group-hover:text-emerald-900 dark:text-white dark:group-hover:text-emerald-200">{friend.name}</span><span className="mt-0.5 block truncate text-xs text-slate-600 dark:text-slate-400">{friend.passportRole ? localized(friend.passportRole, locale) : (isEn ? 'Travel companion' : 'Amistad de viaje')}</span></span>
                  </Link>
                ))}
              </div>
              <Link href={`/${locale}/personajes`} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-emerald-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:text-emerald-200 dark:hover:bg-emerald-950">{isEn ? 'Meet the whole crew' : 'Conocer a toda la tripulación'}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </section>
          )}

          {stats.length > 0 && (
            <section id="habilidades" className="scroll-mt-28 mt-12 rounded-3xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#181818] sm:p-8" aria-labelledby="curileta-skills-title">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-300">{isEn ? 'Explorer’s passport' : 'Pasaporte de exploradora'}</p>
                  <h2 id="curileta-skills-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{isEn ? 'Skills she brings to every journey' : 'Habilidades para cada aventura'}</h2>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"><Sparkles className="h-6 w-6" aria-hidden="true" /></span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.key} className="rounded-2xl bg-slate-50 p-4 dark:bg-[#1f1f1f]">
                    <div className="flex items-center justify-between gap-2 text-sm font-semibold"><span className="text-slate-700 dark:text-slate-200">{stat.label}</span><span className="font-mono text-slate-950 dark:text-white">{stat.value}%</span></div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-[#313131]"><div className={`h-full rounded-full ${stat.color}`} style={{ width: `${stat.value}%` }} /></div>
                  </div>
                ))}
              </div>
              {character.values && character.values.length > 0 && !isEn && <div className="mt-6 flex flex-wrap gap-2">{character.values.map((value) => <span key={value} className="inline-flex items-center gap-2 rounded-full border border-emerald-900/20 px-3 py-1.5 text-sm font-medium text-emerald-950 dark:border-emerald-700 dark:text-emerald-100"><Heart className="h-3.5 w-3.5" aria-hidden="true" />{value}</span>)}</div>}
            </section>
          )}

          {character.curiosityFacts && character.curiosityFacts.length > 0 && (
            <section className="mt-12" aria-labelledby="curileta-field-notes-title">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-300">{isEn ? 'From her field notes' : 'De su cuaderno de campo'}</p>
                <h2 id="curileta-field-notes-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{isEn ? 'Little discoveries worth keeping' : 'Pequeños descubrimientos para recordar'}</h2>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {character.curiosityFacts.map((fact, index) => (
                  <article key={`${index}-${fact.es}`} className="flex gap-4 rounded-2xl border border-amber-800/20 bg-amber-50 p-5 dark:border-amber-700/30 dark:bg-[#1f1f1f]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-950 dark:bg-amber-950 dark:text-amber-200">{index + 1}</span>
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{localized(fact, locale)}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12 rounded-3xl bg-emerald-900 p-6 text-white sm:p-9" aria-labelledby="curileta-next-step-title">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">{isEn ? 'The next page is waiting' : 'La siguiente página te espera'}</p>
                <h2 id="curileta-next-step-title" className="mt-2 text-3xl font-bold tracking-tight">{isEn ? 'Travel a little farther with Curileta.' : 'Viaja un poco más lejos con Curileta.'}</h2>
                <p className="mt-3 text-sm leading-6 text-emerald-50/90">{isEn ? 'Explore the atlas or open the book that began her expedition.' : 'Explora el atlas o abre el libro que dio comienzo a su expedición.'}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/${locale}/mundo#escena-mapa`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-950 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Compass className="h-4 w-4" aria-hidden="true" />{isEn ? 'Explore the atlas' : 'Explorar el atlas'}</Link>
                {relatedBooks[0] && <Link href={`/${locale}/libros/${relatedBooks[0].slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/50 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><BookOpen className="h-4 w-4" aria-hidden="true" />{isEn ? 'Open the book' : 'Abrir el libro'}</Link>}
              </div>
            </div>
          </section>
        </div>
      </div>
    </CharacterFavoritesProvider>
  );
}
