'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Check, ExternalLink, ImagePlus, Layers, Plus, Save, Sparkles, Trash2 } from 'lucide-react';
import { ContentImage } from '@/components/ContentImage';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { INITIAL_AUTHOR_COMPANION_BOOKS, type UpcomingBookRecord } from '@/lib/book-catalog';

interface CatalogBook {
  slug: string;
  title: { es: string; en?: string };
  publicationDate: string;
}

interface UpcomingBook {
  id?: string;
  slug: string;
  title: { es: string; en: string };
  subtitle?: { es: string; en: string };
  description: { es: string; en: string };
  theme?: { es: string; en: string };
  badge?: { es: string; en: string };
  ageRange?: string;
  pageCount?: number;
  externalUrl?: string;
  author?: string;
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

const fieldClass = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#272727] dark:text-white';
const slugify = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const emptyDraft = (): UpcomingBook => ({
  slug: '',
  title: { es: '', en: '' },
  subtitle: { es: '', en: '' },
  description: { es: '', en: '' },
  theme: { es: '', en: '' },
  badge: { es: '', en: '' },
  ageRange: '5–12 años',
  pageCount: 64,
  externalUrl: '',
  author: 'Sweety Taless',
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
    const slug = draft.slug ? slugify(draft.slug) : slugify(title);
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
      setError('El catálogo admite hasta doce obras y próximas aventuras.');
      return;
    }

    const nextBook: UpcomingBook = {
      ...draft,
      id: `upcoming-${slug}`,
      slug,
      title: { es: title, en: englishTitle },
      subtitle: draft.subtitle ? { es: draft.subtitle.es.trim(), en: draft.subtitle.en.trim() } : undefined,
      description: { es: draft.description.es.trim(), en: draft.description.en.trim() },
      theme: draft.theme ? { es: draft.theme.es.trim(), en: draft.theme.en.trim() } : undefined,
      badge: draft.badge ? { es: draft.badge.es.trim(), en: draft.badge.en.trim() } : undefined,
      ageRange: draft.ageRange?.trim() || undefined,
      pageCount: Number(draft.pageCount) || undefined,
      externalUrl: draft.externalUrl?.trim() || undefined,
      author: draft.author?.trim() || 'Sweety Taless',
      coverImageUrl: draft.coverImageUrl || '',
      coverImagePath: draft.coverImagePath || '',
    };
    if (editingSlug) {
      setUpcoming((current) => current.map((book) => book.slug === editingSlug ? nextBook : book));
      setFeatured((current) => current.map((item) => item === editingSlug ? slug : item));
      setMessage('Cambios listos. Guarda el catálogo para aplicarlos en la web.');
    } else {
      setUpcoming((current) => [...current, nextBook]);
      setMessage('Obra añadida. Guarda el catálogo para publicarla en la web.');
    }
    setHasChanges(true);
    setDraftDirty(false);
    resetDraft();
    setError('');
  }

  function loadSampleAuthorBooks() {
    setUpcoming(INITIAL_AUTHOR_COMPANION_BOOKS.map((b: UpcomingBookRecord) => ({
      ...b,
      isPublished: b.isPublished !== false,
      coverImageUrl: b.coverImageUrl || '',
      coverImagePath: b.coverImagePath || '',
    })));
    setHasChanges(true);
    setMessage('Obras de muestra de Sweety Taless cargadas en el borrador. Pulsa «Guardar catálogo» para aplicarlas.');
  }

  function removeUpcoming(slug: string) {
    const removed = upcoming.find((book) => book.slug === slug);
    setUpcoming((current) => current.filter((book) => book.slug !== slug));
    setFeatured((current) => current.filter((item) => item !== slug));
    if (editingSlug === slug) resetDraft();
    setHasChanges(true);
    setError('');
    setMessage(removed ? `«${removed.title.es}» se quitará al guardar el catálogo.` : 'Obra quitada del borrador.');
  }

  function startEditing(book: UpcomingBook) {
    setEditingSlug(book.slug);
    setDraft({
      ...book,
      title: { ...book.title },
      subtitle: book.subtitle ? { ...book.subtitle } : { es: '', en: '' },
      description: { ...book.description },
      theme: book.theme ? { ...book.theme } : { es: '', en: '' },
      badge: book.badge ? { ...book.badge } : { es: '', en: '' },
      ageRange: book.ageRange || '5–12 años',
      pageCount: book.pageCount || 64,
      externalUrl: book.externalUrl || '',
      author: book.author || 'Sweety Taless',
    });
    setDraftDirty(false);
    setError('');
    setMessage(`Editando «${book.title.es}». Guarda los cambios de la obra y luego el catálogo.`);
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
      setMessage('Catálogo, portada y libros de la autora guardados.');
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
          <div className="mt-2 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200">
              <BookOpen className="h-5 w-5" />
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Catálogo y obras de autoras</h1>
          </div>
          <p className="mt-3 max-w-3xl text-base leading-6 text-slate-600 dark:text-slate-300">
            Administra los libros destacados de la portada y las obras adicionales que se muestran en el carrusel de solapas de la sección de autora, con sus enlaces a Amazon, cubiertas y temáticas.
          </p>
        </div>
        {!loading && (
          <button
            type="button"
            onClick={save}
            disabled={!canSave || !hasChanges}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Guardando…' : 'Guardar catálogo'}
          </button>
        )}
      </header>

      <div aria-live="polite">
        {message && <p role="status" className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{message}</p>}
        {error && <p role="alert" className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>}
      </div>
      {draftDirty && (
        <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-200">
          Primero guarda los cambios de esta obra en la lista. Después podrás guardar el catálogo completo.
        </p>
      )}

      {loading ? (
        <div role="status" className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#272727]" />
      ) : (
        <>
          {data && !data.storageAvailable && (
            <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-200">
              La configuración está en modo de lectura. Aplica la migración de gestión del catálogo en Supabase para guardar cambios.
            </p>
          )}

          {/* Sección 1: Libros en la portada principal */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="featured-heading">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="featured-heading" className="text-xl font-bold">Libros en la portada</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  La portada mostrará como máximo tres, ordenados por fecha prevista o publicación. Sin selección manual, se calculan automáticamente.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900 dark:bg-[#272727] dark:text-emerald-200">
                {featured.length} de 3
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {choices.map((book) => {
                const checked = featured.includes(book.slug);
                const disabled = !checked && featured.length >= 3;
                return (
                  <button
                    key={book.slug}
                    type="button"
                    onClick={() => toggleFeatured(book.slug)}
                    disabled={disabled}
                    aria-pressed={checked}
                    className={`flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                      checked
                        ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-[#272727]'
                        : 'border-slate-200 bg-slate-50 dark:border-[#414141] dark:bg-[#181818]'
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${checked ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 dark:border-[#555]'}`}>
                      {checked && <Check className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{book.title}</span>
                      <span className="block truncate text-xs text-slate-500">{book.slug}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Sección 2: Libros adicionales, carrusel de solapas de la autora y próximas aventuras */}
          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="upcoming-heading">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 id="upcoming-heading" className="flex items-center gap-2 text-xl font-bold">
                  <Layers className="h-5 w-5 text-amber-600" />
                  Obras de la autora y libros adicionales
                </h2>
                <p className="mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
                  Estos libros se muestran en la sección de la autora (en el carrusel de solapas interactivo). Puedes añadir publicaciones en Amazon, cuadernos de actividades, nuevas aventuras o cuentos de buenas noches.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {upcoming.length === 0 && (
                  <button
                    type="button"
                    onClick={loadSampleAuthorBooks}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-emerald-600 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-100 active:scale-[0.98] dark:bg-[#272727] dark:text-emerald-200"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Cargar obras de muestra
                  </button>
                )}
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-[#313131] dark:text-slate-200">
                  {upcoming.length} de 12
                </span>
              </div>
            </div>

            {upcoming.length === 0 ? (
              <div className="flex flex-col sm:flex-row items-start gap-4 rounded-xl bg-slate-50 p-6 dark:bg-[#181818]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200">
                  <ImagePlus className="h-6 w-6" />
                </span>
                <div className="space-y-2">
                  <p className="font-semibold text-base">Aún no hay obras adicionales registradas</p>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Crea tu primera obra con el formulario de abajo, o pulsa «Cargar obras de muestra» para importar los títulos iniciales de Sweety Taless (como el Cuaderno Secreto de Curileta y los Cuentos de Buenas Noches) y personalizarlos a tu gusto.
                  </p>
                  <button
                    type="button"
                    onClick={loadSampleAuthorBooks}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-bold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98]"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    Cargar colección de muestra de Sweety Taless
                  </button>
                </div>
              </div>
            ) : (
              <ul className="grid gap-3 lg:grid-cols-2">
                {upcoming.map((book) => (
                  <li
                    key={book.slug}
                    className={`flex min-w-0 gap-4 rounded-xl border p-4 ${
                      editingSlug === book.slug ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-[#181818]' : 'border-slate-200 dark:border-[#414141]'
                    }`}
                  >
                    <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-[#272727] border border-slate-200 dark:border-slate-700">
                      {book.coverImageUrl ? (
                        <ContentImage src={book.coverImageUrl} alt={`Cubierta de ${book.title.es}`} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-slate-500">
                          <BookOpen className="h-6 w-6" />
                        </span>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {book.badge?.es && (
                            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                              {book.badge.es}
                            </span>
                          )}
                          {book.theme?.es && (
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                              {book.theme.es}
                            </span>
                          )}
                        </div>
                        <p className="truncate font-semibold text-base mt-1 text-slate-950 dark:text-white">
                          {book.title.es}
                          <span className="font-normal text-slate-500 text-sm"> · {book.title.en}</span>
                        </p>
                        {book.subtitle?.es && (
                          <p className="truncate text-xs font-medium text-slate-600 dark:text-slate-400">
                            {book.subtitle.es}
                          </p>
                        )}
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {book.ageRange ? `${book.ageRange} · ` : ''}
                          {book.pageCount ? `${book.pageCount} págs · ` : ''}
                          {book.author || 'Sweety Taless'}
                        </p>
                        {book.externalUrl && (
                          <a
                            href={book.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                          >
                            <span>Amazon / Tienda externa</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <div className="mt-2">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${book.isPublished ? 'bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-[#313131] dark:text-slate-200'}`}>
                            {book.isPublished ? 'Visible en solapas' : 'Borrador oculto'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => startEditing(book)}
                          aria-label={`Editar ${book.title.es}`}
                          className="inline-flex min-h-9 items-center rounded-lg px-2.5 text-xs font-semibold text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-200 dark:hover:bg-[#313131]"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePublished(book.slug)}
                          aria-label={book.isPublished ? `Ocultar ${book.title.es}` : `Publicar ${book.title.es}`}
                          className="inline-flex min-h-9 items-center rounded-lg px-2.5 text-xs font-semibold text-emerald-800 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200 dark:hover:bg-[#313131]"
                        >
                          {book.isPublished ? 'Ocultar' : 'Publicar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeUpcoming(book.slug)}
                          aria-label={`Eliminar ${book.title.es}`}
                          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-rose-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-rose-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-rose-300 dark:hover:bg-[#313131]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Formulario de creación y edición */}
            <div className="space-y-5 border-t border-slate-200 pt-5 dark:border-[#414141]">
              <div>
                <h3 className="text-lg font-semibold">
                  {editingSlug ? 'Editar obra de la colección' : 'Añadir obra a la sección de la autora'}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {editingSlug
                    ? 'Actualiza los datos y guarda la obra en la lista antes de pulsar el botón general «Guardar catálogo».'
                    : 'Completa los títulos, temáticas y enlace a Amazon para enriquecer el carrusel de solapas de la autora.'}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Títulos */}
                {(['es', 'en'] as const).map((language) => (
                  <label key={`title-${language}`} className="space-y-1.5">
                    <span className="text-sm font-semibold">{language === 'es' ? 'Título en español' : 'Title in English'}</span>
                    <input
                      className={fieldClass}
                      maxLength={120}
                      value={draft.title[language]}
                      onChange={(event) => {
                        setDraft((current) => ({ ...current, title: { ...current.title, [language]: event.target.value } }));
                        setDraftDirty(true);
                      }}
                      placeholder={language === 'es' ? 'Curileta y el Misterio Marino' : 'Curileta and the Marine Mystery'}
                    />
                  </label>
                ))}

                {/* Subtítulos */}
                {(['es', 'en'] as const).map((language) => (
                  <label key={`subtitle-${language}`} className="space-y-1.5">
                    <span className="text-sm font-semibold">{language === 'es' ? 'Subtítulo en español' : 'Subtitle in English'}</span>
                    <input
                      className={fieldClass}
                      maxLength={140}
                      value={draft.subtitle?.[language] || ''}
                      onChange={(event) => {
                        const val = event.target.value;
                        setDraft((current) => ({
                          ...current,
                          subtitle: { es: current.subtitle?.es || '', en: current.subtitle?.en || '', [language]: val },
                        }));
                        setDraftDirty(true);
                      }}
                      placeholder={language === 'es' ? 'Volumen 2 — El Mar de Filipinas' : 'Volume 2 — The Philippine Sea'}
                    />
                  </label>
                ))}

                {/* Temática / Categoría */}
                {(['es', 'en'] as const).map((language) => (
                  <label key={`theme-${language}`} className="space-y-1.5">
                    <span className="text-sm font-semibold">{language === 'es' ? 'Temática (es)' : 'Theme (en)'}</span>
                    <input
                      className={fieldClass}
                      maxLength={80}
                      value={draft.theme?.[language] || ''}
                      onChange={(event) => {
                        const val = event.target.value;
                        setDraft((current) => ({
                          ...current,
                          theme: { es: current.theme?.es || '', en: current.theme?.en || '', [language]: val },
                        }));
                        setDraftDirty(true);
                      }}
                      placeholder={language === 'es' ? 'Océanos, Misterio y Arrecifes' : 'Oceans, Mystery & Coral Reefs'}
                    />
                  </label>
                ))}

                {/* Distintivo / Badge */}
                {(['es', 'en'] as const).map((language) => (
                  <label key={`badge-${language}`} className="space-y-1.5">
                    <span className="text-sm font-semibold">{language === 'es' ? 'Distintivo / Badge (es)' : 'Badge (en)'}</span>
                    <input
                      className={fieldClass}
                      maxLength={60}
                      value={draft.badge?.[language] || ''}
                      onChange={(event) => {
                        const val = event.target.value;
                        setDraft((current) => ({
                          ...current,
                          badge: { es: current.badge?.es || '', en: current.badge?.en || '', [language]: val },
                        }));
                        setDraftDirty(true);
                      }}
                      placeholder={language === 'es' ? 'Volumen 2 • Próxima Expedición' : 'Volume 2 • Upcoming Expedition'}
                    />
                  </label>
                ))}

                {/* Descripción bilingüe */}
                {(['es', 'en'] as const).map((language) => (
                  <label key={`desc-${language}`} className="space-y-1.5">
                    <span className="text-sm font-semibold">{language === 'es' ? 'Descripción en español' : 'Description in English'}</span>
                    <textarea
                      className={`${fieldClass} min-h-24 resize-y`}
                      maxLength={500}
                      value={draft.description[language]}
                      onChange={(event) => {
                        setDraft((current) => ({ ...current, description: { ...current.description, [language]: event.target.value } }));
                        setDraftDirty(true);
                      }}
                      placeholder={language === 'es' ? 'Inspirado en la travesía en velero con el pez volador Glub…' : 'Inspired by the sailboat crossing with Glub the flying fish…'}
                    />
                  </label>
                ))}

                {/* Metadatos adicionales */}
                <label className="space-y-1.5">
                  <span className="text-sm font-semibold">Edad recomendada</span>
                  <input
                    className={fieldClass}
                    maxLength={40}
                    value={draft.ageRange || ''}
                    onChange={(event) => {
                      setDraft((current) => ({ ...current, ageRange: event.target.value }));
                      setDraftDirty(true);
                    }}
                    placeholder="5–12 años"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-semibold">Número de páginas</span>
                  <input
                    className={fieldClass}
                    type="number"
                    min={1}
                    max={2000}
                    value={draft.pageCount || ''}
                    onChange={(event) => {
                      const val = Number(event.target.value);
                      setDraft((current) => ({ ...current, pageCount: Number.isFinite(val) && val > 0 ? val : undefined }));
                      setDraftDirty(true);
                    }}
                    placeholder="64"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-semibold">Enlace a Amazon KDP o tienda externa (opcional)</span>
                  <input
                    className={fieldClass}
                    type="url"
                    value={draft.externalUrl || ''}
                    onChange={(event) => {
                      setDraft((current) => ({ ...current, externalUrl: event.target.value }));
                      setDraftDirty(true);
                    }}
                    placeholder="https://www.amazon.com/dp/B0H2CT8S14"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-semibold">Firma de autora</span>
                  <input
                    className={fieldClass}
                    value={draft.author || 'Sweety Taless'}
                    onChange={(event) => {
                      setDraft((current) => ({ ...current, author: event.target.value }));
                      setDraftDirty(true);
                    }}
                    placeholder="Sweety Taless"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-semibold">Fecha prevista (opcional)</span>
                  <input
                    className={fieldClass}
                    type="date"
                    value={draft.publicationDate || ''}
                    onChange={(event) => {
                      setDraft((current) => ({ ...current, publicationDate: event.target.value }));
                      setDraftDirty(true);
                    }}
                  />
                </label>

                <ImageUploadField
                  label="Cubierta del libro"
                  hint="Sube la cubierta ilustrada para mostrarla en el carrusel de solapas."
                  target="upcoming-book-cover"
                  value={draft.coverImageUrl || ''}
                  onChange={(coverImageUrl) => {
                    setDraft((current) => ({ ...current, coverImageUrl }));
                    setDraftDirty(true);
                  }}
                  onPathChange={(coverImagePath) => {
                    setDraft((current) => ({ ...current, coverImagePath }));
                    setDraftDirty(true);
                  }}
                  onUploadingChange={setUploadingCover}
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={saveUpcomingDraft}
                  disabled={uploadingCover || (!editingSlug && upcoming.length >= 12)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-emerald-700 px-5 py-2.5 text-base font-semibold text-emerald-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-emerald-500 dark:text-emerald-200 dark:hover:bg-[#272727]"
                >
                  <Plus className="h-4 w-4" />
                  {editingSlug ? 'Guardar cambios de la obra' : 'Añadir obra a la colección'}
                </button>
                {editingSlug && (
                  <button
                    type="button"
                    onClick={resetDraft}
                    className="min-h-11 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-200 dark:hover:bg-[#272727]"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
