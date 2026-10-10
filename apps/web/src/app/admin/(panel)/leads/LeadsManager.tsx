'use client';

import { useEffect, useState } from 'react';

type LeadStage = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

interface Lead {
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
  created_at: string;
  resolved_at: string | null;
  lead_stage: LeadStage;
  lead_notes: string;
}

const stageLabels: Record<LeadStage, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Cualificado',
  won: 'Convertido',
  lost: 'No interesado',
};

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [removingId, setRemovingId] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/leads', { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudieron cargar las oportunidades.');
        const rows = result.data as Lead[];
        setLeads(rows);
        setNotes(Object.fromEntries(rows.map((lead) => [lead.id, lead.lead_notes || ''])));
        setError('');
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'No se pudieron cargar las oportunidades.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  async function updateLead(id: string, patch: { leadStage?: LeadStage | null; leadNotes?: string }) {
    setUpdatingId(id);
    setError('');
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar la oportunidad.');
      if (patch.leadStage === null) {
        setLeads((current) => current.filter((lead) => lead.id !== id));
        return;
      }
      setLeads((current) => current.map((lead) => lead.id === id ? {
        ...lead,
        ...(patch.leadStage ? { lead_stage: patch.leadStage } : {}),
        ...(patch.leadNotes !== undefined ? { lead_notes: patch.leadNotes } : {}),
      } : lead));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la oportunidad.');
    } finally {
      setUpdatingId('');
      setRemovingId('');
    }
  }

  const normalizedQuery = query.trim().toLocaleLowerCase('es');
  const filteredLeads = leads.filter((lead) => !normalizedQuery || [lead.name, lead.email, lead.company || '', lead.category || '', lead.message]
    .some((value) => value.toLocaleLowerCase('es').includes(normalizedQuery)));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Seguimiento</p>
        <h1 className="text-balance mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Oportunidades</h1>
        <p className="text-pretty mt-3 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">Organiza las oportunidades recibidas y guarda notas para que el equipo pueda continuar cada conversación.</p>
      </header>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-5 text-emerald-950 dark:border-[#313131] dark:bg-[#1f1f1f] dark:text-emerald-100">
        <h2 className="font-semibold">Conservación de datos</h2>
        <p className="mt-2">Las consultas marcadas como oportunidad quedan fuera de la limpieza automática. Al quitarlas de esta lista, una consulta cerrada podrá eliminarse cuando cumpla 30 días desde su cierre.</p>
      </section>

      <label className="block max-w-xl space-y-2 text-sm font-semibold">
        <span>Buscar oportunidades</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#1f1f1f]" />
      </label>

      {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200">{error}</p>}
      {loading ? (
        <div className="space-y-4" aria-label="Cargando oportunidades"><div className="h-36 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" /><div className="h-36 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" /></div>
      ) : filteredLeads.length ? (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <article key={lead.id} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold">{lead.name}</h2>
                  <a href={`mailto:${lead.email}`} className="mt-1 inline-block break-all text-sm text-emerald-800 underline decoration-emerald-600 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200">{lead.email}</a>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{[lead.company, lead.category, lead.locale.toUpperCase()].filter(Boolean).join(' · ')}</p>
                </div>
                <label className="block space-y-2 text-sm font-semibold">
                  <span>Fase</span>
                  <select value={lead.lead_stage} disabled={updatingId === lead.id} onChange={(event) => updateLead(lead.id, { leadStage: event.target.value as LeadStage })} className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:opacity-60 dark:border-[#313131] dark:bg-[#181818]">
                    {Object.entries(stageLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              </div>
              <p className="whitespace-pre-wrap break-words text-base leading-6">{lead.message}</p>
              <label className="block space-y-2 text-sm font-semibold">
                <span>Notas internas</span>
                <textarea value={notes[lead.id] || ''} maxLength={4000} rows={3} onChange={(event) => setNotes((current) => ({ ...current, [lead.id]: event.target.value }))} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#181818]" />
              </label>
              {Object.keys(lead.answers || {}).some((key) => !['name', 'email', 'company', 'category', 'message', 'adultConsent', 'privacyConsent'].includes(key)) && (
                <details className="rounded-lg bg-slate-50 p-4 dark:bg-[#181818]">
                  <summary className="cursor-pointer rounded-sm text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">Más respuestas</summary>
                  <dl className="mt-3 space-y-2 text-sm">
                    {Object.entries(lead.answers).filter(([key]) => !['name', 'email', 'company', 'category', 'message', 'adultConsent', 'privacyConsent'].includes(key)).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-1 gap-1 sm:grid-cols-[12rem_minmax(0,1fr)]">
                        <dt className="font-semibold">{key}</dt>
                        <dd className="break-words text-slate-700 dark:text-slate-200">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 dark:border-[#313131] dark:text-slate-300">
                <time dateTime={lead.created_at}>{new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(lead.created_at))}</time>
                <span>{lead.status === 'resolved' || lead.status === 'archived' ? 'Consulta cerrada' : 'Consulta abierta'}</span>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <button type="button" disabled={updatingId === lead.id} onClick={() => updateLead(lead.id, { leadNotes: notes[lead.id] || '' })} className="rounded-lg bg-emerald-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">{updatingId === lead.id ? 'Guardando…' : 'Guardar notas'}</button>
                {removingId === lead.id ? (
                  <div className="flex flex-wrap items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm dark:bg-[#272727]">
                    <span>Dejará la lista de oportunidades. La consulta y sus notas seguirán guardadas.</span>
                    <button type="button" onClick={() => setRemovingId('')} className="rounded-lg px-3 py-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">Cancelar</button>
                    <button type="button" disabled={updatingId === lead.id} onClick={() => updateLead(lead.id, { leadStage: null })} className="rounded-lg bg-amber-800 px-3 py-2 font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-amber-700 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">Confirmar</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setRemovingId(lead.id)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-200 dark:hover:bg-[#272727]">Quitar de oportunidades</button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-[#313131] dark:bg-[#1f1f1f]">
          <h2 className="text-xl font-bold">Todavía no hay oportunidades guardadas</h2>
          <p className="text-pretty mx-auto mt-2 max-w-md text-sm leading-5 text-slate-600 dark:text-slate-300">Desde la bandeja de consultas puedes guardar aquí las oportunidades que quieras seguir.</p>
        </section>
      )}
    </div>
  );
}
