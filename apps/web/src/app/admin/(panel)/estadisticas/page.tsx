'use client';

import { useEffect, useMemo, useState } from 'react';
import { CharacterFavoriteStats } from './CharacterFavoriteStats';
import { VisitsTrendChart, type VisitDay } from './VisitsTrendChart';

interface AnalyticsRow {
  event_name: string;
  path: string;
  locale: string;
  event_count: number;
}

type Grouping = 'day' | 'week' | 'month' | 'year';

const periodLabels: Record<string, string> = {
  '7': 'los últimos siete días',
  '30': 'los últimos treinta días',
  '90': 'los últimos noventa días',
  '365': 'los últimos doce meses',
  '1825': 'los últimos cinco años',
  all: 'todo el histórico',
};

export default function AdminAnalyticsPage() {
  const [rows, setRows] = useState<AnalyticsRow[]>([]);
  const [pageViewsByDay, setPageViewsByDay] = useState<VisitDay[]>([]);
  const [range, setRange] = useState('30');
  const [grouping, setGrouping] = useState<Grouping>('day');
  const [totalVisits, setTotalVisits] = useState(0);
  const [chartStart, setChartStart] = useState<string | null>(null);
  const [chartEnd, setChartEnd] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/admin/analytics?range=${range}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudieron cargar las estadísticas.');
        setRows(result.data as AnalyticsRow[]);
        setPageViewsByDay(result.pageViewsByDay as VisitDay[]);
        setTotalVisits(Number(result.totalVisits) || 0);
        setChartStart(result.range === 'all' ? result.earliestPageView : result.since);
        setChartEnd(result.today);
        setError('');
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'No se pudieron cargar las estadísticas.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [range]);

  const rangeDays = range === 'all' ? null : Number(range);
  const favoriteDays = rangeDays && rangeDays <= 90 ? rangeDays : 90;
  const periodLabel = periodLabels[range];

  const pageViews = useMemo(() => rows.filter((row) => row.event_name === 'page_view').reduce((total, row) => total + Number(row.event_count), 0), [rows]);
  const contactSubmissions = useMemo(() => rows.filter((row) => row.event_name === 'contact_submit').reduce((total, row) => total + Number(row.event_count), 0), [rows]);
  const shareRows = useMemo(() => rows.filter((row) => row.event_name.startsWith('content_share_')), [rows]);
  const sharesTotal = useMemo(() => shareRows.reduce((total, row) => total + Number(row.event_count), 0), [shareRows]);
  const voteRows = useMemo(() => rows.filter((row) => row.event_name === 'video_vote'), [rows]);
  const votesTotal = useMemo(() => voteRows.reduce((total, row) => total + Number(row.event_count), 0), [voteRows]);
  const sharesByChannel = useMemo(() => {
    const counts = new Map<string, number>();
    shareRows.forEach((row) => {
      const channel = row.event_name.replace('content_share_', '');
      counts.set(channel, (counts.get(channel) || 0) + Number(row.event_count));
    });
    return [...counts.entries()].sort((left, right) => right[1] - left[1]);
  }, [shareRows]);
  const mostSharedContent = useMemo(() => {
    const counts = new Map<string, number>();
    shareRows.forEach((row) => counts.set(row.path, (counts.get(row.path) || 0) + Number(row.event_count)));
    return [...counts.entries()].sort((left, right) => right[1] - left[1]).slice(0, 10);
  }, [shareRows]);
  const votesByVideo = useMemo(() => {
    const counts = new Map<string, number>();
    voteRows.forEach((row) => counts.set(row.path, (counts.get(row.path) || 0) + Number(row.event_count)));
    return [...counts.entries()].sort((left, right) => right[1] - left[1]).slice(0, 10);
  }, [voteRows]);
  const byPage = useMemo(() => {
    const counts = new Map<string, number>();
    rows.filter((row) => row.event_name === 'page_view').forEach((row) => counts.set(row.path, (counts.get(row.path) || 0) + Number(row.event_count)));
    return [...counts.entries()].sort((left, right) => right[1] - left[1]).slice(0, 12);
  }, [rows]);
  const byDay = useMemo(() => pageViewsByDay.slice().sort((left, right) => right.day.localeCompare(left.day)).slice(0, 14), [pageViewsByDay]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Actividad</p>
          <h1 className="text-balance mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Estadísticas</h1>
          <p className="text-pretty mt-3 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">Visitas y actividad del sitio agrupadas por periodos, sin crear perfiles de visitante.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="block space-y-2 text-sm font-semibold">
            <span>Periodo</span>
            <select value={range} onChange={(event) => setRange(event.target.value)} className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#1f1f1f]">
              <option value="7">Siete días</option>
              <option value="30">Treinta días</option>
              <option value="90">Noventa días</option>
              <option value="365">Doce meses</option>
              <option value="1825">Cinco años</option>
              <option value="all">Todo el histórico</option>
            </select>
          </label>
          <label className="block space-y-2 text-sm font-semibold">
            <span>Agrupar por</span>
            <select value={grouping} onChange={(event) => setGrouping(event.target.value as Grouping)} className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#1f1f1f]">
              <option value="day">Día</option>
              <option value="week">Semana</option>
              <option value="month">Mes</option>
              <option value="year">Año</option>
            </select>
          </label>
        </div>
      </header>

      {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200">{error}</p>}
      {loading ? (
        <div role="status" aria-label="Cargando estadísticas" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" />)}</div>
          <div className="h-80 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Totales del periodo">
            <article className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f]">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Visitas totales</p>
              <p className="mt-3 text-4xl font-bold tabular-nums">{totalVisits.toLocaleString('es-ES')}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Desde que empezó el registro</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f]">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Vistas del periodo</p>
              <p className="mt-3 text-4xl font-bold tabular-nums">{pageViews.toLocaleString('es-ES')}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Durante {periodLabel}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f]">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Formularios enviados</p>
              <p className="mt-3 text-4xl font-bold tabular-nums">{contactSubmissions.toLocaleString('es-ES')}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Mensajes guardados en la base de datos</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f]">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Acciones para compartir</p>
              <p className="mt-3 text-4xl font-bold tabular-nums">{sharesTotal.toLocaleString('es-ES')}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Acciones registradas; los envíos externos no se confirman</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f]">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Votos en vídeos</p>
              <p className="mt-3 text-4xl font-bold tabular-nums">{votesTotal.toLocaleString('es-ES')}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Recuento agregado en el periodo</p>
            </article>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white dark:border-[#313131] dark:bg-[#1f1f1f]" aria-labelledby="visits-trend-heading">
            <div className="border-b border-slate-200 p-6 dark:border-[#313131]">
              <h2 id="visits-trend-heading" className="text-xl font-bold">Evolución de visitas</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Vistas de página durante {periodLabel}, agrupadas por {groupingLabel(grouping)}.</p>
            </div>
            <VisitsTrendChart data={pageViewsByDay} start={chartStart} end={chartEnd} grouping={grouping} />
          </section>

          <CharacterFavoriteStats days={favoriteDays} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-white dark:border-[#313131] dark:bg-[#1f1f1f]">
              <div className="border-b border-slate-200 p-6 dark:border-[#313131]">
                <h2 className="text-xl font-bold">Acciones para compartir por canal</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Las opciones externas cuentan el clic; compartir desde el dispositivo y copiar enlace se registran cuando el navegador confirma la acción. No se confirma el envío de mensajes externos.</p>
              </div>
              {sharesByChannel.length ? (
                <ul className="divide-y divide-slate-200 dark:divide-[#313131]">
                  {sharesByChannel.map(([channel, count]) => (
                    <li key={channel} className="flex items-center justify-between gap-4 px-6 py-4 text-sm">
                      <span>{shareChannelLabel(channel)}</span>
                      <span className="font-semibold tabular-nums">{count.toLocaleString('es-ES')}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-6 py-8 text-sm text-slate-600 dark:text-slate-300">Cuando alguien elija una opción para compartir, aparecerá aquí el canal elegido.</p>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white dark:border-[#313131] dark:bg-[#1f1f1f]">
              <div className="border-b border-slate-200 p-6 dark:border-[#313131]">
                <h2 className="text-xl font-bold">Contenido con más acciones</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">El panel agrupa las acciones registradas por contenido e idioma.</p>
              </div>
              {mostSharedContent.length ? (
                <ol className="divide-y divide-slate-200 dark:divide-[#313131]">
                  {mostSharedContent.map(([path, count]) => (
                    <li key={path} className="flex items-center justify-between gap-4 px-6 py-4 text-sm">
                      <code className="break-all font-mono text-slate-700 dark:text-slate-200">{path}</code>
                      <span className="shrink-0 font-semibold tabular-nums">{count.toLocaleString('es-ES')}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="px-6 py-8 text-sm text-slate-600 dark:text-slate-300">Aún no hay acciones para compartir en este periodo.</p>
              )}
            </section>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white dark:border-[#313131] dark:bg-[#1f1f1f]">
            <div className="border-b border-slate-200 p-6 dark:border-[#313131]">
              <h2 className="text-xl font-bold">Votos por vídeo</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Solo aparecen vídeos cuya votación está activada en el sistema editorial Sanity.</p>
            </div>
            {votesByVideo.length ? (
              <ol className="divide-y divide-slate-200 dark:divide-[#313131]">
                {votesByVideo.map(([path, count]) => (
                  <li key={path} className="flex items-center justify-between gap-4 px-6 py-4 text-sm">
                    <code className="break-all font-mono text-slate-700 dark:text-slate-200">{path}</code>
                    <span className="shrink-0 font-semibold tabular-nums">{count.toLocaleString('es-ES')}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="px-6 py-8 text-sm text-slate-600 dark:text-slate-300">Aún no hay votos en este periodo.</p>
            )}
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-white dark:border-[#313131] dark:bg-[#1f1f1f]">
              <div className="border-b border-slate-200 p-6 dark:border-[#313131]">
                <h2 className="text-xl font-bold">Páginas más visitadas</h2>
              </div>
              {byPage.length ? (
                <ol className="divide-y divide-slate-200 dark:divide-[#313131]">
                  {byPage.map(([path, count]) => (
                    <li key={path} className="flex items-center justify-between gap-4 px-6 py-4 text-sm">
                      <code className="break-all font-mono text-slate-700 dark:text-slate-200">{path}</code>
                      <span className="shrink-0 font-semibold tabular-nums">{count.toLocaleString('es-ES')}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="px-6 py-8 text-sm text-slate-600 dark:text-slate-300">Todavía no hay visitas registradas.</p>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white dark:border-[#313131] dark:bg-[#1f1f1f]">
              <div className="border-b border-slate-200 p-6 dark:border-[#313131]">
                <h2 className="text-xl font-bold">Actividad por día</h2>
              </div>
              {byDay.length ? (
                <ol className="divide-y divide-slate-200 dark:divide-[#313131]">
                  {byDay.map(({ day, event_count }) => (
                    <li key={day} className="flex items-center justify-between gap-4 px-6 py-4 text-sm">
                      <time dateTime={day}>{new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${day}T12:00:00Z`))}</time>
                      <span className="font-semibold tabular-nums">{Number(event_count).toLocaleString('es-ES')} visitas</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="px-6 py-8 text-sm text-slate-600 dark:text-slate-300">Todavía no hay visitas registradas.</p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function shareChannelLabel(channel: string) {
  const labels: Record<string, string> = {
    native: 'Compartir desde el dispositivo',
    copy: 'Enlace copiado',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    email: 'Correo electrónico',
    sms: 'Mensajes de texto',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    x: 'X',
  };
  return labels[channel] || channel;
}

function groupingLabel(grouping: Grouping) {
  return { day: 'día', week: 'semana', month: 'mes', year: 'año' }[grouping];
}
