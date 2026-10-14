'use client';

import { useCallback, useEffect, useState } from 'react';

type Role = 'owner' | 'admin' | 'editor' | 'analyst';
type TeamMember = {
  userId: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  emailConfirmed: boolean;
  lastSignInAt: string | null;
};

async function fetchAdminTeam() {
  const response = await fetch('/api/admin/team', { cache: 'no-store' });
  const result = await response.json().catch(() => null) as { team?: TeamMember[]; error?: string } | null;
  if (!response.ok || !result || !Array.isArray(result.team)) throw new Error(result?.error || 'No se pudo cargar el equipo.');
  return result.team;
}

const roleLabels: Record<Role, string> = {
  owner: 'Propietario',
  admin: 'Administración',
  editor: 'Edición',
  analyst: 'Análisis',
};
const inputClass = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-hidden transition-all duration-700 ease-fluid focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#181818] dark:text-white';
const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-700 ease-fluid active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-wait disabled:opacity-60';

export default function TeamManager() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<Role>('editor');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [revokeId, setRevokeId] = useState('');

  const refresh = useCallback(async () => {
    setTeam(await fetchAdminTeam());
  }, []);

  useEffect(() => {
    void fetchAdminTeam().then((result) => setTeam(result))
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo cargar el equipo.'))
      .finally(() => setLoading(false));
  }, []);

  async function submit(path: string, method: 'POST' | 'PATCH' | 'DELETE', payload: Record<string, unknown>, key: string) {
    setSaving(key);
    setError('');
    setNotice('');
    try {
      const response = await fetch(path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || 'No se pudo guardar el cambio.');
      await refresh();
      setNotice('Equipo actualizado.');
      setRevokeId('');
      if (method === 'POST') { setEmail(''); setDisplayName(''); setRole('editor'); }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el cambio.');
    } finally {
      setSaving('');
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Control de acceso</p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">Equipo administrador</h1>
        <p className="mt-3 max-w-3xl text-pretty text-base leading-6 text-slate-600 dark:text-slate-300">Asigna permisos por función y revoca el acceso al panel. La cuenta debe existir ya en Supabase Auth; este módulo no envía invitaciones.</p>
      </header>

      {error && <p role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-[#272727] dark:text-rose-200">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-[#272727] dark:text-emerald-200">{notice}</p>}

      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="team-add-heading">
        <h2 id="team-add-heading" className="text-xl font-bold">Añadir una cuenta existente</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={(event) => {
          event.preventDefault();
          void submit('/api/admin/team', 'POST', { email, displayName, role }, 'add');
        }}>
          <label className="block space-y-1.5"><span className="text-sm font-semibold">Correo de Supabase Auth</span><input className={inputClass} type="email" autoComplete="email" required maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label className="block space-y-1.5"><span className="text-sm font-semibold">Nombre visible</span><input className={inputClass} required maxLength={120} value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>
          <label className="block space-y-1.5"><span className="text-sm font-semibold">Rol</span><select className={inputClass} value={role} onChange={(event) => setRole(event.target.value as Role)}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <div className="flex items-end"><button type="submit" className={buttonClass + ' bg-emerald-700 px-4 text-white hover:bg-emerald-800'} disabled={Boolean(saving)}>{saving === 'add' ? 'Guardando…' : 'Añadir al equipo'}</button></div>
        </form>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Los cambios de rol quedan registrados en el historial de administración. Siempre debe quedar al menos una persona propietaria.</p>
      </section>

      <section className="space-y-4" aria-labelledby="team-list-heading">
        <div className="flex items-baseline justify-between gap-3"><h2 id="team-list-heading" className="text-xl font-bold">Accesos activos</h2><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900 dark:bg-[#272727] dark:text-emerald-200">{team.length} cuentas</span></div>
        {loading ? <div className="space-y-3" aria-label="Cargando equipo"><div className="h-28 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" /><div className="h-28 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" /></div>
          : team.length ? <ul className="grid gap-4 lg:grid-cols-2">{team.map((member) => <li key={member.userId} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f]">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{member.displayName}</p><p className="mt-1 break-all text-sm text-slate-600 dark:text-slate-300">{member.email || 'Cuenta sin correo visible'}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-[#272727]">{roleLabels[member.role]}</span></div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{member.emailConfirmed ? 'Correo confirmado' : 'Correo pendiente de confirmar'}{member.lastSignInAt ? ` · Último acceso ${new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(member.lastSignInAt))}` : ' · Aún no ha iniciado sesión'}</p>
            <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void submit('/api/admin/team', 'PATCH', { userId: member.userId, displayName: form.get('displayName'), role: form.get('role') }, member.userId);
            }}>
              <input className={inputClass} name="displayName" aria-label={`Nombre de ${member.email}`} defaultValue={member.displayName} maxLength={120} required />
              <select className={inputClass} name="role" aria-label={`Rol de ${member.email}`} defaultValue={member.role}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
              <button type="submit" className={buttonClass + ' border border-slate-300 dark:border-[#414141]'} disabled={Boolean(saving)}>{saving === member.userId ? 'Guardando…' : 'Guardar'}</button>
            </form>
            <div className="mt-3 flex justify-end">{revokeId === member.userId ? <div className="flex gap-2"><button type="button" className={buttonClass + ' text-rose-700 dark:text-rose-300'} onClick={() => void submit('/api/admin/team', 'DELETE', { userId: member.userId }, member.userId)} disabled={Boolean(saving)}>Confirmar revocación</button><button type="button" className={buttonClass} onClick={() => setRevokeId('')}>Cancelar</button></div> : <button type="button" className={buttonClass + ' min-h-8 text-rose-700 dark:text-rose-300'} onClick={() => setRevokeId(member.userId)}>Revocar acceso</button>}</div>
          </li>)}</ul>
          : <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-[#414141]"><p className="font-semibold">No hay cuentas con acceso</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Añade una cuenta existente para empezar a configurar el equipo.</p></div>}
      </section>
    </div>
  );
}
