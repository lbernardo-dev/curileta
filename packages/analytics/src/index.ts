export type AnalyticsEvent =
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

class PrivacySafeAnalytics implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics Event - No PII]`, event.name, event.properties);
    }
    // Implementación segura que no guarda IP ni identifiers personales
  }
}

export const analytics: AnalyticsProvider = new PrivacySafeAnalytics();
