import 'server-only';

import { cache } from 'react';

/** Share one clock snapshot across date-driven decisions in a server request. */
export const getRequestTimestamp = cache(() => Date.now());
