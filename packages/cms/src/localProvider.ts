import { CMSProvider } from './CMSProvider';
import { Character, Book, Adventure, Video, Song, Location, TrailWaypoint } from './models';

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'curileta',
    name: 'Curileta',
    slug: 'curileta',
    passportRole: {
      es: 'Gran Cartógrafa & Líder de Expedición',
      en: 'Master Cartographer & Expedition Leader',
    },
    shortDescription: {
      es: 'Valiente, bondadosa y eternamente curiosa. Lleva siempre su mapa y su brújula mágica.',
      en: 'Brave, kind-hearted, and perpetually curious. Always carries her magical map and compass.',
    },
    biography: {
      es: 'Curileta nació en el corazón del Bosque Encantado. Su mayor anhelo es conocer todas las culturas, idiomas y maravillas naturales del planeta junto a sus inseparables amigos.',
      en: 'Curileta was born in the heart of the Enchanted Forest. Her greatest wish is to explore all cultures, languages, and natural wonders of the planet alongside her friends.',
    },
    species: 'Aventurera Principal',
    personality: ['Curiosa', 'Empática', 'Aventurera', 'Leal'],
    values: ['Respeto por la naturaleza', 'Amistad', 'Diversidad cultural'],
    explorerStats: {
      curiosity: 99,
      courage: 92,
      agility: 88,
      wisdom: 85,
    },
    backpackItems: [
      { es: 'Brújula solar de latón dorado', en: 'Golden solar brass compass' },
      { es: 'Cuaderno de bitácora con mapas secretos', en: 'Logbook with secret expedition maps' },
      { es: 'Lupa de cristal de cuarzo esmeralda', en: 'Emerald quartz magnifying glass' },
    ],
    curiosityFacts: [
      { es: 'Sabe orientarse de noche siguiendo la Constelación de la Liebre Dorada.', en: 'Navigates by night following the Golden Hare Constellation.' },
      { es: 'Colecciona semillas de árboles antiguos de cada país que visita.', en: 'Collects ancient tree seeds from every visited country.' },
    ],
    voiceQuote: {
      es: '«¡El mundo es demasiado grande y hermoso como para quedarse quietos!»',
      en: '“The world is too vast and wonderful to ever stand still!”',
    },
    mainImage: {
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Retrato oficial de Curileta exploradora', en: 'Official portrait of explorer Curileta' },
    },
    relatedBooks: ['el-misterio-del-quetzal', 'las-auroras-de-hielo'],
    relatedLocations: ['mexico', 'islandia', 'peru'],
  },
  {
    id: 'pompon',
    name: 'Pompón',
    slug: 'pompon',
    passportRole: {
      es: 'Guardián de Provisiones & Logística',
      en: 'Quartermaster & Provisions Guardian',
    },
    shortDescription: {
      es: 'El fiel compañero prudente. Cuida las provisiones y tiene un corazón gigantesco.',
      en: 'The prudent and loyal companion. Watches over the supplies and has a gigantic heart.',
    },
    biography: {
      es: 'Pompón es un conejo de pelaje blanco que ama la tranquilidad del Bosque Encantado, pero su lealtad incondicional hacia Curileta lo lleva a superar cualquier temor en cada expedición.',
      en: 'Pompón is a white-furred rabbit who loves the calm of the Enchanted Forest, but his loyalty to Curileta leads him to conquer all fears on each expedition.',
    },
    species: 'Conejo del Bosque Encantado',
    personality: ['Prudente', 'Tierno', 'Organizado', 'Divertido'],
    values: ['Cuidado mutuo', 'Previsión', 'Valentía interior'],
    explorerStats: {
      curiosity: 82,
      courage: 76,
      agility: 94,
      wisdom: 90,
    },
    backpackItems: [
      { es: 'Kit de primeros auxilios y vendajes suaves', en: 'First-aid kit and herbal balms' },
      { es: 'Frasco de zanahorias confitadas energéticas', en: 'Jar of energizing candied carrots' },
      { es: 'Cantimplora de agua de manantial', en: 'Pure mountain spring water canteen' },
    ],
    curiosityFacts: [
      { es: 'Sus orejas pueden detectar cambios en la dirección del viento 30 minutos antes.', en: 'His ears detect wind shifts 30 minutes in advance.' },
      { es: 'Tiene un registro contable de cada manzana y provisión de la expedición.', en: 'Keeps an exact inventory of every apple and ration.' },
    ],
    voiceQuote: {
      es: '«¡Revisemos la mochila dos veces antes de cruzar ese puente colgante!»',
      en: '“Let’s check the backpack twice before crossing that rope bridge!”',
    },
    mainImage: {
      url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Pompón con su pequeña mochila de explorador', en: 'Pompón with his explorer backpack' },
    },
    relatedBooks: ['el-misterio-del-quetzal'],
    relatedLocations: ['mexico'],
  },
  {
    id: 'quetzal',
    name: 'Quetzal',
    slug: 'quetzal',
    passportRole: {
      es: 'Vigía Aéreo & Descifrador de Leyendas',
      en: 'Aerial Scout & Legend Decipherer',
    },
    shortDescription: {
      es: 'El sabio vigía de los vientos tropicales. Conoce los secretos de las selvas y templos.',
      en: 'The wise lookout of tropical winds. Knows the secrets of rainforests and ancient temples.',
    },
    biography: {
      es: 'Guardián milenario de plumaje iridiscente que habita en las copas de los árboles de Mesoamérica. Ayuda a Curileta y sus amigos a descifrar leyendas y respetar la fauna local.',
      en: 'An ancient guardian with iridescent feathers dwelling in Mesoamerican tree canopies. Helps Curileta and her friends decipher legends and honor local wildlife.',
    },
    species: 'Ave Sagrada de Mesoamérica',
    personality: ['Sabio', 'Ágil', 'Protector', 'Poético'],
    values: ['Preservación de la selva', 'Historia ancestral', 'Libertad'],
    explorerStats: {
      curiosity: 95,
      courage: 90,
      agility: 99,
      wisdom: 98,
    },
    backpackItems: [
      { es: 'Amuleto de jade para invocar corrientes térmicas', en: 'Jade thermal talisman' },
      { es: 'Prisma de luz para emitir señales en vuelo', en: 'Light prism for flight signaling' },
    ],
    curiosityFacts: [
      { es: 'Puede volar en silencio absoluto entre el dosel selvático.', en: 'Can glide in total silence across rainforest canopies.' },
      { es: 'Entiende más de 12 dialectos antiguos de los pájaros de América.', en: 'Understands over 12 ancient bird dialects.' },
    ],
    voiceQuote: {
      es: '«Mira la tierra desde lo alto: no hay fronteras, solo valles que abrazan ríos.»',
      en: '“Gaze upon the earth from above: no borders exist, only valleys embracing rivers.”',
    },
    mainImage: {
      url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Quetzal en pleno vuelo sobre la selva', en: 'Quetzal in full flight over the canopy' },
    },
    relatedBooks: ['el-misterio-del-quetzal'],
    relatedLocations: ['mexico'],
  },
  {
    id: 'lulu',
    name: 'Lulú',
    slug: 'lulu',
    passportRole: {
      es: 'Navegante de Mares & Aguas Glaciares',
      en: 'Sea Navigator & Glacial Waters Guide',
    },
    shortDescription: {
      es: 'La experta en corrientes marinas, risas y saltos de ola. Siempre dispuesta a jugar.',
      en: 'The expert in ocean currents, laughter, and wave riding. Always ready to play.',
    },
    biography: {
      es: 'Lulú es una nutria marina apasionada por las aguas cristalinas. Conoce los secretos de los arrecifes y enseña a los exploradores a nadar sin miedo a lo desconocido.',
      en: 'Lulú is a sea otter passionate about crystal-clear waters. She knows reef secrets and teaches explorers to swim without fear of the unknown.',
    },
    species: 'Nutria Marina de las Costas',
    personality: ['Jovial', 'Atlética', 'Solidaria', 'Curiosa'],
    values: ['Protección de los océanos', 'Alegría de vivir', 'Generosidad'],
    explorerStats: {
      curiosity: 91,
      courage: 88,
      agility: 96,
      wisdom: 80,
    },
    backpackItems: [
      { es: 'Piedra pulida favorita para abrir caracoles', en: 'Favorite smooth pebble for shells' },
      { es: 'Cuerda de algas marinas ultra resistente', en: 'Ultra-durable kelp fiber rope' },
    ],
    curiosityFacts: [
      { es: 'Aguanta la respiración bajo el agua helada más de 6 minutos.', en: 'Holds breath in freezing waters for over 6 minutes.' },
      { es: 'Duerme flotando sobre su espalda agarrada de la mano de sus amigos.', en: 'Sleeps floating on her back holding hands with friends.' },
    ],
    voiceQuote: {
      es: '«¡Zambúllete hondo! Quien no se moja nunca descubre los tesoros del fondo.»',
      en: '“Dive deep! Whoever stays dry never discovers the seabed treasures.”',
    },
    mainImage: {
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Lulú flotando feliz en el agua', en: 'Lulú floating joyfully in the water' },
    },
    relatedBooks: ['las-auroras-de-hielo'],
    relatedLocations: ['islandia'],
  },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'el-misterio-del-quetzal',
    title: {
      es: 'El Misterio del Quetzal Dorado',
      en: 'The Mystery of the Golden Quetzal',
    },
    slug: 'el-misterio-del-quetzal',
    subtitle: {
      es: 'Volumen 1 — México y las Selvas Mágicas',
      en: 'Volume 1 — Mexico and the Magic Rainforests',
    },
    coverImage: {
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Portada de El Misterio del Quetzal Dorado', en: 'Cover of The Mystery of the Golden Quetzal' },
    },
    description: {
      es: 'Curileta y Pompón aterrizan en las tierras del sol para descifrar un antiguo mapa de plumas y templos perdidos. Una historia sobre el coraje, la riqueza de las culturas mesoamericanas y el valor de no rendirse.',
      en: 'Curileta and Pompón land in the lands of the sun to decipher an ancient map of feathers and lost temples. A story about courage, Mesoamerican culture, and the spirit of perseverance.',
    },
    publicationDate: '2026-04-15',
    isbn: ['978-84-123456-0-1'],
    languages: ['Español', 'English'],
    ageRange: '5–10 años',
    pageCount: 48,
    publisher: 'Curileta Publishing',
    purchaseLinks: [
      { storeName: 'Casa del Libro', url: 'https://www.casadellibro.com' },
      { storeName: 'Amazon Libros', url: 'https://www.amazon.es' },
      { storeName: 'Librerías Independientes (TodosTusLibros)', url: 'https://www.todostuslibros.com' },
    ],
    characters: ['curileta', 'pompon', 'quetzal'],
    locations: ['mexico'],
  },
  {
    id: 'las-auroras-de-hielo',
    title: {
      es: 'Las Auroras del Confín Helado',
      en: 'The Auroras of the Frozen Realm',
    },
    slug: 'las-auroras-de-hielo',
    subtitle: {
      es: 'Volumen 2 — Islandia y los Géiseres',
      en: 'Volume 2 — Iceland and the Geysers',
    },
    coverImage: {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Portada de Las Auroras del Confín Helado', en: 'Cover of The Auroras of the Frozen Realm' },
    },
    description: {
      es: 'Bajo el manto de la noche polar, Curileta y Lulú siguen el brillo de las auroras para devolver una piedra mágica al corazón de un géiser ancestral.',
      en: 'Beneath the polar night sky, Curileta and Lulú follow the aurora glow to return a magical stone to the heart of an ancient geyser.',
    },
    publicationDate: '2026-11-20',
    isbn: ['978-84-123456-1-8'],
    languages: ['Español', 'English'],
    ageRange: '6–12 años',
    pageCount: 56,
    publisher: 'Curileta Publishing',
    purchaseLinks: [
      { storeName: 'Preventa Oficial', url: 'https://curileta.com' },
    ],
    characters: ['curileta', 'lulu'],
    locations: ['islandia'],
  },
];

export const INITIAL_LOCATIONS: Location[] = [
  {
    id: 'mexico',
    name: { es: 'Teotihuacán y Selvas', en: 'Teotihuacan & Jungles' },
    slug: 'mexico',
    country: { es: 'México', en: 'Mexico' },
    theme: { es: 'Misterio de las pirámides y el vuelo del Quetzal', en: 'Pyramids mystery and the Quetzal flight' },
    climate: { es: 'Cálido y templado tropical', en: 'Warm and tropical temperate' },
    coordinates: { lat: 19.69, lng: -98.84 },
    passportStamp: { icon: 'Sun', code: 'MEX-TEO-01', color: '#F59E0B' },
    description: {
      es: 'Donde los antiguos templos tocan el cielo y el canto de las aves guía el sendero de los exploradores.',
      en: 'Where ancient temples touch the sky and bird songs guide the explorers path.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Pirámides de Teotihuacán al amanecer', en: 'Pyramids of Teotihuacan at sunrise' },
    },
    curiosities: [
      { es: 'La Pirámide del Sol está alineada con el movimiento solar exacto.', en: 'The Pyramid of the Sun aligns precisely with solar motion.' },
      { es: 'El sonido de una palmada frente a la pirámide imita el eco del Quetzal.', en: 'A clap in front of the pyramid mimics a Quetzal call.' },
    ],
    characters: ['curileta', 'pompon', 'quetzal'],
  },
  {
    id: 'peru',
    name: { es: 'Machu Picchu y Valle Sagrado', en: 'Machu Picchu & Sacred Valley' },
    slug: 'peru',
    country: { es: 'Perú', en: 'Peru' },
    theme: { es: 'Montañas sagradas y senderos entre nubes', en: 'Sacred peaks and cloud trails' },
    climate: { es: 'Montañoso y fresco andino', en: 'Andean mountainous and fresh' },
    coordinates: { lat: -13.16, lng: -72.54 },
    passportStamp: { icon: 'Mountain', code: 'PER-MAC-02', color: '#10B981' },
    description: {
      es: 'Ciudadelas de piedra milenaria en las cumbres de los Andes custodiadas por cóndores y vientos sagrados.',
      en: 'Ancient stone citadels atop Andean peaks guarded by condors and sacred breezes.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Santuario de Machu Picchu rodeado de niebla', en: 'Machu Picchu sanctuary surrounded by mist' },
    },
    curiosities: [
      { es: 'Las piedras encajan con tanta precisión que no cabe ni una hoja de papel.', en: 'Stones fit together so tightly not even paper fits through.' },
      { es: 'Los incas domesticaron más de 3.000 variedades de patatas aquí.', en: 'The Incas cultivated over 3,000 potato varieties here.' },
    ],
    characters: ['curileta', 'pompon'],
  },
  {
    id: 'egipto',
    name: { es: 'El Nilo y Pirámides de Guiza', en: 'The Nile & Giza Pyramids' },
    slug: 'egipto',
    country: { es: 'Egipto', en: 'Egypt' },
    theme: { es: 'Arenas doradas y acertijos del pasado', en: 'Golden sands and riddles of the past' },
    climate: { es: 'Desértico y soleado', en: 'Desert and bright sunshine' },
    coordinates: { lat: 29.97, lng: 31.13 },
    passportStamp: { icon: 'Compass', code: 'EGY-CAI-03', color: '#EAB308' },
    description: {
      es: 'El río más legendario del planeta bajo la mirada de la Esfinge y jeroglíficos que guardan estrellas.',
      en: 'The most legendary river on Earth beneath the gaze of the Sphinx and star-filled hieroglyphs.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Pirámides doradas de Guiza bajo el atardecer', en: 'Golden Pyramids of Giza at sunset' },
    },
    curiosities: [
      { es: 'El Nilo fluye de sur a norte a lo largo de más de 6.600 kilómetros.', en: 'The Nile flows South to North across more than 6,600 km.' },
      { es: 'Los jeroglíficos podían leerse de izquierda a derecha o viceversa según las figuras.', en: 'Hieroglyphs could be read left to right or vice versa.' },
    ],
    characters: ['curileta'],
  },
  {
    id: 'islandia',
    name: { es: 'Auroras Boreales y Géiseres', en: 'Northern Lights & Geysers' },
    slug: 'islandia',
    country: { es: 'Islandia', en: 'Iceland' },
    theme: { es: 'Fuego y hielo en el confín ártico', en: 'Fire and ice on the Arctic edge' },
    climate: { es: 'Subártico marítimo', en: 'Maritime subarctic' },
    coordinates: { lat: 64.96, lng: -19.02 },
    passportStamp: { icon: 'Sparkles', code: 'ISL-REK-04', color: '#38BDF8' },
    description: {
      es: 'Cascadas cristalinas, géiseres danzantes y el cielo nocturno encendido de luces verdes y violetas.',
      en: 'Crystal waterfalls, dancing geysers, and night skies ablaze with green and violet light.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Aurora boreal sobre cascada islandesa', en: 'Aurora borealis over Icelandic waterfall' },
    },
    curiosities: [
      { es: 'Islandia obtiene casi el 100% de su energía de la fuerza de la tierra (geotermia).', en: 'Iceland gets nearly 100% of its energy from geothermal power.' },
      { es: 'No hay mosquitos en toda la isla debido al ecosistema glacial.', en: 'There are no mosquitoes on the entire island due to the glacial climate.' },
    ],
    characters: ['curileta', 'lulu'],
  },
  {
    id: 'japon',
    name: { es: 'Monte Fuji y Bosques de Kioto', en: 'Mount Fuji & Kyoto Forests' },
    slug: 'japon',
    country: { es: 'Japón', en: 'Japan' },
    theme: { es: 'Jardines zen, cerezos en flor y linternas rojas', en: 'Zen gardens, cherry blossoms and red lanterns' },
    climate: { es: 'Templado estacional', en: 'Seasonal temperate' },
    coordinates: { lat: 35.36, lng: 138.72 },
    passportStamp: { icon: 'Award', code: 'JPN-FUJ-05', color: '#F43F5E' },
    description: {
      es: 'El delicado equilibrio entre la sabiduría de los bosques milenarios y el respeto por cada estación.',
      en: 'The delicate harmony between ancient forest wisdom and reverence for each season.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Monte Fuji coronado de nieve con cerezos', en: 'Snowcapped Mount Fuji with cherry blossoms' },
    },
    curiosities: [
      { es: 'El Monte Fuji es en realidad tres volcanes superpuestos uno sobre otro.', en: 'Mount Fuji is actually three volcanoes stacked atop one another.' },
      { es: 'Los trenes bala Shinkansen son tan puntuales que su retraso medio anual es menor a un minuto.', en: 'Shinkansen bullet trains average under one minute delay annually.' },
    ],
    characters: ['curileta', 'pompon', 'quetzal'],
  },
];

export const INITIAL_TRAIL_WAYPOINTS: TrailWaypoint[] = [
  {
    id: 'bosque-encantado',
    stepNumber: 1,
    title: { es: 'Campamento Base', en: 'Base Camp' },
    subtitle: { es: 'El Bosque Encantado', en: 'The Enchanted Forest' },
    stampCode: 'CAMP-BASE-001',
    coordinatesText: "19°25'N, 99°08'W",
    badgeIcon: 'Compass',
    dateStamp: '01 OCT — INICIO',
    note: {
      es: 'Curileta despliega el pergamino y enciende la brújula solar.',
      en: 'Curileta unrolls the parchment and sparks the solar compass.',
    },
    color: '#10B981',
  },
  {
    id: 'globo-cartografia',
    stepNumber: 2,
    title: { es: 'Globo Aerostático', en: 'Hot Air Balloon' },
    subtitle: { es: 'Cartografía Orbital 3D', en: '3D Orbital Cartography' },
    stampCode: 'AERO-CART-002',
    coordinatesText: 'Alt. 3.200m | Sonda Viento',
    badgeIcon: 'Navigation',
    dateStamp: '03 OCT — VUELO',
    note: {
      es: 'El globo asciende sobre las nubes para trazar las rutas del planeta en 3D.',
      en: 'The balloon ascends above clouds to chart Earth’s 3D routes.',
    },
    color: '#F59E0B',
  },
  {
    id: 'tripulacion-amigos',
    stepNumber: 3,
    title: { es: 'Campamento de Amigos', en: 'Friends Camp' },
    subtitle: { es: 'Encuentro con Pompón, Quetzal y Lulú', en: 'Meeting with Pompón, Quetzal & Lulú' },
    stampCode: 'CREW-AMIG-003',
    coordinatesText: 'Valle de la Buena Amistad',
    badgeIcon: 'Sparkles',
    dateStamp: '07 OCT — ALIANZA',
    note: {
      es: 'Cada compañero aporta un don indispensable: prudencia, vuelo y destreza marina.',
      en: 'Each companion brings an essential gift: prudence, flight, and marine skill.',
    },
    color: '#38BDF8',
  },
  {
    id: 'biblioteca-relatos',
    stepNumber: 4,
    title: { es: 'Biblioteca de Aventuras', en: 'Adventure Library' },
    subtitle: { es: 'Libros Ilustrados & Manuscritos', en: 'Illustrated Books & Manuscripts' },
    stampCode: 'BIBL-DEST-004',
    coordinatesText: 'Bóveda de Relatos Secretos',
    badgeIcon: 'BookOpen',
    dateStamp: '12 OCT — ARCHIVO',
    note: {
      es: 'Las historias cobran vida en papel de alta calidad con mapas desplegables.',
      en: 'Stories come alive on premium paper with fold-out maps.',
    },
    color: '#EC4899',
  },
  {
    id: 'senales-musica',
    stepNumber: 5,
    title: { es: 'Estación de Señales', en: 'Signal Station' },
    subtitle: { es: 'Frecuencia YouTube & Música', en: 'YouTube Frequency & Music' },
    stampCode: 'WAVE-CURI-005',
    coordinatesText: 'Onda Corta 104.7 MHz',
    badgeIcon: 'Radio',
    dateStamp: '18 OCT — AL AIRE',
    note: {
      es: 'Canciones y capítulos animados transmitidos para toda la comunidad exploradora.',
      en: 'Animated episodes and songs broadcasted for young explorers everywhere.',
    },
    color: '#EF4444',
  },
  {
    id: 'pasaporte-dorado',
    stepNumber: 6,
    title: { es: 'Sello de Oro', en: 'Golden Stamp' },
    subtitle: { es: 'Pasaporte de Explorador Oficial', en: 'Official Explorer Passport' },
    stampCode: 'EXP-GOLD-999',
    coordinatesText: 'Destino: Horizonte Abierto',
    badgeIcon: 'Award',
    dateStamp: 'EXPEDICIÓN ACTIVA',
    note: {
      es: 'El viaje nunca termina: cada nuevo libro y país añade un sello a tu colección.',
      en: 'The journey never ends: each new book and country adds a stamp to your collection.',
    },
    color: '#FBBF24',
  },
];

export class LocalCMSProvider implements CMSProvider {
  async getCharacters(locale?: string): Promise<Character[]> {
    return INITIAL_CHARACTERS;
  }

  async getCharacterBySlug(slug: string, locale?: string): Promise<Character | null> {
    return INITIAL_CHARACTERS.find((c) => c.slug === slug) || null;
  }

  async getBooks(locale?: string): Promise<Book[]> {
    return INITIAL_BOOKS;
  }

  async getBookBySlug(slug: string, locale?: string): Promise<Book | null> {
    return INITIAL_BOOKS.find((b) => b.slug === slug) || null;
  }

  async getAdventures(locale?: string): Promise<Adventure[]> {
    return [];
  }

  async getVideos(locale?: string): Promise<Video[]> {
    return [];
  }

  async getSongs(locale?: string): Promise<Song[]> {
    return [];
  }

  async getLocations(locale?: string): Promise<Location[]> {
    return INITIAL_LOCATIONS;
  }

  async getTrailWaypoints(locale?: string): Promise<TrailWaypoint[]> {
    return INITIAL_TRAIL_WAYPOINTS;
  }
}

export const cmsProvider = new LocalCMSProvider();
