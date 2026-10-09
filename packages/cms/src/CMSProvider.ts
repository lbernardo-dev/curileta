import {
  Character,
  Book,
  Adventure,
  Video,
  Song,
  Location,
  TrailWaypoint,
  NarrativeMilestone,
  MentionedCuriosity,
} from './models';

/**
 * CMSProvider: Interfaz del adaptador de contenido.
 * Desacopla Next.js del SDK de Sanity o cualquier proveedor futuro.
 */
export interface CMSProvider {
  getCharacters(locale?: string): Promise<Character[]>;
  getCharacterBySlug(slug: string, locale?: string): Promise<Character | null>;
  getBooks(locale?: string): Promise<Book[]>;
  getBookBySlug(slug: string, locale?: string): Promise<Book | null>;
  getAdventures(locale?: string): Promise<Adventure[]>;
  getVideos(locale?: string): Promise<Video[]>;
  getSongs(locale?: string): Promise<Song[]>;
  getLocations(locale?: string): Promise<Location[]>;
  getTrailWaypoints(locale?: string): Promise<TrailWaypoint[]>;
  getNarrativeMilestones(locale?: string): Promise<NarrativeMilestone[]>;
  getMentionedCuriosities(locale?: string): Promise<MentionedCuriosity[]>;
}
