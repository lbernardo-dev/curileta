import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cmsContentSource } from '@/lib/cms';
import { requireAdmin } from '@/lib/supabase/admin';
import { makeYouTubeItemKey, saveYouTubeContentOverride, getAdminManagedYouTubeContent } from '@/lib/youtube-content.server';
import { isValidYouTubeItemKey, normalizeYoutubeContentItem } from '@/lib/youtube-content.validation';
import type { YouTubeManagedKind } from '@/lib/youtube-content.types';

function revalidateYouTubePages() {
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/videos', 'page');
  revalidatePath('/[locale]/canciones', 'page');
}

export async function GET() {
  await requireAdmin(['owner', 'admin', 'editor']);
  const [videos, songs] = await Promise.all([
    cmsContentSource.getVideos('es'),
    cmsContentSource.getSongs('es'),
  ]);
  const content = await getAdminManagedYouTubeContent(videos, songs);
  return NextResponse.json(content, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function POST(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 32_000) return NextResponse.json({ error: 'La ficha supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'La ficha no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'La ficha no tiene un formato válido.' }, { status: 400 });
  }

  const kind = body.kind;
  if (kind !== 'video' && kind !== 'song') {
    return NextResponse.json({ error: 'Selecciona si vas a crear un vídeo o una ficha musical.' }, { status: 400 });
  }
  const item = normalizeYoutubeContentItem(body.item, kind as YouTubeManagedKind);
  if (!item || !item.youtubeId) {
    return NextResponse.json({ error: 'Revisa los datos de la ficha y añade un enlace válido de YouTube.' }, { status: 400 });
  }

  const itemKey = makeYouTubeItemKey(kind, item.id);
  if (!isValidYouTubeItemKey(itemKey)) return NextResponse.json({ error: 'El identificador de contenido no es válido.' }, { status: 400 });

  try {
    const [videos, songs] = await Promise.all([
      cmsContentSource.getVideos('es'),
      cmsContentSource.getSongs('es'),
    ]);
    const current = await getAdminManagedYouTubeContent(videos, songs);
    if (!current.storageAvailable) throw new Error('storage-unavailable');
    const duplicate = current.items.some((entry) => entry.kind === kind && entry.youtubeId === item.youtubeId);
    if (duplicate) return NextResponse.json({ error: 'Ese enlace ya está registrado. Edítalo desde la lista.' }, { status: 409 });
    if (current.items.some((entry) => entry.kind === kind && entry.slug === item.slug)) {
      return NextResponse.json({ error: 'Ya existe una ficha con esa ruta corta.' }, { status: 409 });
    }
    await saveYouTubeContentOverride({ itemKey, kind, payload: item, userId: identity.userId });
    revalidateYouTubePages();
    return NextResponse.json({ success: true, itemKey }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar. Comprueba que la migración de gestión de contenido de YouTube esté aplicada.' }, { status: 503 });
  }
}
