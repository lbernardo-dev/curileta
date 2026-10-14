'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Check, Download, Eye, FilePlus2, Plus, Save, Trash2, X } from 'lucide-react';
import { EventMediaUploadField } from '@/components/admin/EventMediaUploadField';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { CharacterMask, CharacterMaskLocaleText } from '@/lib/character-masks.server';

type ManagedMask = CharacterMask & { downloads: number };
type MaskForm = Omit<CharacterMask, 'id' | 'createdAt' | 'updatedAt'> & { updatedAt: string };

const fieldClass = 'mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-hidden transition-all duration-700 ease-fluid focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#181818] dark:text-white';
const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-700 ease-fluid active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-wait disabled:opacity-60';
const cardClass = 'rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6';

function emptyForm(): MaskForm {
  return {
    slug: '', characterSlug: '', title: { es: '', en: '' }, description: { es: '', en: '' },
    previewImageUrl: '', previewImagePath: '', printablePdfUrl: '', printablePdfPath: '',
    sortOrder: 0, isPublished: false, updatedAt: '',
  };
}

function toForm(mask: ManagedMask): MaskForm {
  return {
    slug: mask.slug, characterSlug: mask.characterSlug, title: mask.title, description: mask.description,
    previewImageUrl: mask.previewImageUrl, previewImagePath: mask.previewImagePath,
    printablePdfUrl: mask.printablePdfUrl, printablePdfPath: mask.printablePdfPath,
    sortOrder: mask.sortOrder, isPublished: mask.isPublished, updatedAt: mask.updatedAt,
  };
}

export default function CharacterMasksManager() {
  const [masks, setMasks] = useState<ManagedMask[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<MaskForm | null>(null);
  const [editingId, setEditingId] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [uploads, setUploads] = useState({ preview: false, pdf: false });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/character-masks', { cache: 'no-store' });
      const result = await response.json() as { success?: boolean; masks?: ManagedMask[]; error?: string };
      if (!response.ok || !result.success || !Array.isArray(result.masks)) throw new Error(result.error || 'No se pudieron cargar las máscaras.');
      setMasks(result.masks);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudieron cargar las máscaras.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  function startNew() {
    setEditingId('');
    setForm(emptyForm());
    setError('');
    setNotice('');
  }

  function startEdit(mask: ManagedMask) {
    setEditingId(mask.id);
    setForm(toForm(mask));
    setError('');
    setNotice('');
  }

  function closeForm() {
    setForm(null);
    setEditingId('');
    setError('');
  }

  function updateText(field: 'title' | 'description', locale: keyof CharacterMaskLocaleText, value: string) {
    setForm((current) => current ? { ...current, [field]: { ...current[field], [locale]: value } } : current);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || saving || uploads.preview || uploads.pdf) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(editingId ? `/api/admin/character-masks/${editingId}` : '/api/admin/character-masks', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json() as { success?: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || 'No se pudo guardar la máscara.');
      setForm(null);
      setEditingId('');
      setNotice(editingId ? 'Cambios guardados.' : 'Máscara creada.');
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la máscara.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteMask(mask: ManagedMask) {
    if (deletingId !== mask.id) {
      setDeletingId(mask.id);
      return;
    }
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/character-masks/${mask.id}`, { method: 'DELETE' });
      const result = await response.json().catch(() => ({})) as { success?: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || 'No se pudo eliminar la máscara.');
      setDeletingId('');
      if (editingId === mask.id) closeForm();
      setNotice('Máscara eliminada.');
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo eliminar la máscara.');
    }
  }

  const downloadsTotal = masks.reduce((total, mask) => total + mask.downloads, 0);

  return <div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Recursos imprimibles</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Máscaras de personajes</h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-slate-600 dark:text-slate-300">Publica las máscaras que aparecen en la actividad del evento. Administra sus textos, vista previa, PDF, orden y estadísticas desde aquí.</p>
      </div>
      <button type="button" onClick={startNew} className={`${buttonClass} bg-emerald-800 text-white hover:bg-emerald-900`}><Plus className="h-4 w-4" />Nueva máscara</button>
    </header>

    {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200">{error}</p>}
    {notice && <p role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-[#1f1f1f] dark:text-emerald-200">{notice}</p>}

    <section className="grid gap-4 sm:grid-cols-2" aria-label="Resumen de máscaras">
      <article className={cardClass}><p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Personajes con máscara</p><p className="mt-3 text-4xl font-bold tabular-nums">{masks.length.toLocaleString('es-ES')}</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Incluye borradores y publicaciones</p></article>
      <article className={cardClass}><p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Descargas iniciadas</p><p className="mt-3 text-4xl font-bold tabular-nums">{downloadsTotal.toLocaleString('es-ES')}</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Total histórico agregado y respetuoso con DNT/GPC</p></article>
    </section>

    <div className="grid items-start gap-6 xl:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.2fr)]">
      <section className={cardClass} aria-labelledby="mask-list-heading">
        <div className="flex items-center justify-between gap-3">
          <div><h2 id="mask-list-heading" className="text-xl font-bold">Biblioteca</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{masks.length} {masks.length === 1 ? 'recurso' : 'recursos'} registrados</p></div>
          <button type="button" onClick={() => void load()} disabled={loading} className={`${buttonClass} border border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-[#444] dark:text-white dark:hover:bg-[#272727]`}>{loading ? 'Actualizando…' : 'Actualizar'}</button>
        </div>
        {loading ? <div className="mt-5 space-y-3" role="status" aria-label="Cargando máscaras">{[0, 1, 2].map((item) => <div key={item} className="h-24 animate-pulse rounded-lg bg-slate-100 dark:bg-[#272727]" />)}</div>
          : masks.length ? <ul className="mt-5 space-y-3">{masks.map((mask) => <li key={mask.id} className={`rounded-lg border p-4 ${editingId === mask.id ? 'border-emerald-600 bg-emerald-50 dark:bg-[#272727]' : 'border-slate-200 dark:border-[#313131]'}`}>
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-[#181818]">{mask.previewImageUrl && <Image src={mask.previewImageUrl} alt="" fill unoptimized className="object-contain p-1" />}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{mask.title.es}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${mask.isPublished ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-[#313131] dark:text-slate-200'}`}>{mask.isPublished ? 'Publicada' : 'Borrador'}</span></div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{mask.characterSlug} · {mask.downloads.toLocaleString('es-ES')} descargas</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => startEdit(mask)} className={`${buttonClass} border border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-[#444] dark:text-white dark:hover:bg-[#272727]`}><Eye className="h-4 w-4" />Editar</button>
              <button type="button" onClick={() => { setDeletingId(''); void deleteMask(mask); }} className={`${buttonClass} text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-[#272727]`}><Trash2 className="h-4 w-4" />{deletingId === mask.id ? 'Confirmar eliminación' : 'Eliminar'}</button>
              {deletingId === mask.id && <button type="button" onClick={() => setDeletingId('')} className={`${buttonClass} border border-slate-300 dark:border-[#444]`}><X className="h-4 w-4" />Cancelar</button>}
            </div>
          </li>)}</ul>
          : <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-6 text-center dark:border-[#444]"><FilePlus2 className="mx-auto h-8 w-8 text-slate-500" /><h3 className="mt-3 font-semibold">Aún no hay máscaras</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Crea un recurso para que aparezca en la selección pública.</p></div>}
      </section>

      {form && <form onSubmit={(event) => { void save(event); }} className={`${cardClass} space-y-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">{editingId ? 'Edición' : 'Nuevo recurso'}</p><h2 className="mt-1 text-xl font-bold">{editingId ? form.title.es || 'Máscara' : 'Crear una máscara'}</h2></div><button type="button" onClick={closeForm} aria-label="Cerrar formulario" className={`${buttonClass} border border-slate-300 dark:border-[#444]`}><X className="h-4 w-4" />Cerrar</button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">Identificador del recurso<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={80} value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className={fieldClass} placeholder="curileta" /></label>
          <label className="block text-sm font-semibold">Identificador del personaje<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={80} value={form.characterSlug} onChange={(event) => setForm({ ...form, characterSlug: event.target.value })} className={fieldClass} placeholder="curileta" /></label>
          {(['es', 'en'] as const).map((locale) => <label key={`title-${locale}`} className="block text-sm font-semibold">Título {locale.toUpperCase()}<input required maxLength={120} value={form.title[locale]} onChange={(event) => updateText('title', locale, event.target.value)} className={fieldClass} /></label>)}
          {(['es', 'en'] as const).map((locale) => <label key={`description-${locale}`} className="block text-sm font-semibold">Descripción {locale.toUpperCase()}<textarea maxLength={500} rows={3} value={form.description[locale]} onChange={(event) => updateText('description', locale, event.target.value)} className={fieldClass} /></label>)}
          <label className="block text-sm font-semibold">Orden<input type="number" min={0} max={10000} step={1} value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} className={fieldClass} /></label>
          <label className="flex min-h-12 items-center gap-3 self-end rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold dark:border-[#313131]"><input type="checkbox" checked={form.isPublished} onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} className="h-4 w-4 accent-emerald-700" />Publicar en la web</label>
        </div>

        <ImageUploadField
          label="Imagen de vista previa"
          hint="La imagen aparece en el selector público. Se convierte y optimiza antes de subirla."
          target="character-mask-preview"
          value={form.previewImageUrl}
          onChange={(previewImageUrl) => setForm((current) => current ? { ...current, previewImageUrl } : current)}
          onPathChange={(previewImagePath) => setForm((current) => current ? { ...current, previewImagePath } : current)}
          onUploadingChange={(preview) => setUploads((current) => ({ ...current, preview }))}
        />
        <EventMediaUploadField
          kind="characterMaskPdf"
          label="PDF imprimible"
          hint="El archivo se descarga desde la web y se cuenta por personaje. Máximo 8 MB."
          url={form.printablePdfUrl}
          onChange={({ url: printablePdfUrl, path: printablePdfPath }) => setForm((current) => current ? { ...current, printablePdfUrl, printablePdfPath } : current)}
          onUploadingChange={(pdf) => setUploads((current) => ({ ...current, pdf }))}
        />

        {form.previewImageUrl && <div className="rounded-lg border border-slate-200 p-4 dark:border-[#313131]"><p className="text-sm font-semibold">Vista previa del recurso</p><div className="relative mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-lg bg-slate-50 p-4 dark:bg-[#181818]"><Image src={form.previewImageUrl} alt={form.title.es || 'Vista previa de la máscara'} width={760} height={600} unoptimized className="max-h-72 w-full object-contain" /></div></div>}
        {form.printablePdfUrl && <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Check className="h-4 w-4 text-emerald-700" />PDF listo para descarga pública</p>}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-[#313131]"><p className="text-xs text-slate-600 dark:text-slate-300">Para publicar deben estar cargados la imagen y el PDF.</p><div className="flex gap-2"><button type="button" onClick={closeForm} className={`${buttonClass} border border-slate-300 dark:border-[#444]`}>Cancelar</button><button type="submit" disabled={saving || uploads.preview || uploads.pdf} className={`${buttonClass} bg-emerald-800 text-white hover:bg-emerald-900`}><Save className="h-4 w-4" />{saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear máscara'}</button></div></div>
      </form>}
    </div>

    <section className={cardClass} aria-labelledby="mask-downloads-heading">
      <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200"><Download className="h-5 w-5" /></span><div><h2 id="mask-downloads-heading" className="text-xl font-bold">Descargas por personaje</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Solicitudes de PDF servidas correctamente, agrupadas sin identificadores de visitantes.</p></div></div>
      {masks.length ? <div className="mt-5 overflow-x-auto"><table className="w-full min-w-120 text-left text-sm"><thead className="bg-slate-50 text-slate-600 dark:bg-[#181818] dark:text-slate-300"><tr><th scope="col" className="rounded-l-lg px-4 py-3 font-semibold">Personaje</th><th scope="col" className="px-4 py-3 font-semibold">Estado</th><th scope="col" className="rounded-r-lg px-4 py-3 text-right font-semibold">Descargas</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-[#313131]">{masks.map((mask) => <tr key={`stats-${mask.id}`}><th scope="row" className="px-4 py-3 font-medium">{mask.title.es}</th><td className="px-4 py-3">{mask.isPublished ? 'Publicada' : 'Borrador'}</td><td className="px-4 py-3 text-right font-semibold tabular-nums">{mask.downloads.toLocaleString('es-ES')}</td></tr>)}</tbody></table></div> : <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-[#181818] dark:text-slate-300">Las estadísticas aparecerán cuando haya máscaras descargables.</p>}
    </section>
  </div>;
}
