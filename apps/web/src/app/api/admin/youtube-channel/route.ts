import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import type { SiteSettings } from '@curileta/cms';
import { cmsProvider } from '@/lib/cms';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { resolveYouTubeChannelSettings, type YouTubeChannelConfig } from '@/lib/youtube-channel-settings.server';

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
    || !validHttpsUrl(value.youtubeChannelAvatarUrl)
    || !validHttpsUrl(value.youtubeChannelHeaderUrl)
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
    const { error } = await createSupabaseAdminClient().from('youtube_channel_settings').upsert({
      setting_key: 'primary',
      config: config as unknown as SiteSettings,
      updated_by: identity.userId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'setting_key' });
    if (error) throw error;

    revalidatePath('/[locale]', 'page');
    revalidatePath('/[locale]/videos', 'page');
    revalidatePath('/[locale]/layout', 'layout');
    return NextResponse.json({ success: true, config }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar. Comprueba que la migración de ajustes del canal esté aplicada.' }, { status: 503 });
  }
}
