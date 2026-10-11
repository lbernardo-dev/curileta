'use client';

import { ContentImage } from '@/components/ContentImage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Locale } from '@curileta/i18n';
import { Heart } from 'lucide-react';
import { CHARACTER_FAVORITE_VISITOR_KEY, type CharacterFavoriteRanking } from '@/lib/character-favorites';
import { getCharacterAvatarUrl } from '@/lib/character-avatar';

interface FavoritesContextValue {
  rankings: CharacterFavoriteRanking[];
  likedSlugs: Set<string>;
  pendingSlug: string | null;
  error: string;
  toggleFavorite: (slug: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function getVisitorToken() {
  try {
    return window.localStorage.getItem(CHARACTER_FAVORITE_VISITOR_KEY);
  } catch {
    return null;
  }
}

function createVisitorToken() {
  const token = window.crypto?.randomUUID?.() || `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
  try {
    window.localStorage.setItem(CHARACTER_FAVORITE_VISITOR_KEY, token);
  } catch {
    // The server reports the storage failure after a favorite is submitted.
  }
  return token;
}

export function CharacterFavoritesProvider({
  locale,
  initialRankings,
  children,
}: {
  locale: Locale;
  initialRankings: CharacterFavoriteRanking[];
  children: ReactNode;
}) {
  const [rankings, setRankings] = useState(initialRankings);
  const [likedSlugs, setLikedSlugs] = useState<Set<string>>(new Set());
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const token = getVisitorToken();
    fetch(`/api/character-favorites?locale=${locale}`, {
      headers: token ? { 'x-favorite-visitor': token } : undefined,
      signal: controller.signal,
      cache: 'no-store',
    }).then(async (response) => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron cargar los favoritos.');
      setRankings(result.rankings as CharacterFavoriteRanking[]);
      setLikedSlugs(new Set(result.likedSlugs as string[]));
    }).catch((cause: unknown) => {
      if (cause instanceof Error && cause.name !== 'AbortError') setError('Los favoritos no están disponibles ahora.');
    });
    return () => controller.abort();
  }, [locale]);

  const toggleFavorite = useCallback(async (slug: string) => {
    if (pendingSlug) return;
    setPendingSlug(slug);
    setError('');
    const token = getVisitorToken() || createVisitorToken();
    try {
      const response = await fetch('/api/character-favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, slug, visitorToken: token, favorite: !likedSlugs.has(slug) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar el voto.');
      setRankings(result.rankings as CharacterFavoriteRanking[]);
      setLikedSlugs(new Set(result.likedSlugs as string[]));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el voto.');
    } finally {
      setPendingSlug(null);
    }
  }, [likedSlugs, locale, pendingSlug]);

  const value = useMemo(() => ({ rankings, likedSlugs, pendingSlug, error, toggleFavorite }), [rankings, likedSlugs, pendingSlug, error, toggleFavorite]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useCharacterFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error('CharacterFavoritesProvider is missing.');
  return value;
}

export function CharacterFavoriteButton({
  slug,
  locale,
  compact = false,
  className = '',
}: {
  slug: string;
  locale: Locale;
  compact?: boolean;
  className?: string;
}) {
  const { rankings, likedSlugs, pendingSlug, error, toggleFavorite } = useCharacterFavorites();
  const isEn = locale === 'en';
  const ranking = rankings.find((item) => item.slug === slug);
  const liked = likedSlugs.has(slug);
  const pending = pendingSlug === slug;
  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={() => void toggleFavorite(slug)}
        disabled={pendingSlug !== null}
        aria-pressed={liked}
        aria-label={liked
          ? (isEn ? `Remove ${ranking?.name || 'character'} from favorites` : `Quitar a ${ranking?.name || 'este personaje'} de favoritos`)
          : (isEn ? `Add ${ranking?.name || 'character'} to favorites` : `Añadir a ${ranking?.name || 'este personaje'} a favoritos`)}
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#cbd6c8] bg-white px-4 py-2 text-sm font-semibold text-[#254537] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:border-[#313131] dark:bg-[#1f1f1f] dark:text-slate-100 dark:hover:bg-rose-950/40 ${className}`}
      >
        <Heart className={`h-4 w-4 ${liked ? 'fill-rose-500 text-rose-500' : 'text-rose-500'} ${pending ? 'animate-pulse' : ''}`} />
        {compact ? <span className="tabular-nums">{(ranking?.count || 0).toLocaleString(isEn ? 'en-US' : 'es-ES')}</span> : <span>{liked ? (isEn ? 'In favorites' : 'En favoritos') : (isEn ? 'Add to favorites' : 'Añadir a favoritos')}</span>}
        {!compact && <span className="tabular-nums text-slate-500 dark:text-slate-400">{(ranking?.count || 0).toLocaleString(isEn ? 'en-US' : 'es-ES')}</span>}
      </button>
      {error && <span role="status" className="max-w-64 text-xs text-rose-700 dark:text-rose-300">{error}</span>}
    </div>
  );
}

export function FavoriteRankBadge({ slug, locale, className = '' }: { slug: string; locale: Locale; className?: string }) {
  const { rankings } = useCharacterFavorites();
  const ranking = rankings.find((item) => item.slug === slug);
  if (!ranking || ranking.rank === null) {
    return <span className={`inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm ${className}`}>{locale === 'en' ? 'No votes yet' : 'Aún sin votos'}</span>;
  }
  const medal = ranking.rank === 1 ? '🥇' : ranking.rank === 2 ? '🥈' : ranking.rank === 3 ? '🥉' : null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-emerald-950 shadow-sm ${className}`}>
      <span aria-hidden="true">{medal || '♥'}</span>
      {locale === 'en' ? `#${ranking.rank} · ${ranking.count}` : `#${ranking.rank} · ${ranking.count}`}
    </span>
  );
}

export function FavoriteLeaderboard({
  characters,
  locale,
}: {
  characters: Array<{ slug: string; name: string; image?: string }>;
  locale: Locale;
}) {
  const { rankings } = useCharacterFavorites();
  const isEn = locale === 'en';
  const leaders = rankings.filter((item) => item.count > 0).slice(0, 3);
  const podium = [
    { place: 2, leader: leaders[1], height: 'h-16 sm:h-20', colors: 'border-slate-300 bg-slate-300 text-[#20352c]' },
    { place: 1, leader: leaders[0], height: 'h-24 sm:h-28', colors: 'border-amber-300 bg-amber-300 text-[#20352c]' },
    { place: 3, leader: leaders[2], height: 'h-12 sm:h-16', colors: 'border-amber-700 bg-amber-700 text-white' },
  ];

  return (
    <section className="mx-auto mt-8 max-w-5xl rounded-3xl border border-[#313131] bg-[#181818] p-5 text-white shadow-[0_14px_40px_rgba(16,35,29,0.16)] sm:p-6" aria-labelledby="favorite-leaders-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">{isEn ? 'Readers’ choice' : 'Los favoritos de la comunidad'}</p>
          <h2 id="favorite-leaders-title" className="mt-1 text-xl font-bold text-white">{isEn ? 'Most loved explorers' : 'Los exploradores más queridos'}</h2>
        </div>
        <span className="text-xs text-slate-300">{isEn ? 'Anonymous browser votes' : 'Votos anónimos desde el navegador'}</span>
      </div>
      <ol aria-label={isEn ? 'Top three favorite explorers' : 'Tres personajes favoritos'} className="mt-6 grid grid-cols-3 items-end gap-2 sm:gap-5">
          {podium.map(({ place, leader, height, colors }, index) => {
            const character = leader ? characters.find((item) => item.slug === leader.slug) : undefined;
            return (
              <li key={place} className="podium-enter flex min-w-0 flex-col" style={{ animationDelay: `${index * 110}ms` }}>
                <div className="mb-3 flex min-h-32 flex-col items-center justify-end gap-1 text-center sm:min-h-36">
                  {leader && character ? (
                    <a
                      href={`/${locale}/personajes/${leader.slug}`}
                      aria-label={isEn
                        ? `${character.name}, place ${place}, ${leader.count} favorites`
                        : `${character.name}, puesto ${place}, ${leader.count} favoritos`}
                      className="group flex min-w-0 flex-col items-center rounded-xl px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    >
                      <span className="mb-1 text-lg" aria-hidden="true">{place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉'}</span>
                      <ContentImage
                        src={getCharacterAvatarUrl(character.slug, character.image) || undefined}
                        alt={character.name}
                        width={72}
                        height={72}
                        loading="lazy"
                        decoding="async"
                        className="mb-0 h-14 w-14 rounded-full border-2 border-white/80 object-cover shadow-lg transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 sm:h-20 sm:w-20"
                      />
                      <span className="mt-2 block w-full truncate text-xs font-bold text-white sm:text-sm">{character.name}</span>
                      <span className="mt-0.5 block text-[10px] text-slate-300 sm:text-xs">
                        {leader.count.toLocaleString(isEn ? 'en-US' : 'es-ES')} {isEn
                          ? leader.count === 1 ? 'favorite' : 'favorites'
                          : leader.count === 1 ? 'favorito' : 'favoritos'}
                      </span>
                    </a>
                  ) : (
                    <div role="img" aria-label={isEn ? `No votes for place ${place} yet` : `Aún no hay votos para el puesto ${place}`} className="flex flex-col items-center gap-2">
                      <span className="podium-mystery flex h-14 w-14 items-center justify-center rounded-full border border-sky-300/70 bg-[#272727] text-3xl font-semibold text-sky-300 shadow-[0_0_24px_rgba(125,211,252,0.18)] sm:h-16 sm:w-16">?</span>
                      <span className="text-[10px] font-medium text-slate-300 sm:text-xs">{isEn ? 'Waiting for votes' : 'Aún sin votos'}</span>
                    </div>
                  )}
                </div>
                <div aria-hidden="true" className={`${height} flex flex-col items-center justify-center rounded-2xl border text-2xl font-bold shadow-inner sm:text-3xl ${colors}`}>
                  0{place}
                </div>
              </li>
            );
          })}
      </ol>
    </section>
  );
}
