'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Locale } from '@curileta/i18n';
import { Heart } from 'lucide-react';
import { CHARACTER_FAVORITE_VISITOR_KEY, type CharacterFavoriteRanking } from '@/lib/character-favorites';

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
  characters: Array<{ slug: string; name: string; image: string }>;
  locale: Locale;
}) {
  const { rankings } = useCharacterFavorites();
  const isEn = locale === 'en';
  const leaders = rankings.filter((item) => item.rank !== null).slice(0, 3);

  return (
    <section className="mx-auto mt-8 max-w-5xl rounded-3xl border border-amber-200 bg-[#fffdf7] p-5 shadow-[0_14px_40px_rgba(55,47,22,0.08)] dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="favorite-leaders-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-200">{isEn ? 'Readers’ choice' : 'Los favoritos de la comunidad'}</p>
          <h2 id="favorite-leaders-title" className="mt-1 text-xl font-bold text-[#20352c] dark:text-white">{isEn ? 'Most loved explorers' : 'Los exploradores más queridos'}</h2>
        </div>
        <span className="text-xs text-slate-600 dark:text-slate-300">{isEn ? 'Anonymous browser votes' : 'Votos anónimos desde el navegador'}</span>
      </div>
      {leaders.length ? (
        <ol className="mt-5 grid gap-3 sm:grid-cols-3">
          {leaders.map((leader) => {
            const character = characters.find((item) => item.slug === leader.slug);
            if (!character) return null;
            const medal = leader.rank === 1 ? '🥇' : leader.rank === 2 ? '🥈' : '🥉';
            return (
              <li key={leader.slug}>
                <a href={`/${locale}/personajes/${leader.slug}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-[#313131] dark:bg-[#181818]">
                  <img src={character.image} alt="" className="h-14 w-14 rounded-xl object-cover" loading="lazy" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-[#20352c] dark:text-white">{medal} {character.name}</span>
                    <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">{leader.count.toLocaleString(isEn ? 'en-US' : 'es-ES')} {isEn ? 'favorites' : 'favoritos'}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-slate-600 dark:bg-[#181818] dark:text-slate-300">{isEn ? 'Be the first to choose a favorite explorer.' : 'Sé la primera persona en elegir a su explorador favorito.'}</p>
      )}
    </section>
  );
}
