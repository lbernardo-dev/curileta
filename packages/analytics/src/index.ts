export type AnalyticsEvent =
  | { name: 'page_view'; properties: { path: string; locale: string } }
  | { name: 'book_view'; properties: { bookId: string; slug: string } }
  | { name: 'book_purchase_click'; properties: { bookId: string; storeName: string } }
  | { name: 'video_play'; properties: { videoId: string; videoSlug: string; title: string } }
  | { name: 'youtube_channel_click'; properties: { source: string } }
  | { name: 'character_view'; properties: { characterId: string; name: string } }
  | { name: 'map_destination_open'; properties: { destinationId: string; country: string } }
  | { name: 'song_play'; properties: { songId: string; title: string } }
  | { name: 'wallpaper_download'; properties: { slug: string } }
  | { name: 'collaboration_form_submit'; properties: { category: string } }
  | { name: 'newsletter_subscribe'; properties: { audience: 'adult' } }
  | { name: 'language_change'; properties: { fromLocale: string; toLocale: string } };

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
}

export type GoogleAnalyticsConsentChoice = 'accepted' | 'rejected';

const GOOGLE_ANALYTICS_CONSENT_KEY = 'curileta-analytics-consent-v1';
export const GOOGLE_ANALYTICS_CONSENT_CHANGE_EVENT = 'curileta:analytics-consent-change';
const GOOGLE_ANALYTICS_CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const GOOGLE_ANALYTICS_COOKIE_MAX_AGE = 180 * 24 * 60 * 60;

type StoredAnalyticsConsent = {
  choice: GoogleAnalyticsConsentChoice;
  recordedAt: number;
};

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
    __curiletaAnalyticsConsent?: GoogleAnalyticsConsentChoice | null;
    __curiletaAnalyticsConfigured?: boolean;
  }
}

export function isGoogleAnalyticsConfigured(): boolean {
  return process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ENABLED?.trim().toLowerCase() === 'true'
    && Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim());
}

export function isAnalyticsDoNotTrackEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const navigatorWithPrivacy = window.navigator as Navigator & { globalPrivacyControl?: boolean };
  return window.navigator.doNotTrack === '1'
    || navigatorWithPrivacy.globalPrivacyControl === true;
}

export function getGoogleAnalyticsConsent(): GoogleAnalyticsConsentChoice | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(GOOGLE_ANALYTICS_CONSENT_KEY);
    if (!raw) return null;
    const consent = JSON.parse(raw) as Partial<StoredAnalyticsConsent>;
    const age = Date.now() - Number(consent.recordedAt);
    if ((consent.choice !== 'accepted' && consent.choice !== 'rejected')
      || !Number.isFinite(age) || age < 0 || age >= GOOGLE_ANALYTICS_CONSENT_MAX_AGE) {
      window.localStorage.removeItem(GOOGLE_ANALYTICS_CONSENT_KEY);
      return null;
    }
    return consent.choice;
  } catch {
    return null;
  }
}

export function isGoogleAnalyticsAllowed(): boolean {
  return typeof window !== 'undefined'
    && isGoogleAnalyticsConfigured()
    && !isAnalyticsDoNotTrackEnabled()
    && (window.__curiletaAnalyticsConsent ?? getGoogleAnalyticsConsent()) === 'accepted';
}

function sanitizedPageLocation(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

function sanitizedReferrerOrigin(): string {
  if (!document.referrer) return '';
  try {
    return new URL(document.referrer).origin;
  } catch {
    return '';
  }
}

function ensureGoogleTag(): boolean {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!measurementId || !isGoogleAnalyticsConfigured() || typeof window === 'undefined' || !isGoogleAnalyticsAllowed()) return false;

  window.__curiletaAnalyticsConsent = 'accepted';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));

  if (!window.__curiletaAnalyticsConfigured) {
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      page_location: sanitizedPageLocation(),
      page_referrer: sanitizedReferrerOrigin(),
      cookie_expires: GOOGLE_ANALYTICS_COOKIE_MAX_AGE,
      cookie_update: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    window.__curiletaAnalyticsConfigured = true;
  } else {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  if (!document.getElementById('curileta-google-analytics')) {
    const script = document.createElement('script');
    script.id = 'curileta-google-analytics';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  return true;
}

function removeGoogleAnalyticsCookies(): void {
  if (typeof document === 'undefined') return;
  const names = document.cookie.split(';').map((cookie) => cookie.split('=')[0]?.trim() || '');
  for (const name of names.filter((cookieName) => /^_ga(?:_|$)/.test(cookieName))) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=curileta.com; SameSite=Lax; Secure`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.curileta.com; SameSite=Lax; Secure`;
  }
}

export function clearGoogleAnalyticsConsent(): void {
  if (typeof window === 'undefined') return;
  window.__curiletaAnalyticsConsent = null;
  try {
    window.localStorage.removeItem(GOOGLE_ANALYTICS_CONSENT_KEY);
  } catch {
    // Privacy signals still block analytics when browser storage is unavailable.
  }
  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  document.getElementById('curileta-google-analytics')?.remove();
  window.__curiletaAnalyticsConfigured = false;
  removeGoogleAnalyticsCookies();
  window.dispatchEvent(new Event(GOOGLE_ANALYTICS_CONSENT_CHANGE_EVENT));
}

export function saveGoogleAnalyticsConsent(choice: GoogleAnalyticsConsentChoice): void {
  if (typeof window === 'undefined') return;
  const effectiveChoice = choice === 'accepted'
    && isGoogleAnalyticsConfigured()
    && !isAnalyticsDoNotTrackEnabled()
    ? 'accepted'
    : 'rejected';
  const previousChoice = window.__curiletaAnalyticsConsent ?? getGoogleAnalyticsConsent();
  window.__curiletaAnalyticsConsent = effectiveChoice;
  try {
    window.localStorage.setItem(GOOGLE_ANALYTICS_CONSENT_KEY, JSON.stringify({ choice: effectiveChoice, recordedAt: Date.now() }));
  } catch {
    // The current page still honors an explicit choice if storage is unavailable.
  }
  window.dispatchEvent(new Event(GOOGLE_ANALYTICS_CONSENT_CHANGE_EVENT));

  if (effectiveChoice === 'accepted') {
    if (ensureGoogleTag() && previousChoice !== 'accepted') {
      const path = window.location.pathname;
      const locale = path.split('/')[1] === 'en' ? 'en' : 'es';
      trackGoogleAnalyticsEvent({ name: 'page_view', properties: { path, locale } });
    }
    return;
  }

  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  removeGoogleAnalyticsCookies();
}

function trackGoogleAnalyticsEvent(event: AnalyticsEvent): void {
  if (!isGoogleAnalyticsAllowed() || !ensureGoogleTag() || !window.gtag) return;
  const pagePath = window.location.pathname;
  const locale = pagePath.split('/')[1] === 'en' ? 'en' : 'es';
  const contentTypes: Partial<Record<AnalyticsEvent['name'], string>> = {
    book_view: 'book',
    book_purchase_click: 'book',
    video_play: 'video',
    character_view: 'character',
    map_destination_open: 'destination',
    song_play: 'song',
    wallpaper_download: 'wallpaper',
  };

  window.gtag('event', event.name, {
    page_location: sanitizedPageLocation(),
    page_path: pagePath,
    language: locale,
    ...(contentTypes[event.name] ? { content_type: contentTypes[event.name] } : {}),
  });
}

export type ContentShareChannel = 'native' | 'copy' | 'whatsapp' | 'telegram' | 'email' | 'sms' | 'facebook' | 'linkedin' | 'x';
export type ShareableContentType = 'video' | 'book' | 'character' | 'song' | 'adventure' | 'location' | 'wallpaper' | 'gallery' | 'seasonalEvent';

export async function recordContentShare(
  channel: ContentShareChannel,
  contentType: ShareableContentType,
  contentSlug: string,
): Promise<boolean> {
  if (typeof window === 'undefined' || isAnalyticsDoNotTrackEnabled()) return false;
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
    if (typeof window === 'undefined' || isAnalyticsDoNotTrackEnabled()) return;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics Event - No PII]`, event.name, event.properties);
    }

    const supportedEvents = new Set([
      'page_view',
      'book_view',
      'book_purchase_click',
      'video_play',
      'character_view',
      'map_destination_open',
      'song_play',
      'wallpaper_download',
    ]);
    if (!supportedEvents.has(event.name)) return;

    const path = window.location.pathname;
    const locale = path.split('/')[1] === 'en' ? 'en' : 'es';
    trackGoogleAnalyticsEvent(event);
    void fetch('/api/admin/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: event.name,
        path,
        locale,
        ...(event.name === 'video_play' ? { contentType: 'video', contentSlug: event.properties.videoSlug } : {}),
      }),
      keepalive: true,
    }).catch(() => undefined);
  }
}

export const analytics: AnalyticsProvider = new PrivacySafeAnalytics();
