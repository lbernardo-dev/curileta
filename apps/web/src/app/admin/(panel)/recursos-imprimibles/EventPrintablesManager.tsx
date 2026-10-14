'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Download, FilePlus2, Plus, Save, Trash2, X } from 'lucide-react';
import { EventMediaUploadField } from '@/components/admin/EventMediaUploadField';
import type { EventPrintable, EventPrintableLocaleText, EventPrintableType } from '@/lib/event-printables.server';

type AdminEvent = { id: string; slug: string; name: EventPrintableLocaleText };
type ManagedPrintable = EventPrintable & { downloads: number };
type PrintableForm = Omit<EventPrintable, 'id' | 'eventSlug' | 'eventName' | 'createdAt' | 'updatedAt'> & { updatedAt: string };

const fieldClass = 'mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#181818] dark:text-white';
const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-wait disabled:opacity-60';
const cardClass = 'rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6';

function emptyForm(eventId = ''): PrintableForm {
  return {
    eventId, slug: '', resourceType: 'coloring', title: { es: '', en: '' }, description: { es: '', en: '' },
    fileUrl: '', filePath: '', sortOrder: 0, isPublished: false, updatedAt: '',
  };
}

function toForm(resource: ManagedPrintable): PrintableForm {
  return {
    eventId: resource.eventId, slug: resource.slug, resourceType: resource.resourceType,
    title: resource.title, description: resource.description, fileUrl: resource.fileUrl,
    filePath: resource.filePath, sortOrder: resource.sortOrder, isPublished: resource.isPublished,
    updatedAt: resource.updatedAt,
  };
}

export default function EventPrintablesManager() {
  const [resources, setResources] = useState<ManagedPrintable[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<PrintableForm | null>(null);
  const [editingId, setEditingId] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/event-printables', { cache: 'no-store' });
      const result = await response.json() as { success?: boolean; resources?: ManagedPrintable[]; events?: AdminEvent[]; error?: string };
      if (!response.ok || !result.success || !Array.isArray(result.resources) || !Array.isArray(result.events)) throw new Error(result.error || 'No se pudieron cargar los recursos.');
      setResources(result.resources);
      setEvents(result.events);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudieron cargar los recursos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  function startNew() {
    setEditingId('');
    setForm(emptyForm(events[0]?.id || ''));
    setError('');
    setNotice('');
  }

  function startEdit(resource: ManagedPrintable) {
    setEditingId(resource.id);
    setForm(toForm(resource));
    setError('');
    setNotice('');
  }

  function closeForm() {
    setForm(null);
    setEditingId('');
    setError('');
  }

  function updateText(field: 'title' | 'description', locale: keyof EventPrintableLocaleText, value: string) {
    setForm((current) => current ? { ...current, [field]: { ...current[field], [locale]: value } } : current);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || saving || uploading) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(editingId ? `/api/admin/event-printables/${editingId}` : '/api/admin/event-printables', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json() as { success?: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || 'No se pudo guardar el recurso.');
      const wasEditing = Boolean(editingId);
      setForm(null);
      setEditingId('');
      setNotice(wasEditing ? 'Cambios guardados.' : 'Recurso creado.');
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el recurso.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteResource(resource: ManagedPrintable) {
    if (deletingId !== resource.id) {
      setDeletingId(resource.id);
      return;
    }
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/event-printables/${resource.id}`, { method: 'DELETE' });
      const result = await response.json().catch(() => ({})) as { success?: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || 'No se pudo eliminar el recurso.');
      setDeletingId('');
      if (editingId === resource.id) closeForm();
      setNotice('Recurso eliminado.');
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo eliminar el recurso.');
    }
  }

  const downloadsTotal = resources.reduce((total, resource) => total + resource.downloads, 0);
  const resourceTypeLabel = (type: EventPrintableType) => type === 'coloring' ? 'Lámina para colorear' : 'Otro PDF imprimible';

  return <div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Biblioteca de eventos</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Recursos imprimibles</h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-slate-600 dark:text-slate-300">Sube fichas y PDF para cada temporada. Puedes guardar borradores, publicar varios recursos y consultar sus descargas agregadas.</p>
      </div>
      <button type="button" onClick={startNew} disabled={!events.length} className={`${buttonClass} bg-emerald-800 text-white hover:bg-emerald-900`}><Plus className="h-4 w-4" />Nuevo PDF</button>
    </header>

    {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200">{error}</p>}
    {notice && <p role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-[#1f1f1f] dark:text-emerald-200">{notice}</p>}

    <section className="grid gap-4 sm:grid-cols-2" aria-label="Resumen de recursos imprimibles">
      <article className={cardClass}><p className="text-sm font-semibold text-slate-600 dark:text-slate-300">PDF registrados</p><p className="mt-3 text-4xl font-bold tabular-nums">{resources.length.toLocaleString('es-ES')}</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Borradores y recursos publicados</p></article>
      <article className={cardClass}><p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Descargas iniciadas</p><p className="mt-3 text-4xl font-bold tabular-nums">{downloadsTotal.toLocaleString('es-ES')}</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Conteo agregado. Se respeta la preferencia DNT/GPC.</p></article>
    </section>

    <div className="grid items-start gap-6 xl:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.2fr)]">
      <section className={cardClass} aria-labelledby="printable-library-heading">
        <div className="flex items-center justify-between gap-3">
          <div><h2 id="printable-library-heading" className="text-xl font-bold">Biblioteca</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{resources.length} {resources.length === 1 ? 'recurso' : 'recursos'} registrados</p></div>
          <button type="button" onClick={() => void load()} disabled={loading} className={`${buttonClass} border border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-[#444] dark:text-white dark:hover:bg-[#272727]`}>{loading ? 'Actualizando…' : 'Actualizar'}</button>
        </div>
        {loading ? <div className="mt-5 space-y-3" role="status" aria-label="Cargando recursos">{[0, 1, 2].map((item) => <div key={item} className="h-24 animate-pulse rounded-lg bg-slate-100 dark:bg-[#272727]" />)}</div>
          : resources.length ? <ul className="mt-5 space-y-3">{resources.map((resource) => <li key={resource.id} className={`rounded-lg border p-4 ${editingId === resource.id ? 'border-emerald-600 bg-emerald-50 dark:bg-[#272727]' : 'border-slate-200 dark:border-[#313131]'}`}>
            <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-semibold">{resource.title.es}</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{resource.eventName.es} · {resourceTypeLabel(resource.resourceType)}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${resource.isPublished ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-[#313131] dark:text-slate-200'}`}>{resource.isPublished ? 'Publicado' : 'Borrador'}</span></div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{resource.downloads.toLocaleString('es-ES')} descargas</p>
            <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => startEdit(resource)} className={`${buttonClass} border border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-[#444] dark:text-white dark:hover:bg-[#272727]`}>Editar</button><button type="button" onClick={() => { setDeletingId(''); void deleteResource(resource); }} className={`${buttonClass} text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-[#272727]`}><Trash2 className="h-4 w-4" />{deletingId === resource.id ? 'Confirmar eliminación' : 'Eliminar'}</button>{deletingId === resource.id && <button type="button" onClick={() => setDeletingId('')} className={`${buttonClass} border border-slate-300 dark:border-[#444]`}><X className="h-4 w-4" />Cancelar</button>}</div>
          </li>)}</ul>
          : <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-6 text-center dark:border-[#444]"><FilePlus2 className="mx-auto h-8 w-8 text-slate-500" /><h3 className="mt-3 font-semibold">Aún no hay PDF</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Crea el primer recurso para una temporada.</p></div>}
      </section>

      {form && <form onSubmit={(event) => { void save(event); }} className={`${cardClass} space-y-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">{editingId ? 'Edición' : 'Nuevo recurso'}</p><h2 className="mt-1 text-xl font-bold">{editingId ? form.title.es || 'PDF imprimible' : 'Añadir un PDF'}</h2></div><button type="button" onClick={closeForm} aria-label="Cerrar formulario" className={`${buttonClass} border border-slate-300 dark:border-[#444]`}><X className="h-4 w-4" />Cerrar</button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">Evento<select required value={form.eventId} onChange={(event) => setForm({ ...form, eventId: event.target.value })} className={fieldClass}>{events.map((event) => <option key={event.id} value={event.id}>{event.name.es} ({event.slug})</option>)}</select></label>
          <label className="block text-sm font-semibold">Tipo<select value={form.resourceType} onChange={(event) => setForm({ ...form, resourceType: event.target.value as EventPrintableType })} className={fieldClass}><option value="coloring">Lámina para colorear</option><option value="printable">Otro material imprimible</option></select></label>
          <label className="block text-sm font-semibold">Identificador<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={80} value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className={fieldClass} placeholder="bosque-halloween-para-colorear" /></label>
          {(['es', 'en'] as const).map((locale) => <label key={`title-${locale}`} className="block text-sm font-semibold">Título {locale.toUpperCase()}<input required maxLength={120} value={form.title[locale]} onChange={(event) => updateText('title', locale, event.target.value)} className={fieldClass} /></label>)}
          {(['es', 'en'] as const).map((locale) => <label key={`description-${locale}`} className="block text-sm font-semibold">Descripción {locale.toUpperCase()}<textarea maxLength={500} rows={3} value={form.description[locale]} onChange={(event) => updateText('description', locale, event.target.value)} className={fieldClass} /></label>)}
          <label className="block text-sm font-semibold">Orden<input type="number" min={0} max={10000} step={1} value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} className={fieldClass} /></label>
          <label className="flex min-h-12 items-center gap-3 self-end rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold dark:border-[#313131]"><input type="checkbox" checked={form.isPublished} onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} className="h-4 w-4 accent-emerald-700" />Publicar en el evento</label>
        </div>
        <EventMediaUploadField kind="eventPrintablePdf" label="PDF descargable" hint="Sube una lámina o recurso para imprimir. Máximo 12 MB." url={form.fileUrl} onChange={({ url, path }) => setForm((current) => current ? { ...current, fileUrl: url, filePath: path } : current)} onUploadingChange={setUploading} />
        {form.filePath && <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Download className="h-4 w-4 text-emerald-700" />PDF preparado para descarga</p>}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-[#313131]"><p className="text-xs text-slate-600 dark:text-slate-300">Para publicar, selecciona un PDF y completa ambos títulos.</p><div className="flex gap-2"><button type="button" onClick={closeForm} className={`${buttonClass} border border-slate-300 dark:border-[#444]`}>Cancelar</button><button type="submit" disabled={saving || uploading} className={`${buttonClass} bg-emerald-800 text-white hover:bg-emerald-900`}><Save className="h-4 w-4" />{saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear recurso'}</button></div></div>
      </form>}
    </div>
  </div>;
}
