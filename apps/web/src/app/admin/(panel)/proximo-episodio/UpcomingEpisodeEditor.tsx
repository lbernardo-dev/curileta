'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface UpcomingEpisodeData {
  characters: Array<{ slug: string; name: string; image: string }>;
  selectedSlugs: string[];
  updatedAt: string | null;
}

export function UpcomingEpisodeEditor() {
  const [data, setData] = useState<UpcomingEpisodeData | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/upcoming-episode-characters', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudo cargar la lista.');
        setData(result as UpcomingEpisodeData);
        setSelected(result.selectedSlugs || []);
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name !== 'AbortError') {
          setError(cause.message || 'No se pudo cargar la lista.');
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const hasChanges = Boolean(data) && (
    selected.length !== data?.selectedSlugs.length
    || selected.some((slug, index) => slug !== data?.selectedSlugs[index])
  );

  function toggle(slug: string) {
    setSaved(false);
    setSelected((current) => current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug]);
  }

  async function save() {
    if (!data || !hasChanges) return;
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/admin/upcoming-episode-characters', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterSlugs: selected }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar la lista.');
      setData((current) => current ? {
        ...current,
        selectedSlugs: result.selectedSlugs,
        updatedAt: result.updatedAt,
      } : current);
      setSelected(result.selectedSlugs);
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la lista.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Portada</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Personajes del próximo episodio</h1>
        <p className="mt-3 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">
          Activa los personajes que aparecerán en el próximo episodio. Cuando se publique, actualiza esta lista para preparar el siguiente.
        </p>
      </header>

      {loading && (
        <div role="status" aria-label="Cargando personajes" className="flex gap-4 overflow-hidden">
          {[0, 1, 2, 3].map((item) => <div key={item} className="h-60 w-48 shrink-0 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#272727]" />)}
        </div>
      )}

      {!loading && data?.characters.length === 0 && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-200">
          No hay personajes publicados en el CMS para elegir.
        </p>
      )}

      {!loading && data && data.characters.length > 0 && (
        <>
          <section aria-labelledby="upcoming-characters-heading" className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="upcoming-characters-heading" className="text-xl font-bold">Elige el elenco</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{selected.length} {selected.length === 1 ? 'personaje activo' : 'personajes activos'}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Desliza horizontalmente para ver toda la lista.</p>
            </div>

            <div role="group" aria-label="Personajes disponibles para el próximo episodio" className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
              {data.characters.map((character) => {
                const active = selected.includes(character.slug);
                return (
                  <button
                    key={character.slug}
                    type="button"
                    onClick={() => toggle(character.slug)}
                    aria-pressed={active}
                    className={`group w-48 shrink-0 snap-start overflow-hidden rounded-2xl border text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${active ? 'border-emerald-700 bg-emerald-50 shadow-md dark:border-emerald-400 dark:bg-emerald-950/30' : 'border-slate-200 bg-white dark:border-[#313131] dark:bg-[#1f1f1f]'}`}
                  >
                    <span className="relative block aspect-[4/3] overflow-hidden bg-[#efe7d5]">
                      <Image src={character.image} alt="" fill sizes="192px" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]" />
                      <span className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border ${active ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-white/80 bg-white/90 text-transparent'}`}>
                        {active && <span aria-hidden="true" className="text-sm font-bold">✓</span>}
                      </span>
                    </span>
                    <span className="block truncate px-3 py-3 text-sm font-semibold">{character.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">{selected.length ? `${selected.length} personajes aparecerán en la portada.` : 'La lista de la portada quedará vacía.'}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{data.updatedAt ? `Última actualización: ${new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(data.updatedAt))}` : 'Todavía no se ha guardado una selección.'}</p>
            </div>
            <button
              type="button"
              onClick={save}
              disabled={!hasChanges || saving}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              {saving ? 'Guardando…' : saved ? 'Lista guardada' : 'Guardar selección'}
            </button>
          </div>
        </>
      )}

      {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200">{error}</p>}
    </div>
  );
}
