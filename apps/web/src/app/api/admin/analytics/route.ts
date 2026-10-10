import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { cmsProvider } from '@/lib/cms';

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
  let body: { eventName?: unknown; path?: unknown; locale?: unknown; contentType?: unknown; contentSlug?: unknown; turnstileToken?: unknown };
  try {
    const rawBody = await request.text();
    if (rawBody.length > 4096) return new NextResponse(null, { status: 413 });
    body = JSON.parse(rawBody) as typeof body;
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const eventName = typeof body.eventName === 'string' ? body.eventName : '';
  const rawPath = typeof body.path === 'string' ? body.path : '';
  const locale = body.locale === 'en' || body.locale === 'es' ? body.locale : '';
  const shareChannels = ['native', 'copy', 'whatsapp', 'telegram', 'email', 'sms', 'facebook', 'linkedin', 'x'];
  const shareEvents = shareChannels.map((channel) => `content_share_${channel}`);
  const allowedEvents = ['page_view', 'book_view', 'book_purchase_click', 'video_play', 'character_view', 'map_destination_open', 'song_play', 'wallpaper_download', 'video_vote', ...shareEvents];
  if (!allowedEvents.includes(eventName) || !locale || !/^\/[a-zA-Z0-9/_-]{0,239}$/.test(rawPath)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const isContentInteraction = shareEvents.includes(eventName) || eventName === 'video_vote';
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
      exists = (await cmsProvider.getLocations(locale)).some((item) => item.slug === contentSlug);
      break;
    case 'wallpaper':
      exists = (await cmsProvider.getWallpapers(locale)).some((item) => item.slug === contentSlug);
      break;
    case 'seasonalEvent':
      exists = (await cmsProvider.getSeasonalEvents(locale)).some((item) => item.slug === contentSlug);
      break;
    default:
      return null;
  }
  if (!exists) return null;
  return `/${locale}/contenido/${contentType}/${contentSlug}`;
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
