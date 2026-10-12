import 'server-only';

import type { CMSProvider } from '@curileta/cms';
import { getPublicManagedSongs, getPublicManagedVideos } from '@/lib/youtube-content.server';
import { getManagedEventState, listManagedEvents, toSeasonalEvent } from '@/lib/events.server';
import { SupabaseCMSProvider } from './supabase-provider';

const cmsContentSourceInstance = new SupabaseCMSProvider();
export const cmsContentSource: CMSProvider = cmsContentSourceInstance;

export async function getYouTubeSourceItemsForMediaCleanup() {
  const [videos, songs] = await Promise.all([
    cmsContentSourceInstance.getVideosForMediaCleanup(),
    cmsContentSourceInstance.getSongsForMediaCleanup(),
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

    const value = Reflect.get(target, property, target);
    return typeof value === 'function' ? value.bind(target) : value;
  },
}) as CMSProvider;
