import 'server-only';

import { createHash } from 'node:crypto';
import type { CharacterFavoriteRanking } from './character-favorites';
import { createSupabaseAdminClient } from './supabase/server';
import { cmsProvider } from './cms';

export function hashFavoriteVisitorToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function isValidFavoriteVisitorToken(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9-]{36}$/i.test(value);
}

export async function getCharacterFavoriteRankings(locale: string): Promise<CharacterFavoriteRanking[]> {
  try {
    const [characters, supabase] = await Promise.all([
      cmsProvider.getCharacters(locale),
      Promise.resolve(createSupabaseAdminClient()),
    ]);
    const { data, error } = await supabase.rpc('get_character_favorite_counts');
    if (error) throw error;

    const counts = new Map<string, number>();
    for (const row of (data || []) as Array<{ character_slug?: string; favorite_count?: number | string }>) {
      if (typeof row.character_slug !== 'string') continue;
      counts.set(row.character_slug, Math.max(0, Number(row.favorite_count) || 0));
    }

    const sorted = characters
      .map((character) => ({
        slug: character.slug,
        name: character.name,
        count: counts.get(character.slug) || 0,
        rank: null as number | null,
      }))
      .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, locale));

    let previousCount = -1;
    let previousRank = 0;
    sorted.forEach((item, index) => {
      if (item.count < 1) return;
      if (item.count !== previousCount) previousRank = index + 1;
      item.rank = previousRank;
      previousCount = item.count;
    });

    return sorted;
  } catch {
    return [];
  }
}
