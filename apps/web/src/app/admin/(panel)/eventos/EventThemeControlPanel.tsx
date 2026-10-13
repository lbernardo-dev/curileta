'use client';

import { useCallback, useEffect, useState } from 'react';
import { type EventPalette, type ManagedBaseTheme, type ManagedEvent, type ThemeControlState } from '@/lib/events';

const colors: Array<{ key: keyof EventPalette; label: string }> = [
  { key: 'accent', label: 'Acento principal' },
  { key: 'accentStrong', label: 'Acento de contraste' },
  { key: 'canvasLight', label: 'Fondo claro' },
  { key: 'surfaceLight', label: 'Superficie clara' },
  { key: 'textLight', label: 'Texto claro' },
  { key: 'canvasDark', label: 'Fondo oscuro' },
  { key: 'surfaceDark', label: 'Superficie oscura' },
  { key: 'textDark', label: 'Texto oscuro' },
];

const panelClass = 'rounded-xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f]';
const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-wait disabled:opacity-60';
const fieldClass = 'mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#181818] dark:text-white';

export function EventThemeControlPanel({ events }: { events: ManagedEvent[] }) {
  const [baseTheme, setBaseTheme] = useState<ManagedBaseTheme | null>(null);
  const [control, setControl] = useState<ThemeControlState>({ mode: 'automatic', eventId: null, activeEventId: null });
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingBase, setSavingBase] = useState(false);
  const [applying, setApplying] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadControl = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/events/base-theme', { cache: 'no-store' });
      const result = await response.json().catch(() => null) as { success?: boolean; baseTheme?: ManagedBaseTheme; control?: ThemeControlState; error?: string } | null;
      if (!response.ok || !result?.success || !result.baseTheme || !result.control) throw new Error(result?.error || 'No se pudo cargar el control de temas.');
      setBaseTheme(result.baseTheme);
      setControl(result.control);
      setSelectedEventId(result.control.eventId || events[0]?.id || '');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cargar el control de temas.');
    } finally {
      setLoading(false);
    }
  }, [events]);

  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/admin/events/base-theme', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const result = await response.json().catch(() => null) as { success?: boolean; baseTheme?: ManagedBaseTheme; control?: ThemeControlState; error?: string } | null;
        if (!response.ok || !result?.success || !result.baseTheme || !result.control) throw new Error(result?.error || 'No se pudo cargar el control de temas.');
        return result;
      })
      .then((result) => {
        setBaseTheme(result.baseTheme || null);
        if (result.control) {
          setControl(result.control);
          setSelectedEventId(result.control.eventId || events[0]?.id || '');
        }
      })
      .catch((cause: unknown) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'No se pudo cargar el control de temas.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [events]);

  async function apply(action: 'resume-schedule' | 'apply-base' | 'activate-event') {
    if (action === 'activate-event' && !selectedEventId) return;
    setApplying(action);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/events/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...(action === 'activate-event' ? { eventId: selectedEventId } : {}) }),
      });
      const result = await response.json().catch(() => null) as { success?: boolean; mode?: ThemeControlState['mode']; eventId?: string | null; error?: string } | null;
      if (!response.ok || !result?.success) throw new Error(result?.error || 'No se pudo aplicar el modo de temas.');
      setControl({ mode: result.mode || 'automatic', eventId: result.eventId || null, activeEventId: null });
      setNotice(action === 'apply-base' ? 'El sitio usa ahora el tema base. El aviso estacional queda oculto.'
        : action === 'resume-schedule' ? 'La programación automática está activa.'
          : 'El evento seleccionado está activo en la web.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo aplicar el modo de temas.');
    } finally {
      setApplying('');
    }
  }

  async function saveBase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!baseTheme || savingBase) return;
    setSavingBase(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/events/base-theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baseTheme),
      });
      const result = await response.json().catch(() => null) as { success?: boolean; error?: string } | null;
      if (!response.ok || !result?.success) throw new Error(result?.error || 'No se pudo guardar el tema base.');
      setLoading(true);
      setError('');
      await loadControl();
      setNotice('La apariencia del tema base se ha guardado.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el tema base.');
    } finally {
      setSavingBase(false);
    }
  }

  function updatePalette(key: keyof EventPalette, color: string) {
    setBaseTheme((value) => value ? { ...value, palette: { ...value.palette, [key]: color } } : value);
  }

  return (
    <section aria-labelledby="event-theme-control-heading" className={panelClass}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Control del sitio</p>
          <h2 id="event-theme-control-heading" className="mt-2 text-xl font-bold">Tema activo y programación</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">Elige un evento, deja que el calendario lo active o vuelve al aspecto habitual. El panel de administración conserva siempre su apariencia propia.</p>
        </div>
        {!loading && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-[#272727] dark:text-slate-200">
          {control.mode === 'base' ? 'Tema base' : control.mode === 'event' ? 'Evento fijado' : 'Programación automática'}
        </span>}
      </div>

      {error && <p role="alert" className="mt-4 rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-[#272727] dark:text-rose-200">{error}</p>}
      {notice && <p role="status" className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-[#181818] dark:text-emerald-200">{notice}</p>}

      {loading ? <div className="mt-5 h-24 animate-pulse rounded-lg bg-slate-100 dark:bg-[#272727]" aria-label="Cargando control de temas" /> : <>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={() => void apply('resume-schedule')} disabled={Boolean(applying)} className={`${buttonClass} border border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-[#414141] dark:text-slate-100 dark:hover:bg-[#272727]`}>
            {applying === 'resume-schedule' ? 'Aplicando… ' : ''}Usar programación automática
          </button>
          <button type="button" onClick={() => void apply('apply-base')} disabled={Boolean(applying)} className={`${buttonClass} bg-emerald-800 text-white hover:bg-emerald-700`}>
            {applying === 'apply-base' ? 'Aplicando… ' : ''}Aplicar tema base
          </button>
          <label className="flex min-w-56 flex-1 items-center gap-2 text-sm font-semibold sm:max-w-md">
            <span className="sr-only">Evento para activar</span>
            <select value={selectedEventId} onChange={(event) => setSelectedEventId(event.target.value)} className={fieldClass} aria-label="Evento para activar">
              <option value="">Elige un tema</option>
              {events.map((item) => <option key={item.id} value={item.id}>{item.name.es}</option>)}
            </select>
            <button type="button" onClick={() => void apply('activate-event')} disabled={!selectedEventId || Boolean(applying)} className={`${buttonClass} shrink-0 border border-emerald-700 text-emerald-900 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-[#183d2c]`}>
              {applying === 'activate-event' ? 'Activando… ' : ''}Activar
            </button>
          </label>
        </div>

        {baseTheme && <details className="mt-6 rounded-lg border border-slate-200 dark:border-[#313131]">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">Configurar apariencia del tema base</summary>
          <form onSubmit={(event) => void saveBase(event)} className="space-y-5 border-t border-slate-200 p-4 dark:border-[#313131]">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Estas preferencias se aplican cuando seleccionas el tema base. No muestran el aviso estacional.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {(['es', 'en'] as const).map((locale) => <label key={locale} className="block text-sm font-semibold">{locale === 'es' ? 'Nombre en español' : 'Nombre en inglés'}
                <input value={baseTheme.name[locale]} maxLength={120} onChange={(event) => setBaseTheme((value) => value ? { ...value, name: { ...value.name, [locale]: event.target.value } } : value)} className={fieldClass} />
              </label>)}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {colors.map(({ key, label }) => <label key={key} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold dark:border-[#313131]">
                <input type="color" aria-label={label} value={baseTheme.palette[key]} onChange={(event) => updatePalette(key, event.target.value)} className="h-10 w-12 cursor-pointer rounded border-0 bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-emerald-600" />
                <span><span className="block">{label}</span><span className="font-mono text-xs text-slate-500">{baseTheme.palette[key]}</span></span>
              </label>)}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-lg px-3 py-2" style={{ color: baseTheme.palette.textLight, backgroundColor: baseTheme.palette.canvasLight }}>Vista clara</span>
                <span className="rounded-lg px-3 py-2" style={{ color: baseTheme.palette.textDark, backgroundColor: baseTheme.palette.canvasDark }}>Vista oscura</span>
                <span className="rounded-lg px-3 py-2 text-white" style={{ backgroundColor: baseTheme.palette.accentStrong }}>Acento</span>
              </div>
              <button type="submit" disabled={savingBase} className={`${buttonClass} bg-emerald-800 text-white hover:bg-emerald-700`}>
                {savingBase ? 'Guardando… ' : ''}Guardar tema base
              </button>
            </div>
          </form>
        </details>}
      </>}
    </section>
  );
}
