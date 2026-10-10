import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function getVideoVoteCounts(): Promise<Record<string, number>> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('analytics_daily')
      .select('path, event_count')
      .eq('event_name', 'video_vote');
    if (error) return {};

    const counts: Record<string, number> = {};
    for (const row of data || []) {
      const slug = row.path.match(/^\/(?:es|en)\/contenido\/video\/([a-zA-Z0-9_-]{1,100})$/)?.[1];
      if (slug) counts[slug] = (counts[slug] || 0) + Number(row.event_count || 0);
    }
    return counts;
  } catch {
    return {};
  }
}
