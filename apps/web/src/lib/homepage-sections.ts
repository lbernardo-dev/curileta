import type { SiteSettings } from '@curileta/cms';

const defaultSections = [
  { key: 'hero', order: 0, defaultVisible: true },
  { key: 'seasonalEvent', order: 1, defaultVisible: true },
  { key: 'taglineReveal', order: 2, defaultVisible: true },
  { key: 'videos', order: 3, defaultVisible: true },
  { key: 'globe', order: 4, defaultVisible: true },
  { key: 'radar', order: 5, defaultVisible: false },
  { key: 'characters', order: 6, defaultVisible: true },
  { key: 'books', order: 7, defaultVisible: true },
  { key: 'letters', order: 8, defaultVisible: true },
  { key: 'wallpapers', order: 9, defaultVisible: false },
  { key: 'roadmap', order: 10, defaultVisible: false },
  { key: 'collaborations', order: 11, defaultVisible: false },
  { key: 'seoUniverse', order: 12, defaultVisible: false },
  { key: 'faq', order: 13, defaultVisible: true },
  { key: 'closing', order: 14, defaultVisible: true },
] as const;

type SectionKey = (typeof defaultSections)[number]['key'];
type ConfiguredSection = NonNullable<SiteSettings['homepageSections']>[number];

export function resolveHomepageSections(configured?: SiteSettings['homepageSections']) {
  const knownKeys = new Set<SectionKey>(defaultSections.map(({ key }) => key));
  const configuredByKey = new Map<SectionKey, ConfiguredSection>();

  for (const section of configured || []) {
    const key = section.key as SectionKey;
    if (knownKeys.has(key) && !configuredByKey.has(key)) {
      configuredByKey.set(key, section);
    }
  }

  return defaultSections
    .map((fallback) => {
      const section = configuredByKey.get(fallback.key);
      const configuredOrder = section?.order;
      return {
        key: fallback.key,
        visible: section ? section.visible !== false : fallback.defaultVisible,
        order: typeof configuredOrder === 'number' && Number.isFinite(configuredOrder) ? configuredOrder : fallback.order,
        fallbackOrder: fallback.order,
      };
    })
    .sort((left, right) => left.order - right.order || left.fallbackOrder - right.fallbackOrder)
    .map(({ key, visible, order }) => ({ key, visible, order }));
}
