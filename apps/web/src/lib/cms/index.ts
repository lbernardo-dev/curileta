import 'server-only';

import { DatabaseCMSProvider } from '@curileta/cms';
import { SanityCMSProvider } from './sanity-provider';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const hasSanityConfig = Boolean(projectId && projectId !== 'curileta-demo');

if (process.env.NODE_ENV === 'production' && !hasSanityConfig) {
  console.warn('[CMS] Sanity no está configurado; el contenido se sirve desde el respaldo local.');
}

export const cmsProvider = hasSanityConfig
  ? new SanityCMSProvider()
  : new DatabaseCMSProvider();
