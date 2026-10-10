import Link from 'next/link';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/admin';

function MetricCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f]">
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
      <p className="mt-3 text-4xl font-bold tabular-nums">{value.toLocaleString('es-ES')}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{detail}</p>
    </article>
  );
}

export default async function AdminOverviewPage() {
  const identity = await requireAdmin();
  const canReadInbox = identity.role === 'owner' || identity.role === 'admin';
  const supabase = createSupabaseAdminClient();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const today = new Date().toISOString().slice(0, 10);
  const [newSubmissions, weeklySubmissions, activeForms, todayActivity] = await Promise.all([
    supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).gte('created_at', since),
    supabase.from('contact_forms').select('id', { count: 'exact', head: true }).eq('enabled', true),
    supabase.from('analytics_daily').select('event_name, event_count').eq('day', today),
  ]);
  const activeLeads = canReadInbox
    ? await supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).not('lead_stage', 'is', null)
    : { count: 0, error: null };
  const recent = canReadInbox
    ? await supabase.from('contact_submissions').select('id, name, email, category, status, created_at').order('created_at', { ascending: false }).limit(5)
    : { data: [], error: null };

  const queryError = newSubmissions.error || weeklySubmissions.error || activeForms.error || todayActivity.error || activeLeads.error || recent.error;
  const pageViewsToday = (todayActivity.data || []).filter((row) => row.event_name === 'page_view').reduce((total, row) => total + Number(row.event_count || 0), 0);
  const shareActionsToday = (todayActivity.data || []).filter((row) => row.event_name.startsWith('content_share_')).reduce((total, row) => total + Number(row.event_count || 0), 0);
  const videoVotesToday = (todayActivity.data || []).filter((row) => row.event_name === 'video_vote').reduce((total, row) => total + Number(row.event_count || 0), 0);
  const recentSubmissions = recent.data || [];
  const shortcuts = canReadInbox
    ? [
        { href: '/admin/contenidos', title: 'Contenidos', description: 'Edición, vídeos, eventos y secciones del sitio' },
        { href: '/admin/forms', title: 'Formularios', description: 'Campos y configuración de contacto' },
        { href: '/admin/consultas', title: 'Consultas', description: 'Mensajes recibidos y estado de atención' },
        { href: '/admin/leads', title: 'Oportunidades', description: 'Fases y notas de seguimiento' },
        { href: '/admin/estadisticas', title: 'Estadísticas', description: 'Actividad agregada del sitio' },
      ]
    : identity.role === 'editor'
      ? [{ href: '/admin/contenidos', title: 'Contenidos', description: 'Edición, vídeos, eventos y secciones del sitio' }]
      : [{ href: '/admin/estadisticas', title: 'Estadísticas', description: 'Actividad agregada del sitio' }];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Curileta</p>
        <h1 className="text-balance mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Resumen del sitio</h1>
        <p className="text-pretty mt-3 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">
          Consultas, formularios y actividad anónima del sitio en un solo lugar.
        </p>
      </header>

      {queryError ? (
        <section className="rounded-xl border border-red-300 bg-red-50 p-6 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200" role="alert">
          No se pudieron leer los datos del panel. Revisa la conexión de Supabase y aplica las migraciones.
        </section>
      ) : (
        <>
          <section aria-label="Indicadores principales" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Consultas nuevas" value={newSubmissions.count || 0} detail="Pendientes de revisar" />
            <MetricCard label="Consultas recientes" value={weeklySubmissions.count || 0} detail="Últimos siete días" />
            <MetricCard label="Formularios activos" value={activeForms.count || 0} detail="Disponibles para visitantes" />
            <MetricCard label="Visitas de hoy" value={pageViewsToday} detail="Recuento agregado por página" />
            <MetricCard label="Acciones para compartir hoy" value={shareActionsToday} detail="Inicio de una opción para compartir" />
            <MetricCard label="Votos en vídeos hoy" value={videoVotesToday} detail="Recuento agregado" />
            {canReadInbox && <MetricCard label="Oportunidades" value={activeLeads.count || 0} detail="En seguimiento" />}
          </section>

          <section aria-labelledby="shortcuts-heading" className="space-y-4">
            <div>
              <h2 id="shortcuts-heading" className="text-2xl font-bold">Gestión del sitio</h2>
              <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">Abre directamente cada herramienta del equipo.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {shortcuts.map((item) => (
                <Link key={item.href} href={item.href} className="group rounded-xl border border-slate-200 bg-white p-5 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#1f1f1f] dark:hover:bg-[#272727]">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-950 dark:text-white dark:group-hover:text-emerald-200">{item.title}</h3>
                  <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{item.description}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-emerald-800 dark:text-emerald-300">Abrir sección</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white dark:border-[#313131] dark:bg-[#1f1f1f]">
            {canReadInbox && <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-6 dark:border-[#313131]">
              <div>
                <h2 className="text-xl font-bold">Consultas recientes</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Los mensajes nuevos aparecen aquí al enviarse.</p>
              </div>
              <Link href="/admin/consultas" className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200 dark:hover:bg-[#272727]">
                Ver todas las consultas
              </Link>
            </div>}
            {!canReadInbox ? (
              <div className="px-6 py-10">
                <p className="text-pretty text-sm leading-5 text-slate-600 dark:text-slate-300">Tu acceso permite consultar indicadores agregados. Los mensajes personales están reservados a los roles de administración.</p>
              </div>
            ) : recentSubmissions.length ? (
              <ul className="divide-y divide-slate-200 dark:divide-[#313131]">
                {recentSubmissions.map((submission) => (
                  <li key={submission.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold">{submission.name}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{submission.email}{submission.category ? ` · ${submission.category}` : ''}</p>
                    </div>
                    <time dateTime={submission.created_at} className="text-sm text-slate-600 dark:text-slate-300">
                      {new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(submission.created_at))}
                    </time>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="text-base font-semibold">Todavía no hay consultas</p>
                <p className="text-pretty mx-auto mt-2 max-w-md text-sm leading-5 text-slate-600 dark:text-slate-300">Cuando alguien envíe un formulario, podrás revisar el mensaje y su estado aquí.</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
