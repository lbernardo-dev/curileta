import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { ADMIN_MANAGED_CONTENT_TYPES, type AdminManagedContentType, type ManagedContentEntry } from './managed-content.types';

export { ADMIN_MANAGED_CONTENT_TYPES } from './managed-content.types';

type DatabaseRow = {
  id: string;
  content_type: AdminManagedContentType;
  content_id: string;
  slug: string | null;
  payload: Record<string, unknown>;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
  is_deleted: boolean;
};

export function isAdminManagedContentType(value: unknown): value is AdminManagedContentType {
  return typeof value === 'string' && ADMIN_MANAGED_CONTENT_TYPES.includes(value as AdminManagedContentType);
}

function mapRow(row: DatabaseRow): ManagedContentEntry {
  return {
    contentType: row.content_type,
    contentId: row.content_id,
    slug: row.slug,
    payload: row.payload,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    isDeleted: row.is_deleted,
    updatedAt: row.updated_at,
  };
}

export async function listAdminManagedContent(contentType?: AdminManagedContentType, includeDeleted = false) {
  let query = createSupabaseAdminClient()
    .from('managed_content_entries')
    .select('id, content_type, content_id, slug, payload, sort_order, is_published, updated_at, is_deleted')
    .in('content_type', [...ADMIN_MANAGED_CONTENT_TYPES])
    .order('content_type', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('content_id', { ascending: true });
  if (contentType) query = query.eq('content_type', contentType);
  if (!includeDeleted) query = query.eq('is_deleted', false);
  const { data, error } = await query;
  if (error) throw error;
  return ((data || []) as unknown as DatabaseRow[]).map(mapRow);
}

export function validateManagedContentPayload(type: AdminManagedContentType, value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const payload = value as Record<string, unknown>;
  let serialized: string;
  try {
    serialized = JSON.stringify(payload);
  } catch {
    return null;
  }
  if (serialized.length > 180_000 || hasUnsafeShape(payload, 0)) return null;

  if (type === 'siteSettings') {
    if (!hasText(payload.siteName) || !hasLocalized(payload.heroTagline) || !hasLocalized(payload.heroSubtitle)
      || !hasLocalized(payload.featuredQuote) || !Array.isArray(payload.statsBadges) || payload.statsBadges.length > 24) return null;
    if (payload.statsBadges.some((badge) => !badge || typeof badge !== 'object' || Array.isArray(badge)
      || !hasText((badge as Record<string, unknown>).icon) || !hasLocalized((badge as Record<string, unknown>).label)
      || !hasText((badge as Record<string, unknown>).value))) return null;
    if (payload.homepageSections !== undefined) {
      const sections = payload.homepageSections;
      const allowed = new Set(['hero', 'seasonalEvent', 'story', 'globe', 'radar', 'letters', 'characters', 'books', 'videos', 'wallpapers', 'roadmap', 'collaborations', 'closing']);
      if (!Array.isArray(sections) || sections.length > allowed.size) return null;
      const keys = new Set<string>();
      for (const section of sections) {
        if (!section || typeof section !== 'object' || Array.isArray(section)) return null;
        const item = section as Record<string, unknown>;
        if (typeof item.key !== 'string' || !allowed.has(item.key) || keys.has(item.key)
          || typeof item.visible !== 'boolean' || typeof item.order !== 'number' || !Number.isInteger(item.order)
          || item.order < 0 || item.order > 10_000) return null;
        keys.add(item.key);
      }
    }
    return payload;
  }

  const id = readText(payload.id, 120);
  if (!id || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(id)) return null;
  if (type === 'character') {
    if (!hasText(payload.name || payload.characterName) || !isSlug(payload.slug)
      || !hasLocalized(payload.shortDescription) || !hasText(nested(payload.mainImage, 'url'))) return null;
  }
  if (type === 'book') {
    if (!isSlug(payload.slug) || !hasLocalized(payload.title) || !hasLocalized(payload.description)
      || !hasText(nested(payload.coverImage || payload.cover, 'url'))) return null;
  }
  if (type === 'adventure') {
    if (!isSlug(payload.slug) || !hasLocalized(payload.title) || !hasLocalized(payload.synopsis)
      || !hasText(nested(payload.heroImage, 'url'))) return null;
  }
  if (type === 'trailWaypoint') {
    if (!hasInteger(payload.stepNumber) || !hasLocalized(payload.title) || !hasLocalized(payload.note)) return null;
  }
  if (type === 'narrativeMilestone') {
    if (!hasInteger(payload.order) || !hasLocalized(payload.place) || !hasLocalized(payload.country)
      || !hasLocalized(payload.whatHappens)) return null;
  }
  if (type === 'mentionedCuriosity') {
    if (!hasLocalized(payload.name) || !hasLocalized(payload.country) || !hasLocalized(payload.curiosityFact)) return null;
  }
  if (type === 'wallpaper') {
    if (!isSlug(payload.slug) || !hasLocalized(payload.title) || !hasText(payload.deviceType)
      || !hasText(payload.thumbnail) || !hasText(payload.fullImageUrl)) return null;
  }
  if (type === 'universeRoadmapItem' || type === 'collaboration') {
    if (!hasLocalized(payload.title) || !hasLocalized(payload.desc)) return null;
  }
  return payload;
}

function hasUnsafeShape(value: unknown, depth: number): boolean {
  if (depth > 10) return true;
  if (Array.isArray(value)) return value.length > 200 || value.some((item) => hasUnsafeShape(item, depth + 1));
  if (!value || typeof value !== 'object') return false;
  const entries = Object.entries(value);
  return entries.length > 100
    || entries.some(([key, item]) => key.length > 100 || key === '__proto__' || hasUnsafeShape(item, depth + 1));
}

function nested(value: unknown, key: string) {
  return value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined;
}

function readText(value: unknown, maxLength: number) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength ? value.trim() : null;
}

function hasText(value: unknown) {
  return readText(value, 10_000) !== null;
}

function hasLocalized(value: unknown) {
  return Boolean(value && typeof value === 'object' && hasText((value as Record<string, unknown>).es));
}

function hasInteger(value: unknown) {
  return typeof value === 'number' && Number.isInteger(value);
}

function isSlug(value: unknown) {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 120;
}

export async function createAdminManagedContent(input: {
  contentType: AdminManagedContentType;
  contentId: string;
  slug: string | null;
  payload: Record<string, unknown>;
  sortOrder: number;
  isPublished: boolean;
  userId: string;
}) {
  const client = createSupabaseAdminClient();
  const { data: existing, error: existingError } = await client.from('managed_content_entries')
    .select('id, is_deleted')
    .eq('content_type', input.contentType)
    .eq('content_id', input.contentId)
    .maybeSingle();
  if (existingError) throw existingError;

  const row = {
    content_type: input.contentType,
    content_id: input.contentId,
    slug: input.slug,
    payload: input.payload,
    sort_order: input.sortOrder,
    is_published: input.isPublished,
    is_deleted: false,
    updated_by: input.userId,
    updated_at: new Date().toISOString(),
  };

  if (existing && !existing.is_deleted) throw new Error('Ya existe un registro con ese identificador.');
  const { error } = await client.from('managed_content_entries').upsert(row, { onConflict: 'content_type,content_id' });
  if (error) throw error;
}

export async function updateAdminManagedContent(input: {
  contentType: AdminManagedContentType;
  contentId: string;
  slug: string | null;
  payload: Record<string, unknown>;
  sortOrder: number;
  isPublished: boolean;
  expectedUpdatedAt: string;
  userId: string;
}) {
  const { data, error } = await createSupabaseAdminClient()
    .from('managed_content_entries')
    .update({
      slug: input.slug,
      payload: input.payload,
      sort_order: input.sortOrder,
      is_published: input.isPublished,
      updated_by: input.userId,
      updated_at: new Date().toISOString(),
    })
    .eq('content_type', input.contentType)
    .eq('content_id', input.contentId)
    .eq('updated_at', input.expectedUpdatedAt)
    .eq('is_deleted', false)
    .select('content_id')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('El contenido cambió en otra sesión. Recarga la lista antes de guardar.');
}

export async function deleteAdminManagedContent(type: AdminManagedContentType, id: string, userId: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from('managed_content_entries')
    .update({ is_deleted: true, updated_by: userId, updated_at: new Date().toISOString() })
    .eq('content_type', type)
    .eq('content_id', id)
    .eq('is_deleted', false)
    .select('content_id')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('El contenido ya no existe.');
}

export async function restoreAdminManagedContent(type: AdminManagedContentType, id: string, userId: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from('managed_content_entries')
    .update({ is_deleted: false, updated_by: userId, updated_at: new Date().toISOString() })
    .eq('content_type', type)
    .eq('content_id', id)
    .eq('is_deleted', true)
    .select('content_id')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('El contenido ya no existe.');
}
