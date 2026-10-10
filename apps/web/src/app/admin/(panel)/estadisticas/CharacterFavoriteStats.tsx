'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CharacterFavoriteDailyRow, CharacterFavoriteRanking } from '@/lib/character-favorites';

export function CharacterFavoriteStats({ days }: { days: number }) {
  const [rankings, setRankings] = useState<CharacterFavoriteRanking[]>([]);
  const [events, setEvents] = useState<CharacterFavoriteDailyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/admin/character-favorites?days=${days}`, { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudieron cargar los favoritos.');
        setRankings(result.rankings as CharacterFavoriteRanking[]);
        setEvents(result.data as CharacterFavoriteDailyRow[]);
        setError('');
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'No se pudieron cargar los favoritos.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [days]);

  const byCharacter = useMemo(() => {
    const summary = new Map<string, { added: number; removed: number }>();
    events.forEach((event) => {
      const row = summary.get(event.character_slug) || { added: 0, removed: 0 };
      row[event.action] += Number(event.event_count) || 0;
      summary.set(event.character_slug, row);
    });
    return [...summary.entries()].sort((left, right) => right[1].added - left[1].added);
  }, [events]);

  const addedTotal = events.filter((row) => row.action === 'added').reduce((total, row) => total + Number(row.event_count), 0);
  const removedTotal = events.filter((row) => row.action === 'removed').reduce((total, row) => total + Number(row.event_count), 0);
  const currentTotal = rankings.reduce((total, item) => total + item.count, 0);

  return (
    <section className="rounded-xl border border-slate-200 bg-white dark:border-[#313131] dark:bg-[#1f1f1f]" aria-labelledby="character-favorite-stats">
      <div className="border-b border-slate-200 p-6 dark:border-[#313131]">
        <h2 id="character-favorite-stats" className="text-xl font-bold">Favoritos de personajes</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Ranking actual y cambios agregados durante los últimos {days} días. No se guardan nombres ni datos de cuenta de quienes votan.</p>
      </div>
      {loading ? <div role="status" className="h-40 animate-pulse bg-slate-50 dark:bg-[#181818]" /> : error ? (
        <p role="alert" className="m-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-200">{error}</p>
      ) : (
        <div className="p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl bg-slate-50 p-4 dark:bg-[#181818]"><p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Favoritos actuales</p><p className="mt-2 text-3xl font-bold tabular-nums">{currentTotal.toLocaleString('es-ES')}</p></article>
            <article className="rounded-xl bg-emerald-50 p-4 dark:bg-[#181818]"><p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Añadidos en el periodo</p><p className="mt-2 text-3xl font-bold tabular-nums text-emerald-800 dark:text-emerald-300">{addedTotal.toLocaleString('es-ES')}</p></article>
            <article className="rounded-xl bg-rose-50 p-4 dark:bg-[#181818]"><p className="text-xs font-semibold uppercase tracking-wide text-rose-800 dark:text-rose-300">Retirados en el periodo</p><p className="mt-2 text-3xl font-bold tabular-nums text-rose-800 dark:text-rose-300">{removedTotal.toLocaleString('es-ES')}</p></article>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-semibold">Posiciones actuales</h3>
              {rankings.some((item) => item.count > 0) ? (
                <ol className="mt-3 divide-y divide-slate-200 dark:divide-[#313131]">
                  {rankings.filter((item) => item.count > 0).map((item) => (
                    <li key={item.slug} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <span className="min-w-0 truncate"><strong className="mr-2 text-amber-700 dark:text-amber-300">#{item.rank}</strong>{item.name}</span>
                      <span className="shrink-0 font-semibold tabular-nums">{item.count.toLocaleString('es-ES')}</span>
                    </li>
                  ))}
                </ol>
              ) : <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Todavía no hay favoritos registrados.</p>}
            </div>
            <div>
              <h3 className="font-semibold">Actividad por personaje</h3>
              {byCharacter.length ? (
                <ul className="mt-3 divide-y divide-slate-200 dark:divide-[#313131]">
                  {byCharacter.map(([slug, counts]) => (
                    <li key={slug} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <span className="truncate">{rankings.find((item) => item.slug === slug)?.name || slug}</span>
                      <span className="shrink-0 text-right tabular-nums"><span className="font-semibold text-emerald-700 dark:text-emerald-300">+{counts.added}</span><span className="mx-2 text-slate-400">·</span><span className="text-rose-700 dark:text-rose-300">−{counts.removed}</span></span>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Sin cambios durante este periodo.</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
