import type { Video } from '@curileta/cms';

/** Public catalogue entries used only to review the channel layout in an isolated Preview. */
export const PREVIEW_PUBLIC_VIDEOS: Video[] = [
  {
    id: 'curileta-cap-1-el-mundo-no-cabe-en-un-solo-arbol',
    slug: 'curileta-cap-1-el-mundo-no-cabe-en-un-solo-arbol',
    youtubeId: 'mFOrs8Ear38',
    title: {
      es: 'Curileta | Cap. 1: El mundo no cabe en un solo árbol',
      en: 'Curileta | Ep. 1: The world is bigger than one tree',
    },
    thumbnail: 'https://i.ytimg.com/vi/mFOrs8Ear38/hqdefault.jpg',
    type: 'episode',
    description: {
      es: 'Curileta se despide de Pompón y comienza su viaje para descubrir el mundo.',
      en: 'Curileta says goodbye to Pompón and begins her journey to discover the world.',
    },
    duration: '8:11',
    publishedAt: '2026-10-11T00:00:00.000Z',
    episodeNumber: 1,
    playlistName: { es: 'Temporada 1', en: 'Season 1' },
    playlistId: 'PLCwCIlxO526U',
    isPublished: true,
  },
  {
    id: 'conoce-a-curileta-la-curiosa-exploradora',
    slug: 'conoce-a-curileta-la-curiosa-exploradora',
    youtubeId: 'SXs2jss-guI',
    title: {
      es: 'Conoce a Curileta, la curiosa exploradora',
      en: 'Meet Curileta, the curious explorer',
    },
    thumbnail: 'https://i.ytimg.com/vi/SXs2jss-guI/hqdefault.jpg',
    type: 'short',
    description: {
      es: 'Una pequeña exploradora viaja por lugares reales del mundo y escribe cartas a su amigo Pompón.',
      en: 'A little explorer travels to real places around the world and writes letters to her friend Pompón.',
    },
    duration: '1:01',
    publishedAt: '2026-10-10T00:00:00.000Z',
    isPublished: true,
  },
];
