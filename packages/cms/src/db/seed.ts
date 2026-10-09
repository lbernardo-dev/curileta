import { getDatabase, initSchema } from './database.ts';
import {
  INITIAL_CHARACTERS,
  INITIAL_BOOKS,
  INITIAL_LETTERS,
  INITIAL_LOCATIONS,
  INITIAL_TRAIL_WAYPOINTS,
  INITIAL_NARRATIVE_MILESTONES,
  INITIAL_MENTIONED_CURIOSITIES,
  INITIAL_VIDEOS,
  INITIAL_WALLPAPERS,
  INITIAL_SEASONAL_EVENTS,
  INITIAL_ROADMAP,
  INITIAL_COLLABORATIONS,
  INITIAL_SETTINGS,
} from '../localProvider.ts';

export function seedDatabase(force: boolean = false): void {
  const db = getDatabase();
  if (!db) {
    console.warn('[Seed] No database connection available, skipping seed.');
    return;
  }

  initSchema(db);

  // Check if characters already seeded
  const existingCountRow = db.prepare('SELECT COUNT(*) as cnt FROM characters').get() as { cnt: number };
  if (existingCountRow && existingCountRow.cnt > 0 && !force) {
    console.log(`[Seed] Database already contains ${existingCountRow.cnt} characters. Skipping seed (use force to overwrite).`);
    return;
  }

  console.log('[Seed] Seeding Curileta database...');

  // 1. Site Settings
  const insertSetting = db.prepare('INSERT OR REPLACE INTO site_settings (key, value_json) VALUES (?, ?)');
  insertSetting.run('site_config', JSON.stringify(INITIAL_SETTINGS));

  // 2. Characters
  const insertCharacter = db.prepare(`
    INSERT OR REPLACE INTO characters (
      id, name, slug, short_description_es, short_description_en,
      biography_es, biography_en, species, personality_json, values_json,
      passport_role_es, passport_role_en, stats_json, backpack_items_json,
      curiosity_facts_json, voice_quote_es, voice_quote_en, main_image_json,
      gallery_json, related_books_json, related_episodes_json, related_locations_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of INITIAL_CHARACTERS) {
    insertCharacter.run(
      c.id,
      c.name,
      c.slug,
      c.shortDescription.es,
      c.shortDescription.en || null,
      c.biography?.es || null,
      c.biography?.en || null,
      c.species || null,
      JSON.stringify(c.personality || []),
      JSON.stringify(c.values || []),
      c.passportRole?.es || null,
      c.passportRole?.en || null,
      JSON.stringify(c.explorerStats || {}),
      JSON.stringify(c.backpackItems || []),
      JSON.stringify(c.curiosityFacts || []),
      c.voiceQuote?.es || null,
      c.voiceQuote?.en || null,
      JSON.stringify(c.mainImage),
      JSON.stringify(c.gallery || []),
      JSON.stringify(c.relatedBooks || []),
      JSON.stringify(c.relatedEpisodes || []),
      JSON.stringify(c.relatedLocations || [])
    );
  }

  // 3. Books
  const insertBook = db.prepare(`
    INSERT OR REPLACE INTO books (
      id, slug, title_es, title_en, subtitle_es, subtitle_en,
      cover_image_json, description_es, description_en, publication_date,
      isbn_json, languages_json, age_range, page_count, publisher,
      badge_es, badge_en, color_theme, destinations_json, purchase_links_json,
      characters_json, locations_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const b of INITIAL_BOOKS) {
    insertBook.run(
      b.id,
      b.slug,
      b.title.es,
      b.title.en || null,
      b.subtitle?.es || null,
      b.subtitle?.en || null,
      JSON.stringify(b.coverImage),
      b.description.es,
      b.description.en || null,
      b.publicationDate,
      JSON.stringify(b.isbn || []),
      JSON.stringify(b.languages || []),
      b.ageRange,
      b.pageCount || null,
      b.publisher || null,
      b.badge?.es || null,
      b.badge?.en || null,
      b.colorTheme || null,
      JSON.stringify(b.destinations || []),
      JSON.stringify(b.purchaseLinks || []),
      JSON.stringify(b.characters || []),
      JSON.stringify(b.locations || [])
    );
  }

  // 4. Letters
  const insertLetter = db.prepare(`
    INSERT OR REPLACE INTO letters (
      id, order_num, country_es, country_en, city_es, city_en,
      postmark, postage_color, envelope_color, greeting_es, greeting_en,
      body_es_json, body_en_json, sign_off_es, sign_off_en, photos_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const l of INITIAL_LETTERS) {
    insertLetter.run(
      l.id,
      l.order,
      l.country.es,
      l.country.en || null,
      l.city.es,
      l.city.en || null,
      l.postmark,
      l.postageColor,
      l.envelopeColor,
      l.greeting.es,
      l.greeting.en || null,
      JSON.stringify(l.body.es),
      JSON.stringify(l.body.en),
      l.signOff.es,
      l.signOff.en || null,
      JSON.stringify(l.photos)
    );
  }

  // 5. Locations
  const insertLocation = db.prepare(`
    INSERT OR REPLACE INTO locations (
      id, slug, name_es, name_en, country_es, country_en,
      theme_es, theme_en, climate_es, climate_en, lat, lng,
      passport_stamp_json, description_es, description_en,
      hero_image_json, curiosities_json, characters_json,
      milestones_json, mentioned_places_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const loc of INITIAL_LOCATIONS) {
    insertLocation.run(
      loc.id,
      loc.slug,
      loc.name.es,
      loc.name.en || null,
      loc.country.es,
      loc.country.en || null,
      loc.theme?.es || null,
      loc.theme?.en || null,
      loc.climate?.es || null,
      loc.climate?.en || null,
      loc.coordinates.lat,
      loc.coordinates.lng,
      JSON.stringify(loc.passportStamp || null),
      loc.description.es,
      loc.description.en || null,
      JSON.stringify(loc.heroImage),
      JSON.stringify(loc.curiosities || []),
      JSON.stringify(loc.characters || []),
      JSON.stringify(loc.milestones || []),
      JSON.stringify(loc.mentionedPlaces || [])
    );
  }

  // 6. Trail Waypoints
  const insertWaypoint = db.prepare(`
    INSERT OR REPLACE INTO trail_waypoints (
      id, step_number, title_es, title_en, subtitle_es, subtitle_en,
      stamp_code, coordinates_text, badge_icon, date_stamp, note_es, note_en, color
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const w of INITIAL_TRAIL_WAYPOINTS) {
    insertWaypoint.run(
      w.id,
      w.stepNumber,
      w.title.es,
      w.title.en || null,
      w.subtitle.es,
      w.subtitle.en || null,
      w.stampCode,
      w.coordinatesText,
      w.badgeIcon,
      w.dateStamp,
      w.note.es,
      w.note.en || null,
      w.color
    );
  }

  // 7. Narrative Milestones
  const insertMilestone = db.prepare(`
    INSERT OR REPLACE INTO narrative_milestones (
      id, order_num, place_es, place_en, country_es, country_en,
      what_happens_es, what_happens_en, characters_present_json, is_travesia, lat, lng
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 0; i < INITIAL_NARRATIVE_MILESTONES.length; i++) {
    const m = INITIAL_NARRATIVE_MILESTONES[i];
    insertMilestone.run(
      `milestone-${m.order}`,
      m.order,
      m.place.es,
      m.place.en || null,
      m.country.es,
      m.country.en || null,
      m.whatHappens.es,
      m.whatHappens.en || null,
      JSON.stringify(m.charactersPresent || []),
      m.isTravesia ? 1 : 0,
      m.coordinates?.lat || null,
      m.coordinates?.lng || null
    );
  }

  // 8. Mentioned Curiosities
  const insertCuriosity = db.prepare(`
    INSERT OR REPLACE INTO mentioned_curiosities (
      id, name_es, name_en, country_es, country_en,
      curiosity_fact_es, curiosity_fact_en, is_mention_only
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);

  for (const c of INITIAL_MENTIONED_CURIOSITIES) {
    insertCuriosity.run(
      c.id,
      c.name.es,
      c.name.en || null,
      c.country.es,
      c.country.en || null,
      c.curiosityFact.es,
      c.curiosityFact.en || null
    );
  }

  // 9. Videos
  const insertVideo = db.prepare(`
    INSERT OR REPLACE INTO videos (
      id, slug, title_es, title_en, youtube_id, thumbnail,
      type, description_es, description_en, duration, published_at,
      episode_number, highlight_tag_es, highlight_tag_en
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const v of INITIAL_VIDEOS) {
    insertVideo.run(
      v.id,
      v.slug,
      v.title.es,
      v.title.en || null,
      v.youtubeId,
      v.thumbnail,
      v.type,
      v.description?.es || null,
      v.description?.en || null,
      v.duration || null,
      v.publishedAt,
      v.episodeNumber || null,
      v.highlightTag?.es || null,
      v.highlightTag?.en || null
    );
  }

  // 10. Wallpapers
  const insertWallpaper = db.prepare(`
    INSERT OR REPLACE INTO wallpapers (
      id, slug, title_es, title_en, device_type, category,
      resolution, thumbnail, full_image_url, tags_json,
      character_id, country_es, country_en, description_es, description_en, file_size_bytes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const wp of INITIAL_WALLPAPERS) {
    insertWallpaper.run(
      wp.id,
      wp.slug,
      wp.title.es,
      wp.title.en || null,
      wp.deviceType,
      wp.category,
      wp.resolution,
      wp.thumbnail,
      wp.fullImageUrl,
      JSON.stringify(wp.tags || []),
      wp.characterId || null,
      wp.country?.es || null,
      wp.country?.en || null,
      wp.description?.es || null,
      wp.description?.en || null,
      wp.fileSizeBytes || null
    );
  }

  // 11. Seasonal Events
  const insertEvent = db.prepare(`
    INSERT OR REPLACE INTO seasonal_events (
      id, slug, name_es, name_en, tagline_es, tagline_en,
      theme_key, active, start_date, end_date, banner_image,
      ambient_decorations_json, special_chapter_json, featured_wallpapers_json, activities_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const ev of INITIAL_SEASONAL_EVENTS) {
    insertEvent.run(
      ev.id,
      ev.slug,
      ev.name.es,
      ev.name.en || null,
      ev.tagline.es,
      ev.tagline.en || null,
      ev.themeKey,
      ev.active ? 1 : 0,
      ev.startDate,
      ev.endDate,
      ev.bannerImage,
      JSON.stringify(ev.ambientDecorations),
      JSON.stringify(ev.specialChapter),
      JSON.stringify(ev.featuredWallpapers || []),
      JSON.stringify(ev.activities || [])
    );
  }

  // 12. Universe Roadmap
  const insertRoadmap = db.prepare(`
    INSERT OR REPLACE INTO universe_roadmap (
      id, order_index, title_es, title_en, desc_es, desc_en, icon_name, badge_es, badge_en
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const r of INITIAL_ROADMAP) {
    insertRoadmap.run(
      r.id,
      r.orderIndex,
      r.title.es,
      r.title.en || null,
      r.desc.es,
      r.desc.en || null,
      r.iconName,
      r.badge.es,
      r.badge.en || null
    );
  }

  // 13. Collaborations
  const insertCollab = db.prepare(`
    INSERT OR REPLACE INTO collaborations (
      id, order_index, title_es, title_en, desc_es, desc_en, category, icon_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const col of INITIAL_COLLABORATIONS) {
    insertCollab.run(
      col.id,
      col.orderIndex,
      col.title.es,
      col.title.en || null,
      col.desc.es,
      col.desc.en || null,
      col.category,
      col.iconName
    );
  }

  console.log('[Seed] Database populated successfully with all entities!');
}

// Auto-run if executed directly via node/tsx
const isDirectRun =
  (typeof process !== 'undefined' && process.argv[1] && process.argv[1].includes('seed')) ||
  (typeof require !== 'undefined' && require.main === module);

if (isDirectRun) {
  seedDatabase(true);
}
