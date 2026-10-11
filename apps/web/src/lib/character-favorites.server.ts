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
    const { data, error } = await supabase.rpc('get_character_favorite_ranking_data');
    if (error) throw error;

    const scores = new Map<string, { count: number; reachedAt: string | null }>();
    for (const row of (data || []) as Array<{
      character_slug?: string;
      favorite_count?: number | string;
      score_reached_at?: string | null;
    }>) {
      if (typeof row.character_slug !== 'string') continue;
      scores.set(row.character_slug, {
        count: Math.max(0, Number(row.favorite_count) || 0),
        reachedAt: typeof row.score_reached_at === 'string' ? row.score_reached_at : null,
      });
    }

    const sorted = characters
      .map((character) => ({
        slug: character.slug,
        name: character.name,
        count: scores.get(character.slug)?.count || 0,
        scoreReachedAt: scores.get(character.slug)?.reachedAt || null,
        rank: null as number | null,
      }))
      .sort((left, right) => {
        const scoreOrder = right.count - left.count;
        if (scoreOrder) return scoreOrder;

        if (left.count > 0 && right.count > 0) {
          const leftTime = left.scoreReachedAt ? Date.parse(left.scoreReachedAt) : Number.NaN;
          const rightTime = right.scoreReachedAt ? Date.parse(right.scoreReachedAt) : Number.NaN;
          if (Number.isFinite(leftTime) && Number.isFinite(rightTime) && leftTime !== rightTime) {
            return leftTime - rightTime;
          }
        }

        return left.name.localeCompare(right.name, locale);
      });

    sorted.forEach((item, index) => {
      if (item.count < 1) return;
      item.rank = index + 1;
    });

    return sorted.map((item) => ({
      slug: item.slug,
      name: item.name,
      count: item.count,
      rank: item.rank,
    }));
  } catch {
    return [];
  }
}
