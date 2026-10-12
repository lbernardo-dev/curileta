import { NextResponse } from 'next/server';
import { defaultBaseTheme, getManagedBaseTheme, getThemeControlState } from '@/lib/events.server';
import { revalidateEventPages } from '@/lib/events-revalidation';
import { normalizeBaseThemeBody } from '@/lib/events.validation';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { removeUnreferencedEventMedia } from '@/lib/event-media.server';

const noStore = { 'Cache-Control': 'private, no-store' };

export async function GET() {
  await requireAdmin(['owner', 'admin', 'editor']);
  try {
    const [baseTheme, control] = await Promise.all([getManagedBaseTheme(), getThemeControlState()]);
    return NextResponse.json({ success: true, baseTheme, control }, { headers: noStore });
  } catch {
    return NextResponse.json({ success: false, baseTheme: defaultBaseTheme(), error: 'No se pudo cargar el tema base. Comprueba que la migración de eventos esté aplicada.' }, { status: 503, headers: noStore });
  }
}

export async function PUT(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const body = await readJson(request);
  if (!body) return NextResponse.json({ success: false, error: 'La configuración supera el tamaño permitido o no tiene un formato válido.' }, { status: 400, headers: noStore });
  const theme = normalizeBaseThemeBody(body);
  if (!theme) return NextResponse.json({ success: false, error: 'Revisa el nombre, la paleta, los efectos y los archivos del tema base.' }, { status: 400, headers: noStore });

  const supabase = createSupabaseAdminClient();
  const { data: previous, error: readError } = await supabase.from('site_theme_settings')
    .select('hero_video_path, ambient_audio_path, updated_at').eq('setting_key', 'base').maybeSingle();
  if (readError) return NextResponse.json({ success: false, error: 'No se pudo comprobar la configuración actual.' }, { status: 503, headers: noStore });
  if (typeof body.updatedAt !== 'string' || body.updatedAt !== (previous?.updated_at || '')) {
    return NextResponse.json({ success: false, error: 'El tema base cambió desde que lo abriste. Actualiza la página e inténtalo de nuevo.' }, { status: 409, headers: noStore });
  }

  const { data, error } = await supabase.from('site_theme_settings').upsert({
    setting_key: 'base',
    name: theme.name,
    theme_key: theme.themeKey,
    hero_video_url: theme.heroVideoUrl,
    hero_video_path: theme.heroVideoPath,
    ambient_audio_url: theme.ambientAudioUrl,
    ambient_audio_path: theme.ambientAudioPath,
    palette: theme.palette,
    effects: theme.effects,
    updated_by: identity.userId,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'setting_key' }).select('*').single();
  if (error || !data) return NextResponse.json({ success: false, error: 'No se pudo guardar el tema base.' }, { status: 503, headers: noStore });

  const replaced = [previous?.hero_video_path, previous?.ambient_audio_path]
    .filter((path): path is string => typeof path === 'string' && Boolean(path))
    .filter((path) => path !== theme.heroVideoPath && path !== theme.ambientAudioPath);
  await Promise.all(replaced.map((path) => removeUnreferencedEventMedia(path).catch(() => false)));
  revalidateEventPages();
  return NextResponse.json({ success: true }, { headers: noStore });
}

async function readJson(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 24_000) return null;
    const value: unknown = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}
