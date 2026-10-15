'use client';

import { ContentImage } from '@/components/ContentImage';
import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';


function YouTubeBrandIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21.58 7.19a2.98 2.98 0 0 0-2.1-2.1C17.63 4.58 12 4.58 12 4.58s-5.63 0-7.48.51a2.98 2.98 0 0 0-2.1 2.1C1.91 9.04 1.91 12 1.91 12s0 2.96.51 4.81a2.98 2.98 0 0 0 2.1 2.1c1.85.51 7.48.51 7.48.51s5.63 0 7.48-.51a2.98 2.98 0 0 0 2.1-2.1c.51-1.85.51-4.81.51-4.81s0-2.96-.51-4.81Z" />
      <path d="m10 9 5 3-5 3z" />
    </svg>
  );
}
import { ImageUploadField } from '@/components/admin/ImageUploadField';

interface ChannelConfig {
  youtubeChannelUrl: string;
  youtubeChannelTitle: { es: string; en: string };
  youtubeChannelDescription: { es: string; en: string };
  youtubeChannelTags: string[];
  youtubeChannelAvatarUrl: string;
  youtubeChannelHeaderUrl: string;
}

const emptyConfig: ChannelConfig = {
  youtubeChannelUrl: '',
  youtubeChannelTitle: { es: '', en: '' },
  youtubeChannelDescription: { es: '', en: '' },
  youtubeChannelTags: [],
  youtubeChannelAvatarUrl: '',
  youtubeChannelHeaderUrl: '',
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="block text-xs leading-5 text-slate-500 dark:text-slate-400">{hint}</span>}
    </label>
  );
}

const inputClass = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#444] dark:bg-[#181818] dark:text-white';

export function YouTubeChannelEditor() {
  const [config, setConfig] = useState<ChannelConfig>(emptyConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [tagDraft, setTagDraft] = useState('');
  const [pendingUploads, setPendingUploads] = useState(0);

  useEffect(() => {
    fetch('/api/admin/youtube-channel', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudo cargar el canal.');
        setConfig({ ...emptyConfig, ...result.config });
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo cargar el canal.'))
      .finally(() => setLoading(false));
  }, []);

  function setLocalized(field: 'youtubeChannelTitle' | 'youtubeChannelDescription', locale: 'es' | 'en', value: string) {
    setSaved(false);
    setConfig((current) => ({ ...current, [field]: { ...current[field], [locale]: value } }));
  }

  function setImage(field: 'youtubeChannelAvatarUrl' | 'youtubeChannelHeaderUrl', value: string) {
    setConfig((current) => ({ ...current, [field]: value }));
    setSaved(false);
    setError('');
  }

  function addTag() {
    const tag = tagDraft.trim();
    if (!tag || config.youtubeChannelTags.length >= 8 || config.youtubeChannelTags.includes(tag)) return;
    setConfig((current) => ({ ...current, youtubeChannelTags: [...current.youtubeChannelTags, tag] }));
    setTagDraft('');
    setSaved(false);
  }

  function removeTag(tag: string) {
    setConfig((current) => ({ ...current, youtubeChannelTags: current.youtubeChannelTags.filter((item) => item !== tag) }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const response = await fetch('/api/admin/youtube-channel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar el canal.');
      setConfig({ ...emptyConfig, ...result.config });
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el canal.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">Contenido multimedia</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-[#272727] dark:text-red-300"><YouTubeBrandIcon className="h-6 w-6" /></span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Canal de YouTube</h1>
        </div>
        <p className="mt-3 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">Configura el avatar, el banner y los textos en español e inglés que se muestran en la portada y en la página de vídeos.</p>
      </header>

      {loading ? <div role="status" className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#272727]" /> : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-6">
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="identity-heading">
              <h2 id="identity-heading" className="text-xl font-bold">Identidad del canal</h2>
              <Field label="Dirección del canal" hint="Debe ser una dirección segura de YouTube. También se usa para el botón de suscripción.">
                <input className={inputClass} type="url" value={config.youtubeChannelUrl} onChange={(event) => { setConfig((current) => ({ ...current, youtubeChannelUrl: event.target.value })); setSaved(false); }} placeholder="https://www.youtube.com/@curileta" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <ImageUploadField
                  label="Avatar del canal"
                  hint="Imagen cuadrada del perfil de YouTube."
                  target="youtube-avatar"
                  value={config.youtubeChannelAvatarUrl}
                  onChange={(value) => setImage('youtubeChannelAvatarUrl', value)}
                  onUploadingChange={(uploading) => setPendingUploads((count) => Math.max(0, count + (uploading ? 1 : -1)))}
                />
                <ImageUploadField
                  label="Imagen de cabecera"
                  hint="Banner panorámico para la página de vídeos."
                  target="youtube-header"
                  value={config.youtubeChannelHeaderUrl}
                  onChange={(value) => setImage('youtubeChannelHeaderUrl', value)}
                  onUploadingChange={(uploading) => setPendingUploads((count) => Math.max(0, count + (uploading ? 1 : -1)))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(['es', 'en'] as const).map((language) => (
                  <Field key={`title-${language}`} label={`Título del canal · ${language === 'es' ? 'español' : 'inglés'}`}>
                    <input className={inputClass} maxLength={120} value={config.youtubeChannelTitle[language]} onChange={(event) => setLocalized('youtubeChannelTitle', language, event.target.value)} />
                  </Field>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(['es', 'en'] as const).map((language) => (
                  <Field key={`description-${language}`} label={`Subtítulo y descripción · ${language === 'es' ? 'español' : 'inglés'}`}>
                    <textarea className={`${inputClass} min-h-32 resize-y`} maxLength={600} value={config.youtubeChannelDescription[language]} onChange={(event) => setLocalized('youtubeChannelDescription', language, event.target.value)} />
                  </Field>
                ))}
              </div>
              <Field label="Etiquetas del canal" hint="Hasta ocho etiquetas. Se muestran junto al título y la descripción.">
                <div className="flex gap-2">
                  <input className={inputClass} maxLength={32} value={tagDraft} onChange={(event) => setTagDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addTag(); } }} placeholder="Aventuras" />
                  <button type="button" onClick={addTag} disabled={!tagDraft.trim() || config.youtubeChannelTags.length >= 8} className="min-h-11 shrink-0 rounded-lg border border-slate-300 px-4 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 disabled:opacity-50 dark:border-[#444] dark:hover:bg-[#272727]">Añadir</button>
                </div>
                <span className="mt-3 flex flex-wrap gap-2">
                  {config.youtubeChannelTags.map((tag) => <button key={tag} type="button" onClick={() => removeTag(tag)} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-red-100 hover:text-red-800 dark:bg-[#272727] dark:text-slate-200 dark:hover:bg-red-950" aria-label={`Quitar ${tag}`}>{tag} ×</button>)}
                </span>
              </Field>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-300">Los textos se guardan por idioma para mantener la localización de la web.</p>
              <button type="button" onClick={save} disabled={saving || loading || pendingUploads > 0} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
                <Save className="h-4 w-4" />{saving ? 'Guardando…' : saved ? 'Cambios guardados' : 'Guardar cambios'}
              </button>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f]">
            <h2 className="text-lg font-bold">Vista previa</h2>
            {config.youtubeChannelHeaderUrl && <ContentImage src={config.youtubeChannelHeaderUrl} alt="" className="mt-4 h-24 w-full rounded-lg object-cover" />}
            <div className="mt-4 flex items-center gap-3">
              {config.youtubeChannelAvatarUrl ? <ContentImage src={config.youtubeChannelAvatarUrl} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" /> : <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-600 text-white"><YouTubeBrandIcon className="h-7 w-7" /></span>}
              <p className="min-w-0 text-base font-bold">{config.youtubeChannelTitle.es || 'Título del canal'}</p>
            </div>
            <p className="mt-3 text-sm leading-5 text-slate-600 dark:text-slate-300">{config.youtubeChannelDescription.es || 'Aquí aparecerá la descripción del canal.'}</p>
            <div className="mt-4 flex flex-wrap gap-2">{config.youtubeChannelTags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs dark:bg-[#272727]">{tag}</span>)}</div>
          </aside>
        </div>
      )}

      {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200">{error}</p>}
    </div>
  );
}
