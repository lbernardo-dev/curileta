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

function getContentIdentity(item: { id?: unknown; youtubeId?: unknown }): string | null {
  if (typeof item.youtubeId === 'string' && item.youtubeId.trim()) {
    return `youtube:${item.youtubeId.trim()}`;
  }
  if (typeof item.id === 'string' && item.id.trim()) {
    return `id:${item.id.trim()}`;
  }
  return null;
}

function mergeItems<T extends Video | Song>(
  kind: YouTubeManagedKind,
  source: T[],
  overrides: YouTubeContentOverride[],
  includeUnpublished: boolean,
): Array<(T & { itemKey: string; inherited: boolean; isPublished: boolean })> {
  const matchingRows = overrides.filter((row) => row.content_type === kind);
  const byKey = new Map(matchingRows.map((row) => [row.item_key, row]));
  const byIdentity = new Map<string, YouTubeContentOverride>();
  for (const row of matchingRows) {
    const identity = getContentIdentity(row.payload);
    if (identity && !byIdentity.has(identity)) byIdentity.set(identity, row);
  }

  // The editorial catalogue can use a slug as id while a YouTube override uses
  // the YouTube video id. Collapse both representations by their shared video id.
  const sourceItems: T[] = [];
  const sourceIdentities = new Set<string>();
  for (const item of source) {
    const identity = getContentIdentity(item);
    if (identity && sourceIdentities.has(identity)) continue;
    if (identity) sourceIdentities.add(identity);
    sourceItems.push(item);
  }

  const sourceKeys = new Set<string>();
  const merged = sourceItems.map((item) => {
    const itemKey = makeYouTubeItemKey(kind, item.id);
    const identity = getContentIdentity(item);
    sourceKeys.add(itemKey);
    const override = byKey.get(itemKey) || (identity ? byIdentity.get(identity) : undefined);
    if (!override) {
      return {
        ...item,
        itemKey,
        inherited: true,
        isPublished: item.isPublished !== false,
      };
    }
    sourceKeys.add(override.item_key);
    if (override.is_deleted) return null;
    return {
      ...item,
      ...override.payload,
      itemKey: override.item_key,
      inherited: true,
      isPublished: override.payload.isPublished !== false,
    } as T & { itemKey: string; inherited: boolean; isPublished: boolean };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  const additions = matchingRows
    .filter((row) => !sourceKeys.has(row.item_key) && !row.is_deleted)
    .filter((row) => {
      const identity = getContentIdentity(row.payload);
      return !identity || !sourceIdentities.has(identity);
    })
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
