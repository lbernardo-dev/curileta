export const ADMIN_MANAGED_CONTENT_TYPES = [
  'character',
  'book',
  'adventure',
  'trailWaypoint',
  'narrativeMilestone',
  'mentionedCuriosity',
  'wallpaper',
  'universeRoadmapItem',
  'collaboration',
  'siteSettings',
] as const;

export type AdminManagedContentType = (typeof ADMIN_MANAGED_CONTENT_TYPES)[number];

export interface ManagedContentEntry {
  contentType: AdminManagedContentType;
  contentId: string;
  slug: string | null;
  payload: Record<string, unknown>;
  sortOrder: number;
  isPublished: boolean;
  isDeleted: boolean;
  updatedAt: string;
}
