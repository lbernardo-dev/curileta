import type { LetterItem, LetterPhoto } from '@curileta/cms';
import { isSiteMediaAsset } from './site-media.server';

type LetterStatus = NonNullable<LetterItem['publicationStatus']>;

const letterIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const hexColorPattern = /^#[0-9a-f]{6}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function readText(value: unknown, max: number, required = false): string | null {
  if (typeof value !== 'string' || value.length > max) return null;
  const text = value.trim();
  return required && !text ? null : text;
}

function readLocalized(value: unknown, required: boolean, max: number) {
  if (!isRecord(value)) return null;
  const es = readText(value.es, max, required);
  const en = readText(value.en, max, required);
  return es === null || en === null ? null : { es, en };
}

function readParagraphs(value: unknown): { es: string[]; en: string[] } | null {
  if (!isRecord(value)) return null;
  const read = (paragraphs: unknown) => {
    const rows = typeof paragraphs === 'string' ? paragraphs.split('\n') : paragraphs;
    if (!Array.isArray(rows) || rows.length > 20 || rows.some((item) => typeof item !== 'string' || item.length > 2400)) return null;
    return rows.map((item) => (item as string).trim()).filter(Boolean);
  };
  const es = read(value.es);
  const en = read(value.en);
  return es === null || en === null ? null : { es, en };
}

function readEpisodeUrl(value: unknown): string | null {
  const url = readText(value, 500);
  if (url === null || !url) return url;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const isYouTube = host === 'youtu.be' || host === 'youtube.com' || host.endsWith('.youtube.com');
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password && isYouTube ? url : null;
  } catch {
    return null;
  }
}

function readPhoto(value: unknown): LetterPhoto | null {
  if (!isRecord(value)) return null;
  const visibility = value.visibility === undefined ? 'public' : value.visibility;
  if (visibility !== 'public' && visibility !== 'censored' && visibility !== 'hidden') return null;
  const title = readLocalized(value.title, false, 160);
  const fact = readLocalized(value.fact, false, 2400);
  const tag = readText(value.tag, 100);
  const tagEn = value.tagEn === undefined ? '' : readText(value.tagEn, 100);
  const imageUrl = readText(value.imageUrl, 2048);
  const storagePath = readText(value.storagePath, 200);
  const censoredImageUrl = value.censoredImageUrl === undefined ? '' : readText(value.censoredImageUrl, 2048);
  const censoredStoragePath = value.censoredStoragePath === undefined ? '' : readText(value.censoredStoragePath, 200);
  const photoId = readText(value.photoId, 80) || crypto.randomUUID();
  if (!title || !fact || tag === null || tagEn === null || imageUrl === null || storagePath === null
    || censoredImageUrl === null || censoredStoragePath === null) return null;
  if ((imageUrl && !isHttpsUrl(imageUrl)) || (storagePath && !isSiteMediaAsset(imageUrl, storagePath, 'letters/photos'))) return null;
  if ((censoredImageUrl && !isHttpsUrl(censoredImageUrl))
    || Boolean(censoredImageUrl) !== Boolean(censoredStoragePath)
    || (censoredStoragePath && !isSiteMediaAsset(censoredImageUrl, censoredStoragePath, 'letters/photos'))) return null;
  if (visibility === 'public' && (!title.es || !title.en || !fact.es || !fact.en)) return null;
  return { photoId, title, fact, tag, tagEn, imageUrl, storagePath, censoredImageUrl, censoredStoragePath, visibility };
}

function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function normalizeLetter(value: unknown): LetterItem | null {
  if (!isRecord(value)) return null;
  const id = readText(value.id, 80, true);
  const order = value.order;
  const publicationStatus = value.publicationStatus === undefined ? 'unpublished' : value.publicationStatus;
  const country = readLocalized(value.country, true, 120);
  const city = readLocalized(value.city, true, 160);
  const greeting = readLocalized(value.greeting, false, 240);
  const signOff = readLocalized(value.signOff, false, 600);
  const body = readParagraphs(value.body);
  const postmark = readText(value.postmark, 200);
  const postageColor = readText(value.postageColor, 7);
  const envelopeColor = readText(value.envelopeColor, 120);
  const episodeUrl = readEpisodeUrl(value.episodeUrl);
  if (!id || !letterIdPattern.test(id) || typeof order !== 'number' || !Number.isInteger(order) || order < 1 || order > 10000
    || (publicationStatus !== 'public' && publicationStatus !== 'censored' && publicationStatus !== 'unpublished')
    || !country || !city || !greeting || !signOff || !body || postmark === null || postageColor === null
    || !hexColorPattern.test(postageColor) || envelopeColor === null || episodeUrl === null) return null;
  if (!Array.isArray(value.photos) || value.photos.length > 32) return null;
  const photos = value.photos.map(readPhoto);
  if (photos.some((photo) => !photo)) return null;
  const normalizedPhotos = photos as LetterPhoto[];
  if (publicationStatus === 'public' && (
    !greeting.es || !greeting.en || !signOff.es || !signOff.en
    || body.es.length === 0 || body.en.length === 0
  )) return null;

  return {
    id,
    order,
    publicationStatus: publicationStatus as LetterStatus,
    episodeUrl,
    country,
    city,
    postmark,
    postageColor,
    envelopeColor,
    greeting,
    body,
    signOff,
    photos: normalizedPhotos,
  };
}

export function isValidLetterId(value: string) {
  return value.length <= 80 && letterIdPattern.test(value);
}
