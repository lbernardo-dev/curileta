import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  await requireAdmin(['owner', 'admin', 'analyst']);
  const requestedDays = Number(request.nextUrl.searchParams.get('days') || 30);
  const days = Number.isFinite(requestedDays) ? Math.min(90, Math.max(7, Math.floor(requestedDays))) : 30;
  const since = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('analytics_daily')
      .select('day, event_name, path, locale, event_count')
      .gte('day', since)
      .order('day', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ success: true, days, data: data || [] }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudieron cargar las estadísticas.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  let body: { eventName?: unknown; path?: unknown; locale?: unknown };
  try {
    const rawBody = await request.text();
    if (rawBody.length > 1024) return new NextResponse(null, { status: 413 });
    body = JSON.parse(rawBody) as typeof body;
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const eventName = typeof body.eventName === 'string' ? body.eventName : '';
  const rawPath = typeof body.path === 'string' ? body.path : '';
  const locale = body.locale === 'en' || body.locale === 'es' ? body.locale : '';
  const allowedEvents = ['page_view', 'book_view', 'book_purchase_click', 'video_play', 'character_view', 'map_destination_open', 'song_play', 'wallpaper_download'];
  if (!allowedEvents.includes(eventName) || !locale || !/^\/[a-zA-Z0-9/_-]{0,239}$/.test(rawPath)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // Keep the public analytics endpoint from creating unlimited database rows
  // with arbitrary paths. Dynamic content pages are grouped by route type.
  const path = normalizeAnalyticsPath(rawPath, locale);
  if (!path) return NextResponse.json({ success: false }, { status: 400 });

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.rpc('record_public_analytics', {
      p_event_name: eventName,
      p_path: path,
      p_locale: locale,
    });
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ success: false }, { status: 503 });
  }
}

function normalizeAnalyticsPath(path: string, locale: 'es' | 'en') {
  const prefix = `/${locale}`;
  if (path !== prefix && path !== `${prefix}/` && !path.startsWith(`${prefix}/`)) return null;

  const route = path.slice(prefix.length).replace(/\/$/, '') || '/';
  const staticRoutes = new Set([
    '/',
    '/accesibilidad',
    '/canciones',
    '/colaboraciones',
    '/contacto',
    '/cookies',
    '/curileta',
    '/eventos',
    '/fondos',
    '/legal',
    '/libros',
    '/mundo',
    '/novedades',
    '/personajes',
    '/prensa',
    '/privacidad',
    '/videos',
  ]);
  if (staticRoutes.has(route)) return `${prefix}${route === '/' ? '' : route}`;

  const detailRoute = route.match(/^\/(libros|personajes)\/[a-zA-Z0-9_-]{1,100}$/);
  if (detailRoute) return `${prefix}/${detailRoute[1]}/detalle`;
  return null;
}
