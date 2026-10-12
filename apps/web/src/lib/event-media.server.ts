import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/server';

const EVENT_MEDIA_BUCKET = 'curileta-site-media';
const eventPathPattern = /^events\/[0-9a-f-]{36}\.(mp4|webm|mp3|m4a|ogg)$/i;

export function isEventMediaAsset(urlValue: unknown, pathValue: unknown, kind: 'video' | 'audio') {
  if (typeof urlValue !== 'string' || typeof pathValue !== 'string' || !eventPathPattern.test(pathValue)) return false;
  const extension = pathValue.split('.').at(-1)?.toLowerCase();
  if (kind === 'video' && extension !== 'mp4' && extension !== 'webm') return false;
  if (kind === 'audio' && !['mp3', 'm4a', 'ogg', 'webm'].includes(extension || '')) return false;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;
  try {
    const expectedOrigin = new URL(supabaseUrl).origin;
    const mediaUrl = new URL(urlValue);
    return !mediaUrl.username && !mediaUrl.password
      && mediaUrl.origin === expectedOrigin
      && mediaUrl.pathname === `/storage/v1/object/public/${EVENT_MEDIA_BUCKET}/${pathValue}`;
  } catch {
    return false;
  }
}

export async function removeUnreferencedEventMedia(path: string) {
  if (!eventPathPattern.test(path)) return false;
  const supabase = createSupabaseAdminClient();
  const [videoReference, audioReference, scareReference] = await Promise.all([
    supabase.from('site_events').select('id').eq('hero_video_path', path).limit(1).maybeSingle(),
    supabase.from('site_events').select('id').eq('ambient_audio_path', path).limit(1).maybeSingle(),
    supabase.from('site_events').select('id').eq('scare_sound_path', path).limit(1).maybeSingle(),
  ]);
  if (videoReference.error || audioReference.error || scareReference.error || videoReference.data || audioReference.data || scareReference.data) return false;
  const { error } = await supabase.storage.from(EVENT_MEDIA_BUCKET).remove([path]);
  return !error;
}
