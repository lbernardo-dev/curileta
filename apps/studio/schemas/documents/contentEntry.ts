import { defineField, defineType } from 'sanity';

const forTypes = (...types: string[]) => ({
  hidden: ({ document }: { document?: Record<string, unknown> }) => !types.includes(String(document?.contentType || '')),
});

const localized = (name: string, title: string, types: string[], type: 'localizedString' | 'localizedText' = 'localizedString') =>
  defineField({ name, title, type, ...forTypes(...types) });

const stringField = (name: string, title: string, types: string[]) =>
  defineField({ name, title, type: 'string', ...forTypes(...types) });

const numberField = (name: string, title: string, types: string[]) =>
  defineField({ name, title, type: 'number', ...forTypes(...types) });

const stringArray = (name: string, title: string, types: string[]) =>
  defineField({ name, title, type: 'array', of: [{ type: 'string' }], ...forTypes(...types) });

const localizedArray = (name: string, title: string, types: string[]) =>
  defineField({ name, title, type: 'array', of: [{ type: 'localizedString' }], ...forTypes(...types) });

const contentTypes = [
  { title: 'Personaje', value: 'character' },
  { title: 'Libro', value: 'book' },
  { title: 'Aventura', value: 'adventure' },
  { title: 'Vídeo', value: 'video' },
  { title: 'Canción', value: 'song' },
  { title: 'Lugar', value: 'location' },
  { title: 'Punto de ruta', value: 'trailWaypoint' },
  { title: 'Hito narrativo', value: 'narrativeMilestone' },
  { title: 'Curiosidad mencionada', value: 'mentionedCuriosity' },
  { title: 'Fondo de pantalla', value: 'wallpaper' },
  { title: 'Evento estacional', value: 'seasonalEvent' },
  { title: 'Carta', value: 'letter' },
  { title: 'Próximo contenido', value: 'universeRoadmapItem' },
  { title: 'Oportunidad de colaboración', value: 'collaboration' },
];

const types = contentTypes.map((item) => item.value);
const characterTypes = ['character'];
const bookTypes = ['book'];
const adventureTypes = ['adventure'];
const videoTypes = ['video'];
const songTypes = ['song'];
const locationTypes = ['location'];
const waypointTypes = ['trailWaypoint'];
const milestoneTypes = ['narrativeMilestone'];
const curiosityTypes = ['mentionedCuriosity'];
const wallpaperTypes = ['wallpaper'];
const eventTypes = ['seasonalEvent'];
const letterTypes = ['letter'];
const roadmapTypes = ['universeRoadmapItem'];
const collaborationTypes = ['collaboration'];

export const contentEntry = defineType({
  name: 'contentEntry',
  title: 'Contenido del sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'contentType',
      title: 'Tipo de contenido',
      type: 'string',
      options: { list: contentTypes },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'id', title: 'Identificador interno', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Ruta corta', type: 'string', ...forTypes('character', 'book', 'adventure', 'video', 'song', 'location', 'wallpaper', 'seasonalEvent') }),

    stringField('characterName', 'Nombre', characterTypes),
    localized('name', 'Nombre', [...locationTypes, ...curiosityTypes, ...eventTypes]),
    localized('title', 'Título', [...bookTypes, ...adventureTypes, ...videoTypes, ...songTypes, ...waypointTypes, ...roadmapTypes, ...collaborationTypes, ...wallpaperTypes, ...letterTypes], 'localizedText'),
    localized('subtitle', 'Subtítulo', bookTypes),
    localized('shortDescription', 'Descripción breve', characterTypes, 'localizedText'),
    localized('biography', 'Biografía', characterTypes, 'localizedText'),
    localized('passportRole', 'Papel en la aventura', characterTypes),
    localized('voiceQuote', 'Frase del personaje', characterTypes, 'localizedText'),
    localized('quote', 'Frase destacada', characterTypes, 'localizedText'),
    localized('description', 'Descripción', [...bookTypes, ...songTypes, ...locationTypes, ...wallpaperTypes, ...collaborationTypes, ...eventTypes], 'localizedText'),
    localized('synopsis', 'Sinopsis', adventureTypes, 'localizedText'),
    localized('country', 'País', [...locationTypes, ...curiosityTypes, ...letterTypes, ...wallpaperTypes]),
    localized('city', 'Ciudad', letterTypes),
    localized('theme', 'Tema', locationTypes),
    localized('climate', 'Clima', locationTypes),
    localized('place', 'Lugar', milestoneTypes),
    localized('whatHappens', 'Qué sucede', milestoneTypes, 'localizedText'),
    localized('curiosityFact', 'Curiosidad', curiosityTypes, 'localizedText'),
    localized('tagline', 'Frase del evento', eventTypes, 'localizedText'),
    localized('greeting', 'Saludo', letterTypes),
    localized('signOff', 'Despedida', letterTypes),
    localized('desc', 'Descripción breve', [...roadmapTypes, ...collaborationTypes], 'localizedText'),
    localized('badge', 'Etiqueta', [...bookTypes, ...roadmapTypes]),

    stringField('species', 'Especie', characterTypes),
    stringField('author', 'Autoría', bookTypes),
    stringField('ageRange', 'Edad recomendada', bookTypes),
    stringField('publisher', 'Editorial', bookTypes),
    stringField('colorTheme', 'Color de presentación', bookTypes),
    localized('format', 'Formato', bookTypes),
    stringField('publicationDate', 'Fecha de publicación', bookTypes),
    stringField('publishedAt', 'Fecha de estreno', videoTypes),
    stringField('youtubeId', 'Identificador de YouTube', [...videoTypes, ...songTypes, ...eventTypes]),
    stringField('thumbnail', 'Imagen de portada', [...videoTypes, ...wallpaperTypes]),
    stringField('coverImage', 'Portada', songTypes),
    stringField('fullImageUrl', 'Imagen completa', wallpaperTypes),
    stringField('heroImageUrl', 'Imagen principal', [...adventureTypes, ...locationTypes]),
    stringField('audioUrl', 'Dirección de audio', songTypes),
    stringField('duration', 'Duración', [...videoTypes, ...songTypes]),
    stringField('type', 'Tipo de vídeo', videoTypes),
    localized('highlightTag', 'Etiqueta destacada', videoTypes),
    stringField('resolution', 'Resolución', wallpaperTypes),
    stringField('deviceType', 'Dispositivo', wallpaperTypes),
    stringField('category', 'Categoría', [...wallpaperTypes, ...collaborationTypes]),
    stringField('fileSizeBytes', 'Tamaño del archivo', wallpaperTypes),
    stringField('characterId', 'Identificador del personaje', wallpaperTypes),
    stringField('bookRef', 'Libro relacionado', adventureTypes),
    stringField('themeKey', 'Tema visual', eventTypes),
    stringField('startDate', 'Fecha de inicio', eventTypes),
    stringField('endDate', 'Fecha de fin', eventTypes),
    stringField('bannerImage', 'Imagen del anuncio', eventTypes),
    stringField('postmark', 'Matasellos', letterTypes),
    stringField('postageColor', 'Color del sello', letterTypes),
    stringField('envelopeColor', 'Color del sobre', letterTypes),
    stringField('iconName', 'Nombre del icono', [...roadmapTypes, ...collaborationTypes]),
    stringField('stampCode', 'Código del sello', waypointTypes),
    stringField('coordinatesText', 'Coordenadas en texto', waypointTypes),
    stringField('badgeIcon', 'Icono de la insignia', waypointTypes),
    stringField('dateStamp', 'Fecha de la etapa', waypointTypes),
    stringField('color', 'Color', [...waypointTypes, ...letterTypes]),
    localized('note', 'Nota de la etapa', waypointTypes, 'localizedText'),

    numberField('number', 'Número de aventura', adventureTypes),
    numberField('order', 'Orden', [...letterTypes, ...milestoneTypes]),
    numberField('orderIndex', 'Posición', [...waypointTypes, ...roadmapTypes, ...collaborationTypes]),
    numberField('stepNumber', 'Número de etapa', waypointTypes),
    numberField('episodeNumber', 'Número de episodio', videoTypes),
    numberField('pageCount', 'Páginas', bookTypes),

    defineField({ name: 'personality', title: 'Personalidad', type: 'array', of: [{ type: 'string' }], ...forTypes(...characterTypes) }),
    defineField({ name: 'values', title: 'Valores', type: 'array', of: [{ type: 'string' }], ...forTypes(...characterTypes) }),
    defineField({ name: 'languages', title: 'Idiomas', type: 'array', of: [{ type: 'string' }], ...forTypes(...bookTypes) }),
    defineField({ name: 'isbn', title: 'ISBN', type: 'array', of: [{ type: 'string' }], ...forTypes(...bookTypes) }),
    stringArray('countries', 'Países', adventureTypes),
    stringArray('locations', 'Lugares', [...adventureTypes, ...bookTypes]),
    stringArray('destinations', 'Destinos', bookTypes),
    stringArray('characters', 'Personajes relacionados', [...adventureTypes, ...bookTypes, ...locationTypes]),
    stringArray('relatedBooks', 'Libros relacionados', characterTypes),
    stringArray('relatedEpisodes', 'Episodios relacionados', characterTypes),
    stringArray('relatedLocations', 'Destinos relacionados', characterTypes),
    stringArray('tags', 'Etiquetas', wallpaperTypes),
    stringArray('featuredWallpapers', 'Fondos destacados', eventTypes),
    localized('lyrics', 'Letra', songTypes, 'localizedText'),
    localizedArray('backpackItems', 'Objetos de la mochila', characterTypes),
    localizedArray('curiosityFacts', 'Curiosidades', characterTypes),
    localizedArray('curiosities', 'Curiosidades', locationTypes),
    stringArray('charactersPresent', 'Personajes presentes', milestoneTypes),

    defineField({ name: 'mainImage', title: 'Imagen del personaje', type: 'object', fields: [
      { name: 'url', title: 'Ruta de imagen', type: 'string' },
      { name: 'alt', title: 'Texto alternativo', type: 'localizedString' },
      { name: 'aspectRatio', title: 'Proporción', type: 'number' },
    ], ...forTypes(...characterTypes) }),
    defineField({ name: 'cover', title: 'Imagen de portada', type: 'object', fields: [
      { name: 'url', title: 'Ruta de imagen', type: 'string' },
      { name: 'alt', title: 'Texto alternativo', type: 'localizedString' },
    ], ...forTypes(...bookTypes) }),
    defineField({ name: 'heroImage', title: 'Imagen panorámica', type: 'object', fields: [
      { name: 'url', title: 'Ruta de imagen', type: 'string' },
      { name: 'alt', title: 'Texto alternativo', type: 'localizedString' },
    ], ...forTypes(...adventureTypes, ...locationTypes) }),
    defineField({ name: 'gallery', title: 'Galería', type: 'array', of: [{ type: 'object', fields: [
      { name: 'url', title: 'Ruta de imagen', type: 'string' },
      { name: 'alt', title: 'Texto alternativo', type: 'localizedString' },
    ] }], ...forTypes(...characterTypes) }),
    defineField({ name: 'explorerStats', title: 'Estadísticas de exploración', type: 'object', fields: [
      { name: 'curiosity', title: 'Curiosidad', type: 'number' },
      { name: 'courage', title: 'Valentía', type: 'number' },
      { name: 'agility', title: 'Agilidad', type: 'number' },
      { name: 'wisdom', title: 'Sabiduría', type: 'number' },
    ], ...forTypes(...characterTypes) }),
    defineField({ name: 'coordinates', title: 'Coordenadas', type: 'object', fields: [
      { name: 'lat', title: 'Latitud', type: 'number' },
      { name: 'lng', title: 'Longitud', type: 'number' },
    ], ...forTypes(...locationTypes, ...milestoneTypes) }),
    defineField({ name: 'passportStamp', title: 'Sello del pasaporte', type: 'object', fields: [
      { name: 'icon', title: 'Icono', type: 'string' },
      { name: 'code', title: 'Código', type: 'string' },
      { name: 'color', title: 'Color', type: 'string' },
    ], ...forTypes(...locationTypes) }),
    defineField({ name: 'ambientDecorations', title: 'Decoración del evento', type: 'object', fields: [
      { name: 'glowColor', title: 'Color de luz', type: 'string' },
      { name: 'accentColor', title: 'Color de acento', type: 'string' },
      { name: 'floatingEmojis', title: 'Elementos flotantes', type: 'array', of: [{ type: 'string' }] },
    ], ...forTypes(...eventTypes) }),
    defineField({ name: 'specialChapter', title: 'Capítulo especial', type: 'object', fields: [
      { name: 'id', title: 'Identificador', type: 'string' },
      { name: 'title', title: 'Título', type: 'localizedString' },
      { name: 'synopsis', title: 'Sinopsis', type: 'localizedText' },
      { name: 'releaseDate', title: 'Fecha de estreno', type: 'date' },
      { name: 'status', title: 'Estado', type: 'string', options: { list: ['coming_soon', 'published'] } },
      { name: 'badgeText', title: 'Etiqueta', type: 'localizedString' },
      { name: 'thumbnail', title: 'Imagen', type: 'string' },
      { name: 'youtubeId', title: 'Identificador de YouTube', type: 'string' },
    ], ...forTypes(...eventTypes) }),
    defineField({ name: 'activities', title: 'Actividades', type: 'array', of: [{ type: 'object', fields: [
      { name: 'title', title: 'Título', type: 'localizedString' },
      { name: 'description', title: 'Descripción', type: 'localizedText' },
      { name: 'icon', title: 'Icono', type: 'string' },
      { name: 'status', title: 'Estado', type: 'string', options: { list: ['coming_soon', 'published'] } },
    ] }], ...forTypes(...eventTypes) }),
    defineField({ name: 'body', title: 'Texto de la carta', type: 'object', fields: [
      { name: 'es', title: 'Español', type: 'array', of: [{ type: 'text' }] },
      { name: 'en', title: 'Inglés', type: 'array', of: [{ type: 'text' }] },
    ], ...forTypes(...letterTypes) }),
    defineField({ name: 'photos', title: 'Fotos de la carta', type: 'array', of: [{ type: 'object', fields: [
      { name: 'title', title: 'Título', type: 'localizedString' },
      { name: 'fact', title: 'Dato', type: 'localizedText' },
      { name: 'tag', title: 'Etiqueta', type: 'string' },
      { name: 'imageUrl', title: 'Ruta de imagen', type: 'string' },
    ] }], ...forTypes(...letterTypes) }),
    defineField({ name: 'purchaseLinks', title: 'Enlaces de compra', type: 'array', of: [{ type: 'object', fields: [
      { name: 'storeName', title: 'Tienda', type: 'string' },
      { name: 'url', title: 'Dirección', type: 'url' },
    ] }], ...forTypes(...bookTypes) }),
    defineField({ name: 'milestones', title: 'Hitos de la ruta', type: 'array', of: [{ type: 'object', fields: [
      { name: 'order', title: 'Orden', type: 'number' },
      { name: 'place', title: 'Lugar', type: 'localizedString' },
      { name: 'country', title: 'País', type: 'localizedString' },
      { name: 'whatHappens', title: 'Qué sucede', type: 'localizedText' },
      { name: 'charactersPresent', title: 'Personajes presentes', type: 'array', of: [{ type: 'string' }] },
      { name: 'isTravesia', title: 'Es una travesía', type: 'boolean' },
      { name: 'coordinates', title: 'Coordenadas', type: 'object', fields: [
        { name: 'lat', title: 'Latitud', type: 'number' },
        { name: 'lng', title: 'Longitud', type: 'number' },
      ] },
    ] }], ...forTypes(...locationTypes) }),
    defineField({ name: 'mentionedPlaces', title: 'Lugares mencionados', type: 'array', of: [{ type: 'object', fields: [
      { name: 'id', title: 'Identificador', type: 'string' },
      { name: 'name', title: 'Nombre', type: 'localizedString' },
      { name: 'country', title: 'País', type: 'localizedString' },
      { name: 'curiosityFact', title: 'Curiosidad', type: 'localizedText' },
      { name: 'isMentionOnly', title: 'Solo se menciona', type: 'boolean' },
    ] }], ...forTypes(...locationTypes) }),
    defineField({ name: 'isTravesia', title: 'Es una travesía', type: 'boolean', ...forTypes(...milestoneTypes) }),
    defineField({ name: 'isMentionOnly', title: 'Solo se menciona', type: 'boolean', ...forTypes(...curiosityTypes) }),
    defineField({ name: 'active', title: 'Evento activo', type: 'boolean', ...forTypes(...eventTypes) }),
    defineField({ name: 'featured', title: 'Destacar en portada', type: 'boolean', ...forTypes(...collaborationTypes) }),
  ],
  preview: {
    select: {
      title: 'title.es',
      name: 'name.es',
      characterName: 'characterName',
      place: 'place.es',
      contentType: 'contentType',
      id: 'id',
      order: 'order',
    },
    prepare({ title, name, characterName, place, contentType, id, order }) {
      const displayTitle = title || name || characterName || place || id || 'Contenido sin título';
      const details = [contentType, order == null ? null : `Orden ${order}`].filter(Boolean);
      return { title: displayTitle, subtitle: details.join(' · ') };
    },
  },
});
