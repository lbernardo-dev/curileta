import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import {
  isCharacterMaskAsset,
  mapCharacterMask,
  revalidateCharacterMaskPages,
} from '@/lib/character-masks.server';

const noStore = { 'Cache-Control': 'private, no-store' };
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET() {
  await requireAdmin(['owner', 'admin', 'editor']);
  try {
    const supabase = createSupabaseAdminClient();
    const [{ data, error }, downloads] = await Promise.all([
      supabase.from('character_masks').select('*').order('sort_order').order('character_slug'),
      readDownloadTotals(supabase),
    ]);
    if (error || !Array.isArray(data)) throw error || new Error('Missing character masks.');
    return NextResponse.json({
      success: true,
      masks: data.map((row) => ({ ...mapCharacterMask(row), downloads: downloads[row.character_slug] || 0 })),
    }, { headers: noStore });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudieron cargar las máscaras. Comprueba que la migración esté aplicada.' }, { status: 503, headers: noStore });
  }
}

export async function POST(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const body = await readJson(request);
  const mask = body && normalizeMask(body);
  if (!mask) return NextResponse.json({ success: false, error: 'Completa los identificadores, textos, vista previa y PDF con valores válidos.' }, { status: 400, headers: noStore });
  if (mask.is_published && (!mask.preview_image_url || !mask.printable_pdf_url)) {
    return NextResponse.json({ success: false, error: 'Para publicar una máscara, añade su imagen de vista previa y su PDF.' }, { status: 400, headers: noStore });
  }

  try {
    const { data, error } = await createSupabaseAdminClient()
      .from('character_masks')
      .insert({ ...mask, created_by: identity.userId, updated_by: identity.userId })
      .select('*')
      .single();
    if (error) return NextResponse.json({ success: false, error: error.code === '23505' ? 'Ya existe una máscara con ese identificador.' : 'No se pudo guardar la máscara.' }, { status: error.code === '23505' ? 409 : 503, headers: noStore });
    revalidateCharacterMaskPages();
    return NextResponse.json({ success: true, mask: mapCharacterMask(data) }, { status: 201, headers: noStore });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudo guardar la máscara. Comprueba la conexión y la migración.' }, { status: 503, headers: noStore });
  }
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
      || (row[locale] as string).length > max
      || (required && !(row[locale] as string).trim()))) return null;
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
  if (!slugPattern.test(slug) || slug.length > 80 || !slugPattern.test(characterSlug) || characterSlug.length > 80
    || !title || !description || typeof sortOrder !== 'number' || !Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 10000
    || typeof body.isPublished !== 'boolean'
    || Boolean(previewImageUrl) !== Boolean(previewImagePath)
    || Boolean(printablePdfUrl) !== Boolean(printablePdfPath)
    || (previewImagePath && !isCharacterMaskAsset(previewImageUrl, previewImagePath, 'preview'))
    || (printablePdfPath && !isCharacterMaskAsset(printablePdfUrl, printablePdfPath, 'pdf'))) return null;
  return {
    slug,
    character_slug: characterSlug,
    title,
    description,
    preview_image_url: previewImageUrl,
    preview_image_path: previewImagePath,
    printable_pdf_url: printablePdfUrl,
    printable_pdf_path: printablePdfPath,
    sort_order: sortOrder,
    is_published: body.isPublished,
  };
}

async function readDownloadTotals(supabase: ReturnType<typeof createSupabaseAdminClient>) {
  const totals: Record<string, number> = {};
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.from('analytics_daily')
      .select('path, event_count')
      .eq('event_name', 'mask_download')
      .order('path')
      .range(offset, offset + 999);
    if (error) throw error;
    for (const row of data || []) {
      const match = row.path.match(/^\/(?:es|en)\/mascaras\/([a-z0-9-]+)$/);
      if (match) totals[match[1]] = (totals[match[1]] || 0) + Number(row.event_count || 0);
    }
    if (!data || data.length < 1000) return totals;
  }
}
