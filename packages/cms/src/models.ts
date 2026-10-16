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
  author?: string;
  title: LocalizedString;
  slug: string;
  subtitle?: LocalizedString;
  coverImage: {
    url: string;
    alt: LocalizedString;
  };
  description: LocalizedString;
  publicationDate: string;
  publicationStatus?: 'published' | 'coming-soon';
  isbn?: string[];
  languages: string[];
  ageRange: string;
  pageCount?: number;
  publisher?: string;
  format?: LocalizedString;
  badge?: LocalizedString;
  colorTheme?: string;
  destinations?: string[];
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
  media?: DestinationMedia[];
  segments?: string[];
  sortOrder?: number;
  isPublished?: boolean;
  showOnHome?: boolean;
  homeSelectionManaged?: boolean;
}

export interface DestinationMedia {
  id: string;
  kind: 'image' | 'video';
  url: string;
  storagePath: string;
  alt: LocalizedString;
  caption?: LocalizedString;
  isCard: boolean;
  sortOrder: number;
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
  description?: LocalizedString;
  duration?: string;
  publishedAt: string;
  episodeNumber?: number;
  highlightTag?: LocalizedString;
  tags?: string[];
  playlistName?: LocalizedString;
  playlistId?: string;
  votingEnabled?: boolean;
  votePrompt?: LocalizedString;
  isPublished?: boolean;
  youtubeMetadata?: YouTubeContentMetadata;
}

export interface Song {
  id: string;
  title: LocalizedString;
  slug: string;
  coverImage: string;
  youtubeId?: string;
  audioUrl?: string;
  lyrics?: LocalizedString;
  description?: LocalizedString;
  duration?: string;
  publishedAt?: string;
  tags?: string[];
  playlistName?: LocalizedString;
  playlistId?: string;
  isPublished?: boolean;
  youtubeMetadata?: YouTubeContentMetadata;
}

export interface YouTubeContentMetadata {
  channelId?: string;
  channelTitle?: string;
  categoryId?: string;
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
  favoriteCount?: string;
  defaultLanguage?: string;
  defaultAudioLanguage?: string;
  liveBroadcastContent?: string;
  privacyStatus?: string;
  dimension?: string;
  definition?: string;
  caption?: string;
  licensedContent?: boolean;
  projection?: string;
  embeddable?: boolean;
  license?: string;
  madeForKids?: boolean;
  selfDeclaredMadeForKids?: boolean;
  playlistChannelId?: string;
  playlistChannelTitle?: string;
  playlistPublishedAt?: string;
  thumbnailUrls?: Record<string, string>;
}

export interface Wallpaper {
  id: string;
  title: LocalizedString;
  slug: string;
  deviceType: 'mobile' | 'desktop';
  category: 'personajes' | 'paisajes' | 'arte';
  resolution: string;
  thumbnail: string;
  fullImageUrl: string;
  tags: string[];
  characterId?: string;
  country?: LocalizedString;
  description?: LocalizedString;
  fileSizeBytes?: string;
}

export interface SeasonalEvent {
  id: string;
  slug: string;
  name: LocalizedString;
  description?: LocalizedString;
  tagline: LocalizedString;
  themeKey: string;
  active: boolean;
  startDate: string;
  endDate: string;
  bannerImage: string;
  managed?: boolean;
  timeZone?: string;
  heroVideoUrl?: string;
  heroVideoPath?: string;
  ambientAudioUrl?: string;
  ambientAudioPath?: string;
  scareSoundUrl?: string;
  scareSoundPath?: string;
  palette?: {
    accent: string;
    accentStrong: string;
    canvasLight: string;
    surfaceLight: string;
    textLight: string;
    canvasDark: string;
    surfaceDark: string;
    textDark: string;
  };
  effects?: {
    decorationsEnabled: boolean;
    motionEnabled: boolean;
    decorations: string[];
    decorationCount: number;
    decorationSpeed: 'slow' | 'steady' | 'quick';
    decorationOpacity: number;
    soundEnabled: boolean;
    scareEffectsEnabled: boolean;
    scareFrequency?: 'rare' | 'regular';
  };
  campaignContent?: {
    title: LocalizedString;
    intro: LocalizedString;
    activities: Array<{
      id: string;
      kind: 'reveal' | 'riddleSet' | 'download' | 'maskLibrary';
      icon: string;
      title: LocalizedString;
      description: LocalizedString;
      reveal: LocalizedString;
      resourceUrl: string;
      resourcePath: string;
      riddles?: Array<{
        id: string;
        title: LocalizedString;
        prompt: LocalizedString;
        answer: LocalizedString;
      }>;
    }>;
  };
  ambientDecorations: {
    glowColor: string;
    accentColor: string;
    floatingEmojis: string[];
  };
  specialChapter?: {
    id: string;
    title: LocalizedString;
    synopsis: LocalizedString;
    releaseDate: string;
    status: 'coming_soon' | 'published';
    badgeText: LocalizedString;
    thumbnail: string;
    youtubeId?: string;
  };
  featuredWallpapers?: string[];
  activities?: Array<{
    title: LocalizedString;
    description: LocalizedString;
    icon: string;
    status: 'coming_soon' | 'published';
  }>;
}

export interface LetterPhoto {
  photoId?: string;
  title: LocalizedString;
  fact: LocalizedString;
  tag: string;
  tagEn?: string;
  imageUrl?: string;
  storagePath?: string;
  censoredImageUrl?: string;
  censoredStoragePath?: string;
  visibility?: 'public' | 'censored' | 'hidden';
}

export interface LetterItem {
  id: string;
  order: number;
  publicationStatus?: 'public' | 'censored' | 'unpublished';
  episodeUrl?: string;
  country: LocalizedString;
  city: LocalizedString;
  postmark: string;
  postageColor: string;
  envelopeColor: string;
  greeting: LocalizedString;
  body: {
    es: string[];
    en: string[];
  };
  signOff: LocalizedString;
  photos: LetterPhoto[];
}

export interface UniverseRoadmapItem {
  id: string;
  title: LocalizedString;
  desc: LocalizedString;
  iconName: 'Book' | 'Music' | 'Calendar' | 'ShoppingBag' | 'Users' | 'Sparkles' | 'Radio';
  badge: LocalizedString;
  orderIndex: number;
}

export interface CollaborationOpportunity {
  id: string;
  title: LocalizedString;
  desc: LocalizedString;
  category: 'publishing' | 'licensing' | 'press' | 'education';
  iconName: 'Building2' | 'Award' | 'Newspaper' | 'Briefcase';
  orderIndex: number;
}

export interface SiteSettings {
  siteName: string;
  youtubeChannelUrl?: string;
  youtubeChannelTitle?: LocalizedString;
  youtubeChannelDescription?: LocalizedString;
  youtubeChannelTags?: string[];
  youtubeChannelAvatarUrl?: string;
  youtubeChannelHeaderUrl?: string;
  heroTagline: LocalizedString;
  heroSubtitle: LocalizedString;
  totalCountriesCount: number;
  totalCharactersCount: number;
  totalBooksCount: number;
  featuredQuote: LocalizedString;
  statsBadges: Array<{
    icon: string;
    label: LocalizedString;
    value: string;
  }>;
  homepageSections?: Array<{
    key: 'hero' | 'seasonalEvent' | 'taglineReveal' | 'story' | 'globe' | 'radar' | 'letters' | 'characters' | 'books' | 'videos' | 'wallpapers' | 'roadmap' | 'collaborations' | 'seoUniverse' | 'faq' | 'closing';
    visible: boolean;
    order: number;
  }>;
}
