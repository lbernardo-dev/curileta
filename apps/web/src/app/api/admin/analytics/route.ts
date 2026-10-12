import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { cmsProvider } from '@/lib/cms';
import { getGalleryItemBySlug } from '@/lib/gallery.server';
import { getPublicDestinations } from '@/lib/destinations.server';

export async function GET(request: NextRequest) {
  await requireAdmin(['owner', 'admin', 'analyst']);
  const requestedRange = request.nextUrl.searchParams.get('range') || '30';
  const allowedRanges = new Set(['7', '30', '90', '365', '1825', 'all']);
  const range = allowedRanges.has(requestedRange) ? requestedRange : '30';
  const days = range === 'all' ? null : Number(range);
  const today = new Date().toISOString().slice(0, 10);
  const since = days ? dateDaysAgo(today, days - 1) : null;

  try {
    const supabase = createSupabaseAdminClient();
    const [periodRows, allTimePageViews] = await Promise.all([
      fetchAnalyticsRows(supabase, since),
      range === 'all' ? Promise.resolve(null) : fetchAnalyticsRows(supabase, null, true),
    ]);

    const totals = new Map<string, { event_name: string; path: string; locale: string; event_count: number }>();
    const pageViewsByDay = new Map<string, number>();
    const countsByEventDay = new Map<string, number>();
    for (const row of periodRows) {
      const key = `${row.event_name}\u0000${row.path}\u0000${row.locale}`;
      const aggregate = totals.get(key) || { event_name: row.event_name, path: row.path, locale: row.locale, event_count: 0 };
      aggregate.event_count += Number(row.event_count) || 0;
      totals.set(key, aggregate);
      if (row.event_name === 'page_view') {
        pageViewsByDay.set(row.day, (pageViewsByDay.get(row.day) || 0) + (Number(row.event_count) || 0));
      }
      const eventDayKey = `${row.event_name}\u0000${row.day}`;
      countsByEventDay.set(eventDayKey, (countsByEventDay.get(eventDayKey) || 0) + (Number(row.event_count) || 0));
    }

    const totalVisits = (allTimePageViews || periodRows.filter((row) => row.event_name === 'page_view'))
      .reduce((total, row) => total + (Number(row.event_count) || 0), 0);
    const earliestPageView = [...pageViewsByDay.keys()].sort()[0] || null;
    const earliestActivity = [...new Set(periodRows.map((row) => row.day))].sort()[0] || null;
    return NextResponse.json({
      success: true,
      range,
      days,
      since,
      today,
      earliestPageView,
      earliestActivity,
      totalVisits,
      data: [...totals.values()],
      pageViewsByDay: [...pageViewsByDay.entries()].map(([day, event_count]) => ({ day, event_count })).sort((left, right) => left.day.localeCompare(right.day)),
      eventCountsByDay: [...countsByEventDay.entries()].map(([key, event_count]) => {
        const [event_name, day] = key.split('\u0000');
        return { day, event_name, event_count };
      }).sort((left, right) => left.day.localeCompare(right.day) || left.event_name.localeCompare(right.event_name)),
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudieron cargar las estadísticas.' }, { status: 503 });
  }
}

const ANALYTICS_PAGE_SIZE = 1000;

async function fetchAnalyticsRows(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  since: string | null,
  pageViewsOnly = false,
) {
  const rows: { day: string; event_name: string; path: string; locale: string; event_count: number | string }[] = [];
  for (let offset = 0; ; offset += ANALYTICS_PAGE_SIZE) {
    let query = supabase
      .from('analytics_daily')
      .select('day, event_name, path, locale, event_count');
    if (since) query = query.gte('day', since);
    if (pageViewsOnly) query = query.eq('event_name', 'page_view');
    const { data, error } = await query
      .order('day', { ascending: true })
      .order('event_name', { ascending: true })
      .order('path', { ascending: true })
      .order('locale', { ascending: true })
      .range(offset, offset + ANALYTICS_PAGE_SIZE - 1);
    if (error) throw error;
    const batch = (data || []) as typeof rows;
    rows.push(...batch);
    if (batch.length < ANALYTICS_PAGE_SIZE) return rows;
  }
}

function dateDaysAgo(isoDate: string, count: number) {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - count);
  return date.toISOString().slice(0, 10);
}

export async function POST(request: NextRequest) {
  let body: { eventName?: unknown; path?: unknown; locale?: unknown; contentType?: unknown; contentSlug?: unknown; turnstileToken?: unknown };
  try {
    const rawBody = await request.text();
    if (rawBody.length > 4096) return new NextResponse(null, { status: 413 });
    body = JSON.parse(rawBody) as typeof body;
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const eventName = typeof body.eventName === 'string' ? body.eventName : '';
  const rawPath = typeof body.path === 'string' ? body.path : '';
  const locale = body.locale === 'en' || body.locale === 'es' ? body.locale : '';
  const shareChannels = ['native', 'copy', 'whatsapp', 'telegram', 'email', 'sms', 'facebook', 'linkedin', 'x'];
  const shareEvents = shareChannels.map((channel) => `content_share_${channel}`);
  const allowedEvents = ['page_view', 'contact_submit', 'book_view', 'book_purchase_click', 'video_play', 'character_view', 'map_destination_open', 'song_play', 'wallpaper_download', 'gallery_download', 'video_vote', ...shareEvents];
  if (!allowedEvents.includes(eventName) || !locale || !/^\/[a-zA-Z0-9/_-]{0,239}$/.test(rawPath)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const isContentInteraction = shareEvents.includes(eventName) || eventName === 'video_vote' || eventName === 'gallery_download' || eventName === 'video_play';
  if (eventName === 'gallery_download' && body.contentType !== 'gallery') return NextResponse.json({ success: false }, { status: 400 });
  if (eventName === 'video_play' && body.contentType !== 'video') return NextResponse.json({ success: false }, { status: 400 });
  if (eventName === 'video_vote') {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
    if (!secret || !siteKey) return NextResponse.json({ success: false }, { status: 503 });
    if (!token || token.length > 2048 || !(await verifyTurnstile(token, secret))) {
      return NextResponse.json({ success: false }, { status: 403 });
    }
    if (body.contentType !== 'video') return NextResponse.json({ success: false }, { status: 400 });
  }

  const path = isContentInteraction
    ? await normalizeSharedContentPath(body.contentType, body.contentSlug, locale)
    : normalizeAnalyticsPath(rawPath, locale);
  if (!path) return NextResponse.json({ success: false }, { status: 400 });

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.rpc('record_public_analytics', {
      p_event_name: eventName,
      p_path: path,
      p_locale: locale,
    });
    if (error) throw error;
    if (eventName === 'video_vote') {
      revalidatePath(`/${locale}`);
      revalidatePath(`/${locale}/videos`);
    }
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ success: false }, { status: 503 });
  }
}

async function verifyTurnstile(token: string, secret: string) {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const result = await response.json() as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

async function normalizeSharedContentPath(contentType: unknown, contentSlug: unknown, locale: 'es' | 'en') {
  if (typeof contentType !== 'string' || typeof contentSlug !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(contentSlug)) return null;

  let exists = false;
  switch (contentType) {
    case 'video':
      exists = (await cmsProvider.getVideos(locale)).some((item) => item.slug === contentSlug);
      break;
    case 'book':
      exists = (await cmsProvider.getBooks(locale)).some((item) => item.slug === contentSlug);
      break;
    case 'character':
      exists = (await cmsProvider.getCharacters(locale)).some((item) => item.slug === contentSlug);
      break;
    case 'song':
      exists = (await cmsProvider.getSongs(locale)).some((item) => item.slug === contentSlug);
      break;
    case 'adventure':
      exists = (await cmsProvider.getAdventures(locale)).some((item) => item.slug === contentSlug);
      break;
    case 'location':
      exists = (await getPublicDestinations(locale)).some((item) => item.slug === contentSlug);
      break;
    case 'wallpaper':
      exists = (await cmsProvider.getWallpapers(locale)).some((item) => item.slug === contentSlug);
      break;
    case 'gallery':
      exists = Boolean(await getGalleryItemBySlug(contentSlug));
      break;
    case 'seasonalEvent':
      exists = (await cmsProvider.getSeasonalEvents(locale)).some((item) => item.slug === contentSlug);
      break;
    default:
      return null;
  }
  if (!exists) return null;
  return contentType === 'gallery'
    ? `/${locale}/galeria/${contentSlug}`
    : `/${locale}/contenido/${contentType}/${contentSlug}`;
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
    '/destinos',
    '/eventos',
    '/fondos',
    '/galeria',
    '/autora',
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

  const detailRoute = route.match(/^\/(libros|personajes|autora|destinos)\/[a-zA-Z0-9_-]{1,100}$/);
  if (detailRoute) return `${prefix}/${detailRoute[1]}/detalle`;
  return null;
}
