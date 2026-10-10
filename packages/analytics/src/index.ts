export type AnalyticsEvent =
  | { name: 'page_view'; properties: { path: string; locale: string } }
  | { name: 'book_view'; properties: { bookId: string; slug: string } }
  | { name: 'book_purchase_click'; properties: { bookId: string; storeName: string } }
  | { name: 'video_play'; properties: { videoId: string; title: string } }
  | { name: 'youtube_channel_click'; properties: { source: string } }
  | { name: 'character_view'; properties: { characterId: string; name: string } }
  | { name: 'map_destination_open'; properties: { destinationId: string; country: string } }
  | { name: 'song_play'; properties: { songId: string; title: string } }
  | { name: 'collaboration_form_submit'; properties: { category: string } }
  | { name: 'newsletter_subscribe'; properties: { audience: 'adult' } }
  | { name: 'language_change'; properties: { fromLocale: string; toLocale: string } };

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
}

export type ContentShareChannel = 'native' | 'copy' | 'whatsapp' | 'telegram' | 'email' | 'sms' | 'facebook' | 'linkedin' | 'x';
export type ShareableContentType = 'video' | 'book' | 'character' | 'song' | 'adventure' | 'location' | 'wallpaper' | 'seasonalEvent';

export async function recordContentShare(
  channel: ContentShareChannel,
  contentType: ShareableContentType,
  contentSlug: string,
): Promise<boolean> {
  if (typeof window === 'undefined' || window.navigator.doNotTrack === '1') return false;
  const path = window.location.pathname;
  const locale = path.split('/')[1] === 'en' ? 'en' : 'es';
  try {
    const response = await fetch('/api/admin/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: `content_share_${channel}`,
        path,
        locale,
        contentType,
        contentSlug,
      }),
      keepalive: true,
    });
    return response.ok;
  } catch {
    return false;
  }
}

class PrivacySafeAnalytics implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics Event - No PII]`, event.name, event.properties);
    }

    if (typeof window === 'undefined' || window.navigator.doNotTrack === '1') return;

    const supportedEvents = new Set([
      'page_view',
      'book_view',
      'book_purchase_click',
      'video_play',
      'character_view',
      'map_destination_open',
      'song_play',
    ]);
    if (!supportedEvents.has(event.name)) return;

    const path = window.location.pathname;
    const locale = path.split('/')[1] === 'en' ? 'en' : 'es';
    void fetch('/api/admin/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName: event.name, path, locale }),
      keepalive: true,
    }).catch(() => undefined);
  }
}

export const analytics: AnalyticsProvider = new PrivacySafeAnalytics();
