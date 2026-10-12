import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';
import {
  ADMIN_MANAGED_CONTENT_TYPES,
  createAdminManagedContent,
  isAdminManagedContentType,
  listAdminManagedContent,
  updateAdminManagedContent,
  validateManagedContentPayload,
  deleteAdminManagedContent,
  restoreAdminManagedContent,
} from '@/lib/managed-content.server';

const MAX_BODY_LENGTH = 220_000;

export async function GET(request: NextRequest) {
  await requireAdmin(['owner', 'admin', 'editor']);
  const requestedType = request.nextUrl.searchParams.get('type');
  if (requestedType && !isAdminManagedContentType(requestedType)) {
    return NextResponse.json({ error: 'El tipo de contenido no está disponible en este editor.' }, { status: 400 });
  }
  const contentType = isAdminManagedContentType(requestedType) ? requestedType : undefined;
  try {
    const includeDeleted = request.nextUrl.searchParams.get('includeDeleted') === 'true';
    const entries = await listAdminManagedContent(contentType, includeDeleted);
    return NextResponse.json({ success: true, entries, types: ADMIN_MANAGED_CONTENT_TYPES }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'No se pudieron cargar los contenidos administrados. Revisa las migraciones de Supabase.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: 'El registro no tiene un formato válido.' }, { status: 400 });
  const type = body.contentType;
  if (!isAdminManagedContentType(type) || type === 'siteSettings') {
    return NextResponse.json({ error: 'Este tipo de contenido no admite altas desde esta sección.' }, { status: 400 });
  }
  const payload = validateManagedContentPayload(type, body.payload);
  const contentId = readText(body.contentId, 120);
  const slug = normalizeSlug(body.slug);
  const sortOrder = readInteger(body.sortOrder, 0);
  const isPublished = body.isPublished === undefined ? true : body.isPublished;
  if (!payload || !contentId || payload.id !== contentId || sortOrder === null || typeof isPublished !== 'boolean'
    || (body.slug !== undefined && slug === undefined)
    || normalizedPayloadSlug(payload) !== slug) {
    return NextResponse.json({ error: 'Revisa el identificador, la ruta y los campos requeridos.' }, { status: 400 });
  }

  try {
    await createAdminManagedContent({
      contentType: type,
      contentId,
      slug: slug || null,
      payload,
      sortOrder,
      isPublished,
      userId: identity.userId,
    });
    revalidateContent(type);
    return NextResponse.json({ success: true });
  } catch (error) {
    return storageError(error);
  }
}

export async function PUT(request: NextRequest) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: 'El registro no tiene un formato válido.' }, { status: 400 });
  const type = body.contentType;
  if (!isAdminManagedContentType(type)) {
    return NextResponse.json({ error: 'El tipo de contenido no está disponible en este editor.' }, { status: 400 });
  }
  const payload = validateManagedContentPayload(type, body.payload);
  const contentId = readText(body.contentId, 120);
  const slug = normalizeSlug(body.slug);
  const sortOrder = readInteger(body.sortOrder, 0);
  const isPublished = body.isPublished;
  const expectedUpdatedAt = readText(body.expectedUpdatedAt, 60);
  if (!payload || !contentId || (type === 'siteSettings' && contentId !== 'siteSettings') || (type !== 'siteSettings' && payload.id !== contentId)
    || sortOrder === null || typeof isPublished !== 'boolean' || !expectedUpdatedAt
    || (body.slug !== undefined && slug === undefined)
    || normalizedPayloadSlug(payload) !== (type === 'siteSettings' ? null : slug)) {
    return NextResponse.json({ error: 'Revisa el identificador, la ruta y los campos requeridos.' }, { status: 400 });
  }

  try {
    await updateAdminManagedContent({
      contentType: type,
      contentId,
      slug: slug || null,
      payload,
      sortOrder,
      isPublished,
      expectedUpdatedAt,
      userId: identity.userId,
    });
    revalidateContent(type);
    return NextResponse.json({ success: true });
  } catch (error) {
    return storageError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const body = await readJson(request);
  if (!body || !isAdminManagedContentType(body.contentType) || body.contentType === 'siteSettings') {
    return NextResponse.json({ error: 'Selecciona un registro válido para recuperar.' }, { status: 400 });
  }
  const contentId = readText(body.contentId, 120);
  if (!contentId) return NextResponse.json({ error: 'Selecciona un registro válido para recuperar.' }, { status: 400 });
  try {
    await restoreAdminManagedContent(body.contentType, contentId, identity.userId);
    revalidateContent(body.contentType);
    return NextResponse.json({ success: true });
  } catch (error) {
    return storageError(error);
  }
}

export async function DELETE(request: NextRequest) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const body = await readJson(request);
  if (!body || !isAdminManagedContentType(body.contentType) || body.contentType === 'siteSettings') {
    return NextResponse.json({ error: 'Selecciona un registro válido para retirar.' }, { status: 400 });
  }
  const contentId = readText(body.contentId, 120);
  if (!contentId) return NextResponse.json({ error: 'Selecciona un registro válido para retirar.' }, { status: 400 });
  try {
    await deleteAdminManagedContent(body.contentType, contentId, identity.userId);
    revalidateContent(body.contentType);
    return NextResponse.json({ success: true });
  } catch (error) {
    return storageError(error);
  }
}

async function readJson(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_LENGTH) return null;
    const body = JSON.parse(raw) as unknown;
    return body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function readText(value: unknown, maxLength: number) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength ? value.trim() : null;
}

function normalizeSlug(value: unknown) {
  if (value === null || value === '') return null;
  if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || value.length > 120) return undefined;
  return value;
}

function normalizedPayloadSlug(payload: Record<string, unknown>) {
  return typeof payload.slug === 'string' && payload.slug.length > 0 ? payload.slug : null;
}

function readInteger(value: unknown, fallback: number) {
  if (value === undefined) return fallback;
  return typeof value === 'number' && Number.isInteger(value) ? value : null;
}

function storageError(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('Ya existe')) return NextResponse.json({ error: message }, { status: 409 });
  if (message.includes('cambió en otra sesión')) return NextResponse.json({ error: message }, { status: 409 });
  if (message.includes('ya no existe')) return NextResponse.json({ error: message }, { status: 404 });
  if (typeof error === 'object' && error && 'code' in error && error.code === '23505') {
    return NextResponse.json({ error: 'Ya existe un registro con esa ruta. Elige otra.' }, { status: 409 });
  }
  return NextResponse.json({ error: 'No se pudo guardar el contenido en Supabase.' }, { status: 503 });
}

function revalidateContent(type: string) {
  revalidateTag('cms:' + type, 'max');
  revalidateTag('cms:siteSettings', 'max');
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/personajes/[slug]', 'page');
  revalidatePath('/[locale]/libros', 'page');
  revalidatePath('/[locale]/libros/[slug]', 'page');
  revalidatePath('/[locale]/destinos', 'page');
  revalidatePath('/[locale]/destinos/[slug]', 'page');
  revalidatePath('/[locale]/mundo', 'page');
  revalidatePath('/[locale]/fondos', 'page');
  revalidatePath('/[locale]/colaboraciones', 'page');
  revalidatePath('/sitemap.xml');
}
