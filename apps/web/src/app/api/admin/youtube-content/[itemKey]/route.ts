import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cmsContentSource } from '@/lib/cms';
import { requireAdmin } from '@/lib/supabase/admin';
import { deleteYouTubeContentOverride, getAdminManagedYouTubeContent, makeYouTubeItemKey, saveYouTubeContentOverride } from '@/lib/youtube-content.server';
import { isValidYouTubeItemKey, normalizeYoutubeContentItem } from '@/lib/youtube-content.validation';
import { removeUnreferencedYouTubeMedia } from '@/lib/youtube-media.server';

type RouteContext = { params: Promise<{ itemKey: string }> };

function revalidateYouTubePages() {
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/videos', 'page');
  revalidatePath('/[locale]/canciones', 'page');
}

export async function PUT(request: Request, context: RouteContext) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { itemKey } = await context.params;
  if (!isValidYouTubeItemKey(itemKey)) return NextResponse.json({ error: 'El identificador de contenido no es válido.' }, { status: 400 });

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

  const kind = itemKey.startsWith('song:') ? 'song' : 'video';
  const item = normalizeYoutubeContentItem(body.item, kind);
  if (!item || itemKey !== makeYouTubeItemKey(kind, item.id)) {
    return NextResponse.json({ error: 'Revisa los datos de la ficha antes de guardar.' }, { status: 400 });
  }

  try {
    const [videos, songs] = await Promise.all([
      cmsContentSource.getVideos('es'),
      cmsContentSource.getSongs('es'),
    ]);
    const current = await getAdminManagedYouTubeContent(videos, songs);
    if (!current.storageAvailable) throw new Error('storage-unavailable');
    const previous = current.items.find((entry) => entry.itemKey === itemKey);
    const duplicate = current.items.some((entry) => entry.kind === kind && entry.itemKey !== itemKey
      && ((item.youtubeId && entry.youtubeId === item.youtubeId) || entry.slug === item.slug));
    if (duplicate) return NextResponse.json({ error: 'Otra ficha ya utiliza ese enlace o esa ruta corta.' }, { status: 409 });
    await saveYouTubeContentOverride({ itemKey, kind, payload: item, userId: identity.userId });
    await removeUnreferencedYouTubeMedia([
      previous?.kind === 'video' ? previous.thumbnail : previous?.coverImage,
    ], [...videos, ...songs]);
    revalidateYouTubePages();
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar. Comprueba que la migración de gestión de contenido de YouTube esté aplicada.' }, { status: 503 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { itemKey } = await context.params;
  if (!isValidYouTubeItemKey(itemKey)) return NextResponse.json({ error: 'El identificador de contenido no es válido.' }, { status: 400 });
  const [videos, songs] = await Promise.all([
    cmsContentSource.getVideos('es'),
    cmsContentSource.getSongs('es'),
  ]);
  const current = await getAdminManagedYouTubeContent(videos, songs);
  if (!current.storageAvailable) {
    return NextResponse.json({ error: 'No está disponible la tabla de gestión de contenido de YouTube.' }, { status: 503 });
  }
  const item = current.items.find((entry) => entry.itemKey === itemKey);
  if (!item) return NextResponse.json({ error: 'No se encontró esa ficha.' }, { status: 404 });

  try {
    await deleteYouTubeContentOverride(itemKey, identity.userId, item.inherited);
    await removeUnreferencedYouTubeMedia([
      item.kind === 'video' ? item.thumbnail : item.coverImage,
    ], [...videos, ...songs]);
    revalidatePath('/[locale]', 'page');
    revalidatePath('/[locale]/videos', 'page');
    revalidatePath('/[locale]/canciones', 'page');
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo retirar la ficha. Comprueba la conexión con Supabase.' }, { status: 503 });
  }
}
