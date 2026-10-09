import type { CMSProvider } from '../CMSProvider.ts';
import type {
  Character,
  Book,
  Adventure,
  Video,
  Song,
  Location,
  TrailWaypoint,
  NarrativeMilestone,
  MentionedCuriosity,
  Wallpaper,
  SeasonalEvent,
  LetterItem,
  UniverseRoadmapItem,
  CollaborationOpportunity,
  SiteSettings,
} from '../models.ts';
import { getDatabase } from './database.ts';
import { seedDatabase } from './seed.ts';
import { LocalCMSProvider, isSeasonalEventActive } from '../localProvider.ts';

export class DatabaseCMSProvider implements CMSProvider {
  private fallbackProvider = new LocalCMSProvider();
  private initialized = false;

  private getDb() {
    try {
      const db = getDatabase();
      if (db && !this.initialized) {
        this.initialized = true;
        // Auto-seed if empty
        seedDatabase(false);
      }
      return db;
    } catch {
      return null;
    }
  }

  async getCharacters(locale?: string): Promise<Character[]> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getCharacters(locale);

    try {
      const rows = db.prepare('SELECT * FROM characters ORDER BY id ASC').all() as any[];
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        shortDescription: { es: r.short_description_es, en: r.short_description_en },
        biography: r.biography_es ? { es: r.biography_es, en: r.biography_en } : undefined,
        species: r.species || undefined,
        personality: JSON.parse(r.personality_json || '[]'),
        values: JSON.parse(r.values_json || '[]'),
        passportRole: r.passport_role_es ? { es: r.passport_role_es, en: r.passport_role_en } : undefined,
        explorerStats: JSON.parse(r.stats_json || '{}'),
        backpackItems: JSON.parse(r.backpack_items_json || '[]'),
        curiosityFacts: JSON.parse(r.curiosity_facts_json || '[]'),
        voiceQuote: r.voice_quote_es ? { es: r.voice_quote_es, en: r.voice_quote_en } : undefined,
        mainImage: JSON.parse(r.main_image_json || '{}'),
        gallery: JSON.parse(r.gallery_json || '[]'),
        relatedBooks: JSON.parse(r.related_books_json || '[]'),
        relatedEpisodes: JSON.parse(r.related_episodes_json || '[]'),
        relatedLocations: JSON.parse(r.related_locations_json || '[]'),
      }));
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching characters, falling back:', err);
      return this.fallbackProvider.getCharacters(locale);
    }
  }

  async getCharacterBySlug(slug: string, locale?: string): Promise<Character | null> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getCharacterBySlug(slug, locale);

    try {
      const targetSlug = slug === 'joey-canguro' ? 'canguro-mama' : slug;
      const r = db.prepare('SELECT * FROM characters WHERE slug = ?').get(targetSlug) as any;
      if (!r) return null;

      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        shortDescription: { es: r.short_description_es, en: r.short_description_en },
        biography: r.biography_es ? { es: r.biography_es, en: r.biography_en } : undefined,
        species: r.species || undefined,
        personality: JSON.parse(r.personality_json || '[]'),
        values: JSON.parse(r.values_json || '[]'),
        passportRole: r.passport_role_es ? { es: r.passport_role_es, en: r.passport_role_en } : undefined,
        explorerStats: JSON.parse(r.stats_json || '{}'),
        backpackItems: JSON.parse(r.backpack_items_json || '[]'),
        curiosityFacts: JSON.parse(r.curiosity_facts_json || '[]'),
        voiceQuote: r.voice_quote_es ? { es: r.voice_quote_es, en: r.voice_quote_en } : undefined,
        mainImage: JSON.parse(r.main_image_json || '{}'),
        gallery: JSON.parse(r.gallery_json || '[]'),
        relatedBooks: JSON.parse(r.related_books_json || '[]'),
        relatedEpisodes: JSON.parse(r.related_episodes_json || '[]'),
        relatedLocations: JSON.parse(r.related_locations_json || '[]'),
      };
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching character by slug, falling back:', err);
      return this.fallbackProvider.getCharacterBySlug(slug, locale);
    }
  }

  async getBooks(locale?: string): Promise<Book[]> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getBooks(locale);

    try {
      const rows = db.prepare('SELECT * FROM books ORDER BY publication_date ASC').all() as any[];
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: { es: r.title_es, en: r.title_en },
        subtitle: r.subtitle_es ? { es: r.subtitle_es, en: r.subtitle_en } : undefined,
        coverImage: JSON.parse(r.cover_image_json || '{}'),
        description: { es: r.description_es, en: r.description_en },
        publicationDate: r.publication_date,
        isbn: JSON.parse(r.isbn_json || '[]'),
        languages: JSON.parse(r.languages_json || '[]'),
        ageRange: r.age_range,
        pageCount: r.page_count || undefined,
        publisher: r.publisher || undefined,
        badge: r.badge_es ? { es: r.badge_es, en: r.badge_en } : undefined,
        colorTheme: r.color_theme || undefined,
        destinations: JSON.parse(r.destinations_json || '[]'),
        purchaseLinks: JSON.parse(r.purchase_links_json || '[]'),
        characters: JSON.parse(r.characters_json || '[]'),
        locations: JSON.parse(r.locations_json || '[]'),
      }));
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching books, falling back:', err);
      return this.fallbackProvider.getBooks(locale);
    }
  }

  async getBookBySlug(slug: string, locale?: string): Promise<Book | null> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getBookBySlug(slug, locale);

    try {
      const r = db.prepare('SELECT * FROM books WHERE slug = ?').get(slug) as any;
      if (!r) return null;

      return {
        id: r.id,
        slug: r.slug,
        title: { es: r.title_es, en: r.title_en },
        subtitle: r.subtitle_es ? { es: r.subtitle_es, en: r.subtitle_en } : undefined,
        coverImage: JSON.parse(r.cover_image_json || '{}'),
        description: { es: r.description_es, en: r.description_en },
        publicationDate: r.publication_date,
        isbn: JSON.parse(r.isbn_json || '[]'),
        languages: JSON.parse(r.languages_json || '[]'),
        ageRange: r.age_range,
        pageCount: r.page_count || undefined,
        publisher: r.publisher || undefined,
        badge: r.badge_es ? { es: r.badge_es, en: r.badge_en } : undefined,
        colorTheme: r.color_theme || undefined,
        destinations: JSON.parse(r.destinations_json || '[]'),
        purchaseLinks: JSON.parse(r.purchase_links_json || '[]'),
        characters: JSON.parse(r.characters_json || '[]'),
        locations: JSON.parse(r.locations_json || '[]'),
      };
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching book by slug, falling back:', err);
      return this.fallbackProvider.getBookBySlug(slug, locale);
    }
  }

  async getAdventures(locale?: string): Promise<Adventure[]> {
    return this.fallbackProvider.getAdventures(locale);
  }

  async getVideos(locale?: string): Promise<Video[]> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getVideos(locale);

    try {
      const rows = db.prepare('SELECT * FROM videos ORDER BY episode_number ASC').all() as any[];
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: { es: r.title_es, en: r.title_en },
        youtubeId: r.youtube_id,
        thumbnail: r.thumbnail,
        type: r.type,
        description: r.description_es ? { es: r.description_es, en: r.description_en } : undefined,
        duration: r.duration || undefined,
        publishedAt: r.published_at,
        episodeNumber: r.episode_number || undefined,
        highlightTag: r.highlight_tag_es ? { es: r.highlight_tag_es, en: r.highlight_tag_en } : undefined,
      }));
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching videos, falling back:', err);
      return this.fallbackProvider.getVideos(locale);
    }
  }

  async getSongs(locale?: string): Promise<Song[]> {
    return this.fallbackProvider.getSongs(locale);
  }

  async getLocations(locale?: string): Promise<Location[]> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getLocations(locale);

    try {
      const rows = db.prepare('SELECT * FROM locations ORDER BY id ASC').all() as any[];
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: { es: r.name_es, en: r.name_en },
        country: { es: r.country_es, en: r.country_en },
        theme: r.theme_es ? { es: r.theme_es, en: r.theme_en } : undefined,
        climate: r.climate_es ? { es: r.climate_es, en: r.climate_en } : undefined,
        coordinates: { lat: r.lat, lng: r.lng },
        passportStamp: JSON.parse(r.passport_stamp_json || 'null') || undefined,
        description: { es: r.description_es, en: r.description_en },
        heroImage: JSON.parse(r.hero_image_json || '{}'),
        curiosities: JSON.parse(r.curiosities_json || '[]'),
        characters: JSON.parse(r.characters_json || '[]'),
        milestones: JSON.parse(r.milestones_json || '[]'),
        mentionedPlaces: JSON.parse(r.mentioned_places_json || '[]'),
      }));
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching locations, falling back:', err);
      return this.fallbackProvider.getLocations(locale);
    }
  }

  async getTrailWaypoints(locale?: string): Promise<TrailWaypoint[]> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getTrailWaypoints(locale);

    try {
      const rows = db.prepare('SELECT * FROM trail_waypoints ORDER BY step_number ASC').all() as any[];
      return rows.map((r) => ({
        id: r.id,
        stepNumber: r.step_number,
        title: { es: r.title_es, en: r.title_en },
        subtitle: { es: r.subtitle_es, en: r.subtitle_en },
        stampCode: r.stamp_code,
        coordinatesText: r.coordinates_text,
        badgeIcon: r.badge_icon,
        dateStamp: r.date_stamp,
        note: { es: r.note_es, en: r.note_en },
        color: r.color,
      }));
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching trail waypoints, falling back:', err);
      return this.fallbackProvider.getTrailWaypoints(locale);
    }
  }

  async getNarrativeMilestones(locale?: string): Promise<NarrativeMilestone[]> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getNarrativeMilestones(locale);

    try {
      const rows = db.prepare('SELECT * FROM narrative_milestones ORDER BY order_num ASC').all() as any[];
      return rows.map((r) => ({
        order: r.order_num,
        place: { es: r.place_es, en: r.place_en },
        country: { es: r.country_es, en: r.country_en },
        whatHappens: { es: r.what_happens_es, en: r.what_happens_en },
        charactersPresent: JSON.parse(r.characters_present_json || '[]'),
        isTravesia: r.is_travesia === 1,
        coordinates: r.lat && r.lng ? { lat: r.lat, lng: r.lng } : undefined,
      }));
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching narrative milestones, falling back:', err);
      return this.fallbackProvider.getNarrativeMilestones(locale);
    }
  }

  async getMentionedCuriosities(locale?: string): Promise<MentionedCuriosity[]> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getMentionedCuriosities(locale);

    try {
      const rows = db.prepare('SELECT * FROM mentioned_curiosities ORDER BY id ASC').all() as any[];
      return rows.map((r) => ({
        id: r.id,
        name: { es: r.name_es, en: r.name_en },
        country: { es: r.country_es, en: r.country_en },
        curiosityFact: { es: r.curiosity_fact_es, en: r.curiosity_fact_en },
        isMentionOnly: true as const,
      }));
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching mentioned curiosities, falling back:', err);
      return this.fallbackProvider.getMentionedCuriosities(locale);
    }
  }

  async getWallpapers(locale?: string): Promise<Wallpaper[]> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getWallpapers(locale);

    try {
      const rows = db.prepare('SELECT * FROM wallpapers ORDER BY id ASC').all() as any[];
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: { es: r.title_es, en: r.title_en },
        deviceType: r.device_type,
        category: r.category,
        resolution: r.resolution,
        thumbnail: r.thumbnail,
        fullImageUrl: r.full_image_url,
        tags: JSON.parse(r.tags_json || '[]'),
        characterId: r.character_id || undefined,
        country: r.country_es ? { es: r.country_es, en: r.country_en } : undefined,
        description: r.description_es ? { es: r.description_es, en: r.description_en } : undefined,
        fileSizeBytes: r.file_size_bytes || undefined,
      }));
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching wallpapers, falling back:', err);
      return this.fallbackProvider.getWallpapers(locale);
    }
  }

  async getActiveEvent(locale?: string, referenceDate: Date = new Date()): Promise<SeasonalEvent | null> {
    const events = await this.getSeasonalEvents(locale);
    return events.find((e) => isSeasonalEventActive(e, referenceDate)) || null;
  }

  async getSeasonalEvents(locale?: string): Promise<SeasonalEvent[]> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getSeasonalEvents(locale);

    try {
      const rows = db.prepare('SELECT * FROM seasonal_events ORDER BY id ASC').all() as any[];
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: { es: r.name_es, en: r.name_en },
        tagline: { es: r.tagline_es, en: r.tagline_en },
        themeKey: r.theme_key,
        active: r.active === 1,
        startDate: r.start_date,
        endDate: r.end_date,
        bannerImage: r.banner_image,
        ambientDecorations: JSON.parse(r.ambient_decorations_json || '{}'),
        specialChapter: JSON.parse(r.special_chapter_json || '{}'),
        featuredWallpapers: JSON.parse(r.featured_wallpapers_json || '[]'),
        activities: JSON.parse(r.activities_json || '[]'),
      }));
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching seasonal events, falling back:', err);
      return this.fallbackProvider.getSeasonalEvents(locale);
    }
  }

  async getLetters(locale?: string): Promise<LetterItem[]> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getLetters(locale);

    try {
      const rows = db.prepare('SELECT * FROM letters ORDER BY order_num ASC').all() as any[];
      return rows.map((r) => ({
        id: r.id,
        order: r.order_num,
        country: { es: r.country_es, en: r.country_en },
        city: { es: r.city_es, en: r.city_en },
        postmark: r.postmark,
        postageColor: r.postage_color,
        envelopeColor: r.envelope_color,
        greeting: { es: r.greeting_es, en: r.greeting_en },
        body: {
          es: JSON.parse(r.body_es_json || '[]'),
          en: JSON.parse(r.body_en_json || '[]'),
        },
        signOff: { es: r.sign_off_es, en: r.sign_off_en },
        photos: JSON.parse(r.photos_json || '[]'),
      }));
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching letters, falling back:', err);
      return this.fallbackProvider.getLetters(locale);
    }
  }

  async getLetterById(id: string, locale?: string): Promise<LetterItem | null> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getLetterById(id, locale);

    try {
      const r = db.prepare('SELECT * FROM letters WHERE id = ?').get(id) as any;
      if (!r) return null;

      return {
        id: r.id,
        order: r.order_num,
        country: { es: r.country_es, en: r.country_en },
        city: { es: r.city_es, en: r.city_en },
        postmark: r.postmark,
        postageColor: r.postage_color,
        envelopeColor: r.envelope_color,
        greeting: { es: r.greeting_es, en: r.greeting_en },
        body: {
          es: JSON.parse(r.body_es_json || '[]'),
          en: JSON.parse(r.body_en_json || '[]'),
        },
        signOff: { es: r.sign_off_es, en: r.sign_off_en },
        photos: JSON.parse(r.photos_json || '[]'),
      };
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching letter by id, falling back:', err);
      return this.fallbackProvider.getLetterById(id, locale);
    }
  }

  async getUniverseRoadmap(locale?: string): Promise<UniverseRoadmapItem[]> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getUniverseRoadmap(locale);

    try {
      const rows = db.prepare('SELECT * FROM universe_roadmap ORDER BY order_index ASC').all() as any[];
      return rows.map((r) => ({
        id: r.id,
        orderIndex: r.order_index,
        title: { es: r.title_es, en: r.title_en },
        desc: { es: r.desc_es, en: r.desc_en },
        iconName: r.icon_name,
        badge: { es: r.badge_es, en: r.badge_en },
      }));
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching roadmap, falling back:', err);
      return this.fallbackProvider.getUniverseRoadmap(locale);
    }
  }

  async getCollaborations(locale?: string): Promise<CollaborationOpportunity[]> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getCollaborations(locale);

    try {
      const rows = db.prepare('SELECT * FROM collaborations ORDER BY order_index ASC').all() as any[];
      return rows.map((r) => ({
        id: r.id,
        orderIndex: r.order_index,
        title: { es: r.title_es, en: r.title_en },
        desc: { es: r.desc_es, en: r.desc_en },
        category: r.category,
        iconName: r.icon_name,
      }));
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching collaborations, falling back:', err);
      return this.fallbackProvider.getCollaborations(locale);
    }
  }

  async getSiteSettings(locale?: string): Promise<SiteSettings> {
    const db = this.getDb();
    if (!db) return this.fallbackProvider.getSiteSettings(locale);

    try {
      const row = db.prepare('SELECT value_json FROM site_settings WHERE key = ?').get('site_config') as any;
      if (row && row.value_json) {
        return JSON.parse(row.value_json);
      }
      return this.fallbackProvider.getSiteSettings(locale);
    } catch (err) {
      console.warn('[DatabaseCMSProvider] Error fetching site settings, falling back:', err);
      return this.fallbackProvider.getSiteSettings(locale);
    }
  }
}
