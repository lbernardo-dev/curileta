import 'server-only';

import { createHash, randomUUID } from 'node:crypto';
import { createClient } from '@sanity/client';
import type { LetterItem, LetterPhoto } from '@curileta/cms';

export type ManagedLetter = LetterItem & { documentId: string };

function getProjectId() {
  return process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
}

function getDataset() {
  return process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
}

function getSanityClient(write = false) {
  const projectId = getProjectId();
  const token = write ? process.env.SANITY_WRITE_TOKEN : (process.env.SANITY_READ_TOKEN || process.env.SANITY_WRITE_TOKEN);
  if (!projectId || projectId === 'curileta-demo') throw new Error('Falta configurar el proyecto editorial de Sanity.');
  if (write && !token) throw new Error('Falta configurar SANITY_WRITE_TOKEN para guardar las cartas.');
  return createClient({
    projectId,
    dataset: getDataset(),
    apiVersion: '2025-02-19',
    useCdn: false,
    token,
  });
}

const LETTERS_QUERY = `*[_type == "contentEntry" && contentType == "letter" && !(_id in path("drafts.**"))]
  | order(order asc, id asc) { ..., "documentId": _id }`;

function normalizePhotos(photos: unknown): LetterPhoto[] {
  if (!Array.isArray(photos)) return [];
  return photos.map((photo) => {
    const value = photo as LetterPhoto;
    return { ...value, visibility: value.visibility || 'public' };
  });
}

export async function listManagedLetters(): Promise<ManagedLetter[]> {
  const rows = await getSanityClient().fetch<Array<Record<string, unknown>>>(LETTERS_QUERY);
  return rows.map((row) => ({
    ...row,
    publicationStatus: (row.publicationStatus as LetterItem['publicationStatus']) || 'public',
    photos: normalizePhotos(row.photos),
  } as ManagedLetter));
}

function documentIdForLetter(id: string) {
  const digest = createHash('sha256').update(`letter\0${id}`).digest('hex').slice(0, 20);
  return `contentEntry-letter-${digest}`;
}

export async function saveManagedLetter(letter: LetterItem, previousId?: string) {
  const client = getSanityClient(true);
  let documentId = previousId
    ? await client.fetch<string | null>(
      '*[_type == "contentEntry" && contentType == "letter" && id == $id && !(_id in path("drafts.**"))][0]._id',
      { id: previousId },
    )
    : null;

  if (previousId && !documentId) throw new Error('La carta ya no existe. Actualiza la lista e inténtalo de nuevo.');
  if (previousId && letter.id !== previousId) {
    const collision = await client.fetch<string | null>(
      '*[_type == "contentEntry" && contentType == "letter" && id == $id && _id != $documentId && !(_id in path("drafts.**"))][0]._id',
      { id: letter.id, documentId },
    );
    if (collision) throw new Error('Ya existe una carta con ese identificador.');
  }
  if (!previousId) {
    const exists = await client.fetch<string | null>(
      '*[_type == "contentEntry" && contentType == "letter" && id == $id && !(_id in path("drafts.**"))][0]._id',
      { id: letter.id },
    );
    if (exists) throw new Error('Ya existe una carta con ese identificador.');
    documentId = documentIdForLetter(letter.id);
  }
  if (!documentId) throw new Error('La carta no tiene un identificador editorial válido.');

  const photos = letter.photos.map((photo) => ({
    ...photo,
    _key: photo.photoId || randomUUID(),
  }));
  await client.createOrReplace({
    _id: documentId,
    _type: 'contentEntry',
    contentType: 'letter',
    ...letter,
    photos,
  });
}

export async function deleteManagedLetter(id: string) {
  const client = getSanityClient(true);
  const documentId = await client.fetch<string | null>(
    '*[_type == "contentEntry" && contentType == "letter" && id == $id && !(_id in path("drafts.**"))][0]._id',
    { id },
  );
  if (!documentId) return false;
  await client.delete(documentId);
  return true;
}

export async function isLetterPhotoReferenced(path: string) {
  const client = getSanityClient();
  return client.fetch<boolean>(
    'count(*[_type == "contentEntry" && contentType == "letter" && !(_id in path("drafts.**")) && ($path in photos[].storagePath || $path in photos[].censoredStoragePath)]) > 0',
    { path },
  );
}
