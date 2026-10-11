'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Images, Save, Trash2 } from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { GalleryCategory, GalleryItem } from '@/lib/gallery';

interface GalleryData {
  categories: GalleryCategory[];
  items: GalleryItem[];
  storageAvailable: boolean;
}
interface CategoryDraft { slug: string; name: { es: string; en: string }; sortOrder: number; }
interface ItemDraft {
  slug: string;
  categorySlug: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  alt: { es: string; en: string };
  imageUrl: string;
  storagePath: string;
  sortOrder: number;
  isPublished: boolean;
}

const fieldClass = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#272727] dark:text-white';
const slugify = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function emptyCategory(sortOrder = 0): CategoryDraft { return { slug: '', name: { es: '', en: '' }, sortOrder }; }
function emptyItem(categorySlug = '', sortOrder = 0): ItemDraft {
  return { slug: '', categorySlug, title: { es: '', en: '' }, description: { es: '', en: '' }, alt: { es: '', en: '' }, imageUrl: '', storagePath: '', sortOrder, isPublished: false };
}
function toDraft(item: GalleryItem): ItemDraft {
  return { slug: item.slug, categorySlug: item.category_slug, title: item.title, description: item.description, alt: item.alt, imageUrl: item.image_url, storagePath: item.storage_path, sortOrder: item.sort_order, isPublished: item.is_published };
}

export default function GalleryManager() {
  const [data, setData] = useState<GalleryData | null>(null);
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft>(emptyCategory());
  const [editingCategorySlug, setEditingCategorySlug] = useState<string | null>(null);
  const [itemDraft, setItemDraft] = useState<ItemDraft>(emptyItem());
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState('');

  const refresh = useCallback(async () => {
    const response = await fetch('/api/admin/gallery', { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'No se pudo cargar la galería.');
    setData(result as GalleryData);
  }, []);

  useEffect(() => { refresh().catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo cargar la galería.')).finally(() => setLoading(false)); }, [refresh]);

  async function saveCategory() {
    setSaving(true); setError(''); setMessage('');
    const slug = slugify(categoryDraft.slug || categoryDraft.name.es);
    try {
      const response = await fetch(editingCategorySlug ? `/api/admin/gallery/categories/${encodeURIComponent(editingCategorySlug)}` : '/api/admin/gallery/categories', {
        method: editingCategorySlug ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name: categoryDraft.name, sortOrder: categoryDraft.sortOrder }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar la categoría.');
      await refresh(); setCategoryDraft(emptyCategory(data?.categories.length || 0)); setEditingCategorySlug(null); setMessage('Categoría guardada.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo guardar la categoría.'); }
    finally { setSaving(false); }
  }

  async function deleteCategory(slug: string) {
    if (confirmDelete !== `category:${slug}`) { setConfirmDelete(`category:${slug}`); return; }
    setError('');
    try {
      const response = await fetch(`/api/admin/gallery/categories/${encodeURIComponent(slug)}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo eliminar la categoría.');
      await refresh(); setConfirmDelete(''); setMessage('Categoría eliminada.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo eliminar la categoría.');
      setConfirmDelete('');
    }
  }

  async function moveCategory(index: number, direction: -1 | 1) {
    if (!data) return;
    const categories = [...data.categories]; const target = index + direction;
    if (target < 0 || target >= categories.length) return;
    [categories[index], categories[target]] = [categories[target], categories[index]];
    const ordered = categories.map((category, sortOrder) => ({ ...category, sort_order: sortOrder }));
    setData({ ...data, categories: ordered });
    setError('');
    try {
      const response = await fetch('/api/admin/gallery/order', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ categories: ordered.map((category, sortOrder) => ({ slug: category.slug, sortOrder })) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar el orden.');
      setMessage('Orden de categorías guardado.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el orden.');
      await refresh().catch(() => undefined);
    }
  }

  async function saveItem() {
    setSaving(true); setError(''); setMessage('');
    const slug = editingItemId ? itemDraft.slug : slugify(itemDraft.slug || itemDraft.title.es);
    try {
      const response = await fetch(editingItemId ? `/api/admin/gallery/items/${editingItemId}` : '/api/admin/gallery/items', {
        method: editingItemId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...itemDraft, slug }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar la imagen.');
      await refresh(); setEditingItemId(null); setItemDraft(emptyItem(data?.categories[0]?.slug || '', data?.items.length || 0)); setMessage('Imagen guardada.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo guardar la imagen.'); }
    finally { setSaving(false); }
  }

  async function toggleItemPublished(item: GalleryItem) {
    setSaving(true); setError(''); setMessage('');
    try {
      const response = await fetch(`/api/admin/gallery/items/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...toDraft(item), isPublished: !item.is_published }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo cambiar la publicación.');
      await refresh(); setMessage(item.is_published ? 'Imagen retirada de la web.' : 'Imagen publicada en la web.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo cambiar la publicación.'); }
    finally { setSaving(false); }
  }

  async function deleteItem(item: GalleryItem) {
    if (confirmDelete !== `item:${item.id}`) { setConfirmDelete(`item:${item.id}`); return; }
    setError('');
    try {
      const response = await fetch(`/api/admin/gallery/items/${item.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo eliminar la imagen.');
      await refresh(); setConfirmDelete(''); if (editingItemId === item.id) resetItem(); setMessage('Imagen eliminada de la galería.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo eliminar la imagen.');
      setConfirmDelete('');
    }
  }

  async function moveItem(index: number, direction: -1 | 1) {
    if (!data) return;
    const items = [...data.items]; const target = index + direction;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    const ordered = items.map((item, sortOrder) => ({ ...item, sort_order: sortOrder }));
    setData({ ...data, items: ordered });
    setError('');
    try {
      const response = await fetch('/api/admin/gallery/items', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: ordered.map((item, sortOrder) => ({ id: item.id, sortOrder })) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar el orden.');
      setMessage('Orden de imágenes guardado.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el orden.');
      await refresh().catch(() => undefined);
    }
  }

  function editCategory(category: GalleryCategory) { setEditingCategorySlug(category.slug); setCategoryDraft({ slug: category.slug, name: category.name, sortOrder: category.sort_order }); setError(''); setMessage(''); }
  function editItem(item: GalleryItem) { setEditingItemId(item.id); setItemDraft(toDraft(item)); setError(''); setMessage(''); }
  function resetItem() { setEditingItemId(null); setItemDraft(emptyItem(data?.categories[0]?.slug || '', data?.items.length || 0)); setError(''); setMessage(''); }

  return <div className="mx-auto max-w-6xl space-y-8">
    <header><p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Gestión editorial</p><div className="mt-2 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200"><Images className="h-5 w-5" /></span><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Galería</h1></div><p className="mt-3 max-w-3xl text-base leading-6 text-slate-600 dark:text-slate-300">Administra categorías, imágenes, textos alternativos, orden y publicación. Las imágenes públicas se pueden ver a tamaño completo, descargar y compartir.</p></header>
    {loading ? <div role="status" className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#272727]" /> : <>
      {data && !data.storageAvailable && <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-200">No se pudo leer la biblioteca. Aplica la migración de gestión de autoras y galería en Supabase.</p>}
      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6">
          <div><h2 className="text-xl font-bold">Categorías</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Los filtros públicos siguen el orden que definas aquí.</p></div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {(['es', 'en'] as const).map((language) => <label key={language} className="space-y-1"><span className="text-sm font-semibold">{language === 'es' ? 'Nombre en español' : 'Name in English'}</span><input className={fieldClass} maxLength={120} value={categoryDraft.name[language]} onChange={(event) => setCategoryDraft((current) => ({ ...current, name: { ...current.name, [language]: event.target.value }, slug: language === 'es' && !editingCategorySlug ? slugify(event.target.value) : current.slug }))} /></label>)}
            <label className="space-y-1"><span className="text-sm font-semibold">Identificador</span><input className={fieldClass} maxLength={80} value={categoryDraft.slug} onChange={(event) => setCategoryDraft((current) => ({ ...current, slug: slugify(event.target.value) }))} placeholder="personajes" /></label>
            <label className="space-y-1"><span className="text-sm font-semibold">Orden</span><input className={fieldClass} type="number" min={0} max={10000} value={categoryDraft.sortOrder} onChange={(event) => setCategoryDraft((current) => ({ ...current, sortOrder: Number(event.target.value) }))} /></label>
          </div>
          <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { void saveCategory(); }} disabled={saving || !data?.storageAvailable} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><Save className="h-4 w-4" />{editingCategorySlug ? 'Guardar categoría' : 'Añadir categoría'}</button>{editingCategorySlug && <button type="button" onClick={() => { setEditingCategorySlug(null); setCategoryDraft(emptyCategory(data?.categories.length || 0)); }} className="min-h-10 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-[#272727]">Cancelar</button>}</div>
          {data?.categories.length ? <ol className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-[#414141] dark:border-[#414141]">{data.categories.map((category, index) => <li key={category.slug} className="flex flex-wrap items-center justify-between gap-2 p-3"><span className="min-w-0"><strong className="block truncate text-sm">{category.name.es} <span className="font-normal text-slate-500">· {category.name.en}</span></strong><span className="text-xs text-slate-500">{category.slug}</span></span><span className="flex items-center gap-1"><button type="button" onClick={() => { void moveCategory(index, -1); }} disabled={index === 0} aria-label={`Subir ${category.name.es}`} className="rounded p-2 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowUp className="h-4 w-4" /></button><button type="button" onClick={() => { void moveCategory(index, 1); }} disabled={index === data.categories.length - 1} aria-label={`Bajar ${category.name.es}`} className="rounded p-2 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowDown className="h-4 w-4" /></button><button type="button" onClick={() => editCategory(category)} className="rounded px-2 py-1 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-[#272727]">Editar</button><button type="button" onClick={() => { void deleteCategory(category.slug); }} className="rounded px-2 py-1 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-rose-300 dark:hover:bg-[#272727]">{confirmDelete === `category:${category.slug}` ? 'Confirmar' : 'Eliminar'}</button></span></li>)}</ol> : <p className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-600 dark:bg-[#181818] dark:text-slate-300">Crea una categoría para empezar a añadir imágenes.</p>}
        </div>

        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6">
          <div><h2 className="text-xl font-bold">{editingItemId ? 'Editar imagen' : 'Añadir imagen'}</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Optimiza la carga con imágenes WebP y completa el texto alternativo en ambos idiomas.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1"><span className="text-sm font-semibold">Categoría</span><select className={fieldClass} value={itemDraft.categorySlug} onChange={(event) => setItemDraft((current) => ({ ...current, categorySlug: event.target.value }))}><option value="">Selecciona una categoría</option>{data?.categories.map((category) => <option key={category.slug} value={category.slug}>{category.name.es}</option>)}</select></label>
            <label className="space-y-1"><span className="text-sm font-semibold">Identificador</span><input className={fieldClass} maxLength={100} value={itemDraft.slug} onChange={(event) => setItemDraft((current) => ({ ...current, slug: slugify(event.target.value) }))} placeholder="curileta-en-la-isla" /></label>
            {(['es', 'en'] as const).map((language) => <label key={`title-${language}`} className="space-y-1"><span className="text-sm font-semibold">{language === 'es' ? 'Título en español' : 'Title in English'}</span><input className={fieldClass} maxLength={160} value={itemDraft.title[language]} onChange={(event) => setItemDraft((current) => ({ ...current, title: { ...current.title, [language]: event.target.value }, slug: language === 'es' && !editingItemId ? slugify(event.target.value) : current.slug }))} /></label>)}
            {(['es', 'en'] as const).map((language) => <label key={`desc-${language}`} className="space-y-1"><span className="text-sm font-semibold">{language === 'es' ? 'Descripción, opcional' : 'Description, optional'}</span><textarea className={`${fieldClass} min-h-20 resize-y`} maxLength={1000} value={itemDraft.description[language]} onChange={(event) => setItemDraft((current) => ({ ...current, description: { ...current.description, [language]: event.target.value } }))} /></label>)}
            {(['es', 'en'] as const).map((language) => <label key={`alt-${language}`} className="space-y-1"><span className="text-sm font-semibold">{language === 'es' ? 'Texto alternativo en español' : 'Alt text in English'}</span><textarea className={`${fieldClass} min-h-20 resize-y`} maxLength={240} value={itemDraft.alt[language]} onChange={(event) => setItemDraft((current) => ({ ...current, alt: { ...current.alt, [language]: event.target.value } }))} /></label>)}
            <div className="sm:col-span-2"><ImageUploadField label="Imagen de galería" hint="Selecciona una imagen original para compartir y descargar." target="gallery-image" value={itemDraft.imageUrl} onChange={(imageUrl) => setItemDraft((current) => ({ ...current, imageUrl }))} onPathChange={(storagePath) => setItemDraft((current) => ({ ...current, storagePath }))} onUploadingChange={setUploading} /></div>
            <label className="space-y-1"><span className="text-sm font-semibold">Orden de aparición</span><input className={fieldClass} type="number" min={0} max={10000} value={itemDraft.sortOrder} onChange={(event) => setItemDraft((current) => ({ ...current, sortOrder: Number(event.target.value) }))} /></label>
            <label className="flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={itemDraft.isPublished} onChange={(event) => setItemDraft((current) => ({ ...current, isPublished: event.target.checked }))} className="h-4 w-4 accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" />Publicar imagen</label>
          </div>
          <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => { void saveItem(); }} disabled={saving || uploading || !data?.storageAvailable || !data.categories.length} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><Save className="h-4 w-4" />{saving ? 'Guardando…' : 'Guardar imagen'}</button>{editingItemId && <button type="button" onClick={resetItem} className="min-h-10 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-[#272727]">Cancelar</button>}<Link href="/es/galeria" target="_blank" className="min-h-10 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200 dark:hover:bg-[#272727]">Ver galería pública</Link></div>
        </div>
      </section>

      <div aria-live="polite">{message && <p role="status" className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{message}</p>}{error && <p role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-[#272727] dark:text-rose-200">{error}</p>}</div>
      <section className="space-y-4" aria-labelledby="gallery-items-heading"><div><h2 id="gallery-items-heading" className="text-2xl font-bold">Imágenes</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Orden de arriba abajo. Las retiradas permanecen guardadas como borradores.</p></div>{data?.items.length ? <ol className="space-y-3">{data.items.map((item, index) => <li key={item.id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-[#313131] dark:bg-[#1f1f1f] sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-4"><img src={item.image_url} alt="" className="h-20 w-28 rounded-lg bg-[#131209] object-cover" /><div className="min-w-0"><h3 className="truncate font-semibold">{item.title.es}<span className="font-normal text-slate-500"> · {item.title.en}</span></h3><p className="mt-1 truncate text-xs text-slate-500">{data.categories.find((category) => category.slug === item.category_slug)?.name.es || item.category_slug} · {item.slug}</p><span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.is_published ? 'bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-[#313131] dark:text-slate-200'}`}>{item.is_published ? 'Publicada' : 'Borrador'}</span></div></div><div className="flex flex-wrap gap-1"><button type="button" onClick={() => { void moveItem(index, -1); }} disabled={index === 0} aria-label={`Subir ${item.title.es}`} className="rounded p-2 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowUp className="h-4 w-4" /></button><button type="button" onClick={() => { void moveItem(index, 1); }} disabled={index === data.items.length - 1} aria-label={`Bajar ${item.title.es}`} className="rounded p-2 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowDown className="h-4 w-4" /></button><button type="button" onClick={() => editItem(item)} className="rounded px-2 py-1 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-[#272727]">Editar</button><button type="button" onClick={() => { void toggleItemPublished(item); }} disabled={saving} className="rounded px-2 py-1 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200 dark:hover:bg-[#272727]">{item.is_published ? 'Retirar' : 'Publicar'}</button><button type="button" onClick={() => { void deleteItem(item); }} className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-rose-300 dark:hover:bg-[#272727]">{confirmDelete === `item:${item.id}` ? 'Confirmar' : <><Trash2 className="h-4 w-4" />Eliminar</>}</button></div></li>)}</ol> : <p className="rounded-xl border border-dashed border-slate-300 px-5 py-8 text-sm text-slate-600 dark:border-[#414141] dark:text-slate-300">Todavía no hay imágenes. Crea una categoría y carga la primera ilustración.</p>}</section>
    </>}
  </div>;
}
