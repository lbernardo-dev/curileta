import type { DestinationMedia, Location, LocalizedString } from '@curileta/cms';
import { isDestinationMediaAsset } from '@/lib/destination-media.server';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const colorPattern = /^#[0-9a-f]{6}$/i;

export function normalizeDestination(value: unknown): Location | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const slug = typeof row.slug === 'string' ? row.slug.trim() : '';
  const id = typeof row.id === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(row.id.trim()) ? row.id.trim() : slug;
  const name = readLocalized(row.name, true, 120);
  const country = readLocalized(row.country, true, 100);
  const description = readLocalized(row.description, true, 2400);
  const theme = readLocalized(row.theme, false, 240);
  const climate = readLocalized(row.climate, false, 160);
  if (!slugPattern.test(slug) || slug.length > 96 || !name || !country || !description) return null;

  const coordinates = readCoordinates(row.coordinates);
  const heroImage = readHeroImage(row.heroImage);
  if (!coordinates || !heroImage) return null;

  const curiosities = readLocalizedList(row.curiosities, 20, 600);
  const media = readMedia(row.media);
  const segments = readSegments(row.segments);
  const characters = readStringList(row.characters, 30, 96);
  const sortOrder = readInteger(row.sortOrder, 0, 10000);
  const isPublished = typeof row.isPublished === 'boolean' ? row.isPublished : false;
  const showOnHome = typeof row.showOnHome === 'boolean' ? row.showOnHome : false;
  const passportStamp = readPassportStamp(row.passportStamp);

  if (curiosities === null || media === null || segments === null || characters === null || sortOrder === null || passportStamp === null) return null;
  if (isPublished && !heroImage.url) return null;
  const cardMedia = media.filter((item) => item.isCard);
  if (cardMedia.length > 1 || cardMedia.some((item) => item.kind !== 'image')) return null;

  const selectedCard = cardMedia[0];
  return {
    id,
    name,
    slug,
    country,
    ...(theme ? { theme } : {}),
    ...(climate ? { climate } : {}),
    coordinates,
    ...(passportStamp ? { passportStamp } : {}),
    description,
    heroImage: selectedCard
      ? { url: selectedCard.url, alt: selectedCard.alt }
      : heroImage,
    curiosities,
    characters,
    media,
    segments,
    sortOrder,
    isPublished,
    showOnHome,
  };
}

export function normalizeDestinationMedia(value: unknown): DestinationMedia[] | null {
  return readMedia(value);
}

export function readDestinationSortOrder(value: unknown) {
  return readInteger(value, 0, 10000);
}

function readLocalized(value: unknown, required: boolean, max: number): LocalizedString | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const es = typeof row.es === 'string' ? row.es.trim() : '';
  const en = typeof row.en === 'string' ? row.en.trim() : '';
  if (es.length > max || en.length > max || (required && (!es || !en))) return null;
  return { es, en };
}

function readLocalizedList(value: unknown, maxCount: number, maxLength: number): LocalizedString[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > maxCount) return null;
  const entries = value.map((entry) => readLocalized(entry, true, maxLength));
  return entries.some((entry) => !entry) ? null : entries as LocalizedString[];
}

function readCoordinates(value: unknown): { lat: number; lng: number } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (typeof row.lat !== 'number' || !Number.isFinite(row.lat) || row.lat < -90 || row.lat > 90
    || typeof row.lng !== 'number' || !Number.isFinite(row.lng) || row.lng < -180 || row.lng > 180) return null;
  return { lat: row.lat, lng: row.lng };
}

function readHeroImage(value: unknown): Location['heroImage'] | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const url = typeof row.url === 'string' ? row.url.trim() : '';
  const alt = readLocalized(row.alt, false, 240);
  if (!alt) return null;
  if (url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:' || parsed.username || parsed.password) return null;
    } catch {
      if (!url.startsWith('/')) return null;
    }
  }
  return { url, alt };
}

function readMedia(value: unknown): DestinationMedia[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 40) return null;
  const result: DestinationMedia[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null;
    const row = entry as Record<string, unknown>;
    const kind = row.kind;
    if (kind !== 'image' && kind !== 'video') return null;
    const url = typeof row.url === 'string' ? row.url : '';
    const storagePath = typeof row.storagePath === 'string' ? row.storagePath : '';
    if (!isDestinationMediaAsset(url, storagePath, kind)) return null;
    const alt = readLocalized(row.alt, true, 240);
    const caption = row.caption === undefined ? undefined : readLocalized(row.caption, false, 500);
    const sortOrder = readInteger(row.sortOrder, 0, 10000);
    if (!alt || caption === null || sortOrder === null
      || typeof row.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(row.id)
      || typeof row.isCard !== 'boolean' || (row.isCard && kind !== 'image')) return null;
    result.push({
      id: row.id,
      kind,
      url,
      storagePath,
      alt,
      ...(caption ? { caption } : {}),
      isCard: row.isCard,
      sortOrder,
    });
  }
  if (result.filter((item) => item.isCard).length > 1) return null;
  return result.sort((left, right) => left.sortOrder - right.sortOrder);
}

function readSegments(value: unknown): string[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 12) return null;
  const normalized = value.map((item) => typeof item === 'string' ? item.trim().toLocaleLowerCase('en') : '');
  if (normalized.some((item) => !item || item.length > 40 || !slugPattern.test(item))) return null;
  return [...new Set(normalized)];
}

function readStringList(value: unknown, maxCount: number, maxLength: number): string[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > maxCount) return null;
  const normalized = value.map((item) => typeof item === 'string' ? item.trim() : '');
  if (normalized.some((item) => !item || item.length > maxLength)) return null;
  return [...new Set(normalized)];
}

function readInteger(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) return null;
  return value;
}

function readPassportStamp(value: unknown): Location['passportStamp'] | undefined | null {
  if (value === undefined || value === null) return undefined;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const icon = typeof row.icon === 'string' ? row.icon.trim() : '';
  const code = typeof row.code === 'string' ? row.code.trim() : '';
  const color = typeof row.color === 'string' ? row.color.trim() : '';
  if (icon.length > 40 || code.length > 32 || (color && !colorPattern.test(color))) return null;
  return { icon: icon || 'MapPin', code, color: color || '#1b8a44' };
}
