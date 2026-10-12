'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarClock, Check, Clapperboard, LoaderCircle, Palette, Plus, Save, Sparkles, Trash2, X } from 'lucide-react';
import { EventMediaUploadField } from '@/components/admin/EventMediaUploadField';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { EventThemeControlPanel } from './EventThemeControlPanel';
import {
  DEFAULT_EVENT_EFFECTS,
  EVENT_DECORATIONS,
  EVENT_PALETTE_PRESETS,
  EVENT_THEME_OPTIONS,
  dateTimeValueInTimeZone,
  eventDateTimeToIso,
  eventStatusLabel,
  type EventPalette,
  type ManagedEvent,
} from '@/lib/events';

type MediaKind = 'heroVideo' | 'ambientAudio' | 'scareSound';
type MediaValue = { url: string; path: string };
type EventForm = Omit<ManagedEvent, 'id' | 'createdAt'> & {
  startsAt: string;
  endsAt: string;
};

const colorFields: Array<{ key: keyof EventPalette; label: string }> = [
  { key: 'accent', label: 'Acento principal' },
  { key: 'accentStrong', label: 'Acento para texto' },
  { key: 'canvasLight', label: 'Fondo claro' },
  { key: 'surfaceLight', label: 'Superficie clara' },
  { key: 'textLight', label: 'Texto claro' },
  { key: 'canvasDark', label: 'Fondo oscuro' },
  { key: 'surfaceDark', label: 'Superficie oscura' },
  { key: 'textDark', label: 'Texto oscuro' },
];

const fieldClass = 'mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus:border-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#181818] dark:text-white';
const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-wait disabled:opacity-60';
const cardClass = 'rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6';

function dateInputFromNow(deltaMinutes: number) {
  const date = new Date(Date.now() + deltaMinutes * 60_000);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function emptyForm(): EventForm {
  const themeKey = 'custom';
  return {
    slug: '',
    name: { es: '', en: '' },
    description: { es: '', en: '' },
    themeKey,
    startsAt: dateInputFromNow(60),
    endsAt: dateInputFromNow(60 + 7 * 24 * 60),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid',
    activationMode: 'scheduled',
    enabled: false,
    manualActive: false,
    priority: 0,
    artworkUrl: '',
    artworkPath: '',
    heroVideoUrl: '',
    heroVideoPath: '',
    ambientAudioUrl: '',
    ambientAudioPath: '',
    scareSoundUrl: '',
    scareSoundPath: '',
    updatedAt: '',
    palette: EVENT_PALETTE_PRESETS[themeKey],
    effects: { ...DEFAULT_EVENT_EFFECTS, decorations: [] },
  };
}

function toForm(event: ManagedEvent): EventForm {
  return {
    slug: event.slug,
    name: event.name,
    description: event.description,
    themeKey: event.themeKey,
    startsAt: dateTimeValueInTimeZone(event.startsAt, event.timeZone),
    endsAt: dateTimeValueInTimeZone(event.endsAt, event.timeZone),
    timeZone: event.timeZone,
    activationMode: event.activationMode,
    enabled: event.enabled,
    manualActive: event.manualActive,
    priority: event.priority,
    artworkUrl: event.artworkUrl,
    artworkPath: event.artworkPath,
    heroVideoUrl: event.heroVideoUrl,
    heroVideoPath: event.heroVideoPath,
    ambientAudioUrl: event.ambientAudioUrl,
    ambientAudioPath: event.ambientAudioPath,
    scareSoundUrl: event.scareSoundUrl,
    scareSoundPath: event.scareSoundPath,
    updatedAt: event.updatedAt,
    palette: event.palette,
    effects: event.effects,
  };
}

export default function EventsManager() {
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<EventForm | null>(null);
  const [editingId, setEditingId] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyAction, setBusyAction] = useState('');
  const [uploads, setUploads] = useState<Record<MediaKind | 'artwork', boolean>>({ heroVideo: false, ambientAudio: false, scareSound: false, artwork: false });
  const [deleteId, setDeleteId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/events', { cache: 'no-store' });
      const result = await response.json().catch(() => null) as { success?: boolean; events?: ManagedEvent[]; error?: string } | null;
      if (!response.ok || !result?.success || !Array.isArray(result.events)) throw new Error(result?.error || 'No se pudieron cargar los eventos.');
      setEvents(result.events);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudieron cargar los eventos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/admin/events', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const result = await response.json().catch(() => null) as { success?: boolean; events?: ManagedEvent[]; error?: string } | null;
        if (!response.ok || !result?.success || !Array.isArray(result.events)) throw new Error(result?.error || 'No se pudieron cargar los eventos.');
        return result.events;
      })
      .then(setEvents)
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'No se pudieron cargar los eventos.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const editingEvent = useMemo(() => events.find((event) => event.id === editingId) || null, [events, editingId]);
  const setField = <K extends keyof EventForm>(key: K, value: EventForm[K]) => {
    setForm((previous) => previous ? { ...previous, [key]: value } : previous);
  };
  const setLocalizedField = (field: 'name' | 'description', locale: 'es' | 'en', value: string) => {
    setForm((previous) => previous ? { ...previous, [field]: { ...previous[field], [locale]: value } } : previous);
  };
  const setEffect = <K extends keyof EventForm['effects']>(key: K, value: EventForm['effects'][K]) => {
    setForm((previous) => previous ? { ...previous, effects: { ...previous.effects, [key]: value } } : previous);
  };
  const setPalette = (key: keyof EventPalette, value: string) => {
    setForm((previous) => previous ? { ...previous, palette: { ...previous.palette, [key]: value } } : previous);
  };

  function startCreate() {
    setEditingId('');
    setForm(emptyForm());
    setDeleteId('');
    setNotice('');
    setError('');
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  }

  function startEdit(event: ManagedEvent) {
    setEditingId(event.id);
    setForm(toForm(event));
    setDeleteId('');
    setNotice('');
    setError('');
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  }

  async function discardIfUncommitted(path: string, savedPath: string) {
    if (!path || path === savedPath) return;
    await fetch('/api/admin/events/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    }).catch(() => undefined);
  }

  function cancelForm() {
    if (form) {
      if (form.artworkPath && form.artworkPath !== (editingEvent?.artworkPath || '')) {
        void fetch('/api/admin/media/discard', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: 'event-artwork', path: form.artworkPath }) }).catch(() => undefined);
      }
      void discardIfUncommitted(form.heroVideoPath, editingEvent?.heroVideoPath || '');
      void discardIfUncommitted(form.ambientAudioPath, editingEvent?.ambientAudioPath || '');
      void discardIfUncommitted(form.scareSoundPath, editingEvent?.scareSoundPath || '');
    }
    setForm(null);
    setEditingId('');
    setError('');
  }

  async function saveEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || saving) return;
    if (form.endsAt <= form.startsAt) {
      setError('La fecha y hora de fin deben ser posteriores al inicio.');
      return;
    }
    const startsAt = eventDateTimeToIso(form.startsAt, form.timeZone);
    const endsAt = eventDateTimeToIso(form.endsAt, form.timeZone, true);
    if (!startsAt || !endsAt) {
      setError('La hora elegida no existe en esa zona por el cambio horario. Elige otra hora.');
      return;
    }
    if (Object.values(uploads).some(Boolean)) {
      setError('Espera a que terminen las subidas de archivos.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const payload = {
        ...form,
        startsAt,
        endsAt,
      };
      const response = await fetch(editingId ? `/api/admin/events/${editingId}` : '/api/admin/events', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null) as { success?: boolean; event?: ManagedEvent; error?: string } | null;
      if (!response.ok || !result?.success) throw new Error(result?.error || 'No se pudo guardar el evento.');
      const savedId = result.event?.id || editingId;
      await loadEvents();
      setEditingId(savedId);
      setForm(null);
      setNotice('El evento se ha guardado.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el evento.');
    } finally {
      setSaving(false);
    }
  }

  async function changeActivation(event: ManagedEvent) {
    const active = eventStatusLabel(event) === 'Activo ahora';
    setBusyAction(event.id);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: active ? 'disable' : 'activate-now' }),
      });
      const result = await response.json().catch(() => null) as { success?: boolean; error?: string } | null;
      if (!response.ok || !result?.success) throw new Error(result?.error || 'No se pudo cambiar el estado del evento.');
      await loadEvents();
      setNotice(active ? 'El evento se ha desactivado.' : 'El evento se ha activado manualmente.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cambiar el estado del evento.');
    } finally {
      setBusyAction('');
    }
  }

  async function deleteEvent(event: ManagedEvent) {
    setBusyAction(event.id);
    setError('');
    try {
      const response = await fetch(`/api/admin/events/${event.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error || 'No se pudo eliminar el evento.');
      }
      if (editingId === event.id) cancelForm();
      setDeleteId('');
      await loadEvents();
      setNotice('El evento se ha eliminado.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo eliminar el evento.');
    } finally {
      setBusyAction('');
    }
  }

  function updateMedia(kind: MediaKind, media: MediaValue) {
    if (!form) return;
    const urlField = kind === 'heroVideo' ? 'heroVideoUrl' : kind === 'ambientAudio' ? 'ambientAudioUrl' : 'scareSoundUrl';
    const pathField = kind === 'heroVideo' ? 'heroVideoPath' : kind === 'ambientAudio' ? 'ambientAudioPath' : 'scareSoundPath';
    setForm((previous) => previous ? { ...previous, [urlField]: media.url, [pathField]: media.path } : previous);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Curileta</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Eventos y ambientes</h1>
          <p className="mt-3 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">
            Programa temporadas, personaliza su aspecto y ajusta los sonidos y movimientos que verá cada visitante.
          </p>
        </div>
        <button type="button" onClick={startCreate} className={`${buttonClass} bg-emerald-800 text-white hover:bg-emerald-700`}>
          <Plus className="h-4 w-4" />Crear evento
        </button>
      </header>

      {error && <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-[#272727] dark:text-rose-200">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-[#1f1f1f] dark:text-emerald-200">{notice}</p>}

      <EventThemeControlPanel events={events} />

      <section aria-labelledby="events-list-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="events-list-heading" className="text-xl font-bold">Eventos creados</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Si coinciden varias fechas, se aplica el evento con mayor prioridad.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-[#272727] dark:text-slate-200">{events.length} {events.length === 1 ? 'evento' : 'eventos'}</span>
        </div>

        {loading ? (
          <div className={`${cardClass} animate-pulse`} aria-label="Cargando eventos"><div className="h-5 w-48 rounded bg-slate-200 dark:bg-[#313131]" /><div className="mt-4 h-20 rounded-lg bg-slate-100 dark:bg-[#272727]" /></div>
        ) : events.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {events.map((event) => {
              const status = eventStatusLabel(event);
              const active = status === 'Activo ahora';
              const localeDate = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short', timeZone: event.timeZone });
              return (
                <article key={event.id} className={`${cardClass} space-y-4`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold">{event.name.es}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${active ? 'bg-emerald-100 text-emerald-900 dark:bg-[#183d2c] dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-[#272727] dark:text-slate-200'}`}>{status}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{event.themeKey} · {event.activationMode === 'scheduled' ? 'Programación automática' : 'Control manual'}</p>
                    </div>
                    <span className="flex shrink-0 gap-1.5" aria-label="Paleta del evento">
                      {[event.palette.accent, event.palette.canvasLight, event.palette.surfaceDark].map((color) => <i key={color} className="h-5 w-5 rounded-full border border-black/10 dark:border-white/20" style={{ backgroundColor: color }} />)}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{event.description.es}</p>
                  <p className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <CalendarClock className="h-4 w-4" />{localeDate.format(new Date(event.startsAt))} a {localeDate.format(new Date(event.endsAt))}
                  </p>
                  <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-[#313131]">
                    <button type="button" onClick={() => startEdit(event)} className={`${buttonClass} border border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-[#414141] dark:text-slate-100 dark:hover:bg-[#272727]`}>Editar configuración</button>
                    <button type="button" onClick={() => void changeActivation(event)} disabled={busyAction === event.id} className={`${buttonClass} ${active ? 'bg-amber-100 text-amber-950 hover:bg-amber-200 dark:bg-[#3d3420] dark:text-amber-200 dark:hover:bg-[#4c4128]' : 'bg-emerald-800 text-white hover:bg-emerald-700'}`}>
                      {busyAction === event.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      {active ? 'Desactivar' : 'Activar ahora'}
                    </button>
                    {deleteId === event.id ? (
                      <span className="flex flex-wrap items-center gap-2 rounded-lg bg-rose-50 px-2 dark:bg-[#302020]">
                        <span className="px-1 text-xs font-medium text-rose-900 dark:text-rose-200">¿Eliminar este evento?</span>
                        <button type="button" onClick={() => void deleteEvent(event)} disabled={busyAction === event.id} className={`${buttonClass} bg-rose-700 text-white hover:bg-rose-600`}>Sí, eliminar</button>
                        <button type="button" onClick={() => setDeleteId('')} className={`${buttonClass} text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-[#272727]`}>Cancelar</button>
                      </span>
                    ) : (
                      <button type="button" onClick={() => setDeleteId(event.id)} className={`${buttonClass} text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-[#272727]`} aria-label={`Eliminar ${event.name.es}`}><Trash2 className="h-4 w-4" />Eliminar</button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={`${cardClass} py-10 text-center`}>
            <Sparkles className="mx-auto h-8 w-8 text-emerald-700 dark:text-emerald-300" />
            <h3 className="mt-3 text-lg font-bold">Todavía no hay eventos</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">Crea Halloween, Navidad, Pascua o cualquier otra temporada para cambiar el ambiente de toda la web.</p>
            <button type="button" onClick={startCreate} className={`${buttonClass} mt-5 bg-emerald-800 text-white hover:bg-emerald-700`}><Plus className="h-4 w-4" />Crear el primer evento</button>
          </div>
        )}
      </section>

      {form && (
        <form ref={formRef} onSubmit={(event) => void saveEvent(event)} className="scroll-mt-6 space-y-5">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">{editingId ? `Editar ${editingEvent?.name.es || 'evento'}` : 'Crear un evento'}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Los cambios se aplican a toda la web cuando el evento esté activo.</p>
            </div>
            <button type="button" onClick={cancelForm} className={`${buttonClass} text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-[#272727]`}><X className="h-4 w-4" />Cerrar edición</button>
          </header>

          <section className={`${cardClass} space-y-5`} aria-labelledby="event-details-heading">
            <h3 id="event-details-heading" className="flex items-center gap-2 text-lg font-bold"><CalendarClock className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />Datos y programación</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Nombre en español" value={form.name.es} maxLength={120} required onChange={(value) => setLocalizedField('name', 'es', value)} />
              <TextField label="Nombre en inglés" value={form.name.en} maxLength={120} required onChange={(value) => setLocalizedField('name', 'en', value)} />
              <TextField label="Identificador de la dirección" value={form.slug} maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="halloween-2026" required hint="Usa minúsculas, números y guiones." onChange={(value) => setField('slug', value)} />
              <div>
                <label htmlFor="theme-key" className="text-sm font-semibold">Temática visual</label>
                <select id="theme-key" value={form.themeKey in EVENT_PALETTE_PRESETS ? form.themeKey : 'custom'} className={fieldClass} onChange={(event) => {
                  const value = event.target.value;
                  setForm((previous) => previous ? { ...previous, themeKey: value, palette: EVENT_PALETTE_PRESETS[value] || previous.palette } : previous);
                }}>
                  {EVENT_THEME_OPTIONS.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
                </select>
                {(form.themeKey === 'custom' || !(form.themeKey in EVENT_PALETTE_PRESETS)) && <input aria-label="Clave de la temática" className={fieldClass} value={form.themeKey} pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={48} required onChange={(event) => setField('themeKey', event.target.value)} placeholder="aniversario" />}
              </div>
              <TextField label="Prioridad si coinciden eventos" type="number" value={String(form.priority)} min={0} max={100} required hint="Un número mayor tiene preferencia." onChange={(value) => setField('priority', Number(value))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextAreaField label="Descripción en español" value={form.description.es} maxLength={1000} required onChange={(value) => setLocalizedField('description', 'es', value)} />
              <TextAreaField label="Descripción en inglés" value={form.description.en} maxLength={1000} required onChange={(value) => setLocalizedField('description', 'en', value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Fecha y hora de inicio" type="datetime-local" value={form.startsAt} required onChange={(value) => setField('startsAt', value)} />
              <TextField label="Fecha y hora de fin" type="datetime-local" value={form.endsAt} required hint="Se incluye el minuto seleccionado." onChange={(value) => setField('endsAt', value)} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-slate-50 p-4 dark:bg-[#181818]">
              <div>
                <label className="block max-w-md text-sm font-semibold">Zona horaria IANA
                  <input list="event-time-zone-options" value={form.timeZone} onChange={(event) => setField('timeZone', event.target.value)} maxLength={80} pattern="[A-Za-z_]+(?:/[A-Za-z0-9_+-]+)*" className={fieldClass} />
                  <datalist id="event-time-zone-options"><option value="Europe/Madrid" /><option value="UTC" /><option value="America/Mexico_City" /><option value="America/Bogota" /><option value="America/Argentina/Buenos_Aires" /><option value="America/New_York" /><option value="America/Los_Angeles" /><option value="Europe/London" /></datalist>
                  <span className="mt-1 block text-xs font-normal text-slate-600 dark:text-slate-400">Las fechas se guardan en esta zona. Si la cambias, se conserva la hora del reloj.</span>
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.enabled} onChange={(event) => setField('enabled', event.target.checked)} className="h-4 w-4 rounded accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" />Evento habilitado</label>
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.activationMode === 'manual'} onChange={(event) => setField('activationMode', event.target.checked ? 'manual' : 'scheduled')} className="h-4 w-4 rounded accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" />Activación manual</label>
                {form.activationMode === 'manual' && <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.manualActive} onChange={(event) => setField('manualActive', event.target.checked)} className="h-4 w-4 rounded accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" />Activo manualmente</label>}
              </div>
            </div>
          </section>

          <section className={`${cardClass} space-y-5`} aria-labelledby="event-artwork-heading">
            <h3 id="event-artwork-heading" className="flex items-center gap-2 text-lg font-bold"><Palette className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />Imagen de temporada</h3>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">La portada acompaña el anuncio y la sección del evento. Puedes usar la ilustración del pack o subir una imagen propia.</p>
            <ImageUploadField
              label="Ilustración del evento"
              hint="Imagen cuadrada o apaisada. Se optimiza antes de subirla."
              target="event-artwork"
              value={form.artworkUrl}
              onChange={(value) => setField('artworkUrl', value)}
              onPathChange={(value) => setField('artworkPath', value)}
              onUploadingChange={(busy) => setUploads((state) => ({ ...state, artwork: busy }))}
              preserveOnUnmount
            />
          </section>

          <section className={`${cardClass} space-y-5`} aria-labelledby="event-media-heading">
            <h3 id="event-media-heading" className="flex items-center gap-2 text-lg font-bold"><Clapperboard className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />Vídeo y sonido</h3>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Los archivos se suben a la biblioteca segura de medios y se guardan con el evento.</p>
            <div className="grid gap-5 lg:grid-cols-2">
              <EventMediaUploadField kind="heroVideo" label="Vídeo del hero" hint="MP4 o WebM. Hasta 100 MB." url={form.heroVideoUrl} onUploadingChange={(busy) => setUploads((state) => ({ ...state, heroVideo: busy }))} onChange={(media) => updateMedia('heroVideo', media)} />
              <EventMediaUploadField kind="ambientAudio" label="Sonido ambiental" hint="MP3, M4A, OGG o WebM. Hasta 25 MB. Se reproduce tras activarlo el visitante." url={form.ambientAudioUrl} onUploadingChange={(busy) => setUploads((state) => ({ ...state, ambientAudio: busy }))} onChange={(media) => updateMedia('ambientAudio', media)} />
              <EventMediaUploadField kind="scareSound" label="Sonido sorpresa" hint="MP3, M4A, OGG o WebM. Hasta 25 MB. Solo se reproduce cuando el visitante pulsa el botón." url={form.scareSoundUrl} onUploadingChange={(busy) => setUploads((state) => ({ ...state, scareSound: busy }))} onChange={(media) => updateMedia('scareSound', media)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 text-sm dark:bg-[#181818]"><input type="checkbox" checked={form.effects.soundEnabled} onChange={(event) => setEffect('soundEnabled', event.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" /><span><strong className="block">Ofrecer audio del evento</strong><span className="mt-1 block text-slate-600 dark:text-slate-400">El visitante decide si lo activa. La web no reproduce sonido por sorpresa.</span></span></label>
              <label className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 text-sm dark:bg-[#181818]"><input type="checkbox" checked={form.effects.scareEffectsEnabled} onChange={(event) => setEffect('scareEffectsEnabled', event.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" /><span><strong className="block">Ofrecer sonido sorpresa</strong><span className="mt-1 block text-slate-600 dark:text-slate-400">La persona decide cada vez si lo escucha. Nunca se reproduce por sorpresa.</span></span></label>
            </div>
          </section>

          <section className={`${cardClass} space-y-5`} aria-labelledby="event-appearance-heading">
            <h3 id="event-appearance-heading" className="flex items-center gap-2 text-lg font-bold"><Palette className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />Paleta visual</h3>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Ajusta el fondo, las superficies y los acentos del tema claro y oscuro.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {colorFields.map(({ key, label }) => <label key={key} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold dark:border-[#313131]">
                <input type="color" aria-label={label} value={form.palette[key]} onChange={(event) => setPalette(key, event.target.value)} className="h-10 w-12 cursor-pointer rounded border-0 bg-transparent p-0" />
                <span className="min-w-0"><span className="block">{label}</span><span className="block font-mono text-xs text-slate-500 dark:text-slate-400">{form.palette[key]}</span></span>
              </label>)}
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-[#181818]">
              <span className="text-sm font-semibold">Vista de paleta</span>
              <span className="rounded-lg px-4 py-2 text-sm font-semibold" style={{ color: form.palette.textLight, background: form.palette.canvasLight }}>Fondo claro</span>
              <span className="rounded-lg px-4 py-2 text-sm font-semibold" style={{ color: form.palette.textDark, background: form.palette.canvasDark }}>Fondo oscuro</span>
              <span className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: form.palette.accentStrong }}>Acción</span>
            </div>
          </section>

          <section className={`${cardClass} space-y-5`} aria-labelledby="event-effects-heading">
            <h3 id="event-effects-heading" className="flex items-center gap-2 text-lg font-bold"><Sparkles className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />Ambientación de la web</h3>
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.effects.decorationsEnabled} onChange={(event) => setEffect('decorationsEnabled', event.target.checked)} className="h-4 w-4 accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" />Mostrar elementos temáticos</label>
            {form.effects.decorationsEnabled && <>
              <fieldset>
                <legend className="text-sm font-semibold">Elementos disponibles</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {EVENT_DECORATIONS.map((decoration) => <label key={decoration.key} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-[#313131]">
                    <input type="checkbox" checked={form.effects.decorations.includes(decoration.key)} onChange={(event) => {
                      const next = event.target.checked
                        ? [...form.effects.decorations, decoration.key]
                        : form.effects.decorations.filter((item) => item !== decoration.key);
                      setEffect('decorations', next);
                    }} className="h-4 w-4 accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" />
                    <span aria-hidden="true">{decoration.glyph}</span>{decoration.label}
                  </label>)}
                </div>
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm font-semibold">Cantidad de elementos <span className="font-normal text-slate-600 dark:text-slate-400">{form.effects.decorationCount}</span><input type="range" min={4} max={32} step={1} value={form.effects.decorationCount} onChange={(event) => setEffect('decorationCount', Number(event.target.value))} className="mt-3 block w-full accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" /></label>
                <label className="text-sm font-semibold">Velocidad<select value={form.effects.decorationSpeed} onChange={(event) => setEffect('decorationSpeed', event.target.value as typeof form.effects.decorationSpeed)} className={fieldClass}><option value="slow">Lenta</option><option value="steady">Moderada</option><option value="quick">Rápida</option></select></label>
                <label className="text-sm font-semibold">Intensidad visual <span className="font-normal text-slate-600 dark:text-slate-400">{Math.round(form.effects.decorationOpacity * 100)} %</span><input type="range" min={0.1} max={0.8} step={0.05} value={form.effects.decorationOpacity} onChange={(event) => setEffect('decorationOpacity', Number(event.target.value))} className="mt-3 block w-full accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" /></label>
              </div>
              <label className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 text-sm dark:bg-[#181818]"><input type="checkbox" checked={form.effects.motionEnabled} onChange={(event) => setEffect('motionEnabled', event.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" /><span><strong className="block">Permitir movimiento</strong><span className="mt-1 block text-slate-600 dark:text-slate-400">Los dispositivos con la opción de reducir movimiento también desactivan estas animaciones.</span></span></label>
            </>}
          </section>

          <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-end gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-[#313131] dark:bg-[#1f1f1f]/95">
            <button type="button" onClick={cancelForm} className={`${buttonClass} text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-[#272727]`}>Cancelar</button>
            <button type="submit" disabled={saving || Object.values(uploads).some(Boolean)} className={`${buttonClass} min-w-40 bg-emerald-800 text-white hover:bg-emerald-700`}>
              {saving || Object.values(uploads).some(Boolean) ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Guardando…' : Object.values(uploads).some(Boolean) ? 'Subiendo archivos…' : 'Guardar evento'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function TextField({ label, value, onChange, type = 'text', maxLength, min, max, required, pattern, placeholder, hint }: {
  label: string; value: string; onChange: (value: string) => void; type?: string; maxLength?: number; min?: number; max?: number;
  required?: boolean; pattern?: string; placeholder?: string; hint?: string;
}) {
  return <label className="block text-sm font-semibold">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} maxLength={maxLength} min={min} max={max} required={required} pattern={pattern} placeholder={placeholder} className={fieldClass} />{hint && <span className="mt-1 block text-xs font-normal text-slate-600 dark:text-slate-400">{hint}</span>}</label>;
}

function TextAreaField({ label, value, onChange, maxLength, required }: { label: string; value: string; onChange: (value: string) => void; maxLength: number; required?: boolean }) {
  return <label className="block text-sm font-semibold">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} maxLength={maxLength} required={required} rows={3} className={`${fieldClass} resize-y`} /></label>;
}

