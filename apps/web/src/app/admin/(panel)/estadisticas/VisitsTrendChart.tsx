'use client';

export interface VisitDay {
  day: string;
  event_count: number;
}

type Grouping = 'day' | 'week' | 'month' | 'year';

interface VisitsTrendChartProps {
  data: VisitDay[];
  start: string | null;
  end: string;
  grouping: Grouping;
}

export function VisitsTrendChart({ data, start, end, grouping }: VisitsTrendChartProps) {
  const counts = new Map(data.map((item) => [item.day, Number(item.event_count) || 0]));
  const firstDay = start || data[0]?.day;
  if (!firstDay || data.length === 0) {
    return <p className="px-6 py-10 text-sm text-slate-600 dark:text-slate-300">Todavía no hay visitas registradas para este periodo.</p>;
  }

  const cursor = startOfBucket(new Date(`${firstDay}T00:00:00.000Z`), grouping);
  const finalBucket = startOfBucket(new Date(`${end}T00:00:00.000Z`), grouping);
  const groupedCounts = new Map<string, number>();
  for (const [day, count] of counts) {
    const key = dayKey(startOfBucket(new Date(`${day}T00:00:00.000Z`), grouping));
    groupedCounts.set(key, (groupedCounts.get(key) || 0) + count);
  }
  const buckets: { key: string; label: string; count: number }[] = [];
  while (cursor <= finalBucket && buckets.length < 6000) {
    const key = dayKey(cursor);
    buckets.push({ key, label: bucketLabel(cursor, grouping), count: groupedCounts.get(key) || 0 });
    advanceBucket(cursor, grouping);
  }

  const width = 960;
  const height = 300;
  const left = 52;
  const right = 20;
  const top = 20;
  const bottom = 44;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maxValue = buckets.reduce((maximum, bucket) => Math.max(maximum, bucket.count), 0) || 1;
  const points = buckets.map((bucket, index) => ({
    ...bucket,
    x: buckets.length === 1 ? left + plotWidth / 2 : left + (index / (buckets.length - 1)) * plotWidth,
    y: top + plotHeight - (bucket.count / maxValue) * plotHeight,
  }));
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');
  const labelStride = Math.max(1, Math.ceil(points.length / 6));

  return (
    <div className="px-4 pb-5 pt-2 sm:px-6">
      <svg className="block h-auto w-full overflow-visible text-emerald-700 dark:text-emerald-300" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="visits-chart-title visits-chart-description">
        <title id="visits-chart-title">Evolución de visitas</title>
        <desc id="visits-chart-description">Vistas de página agrupadas por {groupingLabel(grouping)}. El total del periodo se muestra en el resumen.</desc>
        {[0, 1, 2, 3].map((step) => {
          const y = top + (plotHeight / 3) * step;
          const value = Math.round(maxValue * (1 - step / 3));
          return <g key={step}>
            <line x1={left} y1={y} x2={width - right} y2={y} stroke="currentColor" strokeOpacity="0.15" strokeDasharray="3 5" />
            <text x={left - 10} y={y + 4} textAnchor="end" className="fill-slate-500 dark:fill-slate-400" fontSize="12">{value.toLocaleString('es-ES')}</text>
          </g>;
        })}
        <path d={line} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {points.length <= 120 && points.map((point) => <circle key={point.key} cx={point.x} cy={point.y} r="3.5" fill="currentColor">
          <title>{point.label}: {point.count.toLocaleString('es-ES')} visitas</title>
        </circle>)}
        {points.filter((_, index) => index % labelStride === 0 || index === points.length - 1).map((point) => (
          <text key={point.key} x={point.x} y={height - 12} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400" fontSize="12">{point.label}</text>
        ))}
      </svg>
      <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">Vistas de página registradas. No representa personas únicas.</p>
    </div>
  );
}

function startOfBucket(date: Date, grouping: Grouping) {
  const result = new Date(date);
  if (grouping === 'week') {
    const daysSinceMonday = (result.getUTCDay() + 6) % 7;
    result.setUTCDate(result.getUTCDate() - daysSinceMonday);
  } else if (grouping === 'month') {
    result.setUTCDate(1);
  } else if (grouping === 'year') {
    result.setUTCMonth(0, 1);
  }
  return result;
}

function advanceBucket(date: Date, grouping: Grouping) {
  if (grouping === 'day') date.setUTCDate(date.getUTCDate() + 1);
  if (grouping === 'week') date.setUTCDate(date.getUTCDate() + 7);
  if (grouping === 'month') date.setUTCMonth(date.getUTCMonth() + 1);
  if (grouping === 'year') date.setUTCFullYear(date.getUTCFullYear() + 1);
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function bucketLabel(date: Date, grouping: Grouping) {
  if (grouping === 'year') return String(date.getUTCFullYear());
  if (grouping === 'month') return new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(date);
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(date);
}

function groupingLabel(grouping: Grouping) {
  return { day: 'día', week: 'semana', month: 'mes', year: 'año' }[grouping];
}
