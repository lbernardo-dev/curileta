import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/server';

const EVENT_MEDIA_BUCKET = 'curileta-site-media';
const storageEventPathPattern = /^events\/(?:[0-9a-f-]{36}\.(?:mp4|webm|mp3|m4a|ogg)|artwork\/[0-9a-f-]{36}\.(?:webp|jpg))$/i;
const halloweenVideoPath = 'static:halloween-hero';
const halloweenVideoUrl = '/videos/hero/events/halloween/curileta-halloween.mp4';
const artworkPresetUrls: Record<string, string> = {
  halloween: '/images/events/halloween-curileta-pompon-wide.webp',
  christmas: '/images/events/themes/christmas.svg', easter: '/images/events/themes/easter.svg',
  valentines: '/images/events/themes/valentines.svg', 'new-year': '/images/events/themes/new-year.svg',
  'lunar-new-year': '/images/events/themes/lunar-new-year.svg', spring: '/images/events/themes/spring.svg',
  summer: '/images/events/themes/summer.svg', autumn: '/images/events/themes/autumn.svg',
  'earth-day': '/images/events/themes/earth-day.svg', 'world-book-day': '/images/events/themes/world-book-day.svg',
  pride: '/images/events/themes/pride.svg', 'st-patrick': '/images/events/themes/st-patrick.svg',
  'day-of-the-dead': '/images/events/themes/day-of-the-dead.svg',
  'world-childrens-day': '/images/events/themes/world-childrens-day.svg', diwali: '/images/events/themes/diwali.svg',
};

export function isEventMediaAsset(urlValue: unknown, pathValue: unknown, kind: 'video' | 'audio' | 'image') {
  if (typeof urlValue !== 'string' || typeof pathValue !== 'string') return false;
  if (kind === 'video' && pathValue === halloweenVideoPath && urlValue === halloweenVideoUrl) return true;
  if (kind === 'image' && pathValue.startsWith('static:theme:')) {
    return artworkPresetUrls[pathValue.slice('static:theme:'.length)] === urlValue;
  }
  if (!storageEventPathPattern.test(pathValue)) return false;
  const extension = pathValue.split('.').at(-1)?.toLowerCase();
  if (kind === 'video' && extension !== 'mp4' && extension !== 'webm') return false;
  if (kind === 'audio' && !['mp3', 'm4a', 'ogg', 'webm'].includes(extension || '')) return false;
  if (kind === 'image' && !['webp', 'jpg'].includes(extension || '')) return false;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;
  try {
    const mediaUrl = new URL(urlValue);
    return !mediaUrl.username && !mediaUrl.password && mediaUrl.origin === new URL(supabaseUrl).origin
      && mediaUrl.pathname === `/storage/v1/object/public/${EVENT_MEDIA_BUCKET}/${pathValue}`;
  } catch {
    return false;
  }
}

export async function removeUnreferencedEventMedia(path: string) {
  if (!storageEventPathPattern.test(path)) return false;
  const admin = createSupabaseAdminClient();
  const references = await Promise.all([
    admin.from('site_events').select('id').eq('hero_video_path', path).limit(1).maybeSingle(),
    admin.from('site_events').select('id').eq('ambient_audio_path', path).limit(1).maybeSingle(),
    admin.from('site_events').select('id').eq('scare_sound_path', path).limit(1).maybeSingle(),
    admin.from('site_events').select('id').eq('artwork_path', path).limit(1).maybeSingle(),
  ]);
  if (references.some(({ error, data }) => error || data)) return false;
  const { error } = await admin.storage.from(EVENT_MEDIA_BUCKET).remove([path]);
  return !error;
}
