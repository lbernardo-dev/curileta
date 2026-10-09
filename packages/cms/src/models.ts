export interface LocalizedString {
  es: string;
  en?: string;
  [key: string]: string | undefined;
}

export interface Character {
  id: string;
  name: string;
  slug: string;
  shortDescription: LocalizedString;
  biography?: LocalizedString;
  species?: string;
  personality?: string[];
  values?: string[];
  passportRole?: LocalizedString;
  explorerStats?: {
    curiosity: number;
    courage: number;
    agility: number;
    wisdom: number;
  };
  backpackItems?: LocalizedString[];
  curiosityFacts?: LocalizedString[];
  voiceQuote?: LocalizedString;
  mainImage: {
    url: string;
    alt: LocalizedString;
    aspectRatio?: number;
  };
  gallery?: Array<{ url: string; alt?: LocalizedString }>;
  relatedBooks?: string[];
  relatedEpisodes?: string[];
  relatedLocations?: string[];
}

export interface Book {
  id: string;
  title: LocalizedString;
  slug: string;
  subtitle?: LocalizedString;
  coverImage: {
    url: string;
    alt: LocalizedString;
  };
  description: LocalizedString;
  publicationDate: string;
  isbn?: string[];
  languages: string[];
  ageRange: string;
  pageCount?: number;
  publisher?: string;
  purchaseLinks?: Array<{
    storeName: string;
    url: string;
  }>;
  characters?: string[];
  locations?: string[];
}

export interface Adventure {
  id: string;
  number: number;
  title: LocalizedString;
  slug: string;
  synopsis: LocalizedString;
  heroImage: {
    url: string;
    alt: LocalizedString;
  };
  countries: string[];
  locations: string[];
  characters: string[];
  bookRef?: string;
}

export interface Location {
  id: string;
  name: LocalizedString;
  slug: string;
  country: LocalizedString;
  theme?: LocalizedString;
  climate?: LocalizedString;
  coordinates: {
    lat: number;
    lng: number;
  };
  passportStamp?: {
    icon: string;
    code: string;
    color: string;
  };
  description: LocalizedString;
  heroImage: {
    url: string;
    alt: LocalizedString;
  };
  curiosities?: LocalizedString[];
  characters?: string[];
  milestones?: NarrativeMilestone[];
  mentionedPlaces?: MentionedCuriosity[];
}

export interface NarrativeMilestone {
  order: number;
  place: LocalizedString;
  country: LocalizedString;
  whatHappens: LocalizedString;
  charactersPresent: string[];
  isTravesia?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface MentionedCuriosity {
  id: string;
  name: LocalizedString;
  country: LocalizedString;
  curiosityFact: LocalizedString;
  isMentionOnly: true;
}

export interface TrailWaypoint {
  id: string;
  stepNumber: number;
  title: LocalizedString;
  subtitle: LocalizedString;
  stampCode: string;
  coordinatesText: string;
  badgeIcon: string;
  dateStamp: string;
  note: LocalizedString;
  color: string;
}

export interface Video {
  id: string;
  title: LocalizedString;
  slug: string;
  youtubeId: string;
  thumbnail: string;
  type: 'episode' | 'short' | 'song' | 'trailer';
  duration?: string;
  publishedAt: string;
}

export interface Song {
  id: string;
  title: LocalizedString;
  slug: string;
  coverImage: string;
  youtubeId?: string;
  audioUrl?: string;
  lyrics?: LocalizedString;
  duration?: string;
}
