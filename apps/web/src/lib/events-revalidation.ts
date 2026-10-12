import 'server-only';

import { revalidatePath } from 'next/cache';

export function revalidateEventPages() {
  revalidatePath('/[locale]', 'layout');
  revalidatePath('/[locale]/eventos', 'page');
  revalidatePath('/[locale]/novedades', 'page');
  revalidatePath('/api/v1/events/active');
  revalidatePath('/sitemap.xml');
}
