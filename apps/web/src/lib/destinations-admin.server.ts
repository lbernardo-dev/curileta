import 'server-only';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import type { Location } from '@curileta/cms';

export function destinationRow(destination: Location, userId: string, homeSelectionManaged: boolean) {
  return {
    slug: destination.slug,
    content: destination,
    media: destination.media || [],
    segments: destination.segments || [],
    sort_order: destination.sortOrder || 0,
    is_published: destination.isPublished === true,
    show_on_home: homeSelectionManaged && destination.showOnHome === true,
    is_deleted: false,
    updated_by: userId,
    updated_at: new Date().toISOString(),
  };
}

export async function readDestinationBody(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 256_000) return null;
    const body = JSON.parse(raw) as unknown;
    return body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

export function destinationStorageUnavailable() {
  return NextResponse.json({ error: 'La tabla de destinos no está disponible. Aplica la migración de gestión de destinos en Supabase.' }, { status: 503 });
}

export function revalidateDestinations(...slugs: string[]) {
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/destinos', 'page');
  revalidatePath('/[locale]/destinos/[slug]', 'page');
  revalidatePath('/[locale]/mundo', 'page');
  for (const slug of slugs) revalidatePath(`/[locale]/destinos/${slug}`, 'page');
  revalidatePath('/api/v1/locations');
  revalidatePath('/sitemap.xml');
}
