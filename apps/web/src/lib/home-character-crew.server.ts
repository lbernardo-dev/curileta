import 'server-only';

import { createSupabaseAdminClient } from './supabase/server';

export interface HomeCharacterCrewSelection {
  chapter_slug: string;
  character_slugs: string[];
}

export async function getHomeCharacterCrewSelection(): Promise<HomeCharacterCrewSelection | null> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('home_character_crew_settings')
      .select('chapter_slug, character_slugs')
      .eq('setting_key', 'story-crew')
      .maybeSingle();
    if (error) throw error;
    return data as HomeCharacterCrewSelection | null;
  } catch {
    return null;
  }
}
