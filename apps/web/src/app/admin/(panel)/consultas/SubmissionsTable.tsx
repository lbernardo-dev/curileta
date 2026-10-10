'use client';

import { useEffect, useState } from 'react';

interface Submission {
  id: string;
  form_slug: string;
  locale: string;
  name: string;
  email: string;
  company: string | null;
  category: string | null;
  message: string;
  answers: Record<string, string | boolean>;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  email_status: 'pending' | 'sent' | 'failed';
  created_at: string;
  lead_stage: 'new' | 'contacted' | 'qualified' | 'won' | 'lost' | null;
}

const statusLabels: Record<Submission['status'], string> = {
  new: 'Nueva',
  in_progress: 'En curso',
  resolved: 'Resuelta',
  archived: 'Archivada',
};

export function SubmissionsTable() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState('');
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const suffix = status ? `?status=${encodeURIComponent(status)}` : '';
    fetch(`/api/admin/submissions${suffix}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudieron cargar las consultas.');
        setSubmissions(result.data as Submission[]);
        setError('');
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'No se pudieron cargar las consultas.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [status]);

  async function updateStatus(id: string, nextStatus: Submission['status']) {
    setUpdatingId(id);
    setError('');
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo actualizar el estado.');
      setSubmissions((current) => current.map((item) => item.id === id ? { ...item, status: nextStatus } : item));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo actualizar el estado.');
    } finally {
      setUpdatingId('');
    }
  }

  async function saveAsLead(id: string) {
    setUpdatingId(id);
    setError('');
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadStage: 'new' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar la oportunidad.');
      setSubmissions((current) => current.map((item) => item.id === id ? { ...item, lead_stage: 'new' } : item));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la oportunidad.');
    } finally {
      setUpdatingId('');
    }
  }

  async function deleteSubmission(id: string) {
    setDeletingId(id);
    setError('');
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo eliminar el mensaje.');
      setSubmissions((current) => current.filter((item) => item.id !== id));
      setConfirmingDeleteId('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo eliminar el mensaje.');
    } finally {
      setDeletingId('');
    }
  }

  const filteredSubmissions = submissions.filter((item) => {
    const normalizedQuery = query.trim().toLocaleLowerCase('es');
    return !normalizedQuery || [item.name, item.email, item.company || '', item.category || '', item.message]
      .some((value) => value.toLocaleLowerCase('es').includes(normalizedQuery));
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Bandeja de entrada</p>
        <h1 className="text-balance mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Consultas</h1>
        <p className="text-pretty mt-3 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">Revisa los mensajes enviados por personas adultas y actualiza su estado.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <label className="block space-y-2 text-sm font-semibold">
          <span>Buscar en los mensajes</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#1f1f1f]" />
        </label>
        <label className="block space-y-2 text-sm font-semibold">
          <span>Filtrar por estado</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#1f1f1f]">
            <option value="">Todos</option>
            <option value="new">Nuevas</option>
            <option value="in_progress">En curso</option>
            <option value="resolved">Resueltas</option>
            <option value="archived">Archivadas</option>
          </select>
        </label>
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200">{error}</p>}
      {loading ? (
        <div className="space-y-4" aria-label="Cargando consultas"><div className="h-36 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" /><div className="h-36 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" /></div>
      ) : filteredSubmissions.length ? (
        <div className="space-y-4">
          {filteredSubmissions.map((item) => (
            <article key={item.id} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold">{item.name}</h2>
                  <a href={`mailto:${item.email}`} className="mt-1 inline-block break-all text-sm text-emerald-800 underline decoration-emerald-600 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200">{item.email}</a>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{[item.company, item.category, item.locale.toUpperCase()].filter(Boolean).join(' · ')}</p>
                </div>
                <label className="block space-y-2 text-sm font-semibold">
                  <span>Estado</span>
                  <select value={item.status} disabled={updatingId === item.id} onChange={(event) => updateStatus(item.id, event.target.value as Submission['status'])} className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:opacity-60 dark:border-[#313131] dark:bg-[#181818]">
                    {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              </div>
              <p className="whitespace-pre-wrap break-words text-base leading-6">{item.message}</p>
              {item.company && <p className="text-sm text-slate-600 dark:text-slate-300">Organización: {item.company}</p>}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 dark:border-[#313131] dark:text-slate-300">
                <time dateTime={item.created_at}>{new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.created_at))}</time>
                <span>Correo: {item.email_status === 'sent' ? 'enviado' : item.email_status === 'failed' ? 'fallido' : 'pendiente'}</span>
              </div>
              {Object.keys(item.answers || {}).some((key) => !['name', 'email', 'company', 'category', 'message', 'adultConsent', 'privacyConsent'].includes(key)) && (
                <details className="rounded-lg bg-slate-50 p-4 dark:bg-[#181818]">
                  <summary className="cursor-pointer rounded-sm text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">Más respuestas</summary>
                  <dl className="mt-3 space-y-2 text-sm">
                    {Object.entries(item.answers).filter(([key]) => !['name', 'email', 'company', 'category', 'message', 'adultConsent', 'privacyConsent'].includes(key)).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-1 gap-1 sm:grid-cols-[12rem_minmax(0,1fr)]">
                        <dt className="font-semibold">{key}</dt>
                        <dd className="break-words text-slate-700 dark:text-slate-200">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              )}
              <div className="flex flex-wrap items-center justify-end gap-3">
                {item.lead_stage ? (
                  <a href="/admin/leads" className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200 dark:hover:bg-[#272727]">En seguimiento como oportunidad</a>
                ) : (
                  <button type="button" disabled={updatingId === item.id} onClick={() => saveAsLead(item.id)} className="rounded-lg bg-emerald-900 px-3 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">{updatingId === item.id ? 'Guardando…' : 'Guardar como oportunidad'}</button>
                )}
                {confirmingDeleteId === item.id ? (
                  <div className="flex flex-wrap items-center gap-3 rounded-lg bg-red-50 p-4 text-sm dark:bg-[#272727]">
                    <span>{item.lead_stage ? 'Se eliminarán el mensaje y las notas de seguimiento de la oportunidad.' : 'Se eliminarán el mensaje y sus respuestas guardadas.'}</span>
                    <button type="button" onClick={() => setConfirmingDeleteId('')} className="rounded-lg px-3 py-2 font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-[#313131]">Cancelar</button>
                    <button type="button" onClick={() => deleteSubmission(item.id)} disabled={deletingId === item.id} className="rounded-lg bg-red-800 px-3 py-2 font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700">{deletingId === item.id ? 'Eliminando…' : 'Confirmar eliminación'}</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmingDeleteId(item.id)} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-800 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-red-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 dark:text-red-200 dark:hover:bg-[#272727]">Eliminar mensaje</button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-[#313131] dark:bg-[#1f1f1f]">
          <h2 className="text-xl font-bold">No hay consultas para mostrar</h2>
          <p className="text-pretty mx-auto mt-2 max-w-md text-sm leading-5 text-slate-600 dark:text-slate-300">Prueba otro filtro o vuelve cuando llegue un nuevo mensaje.</p>
        </section>
      )}
    </div>
  );
}
