import 'server-only';

import type { CMSProvider } from '@curileta/cms';
import { DatabaseCMSProvider } from '@curileta/cms/server';
import { getPublicManagedSongs, getPublicManagedVideos } from '@/lib/youtube-content.server';
import { getManagedEventState, listManagedEvents, toSeasonalEvent } from '@/lib/events.server';
import { SanityCMSProvider } from './sanity-provider';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const hasSanityConfig = Boolean(projectId && projectId !== 'curileta-demo');

if (process.env.NODE_ENV === 'production' && !hasSanityConfig) {
  console.warn('[CMS] Sanity no está configurado; el contenido se sirve desde el respaldo local.');
}

const cmsContentSourceInstance: CMSProvider = hasSanityConfig
  ? new SanityCMSProvider()
  : new DatabaseCMSProvider();

export const cmsContentSource = cmsContentSourceInstance;

export async function getYouTubeSourceItemsForMediaCleanup() {
  const [videos, songs] = cmsContentSourceInstance instanceof SanityCMSProvider
    ? await Promise.all([
      cmsContentSourceInstance.getVideosForMediaCleanup(),
      cmsContentSourceInstance.getSongsForMediaCleanup(),
    ])
    : await Promise.all([
      cmsContentSourceInstance.getVideos('es'),
      cmsContentSourceInstance.getSongs('es'),
    ]);
  return [...videos, ...songs];
}

export const cmsProvider = new Proxy(cmsContentSource, {
  get(target, property) {
    if (property === 'getActiveEvent') {
      return async (locale?: string, referenceDate?: Date) => {
        const managed = await getManagedEventState(referenceDate);
        if (managed.configured && managed.hasManagedEvents) return managed.event;
        return target.getActiveEvent(locale, referenceDate);
      };
    }
    if (property === 'getSeasonalEvents') {
      return async (locale?: string) => {
        const [managedEvents, sourceEvents] = await Promise.all([
          listManagedEvents().catch(() => []),
          target.getSeasonalEvents(locale),
        ]);
        if (!managedEvents.length) return sourceEvents;
        const eventsBySlug = new Map(sourceEvents.map((event) => [event.slug, event]));
        for (const event of managedEvents) eventsBySlug.set(event.slug, toSeasonalEvent(event));
        return [...eventsBySlug.values()];
      };
    }
    if (property === 'getVideos') {
      return async (locale?: string) => getPublicManagedVideos(await target.getVideos(locale));
    }
    if (property === 'getSongs') {
      return async (locale?: string) => getPublicManagedSongs(await target.getSongs(locale));
    }
    if (property === 'getLetters') {
      return async (locale?: string) => {
        if (process.env.NODE_ENV === 'production' && !hasSanityConfig) return [];
        return target.getLetters(locale);
      };
    }

    const value = Reflect.get(target, property, target);
    return typeof value === 'function' ? value.bind(target) : value;
  },
}) as CMSProvider;
