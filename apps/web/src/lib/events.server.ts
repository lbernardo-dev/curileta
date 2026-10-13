import 'server-only';

import type { SeasonalEvent } from '@curileta/cms';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { isEventMediaAsset } from '@/lib/event-media.server';
import {
  DEFAULT_EVENT_EFFECTS,
  EVENT_DECORATIONS,
  EVENT_PALETTE_PRESETS,
  type EventCampaignContent,
  isManagedEventActive,
  type EventEffects,
  type EventPalette,
  type ManagedEvent,
  type ManagedBaseTheme,
  type ThemeControlState,
} from './events';

type EventRow = Record<string, unknown>;

export async function listManagedEvents(): Promise<ManagedEvent[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from('site_events')
    .select('*')
    .order('priority', { ascending: false })
    .order('starts_at', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => mapManagedEvent(row as EventRow));
}

export async function getManagedBaseTheme(): Promise<ManagedBaseTheme> {
  const { data, error } = await createSupabaseAdminClient().from('site_theme_settings').select('*').eq('setting_key', 'base').maybeSingle();
  if (error) throw error;
  if (!data) return defaultBaseTheme();
  const mapped = mapManagedEvent({
    id: 'base', slug: 'base', name: data.name, description: {}, theme_key: data.theme_key,
    starts_at: new Date(0).toISOString(), ends_at: new Date(8640000000000000).toISOString(), time_zone: 'UTC',
    activation_mode: 'manual', enabled: true, manual_active: true, priority: 0,
    hero_video_url: data.hero_video_url, hero_video_path: data.hero_video_path,
    ambient_audio_url: data.ambient_audio_url, ambient_audio_path: data.ambient_audio_path,
    scare_sound_url: '', scare_sound_path: '', palette: data.palette, effects: data.effects,
    created_at: data.updated_at, updated_at: data.updated_at,
  });
  return {
    name: mapped.name,
    themeKey: mapped.themeKey,
    heroVideoUrl: mapped.heroVideoUrl,
    heroVideoPath: mapped.heroVideoPath,
    ambientAudioUrl: mapped.ambientAudioUrl,
    ambientAudioPath: mapped.ambientAudioPath,
    palette: mapped.palette,
    effects: { ...mapped.effects, scareEffectsEnabled: false },
    updatedAt: mapped.updatedAt,
  };
}

export function defaultBaseTheme(): ManagedBaseTheme {
  return {
    name: { es: 'Curileta', en: 'Curileta' }, themeKey: 'custom', heroVideoUrl: '', heroVideoPath: '',
    ambientAudioUrl: '', ambientAudioPath: '', palette: EVENT_PALETTE_PRESETS.custom,
    effects: { ...DEFAULT_EVENT_EFFECTS, decorations: [] }, updatedAt: '',
  };
}

export async function getThemeControlState(): Promise<ThemeControlState> {
  const { data, error } = await createSupabaseAdminClient().from('site_theme_control')
    .select('override_mode, event_id').eq('control_key', 'global').maybeSingle();
  if (error) throw error;
  const mode = data?.override_mode;
  return {
    mode: mode === 'base' || mode === 'event' ? mode : 'automatic',
    eventId: typeof data?.event_id === 'string' ? data.event_id : null,
    activeEventId: null,
  };
}

/** Reads the active override or the single date driven event. */
export async function getManagedEventState(referenceDate = new Date()): Promise<{ configured: boolean; hasManagedEvents: boolean; event: SeasonalEvent | null }> {
  try {
    const events = await listManagedEvents();
    const control = await getThemeControlState();
    if (control.mode === 'base') return { configured: true, hasManagedEvents: true, event: null };
    if (control.mode === 'automatic' && events.length === 0) {
      return { configured: true, hasManagedEvents: false, event: null };
    }
    let active = control.mode === 'event' ? events.find((event) => event.id === control.eventId && event.enabled) : undefined;
    const forceActive = Boolean(active && control.mode === 'event');
    if (!active && control.mode === 'automatic') {
      active = events.find((event) => event.enabled && event.activationMode === 'scheduled' && isManagedEventActive(event, referenceDate));
    }
    return { configured: true, hasManagedEvents: true, event: active ? toSeasonalEvent(active, referenceDate, forceActive) : null };
  } catch {
    return { configured: false, hasManagedEvents: false, event: null };
  }
}

export function normalizeManagedEvent(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  const localizedName = readLocalized(body.name, 160, true);
  const localizedDescription = readLocalized(body.description, 1000, false);
  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const themeKey = typeof body.themeKey === 'string' ? body.themeKey : '';
  const startsAt = typeof body.startsAt === 'string' ? parseDate(body.startsAt) : null;
  const endsAt = typeof body.endsAt === 'string' ? parseDate(body.endsAt) : null;
  const timeZone = typeof body.timeZone === 'string' ? body.timeZone.trim() : '';
  const activationMode = body.activationMode;
  const priority = body.priority;
  const palette = normalizePalette(body.palette, themeKey);
  const effects = normalizeEffects(body.effects);
  const artworkUrl = typeof body.artworkUrl === 'string' ? body.artworkUrl.trim() : '';
  const artworkPath = typeof body.artworkPath === 'string' ? body.artworkPath.trim() : '';
  const heroVideoUrl = typeof body.heroVideoUrl === 'string' ? body.heroVideoUrl.trim() : '';
  const heroVideoPath = typeof body.heroVideoPath === 'string' ? body.heroVideoPath.trim() : '';
  const ambientAudioUrl = typeof body.ambientAudioUrl === 'string' ? body.ambientAudioUrl.trim() : '';
  const ambientAudioPath = typeof body.ambientAudioPath === 'string' ? body.ambientAudioPath.trim() : '';
  const scareSoundUrl = typeof body.scareSoundUrl === 'string' ? body.scareSoundUrl.trim() : '';
  const scareSoundPath = typeof body.scareSoundPath === 'string' ? body.scareSoundPath.trim() : '';

  if (!localizedName || !localizedDescription || !palette || !effects
    || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80
    || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(themeKey) || themeKey.length > 48
    || !startsAt || !endsAt || Date.parse(endsAt) <= Date.parse(startsAt)
    || !timeZone || timeZone.length > 80 || !isValidTimeZone(timeZone)
    || (activationMode !== 'manual' && activationMode !== 'scheduled')
    || typeof body.enabled !== 'boolean' || typeof body.manualActive !== 'boolean'
    || typeof priority !== 'number' || !Number.isInteger(priority) || priority < 0 || priority > 100
    || !validOptionalEventMedia(artworkUrl, artworkPath, 'image')
    || !validOptionalEventMedia(heroVideoUrl, heroVideoPath, 'video')
    || !validOptionalEventMedia(ambientAudioUrl, ambientAudioPath, 'audio')
    || !validOptionalEventMedia(scareSoundUrl, scareSoundPath, 'audio')) return null;

  return {
    slug,
    name: localizedName,
    description: localizedDescription,
    theme_key: themeKey,
    starts_at: startsAt,
    ends_at: endsAt,
    time_zone: timeZone,
    activation_mode: activationMode,
    enabled: body.enabled,
    manual_active: body.manualActive,
    priority,
    artwork_url: artworkUrl,
    artwork_path: artworkPath,
    hero_video_url: heroVideoUrl,
    hero_video_path: heroVideoPath,
    ambient_audio_url: ambientAudioUrl,
    ambient_audio_path: ambientAudioPath,
    scare_sound_url: scareSoundUrl,
    scare_sound_path: scareSoundPath,
    campaign_content: mapCampaignContent(body.campaignContent),
    palette,
    effects,
  };
}

export function mapManagedEvent(row: EventRow): ManagedEvent {
  const paletteValue = objectValue(row.palette);
  const themeKey = stringValue(row.theme_key, 'custom');
  const palettePreset = EVENT_PALETTE_PRESETS[themeKey] || EVENT_PALETTE_PRESETS.custom;
  const palette = Object.fromEntries(Object.entries(palettePreset).map(([key, fallback]) => [
    key,
    isHexColor(paletteValue[key]) ? paletteValue[key] : fallback,
  ])) as EventPalette;
  const effectsValue = objectValue(row.effects);
  const allowedDecorations = new Set(EVENT_DECORATIONS.map((item) => item.key));
  const decorations = Array.isArray(effectsValue.decorations)
    ? effectsValue.decorations.filter((item): item is string => typeof item === 'string' && allowedDecorations.has(item as typeof EVENT_DECORATIONS[number]['key']))
    : [];
  const speed = effectsValue.decorationSpeed;

  return {
    id: stringValue(row.id),
    slug: stringValue(row.slug),
    name: localizedValue(row.name),
    description: localizedValue(row.description),
    themeKey,
    startsAt: stringValue(row.starts_at),
    endsAt: stringValue(row.ends_at),
    timeZone: stringValue(row.time_zone, 'Europe/Madrid'),
    activationMode: row.activation_mode === 'manual' ? 'manual' : 'scheduled',
    enabled: row.enabled === true,
    manualActive: row.manual_active === true,
    priority: finiteNumber(row.priority, 0),
    artworkUrl: stringValue(row.artwork_url),
    artworkPath: stringValue(row.artwork_path),
    heroVideoUrl: stringValue(row.hero_video_url),
    heroVideoPath: stringValue(row.hero_video_path),
    ambientAudioUrl: stringValue(row.ambient_audio_url),
    ambientAudioPath: stringValue(row.ambient_audio_path),
    scareSoundUrl: stringValue(row.scare_sound_url),
    scareSoundPath: stringValue(row.scare_sound_path),
    campaignContent: mapCampaignContent(row.campaign_content),
    palette,
    effects: {
      decorationsEnabled: effectsValue.decorationsEnabled === true,
      motionEnabled: effectsValue.motionEnabled !== false,
      decorations,
      decorationCount: Math.min(32, Math.max(0, finiteNumber(effectsValue.decorationCount, DEFAULT_EVENT_EFFECTS.decorationCount))),
      decorationSpeed: speed === 'slow' || speed === 'quick' ? speed : 'steady',
      decorationOpacity: Math.min(0.8, Math.max(0.1, finiteNumber(effectsValue.decorationOpacity, DEFAULT_EVENT_EFFECTS.decorationOpacity))),
      soundEnabled: effectsValue.soundEnabled === true,
      scareEffectsEnabled: effectsValue.scareEffectsEnabled === true,
    },
    createdAt: stringValue(row.created_at),
    updatedAt: stringValue(row.updated_at),
  };
}

function mapCampaignContent(value: unknown): EventCampaignContent {
  const content = objectValue(value);
  const activities = Array.isArray(content.activities) ? content.activities.flatMap((value) => {
    const activity = objectValue(value);
    const kind = activity.kind;
    if (kind !== 'reveal' && kind !== 'download' && kind !== 'maskLibrary') return [];
    return [{
      id: stringValue(activity.id),
      kind: kind as EventCampaignContent['activities'][number]['kind'],
      icon: stringValue(activity.icon, '✨'),
      title: localizedValue(activity.title),
      description: localizedValue(activity.description),
      reveal: localizedValue(activity.reveal),
      resourceUrl: stringValue(activity.resourceUrl),
      resourcePath: stringValue(activity.resourcePath),
    }];
  }) : [];
  return { title: localizedValue(content.title), intro: localizedValue(content.intro), activities };
}

export function toSeasonalEvent(event: ManagedEvent, referenceDate = new Date(), forceActive = false): SeasonalEvent {
  const floatingEmojis = EVENT_DECORATIONS
    .filter((item) => event.effects.decorations.includes(item.key))
    .map((item) => item.glyph);
  return {
    id: event.id,
    slug: event.slug,
    name: event.name,
    description: event.description,
    tagline: event.description,
    themeKey: event.themeKey,
    active: forceActive || isManagedEventActive(event, referenceDate),
    startDate: event.startsAt,
    endDate: event.endsAt,
    timeZone: event.timeZone,
    bannerImage: event.artworkUrl,
    managed: true,
    heroVideoUrl: event.heroVideoUrl,
    heroVideoPath: event.heroVideoPath,
    ambientAudioUrl: event.ambientAudioUrl,
    ambientAudioPath: event.ambientAudioPath,
    scareSoundUrl: event.scareSoundUrl,
    scareSoundPath: event.scareSoundPath,
    palette: event.palette,
    effects: event.effects,
    campaignContent: event.campaignContent,
    ambientDecorations: {
      glowColor: event.palette.accent,
      accentColor: event.palette.accent,
      floatingEmojis,
    },
  };
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function localizedValue(value: unknown) {
  const localized = objectValue(value);
  const es = stringValue(localized.es);
  const en = stringValue(localized.en, es);
  return { es, en };
}

function stringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function finiteNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

function readLocalized(value: unknown, maxLength: number, required: boolean) {
  const localized = objectValue(value);
  if (['es', 'en'].some((locale) => typeof localized[locale] !== 'string'
    || (localized[locale] as string).length > maxLength
    || (required && !(localized[locale] as string).trim()))) return null;
  const es = (localized.es as string).trim();
  const en = (localized.en as string).trim();
  return { es, en: en || es };
}

function normalizePalette(value: unknown, themeKey: string): EventPalette | null {
  const defaults = EVENT_PALETTE_PRESETS[themeKey] || EVENT_PALETTE_PRESETS.custom;
  if (!defaults) return null;
  const palette = objectValue(value);
  const result = Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [
    key,
    isHexColor(palette[key]) ? palette[key] : fallback,
  ])) as EventPalette;
  if (Object.values(result).some((color) => !isHexColor(color))) return null;
  return result;
}

function normalizeEffects(value: unknown): EventEffects | null {
  const effects = objectValue(value);
  const allowedDecorations = new Set(EVENT_DECORATIONS.map((item) => item.key));
  const decorations = Array.isArray(effects.decorations)
    ? [...new Set(effects.decorations.filter((item): item is string => typeof item === 'string' && allowedDecorations.has(item as typeof EVENT_DECORATIONS[number]['key'])))]
    : [];
  const count = effects.decorationCount;
  const opacity = effects.decorationOpacity;
  const speed = effects.decorationSpeed;
  if (typeof effects.decorationsEnabled !== 'boolean'
    || typeof effects.motionEnabled !== 'boolean'
    || typeof effects.soundEnabled !== 'boolean'
    || typeof effects.scareEffectsEnabled !== 'boolean'
    || typeof count !== 'number' || !Number.isInteger(count) || count < 0 || count > 32
    || typeof opacity !== 'number' || !Number.isFinite(opacity) || opacity < 0.1 || opacity > 0.8
    || (speed !== 'slow' && speed !== 'steady' && speed !== 'quick')) return null;
  return {
    decorationsEnabled: effects.decorationsEnabled,
    motionEnabled: effects.motionEnabled,
    decorations,
    decorationCount: count,
    decorationOpacity: opacity,
    decorationSpeed: speed,
    soundEnabled: effects.soundEnabled,
    scareEffectsEnabled: effects.scareEffectsEnabled,
  };
}

function validOptionalEventMedia(url: string, path: string, kind: 'video' | 'audio' | 'image') {
  if (!url && !path) return true;
  return isEventMediaAsset(url, path, kind);
}

function parseDate(value: string) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function isValidTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value }).format(new Date(0));
    return true;
  } catch {
    return false;
  }
}
