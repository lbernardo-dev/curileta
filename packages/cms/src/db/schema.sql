-- Relational Schema for Curileta SQLite Database
-- Supports all dynamic sections and bilingual content

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description_es TEXT,
  short_description_en TEXT,
  biography_es TEXT,
  biography_en TEXT,
  species TEXT,
  personality_json TEXT,
  values_json TEXT,
  passport_role_es TEXT,
  passport_role_en TEXT,
  stats_json TEXT,
  backpack_items_json TEXT,
  curiosity_facts_json TEXT,
  voice_quote_es TEXT,
  voice_quote_en TEXT,
  main_image_json TEXT,
  gallery_json TEXT,
  related_books_json TEXT,
  related_episodes_json TEXT,
  related_locations_json TEXT
);

CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_es TEXT NOT NULL,
  title_en TEXT,
  subtitle_es TEXT,
  subtitle_en TEXT,
  cover_image_json TEXT,
  description_es TEXT,
  description_en TEXT,
  publication_date TEXT,
  isbn_json TEXT,
  languages_json TEXT,
  age_range TEXT,
  page_count INTEGER,
  publisher TEXT,
  badge_es TEXT,
  badge_en TEXT,
  color_theme TEXT,
  destinations_json TEXT,
  purchase_links_json TEXT,
  characters_json TEXT,
  locations_json TEXT
);

CREATE TABLE IF NOT EXISTS letters (
  id TEXT PRIMARY KEY,
  order_num INTEGER NOT NULL,
  country_es TEXT,
  country_en TEXT,
  city_es TEXT,
  city_en TEXT,
  postmark TEXT,
  postage_color TEXT,
  envelope_color TEXT,
  greeting_es TEXT,
  greeting_en TEXT,
  body_es_json TEXT,
  body_en_json TEXT,
  sign_off_es TEXT,
  sign_off_en TEXT,
  photos_json TEXT
);

CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_es TEXT,
  name_en TEXT,
  country_es TEXT,
  country_en TEXT,
  theme_es TEXT,
  theme_en TEXT,
  climate_es TEXT,
  climate_en TEXT,
  lat REAL,
  lng REAL,
  passport_stamp_json TEXT,
  description_es TEXT,
  description_en TEXT,
  hero_image_json TEXT,
  curiosities_json TEXT,
  characters_json TEXT,
  milestones_json TEXT,
  mentioned_places_json TEXT
);

CREATE TABLE IF NOT EXISTS trail_waypoints (
  id TEXT PRIMARY KEY,
  step_number INTEGER NOT NULL,
  title_es TEXT,
  title_en TEXT,
  subtitle_es TEXT,
  subtitle_en TEXT,
  stamp_code TEXT,
  coordinates_text TEXT,
  badge_icon TEXT,
  date_stamp TEXT,
  note_es TEXT,
  note_en TEXT,
  color TEXT
);

CREATE TABLE IF NOT EXISTS narrative_milestones (
  id TEXT PRIMARY KEY,
  order_num INTEGER NOT NULL,
  place_es TEXT,
  place_en TEXT,
  country_es TEXT,
  country_en TEXT,
  what_happens_es TEXT,
  what_happens_en TEXT,
  characters_present_json TEXT,
  is_travesia INTEGER DEFAULT 0,
  lat REAL,
  lng REAL
);

CREATE TABLE IF NOT EXISTS mentioned_curiosities (
  id TEXT PRIMARY KEY,
  name_es TEXT,
  name_en TEXT,
  country_es TEXT,
  country_en TEXT,
  curiosity_fact_es TEXT,
  curiosity_fact_en TEXT,
  is_mention_only INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_es TEXT,
  title_en TEXT,
  youtube_id TEXT,
  thumbnail TEXT,
  type TEXT,
  description_es TEXT,
  description_en TEXT,
  duration TEXT,
  published_at TEXT,
  episode_number INTEGER,
  highlight_tag_es TEXT,
  highlight_tag_en TEXT
);

CREATE TABLE IF NOT EXISTS wallpapers (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_es TEXT,
  title_en TEXT,
  device_type TEXT,
  category TEXT,
  resolution TEXT,
  thumbnail TEXT,
  full_image_url TEXT,
  tags_json TEXT,
  character_id TEXT,
  country_es TEXT,
  country_en TEXT,
  description_es TEXT,
  description_en TEXT,
  file_size_bytes TEXT
);

CREATE TABLE IF NOT EXISTS seasonal_events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_es TEXT,
  name_en TEXT,
  tagline_es TEXT,
  tagline_en TEXT,
  theme_key TEXT,
  active INTEGER DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  banner_image TEXT,
  ambient_decorations_json TEXT,
  special_chapter_json TEXT,
  featured_wallpapers_json TEXT,
  activities_json TEXT
);

CREATE TABLE IF NOT EXISTS universe_roadmap (
  id TEXT PRIMARY KEY,
  order_index INTEGER NOT NULL,
  title_es TEXT,
  title_en TEXT,
  desc_es TEXT,
  desc_en TEXT,
  icon_name TEXT,
  badge_es TEXT,
  badge_en TEXT
);

CREATE TABLE IF NOT EXISTS collaborations (
  id TEXT PRIMARY KEY,
  order_index INTEGER NOT NULL,
  title_es TEXT,
  title_en TEXT,
  desc_es TEXT,
  desc_en TEXT,
  category TEXT,
  icon_name TEXT
);
