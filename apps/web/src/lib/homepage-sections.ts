import type { SiteSettings } from '@curileta/cms';

const defaultSections = [
  { key: 'hero', order: 0 },
  { key: 'seasonalEvent', order: 1 },
  { key: 'story', order: 2 },
  { key: 'globe', order: 3 },
  { key: 'radar', order: 4 },
  { key: 'letters', order: 5 },
  { key: 'characters', order: 6 },
  { key: 'books', order: 7 },
  { key: 'videos', order: 8 },
  { key: 'wallpapers', order: 9 },
  { key: 'roadmap', order: 10 },
  { key: 'collaborations', order: 11 },
  { key: 'closing', order: 12 },
] as const;

type SectionKey = (typeof defaultSections)[number]['key'];
type ConfiguredSection = NonNullable<SiteSettings['homepageSections']>[number];

export function resolveHomepageSections(configured?: SiteSettings['homepageSections']) {
  const knownKeys = new Set<SectionKey>(defaultSections.map(({ key }) => key));
  const configuredByKey = new Map<SectionKey, ConfiguredSection>();

  for (const section of configured || []) {
    if (knownKeys.has(section.key) && !configuredByKey.has(section.key)) {
      configuredByKey.set(section.key, section);
    }
  }

  return defaultSections
    .map((fallback) => {
      const section = configuredByKey.get(fallback.key);
      const configuredOrder = section?.order;
      return {
        key: fallback.key,
        visible: section?.visible !== false,
        order: typeof configuredOrder === 'number' && Number.isFinite(configuredOrder) ? configuredOrder : fallback.order,
        fallbackOrder: fallback.order,
      };
    })
    .sort((left, right) => left.order - right.order || left.fallbackOrder - right.fallbackOrder)
    .map(({ key, visible, order }) => ({ key, visible, order }));
}
