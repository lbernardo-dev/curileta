import { NextResponse } from 'next/server';
import { removeSiteMediaAsset } from '@/lib/site-media.server';
import { removeUnreferencedYouTubeMedia } from '@/lib/youtube-media.server';
import { removeUnreferencedEventMedia } from '@/lib/event-media.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const targets = {
  'youtube-avatar': { prefix: 'youtube/avatar', kind: 'youtube' },
  'youtube-header': { prefix: 'youtube/header', kind: 'youtube' },
  'youtube-video-thumbnail': { prefix: 'youtube/content/video-thumbnails', kind: 'youtube' },
  'youtube-song-cover': { prefix: 'youtube/content/song-covers', kind: 'youtube' },
  'author-portrait': { prefix: 'authors/portraits', kind: 'author' },
  'gallery-image': { prefix: 'gallery', kind: 'gallery' },
  'upcoming-book-cover': { prefix: 'books/upcoming', kind: 'book' },
  'letter-photo': { prefix: 'letters/photos', kind: 'letter' },
  'editorial-image': { prefix: 'editorial/content', kind: 'editorial' },
  'event-artwork': { prefix: 'events/artwork', kind: 'event' },
} as const;

export async function DELETE(request: Request) {
  await requireAdmin(['owner', 'admin', 'editor']);

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2_000) return NextResponse.json({ error: 'La solicitud supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'La solicitud de limpieza no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'La solicitud de limpieza no tiene un formato válido.' }, { status: 400 });
  }

  const value = body as Record<string, unknown>;
  if (typeof value.target !== 'string' || !Object.prototype.hasOwnProperty.call(targets, value.target)
    || typeof value.path !== 'string') {
    return NextResponse.json({ error: 'Selecciona una imagen administrada válida.' }, { status: 400 });
  }

  const target = targets[value.target as keyof typeof targets];
  if (!new RegExp(`^${target.prefix}/[0-9a-f-]{36}\\.(webp|jpg)$`, 'i').test(value.path)) {
    return NextResponse.json({ error: 'La imagen no pertenece a la carpeta seleccionada.' }, { status: 400 });
  }

  if (target.kind === 'event') {
    await removeUnreferencedEventMedia(value.path);
  } else if (target.kind === 'youtube') {
    const { data } = createSupabaseAdminClient().storage.from('curileta-site-media').getPublicUrl(value.path);
    await removeUnreferencedYouTubeMedia([data.publicUrl]);
  } else {
    const prefix = target.kind === 'editorial' ? 'editorial/content'
      : target.kind === 'author' ? 'authors/portraits'
      : target.kind === 'letter' ? 'letters/photos'
        : target.kind === 'book' ? 'books/upcoming' : 'gallery';
    await removeSiteMediaAsset(value.path, prefix);
  }

  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'private, no-store' } });
}
