'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Check, Clock3, Plus, Save, Trash2 } from 'lucide-react';

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
}
interface EditorData {
  books: CatalogBook[];
  featuredBookSlugs: string[];
  upcomingBooks: UpcomingBook[];
  storageAvailable: boolean;
}

const fieldClass = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#272727] dark:text-white';
const slugify = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function BookCatalogEditor() {
  const [data, setData] = useState<EditorData | null>(null);
  const [featured, setFeatured] = useState<string[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingBook[]>([]);
  const [draft, setDraft] = useState<UpcomingBook>({ slug: '', title: { es: '', en: '' }, description: { es: '', en: '' }, publicationDate: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/book-catalog', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudo cargar el catálogo.');
        setData(result as EditorData);
        setFeatured(result.featuredBookSlugs || []);
        setUpcoming(result.upcomingBooks || []);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo cargar el catálogo.'))
      .finally(() => setLoading(false));
  }, []);

  const choices = useMemo(() => [
    ...(data?.books || []).map((book) => ({ slug: book.slug, title: book.title.es })),
    ...upcoming.map((book) => ({ slug: book.slug, title: book.title.es })),
  ], [data, upcoming]);

  function toggleFeatured(slug: string) {
    setMessage('');
    setFeatured((current) => current.includes(slug)
      ? current.filter((item) => item !== slug)
      : current.length < 3 ? [...current, slug] : current);
  }

  function addUpcoming() {
    const title = draft.title.es.trim();
    const englishTitle = draft.title.en.trim();
    const slug = slugify(title);
    if (!title || !englishTitle || !slug || choices.some((book) => book.slug === slug)) {
      setError('Añade un título en español e inglés que no exista ya en el catálogo.');
      return;
    }
    setUpcoming((current) => [...current, { ...draft, slug, title: { es: title, en: englishTitle } }]);
    setDraft({ slug: '', title: { es: '', en: '' }, description: { es: '', en: '' }, publicationDate: '' });
    setError('');
    setMessage('Aventura añadida al borrador. Guarda para publicarla en la web.');
  }

  function removeUpcoming(slug: string) {
    setUpcoming((current) => current.filter((book) => book.slug !== slug));
    setFeatured((current) => current.filter((item) => item !== slug));
    setMessage('');
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
      setMessage('Catálogo y portada guardados.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el catálogo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Gestión editorial</p>
        <div className="mt-2 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200"><BookOpen className="h-5 w-5" /></span><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Catálogo de libros</h1></div>
        <p className="mt-3 max-w-3xl text-base leading-6 text-slate-600 dark:text-slate-300">Elige los tres libros de la portada y anuncia próximas aventuras. Sus títulos y descripciones se guardan en español e inglés; la cubierta reservada no lleva texto incrustado.</p>
      </header>

      {loading ? <div role="status" className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#272727]" /> : (
        <>
          {data && !data.storageAvailable && <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-200">La configuración está en modo de lectura. Aplica la migración de gestión del catálogo en Supabase para guardar cambios.</p>}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="featured-heading">
            <div className="flex items-start justify-between gap-4"><div><h2 id="featured-heading" className="text-xl font-bold">Libros en la portada</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">La portada mostrará como máximo tres, ordenados por fecha prevista o publicación. Sin selección manual, se calculan automáticamente.</p></div><span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900 dark:bg-[#272727] dark:text-emerald-200">{featured.length} de 3</span></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {choices.map((book) => {
                const checked = featured.includes(book.slug);
                const disabled = !checked && featured.length >= 3;
                return <button key={book.slug} type="button" onClick={() => toggleFeatured(book.slug)} disabled={disabled} aria-pressed={checked} className={`flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${checked ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-[#272727]' : 'border-slate-200 bg-slate-50 dark:border-[#414141] dark:bg-[#181818]'}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${checked ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 dark:border-[#555]'}`}>{checked && <Check className="h-4 w-4" />}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{book.title}</span><span className="block truncate text-xs text-slate-500">{book.slug}</span></span></button>;
              })}
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="upcoming-heading">
            <div><h2 id="upcoming-heading" className="flex items-center gap-2 text-xl font-bold"><Clock3 className="h-5 w-5 text-amber-600" />Próximas aventuras</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Empieza con un título y una descripción. La fecha es opcional y la web añade una cubierta genérica con el aviso localizado.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(['es', 'en'] as const).map((language) => <label key={language} className="space-y-2"><span className="text-sm font-semibold">{language === 'es' ? 'Título en español' : 'Title in English'}</span><input className={fieldClass} maxLength={120} value={draft.title[language]} onChange={(event) => setDraft((current) => ({ ...current, title: { ...current.title, [language]: event.target.value } }))} placeholder={language === 'es' ? 'Curileta y el misterio marino' : 'Curileta and the Sea Mystery'} /></label>)}
              {(['es', 'en'] as const).map((language) => <label key={language} className="space-y-2"><span className="text-sm font-semibold">{language === 'es' ? 'Descripción en español' : 'Description in English'}</span><textarea className={`${fieldClass} min-h-24 resize-y`} maxLength={500} value={draft.description[language]} onChange={(event) => setDraft((current) => ({ ...current, description: { ...current.description, [language]: event.target.value } }))} placeholder={language === 'es' ? 'Una breve pista sobre la próxima aventura…' : 'A short hint about the next adventure…'} /></label>)}
              <label className="space-y-2"><span className="text-sm font-semibold">Fecha prevista, si se conoce</span><input className={fieldClass} type="date" value={draft.publicationDate} onChange={(event) => setDraft((current) => ({ ...current, publicationDate: event.target.value }))} /></label>
            </div>
            <button type="button" onClick={addUpcoming} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-emerald-500 dark:text-emerald-200 dark:hover:bg-[#272727]"><Plus className="h-4 w-4" />Añadir próxima aventura</button>
            {upcoming.length > 0 && <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-[#414141] dark:border-[#414141]">{upcoming.map((book) => <li key={book.slug} className="flex items-center justify-between gap-4 p-4"><span className="min-w-0"><span className="block truncate font-semibold">{book.title.es}<span className="font-normal text-slate-500"> · {book.title.en}</span></span><span className="block truncate text-xs text-slate-500">{book.slug}{book.publicationDate ? ` · ${book.publicationDate}` : ''}</span></span><button type="button" onClick={() => removeUpcoming(book.slug)} aria-label={`Eliminar ${book.title.es}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-rose-100 hover:text-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:hover:bg-[#313131]"><Trash2 className="h-4 w-4" /></button></li>)}</ul>}
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div aria-live="polite">{message && <p role="status" className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{message}</p>}{error && <p role="alert" className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>}</div><button type="button" onClick={save} disabled={saving || !data?.storageAvailable} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><Save className="h-4 w-4" />{saving ? 'Guardando…' : 'Guardar catálogo'}</button></div>
        </>
      )}
    </div>
  );
}
