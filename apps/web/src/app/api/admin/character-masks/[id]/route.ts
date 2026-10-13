import { NextResponse } from 'next/server';
import { removeUnreferencedCharacterMaskMedia } from '@/lib/character-masks.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import {
  isCharacterMaskAsset,
  mapCharacterMask,
  revalidateCharacterMaskPages,
} from '@/lib/character-masks.server';

const noStore = { 'Cache-Control': 'private, no-store' };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ success: false, error: 'Selecciona una máscara válida.' }, { status: 400, headers: noStore });
  const body = await readJson(request);
  const mask = body && normalizeMask(body);
  if (!body || !mask) return NextResponse.json({ success: false, error: 'Revisa los textos, identificadores e imágenes de la máscara.' }, { status: 400, headers: noStore });
  if (mask.is_published && (!mask.preview_image_url || !mask.printable_pdf_url)) {
    return NextResponse.json({ success: false, error: 'Para publicar una máscara, añade su imagen de vista previa y su PDF.' }, { status: 400, headers: noStore });
  }

  const supabase = createSupabaseAdminClient();
  const { data: previous, error: readError } = await supabase.from('character_masks')
    .select('updated_at, preview_image_path, printable_pdf_path')
    .eq('id', id)
    .maybeSingle();
  if (readError) return NextResponse.json({ success: false, error: 'No se pudo comprobar la máscara existente.' }, { status: 503, headers: noStore });
  if (!previous) return NextResponse.json({ success: false, error: 'La máscara ya no existe. Actualiza la lista.' }, { status: 404, headers: noStore });
  if (typeof body.updatedAt !== 'string' || body.updatedAt !== previous.updated_at) {
    return NextResponse.json({ success: false, error: 'La máscara cambió desde que la abriste. Actualiza la lista e inténtalo de nuevo.' }, { status: 409, headers: noStore });
  }

  const { data, error } = await supabase.from('character_masks')
    .update({ ...mask, updated_by: identity.userId, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('updated_at', previous.updated_at)
    .select('*')
    .maybeSingle();
  if (error) return NextResponse.json({ success: false, error: error.code === '23505' ? 'Ya existe una máscara con ese identificador.' : 'No se pudo guardar la máscara.' }, { status: error.code === '23505' ? 409 : 503, headers: noStore });
  if (!data) return NextResponse.json({ success: false, error: 'La máscara cambió desde que la abriste. Actualiza la lista e inténtalo de nuevo.' }, { status: 409, headers: noStore });

  const replacedPaths = [previous.preview_image_path, previous.printable_pdf_path]
    .filter((path): path is string => typeof path === 'string' && Boolean(path))
    .filter((path) => path !== mask.preview_image_path && path !== mask.printable_pdf_path);
  await Promise.all(replacedPaths.map((path) => removeUnreferencedCharacterMaskMedia(path).catch(() => false)));
  revalidateCharacterMaskPages();
  return NextResponse.json({ success: true, mask: mapCharacterMask(data) }, { headers: noStore });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(['owner', 'admin', 'editor']);
  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ success: false, error: 'Selecciona una máscara válida.' }, { status: 400, headers: noStore });
  const supabase = createSupabaseAdminClient();
  const { data: previous, error: readError } = await supabase.from('character_masks')
    .select('preview_image_path, printable_pdf_path')
    .eq('id', id)
    .maybeSingle();
  if (readError) return NextResponse.json({ success: false, error: 'No se pudo comprobar la máscara existente.' }, { status: 503, headers: noStore });
  if (!previous) return NextResponse.json({ success: false, error: 'La máscara ya no existe. Actualiza la lista.' }, { status: 404, headers: noStore });
  const { error } = await supabase.from('character_masks').delete().eq('id', id);
  if (error) return NextResponse.json({ success: false, error: 'No se pudo eliminar la máscara.' }, { status: 503, headers: noStore });
  await Promise.all([previous.preview_image_path, previous.printable_pdf_path]
    .filter((path): path is string => typeof path === 'string' && Boolean(path))
    .map((path) => removeUnreferencedCharacterMaskMedia(path).catch(() => false)));
  revalidateCharacterMaskPages();
  return NextResponse.json({ success: true }, { headers: noStore });
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const raw = await request.text();
    if (raw.length > 16_000) return null;
    const value: unknown = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function normalizeMask(body: Record<string, unknown>) {
  const localized = (value: unknown, max: number, required: boolean) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const row = value as Record<string, unknown>;
    if (['es', 'en'].some((locale) => typeof row[locale] !== 'string'
      || (row[locale] as string).length > max || (required && !(row[locale] as string).trim()))) return null;
    return { es: (row.es as string).trim(), en: (row.en as string).trim() };
  };
  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const characterSlug = typeof body.characterSlug === 'string' ? body.characterSlug.trim() : '';
  const title = localized(body.title, 120, true);
  const description = localized(body.description, 500, false);
  const previewImageUrl = typeof body.previewImageUrl === 'string' ? body.previewImageUrl.trim() : '';
  const previewImagePath = typeof body.previewImagePath === 'string' ? body.previewImagePath.trim() : '';
  const printablePdfUrl = typeof body.printablePdfUrl === 'string' ? body.printablePdfUrl.trim() : '';
  const printablePdfPath = typeof body.printablePdfPath === 'string' ? body.printablePdfPath.trim() : '';
  const sortOrder = body.sortOrder;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80
    || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(characterSlug) || characterSlug.length > 80
    || !title || !description || typeof sortOrder !== 'number' || !Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 10000
    || typeof body.isPublished !== 'boolean'
    || Boolean(previewImageUrl) !== Boolean(previewImagePath)
    || Boolean(printablePdfUrl) !== Boolean(printablePdfPath)
    || (previewImagePath && !isCharacterMaskAsset(previewImageUrl, previewImagePath, 'preview'))
    || (printablePdfPath && !isCharacterMaskAsset(printablePdfUrl, printablePdfPath, 'pdf'))) return null;
  return {
    slug, character_slug: characterSlug, title, description,
    preview_image_url: previewImageUrl, preview_image_path: previewImagePath,
    printable_pdf_url: printablePdfUrl, printable_pdf_path: printablePdfPath,
    sort_order: sortOrder, is_published: body.isPublished,
  };
}
