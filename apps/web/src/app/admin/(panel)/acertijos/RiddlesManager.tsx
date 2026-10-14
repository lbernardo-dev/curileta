'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronLeft, LoaderCircle, Plus, Save, Sparkles, Trash2 } from 'lucide-react';
import type { EventCampaignActivity, EventRiddle, ManagedEvent } from '@/lib/events';

const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50';
const fieldClass = 'mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus:border-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#181818] dark:text-white';
const cardClass = 'rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6';

function createRiddle(): EventRiddle {
  return {
    id: `acertijo-${crypto.randomUUID().slice(0, 8)}`,
    title: { es: '', en: '' },
    prompt: { es: '', en: '' },
    answer: { es: '', en: '' },
  };
}

function createCollection(): EventCampaignActivity {
  return {
    id: 'acertijos-de-temporada',
    kind: 'riddleSet',
    icon: '🌙',
    title: { es: 'Acertijos del bosque', en: 'Forest riddles' },
    description: { es: 'Resuelve los misterios del bosque, uno a uno.', en: 'Solve the forest mysteries, one at a time.' },
    reveal: { es: '', en: '' },
    resourceUrl: '',
    resourcePath: '',
    riddles: [],
  };
}

export default function RiddlesManager() {
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [collection, setCollection] = useState<EventCampaignActivity | null>(null);
  const [riddles, setRiddles] = useState<EventRiddle[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadEvents = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch('/api/admin/events', { cache: 'no-store', signal });
      const result = await response.json().catch(() => null) as { success?: boolean; events?: ManagedEvent[]; error?: string } | null;
      if (!response.ok || !result?.success || !Array.isArray(result.events)) throw new Error(result?.error || 'No se pudieron cargar las temporadas.');
      setEvents(result.events);
    } catch (cause) {
      if (!signal?.aborted) setError(cause instanceof Error ? cause.message : 'No se pudieron cargar las temporadas.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/admin/events', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const result = await response.json().catch(() => null) as { success?: boolean; events?: ManagedEvent[]; error?: string } | null;
        if (!response.ok || !result?.success || !Array.isArray(result.events)) throw new Error(result?.error || 'No se pudieron cargar las temporadas.');
        return result.events;
      })
      .then(setEvents)
      .catch((cause: unknown) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'No se pudieron cargar las temporadas.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const selectedEvent = useMemo(() => events.find((event) => event.id === selectedId) || null, [events, selectedId]);

  function editEvent(event: ManagedEvent) {
    const existing = event.campaignContent.activities.find((activity) => activity.kind === 'riddleSet');
    if (!existing && event.campaignContent.activities.length >= 6) {
      setError('Esta temporada ya tiene seis actividades. Quita una en Eventos y ambientes antes de añadir la colección.');
      return;
    }
    setSelectedId(event.id);
    setCollection(existing || createCollection());
    setRiddles(existing?.riddles ? [...existing.riddles] : []);
    setConfirmDelete(false);
    setError('');
    setNotice('');
    window.setTimeout(() => document.getElementById('riddle-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  }

  function updateRiddle(riddleId: string, field: 'title' | 'prompt' | 'answer', locale: 'es' | 'en', value: string) {
    setRiddles((current) => current.map((riddle) => riddle.id === riddleId
      ? { ...riddle, [field]: { ...riddle[field], [locale]: value } }
      : riddle));
  }

  function moveRiddle(index: number, direction: -1 | 1) {
    setRiddles((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function saveCollection() {
    if (!selectedEvent || !collection || saving) return;
    if (!riddles.length || riddles.length > 24) {
      setError('La colección debe incluir entre 1 y 24 acertijos.');
      return;
    }
    if (riddles.some((riddle) => !riddle.title.es.trim() || !riddle.title.en.trim() || !riddle.prompt.es.trim()
      || !riddle.prompt.en.trim() || !riddle.answer.es.trim() || !riddle.answer.en.trim())) {
      setError('Completa el título, enunciado y respuesta de cada acertijo en español e inglés.');
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');
    try {
      const savedCollection = { ...collection, riddles };
      const oldIndex = selectedEvent.campaignContent.activities.findIndex((activity) => activity.kind === 'riddleSet');
      const activities = [...selectedEvent.campaignContent.activities];
      if (oldIndex >= 0) activities[oldIndex] = savedCollection;
      else activities.push(savedCollection);
      const response = await fetch(`/api/admin/events/${selectedEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedEvent,
          updatedAt: selectedEvent.updatedAt,
          campaignContent: { ...selectedEvent.campaignContent, activities },
        }),
      });
      const result = await response.json().catch(() => null) as { success?: boolean; error?: string } | null;
      if (!response.ok || !result?.success) throw new Error(result?.error || 'No se pudieron guardar los acertijos.');
      setCollection(savedCollection);
      setNotice(`La colección de ${selectedEvent.name.es} se ha guardado.`);
      await loadEvents();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudieron guardar los acertijos.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteCollection() {
    if (!selectedEvent || saving) return;
    setSaving(true);
    setError('');
    try {
      const activities = selectedEvent.campaignContent.activities.filter((activity) => activity.kind !== 'riddleSet');
      const response = await fetch(`/api/admin/events/${selectedEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedEvent, updatedAt: selectedEvent.updatedAt, campaignContent: { ...selectedEvent.campaignContent, activities } }),
      });
      const result = await response.json().catch(() => null) as { success?: boolean; error?: string } | null;
      if (!response.ok || !result?.success) throw new Error(result?.error || 'No se pudo eliminar la colección.');
      setSelectedId('');
      setCollection(null);
      setRiddles([]);
      setConfirmDelete(false);
      setNotice(`La colección de ${selectedEvent.name.es} se ha eliminado.`);
      await loadEvents();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo eliminar la colección.');
    } finally {
      setSaving(false);
    }
  }

  return <div className="mx-auto max-w-6xl space-y-6">
    <header>
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Contenido interactivo</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Acertijos de temporada</h1>
      <p className="mt-3 max-w-3xl text-base leading-6 text-slate-600 dark:text-slate-300">Crea una colección bilingüe por evento. La web presenta una pregunta cada vez en una sola tarjeta, aunque la colección crezca.</p>
    </header>

    {error && <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-[#272727] dark:text-rose-200">{error}</p>}
    {notice && <p role="status" className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-[#1f1f1f] dark:text-emerald-200">{notice}</p>}

    <section className="space-y-4" aria-labelledby="riddle-events-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 id="riddle-events-title" className="text-xl font-bold">Elige una temporada</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Cada evento tiene su propia colección, lista para activarse con su tema.</p></div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-[#272727] dark:text-slate-200">{events.length} temporadas</span>
      </div>
      {loading ? <div className={`${cardClass} animate-pulse`} aria-label="Cargando temporadas"><div className="h-5 w-48 rounded bg-slate-200 dark:bg-[#313131]" /><div className="mt-4 h-20 rounded-lg bg-slate-100 dark:bg-[#272727]" /></div>
        : events.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const count = event.campaignContent.activities.find((activity) => activity.kind === 'riddleSet')?.riddles?.length || 0;
            return <article key={event.id} className={`${cardClass} flex flex-col gap-4`}>
              <div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold">{event.name.es}</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{event.themeKey}</p></div><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-900 dark:bg-[#183d2c] dark:text-emerald-200">{count} {count === 1 ? 'acertijo' : 'acertijos'}</span></div>
              <p className="flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{event.description.es}</p>
              <button type="button" onClick={() => editEvent(event)} className={`${buttonClass} w-fit border border-emerald-700 text-emerald-900 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-[#183d2c]`}><Sparkles className="h-4 w-4" />{count ? 'Editar colección' : 'Crear colección'}</button>
            </article>;
          })}
        </div> : <p className={`${cardClass} text-sm text-slate-600 dark:text-slate-300`}>Todavía no hay temporadas. Crea primero un evento en Eventos y ambientes.</p>}
    </section>

    {selectedEvent && collection && <section id="riddle-editor" className={`${cardClass} scroll-mt-6 space-y-5`} aria-labelledby="riddle-editor-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">{selectedEvent.name.es}</p><h2 id="riddle-editor-title" className="mt-1 text-xl font-bold">Colección de acertijos</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{riddles.length} de 24 · Se muestran de uno en uno en la web.</p></div>
        <button type="button" onClick={() => { setSelectedId(''); setCollection(null); setRiddles([]); setError(''); }} className={`${buttonClass} border border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-[#414141] dark:text-slate-100 dark:hover:bg-[#272727]`}><ChevronLeft className="h-4 w-4" />Volver a temporadas</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Título de la actividad en español" value={collection.title.es} maxLength={100} onChange={(value) => setCollection((current) => current ? { ...current, title: { ...current.title, es: value } } : current)} />
        <TextField label="Activity title in English" value={collection.title.en} maxLength={100} onChange={(value) => setCollection((current) => current ? { ...current, title: { ...current.title, en: value } } : current)} />
        <TextAreaField label="Presentación en español" value={collection.description.es} maxLength={320} onChange={(value) => setCollection((current) => current ? { ...current, description: { ...current.description, es: value } } : current)} />
        <TextAreaField label="Introduction in English" value={collection.description.en} maxLength={320} onChange={(value) => setCollection((current) => current ? { ...current, description: { ...current.description, en: value } } : current)} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 dark:border-[#313131]">
        <div><h3 className="font-semibold">Preguntas y respuestas</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Completa los dos idiomas para cada acertijo.</p></div>
        <button type="button" onClick={() => setRiddles((current) => current.length < 24 ? [...current, createRiddle()] : current)} disabled={riddles.length >= 24} className={`${buttonClass} border border-emerald-700 text-emerald-900 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-[#183d2c]`}><Plus className="h-4 w-4" />Añadir acertijo</button>
      </div>
      <div className="space-y-4">
        {riddles.map((riddle, index) => <fieldset key={riddle.id} className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-[#313131] sm:p-5">
          <legend className="px-2 text-sm font-bold">Acertijo {index + 1}</legend>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button type="button" onClick={() => moveRiddle(index, -1)} disabled={index === 0} className={`${buttonClass} border border-slate-300 dark:border-[#414141]`} aria-label={`Subir acertijo ${index + 1}`}><ArrowUp className="h-4 w-4" /></button>
            <button type="button" onClick={() => moveRiddle(index, 1)} disabled={index === riddles.length - 1} className={`${buttonClass} border border-slate-300 dark:border-[#414141]`} aria-label={`Bajar acertijo ${index + 1}`}><ArrowDown className="h-4 w-4" /></button>
            <button type="button" onClick={() => setRiddles((current) => current.filter((item) => item.id !== riddle.id))} className={`${buttonClass} text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-[#272727]`} aria-label={`Eliminar acertijo ${index + 1}`}><Trash2 className="h-4 w-4" />Eliminar</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Nombre en español" value={riddle.title.es} maxLength={80} onChange={(value) => updateRiddle(riddle.id, 'title', 'es', value)} />
            <TextField label="Title in English" value={riddle.title.en} maxLength={80} onChange={(value) => updateRiddle(riddle.id, 'title', 'en', value)} />
            <TextAreaField label="Enunciado en español" value={riddle.prompt.es} maxLength={320} onChange={(value) => updateRiddle(riddle.id, 'prompt', 'es', value)} />
            <TextAreaField label="Riddle in English" value={riddle.prompt.en} maxLength={320} onChange={(value) => updateRiddle(riddle.id, 'prompt', 'en', value)} />
            <TextAreaField label="Respuesta en español" value={riddle.answer.es} maxLength={240} onChange={(value) => updateRiddle(riddle.id, 'answer', 'es', value)} />
            <TextAreaField label="Answer in English" value={riddle.answer.en} maxLength={240} onChange={(value) => updateRiddle(riddle.id, 'answer', 'en', value)} />
          </div>
        </fieldset>)}
        {!riddles.length && <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-[#272117] dark:text-amber-100">Añade al menos un acertijo antes de guardar la colección.</p>}
      </div>
      <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-[#313131] dark:bg-[#1f1f1f]/95">
        {selectedEvent.campaignContent.activities.some((activity) => activity.kind === 'riddleSet') && (confirmDelete
          ? <span className="flex flex-wrap items-center gap-2 text-sm text-rose-800 dark:text-rose-200"><span>¿Eliminar esta colección?</span><button type="button" onClick={() => void deleteCollection()} disabled={saving} className={`${buttonClass} bg-rose-700 text-white hover:bg-rose-600`}>Sí, eliminar</button><button type="button" onClick={() => setConfirmDelete(false)} className={`${buttonClass} border border-slate-300 dark:border-[#414141]`}>Cancelar</button></span>
          : <button type="button" onClick={() => setConfirmDelete(true)} className={`${buttonClass} text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-[#272727]`}><Trash2 className="h-4 w-4" />Eliminar colección</button>)}
        <button type="button" onClick={() => void saveCollection()} disabled={saving} className={`${buttonClass} min-w-40 bg-emerald-800 text-white hover:bg-emerald-700`}>{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? 'Guardando…' : 'Guardar colección'}</button>
      </div>
    </section>}
  </div>;
}

function TextField({ label, value, onChange, maxLength }: { label: string; value: string; onChange: (value: string) => void; maxLength: number }) {
  return <label className="block text-sm font-semibold">{label}<input value={value} onChange={(event) => onChange(event.target.value)} maxLength={maxLength} required className={fieldClass} /></label>;
}

function TextAreaField({ label, value, onChange, maxLength }: { label: string; value: string; onChange: (value: string) => void; maxLength: number }) {
  return <label className="block text-sm font-semibold">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} maxLength={maxLength} required rows={3} className={`${fieldClass} resize-y`} /></label>;
}
