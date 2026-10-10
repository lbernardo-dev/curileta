import 'server-only';

import type { SiteSettings } from '@curileta/cms';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export type YouTubeChannelConfig = Pick<
  SiteSettings,
  | 'youtubeChannelUrl'
  | 'youtubeChannelTitle'
  | 'youtubeChannelDescription'
  | 'youtubeChannelTags'
  | 'youtubeChannelAvatarUrl'
  | 'youtubeChannelHeaderUrl'
>;

export async function resolveYouTubeChannelSettings(settings: SiteSettings): Promise<SiteSettings> {
  try {
    const { data, error } = await createSupabaseAdminClient()
      .from('youtube_channel_settings')
      .select('config')
      .eq('setting_key', 'primary')
      .maybeSingle();

    if (error || !data?.config || typeof data.config !== 'object') return settings;
    return { ...settings, ...(data.config as Partial<YouTubeChannelConfig>) };
  } catch {
    return settings;
  }
}
