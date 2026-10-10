'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Check, Users } from 'lucide-react';

interface CrewEditorData {
  characters: Array<{ slug: string; name: string; image: string }>;
  source: { slug: string; title: { es: string; en?: string }; kind: 'episode' | 'book' } | null;
  selection: { chapter_slug: string; character_slugs: string[] } | null;
  needsRefresh: boolean;
}

export default function FeaturedCharactersAdminPage() {
  const [data, setData] = useState<CrewEditorData | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/home-character-crew', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudo cargar la configuración.');
        setData(result as CrewEditorData);
        setSelected(result.selection?.character_slugs || result.characters.map((character: { slug: string }) => character.slug));
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo cargar la configuración.'))
      .finally(() => setLoading(false));
  }, []);

  const selectedCharacters = useMemo(() => data?.characters.filter((character) => selected.includes(character.slug)) || [], [data, selected]);

  function toggle(slug: string) {
    setSaved(false);
    setSelected((current) => current.includes(slug)
      ? current.filter((item) => item !== slug)
      : current.length < 6 ? [...current, slug] : current);
  }

  async function save() {
    if (!data?.source || selected.length < 1 || selected.length > 6) return;
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/admin/home-character-crew', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterSlug: data.source.slug, characterSlugs: selected }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar la selección.');
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la selección.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Portada</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Personajes del capítulo</h1>
        <p className="mt-3 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">Elige quién aparece en «La curiosidad crece en compañía». La selección queda vinculada al capítulo publicado más reciente.</p>
      </header>

      {loading ? <div role="status" className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#272727]" /> : null}
      {data?.source && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-[#1f1f1f]">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white"><Users className="h-5 w-5" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">{data.source.kind === 'episode' ? 'Último episodio publicado' : 'Libro publicado más reciente'}</p>
              <h2 className="mt-1 text-lg font-semibold">{data.source.title.es}</h2>
              {data.needsRefresh && <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">Se ha publicado contenido nuevo. Guarda de nuevo los participantes para actualizar la portada.</p>}
            </div>
          </div>
        </section>
      )}

      {!loading && !data?.source && <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">Publica primero un episodio o libro desde el CMS para vincular esta selección.</p>}
      {!loading && data?.source && data.characters.length === 0 && <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-200">El contenido más reciente todavía no tiene personajes asociados. Añade sus identificadores en la ficha del libro o en las etiquetas del episodio en el CMS; después aparecerán aquí para elegirlos.</p>}

      {data && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.characters.map((character) => {
              const checked = selected.includes(character.slug);
              return (
                <button key={character.slug} type="button" onClick={() => toggle(character.slug)} aria-pressed={checked} className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${checked ? 'border-emerald-700 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/30' : 'border-slate-200 bg-white dark:border-[#313131] dark:bg-[#1f1f1f]'} ${selected.length >= 6 && !checked ? 'cursor-not-allowed opacity-50' : ''}`}>
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#efe7d5]">
                    <Image src={character.image} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{character.name}</span>
                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{character.slug}</span>
                  </span>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${checked ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 dark:border-[#555]'}`}>{checked && <Check className="h-4 w-4" />}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Vista previa: {selectedCharacters.length} de 6 personajes</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{selectedCharacters.map((character) => character.name).join(' · ') || 'Selecciona al menos un personaje.'}</p>
            </div>
            <button type="button" onClick={save} disabled={!data.source || data.characters.length === 0 || selected.length < 1 || saving} className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
              {saving ? 'Guardando…' : saved ? 'Selección guardada' : 'Guardar participantes'}
            </button>
          </div>
        </>
      )}
      {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200">{error}</p>}
    </div>
  );
}
