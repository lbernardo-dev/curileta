import 'server-only';

import { DatabaseCMSProvider, type CMSProvider } from '@curileta/cms';
import { getPublicManagedSongs, getPublicManagedVideos } from '@/lib/youtube-content.server';
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
