import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/admin';

const requiredTables = [
  ['admin_profiles', 'Accesos administrativos'],
  ['managed_content_entries', 'Contenido editorial'],
  ['admin_audit_log', 'Historial de cambios'],
  ['analytics_daily', 'Estadísticas'],
  ['contact_forms', 'Formularios'],
  ['contact_submissions', 'Consultas'],
  ['site_events', 'Eventos y temas'],
  ['managed_destinations', 'Destinos en atlas'],
  ['author_pages', 'Perfiles de autoras'],
  ['gallery_items', 'Galería de imágenes'],
  ['gallery_categories', 'Categorías de galería'],
  ['youtube_content_overrides', 'Vídeos y música de YouTube'],
  ['youtube_channel_settings', 'Configuración del canal de YouTube'],
  ['book_catalog_settings', 'Catálogo de libros'],
  ['event_printables', 'PDF de eventos e imprimibles'],
  ['character_masks', 'Máscaras descargables'],
  ['home_upcoming_episode_characters', 'Personajes del próximo episodio'],
  ['image_frame_settings', 'Ajustes de encuadres de imagen'],
] as const;

function StatusPill({ ok }: { ok: boolean }) {
  return <span className={'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ' + (ok ? 'bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200' : 'bg-amber-100 text-amber-950 dark:bg-[#272727] dark:text-amber-200')}>{ok ? 'Disponible' : 'Revisar migración'}</span>;
}

export default async function AdminSystemPage() {
  const identity = await requireAdmin(['owner', 'admin']);
  const supabase = createSupabaseAdminClient();
  const [tableResults, bucketResult, auditResult] = await Promise.all([
    Promise.all(requiredTables.map(async ([table, label]) => {
      const { error } = await supabase.from(table).select('*', { head: true, count: 'exact' }).limit(1);
      return { table, label, ok: !error };
    })),
    supabase.storage.getBucket('curileta-site-media'),
    supabase.from('admin_audit_log').select('id, actor_user_id, action, resource_type, resource_id, created_at').order('created_at', { ascending: false }).limit(30),
  ]);
  const auditRows = auditResult.data || [];
  const actorIds = [...new Set(auditRows.map((row) => row.actor_user_id).filter((id): id is string => Boolean(id)))];
  const { data: profiles } = actorIds.length
    ? await supabase.from('admin_profiles').select('user_id, display_name').in('user_id', actorIds)
    : { data: [] };
  const names = new Map((profiles || []).map((profile) => [profile.user_id, profile.display_name]));
  const emailReady = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL);
  const retentionReady = Boolean(process.env.CRON_SECRET);
  const turnstileReady = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY);
  const healthy = tableResults.every((item) => item.ok) && !bucketResult.error;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Operación y seguridad</p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">Estado del sistema</h1>
        <p className="mt-3 max-w-3xl text-pretty text-base leading-6 text-slate-600 dark:text-slate-300">Comprueba la conexión del panel, las tablas que usan sus módulos, la biblioteca de medios y los cambios administrativos recientes.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2" aria-label="Estado general">
        <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f]"><div className="flex items-center justify-between gap-3"><h2 className="font-semibold">Base de datos y módulos</h2><StatusPill ok={healthy} /></div><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{tableResults.filter((item) => item.ok).length} de {tableResults.length} tablas comprobadas desde el servidor.</p></article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f]"><div className="flex items-center justify-between gap-3"><h2 className="font-semibold">Biblioteca de imágenes</h2><StatusPill ok={!bucketResult.error} /></div><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Bucket privado a nivel de API y entrega pública para los recursos ya guardados.</p></article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="module-status-heading">
        <h2 id="module-status-heading" className="text-xl font-bold">Conexiones de los módulos</h2>
        <ul className="mt-4 divide-y divide-slate-200 dark:divide-[#313131]">{tableResults.map((item) => <li key={item.table} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="text-sm font-semibold">{item.label}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.table}</p></div><StatusPill ok={item.ok} /></li>)}</ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="service-status-heading">
        <h2 id="service-status-heading" className="text-xl font-bold">Servicios externos</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Se muestra si las variables necesarias existen. Sus valores nunca se presentan en el panel.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">{[
          ['Avisos por correo', emailReady],
          ['Retención programada', retentionReady],
          ['Protección de formularios', turnstileReady],
        ].map(([label, ok]) => <li key={String(label)} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 p-3 text-sm font-medium dark:border-[#414141]"><span>{label}</span><StatusPill ok={Boolean(ok)} /></li>)}</ul>
      </section>

      <section className="space-y-4" aria-labelledby="audit-heading">
        <div><h2 id="audit-heading" className="text-xl font-bold">Actividad administrativa reciente</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Registro de altas, cambios, publicación, retirada y recuperación de fichas editoriales y permisos.</p></div>
        {auditResult.error ? <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-200">No se puede consultar el historial. Comprueba la migración de contenido editorial.</p>
          : auditRows.length ? <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-[#313131] dark:bg-[#1f1f1f]"><table className="w-full min-w-[42rem] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-[#313131]"><tr><th scope="col" className="px-4 py-3">Fecha</th><th scope="col" className="px-4 py-3">Persona</th><th scope="col" className="px-4 py-3">Acción</th><th scope="col" className="px-4 py-3">Registro</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-[#313131]">{auditRows.map((row) => <tr key={row.id}><td className="whitespace-nowrap px-4 py-3"><time dateTime={row.created_at}>{new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(row.created_at))}</time></td><td className="px-4 py-3">{names.get(row.actor_user_id) || (row.actor_user_id === identity.userId ? identity.displayName : 'Cuenta sin acceso activo')}</td><td className="px-4 py-3 capitalize">{row.action === 'create' ? 'Creó' : row.action === 'update' ? 'Editó' : row.action === 'publish' ? 'Publicó' : row.action === 'unpublish' ? 'Ocultó' : row.action === 'restore' ? 'Recuperó' : 'Retiró'}</td><td className="px-4 py-3"><span className="font-medium">{row.resource_type}</span><span className="ml-2 text-slate-500">{row.resource_id}</span></td></tr>)}</tbody></table></div>
          : <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-[#414141]"><p className="font-semibold">Aún no hay actividad registrada</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Las operaciones del nuevo gestor editorial aparecerán aquí.</p></div>}
      </section>
    </div>
  );
}
