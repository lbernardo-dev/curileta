import 'server-only';

import { createSupabaseAdminClient } from './supabase/server';

export async function getUpcomingEpisodeCharacterSlugs(): Promise<string[]> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('home_upcoming_episode_characters')
      .select('character_slugs')
      .eq('setting_key', 'next-episode')
      .maybeSingle();

    if (error) throw error;
    return Array.isArray(data?.character_slugs)
      ? data.character_slugs.filter((slug): slug is string => typeof slug === 'string')
      : [];
  } catch {
    return [];
  }
}
