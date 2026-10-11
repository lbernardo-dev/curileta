import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import type { SiteSettings } from '@curileta/cms';
import { cmsProvider } from '@/lib/cms';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { resolveYouTubeChannelSettings, type YouTubeChannelConfig } from '@/lib/youtube-channel-settings.server';

const mediaBucket = 'curileta-site-media';
const localizedKeys = ['es', 'en'] as const;
type LocalizedValue = { es: string; en: string };

function isLocalized(value: unknown, maxLength: number, required: boolean): value is LocalizedValue {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return localizedKeys.every((locale) => typeof record[locale] === 'string'
    && (record[locale] as string).length <= maxLength
    && (!required || Boolean((record[locale] as string).trim())));
}

function validHttpsUrl(value: unknown, allowedHosts?: string[]) {
  if (typeof value !== 'string' || value.length > 2000) return false;
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (!allowedHosts || allowedHosts.includes(url.hostname.toLowerCase()));
  } catch {
    return false;
  }
}

function validImageUrl(value: unknown) {
  if (typeof value !== 'string' || value.length > 2000) return false;
  if (!value.trim()) return true;

  try {
    const url = new URL(value);
    if (url.username || url.password) return false;
    if (url.protocol === 'https:') return true;

    const configuredSupabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!configuredSupabaseUrl) return false;
    const supabaseUrl = new URL(configuredSupabaseUrl);
    return url.protocol === 'http:'
      && url.origin === supabaseUrl.origin
      && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  } catch {
    return false;
  }
}

function managedYoutubeMediaPath(value: unknown) {
  if (typeof value !== 'string' || !value) return null;

  try {
    const assetUrl = new URL(value);
    const configuredSupabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!configuredSupabaseUrl || assetUrl.origin !== new URL(configuredSupabaseUrl).origin) return null;

    const prefix = `/storage/v1/object/public/${mediaBucket}/`;
    if (!assetUrl.pathname.startsWith(prefix)) return null;
    const path = decodeURIComponent(assetUrl.pathname.slice(prefix.length));
    return /^youtube\/(?:avatar|header)\/[0-9a-f-]{36}\.webp$/.test(path) ? path : null;
  } catch {
    return null;
  }
}

export async function GET() {
  await requireAdmin(['owner', 'admin', 'editor']);
  const base = await cmsProvider.getSiteSettings('es');
  const settings = await resolveYouTubeChannelSettings(base);
  return NextResponse.json({
    config: {
      youtubeChannelUrl: settings.youtubeChannelUrl || '',
      youtubeChannelTitle: settings.youtubeChannelTitle || { es: '', en: '' },
      youtubeChannelDescription: settings.youtubeChannelDescription || { es: '', en: '' },
      youtubeChannelTags: settings.youtubeChannelTags || [],
      youtubeChannelAvatarUrl: settings.youtubeChannelAvatarUrl || '',
      youtubeChannelHeaderUrl: settings.youtubeChannelHeaderUrl || '',
    } satisfies YouTubeChannelConfig,
  }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function PUT(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 16_000) return NextResponse.json({ error: 'El formulario supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'El formulario no tiene un formato válido.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'El formulario no tiene un formato válido.' }, { status: 400 });
  }

  const value = body as Record<string, unknown>;
  if (!isLocalized(value.youtubeChannelTitle, 120, true)
    || !isLocalized(value.youtubeChannelDescription, 600, true)
    || !validHttpsUrl(value.youtubeChannelUrl, ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtu.be'])
    || !validImageUrl(value.youtubeChannelAvatarUrl)
    || !validImageUrl(value.youtubeChannelHeaderUrl)
    || !Array.isArray(value.youtubeChannelTags)
    || value.youtubeChannelTags.length > 8
    || value.youtubeChannelTags.some((tag) => typeof tag !== 'string' || tag.trim().length < 1 || tag.length > 32)) {
    return NextResponse.json({ error: 'Revisa el título, la descripción, los enlaces y las etiquetas.' }, { status: 400 });
  }

  const config: YouTubeChannelConfig = {
    youtubeChannelUrl: (value.youtubeChannelUrl as string).trim(),
    youtubeChannelTitle: {
      es: (value.youtubeChannelTitle as LocalizedValue).es.trim(),
      en: (value.youtubeChannelTitle as LocalizedValue).en.trim(),
    },
    youtubeChannelDescription: {
      es: (value.youtubeChannelDescription as LocalizedValue).es.trim(),
      en: (value.youtubeChannelDescription as LocalizedValue).en.trim(),
    },
    youtubeChannelTags: (value.youtubeChannelTags as string[]).map((tag) => tag.trim()),
    youtubeChannelAvatarUrl: (value.youtubeChannelAvatarUrl as string).trim(),
    youtubeChannelHeaderUrl: (value.youtubeChannelHeaderUrl as string).trim(),
  };

  try {
    const admin = createSupabaseAdminClient();
    const { data: previousSettings, error: readError } = await admin
      .from('youtube_channel_settings')
      .select('config')
      .eq('setting_key', 'primary')
      .maybeSingle();
    if (readError) throw readError;

    const { error } = await admin.from('youtube_channel_settings').upsert({
      setting_key: 'primary',
      config: config as unknown as SiteSettings,
      updated_by: identity.userId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'setting_key' });
    if (error) throw error;

    const previousConfig = previousSettings?.config as Partial<YouTubeChannelConfig> | null;
    const activePaths = new Set([
      managedYoutubeMediaPath(config.youtubeChannelAvatarUrl),
      managedYoutubeMediaPath(config.youtubeChannelHeaderUrl),
    ].filter((path): path is string => Boolean(path)));
    const obsoletePaths = [...new Set([
      managedYoutubeMediaPath(previousConfig?.youtubeChannelAvatarUrl),
      managedYoutubeMediaPath(previousConfig?.youtubeChannelHeaderUrl),
    ].filter((path): path is string => Boolean(path)))].filter((path) => !activePaths.has(path));
    if (obsoletePaths.length > 0) {
      const { error: cleanupError } = await admin.storage.from(mediaBucket).remove(obsoletePaths);
      if (cleanupError) console.error('[YouTubeChannel] No se pudieron retirar imágenes anteriores de la biblioteca.');
    }

    revalidatePath('/[locale]', 'page');
    revalidatePath('/[locale]/videos', 'page');
    revalidatePath('/[locale]/layout', 'layout');
    return NextResponse.json({ success: true, config }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar. Comprueba que la migración de ajustes del canal esté aplicada.' }, { status: 503 });
  }
}
