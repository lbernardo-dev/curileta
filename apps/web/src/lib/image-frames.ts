export interface ImageFrameSettings {
  positionX: number;
  positionY: number;
  zoom: number;
}

export const IMAGE_FRAME_TARGETS = {
  'home-book-cover': {
    title: 'Portada del bloque de historia en inicio',
    description: 'Ilustración panorámica junto al bloque «La historia en un libro».',
    imageSrc: '/images/books/las-aventuras-de-curileta/portada.webp',
    aspectRatio: '5 / 4',
    desktopAspectRatio: '1 / 1',
    defaults: { positionX: 50, positionY: 43, zoom: 1 },
  },
  'home-books-cover': {
    title: 'Portada de la tarjeta de libros en inicio',
    description: 'Ilustración del libro en la sección de libros de la portada.',
    imageSrc: '/images/books/las-aventuras-de-curileta/portada.webp',
    aspectRatio: '5 / 4',
    desktopAspectRatio: '1 / 1',
    defaults: { positionX: 50, positionY: 43, zoom: 1 },
  },
  'catalog-book-cover': {
    title: 'Portada en la tarjeta del catálogo',
    description: 'Imagen de la tarjeta del catálogo en la página Libros.',
    imageSrc: '/images/books/las-aventuras-de-curileta/portada.webp',
    aspectRatio: '0.8 / 1',
    defaults: { positionX: 50, positionY: 100, zoom: 1.08 },
  },
  'book-detail-cover': {
    title: 'Portada en los detalles del libro',
    description: 'Cubierta frontal junto a la sinopsis. El marco permite ocultar el título repetido y priorizar la ilustración.',
    imageSrc: '/images/books/las-aventuras-de-curileta/portada.webp',
    aspectRatio: '0.8 / 1',
    defaults: { positionX: 50, positionY: 100, zoom: 1.14 },
  },
} as const satisfies Record<string, {
  title: string;
  description: string;
  imageSrc: string;
  aspectRatio: string;
  desktopAspectRatio?: string;
  defaults: ImageFrameSettings;
}>;

export type ImageFrameKey = keyof typeof IMAGE_FRAME_TARGETS;
export type ImageFrameMap = Partial<Record<ImageFrameKey, ImageFrameSettings>>;

export function getImageFrame(frames: ImageFrameMap | undefined, key: ImageFrameKey): ImageFrameSettings {
  return frames?.[key] || IMAGE_FRAME_TARGETS[key].defaults;
}
