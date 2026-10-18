import 'server-only';

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
import { INITIAL_SETTINGS } from '@curileta/cms';
import { DatabaseCMSProvider } from '@curileta/cms/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

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
  | 'collaboration'
  | 'siteSettings';

interface ManagedContentRow {
  content_type: ContentType;
  content_id: string;
  payload: Record<string, unknown>;
  sort_order: number;
  is_published: boolean;
  is_deleted: boolean;
}

function normalizeEntry<T>(row: ManagedContentRow): T {
  const entry = { ...row.payload };
  if (row.content_type === 'character' && !entry.name && entry.characterName) {
    entry.name = entry.characterName;
    delete entry.characterName;
  }
  if (row.content_type === 'book' && !entry.coverImage && entry.cover) {
    entry.coverImage = entry.cover;
    delete entry.cover;
  }
  return entry as T;
}

export class SupabaseCMSProvider implements CMSProvider {
  private readonly fallback = new DatabaseCMSProvider();

  private async list<T>(contentType: ContentType): Promise<T[] | null> {
    try {
      const { data, error } = await createSupabaseAdminClient()
        .from('managed_content_entries')
        .select('content_type, content_id, payload, sort_order, is_published, is_deleted')
        .eq('content_type', contentType)
        .eq('is_published', true)
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true })
        .order('content_id', { ascending: true });
      if (error) throw error;
      return ((data || []) as ManagedContentRow[]).map((row) => normalizeEntry<T>(row));
    } catch (error) {
      console.error('[SupabaseCMSProvider] No se pudo leer contenido editorial.', {
        contentType,
        error,
      });
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

  async getVideosForMediaCleanup(): Promise<Video[]> {
    return (await this.list<Video>('video')) ?? this.fallback.getVideos();
  }

  async getSongs(locale?: string): Promise<Song[]> {
    return (await this.list<Song>('song')) ?? this.fallback.getSongs(locale);
  }

  async getSongsForMediaCleanup(): Promise<Song[]> {
    return (await this.list<Song>('song')) ?? this.fallback.getSongs();
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
    const [managed, fallback] = await Promise.all([
      this.list<Wallpaper>('wallpaper'),
      this.fallback.getWallpapers(locale),
    ]);
    if (!managed?.length) return fallback;

    const wallpapersBySlug = new Map(fallback.map((wallpaper) => [wallpaper.slug, wallpaper]));
    for (const wallpaper of managed) wallpapersBySlug.set(wallpaper.slug, wallpaper);
    return [...wallpapersBySlug.values()];
  }

  async getActiveEvent(locale?: string, referenceDate = new Date()): Promise<SeasonalEvent | null> {
    const events = await this.getSeasonalEvents(locale);
    return events.find((event) => {
      const start = Date.parse(event.startDate);
      const end = Date.parse(event.endDate);
      return event.active && Number.isFinite(start) && Number.isFinite(end)
        && referenceDate.getTime() >= start && referenceDate.getTime() <= end;
    }) || null;
  }

  async getSeasonalEvents(locale?: string): Promise<SeasonalEvent[]> {
    return (await this.list<SeasonalEvent>('seasonalEvent')) ?? this.fallback.getSeasonalEvents(locale);
  }

  async getLetters(): Promise<LetterItem[]> {
    const letters = await this.list<LetterItem>('letter');
    if (!letters) return [];
    return letters.map((letter) => ({
      ...letter,
      publicationStatus: letter.publicationStatus || 'public',
      photos: (letter.photos || []).map((photo) => ({
        ...photo,
        visibility: photo.visibility || 'public',
      })),
    }));
  }

  async getLetterById(id: string): Promise<LetterItem | null> {
    return (await this.getLetters()).find((item) => item.id === id) || null;
  }

  async getUniverseRoadmap(locale?: string): Promise<UniverseRoadmapItem[]> {
    return (await this.list<UniverseRoadmapItem>('universeRoadmapItem')) ?? this.fallback.getUniverseRoadmap(locale);
  }

  async getCollaborations(locale?: string): Promise<CollaborationOpportunity[]> {
    return (await this.list<CollaborationOpportunity>('collaboration')) ?? this.fallback.getCollaborations(locale);
  }

  async getSiteSettings(locale?: string): Promise<SiteSettings> {
    const rows = await this.list<Record<string, unknown>>('siteSettings');
    if (!rows?.length) return this.fallback.getSiteSettings(locale);
    return { ...INITIAL_SETTINGS, ...rows[0] } as SiteSettings;
  }
}
