import 'server-only';

import { createClient } from '@sanity/client';
import { unstable_cache } from 'next/cache';
import type { CMSProvider } from '@curileta/cms';
import type {
  Adventure,
  Book,
  Character,
  CollaborationOpportunity,
  LetterItem,
  Location,
  MentionedCuriosity,
  NarrativeMilestone,
  SeasonalEvent,
  SiteSettings,
  Song,
  TrailWaypoint,
  UniverseRoadmapItem,
  Video,
  Wallpaper,
} from '@curileta/cms';
import { DatabaseCMSProvider, INITIAL_SETTINGS, isSeasonalEventActive } from '@curileta/cms';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

const client = createClient({
  projectId: projectId || 'curileta-demo',
  dataset,
  apiVersion: '2025-02-19',
  useCdn: !process.env.SANITY_READ_TOKEN,
  token: process.env.SANITY_READ_TOKEN,
});

type ContentType =
  | 'character'
  | 'book'
  | 'adventure'
  | 'video'
  | 'song'
  | 'location'
  | 'trailWaypoint'
  | 'narrativeMilestone'
  | 'mentionedCuriosity'
  | 'wallpaper'
  | 'seasonalEvent'
  | 'letter'
  | 'universeRoadmapItem'
  | 'collaboration';

type SanityDocument = Record<string, unknown> & { _id: string };

const cachedList = (contentType: ContentType) => unstable_cache(
  async () => client.fetch<SanityDocument[]>(
    '*[_type == "contentEntry" && contentType == $contentType && !(_id in path("drafts.**"))] | order(orderIndex asc, stepNumber asc, order asc, id asc)',
    { contentType },
  ),
  ['sanity-content', projectId || 'unconfigured', dataset, contentType],
  { revalidate: 300, tags: [`sanity:${contentType}`] },
);

const cachedSettings = unstable_cache(
  async () => client.fetch<SanityDocument | null>(
    `*[_type == "siteSettings"][0] {
      ...,
      "youtubeChannelAvatarUrl": youtubeChannelAvatar.asset->url,
      "youtubeChannelHeaderUrl": youtubeChannelHeader.asset->url
    }`,
  ),
  ['sanity-site-settings', projectId || 'unconfigured', dataset],
  { revalidate: 300, tags: ['sanity:siteSettings'] },
);

function stripSanityFields(document: SanityDocument) {
  const { _id, _rev, _createdAt, _updatedAt, _type, ...entry } = document;
  return entry;
}

function mapEntry<T>(document: SanityDocument, contentType: ContentType): T {
  const entry = stripSanityFields(document);
  if (contentType === 'character' && !entry.name && entry.characterName) {
    entry.name = entry.characterName;
    delete entry.characterName;
  }
  if (contentType === 'book' && !entry.coverImage && entry.cover) {
    entry.coverImage = entry.cover;
    delete entry.cover;
  }
  return entry as T;
}

export class SanityCMSProvider implements CMSProvider {
  private readonly fallback = new DatabaseCMSProvider();

  private async list<T>(contentType: ContentType): Promise<T[] | null> {
    try {
      const documents = await cachedList(contentType)();
      if (documents.length === 0) return [];
      return documents.map((document) => mapEntry<T>(document, contentType));
    } catch (error) {
      console.error(`[SanityCMSProvider] Error al leer ${contentType}; se usa el contenido local.`, error);
      return null;
    }
  }

  async getCharacters(locale?: string): Promise<Character[]> {
    return (await this.list<Character>('character')) ?? this.fallback.getCharacters(locale);
  }

  async getCharacterBySlug(slug: string, locale?: string): Promise<Character | null> {
    return (await this.getCharacters(locale)).find((item) => item.slug === slug) || null;
  }

  async getBooks(locale?: string): Promise<Book[]> {
    return (await this.list<Book>('book')) ?? this.fallback.getBooks(locale);
  }

  async getBookBySlug(slug: string, locale?: string): Promise<Book | null> {
    return (await this.getBooks(locale)).find((item) => item.slug === slug) || null;
  }

  async getAdventures(locale?: string): Promise<Adventure[]> {
    return (await this.list<Adventure>('adventure')) ?? this.fallback.getAdventures(locale);
  }

  async getVideos(locale?: string): Promise<Video[]> {
    return (await this.list<Video>('video')) ?? this.fallback.getVideos(locale);
  }

  async getSongs(locale?: string): Promise<Song[]> {
    return (await this.list<Song>('song')) ?? this.fallback.getSongs(locale);
  }

  async getLocations(locale?: string): Promise<Location[]> {
    return (await this.list<Location>('location')) ?? this.fallback.getLocations(locale);
  }

  async getTrailWaypoints(locale?: string): Promise<TrailWaypoint[]> {
    return (await this.list<TrailWaypoint>('trailWaypoint')) ?? this.fallback.getTrailWaypoints(locale);
  }

  async getNarrativeMilestones(locale?: string): Promise<NarrativeMilestone[]> {
    return (await this.list<NarrativeMilestone>('narrativeMilestone')) ?? this.fallback.getNarrativeMilestones(locale);
  }

  async getMentionedCuriosities(locale?: string): Promise<MentionedCuriosity[]> {
    return (await this.list<MentionedCuriosity>('mentionedCuriosity')) ?? this.fallback.getMentionedCuriosities(locale);
  }

  async getWallpapers(locale?: string): Promise<Wallpaper[]> {
    return (await this.list<Wallpaper>('wallpaper')) ?? this.fallback.getWallpapers(locale);
  }

  async getActiveEvent(locale?: string, referenceDate = new Date()): Promise<SeasonalEvent | null> {
    const events = await this.getSeasonalEvents(locale);
    return events.find((event) => isSeasonalEventActive(event, referenceDate)) || null;
  }

  async getSeasonalEvents(locale?: string): Promise<SeasonalEvent[]> {
    return (await this.list<SeasonalEvent>('seasonalEvent')) ?? this.fallback.getSeasonalEvents(locale);
  }

  async getLetters(locale?: string): Promise<LetterItem[]> {
    return (await this.list<LetterItem>('letter')) ?? this.fallback.getLetters(locale);
  }

  async getLetterById(id: string, locale?: string): Promise<LetterItem | null> {
    return (await this.getLetters(locale)).find((item) => item.id === id) || null;
  }

  async getUniverseRoadmap(locale?: string): Promise<UniverseRoadmapItem[]> {
    return (await this.list<UniverseRoadmapItem>('universeRoadmapItem')) ?? this.fallback.getUniverseRoadmap(locale);
  }

  async getCollaborations(locale?: string): Promise<CollaborationOpportunity[]> {
    return (await this.list<CollaborationOpportunity>('collaboration')) ?? this.fallback.getCollaborations(locale);
  }

  async getSiteSettings(locale?: string): Promise<SiteSettings> {
    try {
      const document = await cachedSettings();
      if (!document) return this.fallback.getSiteSettings(locale);
      return { ...INITIAL_SETTINGS, ...stripSanityFields(document) } as SiteSettings;
    } catch (error) {
      console.error('[SanityCMSProvider] Error al leer ajustes; se usan los valores locales.', error);
      return this.fallback.getSiteSettings(locale);
    }
  }
}
