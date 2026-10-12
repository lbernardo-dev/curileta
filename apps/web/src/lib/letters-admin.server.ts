import 'server-only';

import type { LetterItem, LetterPhoto } from '@curileta/cms';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export type ManagedLetter = LetterItem & { documentId: string; updatedAt: string; isDeleted: boolean };

interface LetterRow {
  id: string;
  content_id: string;
  payload: LetterItem;
  updated_at: string;
  is_deleted: boolean;
}

function normalizePhotos(photos: unknown): LetterPhoto[] {
  if (!Array.isArray(photos)) return [];
  return photos.map((photo) => {
    const value = photo as LetterPhoto;
    return { ...value, visibility: value.visibility || 'public' };
  });
}

function mapLetter(row: LetterRow): ManagedLetter {
  return {
    ...row.payload,
    publicationStatus: row.payload.publicationStatus || 'public',
    photos: normalizePhotos(row.payload.photos),
    documentId: row.content_id,
    updatedAt: row.updated_at,
    isDeleted: row.is_deleted,
  };
}

export async function listManagedLetters(includeDeleted = false): Promise<ManagedLetter[]> {
  let query = createSupabaseAdminClient()
    .from('managed_content_entries')
    .select('id, content_id, payload, updated_at, is_deleted')
    .eq('content_type', 'letter')
    .order('sort_order', { ascending: true })
    .order('content_id', { ascending: true });
  if (!includeDeleted) query = query.eq('is_deleted', false);
  const { data, error } = await query;
  if (error) throw error;
  return ((data || []) as unknown as LetterRow[]).map(mapLetter);
}

export async function saveManagedLetter(letter: LetterItem, userId: string, previousId?: string) {
  const client = createSupabaseAdminClient();
  if (previousId) {
    const { data: current, error: readError } = await client.from('managed_content_entries')
      .select('id, content_id, is_deleted')
      .eq('content_type', 'letter')
      .eq('content_id', previousId)
      .maybeSingle();
    if (readError) throw readError;
    if (!current || current.is_deleted) throw new Error('La carta ya no existe. Actualiza la lista e inténtalo de nuevo.');

    if (letter.id !== previousId) {
      const { data: collision, error: collisionError } = await client.from('managed_content_entries')
        .select('content_id, is_deleted')
        .eq('content_type', 'letter')
        .eq('content_id', letter.id)
        .maybeSingle();
      if (collisionError) throw collisionError;
      if (collision && !collision.is_deleted) throw new Error('Ya existe una carta con ese identificador.');
    }

    const { error } = await client.from('managed_content_entries')
      .update({
        content_id: letter.id,
        slug: null,
        payload: letter,
        sort_order: letter.order,
        is_published: true,
        is_deleted: false,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', current.id);
    if (error) throw error;
    return;
  }

  const { data: current, error: readError } = await client.from('managed_content_entries')
    .select('id, is_deleted')
    .eq('content_type', 'letter')
    .eq('content_id', letter.id)
    .maybeSingle();
  if (readError) throw readError;
  if (current && !current.is_deleted) throw new Error('Ya existe una carta con ese identificador.');

  const { error } = await client.from('managed_content_entries').upsert({
    content_type: 'letter',
    content_id: letter.id,
    slug: null,
    payload: letter,
    sort_order: letter.order,
    is_published: true,
    is_deleted: false,
    updated_by: userId,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'content_type,content_id' });
  if (error) throw error;
}

export async function deleteManagedLetter(id: string, userId: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from('managed_content_entries')
    .update({ is_deleted: true, updated_by: userId, updated_at: new Date().toISOString() })
    .eq('content_type', 'letter')
    .eq('content_id', id)
    .eq('is_deleted', false)
    .select('content_id')
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function restoreManagedLetter(id: string, userId: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from('managed_content_entries')
    .update({ is_deleted: false, updated_by: userId, updated_at: new Date().toISOString() })
    .eq('content_type', 'letter')
    .eq('content_id', id)
    .eq('is_deleted', true)
    .select('content_id')
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function isLetterPhotoReferenced(path: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from('managed_content_entries')
    .select('payload')
    .eq('content_type', 'letter');
  if (error) throw error;
  return (data || []).some((row) => {
    const payload = row.payload && typeof row.payload === 'object' ? row.payload as Record<string, unknown> : {};
    const photos = Array.isArray(payload.photos) ? payload.photos : [];
    return photos.some((photo) => {
      if (!photo || typeof photo !== 'object') return false;
      const item = photo as Record<string, unknown>;
      return item.storagePath === path || item.censoredStoragePath === path;
    });
  });
}
