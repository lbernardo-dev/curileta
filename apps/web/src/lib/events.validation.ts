import { EVENT_DECORATIONS, type EventActivationMode, type EventCampaignContent, type EventEffects, type EventPalette, type ManagedBaseTheme } from './events';
import { isEventMediaAsset } from './event-media.server';

export interface NormalizedEventData {
  slug: string;
  name: { es: string; en: string };
  description: { es: string; en: string };
  theme_key: string;
  starts_at: string;
  ends_at: string;
  time_zone: string;
  activation_mode: EventActivationMode;
  enabled: boolean;
  manual_active: boolean;
  priority: number;
  artwork_url: string;
  artwork_path: string;
  hero_video_url: string;
  hero_video_path: string;
  ambient_audio_url: string;
  ambient_audio_path: string;
  scare_sound_url: string;
  scare_sound_path: string;
  campaign_content: EventCampaignContent;
  palette: EventPalette;
  effects: EventEffects;
}

export function normalizeEventBody(body: Record<string, unknown>): NormalizedEventData | null {
  const name = readLocalized(body.name, 120, true);
  const description = readLocalized(body.description, 1000, true);
  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const themeKey = typeof body.themeKey === 'string' ? body.themeKey.trim() : '';
  const startsAt = parseDate(body.startsAt);
  const endsAt = parseDate(body.endsAt, true);
  const timeZone = typeof body.timeZone === 'string' ? body.timeZone.trim() : '';
  const activationMode = body.activationMode;
  const priority = body.priority;
  const palette = normalizePalette(body.palette);
  const effects = normalizeEffects(body.effects);
  const campaignContent = normalizeCampaignContent(body.campaignContent);
  const artworkUrl = typeof body.artworkUrl === 'string' ? body.artworkUrl : '';
  const artworkPath = typeof body.artworkPath === 'string' ? body.artworkPath : '';
  const heroVideoUrl = typeof body.heroVideoUrl === 'string' ? body.heroVideoUrl : '';
  const heroVideoPath = typeof body.heroVideoPath === 'string' ? body.heroVideoPath : '';
  const ambientAudioUrl = typeof body.ambientAudioUrl === 'string' ? body.ambientAudioUrl : '';
  const ambientAudioPath = typeof body.ambientAudioPath === 'string' ? body.ambientAudioPath : '';
  const scareSoundUrl = typeof body.scareSoundUrl === 'string' ? body.scareSoundUrl : '';
  const scareSoundPath = typeof body.scareSoundPath === 'string' ? body.scareSoundPath : '';

  if (!name || !description || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80
    || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(themeKey) || themeKey.length > 48
    || !startsAt || !endsAt || Date.parse(endsAt) <= Date.parse(startsAt)
    || !isTimeZone(timeZone) || !campaignContent
    || (activationMode !== 'scheduled' && activationMode !== 'manual')
    || typeof body.enabled !== 'boolean' || typeof body.manualActive !== 'boolean'
    || typeof priority !== 'number' || !Number.isInteger(priority) || priority < 0 || priority > 100
    || !palette || !effects
    || artworkUrl.length > 2_048 || artworkPath.length > 180
    || heroVideoUrl.length > 2_048 || heroVideoPath.length > 180
    || ambientAudioUrl.length > 2_048 || ambientAudioPath.length > 180
    || scareSoundUrl.length > 2_048 || scareSoundPath.length > 180
    || Boolean(artworkUrl) !== Boolean(artworkPath)
    || Boolean(heroVideoUrl) !== Boolean(heroVideoPath)
    || Boolean(ambientAudioUrl) !== Boolean(ambientAudioPath)
    || Boolean(scareSoundUrl) !== Boolean(scareSoundPath)
    || (artworkPath && !isEventMediaAsset(artworkUrl, artworkPath, 'image'))
    || (heroVideoPath && !isEventMediaAsset(heroVideoUrl, heroVideoPath, 'video'))
    || (ambientAudioPath && !isEventMediaAsset(ambientAudioUrl, ambientAudioPath, 'audio'))) return null;
  if (scareSoundPath && !isEventMediaAsset(scareSoundUrl, scareSoundPath, 'audio')) return null;

  return {
    slug,
    name,
    description,
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
    campaign_content: campaignContent,
    palette,
    effects,
  };
}

function normalizeCampaignContent(value: unknown): EventCampaignContent | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const content = value as Record<string, unknown>;
  const title = readLocalized(content.title, 140, true);
  const intro = readLocalized(content.intro, 1200, true);
  if (!title || !intro || !Array.isArray(content.activities) || content.activities.length > 6) return null;
  const ids = new Set<string>();
  const activities = [];
  for (const raw of content.activities) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const activity = raw as Record<string, unknown>;
    const id = typeof activity.id === 'string' ? activity.id.trim() : '';
    const kind = activity.kind;
    const icon = typeof activity.icon === 'string' ? activity.icon.trim() : '';
    const activityTitle = readLocalized(activity.title, 100, true);
    const description = readLocalized(activity.description, 320, true);
    const reveal = readLocalized(activity.reveal, 640, kind === 'reveal');
    const resourceUrl = typeof activity.resourceUrl === 'string' ? activity.resourceUrl.trim() : '';
    const resourcePath = typeof activity.resourcePath === 'string' ? activity.resourcePath.trim() : '';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || id.length > 48 || ids.has(id)
      || (kind !== 'reveal' && kind !== 'download') || !icon || icon.length > 12
      || !activityTitle || !description || !reveal
      || resourceUrl.length > 2048 || resourcePath.length > 180
      || Boolean(resourceUrl) !== Boolean(resourcePath)
      || (kind === 'download' && !isOptionalEventResource(resourceUrl, resourcePath))) return null;
    if (kind === 'reveal' && (resourceUrl || resourcePath)) return null;
    if (kind === 'download' && (!resourceUrl || !resourcePath)) return null;
    ids.add(id);
    activities.push({ id, kind: kind as EventCampaignContent['activities'][number]['kind'], icon, title: activityTitle, description, reveal, resourceUrl, resourcePath });
  }
  return { title, intro, activities };
}

function isOptionalEventResource(url: string, path: string) {
  return isEventMediaAsset(url, path, 'pdf');
}

export function normalizeBaseThemeBody(body: Record<string, unknown>): Omit<ManagedBaseTheme, 'updatedAt'> | null {
  const name = readLocalized(body.name, 120, true);
  const themeKey = typeof body.themeKey === 'string' ? body.themeKey.trim() : '';
  const palette = normalizePalette(body.palette);
  const effects = normalizeEffects(body.effects);
  const heroVideoUrl = typeof body.heroVideoUrl === 'string' ? body.heroVideoUrl : '';
  const heroVideoPath = typeof body.heroVideoPath === 'string' ? body.heroVideoPath : '';
  const ambientAudioUrl = typeof body.ambientAudioUrl === 'string' ? body.ambientAudioUrl : '';
  const ambientAudioPath = typeof body.ambientAudioPath === 'string' ? body.ambientAudioPath : '';
  if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(themeKey) || themeKey.length > 48 || !palette || !effects
    || heroVideoUrl.length > 2048 || heroVideoPath.length > 180 || ambientAudioUrl.length > 2048 || ambientAudioPath.length > 180
    || Boolean(heroVideoUrl) !== Boolean(heroVideoPath) || Boolean(ambientAudioUrl) !== Boolean(ambientAudioPath)
    || (heroVideoPath && !isEventMediaAsset(heroVideoUrl, heroVideoPath, 'video'))
    || (ambientAudioPath && !isEventMediaAsset(ambientAudioUrl, ambientAudioPath, 'audio'))) return null;
  return {
    name,
    themeKey,
    heroVideoUrl,
    heroVideoPath,
    ambientAudioUrl,
    ambientAudioPath,
    palette,
    effects: { ...effects, scareEffectsEnabled: false },
  };
}

function readLocalized(value: unknown, max: number, required: boolean) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const fields = value as Record<string, unknown>;
  if (['es', 'en'].some((locale) => typeof fields[locale] !== 'string'
    || (fields[locale] as string).length > max
    || (required && !(fields[locale] as string).trim()))) return null;
  return { es: (fields.es as string).trim(), en: (fields.en as string).trim() };
}

function parseDate(value: unknown, includeMinute = false) {
  if (typeof value !== 'string' || value.length > 40) return '';
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return '';
  if (includeMinute) parsed.setSeconds(59, 999);
  return parsed.toISOString();
}

function normalizePalette(value: unknown): EventPalette | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const palette = value as Record<string, unknown>;
  const keys: Array<keyof EventPalette> = [
    'accent', 'accentStrong', 'canvasLight', 'surfaceLight', 'textLight', 'canvasDark', 'surfaceDark', 'textDark',
  ];
  if (keys.some((key) => typeof palette[key] !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(palette[key] as string))) return null;
  return Object.fromEntries(keys.map((key) => [key, palette[key]])) as unknown as EventPalette;
}

function normalizeEffects(value: unknown): EventEffects | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const effects = value as Record<string, unknown>;
  const allowed = new Set(EVENT_DECORATIONS.map((item) => item.key));
  if (typeof effects.decorationsEnabled !== 'boolean' || typeof effects.motionEnabled !== 'boolean'
    || !Array.isArray(effects.decorations) || effects.decorations.length > EVENT_DECORATIONS.length
    || effects.decorations.some((key) => typeof key !== 'string' || !allowed.has(key as typeof EVENT_DECORATIONS[number]['key']))
    || new Set(effects.decorations).size !== effects.decorations.length
    || typeof effects.decorationCount !== 'number' || !Number.isInteger(effects.decorationCount) || effects.decorationCount < 0 || effects.decorationCount > 32
    || !['slow', 'steady', 'quick'].includes(String(effects.decorationSpeed))
    || typeof effects.decorationOpacity !== 'number' || !Number.isFinite(effects.decorationOpacity) || effects.decorationOpacity < 0.1 || effects.decorationOpacity > 0.8
    || typeof effects.soundEnabled !== 'boolean' || typeof effects.scareEffectsEnabled !== 'boolean'
    || (effects.scareFrequency !== undefined && effects.scareFrequency !== 'rare' && effects.scareFrequency !== 'regular')) return null;

  return {
    decorationsEnabled: effects.decorationsEnabled,
    motionEnabled: effects.motionEnabled,
    decorations: effects.decorations as string[],
    decorationCount: effects.decorationCount,
    decorationSpeed: effects.decorationSpeed as EventEffects['decorationSpeed'],
    decorationOpacity: effects.decorationOpacity,
    soundEnabled: effects.soundEnabled,
    scareEffectsEnabled: effects.scareEffectsEnabled,
    scareFrequency: effects.scareFrequency === 'regular' ? 'regular' : 'rare',
  };
}

function isTimeZone(value: string) {
  if (!value || value.length > 80) return false;
  try {
    new Intl.DateTimeFormat('es-ES', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}
