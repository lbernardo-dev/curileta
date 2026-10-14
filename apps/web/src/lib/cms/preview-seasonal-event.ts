import 'server-only';

import type { SeasonalEvent } from '@curileta/cms';
import { EVENT_PALETTE_PRESETS } from '@/lib/events';

/** Representative Halloween content for the isolated Vercel Preview without CMS credentials. */
export const PREVIEW_HALLOWEEN_EVENT: SeasonalEvent = {
  id: 'preview-halloween-2026',
  slug: 'la-noche-de-las-pequenas-calabazas',
  name: {
    es: 'La noche de las pequeñas calabazas',
    en: 'The Night of the Little Pumpkins',
  },
  description: {
    es: 'Curileta y Pompón descubren un bosque vestido de naranja, con luces entre los árboles y misterios para resolver en familia.',
    en: 'Curileta and Pompón discover a forest dressed in orange, with lights between the trees and mysteries to solve together.',
  },
  tagline: {
    es: 'Una aventura de temporada para descubrir el bosque bajo la luz de las calabazas.',
    en: 'A seasonal adventure to discover the forest in the light of pumpkins.',
  },
  themeKey: 'halloween',
  active: true,
  managed: true,
  startDate: '2026-10-12T00:00:00+02:00',
  endDate: '2026-11-04T23:59:59+01:00',
  timeZone: 'Europe/Madrid',
  bannerImage: '/images/events/halloween-curileta-pompon-wide.webp',
  heroVideoUrl: '/videos/hero/events/halloween/curileta-halloween.mp4',
  heroVideoPath: 'static:theme:halloween-video',
  palette: EVENT_PALETTE_PRESETS.halloween,
  effects: {
    decorationsEnabled: true,
    motionEnabled: true,
    decorations: ['bats', 'leaves', 'pumpkins', 'webs', 'spiders', 'cornerWebs'],
    decorationCount: 20,
    decorationSpeed: 'steady',
    decorationOpacity: 0.46,
    soundEnabled: false,
    scareEffectsEnabled: false,
  },
  campaignContent: {
    title: {
      es: 'La noche de las pequeñas calabazas',
      en: 'The Night of the Little Pumpkins',
    },
    intro: {
      es: 'Curileta y Pompón descubren un bosque vestido de naranja. Hay luces entre los árboles, tres misterios por resolver y dos máscaras listas para imprimir.',
      en: 'Curileta and Pompón discover a forest dressed in orange. Lights glow between the trees, three mysteries await, and two masks are ready to print.',
    },
    activities: [
      {
        id: 'preview-halloween-masks',
        kind: 'maskLibrary',
        icon: '🎨',
        title: {
          es: 'Máscaras y láminas para colorear',
          en: 'Masks and coloring pages',
        },
        description: {
          es: 'Imprime las máscaras de Curileta y Pompón. Las láminas del bosque para colorear estarán disponibles próximamente.',
          en: 'Print Curileta and Pompón masks. Forest coloring pages will be available soon.',
        },
        reveal: { es: '', en: '' },
        resourceUrl: '',
        resourcePath: '',
      },
      {
        id: 'preview-halloween-riddles',
        kind: 'riddleSet',
        icon: '🌙',
        title: {
          es: 'El acertijo de la luna',
          en: 'The moon riddle',
        },
        description: {
          es: 'Resuelve tres misterios del bosque y avanza de uno en uno.',
          en: 'Solve three forest mysteries, one at a time.',
        },
        reveal: { es: '', en: '' },
        resourceUrl: '',
        resourcePath: '',
        riddles: [
          {
            id: 'preview-moon',
            title: { es: 'La luna viajera', en: 'The traveling moon' },
            prompt: {
              es: 'Por la noche aparezco y cambio de forma. A veces soy una sonrisa y otras, un círculo brillante. ¿Quién soy?',
              en: 'I appear at night and change shape. Sometimes I look like a smile, and sometimes a bright circle. What am I?',
            },
            answer: {
              es: 'La luna. Sus distintas fases nos acompañan mientras Curileta explora el bosque.',
              en: 'The moon. Its changing phases accompany Curileta as she explores the forest.',
            },
          },
          {
            id: 'preview-pumpkin',
            title: { es: 'La calabaza luminosa', en: 'The glowing pumpkin' },
            prompt: {
              es: 'Soy naranja y guardo semillas. Cuando llega la noche, una sonrisa recortada puede iluminar mi cara. ¿Qué soy?',
              en: 'I am orange and full of seeds. At night, a carved smile can light up my face. What am I?',
            },
            answer: {
              es: 'Una calabaza. Con ayuda de una persona adulta, puede convertirse en un farol para decorar el camino.',
              en: 'A pumpkin. With an adult’s help, it can become a lantern to light the path.',
            },
          },
          {
            id: 'preview-bat',
            title: { es: 'Las alas silenciosas', en: 'The silent wings' },
            prompt: {
              es: 'Vuelo cuando oscurece, descanso boca abajo y uso sonidos para orientarme. ¿Qué animal soy?',
              en: 'I fly after dark, rest upside down, and use sounds to find my way. What animal am I?',
            },
            answer: {
              es: 'Un murciélago. Es un animal nocturno que ayuda a la naturaleza y merece que cuidemos su hogar.',
              en: 'A bat. It is a nocturnal animal that helps nature, and its home deserves our care.',
            },
          },
        ],
      },
    ],
  },
  ambientDecorations: {
    glowColor: 'rgba(249, 115, 22, 0.45)',
    accentColor: '#f97316',
    floatingEmojis: ['🎃', '✨', '🦇', '🍂', '🕯️', '🌙'],
  },
};
