import { localizedString } from './objects/localizedString';
import { localizedText } from './objects/localizedText';
import { character } from './documents/character';
import { book } from './documents/book';
import { location } from './documents/location';
import { video } from './documents/video';
import { collaboration } from './documents/collaboration';
import { siteSettings } from './documents/siteSettings';

export const schemaTypes = [
  // Objetos reutilizables
  localizedString,
  localizedText,

  // Documentos editoriales
  character,
  book,
  location,
  video,
  collaboration,
  siteSettings,
];
