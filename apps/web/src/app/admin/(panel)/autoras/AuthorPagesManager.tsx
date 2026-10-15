'use client';

import { ContentImage } from '@/components/ContentImage';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, BookOpen, Plus, Save, Trash2 } from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { AuthorPage } from '@/lib/author-pages';

interface AuthorDraft {
  slug: string;
  authorName: string;
  name: { es: string; en: string };
  biography: { es: string; en: string };
  quote: { es: string; en: string };
  portraitUrl: string;
  portraitPath: string;
  websiteUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  sortOrder: number;
  isPublished: boolean;
}

interface EditorData {
  data: AuthorPage[];
  sourceAuthorNames: string[];
  storageAvailable: boolean;
}

const fieldClass = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#272727] dark:text-white';
const slugify = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function emptyDraft(authorName = '', sortOrder = 0): AuthorDraft {
  return {
    slug: slugify(authorName), authorName,
    name: { es: authorName, en: authorName }, biography: { es: '', en: '' }, quote: { es: '', en: '' },
    portraitUrl: '', portraitPath: '', websiteUrl: '', instagramUrl: '', youtubeUrl: '', sortOrder, isPublished: false,
  };
}

function toDraft(page: AuthorPage): AuthorDraft {
  return {
    slug: page.slug, authorName: page.author_name, name: page.name, biography: page.biography, quote: page.quote,
    portraitUrl: page.portrait_url, portraitPath: page.portrait_path, websiteUrl: page.website_url,
    instagramUrl: page.instagram_url, youtubeUrl: page.youtube_url, sortOrder: page.sort_order, isPublished: page.is_published,
  };
}

export default function AuthorPagesManager() {
  const [data, setData] = useState<EditorData | null>(null);
  const [draft, setDraft] = useState<AuthorDraft>(emptyDraft());
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const loading = !loaded;
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const response = await fetch('/api/admin/author-pages', { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'No se pudieron cargar las páginas de autoras.');
    setData(result as EditorData);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/author-pages', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudieron cargar las páginas de autoras.');
        setData(result as EditorData);
        setError('');
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'No se pudieron cargar las páginas de autoras.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoaded(true);
      });
    return () => controller.abort();
  }, []);

  function updateLocalized(key: 'name' | 'biography' | 'quote', language: 'es' | 'en', value: string) {
    setDraft((current) => {
      const next = { ...current, [key]: { ...current[key], [language]: value } };
      if (key === 'name' && !editingSlug && language === 'es') next.slug = slugify(value);
      return next;
    });
  }

  async function save() {
    setSaving(true); setError(''); setMessage('');
    try {
      const payload = editingSlug ? { ...draft, currentSlug: editingSlug } : draft;
      const response = await fetch('/api/admin/author-pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar la página de autora.');
      await refresh();
      setEditingSlug(draft.slug);
      setMessage('Página guardada. La vista pública se actualizó.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la página de autora.');
    } finally { setSaving(false); }
  }

  async function togglePublished(page: AuthorPage) {
    setSaving(true); setError(''); setMessage('');
    try {
      const response = await fetch('/api/admin/author-pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...toDraft(page), currentSlug: page.slug, isPublished: !page.is_published }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo cambiar la publicación.');
      await refresh();
      setMessage(page.is_published ? 'Página retirada de la web.' : 'Página publicada en la web.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo cambiar la publicación.'); }
    finally { setSaving(false); }
  }

  async function remove(slug: string) {
    if (confirmDeleteSlug !== slug) { setConfirmDeleteSlug(slug); return; }
    setError(''); setMessage('');
    try {
      const response = await fetch(`/api/admin/author-pages?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo eliminar la página.');
      await refresh();
      if (editingSlug === slug) reset();
      setConfirmDeleteSlug(null);
      setMessage('Página de autora eliminada.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo eliminar la página.'); }
  }

  async function move(index: number, direction: -1 | 1) {
    if (!data) return;
    const next = [...data.data];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setData({ ...data, data: next.map((page, order) => ({ ...page, sort_order: order })) });
    const response = await fetch('/api/admin/author-pages', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: next.map((page, sortOrder) => ({ slug: page.slug, sortOrder })) }) });
    const result = await response.json();
    if (!response.ok) { setError(result.error || 'No se pudo guardar el orden.'); await refresh(); }
    else setMessage('Orden de autoras guardado.');
  }

  function reset() {
    setEditingSlug(null);
    setDraft(emptyDraft('', data?.data.length || 0));
    setError(''); setMessage('');
  }

  function edit(page: AuthorPage) {
    setEditingSlug(page.slug); setDraft(toDraft(page)); setError(''); setMessage('');
  }

  return <div className="mx-auto max-w-6xl space-y-8">
    <header>
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Gestión editorial</p>
      <div className="mt-2 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200"><BookOpen className="h-5 w-5" /></span><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Páginas de autoras</h1></div>
      <p className="mt-3 max-w-3xl text-base leading-6 text-slate-600 dark:text-slate-300">Crea perfiles bilingües enlazados a los libros por el nombre de autoría que figura en el catálogo. Los perfiles publicados aparecen en la portada y en las páginas de sus libros.</p>
    </header>

    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-5 dark:border-amber-900/40 dark:bg-[#201d14]">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <BookOpen className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold text-slate-900 dark:text-amber-100">
            ¿Quieres añadir o editar los libros del carrusel de la autora?
          </p>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
            En la portada, junto al perfil de la autora, se muestra una baraja interactiva con solapas. Puedes gestionar esos títulos, cubiertas, temáticas y enlaces de Amazon desde la sección de catálogo.
          </p>
        </div>
      </div>
      <Link
        href="/admin/libros"
        className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-amber-300 active:scale-[0.98]"
      >
        <span>Ir a catálogo y libros</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>

    {loading ? <div role="status" className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#272727]" /> : <>
      {data && !data.storageAvailable && <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-200">No se pudo leer la tabla de autoras. Aplica la migración de gestión de autoras y galería en Supabase para guardar cambios.</p>}
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="author-editor-heading">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="author-editor-heading" className="text-xl font-bold">{editingSlug ? 'Editar perfil' : 'Crear perfil'}</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Escribe los textos en español e inglés. El nombre editorial permite vincular automáticamente los libros actuales.</p></div><button type="button" onClick={() => { reset(); setDraft(emptyDraft(data?.sourceAuthorNames[0] || '', data?.data.length || 0)); }} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:hover:bg-[#272727]"><Plus className="h-4 w-4" />Nueva autora</button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2"><span className="text-sm font-semibold">Nombre de autoría en los libros</span><input list="author-name-options" className={fieldClass} value={draft.authorName} maxLength={120} onChange={(event) => setDraft((current) => ({ ...current, authorName: event.target.value }))} placeholder="Sweety Taless" /><datalist id="author-name-options">{data?.sourceAuthorNames.map((name) => <option key={name} value={name} />)}</datalist><span className="block text-xs text-slate-500">Usa el mismo texto que aparece en las fichas de libros del catálogo.</span></label>
          <label className="space-y-2"><span className="text-sm font-semibold">Identificador de página</span><input className={fieldClass} value={draft.slug} maxLength={80} onChange={(event) => setDraft((current) => ({ ...current, slug: slugify(event.target.value) }))} placeholder="sweety-taless" /></label>
          {(['es', 'en'] as const).map((language) => <label key={`name-${language}`} className="space-y-2"><span className="text-sm font-semibold">{language === 'es' ? 'Nombre visible en español' : 'Name shown in English'}</span><input className={fieldClass} value={draft.name[language]} maxLength={120} onChange={(event) => updateLocalized('name', language, event.target.value)} /></label>)}
          {(['es', 'en'] as const).map((language) => <label key={`bio-${language}`} className="space-y-2"><span className="text-sm font-semibold">{language === 'es' ? 'Biografía en español' : 'Biography in English'}</span><textarea className={`${fieldClass} min-h-36 resize-y`} value={draft.biography[language]} maxLength={6000} onChange={(event) => updateLocalized('biography', language, event.target.value)} placeholder={language === 'es' ? 'Escribe una biografía para lectores y familias.' : 'Write a biography for readers and families.'} /></label>)}
          {(['es', 'en'] as const).map((language) => <label key={`quote-${language}`} className="space-y-2"><span className="text-sm font-semibold">{language === 'es' ? 'Frase destacada, opcional' : 'Featured quote, optional'}</span><textarea className={`${fieldClass} min-h-20 resize-y`} value={draft.quote[language]} maxLength={500} onChange={(event) => updateLocalized('quote', language, event.target.value)} /></label>)}
          <div className="sm:col-span-2"><ImageUploadField label="Retrato de la autora" hint="Elige una fotografía o ilustración para el perfil." target="author-portrait" value={draft.portraitUrl} onChange={(portraitUrl) => setDraft((current) => ({ ...current, portraitUrl }))} onPathChange={(portraitPath) => setDraft((current) => ({ ...current, portraitPath }))} onUploadingChange={setUploading} /></div>
          <label className="space-y-2"><span className="text-sm font-semibold">Sitio web</span><input className={fieldClass} type="url" value={draft.websiteUrl} onChange={(event) => setDraft((current) => ({ ...current, websiteUrl: event.target.value }))} placeholder="https://" /></label>
          <label className="space-y-2"><span className="text-sm font-semibold">Instagram</span><input className={fieldClass} type="url" value={draft.instagramUrl} onChange={(event) => setDraft((current) => ({ ...current, instagramUrl: event.target.value }))} placeholder="https://instagram.com/" /></label>
          <label className="space-y-2"><span className="text-sm font-semibold">YouTube</span><input className={fieldClass} type="url" value={draft.youtubeUrl} onChange={(event) => setDraft((current) => ({ ...current, youtubeUrl: event.target.value }))} placeholder="https://youtube.com/" /></label>
          <label className="space-y-2"><span className="text-sm font-semibold">Orden de aparición</span><input className={fieldClass} type="number" min={0} max={10000} value={draft.sortOrder} onChange={(event) => setDraft((current) => ({ ...current, sortOrder: Number(event.target.value) }))} /></label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold sm:col-span-2"><input type="checkbox" checked={draft.isPublished} onChange={(event) => setDraft((current) => ({ ...current, isPublished: event.target.checked }))} className="h-4 w-4 accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" />Publicar esta página en la web</label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3"><div aria-live="polite">{message && <p role="status" className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{message}</p>}{error && <p role="alert" className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>}</div><div className="flex gap-2">{editingSlug && <button type="button" onClick={reset} className="min-h-11 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-[#272727]">Cancelar</button>}<button type="button" onClick={save} disabled={saving || uploading || !data?.storageAvailable} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-800 px-5 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><Save className="h-4 w-4" />{saving ? 'Guardando…' : 'Guardar página'}</button></div></div>
      </section>

      <section className="space-y-4" aria-labelledby="authors-list-heading"><div><h2 id="authors-list-heading" className="text-2xl font-bold">Páginas existentes</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Ordena, edita, publica o retira cada perfil.</p></div>{data?.data.length ? <ol className="space-y-3">{data.data.map((page, index) => <li key={page.slug} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-[#313131] dark:bg-[#1f1f1f] sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-4">{page.portrait_url ? <ContentImage src={page.portrait_url} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover border-2 border-emerald-600/30 shadow-sm" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f0eee6] text-xl font-semibold text-emerald-900 border-2 border-emerald-600/20 dark:bg-[#272727] dark:text-emerald-200">{page.name.es.slice(0, 1)}</div>}<div className="min-w-0"><h3 className="truncate font-semibold">{page.name.es}<span className="font-normal text-slate-500"> · {page.name.en}</span></h3><p className="mt-1 truncate text-xs text-slate-500">{page.author_name} · /{page.slug}</p><span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${page.is_published ? 'bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-[#313131] dark:text-slate-200'}`}>{page.is_published ? 'Publicada' : 'Borrador'}</span></div></div><div className="flex flex-wrap gap-2">{page.is_published && <Link href={`/es/autora/${page.slug}`} target="_blank" className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200 dark:hover:bg-[#313131]">Ver página</Link>}<button type="button" onClick={() => { void move(index, -1); }} disabled={index === 0} aria-label={`Subir ${page.name.es}`} className="min-h-10 rounded-lg px-3 text-sm font-semibold disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowUp className="h-4 w-4" /></button><button type="button" onClick={() => { void move(index, 1); }} disabled={index === data.data.length - 1} aria-label={`Bajar ${page.name.es}`} className="min-h-10 rounded-lg px-3 text-sm font-semibold disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowDown className="h-4 w-4" /></button><button type="button" onClick={() => edit(page)} className="min-h-10 rounded-lg px-3 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-[#313131]">Editar</button><button type="button" onClick={() => { void togglePublished(page); }} disabled={saving} className="min-h-10 rounded-lg px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200 dark:hover:bg-[#313131]">{page.is_published ? 'Retirar' : 'Publicar'}</button><button type="button" onClick={() => { void remove(page.slug); }} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-rose-300 dark:hover:bg-[#313131]">{confirmDeleteSlug === page.slug ? 'Confirma eliminación' : <><Trash2 className="h-4 w-4" />Eliminar</>}</button></div></li>)}</ol> : <p className="rounded-xl border border-dashed border-slate-300 px-5 py-8 text-sm text-slate-600 dark:border-[#414141] dark:text-slate-300">Todavía no hay páginas de autoras. Elige un nombre editorial y crea el primer perfil bilingüe.</p>}</section>
    </>}
  </div>;
}
