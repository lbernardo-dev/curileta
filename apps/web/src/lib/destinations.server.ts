import 'server-only';
import type { Locale } from '@curileta/i18n';
import type { Book, DestinationMedia, Location } from '@curileta/cms';
import { cmsProvider } from '@/lib/cms';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

interface ManagedDestinationRow {
  slug: string;
  content: Location;
  media: DestinationMedia[];
  segments: string[];
  sort_order: number;
  is_published: boolean;
  show_on_home: boolean;
  is_deleted: boolean;
}

export interface DestinationData {
  locations: Location[];
  storageAvailable: boolean;
  homeSelectionEnabled: boolean;
}

export async function getDestinationData(locale: Locale, includeDrafts = false): Promise<DestinationData> {
  const [baseLocations, books] = await Promise.all([
    cmsProvider.getLocations(locale),
    cmsProvider.getBooks(locale),
  ]);

  let storageAvailable = false;
  let rows: ManagedDestinationRow[] = [];
  let homeSelectionEnabled = false;
  try {
    const supabase = createSupabaseAdminClient();
    const [rowsResult, settingsResult] = await Promise.all([
      supabase.from('managed_destinations')
        .select('slug, content, media, segments, sort_order, is_published, show_on_home, is_deleted')
        .order('sort_order', { ascending: true }),
      supabase.from('destination_settings')
        .select('home_selection_enabled').eq('setting_key', 'homepage').maybeSingle(),
    ]);
    storageAvailable = !rowsResult.error && !settingsResult.error;
    if (storageAvailable) {
      rows = (rowsResult.data || []) as unknown as ManagedDestinationRow[];
      homeSelectionEnabled = settingsResult.data?.home_selection_enabled === true;
    }
  } catch {
    // Public pages keep serving the editorial CMS copy if admin storage is unavailable.
  }
  const rowsBySlug = new Map(rows.map((row) => [row.slug, row]));
  const legacyHomeSlugs = getLegacyHomeSlugs(baseLocations, books);
  const combined: Array<{ location: Location; sourceIndex: number }> = [];
  const knownSlugs = new Set<string>();

  for (const [index, base] of baseLocations.entries()) {
    const row = rowsBySlug.get(base.slug);
    knownSlugs.add(base.slug);
    if (row?.is_deleted) continue;
    const content = row?.content && typeof row.content === 'object' ? row.content : base;
    const location: Location = {
      ...base,
      ...content,
      heroImage: { ...base.heroImage, ...(content.heroImage || {}) },
      media: Array.isArray(row?.media) ? row.media : [],
      segments: Array.isArray(row?.segments) ? row.segments : [],
      sortOrder: row?.sort_order ?? index,
      isPublished: row?.is_published ?? true,
      showOnHome: row?.show_on_home ?? (!homeSelectionEnabled && legacyHomeSlugs.has(base.slug)),
      homeSelectionManaged: homeSelectionEnabled,
    };
    if (includeDrafts || location.isPublished !== false) combined.push({ location, sourceIndex: index });
  }

  for (const row of rows) {
    if (knownSlugs.has(row.slug) || row.is_deleted) continue;
    const location = {
      ...row.content,
      id: row.slug,
      slug: row.slug,
      media: Array.isArray(row.media) ? row.media : [],
      segments: Array.isArray(row.segments) ? row.segments : [],
      sortOrder: row.sort_order,
      isPublished: row.is_published,
      showOnHome: row.show_on_home,
      homeSelectionManaged: homeSelectionEnabled,
    } satisfies Location;
    if (includeDrafts || location.isPublished !== false) combined.push({ location, sourceIndex: baseLocations.length + row.sort_order });
  }

  combined.sort((left, right) => (left.location.sortOrder ?? left.sourceIndex) - (right.location.sortOrder ?? right.sourceIndex)
    || left.sourceIndex - right.sourceIndex);
  return { locations: combined.map(({ location }) => location), storageAvailable, homeSelectionEnabled };
}

export async function getPublicDestinations(locale: Locale) {
  const { locations } = await getDestinationData(locale);
  return locations;
}

function getLegacyHomeSlugs(locations: Location[], books: Book[]) {
  const now = Date.now();
  const featuredBook = books.filter((book) => Date.parse(`${book.publicationDate}T23:59:59.999Z`) <= now)[0] || books[0];
  const route = featuredBook?.locations
    ?.map((locationId) => locations.find((location) => location.id === locationId || location.slug === locationId))
    .filter((location): location is Location => Boolean(location));
  const selected = (route?.length ? route : locations.filter((location) => !location.slug.includes('regreso'))).slice(0, 3);
  return new Set(selected.map((location) => location.slug));
}
