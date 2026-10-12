export type EventActivationMode = 'scheduled' | 'manual';
export type EventDecorationSpeed = 'slow' | 'steady' | 'quick';

export interface EventPalette {
  accent: string;
  accentStrong: string;
  canvasLight: string;
  surfaceLight: string;
  textLight: string;
  canvasDark: string;
  surfaceDark: string;
  textDark: string;
}

export interface EventEffects {
  decorationsEnabled: boolean;
  motionEnabled: boolean;
  decorations: string[];
  decorationCount: number;
  decorationSpeed: EventDecorationSpeed;
  decorationOpacity: number;
  soundEnabled: boolean;
  scareEffectsEnabled: boolean;
  scareFrequency?: 'rare' | 'regular';
}

export interface ManagedEvent {
  id: string;
  slug: string;
  name: { es: string; en: string };
  description: { es: string; en: string };
  themeKey: string;
  startsAt: string;
  endsAt: string;
  timeZone: string;
  activationMode: EventActivationMode;
  enabled: boolean;
  manualActive: boolean;
  priority: number;
  heroVideoUrl: string;
  heroVideoPath: string;
  ambientAudioUrl: string;
  ambientAudioPath: string;
  scareSoundUrl: string;
  scareSoundPath: string;
  palette: EventPalette;
  effects: EventEffects;
  createdAt: string;
  updatedAt: string;
}

export interface ManagedBaseTheme {
  name: { es: string; en: string };
  themeKey: string;
  heroVideoUrl: string;
  heroVideoPath: string;
  ambientAudioUrl: string;
  ambientAudioPath: string;
  palette: EventPalette;
  effects: EventEffects;
  updatedAt: string;
}

export type ThemeOverrideMode = 'automatic' | 'base' | 'event';

export interface ThemeControlState {
  mode: ThemeOverrideMode;
  eventId: string | null;
  activeEventId: string | null;
}

export const EVENT_DECORATIONS = [
  { key: 'bats', label: 'Murciélagos', glyph: '🦇' },
  { key: 'leaves', label: 'Hojas de otoño', glyph: '🍂' },
  { key: 'pumpkins', label: 'Calabazas', glyph: '🎃' },
  { key: 'candles', label: 'Velas', glyph: '🕯️' },
  { key: 'webs', label: 'Telas de araña', glyph: '🕸️' },
  { key: 'spiders', label: 'Arañas', glyph: '🕷️' },
  { key: 'cornerSpiders', label: 'Arañas en las esquinas', glyph: '🕷️' },
  { key: 'cornerWebs', label: 'Telas en las esquinas', glyph: '🕸️' },
  { key: 'snow', label: 'Nieve', glyph: '❄️' },
  { key: 'hearts', label: 'Corazones', glyph: '💗' },
  { key: 'flowers', label: 'Flores y pétalos', glyph: '🌸' },
  { key: 'stars', label: 'Estrellas', glyph: '✨' },
] as const;

export const EVENT_PALETTE_PRESETS: Record<string, EventPalette> = {
  halloween: {
    accent: '#f97316', accentStrong: '#c2410c', canvasLight: '#fbf8f1', surfaceLight: '#f5f0e6', textLight: '#202018',
    canvasDark: '#0b100e', surfaceDark: '#181818', textDark: '#f8f5ec',
  },
  christmas: {
    accent: '#d96b55', accentStrong: '#a63838', canvasLight: '#f7faf6', surfaceLight: '#edf4ed', textLight: '#17241e',
    canvasDark: '#081713', surfaceDark: '#181f1b', textDark: '#f2f7f2',
  },
  spring: {
    accent: '#b66e9c', accentStrong: '#85416d', canvasLight: '#fbf8fb', surfaceLight: '#f4edf4', textLight: '#291e27',
    canvasDark: '#151218', surfaceDark: '#211b22', textDark: '#fbf6fb',
  },
  easter: {
    accent: '#9b79c8', accentStrong: '#684a95', canvasLight: '#fbf8fb', surfaceLight: '#f4edf4', textLight: '#291e27',
    canvasDark: '#151218', surfaceDark: '#211b22', textDark: '#fbf6fb',
  },
  summer: {
    accent: '#e38443', accentStrong: '#a64d26', canvasLight: '#f8fbf8', surfaceLight: '#edf5f0', textLight: '#172725',
    canvasDark: '#091a1d', surfaceDark: '#142326', textDark: '#f3f8f7',
  },
  valentines: {
    accent: '#dc6b87', accentStrong: '#a83f61', canvasLight: '#fdf7f9', surfaceLight: '#f8edf1', textLight: '#2b1b22',
    canvasDark: '#1e0f16', surfaceDark: '#281720', textDark: '#fff4f7',
  },
  custom: {
    accent: '#1b8a44', accentStrong: '#0d5c2c', canvasLight: '#fafdf7', surfaceLight: '#f1f7ee', textLight: '#17231a',
    canvasDark: '#101812', surfaceDark: '#1f1f1f', textDark: '#f4f8f3',
  },
};

export const DEFAULT_EVENT_EFFECTS: EventEffects = {
  decorationsEnabled: false,
  motionEnabled: true,
  decorations: [],
  decorationCount: 16,
  decorationSpeed: 'steady',
  decorationOpacity: 0.46,
  soundEnabled: false,
  scareEffectsEnabled: false,
};

export function isManagedEventActive(event: Pick<ManagedEvent, 'enabled' | 'activationMode' | 'manualActive' | 'startsAt' | 'endsAt'>, now = new Date()) {
  if (!event.enabled) return false;
  if (event.activationMode === 'manual') return event.manualActive;
  const start = Date.parse(event.startsAt);
  const end = Date.parse(event.endsAt);
  return Number.isFinite(start) && Number.isFinite(end) && now.getTime() >= start && now.getTime() <= end;
}

export function dateTimeValueInTimeZone(value: string, timeZone: string) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return '';
  const parts = zonedParts(new Date(timestamp), timeZone);
  if (!parts) return '';
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

/** Format a stored timestamp for the administrator's current local time zone. */
export function localDateTimeValue(value: string) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  return dateTimeValueInTimeZone(value, timeZone);
}

/** Convert a wall-clock value in an IANA time zone to UTC, rejecting nonexistent DST times. */
export function eventDateTimeToIso(value: string, timeZoneOrIncludeMinute?: string | boolean, includeMinuteOption = false) {
  const timeZone = typeof timeZoneOrIncludeMinute === 'string'
    ? timeZoneOrIncludeMinute
    : Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const includeMinute = typeof timeZoneOrIncludeMinute === 'boolean' ? timeZoneOrIncludeMinute : includeMinuteOption;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return '';
  const desired = match.slice(1).map(Number);
  const targetAsUtc = Date.UTC(desired[0], desired[1] - 1, desired[2], desired[3], desired[4]);
  let candidate = targetAsUtc;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = zonedParts(new Date(candidate), timeZone);
    if (!parts) return '';
    const representedAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
    candidate -= representedAsUtc - targetAsUtc;
  }
  const resolved = zonedParts(new Date(candidate), timeZone);
  if (!resolved || [resolved.year, resolved.month, resolved.day, resolved.hour, resolved.minute].some((part, index) => part !== desired[index])) return '';
  const date = new Date(candidate);
  if (includeMinute) date.setSeconds(59, 999);
  return date.toISOString();
}

function zonedParts(date: Date, timeZone: string) {
  try {
    const values = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(date);
    const part = (type: string) => Number(values.find((value) => value.type === type)?.value);
    const parts = { year: part('year'), month: part('month'), day: part('day'), hour: part('hour'), minute: part('minute') };
    return Object.values(parts).every(Number.isFinite) ? parts : null;
  } catch {
    return null;
  }
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function eventStatusLabel(event: ManagedEvent, now = new Date()) {
  if (!event.enabled || (event.activationMode === 'manual' && !event.manualActive)) return 'Desactivado';
  if (isManagedEventActive(event, now)) return 'Activo ahora';
  if (event.activationMode === 'manual') return 'Listo para activar';
  if (Date.parse(event.startsAt) > now.getTime()) return 'Programado';
  return 'Finalizado';
}
