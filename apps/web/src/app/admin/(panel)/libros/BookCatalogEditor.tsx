'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Check, Clock3, ImagePlus, Plus, Save, Trash2 } from 'lucide-react';
import { ContentImage } from '@/components/ContentImage';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

interface CatalogBook {
  slug: string;
  title: { es: string; en?: string };
  publicationDate: string;
}
interface UpcomingBook {
  id?: string;
  slug: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  publicationDate: string;
  isPublished: boolean;
  coverImageUrl?: string;
  coverImagePath?: string;
}
interface EditorData {
  books: CatalogBook[];
  featuredBookSlugs: string[];
  upcomingBooks: UpcomingBook[];
  storageAvailable: boolean;
}

const fieldClass = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-all duration-700 ease-fluid focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#272727] dark:text-white';
const slugify = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const emptyDraft = (): UpcomingBook => ({
  slug: '',
  title: { es: '', en: '' },
  description: { es: '', en: '' },
  publicationDate: '',
  isPublished: true,
  coverImageUrl: '',
  coverImagePath: '',
});

export default function BookCatalogEditor() {
  const [data, setData] = useState<EditorData | null>(null);
  const [featured, setFeatured] = useState<string[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingBook[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<UpcomingBook>(emptyDraft);
  const [draftDirty, setDraftDirty] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/book-catalog', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudo cargar el catálogo.');
        setData(result as EditorData);
        setFeatured(result.featuredBookSlugs || []);
        setUpcoming((result.upcomingBooks || []).map((book: UpcomingBook) => ({
          ...book,
          isPublished: book.isPublished !== false,
          coverImageUrl: book.coverImageUrl || '',
          coverImagePath: book.coverImagePath || '',
        })));
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo cargar el catálogo.'))
      .finally(() => setLoading(false));
  }, []);

  const choices = useMemo(() => [
    ...(data?.books || []).map((book) => ({ slug: book.slug, title: book.title.es })),
    ...upcoming.filter((book) => book.isPublished).map((book) => ({ slug: book.slug, title: book.title.es })),
  ], [data, upcoming]);

  function toggleFeatured(slug: string) {
    setMessage('');
    setFeatured((current) => current.includes(slug)
      ? current.filter((item) => item !== slug)
      : current.length < 3 ? [...current, slug] : current);
    setHasChanges(true);
  }

  function saveUpcomingDraft() {
    const title = draft.title.es.trim();
    const englishTitle = draft.title.en.trim();
    const slug = slugify(title);
    if (uploadingCover) {
      setError('Espera a que termine la carga de la cubierta.');
      return;
    }
    if (!title || !englishTitle || !slug || choices.some((book) => book.slug === slug && book.slug !== editingSlug)
      || upcoming.some((book) => book.slug === slug && book.slug !== editingSlug)) {
      setError('Añade un título en español e inglés que no exista ya en el catálogo.');
      return;
    }
    if (!editingSlug && upcoming.length >= 12) {
      setError('El catálogo admite hasta doce próximas aventuras.');
      return;
    }

    const nextBook: UpcomingBook = {
      ...draft,
      id: `upcoming-${slug}`,
      slug,
      title: { es: title, en: englishTitle },
      coverImageUrl: draft.coverImageUrl || '',
      coverImagePath: draft.coverImagePath || '',
    };
    if (editingSlug) {
      setUpcoming((current) => current.map((book) => book.slug === editingSlug ? nextBook : book));
      setFeatured((current) => current.map((item) => item === editingSlug ? slug : item));
      setMessage('Cambios listos. Guarda el catálogo para aplicarlos en la web.');
    } else {
      setUpcoming((current) => [...current, nextBook]);
      setMessage('Aventura añadida. Guarda el catálogo para publicarla en la web.');
    }
    setHasChanges(true);
    setDraftDirty(false);
    resetDraft();
    setError('');
  }

  function removeUpcoming(slug: string) {
    const removed = upcoming.find((book) => book.slug === slug);
    setUpcoming((current) => current.filter((book) => book.slug !== slug));
    setFeatured((current) => current.filter((item) => item !== slug));
    if (editingSlug === slug) resetDraft();
    setHasChanges(true);
    setError('');
    setMessage(removed ? `«${removed.title.es}» se quitará al guardar el catálogo.` : 'Anuncio quitado del borrador.');
  }

  function startEditing(book: UpcomingBook) {
    setEditingSlug(book.slug);
    setDraft({ ...book, title: { ...book.title }, description: { ...book.description } });
    setDraftDirty(false);
    setError('');
    setMessage(`Editando «${book.title.es}». Guarda los cambios del anuncio y luego el catálogo.`);
  }

  function resetDraft() {
    setEditingSlug(null);
    setDraft(emptyDraft());
    setDraftDirty(false);
  }

  function togglePublished(slug: string) {
    setUpcoming((current) => current.map((book) => book.slug === slug ? { ...book, isPublished: !book.isPublished } : book));
    const book = upcoming.find((item) => item.slug === slug);
    if (editingSlug === slug) setDraft((current) => ({ ...current, isPublished: !current.isPublished }));
    if (book?.isPublished) setFeatured((current) => current.filter((item) => item !== slug));
    setHasChanges(true);
    setMessage('Estado actualizado. Guarda el catálogo para aplicarlo en la web.');
    setError('');
  }

  async function save() {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/admin/book-catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featuredBookSlugs: featured, upcomingBooks: upcoming }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar el catálogo.');
      setHasChanges(false);
      setMessage('Catálogo y portada guardados.');
      setData((current) => current ? { ...current, featuredBookSlugs: featured, upcomingBooks: upcoming } : current);
      resetDraft();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el catálogo.');
    } finally {
      setSaving(false);
    }
  }

  const canSave = Boolean(data?.storageAvailable) && !saving && !uploadingCover && !draftDirty;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Gestión editorial</p>
          <div className="mt-2 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200"><BookOpen className="h-5 w-5" /></span><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Catálogo de libros</h1></div>
          <p className="mt-3 max-w-3xl text-base leading-6 text-slate-600 dark:text-slate-300">Elige los libros de la portada y gestiona los anuncios de próximas aventuras. Edita las fichas, sus imágenes y su publicación desde Contenidos.</p>
        </div>
        {!loading && <button type="button" onClick={save} disabled={!canSave || !hasChanges} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-base font-semibold text-white transition-all duration-700 ease-fluid hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"><Save className="h-4 w-4" />{saving ? 'Guardando…' : 'Guardar catálogo'}</button>}
      </header>

      <div aria-live="polite">{message && <p role="status" className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{message}</p>}{error && <p role="alert" className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>}</div>
      {draftDirty && <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-200">Primero guarda este anuncio en la lista. Después podrás guardar el catálogo completo.</p>}

      {loading ? <div role="status" className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#272727]" /> : (
        <>
          {data && !data.storageAvailable && <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-200">La configuración está en modo de lectura. Aplica la migración de gestión del catálogo en Supabase para guardar cambios.</p>}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="featured-heading">
            <div className="flex items-start justify-between gap-4"><div><h2 id="featured-heading" className="text-xl font-bold">Libros en la portada</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">La portada mostrará como máximo tres, ordenados por fecha prevista o publicación. Sin selección manual, se calculan automáticamente.</p></div><span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900 dark:bg-[#272727] dark:text-emerald-200">{featured.length} de 3</span></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {choices.map((book) => {
                const checked = featured.includes(book.slug);
                const disabled = !checked && featured.length >= 3;
                return <button key={book.slug} type="button" onClick={() => toggleFeatured(book.slug)} disabled={disabled} aria-pressed={checked} className={`flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left transition-all duration-700 ease-fluid hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${checked ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-[#272727]' : 'border-slate-200 bg-slate-50 dark:border-[#414141] dark:bg-[#181818]'}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${checked ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 dark:border-[#555]'}`}>{checked && <Check className="h-4 w-4" />}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{book.title}</span><span className="block truncate text-xs text-slate-500">{book.slug}</span></span></button>;
              })}
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="upcoming-heading">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><h2 id="upcoming-heading" className="flex items-center gap-2 text-xl font-bold"><Clock3 className="h-5 w-5 text-amber-600" />Próximas aventuras</h2><p className="mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-300">Crea anuncios bilingües, configura su cubierta y cambia su visibilidad. Los cambios se aplican en la web al guardar el catálogo.</p></div><span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-[#313131] dark:text-slate-200">{upcoming.length} de 12</span></div>

            {upcoming.length === 0 ? (
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-5 dark:bg-[#181818]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200"><ImagePlus className="h-5 w-5" /></span><div><p className="font-semibold">Aún no hay anuncios</p><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Crea el primero en el formulario. Después aparecerá aquí con opciones para editarlo, ocultarlo o eliminarlo.</p></div></div>
            ) : (
              <ul className="grid gap-3 lg:grid-cols-2">
                {upcoming.map((book) => <li key={book.slug} className={`flex min-w-0 gap-4 rounded-xl border p-4 ${editingSlug === book.slug ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-[#181818]' : 'border-slate-200 dark:border-[#414141]'}`}>
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-[#272727]">
                    {book.coverImageUrl ? <ContentImage src={book.coverImageUrl} alt={`Cubierta de ${book.title.es}`} className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-slate-500"><BookOpen className="h-6 w-6" /></span>}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                    <div className="min-w-0"><p className="truncate font-semibold">{book.title.es}<span className="font-normal text-slate-500"> · {book.title.en}</span></p><p className="mt-1 truncate text-xs text-slate-500">{book.slug}{book.publicationDate ? ` · ${book.publicationDate}` : ''}</p><span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${book.isPublished ? 'bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-[#313131] dark:text-slate-200'}`}>{book.isPublished ? 'Visible en la web' : 'Borrador oculto'}</span></div>
                    <div className="flex flex-wrap gap-1">
                      <button type="button" onClick={() => startEditing(book)} aria-label={`Editar ${book.title.es}`} className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-slate-700 transition-all duration-700 ease-fluid hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-200 dark:hover:bg-[#313131]">Editar</button>
                      <button type="button" onClick={() => togglePublished(book.slug)} aria-label={book.isPublished ? `Ocultar ${book.title.es}` : `Publicar ${book.title.es}`} className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-emerald-800 transition-all duration-700 ease-fluid hover:bg-emerald-50 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200 dark:hover:bg-[#313131]">{book.isPublished ? 'Ocultar' : 'Publicar'}</button>
                      <button type="button" onClick={() => removeUpcoming(book.slug)} aria-label={`Eliminar ${book.title.es}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-rose-700 transition-all duration-700 ease-fluid hover:bg-rose-50 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-rose-300 dark:hover:bg-[#313131]"><Trash2 className="h-4 w-4" />Eliminar</button>
                    </div>
                  </div>
                </li>)}
              </ul>
            )}

            <div className="space-y-5 border-t border-slate-200 pt-5 dark:border-[#414141]">
              <div><h3 className="text-lg font-semibold">{editingSlug ? 'Editar anuncio' : 'Añadir una aventura'}</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{editingSlug ? 'Actualiza los datos y guarda el anuncio en la lista antes de aplicar todos los cambios.' : 'Completa los títulos y añade una cubierta si ya está disponible.'}</p></div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(['es', 'en'] as const).map((language) => <label key={language} className="space-y-2"><span className="text-sm font-semibold">{language === 'es' ? 'Título en español' : 'Title in English'}</span><input className={fieldClass} maxLength={120} value={draft.title[language]} onChange={(event) => { setDraft((current) => ({ ...current, title: { ...current.title, [language]: event.target.value } })); setDraftDirty(true); }} placeholder={language === 'es' ? 'Curileta y el misterio marino' : 'Curileta and the Sea Mystery'} /></label>)}
                {(['es', 'en'] as const).map((language) => <label key={language} className="space-y-2"><span className="text-sm font-semibold">{language === 'es' ? 'Descripción en español' : 'Description in English'}</span><textarea className={`${fieldClass} min-h-24 resize-y`} maxLength={500} value={draft.description[language]} onChange={(event) => { setDraft((current) => ({ ...current, description: { ...current.description, [language]: event.target.value } })); setDraftDirty(true); }} placeholder={language === 'es' ? 'Una breve pista sobre la próxima aventura…' : 'A short hint about the next adventure…'} /></label>)}
                <label className="space-y-2"><span className="text-sm font-semibold">Fecha prevista, si se conoce</span><input className={fieldClass} type="date" value={draft.publicationDate} onChange={(event) => { setDraft((current) => ({ ...current, publicationDate: event.target.value })); setDraftDirty(true); }} /></label>
                <ImageUploadField label="Cubierta del libro" hint="La cubierta se muestra difuminada mientras la aventura siga como próxima." target="upcoming-book-cover" value={draft.coverImageUrl || ''} onChange={(coverImageUrl) => { setDraft((current) => ({ ...current, coverImageUrl })); setDraftDirty(true); }} onPathChange={(coverImagePath) => { setDraft((current) => ({ ...current, coverImagePath })); setDraftDirty(true); }} onUploadingChange={setUploadingCover} />
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={saveUpcomingDraft} disabled={uploadingCover || (!editingSlug && upcoming.length >= 12)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-emerald-700 px-4 py-2 text-base font-semibold text-emerald-900 transition-all duration-700 ease-fluid hover:bg-emerald-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-emerald-500 dark:text-emerald-200 dark:hover:bg-[#272727]"><Plus className="h-4 w-4" />{editingSlug ? 'Guardar cambios del anuncio' : 'Añadir próxima aventura'}</button>
                {editingSlug && <button type="button" onClick={resetDraft} className="min-h-11 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-700 ease-fluid hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-200 dark:hover:bg-[#272727]">Cancelar edición</button>}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
