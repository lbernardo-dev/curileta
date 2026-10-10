import { createHash } from 'node:crypto';

export const SITE_SETTINGS_DOCUMENT_ID = 'siteSettings-singleton';

export function makeContentEntryDocumentId(contentType, entryId) {
  const key = `${contentType}\0${String(entryId)}`;
  const digest = createHash('sha256').update(key).digest('hex').slice(0, 20);
  return `contentEntry-${contentType}-${digest}`;
}

export function makePublicDocumentId(document) {
  if (document._type === 'siteSettings') return SITE_SETTINGS_DOCUMENT_ID;
  if (document._type === 'contentEntry' && document.contentType && document.id) {
    return makeContentEntryDocumentId(document.contentType, document.id);
  }
  throw new Error(`No se puede generar un ID público para ${document._type || 'el documento'} (${document._id || 'sin ID'}).`);
}
