export interface CharacterFavoriteRanking {
  slug: string;
  name: string;
  count: number;
  rank: number | null;
}

export interface CharacterFavoriteDailyRow {
  day: string;
  character_slug: string;
  action: 'added' | 'removed';
  event_count: number;
}

export const CHARACTER_FAVORITE_VISITOR_KEY = 'curileta:character-favorites:visitor';
