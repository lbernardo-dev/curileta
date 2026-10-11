import 'server-only';

import type { Song, Video } from '@curileta/cms';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import type { ManagedSong, ManagedVideo, YouTubeManagedKind } from './youtube-content.types';

const tableName = 'youtube_content_overrides';

interface YouTubeContentOverride {
  item_key: string;
  content_type: YouTubeManagedKind;
  payload: Record<string, unknown>;
  is_deleted: boolean;
}

export interface AdminYouTubeContent {
  items: Array<ManagedVideo | ManagedSong>;
  storageAvailable: boolean;
}

async function readOverrides(): Promise<{ rows: YouTubeContentOverride[]; available: boolean }> {
  try {
    const { data, error } = await createSupabaseAdminClient()
      .from(tableName)
      .select('item_key, content_type, payload, is_deleted');
    if (error) return { rows: [], available: false };
    return { rows: (data || []) as YouTubeContentOverride[], available: true };
  } catch {
    return { rows: [], available: false };
  }
}

export function makeYouTubeItemKey(kind: YouTubeManagedKind, id: string) {
  return `${kind}:${Buffer.from(id, 'utf8').toString('base64url')}`;
}

function mergeItems<T extends Video | Song>(
  kind: YouTubeManagedKind,
  source: T[],
  overrides: YouTubeContentOverride[],
  includeUnpublished: boolean,
): Array<(T & { itemKey: string; inherited: boolean; isPublished: boolean })> {
  const matchingRows = overrides.filter((row) => row.content_type === kind);
  const byKey = new Map(matchingRows.map((row) => [row.item_key, row]));
  const sourceKeys = new Set<string>();
  const merged = source.map((item) => {
    const itemKey = makeYouTubeItemKey(kind, item.id);
    sourceKeys.add(itemKey);
    const override = byKey.get(itemKey);
    if (!override) {
      return {
        ...item,
        itemKey,
        inherited: true,
        isPublished: item.isPublished !== false,
      };
    }
    if (override.is_deleted) return null;
    return {
      ...item,
      ...override.payload,
      itemKey,
      inherited: true,
      isPublished: override.payload.isPublished !== false,
    } as T & { itemKey: string; inherited: boolean; isPublished: boolean };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  const additions = matchingRows
    .filter((row) => !sourceKeys.has(row.item_key) && !row.is_deleted)
    .map((row) => ({
      ...row.payload,
      itemKey: row.item_key,
      inherited: false,
      isPublished: row.payload.isPublished !== false,
    }) as T & { itemKey: string; inherited: boolean; isPublished: boolean });

  const allItems = [...merged, ...additions];
  return includeUnpublished ? allItems : allItems.filter((item) => item.isPublished);
}

export async function getPublicManagedVideos(source: Video[]) {
  const { rows } = await readOverrides();
  return mergeItems('video', source, rows, false) as Array<Video & { itemKey: string; inherited: boolean; isPublished: boolean }>;
}

export async function getPublicManagedSongs(source: Song[]) {
  const { rows } = await readOverrides();
  return mergeItems('song', source, rows, false) as Array<Song & { itemKey: string; inherited: boolean; isPublished: boolean }>;
}

export async function getAdminManagedYouTubeContent(videos: Video[], songs: Song[]): Promise<AdminYouTubeContent> {
  const { rows, available } = await readOverrides();
  const items = [
    ...mergeItems('video', videos, rows, true).map((item) => ({ ...item, kind: 'video' as const })),
    ...mergeItems('song', songs, rows, true).map((item) => ({ ...item, kind: 'song' as const })),
  ];
  return { items, storageAvailable: available };
}

export async function saveYouTubeContentOverride(args: {
  itemKey: string;
  kind: YouTubeManagedKind;
  payload: Video | Song;
  userId: string;
}) {
  const { error } = await createSupabaseAdminClient().from(tableName).upsert({
    item_key: args.itemKey,
    content_type: args.kind,
    payload: args.payload,
    is_deleted: false,
    updated_by: args.userId,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'item_key' });
  if (error) throw error;
}

export async function deleteYouTubeContentOverride(itemKey: string, userId: string, inherited: boolean) {
  const client = createSupabaseAdminClient();
  if (!inherited) {
    const { error } = await client.from(tableName).delete().eq('item_key', itemKey);
    if (error) throw error;
    return;
  }

  const { error } = await client.from(tableName).upsert({
    item_key: itemKey,
    content_type: itemKey.startsWith('song:') ? 'song' : 'video',
    payload: {},
    is_deleted: true,
    updated_by: userId,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'item_key' });
  if (error) throw error;
}
