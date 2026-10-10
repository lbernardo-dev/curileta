import type { CMSProvider } from './CMSProvider.ts';
import type {
  Character,
  Book,
  Adventure,
  Video,
  Song,
  Location,
  TrailWaypoint,
  NarrativeMilestone,
  MentionedCuriosity,
  Wallpaper,
  SeasonalEvent,
  LetterItem,
  UniverseRoadmapItem,
  CollaborationOpportunity,
  SiteSettings,
} from './models.ts';

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'curileta',
    name: 'Curileta',
    slug: 'curileta',
    passportRole: {
      es: 'La Lagartija Exploradora & Gran Cartógrafa',
      en: 'The Explorer Lizard & Master Cartographer',
    },
    shortDescription: {
      es: 'Pequeña, verde y de corazón inmenso. Viaja con su mochila, sombrero de exploradora y lentes para ver lo invisible.',
      en: 'Small, green, and big-hearted. Travels with her backpack, explorer hat, and lenses to discover the unseen.',
    },
    biography: {
      es: 'Curileta comprendió que el mundo no cabía en un solo árbol de su bosque. Con sus patitas pegajosas y su mapa en mano, recorrió los cinco continentes cruzando tormentas, escalando pirámides y descubriendo que el tesoro más grande siempre es la amistad.',
      en: 'Curileta realized the world could not fit into a single forest tree. With sticky paws and her map, she traveled across five continents.',
    },
    species: 'Lagartija Curiosa del Bosque Encantado',
    personality: ['Curiosa', 'Valiente', 'Leal', 'Observadora', 'Empática'],
    values: ['Curiosidad por el mundo', 'Amistad incondicional', 'Amor por el hogar'],
    explorerStats: {
      curiosity: 100,
      courage: 96,
      agility: 98,
      wisdom: 90,
    },
    backpackItems: [
      { es: 'Sombrero de exploradora con ala ancha', en: 'Wide-brim explorer hat' },
      { es: 'Lentes para ver cosas pequeñas a lo lejos', en: 'Lenses for distant small treasures' },
      { es: 'Cuaderno de bitácora y cartas para Pompón', en: 'Logbook and letters for Pompón' },
      { es: 'Bufanda tejida con lana de llama de Perú', en: 'Scarf knitted with Peruvian llama wool' },
      { es: 'Pluma dorada de recuerdo de Hobbiton', en: 'Golden feather souvenir from Hobbiton' },
    ],
    curiosityFacts: [
      { es: 'Sus patitas pegajosas le permitieron trepar al mástil del barco en plena tormenta y amarrar el timón suelto.', en: 'Her sticky paws helped her climb the ship mast during a tempest and secure the loose helm.' },
      { es: 'Probó el gelato de pistacho en Italia porque era del mismo color verde que su piel y servía de camuflaje.', en: 'Tasted pistachio gelato in Italy because it matched her green skin as camouflage.' },
    ],
    voiceQuote: {
      es: '«¡El verdadero viaje no consiste solo en imaginar lugares, sino en sentirlos bajo tus patitas!»',
      en: '“True adventure is not just imagining places, but feeling them beneath your paws!”',
    },
    mainImage: {
      url: '/images/characters/curileta-main.webp',
      alt: { es: 'Curileta con mochila y sombrero de exploradora', en: 'Curileta with backpack and explorer hat' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['espana-inicio', 'mexico', 'peru', 'egipto', 'islandia', 'japon', 'australia', 'nueva-zelanda', 'china', 'italia', 'francia', 'espana-regreso'],
  },
  {
    id: 'pompon',
    name: 'Pompón',
    slug: 'pompon',
    passportRole: {
      es: 'El Fiel Guardián del Hogar & Destinatario de Cartas',
      en: 'Faithful Forest Guardian & Keeper of Letters',
    },
    shortDescription: {
      es: 'Conejito blanco de corazón tierno. Permanece en el Bosque Encantado custodiando el hogar y esperando cada carta de Curileta bajo el árbol más alto. No viaja físicamente por el mundo.',
      en: 'White rabbit with a tender heart. Stays in the Enchanted Forest guarding the home and receiving Curileta’s letters under the tallest tree.',
    },
    biography: {
      es: 'Pompón es el mejor amigo de Curileta. Permanece en el Bosque Encantado custodiando las raíces del hogar mientras Curileta recorre el mundo. Aunque no viaja físicamente con ella, su amor y fidelidad lo mantienen conectado a Curileta a través de cada carta, cada sello y cada regalo que ella le envía.',
      en: 'Pompón is Curileta’s best friend who stays in the Enchanted Forest keeping their roots safe while receiving letters from every continent.',
    },
    species: 'Conejito Blanco del Bosque Encantado',
    personality: ['Tierno', 'Fiel', 'Hogareño', 'Alegre', 'Saltarín'],
    values: ['Amistad sincera', 'Paciencia', 'Cuidado de las raíces'],
    explorerStats: {
      curiosity: 80,
      courage: 75,
      agility: 95,
      wisdom: 88,
    },
    backpackItems: [
      { es: 'Buzón de madera tallada para las cartas de viaje', en: 'Carved wooden mailbox for travel letters' },
      { es: 'Álbum con sellos postales de todos los países', en: 'Postage stamp album from all continents' },
      { es: 'Pluma dorada enviada desde Nueva Zelanda', en: 'Golden feather sent from New Zealand' },
    ],
    curiosityFacts: [
      { es: 'Cuando se pone muy feliz salta tan alto que casi toca las ramas del árbol más alto.', en: 'When overjoyed, leaps so high he almost touches the highest branches.' },
      { es: 'Curileta descubrió que en Perú tiene parientes andinos llamados Cuyes (conejillos de indias).', en: 'Curileta discovered that in Peru he has Andean cousins called Cuyes.' },
    ],
    voiceQuote: {
      es: '«¡Siempre que llega una carta tuya, siento que el mundo entero cabe en nuestro árbol!»',
      en: '“Whenever a letter arrives, I feel the whole world fits right into our tree!”',
    },
    mainImage: {
      url: '/images/characters/pompon-main.webp',
      alt: { es: 'Pompón el conejito bajo el árbol', en: 'Pompón the bunny under the tree' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['espana-inicio', 'espana-regreso'],
  },
  {
    id: 'quetzal',
    name: 'Quetzal',
    slug: 'quetzal',
    passportRole: {
      es: 'Guardián de las Estrellas de Mesoamérica',
      en: 'Star Guardian of Mesoamerica',
    },
    shortDescription: {
      es: 'Ave sagrada de plumas verdes esmeralda. Enseña a Curileta el baile de los planetas en Teotihuacán.',
      en: 'Sacred bird with emerald feathers. Teaches Curileta the dance of the planets atop Teotihuacan.',
    },
    biography: {
      es: 'En la cima de la Pirámide del Sol, Quetzal revela a Curileta que las pirámides son un gigantesco calendario de piedra para comunicarse con el universo y que el eco en Kukulcán imita su propio canto.',
      en: 'Atop the Sun Pyramid, Quetzal reveals how ancient pyramids spoke with the stars.',
    },
    species: 'Ave Sagrada Quetzal',
    personality: ['Místico', 'Majestuoso', 'Sabio', 'Ágil'],
    values: ['Conexión cósmica', 'Respeto al pasado'],
    explorerStats: {
      curiosity: 95,
      courage: 92,
      agility: 100,
      wisdom: 98,
    },
    backpackItems: [
      { es: 'Pluma esmeralda iridiscente de la fortuna', en: 'Iridescent emerald feather of fortune' },
      { es: 'Semilla de cacao ancestral (el chocolate de los dioses)', en: 'Ancestral cacao bean' },
    ],
    curiosityFacts: [
      { es: 'El eco de las palmadas en la pirámide de Chichén Itzá reproduce exactamente su canto.', en: 'Claps at Chichen Itza pyramid reproduce his precise bird call.' },
    ],
    voiceQuote: {
      es: '«Las piedras no son solo rocas: son calendarios para hablar con las estrellas.»',
      en: '“Stones are not merely rocks: they are calendars to converse with the stars.”',
    },
    mainImage: {
      url: '/images/characters/quetzal-main.webp',
      alt: { es: 'Quetzal en vuelo majestuoso', en: 'Quetzal in flight' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['mexico'],
  },
  {
    id: 'lulu',
    name: 'Lulú la Llama',
    slug: 'lulu',
    passportRole: {
      es: 'Protectora Andina de las Cumbres',
      en: 'Andean Guardian of the Cloud Peaks',
    },
    shortDescription: {
      es: 'Una llama gigante y de lana tibia que cobija a Curileta del aire frío de Machu Picchu.',
      en: 'A warm-fleeced giant llama who shelters Curileta from the chill of Machu Picchu.',
    },
    biography: {
      es: 'Lulú recibe a Curileta en los senderos de piedra de la ciudad inca. Le presta su lana caliente para protegerla del frío y la lleva en su lomo para contemplar la arquitectura antisísmica de los Andes.',
      en: 'Lulú welcomes Curileta onto her back across the stone paths of the Inca citadel.',
    },
    species: 'Llama Lanuda de los Andes',
    personality: ['Generosa', 'Tranquila', 'Acogedora', 'Fuerte'],
    values: ['Hospitalidad', 'Calor de hogar'],
    explorerStats: {
      curiosity: 85,
      courage: 88,
      agility: 82,
      wisdom: 92,
    },
    backpackItems: [
      { es: 'Ovillo de lana virgen de vicuña y llama', en: 'Ball of pure warm llama wool' },
      { es: 'Muestrario de patatas multicolores andinas', en: 'Sample of multicolored Andean potatoes' },
    ],
    curiosityFacts: [
      { es: 'Su lana es tan térmica que protegió a Curileta durante todo su viaje por los glaciares de Islandia.', en: 'Her fleece was so warm it protected Curileta all through Iceland.' },
    ],
    voiceQuote: {
      es: '«Sube a mi lomo, pequeña lagartija: en las cumbres frías, el calor se comparte.»',
      en: '“Climb onto my back, little lizard: on freezing peaks, warmth is meant to be shared.”',
    },
    mainImage: {
      url: '/images/characters/lulu-main.webp',
      alt: { es: 'Lulú la llama andina en Machu Picchu', en: 'Lulú the llama at Machu Picchu' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['peru'],
  },
  {
    id: 'emi',
    name: 'Emi el Escarabajo',
    slug: 'emi',
    passportRole: {
      es: 'Guardián de los Pasadizos Secretos de Guiza',
      en: 'Guardian of the Secret Passages of Giza',
    },
    shortDescription: {
      es: 'Escarabajo pelotero sabio y trabajador. Enseña a Curileta que en el desierto el mayor tesoro es la sombra.',
      en: 'Wise dung beetle. Teaches Curileta that in the desert, the greatest treasure is shade.',
    },
    biography: {
      es: 'Emi guía a Curileta a través de los pasadizos de la Gran Pirámide, mostrándole los jeroglíficos ancestrales y recordándole el valor de la constancia.',
      en: 'Emi guides Curileta through the secret corridors of the Great Pyramid.',
    },
    species: 'Escarabajo Pelotero Sagrado de Egipto',
    personality: ['Filosófico', 'Tenaz', 'Amable', 'Perspicaz'],
    values: ['Trabajo duro', 'Humildad'],
    explorerStats: {
      curiosity: 90,
      courage: 94,
      agility: 86,
      wisdom: 99,
    },
    backpackItems: [
      { es: 'Amuleto de arcilla del Nilo', en: 'Clay amulet of the Nile' },
    ],
    curiosityFacts: [
      { es: 'Capaz de rodar esferas que superan 50 veces su propio peso.', en: 'Can roll spheres 50 times his own body weight.' },
    ],
    voiceQuote: {
      es: '«¿Buscas el tesoro? En este desierto ardiente, el verdadero tesoro es la sombra.»',
      en: '“Seeking treasure? In this blazing desert, true treasure is shade.”',
    },
    mainImage: {
      url: '/images/characters/emi-main.webp',
      alt: { es: 'Emi el escarabajo de Egipto', en: 'Emi the beetle of Egypt' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['egipto'],
  },
  {
    id: 'picu',
    name: 'Picu el Frailecillo',
    slug: 'picu',
    passportRole: {
      es: 'Guardián del Hielo y los Géiseres',
      en: 'Guardian of Ice and Geysers',
    },
    shortDescription: {
      es: 'Pájaro de pico multicolor con aspecto de payaso simpático. Nada con Curileta en las aguas termales de Islandia.',
      en: 'Colorful-billed puffin. Swims with Curileta in the geothermal lagoons of Iceland.',
    },
    biography: {
      es: 'Picu admira la valentía de Curileta al viajar desde tierras cálidas. Le enseña cómo la Tierra guarda calor volcánico bajo la nieve y cómo hornear pan bajo tierra.',
      en: 'Picu admires Curileta’s courage and shows her the volcanic heat beneath polar snow.',
    },
    species: 'Frailecillo Ártico de Islandia',
    personality: ['Divertido', 'Valiente', 'Expresivo', 'Acróbata'],
    values: ['Alegría ante la adversidad', 'Convivencia con la naturaleza'],
    explorerStats: {
      curiosity: 92,
      courage: 89,
      agility: 96,
      wisdom: 84,
    },
    backpackItems: [
      { es: 'Trozo de pan volcánico horneado bajo tierra', en: 'Volcanic bread baked underground' },
    ],
    curiosityFacts: [
      { es: 'Bucea a más de 60 metros bajo las olas heladas para pescar arenques.', en: 'Dives over 60 meters in icy waves to catch fish.' },
    ],
    voiceQuote: {
      es: '«¡Es de valientes viajar tan lejos! La nieve cae arriba pero el agua tibia nos abraza abajo.»',
      en: '“It takes true bravery to travel this far! Snow falls above while warm waters embrace us below.”',
    },
    mainImage: {
      url: '/images/characters/picu-main.webp',
      alt: { es: 'Picu el frailecillo en Islandia', en: 'Picu the puffin in Iceland' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['islandia'],
  },
  {
    id: 'zipi-bot',
    name: 'Zipi-Bot',
    slug: 'zipi-bot',
    passportRole: {
      es: 'Pequeño Robot Cantor de Tokio',
      en: 'Singing Robot of Tokyo',
    },
    shortDescription: {
      es: 'Un entrañable robot de juguete perdido que Curileta ayuda a reencontrarse con su dueño en Japón.',
      en: 'A lovable lost toy robot that Curileta helps reunite with his owner in Japan.',
    },
    biography: {
      es: 'En medio del bullicio futurista de Tokio y las vías del tren bala Shinkansen, Zipi-Bot enseña a Curileta que la tecnología y las tradiciones milenarias pueden convivir en perfecta armonía.',
      en: 'Amid futuristic Tokyo, Zipi-Bot shows Curileta how technology and ancient temples thrive together.',
    },
    species: 'Robot Interactivo de Juguete',
    personality: ['Entusiasta', 'Musical', 'Curioso', 'Leal'],
    values: ['Solidaridad', 'Armonía entre tradición y futuro'],
    explorerStats: {
      curiosity: 97,
      courage: 80,
      agility: 85,
      wisdom: 94,
    },
    backpackItems: [
      { es: 'Batería solar miniatura y altavoz con canciones', en: 'Mini solar battery and melody speaker' },
    ],
    curiosityFacts: [
      { es: 'Sabe cantar melodías japonesas mientras ayuda a limpiar el suelo.', en: 'Can sing Japanese melodies while cleaning floors.' },
    ],
    voiceQuote: {
      es: '«¡Bip-bop! ¡En Tokio el futuro y los templos milenarios viajan en el mismo tren bala!»',
      en: '“Beep-boop! In Tokyo the future and ancient temples ride the same bullet train!”',
    },
    mainImage: {
      url: '/images/characters/zipi-bot-main.webp',
      alt: { es: 'Zipi-Bot el robot en Tokio', en: 'Zipi-Bot the robot in Tokyo' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['japon'],
  },
  {
    id: 'kiki',
    name: 'Kiki el Kiwi',
    slug: 'kiki',
    passportRole: {
      es: 'Guía Nocturno de las Cuevas de Waitomo',
      en: 'Night Guide of Waitomo Caves',
    },
    shortDescription: {
      es: 'Pájaro redondo y sin alas que guía a Curileta bajo las constelaciones subterráneas de Nueva Zelanda.',
      en: 'Round, flightless bird who guides Curileta beneath subterranean constellations.',
    },
    biography: {
      es: 'Kiki muestra a Curileta las cuevas de gusanitos de luz bioluminiscente, los poblados maoríes con la danza de la Haka y las diminutas casitas de Hobbiton.',
      en: 'Kiki reveals glowworm caves, Maori Haka dance, and Hobbiton burrows to Curileta.',
    },
    species: 'Pájaro Kiwi de Nueva Zelanda',
    personality: ['Tímido', 'Amable', 'Nocturno', 'Divertido'],
    values: ['Preservación de la magia', 'Orgullo de la propia tierra'],
    explorerStats: {
      curiosity: 94,
      courage: 82,
      agility: 88,
      wisdom: 95,
    },
    backpackItems: [
      { es: 'Hoja de helecho plateado reflectante', en: 'Reflective silver fern leaf' },
    ],
    curiosityFacts: [
      { es: 'No tiene alas pero su olfato en la punta del pico es más fino que el de un sabueso.', en: 'Has no wings but nostrils at the tip of his beak scent food underground.' },
    ],
    voiceQuote: {
      es: '«¡Kia ora! ¡Mira hacia el techo de la cueva: aquí las estrellas brillan bajo la tierra!»',
      en: '“Kia ora! Look up at the cave ceiling: down here, stars shine underground!”',
    },
    mainImage: {
      url: '/images/characters/kiki-main.webp',
      alt: { es: 'Kiki el Kiwi en los bosques de helechos', en: 'Kiki the Kiwi among ferns' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['nueva-zelanda'],
  },
  {
    id: 'bao',
    name: 'Bao el Oso Panda',
    slug: 'bao',
    passportRole: {
      es: 'Guardián de la Gran Muralla & Maestro del Bambú',
      en: 'Guardian of the Great Wall & Bamboo Master',
    },
    shortDescription: {
      es: 'Panda gigante comilón y pacífico que sube a Curileta sobre su cabeza en la Gran Muralla China.',
      en: 'Peaceful, hungry giant panda who carries Curileta atop his head along the Great Wall of China.',
    },
    biography: {
      es: 'Bao come hasta 12 kilos de bambú al día. Enseña a Curileta los caracteres mágicos de la amistad, la ceremonia milenaria del té y cómo los fuegos artificiales llenan de fiesta el cielo.',
      en: 'Bao eats 12kg of bamboo daily and teaches Curileta the sacred art of tea and friendship characters.',
    },
    species: 'Oso Panda Gigante de China',
    personality: ['Glotón', 'Sereno', 'Bondadoso', 'Relajado'],
    values: ['Paz interior', 'Amistad duradera'],
    explorerStats: {
      curiosity: 86,
      courage: 90,
      agility: 75,
      wisdom: 97,
    },
    backpackItems: [
      { es: 'Brote tierno de bambú dulce para el camino', en: 'Sweet tender bamboo shoot for the road' },
      { es: 'Papiro con el carácter de la amistad', en: 'Parchment with the character of friendship' },
    ],
    curiosityFacts: [
      { es: 'Da dos toques con sus patitas en la mesa para decir "gracias" en la ceremonia del té.', en: 'Taps the table twice to say thank you during tea ceremony.' },
    ],
    voiceQuote: {
      es: '«La Gran Muralla parece un dragón dormido, pero lo más fuerte que une a los países es la amistad.»',
      en: '“The Great Wall resembles a sleeping dragon, but the strongest bond is friendship.”',
    },
    mainImage: {
      url: '/images/characters/bao-main.webp',
      alt: { es: 'Bao el oso panda gigante en China', en: 'Bao the giant panda in China' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['china'],
  },
  {
    id: 'gino',
    name: 'Gino el Ratoncito Chef',
    slug: 'gino',
    passportRole: {
      es: 'Maestro Pizzaiolo & Catador de Gelato',
      en: 'Master Pizzaiolo & Gelato Connoisseur',
    },
    shortDescription: {
      es: 'Ratoncito florentino con gorro de chef que enseña a Curileta que la comida y el arte van de la mano.',
      en: 'Florentine mouse chef who shows Curileta that cuisine and fine art go hand in hand.',
    },
    biography: {
      es: 'Desde los museos de Roma hasta las góndolas de Venecia y la Torre inclinada de Pisa, Gino acompaña a Curileta a saborear más de 350 tipos de pasta y el auténtico gelato artesanal.',
      en: 'From Rome to Venice canals, Gino shares Italy’s culinary art with Curileta.',
    },
    species: 'Ratón de Campo Italiano',
    personality: ['Apasionado', 'Expresivo', 'Gourmet', 'Creativo'],
    values: ['Amor por el arte', 'El sabor de compartir'],
    explorerStats: {
      curiosity: 93,
      courage: 84,
      agility: 97,
      wisdom: 89,
    },
    backpackItems: [
      { es: 'Gorro minúsculo de chef blanco', en: 'Tiny white chef hat' },
      { es: 'Espátula para servir gelato de pistacho', en: 'Spatula for pistachio gelato' },
    ],
    curiosityFacts: [
      { es: 'Ayudó a Curileta a usar su colita como pincel para pintar en una plaza de Florencia.', en: 'Helped Curileta use her tail as a paintbrush in Florence.' },
    ],
    voiceQuote: {
      es: '«¡Mamma mia! ¡En Italia la masa de pizza vuela como platillo y el gelato sabe a gloria!»',
      en: '“Mamma mia! In Italy pizza dough flies like a saucer and gelato tastes like heaven!”',
    },
    mainImage: {
      url: '/images/characters/gino-main.webp',
      alt: { es: 'Gino el ratoncito chef en Italia', en: 'Gino the mouse chef in Italy' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['italia'],
  },
  {
    id: 'lola',
    name: 'Lola la Tortuga Mora',
    slug: 'lola',
    passportRole: {
      es: 'La Guardiana de la Entrada Invisible',
      en: 'Guardian of the Invisible Portal',
    },
    shortDescription: {
      es: 'Sabia tortuga andaluza que guía el corazón de Curileta de vuelta al Bosque Encantado en España.',
      en: 'Wise Andalusian tortoise who guides Curileta’s heart back to the Enchanted Forest.',
    },
    biography: {
      es: 'Entre el olor al azahar de Sevilla y el taconeo del flamenco, Lola entrega a Curileta la clave secreta: el Bosque Encantado no se encuentra con los pies, sino orientando el mapa del corazón.',
      en: 'Amid orange blossoms and flamenco rhythm, Lola reveals that home is found with the heart.',
    },
    species: 'Tortuga Mora de España',
    personality: ['Serena', 'Sabia', 'Cálida', 'Agradecida'],
    values: ['Raíces culturales', 'El verdadero significado del hogar'],
    explorerStats: {
      curiosity: 89,
      courage: 95,
      agility: 70,
      wisdom: 100,
    },
    backpackItems: [
      { es: 'Ramita de azahar de Sevilla con aroma dulce', en: 'Orange blossom sprig with sweet aroma' },
      { es: 'Sobre con azafrán dorado para la paella', en: 'Pouch of golden saffron for paella' },
    ],
    curiosityFacts: [
      { es: 'La entrada invisible al bosque está custodiada por una roca que tiene exactamente su misma silueta.', en: 'The invisible forest portal is marked by a stone matching her silhouette.' },
    ],
    voiceQuote: {
      es: '«El bosque que buscas no se encuentra con los pies, sino con el corazón.»',
      en: '“The forest you seek is not found with feet, but with the heart.”',
    },
    mainImage: {
      url: '/images/characters/lola-main.webp',
      alt: { es: 'Lola la tortuga mora en España', en: 'Lola the tortoise in Spain' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['espana-regreso'],
  },
  {
    id: 'canguro-mama',
    name: 'Mamá Canguro',
    slug: 'canguro-mama',
    passportRole: {
      es: 'Gran Saltarina del Outback & Guardiana Maternal',
      en: 'Great Outback Hopper & Maternal Guardian',
    },
    shortDescription: {
      es: 'Guardiana del desierto rojo australiano. Lleva a su cría en la bolsa y regala a Curileta saltos de 4 metros.',
      en: 'Guardian of the Australian red desert. Carries her baby in her pouch and gifts Curileta 4-meter leaps.',
    },
    biography: {
      es: 'En las tierras rojas del Outback y frente a la majestuosidad de Uluru, Mamá Canguro cuida incansablemente de su pequeño. Cuando Curileta recupera el peluche perdido Joey, en agradecimiento la lleva a grandes saltos hasta las blancas arenas de Hyams Beach.',
      en: 'Across the red Outback and Uluru, Mama Kangaroo watches over her little one. Grateful for Curileta recovering Joey the plush, she leaps to Hyams Beach.',
    },
    species: 'Canguro Rojo Australiano',
    personality: ['Protectora', 'Veloz', 'Cariñosa', 'Ágil'],
    values: ['Protección familiar', 'Gratitud', 'Libertad'],
    explorerStats: {
      curiosity: 85,
      courage: 96,
      agility: 100,
      wisdom: 88,
    },
    backpackItems: [
      { es: 'Bolsa marsupial espaciosa y mullida', en: 'Spacious and soft marsupial pouch' },
      { es: 'Arena hiperblanca de Hyams Beach', en: 'Ultra-white Hyams Beach sand' },
    ],
    curiosityFacts: [
      { es: 'Alcanza hasta 9 metros de longitud en un único salto sobre la tierra roja.', en: 'Reaches up to 9 meters length in a single bound across red earth.' },
    ],
    voiceQuote: {
      es: '«¡Sujétate fuerte a mi pelaje: el Outback se recorre volando sobre el suelo!»',
      en: '“Hold tight to my fur: the Outback is traversed flying over the ground!”',
    },
    mainImage: {
      url: '/images/characters/canguro-mama-main.webp',
      alt: { es: 'Mamá Canguro en el desierto australiano', en: 'Mama Kangaroo in the Outback' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['australia'],
  },
  {
    id: 'canguro-bebe',
    name: 'Bebé Canguro',
    slug: 'canguro-bebe',
    passportRole: {
      es: 'Pequeño Explorador de Bolsa Marsupial',
      en: 'Little Marsupial Pouch Explorer',
    },
    shortDescription: {
      es: 'La tierna cría de canguro que asoma sus orejitas curiosas y no puede dormir sin su koala Joey.',
      en: 'The adorable baby kangaroo who pokes curious ears out and cannot sleep without Joey the koala.',
    },
    biography: {
      es: 'Pasa la mayor parte del tiempo asomando su hociquito desde la bolsa de mamá. Cuando pierde a Joey, su peluche de koala, la tristeza lo invade hasta que la intrépida Curileta recorre el desierto para devolvérselo.',
      en: 'Spends his days peeking from mom’s pouch. When Joey the koala plush goes missing, Curileta darts across the desert to return it.',
    },
    species: 'Cría de Canguro Rojo',
    personality: ['Tierno', 'Curioso', 'Divertido', 'Juguetón'],
    values: ['Afecto', 'Ilusión infantil', 'Compañerismo'],
    explorerStats: {
      curiosity: 95,
      courage: 72,
      agility: 88,
      wisdom: 70,
    },
    backpackItems: [
      { es: 'Joey, su koala de trapo favorito e inseparable', en: 'Joey, his inseparable favorite plush koala' },
    ],
    curiosityFacts: [
      { es: 'Al nacer mide apenas el tamaño de una pequeña cereza antes de resguardarse en la bolsa.', en: 'At birth measures barely the size of a cherry before growing safely in the pouch.' },
    ],
    voiceQuote: {
      es: '«¡Joey ha vuelto! ¡Gracias, pequeña amiga de sombrero verde!»',
      en: '“Joey is back! Thank you, little green-hat friend!”',
    },
    mainImage: {
      url: '/images/characters/canguro-bebe-main.webp',
      alt: { es: 'Bebé Canguro asomando de la bolsa', en: 'Baby Kangaroo peeking from the pouch' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['australia'],
  },
  {
    id: 'joey',
    name: 'Joey (El Koala de Trapo)',
    slug: 'joey',
    passportRole: {
      es: 'El Peluche Más Viajero del Mundo',
      en: 'The World’s Most Traveled Plush Toy',
    },
    shortDescription: {
      es: 'El inseparable koala de peluche del bebé canguro. Su extravío desata la gran búsqueda de Curileta en Uluru.',
      en: 'The baby kangaroo’s inseparable plush koala. His loss sparks Curileta’s thrilling search at Uluru.',
    },
    biography: {
      es: 'Joey es un muñeco de trapo suave con forma de koala y orejas esponjosas. Se cayó accidentalmente en el Outback mientras la familia canguro saltaba cerca de Uluru. Curileta lo rescató intacto entre la tierra roja, devolviendo la sonrisa al bebé canguro.',
      en: 'Joey is a soft plush koala with fluffy ears. Dropped in the Outback during kangaroo leaps, Curileta rescued him intact to reunite him with baby kangaroo.',
    },
    species: 'Peluche de Koala de Trapo',
    personality: ['Silencioso', 'Reconfortante', 'Suave', 'Incondicional'],
    values: ['Consuelo', 'Amor a la infancia', 'Ternura'],
    explorerStats: {
      curiosity: 70,
      courage: 80,
      agility: 60,
      wisdom: 90,
    },
    backpackItems: [
      { es: 'Costuras de hilo reforzado y relleno de algodón ultra suave', en: 'Reinforced thread stitching and ultra-soft cotton' },
    ],
    curiosityFacts: [
      { es: 'En el libro original, Joey es el peluche de koala del bebé canguro y no el nombre del bebé.', en: 'In the original book, Joey is explicitly the baby kangaroo’s plush koala toy.' },
    ],
    voiceQuote: {
      es: '«(Un abrazo suave y esponjoso que calma cualquier tempestad)»',
      en: '“(A gentle and fluffy hug that calms any storm)”',
    },
    mainImage: {
      url: '/images/characters/joey-main.webp',
      alt: { es: 'Joey el koala de trapo', en: 'Joey the plush koala' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['australia'],
  },
  {
    id: 'pez-volador',
    name: 'Glub el Pez Volador',
    slug: 'pez-volador',
    passportRole: {
      es: 'Acróbata de las Olas & Navegante Bioluminiscente',
      en: 'Wave Acrobat & Bioluminescent Navigator',
    },
    shortDescription: {
      es: 'Pez volador del Mar de Filipinas. Salta junto a la cubierta del barco y revela los secretos del océano nocturno.',
      en: 'Flying fish of the Philippine Sea. Leaps alongside the ship deck revealing night ocean secrets.',
    },
    biography: {
      es: 'Durante la travesía marina de Curileta por el Pacífico occidental, Glub y sus compañeros despliegan sus aletas translúcidas planeando sobre el agua iluminada por plancton fosforescente, maravillando a la pequeña exploradora.',
      en: 'During Curileta’s Pacific voyage, Glub glides across glowing waves, sharing the marvels of nocturnal marine life.',
    },
    species: 'Pez Volador del Pacífico',
    personality: ['Acróbata', 'Divertido', 'Luminoso', 'Vivaz'],
    values: ['Libertad marina', 'Curiosidad sin fronteras'],
    explorerStats: {
      curiosity: 94,
      courage: 91,
      agility: 99,
      wisdom: 84,
    },
    backpackItems: [
      { es: 'Gotas de agua marina fosforescente en miniatura', en: 'Miniature drops of phosphorescent sea water' },
    ],
    curiosityFacts: [
      { es: 'Puede planear más de 200 metros sobre la superficie del agua desplegando sus aletas pectorales.', en: 'Can glide over 200 meters above water surface using its pectoral fins.' },
    ],
    voiceQuote: {
      es: '«¡El mar no termina en la superficie: a veces volamos para tocar las estrellas reflejadas!»',
      en: '“The sea does not end at the surface: sometimes we take flight to touch reflected stars!”',
    },
    mainImage: {
      url: '/images/characters/pez-volador-main.webp',
      alt: { es: 'Glub el pez volador planeando sobre el mar', en: 'Glub the flying fish gliding over water' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['mar-filipinas'],
  },
  {
    id: 'ornitorrinco',
    name: 'El Ornitorrinco Sabio',
    slug: 'ornitorrinco',
    passportRole: {
      es: 'Guardián de los Riachuelos Secretos',
      en: 'Guardian of the Secret Creeks',
    },
    shortDescription: {
      es: 'Habitante único del riachuelo australiano. Curileta casi lo pisa mientras busca el peluche en el Outback.',
      en: 'Unique dweller of the Australian creek. Curileta almost steps on him while searching for the plush in the Outback.',
    },
    biography: {
      es: 'Con su pico de pato, cola de castor y patas palmeadas, el ornitorrinco sorprende a Curileta por ser uno de los seres más insólitos y fascinantes del reino animal, demostrando que la naturaleza adora la originalidad.',
      en: 'With duck bill, beaver tail, and webbed feet, platypus delights Curileta as one of nature’s most fascinating marvels.',
    },
    species: 'Ornitorrinco Australiano',
    personality: ['Tranquilo', 'Enigmático', 'Observador', 'Pacífico'],
    values: ['Autenticidad', 'Armonía fluvial'],
    explorerStats: {
      curiosity: 90,
      courage: 82,
      agility: 92,
      wisdom: 96,
    },
    backpackItems: [
      { es: 'Piedrecita pulida del fondo del arroyo cristalino', en: 'Polished pebble from clear creek bed' },
    ],
    curiosityFacts: [
      { es: 'Detecta los movimientos de presas en el agua mediante impulsos electromagnéticos en su pico.', en: 'Detects prey movements in water using electromagnetic sensors in its bill.' },
    ],
    voiceQuote: {
      es: '«Ser diferente es el mejor regalo que la naturaleza nos puede conceder.»',
      en: '“Being uniquely different is the greatest gift nature can bestow.”',
    },
    mainImage: {
      url: '/images/characters/ornitorrinco-main.webp',
      alt: { es: 'Ornitorrinco nadando en el arroyo', en: 'Platypus swimming in the creek' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['australia'],
  },
  {
    id: 'emu',
    name: 'El Emú Curioso',
    slug: 'emu',
    passportRole: {
      es: 'Veloz Corredor del Outback & Catador de Sombreros',
      en: 'Swift Outback Runner & Hat Inspector',
    },
    shortDescription: {
      es: 'Pájaro gigante no volador de Australia. Intenta picotear con curiosidad el sombrero de aventurera de Curileta.',
      en: 'Giant flightless Australian bird. Curiously tries to peck Curileta’s explorer hat.',
    },
    biography: {
      es: 'Curileta debe esquivar ágilmente sus picotazos cuando el emú se interesa por el llamativo color de su sombrero. Más tarde, en Hyams Beach, descubre un impresionante huevo de emú de color verde esmeralda oscuro.',
      en: 'Curileta dodges playful pecks as the emu examines her hat. Later at Hyams Beach, she spots a dark emerald emu egg.',
    },
    species: 'Emú Australiano',
    personality: ['Curioso', 'Acelerado', 'Simpático', 'Incansable'],
    values: ['Persistencia', 'Espíritu aventurero'],
    explorerStats: {
      curiosity: 98,
      courage: 86,
      agility: 97,
      wisdom: 78,
    },
    backpackItems: [
      { es: 'Cáscara vacía de huevo verde esmeralda oscuro', en: 'Dark emerald green emu eggshell' },
    ],
    curiosityFacts: [
      { es: 'Sus patas son tan potentes que puede correr a más de 50 km/h por el desierto.', en: 'Can sprint at over 50 km/h across the desert with powerful legs.' },
    ],
    voiceQuote: {
      es: '«¡Qué sombrero tan fascinante! ¿Se come o es para coleccionar estrellas?»',
      en: '“What a fascinating hat! Can it be eaten or is it for collecting stars?”',
    },
    mainImage: {
      url: '/images/characters/emu-main.webp',
      alt: { es: 'Emú curioso en la llanura australiana', en: 'Curious emu on Australian plains' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['australia'],
  },
  {
    id: 'basset',
    name: 'Barnaby el Basset Hound',
    slug: 'basset',
    passportRole: {
      es: 'Sabueso de las Autocaravanas Alpinas',
      en: 'Hound of Alpine Camper Vans',
    },
    shortDescription: {
      es: 'Perro bonachón y despistado de orejas largas. Viaja en autocaravana por los Alpes franceses persiguiendo el olor a queso.',
      en: 'Good-natured floppy-eared hound. Travels in a camper van across the French Alps chasing cheese aromas.',
    },
    biography: {
      es: 'Curileta viaja de polizón en la autocaravana familiar mientras cruzan los puertos de montaña alpinos. El fino olfato de Barnaby detecta un queso francés y desata un divertido revuelo que acaba con Curileta escondida dentro de una baguette.',
      en: 'Curileta hitches a ride in the family camper across Alpine passes. Barnaby’s keen nose sparks a funny scramble ending with Curileta inside a baguette.',
    },
    species: 'Perro Basset Hound',
    personality: ['Divertido', 'Glotón', 'Bonachón', 'Despistado'],
    values: ['Lealtad', 'Sentido del humor', 'Amistad perruna'],
    explorerStats: {
      curiosity: 88,
      courage: 80,
      agility: 72,
      wisdom: 85,
    },
    backpackItems: [
      { es: 'Miga de baguette crujiente y cascabel de collar', en: 'Crispy baguette crumb and collar bell' },
    ],
    curiosityFacts: [
      { es: 'Sus orejas largas barren el suelo ayudando a canalizar los olores directamente a su trufa.', en: 'Long ears sweep the ground helping funnel scents straight to his nose.' },
    ],
    voiceQuote: {
      es: '«¡Guau! ¿Ese aroma a queso viene de la nevera o de esa misteriosa baguette parlante?»',
      en: '“Woof! Is that cheese scent from the fridge or that mysterious talking baguette?”',
    },
    mainImage: {
      url: '/images/characters/basset-main.webp',
      alt: { es: 'Barnaby el perro basset hound con orejas largas', en: 'Barnaby the basset hound with long ears' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['francia'],
  },
  {
    id: 'cobaya',
    name: 'Cuy Andino / Cobaya',
    slug: 'cobaya',
    passportRole: {
      es: 'Primos Andinos de Pompón en Perú',
      en: 'Pompón’s Andean Cousins in Peru',
    },
    shortDescription: {
      es: 'Pobladores andinos del Valle Sagrado. Curileta les escribe a Pompón para contarle sobre sus entrañables parientes sudamericanos.',
      en: 'Andean dwellers of the Sacred Valley. Curileta writes Pompón about his adorable South American relatives.',
    },
    biography: {
      es: 'En las faldas de los Andes peruanos, Curileta descubre que Pompón tiene primos peludos y rechonchos que habitan los pueblos de montaña. Les envía dibujos a Pompón prometiéndole que algún día los conocerá.',
      en: 'In the Peruvian Andes, Curileta finds Pompón’s cuddly relatives and sketches them for his mailbox back home.',
    },
    species: 'Cuy Andino / Cobaya de Montaña',
    personality: ['Cariñosa', 'Sociable', 'Vivaz', 'Tierna'],
    values: ['Lazamiento familiar', 'Cuidado de la manada'],
    explorerStats: {
      curiosity: 84,
      courage: 76,
      agility: 88,
      wisdom: 82,
    },
    backpackItems: [
      { es: 'Tallito de maíz morado andino', en: 'Purple Andean corn stalk' },
    ],
    curiosityFacts: [
      { es: 'Emiten suaves silbidos ("cui-cui") de alegría cuando saludan a los recién llegados.', en: 'Chirp soft whistle sounds of joy when greeting friendly travelers.' },
    ],
    voiceQuote: {
      es: '«¡Dile a Pompón que en los Andes tiene una familia entera que lo espera con choclo tierno!»',
      en: '“Tell Pompón that in the Andes a whole family awaits him with sweet corn!”',
    },
    mainImage: {
      url: '/images/characters/cobaya-main.webp',
      alt: { es: 'Cobaya andina en las montañas de Perú', en: 'Andean guinea pig in the mountains of Peru' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['peru'],
  },
];

export const INITIAL_LOCATIONS: Location[] = [
  {
    id: 'espana-inicio',
    name: { es: 'El Bosque Encantado', en: 'The Enchanted Forest' },
    slug: 'espana-inicio',
    country: { es: 'España (Partida)', en: 'Spain (Departure)' },
    theme: { es: 'El árbol más alto, la mochila y la promesa a Pompón', en: 'The tallest tree, the backpack & promise to Pompón' },
    climate: { es: 'Brisa templada mediterránea', en: 'Temperate Mediterranean breeze' },
    coordinates: { lat: 40.41, lng: -3.70 },
    passportStamp: { icon: 'Compass', code: 'ESP-HOME-00', color: '#10B981' },
    description: {
      es: 'El hogar secreto de Curileta y Pompón. Un bosque mágico donde los árboles guardan historias y comienza la gran expedición por el mundo.',
      en: 'Curileta and Pompón’s secret home. A magical forest where the expedition begins.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'El Bosque Encantado en España', en: 'The Enchanted Forest in Spain' },
    },
    curiosities: [
      { es: 'Es un lugar invisible para los humanos que no tienen curiosidad en el corazón.', en: 'An invisible place for those who lack curiosity in their hearts.' },
    ],
    characters: ['curileta', 'pompon'],
  },
  {
    id: 'mexico',
    name: { es: 'Teotihuacán & Chichén Itzá', en: 'Teotihuacan & Chichen Itza' },
    slug: 'mexico',
    country: { es: 'México', en: 'Mexico' },
    theme: { es: 'Pirámide del Sol, el Quetzal y el chocolate de los dioses', en: 'Pyramid of the Sun, the Quetzal & gods chocolate' },
    climate: { es: 'Cálido y templado tropical', en: 'Warm tropical temperate' },
    coordinates: { lat: 19.69, lng: -98.84 },
    passportStamp: { icon: 'Sun', code: 'MEX-TEO-01', color: '#F59E0B' },
    description: {
      es: 'Pirámides gigantes que rozan las nubes construidas siguiendo el baile de los planetas. Donde el eco suena como el canto del Quetzal.',
      en: 'Giant pyramids touching the clouds aligned with celestial constellations.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Pirámides de Teotihuacán', en: 'Pyramids of Teotihuacan' },
    },
    curiosities: [
      { es: 'En Chichén Itzá, al aplaudir frente a la pirámide el eco imita el canto del Quetzal.', en: 'Clapping at Chichen Itza creates an echo mimicking the Quetzal call.' },
      { es: 'El chocolate fue inventado aquí hace siglos y antes se tomaba picante.', en: 'Chocolate was invented here centuries ago and was originally spicy.' },
      { es: 'El volcán Cuexcomate mide apenas 13 metros y tiene escalera de caracol.', en: 'Cuexcomate volcano is only 13 meters tall with a spiral staircase.' },
    ],
    characters: ['curileta', 'quetzal'],
  },
  {
    id: 'peru',
    name: { es: 'Machu Picchu & Líneas de Nazca', en: 'Machu Picchu & Nazca Lines' },
    slug: 'peru',
    country: { es: 'Perú', en: 'Peru' },
    theme: { es: 'La ciudad sobre las nubes, la llama Lulú y 3.000 patatas', en: 'City over clouds, Lulú the llama & 3,000 potatoes' },
    climate: { es: 'Andino fresco y nublado', en: 'Fresh and misty Andean' },
    coordinates: { lat: -13.16, lng: -72.54 },
    passportStamp: { icon: 'Mountain', code: 'PER-MAC-02', color: '#10B981' },
    description: {
      es: 'Una ciudadela inca tallada en las cumbres donde las piedras están cortadas con tanta precisión que ni una tarjeta cabe entre ellas.',
      en: 'An Inca citadel atop the peaks where stones fit without any mortar.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Machu Picchu entre la niebla', en: 'Machu Picchu in the clouds' },
    },
    curiosities: [
      { es: 'Existen más de 3.000 tipos diferentes de patatas en los Andes.', en: 'There are over 3,000 varieties of potatoes in the Andes.' },
      { es: 'Las piedras son antisísmicas: bailan durante los terremotos y vuelven a su lugar.', en: 'Stones dance during earthquakes and return to their original position.' },
      { es: 'Los conejillos de indias (cuyes) son parientes andinos de Pompón.', en: 'Guinea pigs (cuyes) are Andean relatives of Pompón.' },
    ],
    characters: ['curileta', 'lulu'],
  },
  {
    id: 'egipto',
    name: { es: 'Pirámides de Guiza & El Nilo', en: 'Giza Pyramids & The Nile' },
    slug: 'egipto',
    country: { es: 'Egipto', en: 'Egypt' },
    theme: { es: 'El calor dorado de Ra, el escarabajo Emi y el Nilo mágico', en: 'Golden heat of Ra, Emi the beetle & magic Nile' },
    climate: { es: 'Desértico soleado hasta 80°C', en: 'Sunny desert up to 80°C' },
    coordinates: { lat: 29.97, lng: 31.13 },
    passportStamp: { icon: 'Sun', code: 'EGY-CAI-03', color: '#EAB308' },
    description: {
      es: 'Dos millones de bloques de piedra más pesados que elefantes bajo el sol del desierto y jeroglíficos llenos de secretos de faraones.',
      en: 'Two million stone blocks under the desert sun and hieroglyphs telling pharaoh secrets.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Pirámides de Guiza en Egipto', en: 'Pyramids of Giza in Egypt' },
    },
    curiosities: [
      { es: 'El río Nilo fluye de sur a norte, al revés de lo que parece normal.', en: 'The Nile river flows South to North, unlike most rivers.' },
      { es: 'Los antiguos egipcios usaban almohadas de piedra o madera para no estropear sus peinados.', en: 'Ancient Egyptians slept on stone or wooden headrests to preserve hairstyles.' },
    ],
    characters: ['curileta', 'emi'],
  },
  {
    id: 'islandia',
    name: { es: 'Laguna Azul & Géiseres', en: 'Blue Lagoon & Geysers' },
    slug: 'islandia',
    country: { es: 'Islandia', en: 'Iceland' },
    theme: { es: 'Fuego y hielo, pan volcánico y auroras boreales', en: 'Fire and ice, volcanic bread & auroras' },
    climate: { es: 'Polar glacial con aguas termales', en: 'Polar glacial with thermal springs' },
    coordinates: { lat: 64.96, lng: -19.02 },
    passportStamp: { icon: 'Snowflake', code: 'ISL-REK-04', color: '#38BDF8' },
    description: {
      es: 'Donde la nieve cae sobre el sombrero de Curileta mientras se baña en agua volcánica tibia y contempla las auroras boreales verdes.',
      en: 'Where snow falls on Curileta’s hat while soaking in thermal water under aurora skies.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Laguna Azul y aurora en Islandia', en: 'Blue Lagoon and aurora in Iceland' },
    },
    curiosities: [
      { es: 'Hornean pan enterrándolo en la tierra caliente durante 24 horas.', en: 'Bake bread by burying it in hot volcanic soil for 24 hours.' },
      { es: 'Casi no hay mosquitos en toda la isla debido al clima ártico.', en: 'Virtually no mosquitoes exist across the island due to the arctic climate.' },
      { es: 'Las carreteras se desvían para no molestar las rocas sagradas de los elfos.', en: 'Roads are built around rocks to respect invisible elves.' },
    ],
    characters: ['curileta', 'picu'],
  },
  {
    id: 'japon',
    name: { es: 'Tokio, Shinkansen & Monte Fuji', en: 'Tokyo, Shinkansen & Mount Fuji' },
    slug: 'japon',
    country: { es: 'Japón', en: 'Japan' },
    theme: { es: 'Trenes bala, flores de cerezo, robots y sandías cuadradas', en: 'Bullet trains, cherry blossoms, robots & square watermelons' },
    climate: { es: 'Templado estacional de cerezos', en: 'Temperate cherry blossom seasonal' },
    coordinates: { lat: 35.36, lng: 138.72 },
    passportStamp: { icon: 'Award', code: 'JPN-TOK-05', color: '#F43F5E' },
    description: {
      es: 'El contraste más asombroso del mundo: templos de madera sagrados junto a robots cantores y trenes que vuelan a toda velocidad.',
      en: 'Ancient wooden shrines alongside singing robots and bullet trains.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Monte Fuji y cerezos en flor', en: 'Mount Fuji and cherry blossoms' },
    },
    curiosities: [
      { es: 'Cultivan sandías con forma de cubo dentro de cajas de cristal para que quepan en la nevera.', en: 'Grow square watermelons inside glass boxes to fit in fridges.' },
      { es: 'Tienen zapatillas especiales exclusivas para entrar al cuarto de baño.', en: 'Special slippers are used solely for entering the bathroom.' },
      { es: 'El Monte Fuji es un volcán cónico casi perfecto venerado desde hace siglos.', en: 'Mount Fuji is a near-perfect conical volcano venerated for centuries.' },
    ],
    characters: ['curileta', 'zipi-bot'],
  },
  {
    id: 'australia',
    name: { es: 'Uluru & Hyams Beach', en: 'Uluru & Hyams Beach' },
    slug: 'australia',
    country: { es: 'Australia', en: 'Australia' },
    theme: { es: 'Tierra roja, saltos de 4 metros con Mamá Canguro y el peluche Joey', en: 'Red earth, 4-meter leaps with Mama Kangaroo & Joey' },
    climate: { es: 'Desierto Outback seco y cálido', en: 'Warm dry Outback desert' },
    coordinates: { lat: -25.34, lng: 131.03 },
    passportStamp: { icon: 'Award', code: 'AUS-ULU-06', color: '#EA580C' },
    description: {
      es: 'La tierra donde las rocas cambian de naranja a rojo con el sol y la arena de Hyams Beach es la más blanca del mundo.',
      en: 'The land where Uluru turns from orange to fiery red and sands are the whitest on Earth.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Uluru roca roja en Australia', en: 'Uluru red rock in Australia' },
    },
    curiosities: [
      { es: 'Hyams Beach tiene la arena más blanca del mundo según el récord Guinness y chirría bajo las patitas.', en: 'Hyams Beach holds the Guinness record for whitest sand and squeaks underfoot.' },
      { es: 'Los huevos de Emú son de color verde oscuro casi negro y pesan como 12 huevos de gallina.', en: 'Emu eggs are dark green and weigh as much as 12 chicken eggs.' },
      { es: 'El ornitorrinco tiene pico de pato, cola de castor y es mamífero que pone huevos.', en: 'The platypus has a duck bill, beaver tail, and is an egg-laying mammal.' },
    ],
    characters: ['curileta', 'canguro-mama', 'canguro-bebe', 'joey', 'ornitorrinco', 'emu'],
  },
  {
    id: 'nueva-zelanda',
    name: { es: 'Waitomo & Hobbiton', en: 'Waitomo & Hobbiton' },
    slug: 'nueva-zelanda',
    country: { es: 'Nueva Zelanda', en: 'New Zealand' },
    theme: { es: 'Cielos de luz bajo tierra, casitas de Hobbit y la danza Haka', en: 'Underground light skies, Hobbit homes & Haka dance' },
    climate: { es: 'Bosque húmedo de helechos gigantes', en: 'Giant fern rainforest' },
    coordinates: { lat: -38.68, lng: 176.07 },
    passportStamp: { icon: 'Sparkles', code: 'NZL-WAI-07', color: '#059669' },
    description: {
      es: 'Bosques de helechos plateados que guían la noche, cuevas con gusanitos que brillan como estrellas y colinas de cuento con puertas redondas.',
      en: 'Silver fern forests, glowworm caves like subterranean stars, and Hobbit doors.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Colinas verdes de Nueva Zelanda', en: 'Green rolling hills of New Zealand' },
    },
    curiosities: [
      { es: 'Las hojas de los helechos plateados brillan con luz de plata bajo la luna y servían de guía.', en: 'Silver fern leaves reflect silver under moonlight and guided warriors.' },
      { es: 'El pueblo de Hobbiton tiene chimeneas que funcionan y puertas redondas perfectas para lagartijas.', en: 'Hobbiton village has working chimneys and round doors perfect for lizards.' },
      { es: 'Los Maoríes bailan la Haka con tanta fuerza que hacen temblar el suelo.', en: 'The Maori perform the Haka with such power the ground shakes.' },
    ],
    characters: ['curileta', 'kiki'],
  },
  {
    id: 'china',
    name: { es: 'La Gran Muralla & Bambú', en: 'The Great Wall & Bamboo' },
    slug: 'china',
    country: { es: 'China', en: 'China' },
    theme: { es: 'El dragón de piedra de 21.000 km, el panda Bao y el té de la amistad', en: 'The 21,000km stone dragon, panda Bao & friendship tea' },
    climate: { es: 'Continental montañoso', en: 'Mountainous continental' },
    coordinates: { lat: 40.43, lng: 116.57 },
    passportStamp: { icon: 'Shield', code: 'CHN-BEI-08', color: '#DC2626' },
    description: {
      es: 'Una muralla infinita que parece la espalda de un dragón de piedra sobre las cumbres, donde el panda Bao come bambú y enseña caracteres mágicos.',
      en: 'An endless wall resembling a stone dragon where panda Bao munches bamboo.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'La Gran Muralla China al atardecer', en: 'The Great Wall of China at sunset' },
    },
    curiosities: [
      { es: 'La Gran Muralla mide más de 21.000 kilómetros de longitud.', en: 'The Great Wall measures over 21,000 kilometers in length.' },
      { es: 'Los pandas gigantes como Bao comen hasta 12 kilos de bambú al día.', en: 'Giant pandas eat up to 12 kilograms of bamboo daily.' },
      { es: 'En la ceremonia del té, dos toques en la mesa significan "gracias" en silencio.', en: 'Tapping twice on the table means thank you in silence during tea ceremony.' },
    ],
    characters: ['curileta', 'bao'],
  },
  {
    id: 'italia',
    name: { es: 'Florencia, Pisa & Venecia', en: 'Florence, Pisa & Venice' },
    slug: 'italia',
    country: { es: 'Italia', en: 'Italy' },
    theme: { es: 'Torre inclinada, canales de agua, el ratoncito Gino y gelato de pistacho', en: 'Leaning tower, water canals, mouse chef Gino & gelato' },
    climate: { es: 'Mediterráneo soleado y alegre', en: 'Sunny cheerful Mediterranean' },
    coordinates: { lat: 41.90, lng: 12.49 },
    passportStamp: { icon: 'Award', code: 'ITA-ROM-09', color: '#16A34A' },
    description: {
      es: 'El museo al aire libre más grande del mundo. Ciudades flotantes donde las calles son de agua y la masa de pizza vuela por los aires.',
      en: 'The world’s largest open-air museum where streets are water and pizza dough flies.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Canales de Venecia en Italia', en: 'Canals of Venice in Italy' },
    },
    curiosities: [
      { es: 'Existen más de 350 formas distintas de pasta italiana.', en: 'There are over 350 different shapes of Italian pasta.' },
      { es: 'La Torre de Pisa se inclina 4 metros porque el suelo de arena se hundió al construirla.', en: 'The Leaning Tower of Pisa tilts 4 meters due to sandy subsoil.' },
      { es: 'Venecia se sostiene sobre miles de troncos de madera sumergidos hace siglos que no se pudren.', en: 'Venice rests upon underwater wooden piles that never decay.' },
    ],
    characters: ['curileta', 'gino'],
  },
  {
    id: 'francia',
    name: { es: 'París, Torre Eiffel & Louvre', en: 'Paris, Eiffel Tower & Louvre' },
    slug: 'francia',
    country: { es: 'Francia', en: 'France' },
    theme: { es: 'Croissant con sabor a nubes, la Mona Lisa juguetona y la torre que estira', en: 'Cloud-tasting croissant, playful Mona Lisa & stretching tower' },
    climate: { es: 'Templado con aroma a mantequilla y lavanda', en: 'Temperate with lavender & butter aroma' },
    coordinates: { lat: 48.85, lng: 2.35 },
    passportStamp: { icon: 'Award', code: 'FRA-PAR-10', color: '#2563EB' },
    description: {
      es: 'La Ciudad de la Luz donde la Torre Eiffel crece centímetros con el calor del sol y los croissants saben a nubes y alegría.',
      en: 'The City of Light where the Eiffel Tower expands in summer sun and croissants taste of joy.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Torre Eiffel de París', en: 'Eiffel Tower in Paris' },
    },
    curiosities: [
      { es: 'La Torre Eiffel hace "estiramientos" en verano: el metal se dilata y crece hasta 15 cm.', en: 'The Eiffel Tower expands in heat, growing up to 15 cm in summer.' },
      { es: 'La Mona Lisa parece seguirte con la mirada desde cualquier ángulo de la sala.', en: 'The Mona Lisa’s gaze seems to follow you from any corner.' },
      { es: 'La Galería de los Espejos de Versalles tiene 357 espejos que reflejan la luz como oro.', en: 'Versailles Hall of Mirrors contains 357 mirrors sparkling like gold.' },
    ],
    characters: ['curileta'],
  },
  {
    id: 'espana-regreso',
    name: { es: 'Regreso al Bosque Encantado', en: 'Return to the Enchanted Forest' },
    slug: 'espana-regreso',
    country: { es: 'España (Llegada)', en: 'Spain (Homecoming)' },
    theme: { es: 'La tortuga Lola, el mapa del corazón y el abrazo final con Pompón', en: 'Lola the tortoise, the heart map & final hug with Pompón' },
    climate: { es: 'Aroma a romero, pinos y azahar', en: 'Scent of rosemary, pines and orange blossom' },
    coordinates: { lat: 40.41, lng: -3.70 },
    passportStamp: { icon: 'Heart', code: 'ESP-HOME-99', color: '#F59E0B' },
    description: {
      es: 'El reencuentro más esperado: Curileta cruza los Pirineos y la entrada invisible para abrazar a Pompón bajo el árbol más alto.',
      en: 'The triumphant homecoming: Curileta crosses the invisible portal to embrace Pompón.',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Roca con forma de tortuga en el Bosque Encantado', en: 'Tortoise rock in the Enchanted Forest' },
    },
    curiosities: [
      { es: 'El verdadero tesoro al final de cualquier vuelta al mundo es el lugar al que llamas "hogar".', en: 'The greatest treasure at the journey’s end is the place you call home.' },
      { es: 'Curileta trajo azafrán para cocinar una paella deliciosa con Pompón.', en: 'Curileta brought golden saffron to cook a delicious paella with Pompón.' },
    ],
    characters: ['curileta', 'pompon', 'lola'],
  },
];

export const INITIAL_TRAIL_WAYPOINTS: TrailWaypoint[] = [
  {
    id: 'bosque-partida',
    stepNumber: 1,
    title: { es: 'Despedida en el Bosque', en: 'Farewell at the Forest' },
    subtitle: { es: 'El mundo no cabe en un solo árbol', en: 'The world cannot fit in a single tree' },
    stampCode: 'ESP-DEPART-01',
    coordinatesText: "Bosque Encantado (España)",
    badgeIcon: 'Tent',
    dateStamp: 'CAPÍTULO 01',
    note: {
      es: 'Curileta ajusta sus lentes, abraza a Pompón y promete escribirle cartas de cada rincón del mundo.',
      en: 'Curileta adjusts her lenses, hugs Pompón, and promises to write from every corner of Earth.',
    },
    color: '#10B981',
  },
  {
    id: 'mexico-estrellas',
    stepNumber: 2,
    title: { es: 'Pirámides & Quetzal', en: 'Pyramids & Quetzal' },
    subtitle: { es: 'México — El baile de los planetas', en: 'Mexico — Dance of the planets' },
    stampCode: 'MEX-TEO-02',
    coordinatesText: 'Teotihuacán • Lat 19.69°N',
    badgeIcon: 'Sun',
    dateStamp: 'CARTA 01',
    note: {
      es: 'Curileta prueba chocolate de los dioses y Quetzal le enseña que las pirámides hablan con el cielo.',
      en: 'Curileta tastes chocolate of the gods and Quetzal shows how stones talk to the cosmos.',
    },
    color: '#F59E0B',
  },
  {
    id: 'peru-nubes',
    stepNumber: 3,
    title: { es: 'Ciudad sobre las Nubes', en: 'City over the Clouds' },
    subtitle: { es: 'Perú — La lana tibia de Lulú', en: 'Peru — Warm wool of Lulú' },
    stampCode: 'PER-MAC-03',
    coordinatesText: 'Machu Picchu • Lat 13.16°S',
    badgeIcon: 'Mountain',
    dateStamp: 'CARTA 02',
    note: {
      es: 'La llama Lulú cobija a la lagartija del frío andino mientras contemplan piedras que bailan sin caer.',
      en: 'Lulú shelters the lizard from Andean cold while observing stones that dance without falling.',
    },
    color: '#10B981',
  },
  {
    id: 'travesia-galeon',
    stepNumber: 4,
    title: { es: 'El Galeón de los Sueños', en: 'Galleon of Dreams' },
    subtitle: { es: 'Océano Atlántico — Timonel por una noche', en: 'Atlantic Ocean — Helmsman for a night' },
    stampCode: 'ATL-STORM-04',
    coordinatesText: 'Mar Abierto • Tormenta',
    badgeIcon: 'Anchor',
    dateStamp: 'TRAVESÍA MARINA',
    note: {
      es: 'Olas como edificios azotan el barco. Curileta trepa al mástil y amarra el timón para salvar el viaje.',
      en: 'Waves tall as buildings rock the ship. Curileta climbs the mast and secures the helm.',
    },
    color: '#0284C7',
  },
  {
    id: 'egipto-sol',
    stepNumber: 5,
    title: { es: 'Arenas Doradas & El Nilo', en: 'Golden Sands & The Nile' },
    subtitle: { es: 'Egipto — La sombra es el tesoro', en: 'Egypt — Shade is true treasure' },
    stampCode: 'EGY-CAI-05',
    coordinatesText: 'Gizeh & Nilo • Lat 29.97°N',
    badgeIcon: 'Sun',
    dateStamp: 'CARTA 03',
    note: {
      es: 'El escarabajo Emi guía a Curileta por pasadizos secretos entre jeroglíficos y faraones.',
      en: 'Emi the beetle guides Curileta across secret pyramid passages of hieroglyphs.',
    },
    color: '#EAB308',
  },
  {
    id: 'islandia-fuego',
    stepNumber: 6,
    title: { es: 'Tierra de Hielo y Fuego', en: 'Land of Ice and Fire' },
    subtitle: { es: 'Islandia — Baño caliente en la nieve', en: 'Iceland — Hot bath in the snow' },
    stampCode: 'ISL-REK-06',
    coordinatesText: 'Laguna Azul • Lat 64.96°N',
    badgeIcon: 'Snowflake',
    dateStamp: 'CARTA 04',
    note: {
      es: 'Picu el frailecillo y Curileta comen pan horneado bajo la tierra mientras el cielo se enciende de auroras.',
      en: 'Picu and Curileta eat volcanic bread baked underground beneath glowing green auroras.',
    },
    color: '#38BDF8',
  },
  {
    id: 'japon-tren',
    stepNumber: 7,
    title: { es: 'Shinkansen & Zipi-Bot', en: 'Shinkansen & Zipi-Bot' },
    subtitle: { es: 'Japón — Volar en el tiempo', en: 'Japan — Flying through time' },
    stampCode: 'JPN-TOK-07',
    coordinatesText: 'Monte Fuji & Tokio • Lat 35.36°N',
    badgeIcon: 'Bot',
    dateStamp: 'CARTA 05',
    note: {
      es: 'Curileta ayuda al robot Zipi-Bot a encontrar a su dueño entre sandías cuadradas y cerezos en flor.',
      en: 'Curileta helps toy robot Zipi-Bot find his owner amid square watermelons and sakura blossoms.',
    },
    color: '#F43F5E',
  },
  {
    id: 'australia-salto',
    stepNumber: 8,
    title: { es: 'El Rescate de Joey', en: 'Rescuing Baby Joey' },
    subtitle: { es: 'Australia — Saltos de 4 metros en Uluru', en: 'Australia — 4m leaps at Uluru' },
    stampCode: 'AUS-ULU-08',
    coordinatesText: 'Uluru & Hyams • Lat 25.34°S',
    badgeIcon: 'Footprints',
    dateStamp: 'CARTA 06',
    note: {
      es: 'Curileta rescata el koala de trapo y Mamá Canguro la lleva volando sin alas por la arena más blanca del mundo.',
      en: 'Curileta rescues the baby toy and Mama Kangaroo gives her a ride across the whitest sand on Earth.',
    },
    color: '#EA580C',
  },
  {
    id: 'nzl-cueva',
    stepNumber: 9,
    title: { es: 'Cielos Bajo Tierra', en: 'Underground Constellations' },
    subtitle: { es: 'Nueva Zelanda — Kiki el Kiwi y Waitomo', en: 'New Zealand — Kiki & Waitomo' },
    stampCode: 'NZL-WAI-09',
    coordinatesText: 'Waitomo & Hobbiton • Lat 38.68°S',
    badgeIcon: 'Sparkles',
    dateStamp: 'CARTA 07',
    note: {
      es: 'Gusanitos que brillan como diamantes azules, casitas de Hobbit con puertas redondas y danza Haka.',
      en: 'Blue glowworm stars underground, round-doored Hobbit homes, and Maori Haka dance.',
    },
    color: '#059669',
  },
  {
    id: 'china-dragon',
    stepNumber: 10,
    title: { es: 'El Dragón de Piedra', en: 'The Stone Dragon' },
    subtitle: { es: 'China — Bao el Panda y el té sagrado', en: 'China — Panda Bao & sacred tea' },
    stampCode: 'CHN-BEI-10',
    coordinatesText: 'Gran Muralla • Lat 40.43°N',
    badgeIcon: 'Shield',
    dateStamp: 'CARTA 08',
    note: {
      es: 'Sobre la cabeza del oso Bao en la Gran Muralla, Curileta aprende el carácter que significa amistad.',
      en: 'Atop panda Bao’s head on the Great Wall, Curileta learns the character of friendship.',
    },
    color: '#DC2626',
  },
  {
    id: 'italia-pizza',
    stepNumber: 11,
    title: { es: 'Gino el Chef & Pisa', en: 'Gino the Chef & Pisa' },
    subtitle: { es: 'Italia — Gelato, pasta y góndolas', en: 'Italy — Gelato, pasta & gondolas' },
    stampCode: 'ITA-ROM-11',
    coordinatesText: 'Florencia & Venecia • Lat 41.90°N',
    badgeIcon: 'UtensilsCrossed',
    dateStamp: 'CARTA 09',
    note: {
      es: 'Gino y Curileta prueban 350 tipos de pasta, sujetan la Torre inclinada y comen gelato de pistacho.',
      en: 'Gino and Curileta taste pistachio gelato, support the leaning tower, and ride Venice gondolas.',
    },
    color: '#16A34A',
  },
  {
    id: 'francia-croissant',
    stepNumber: 12,
    title: { es: 'La Dama de Hierro', en: 'The Iron Lady' },
    subtitle: { es: 'Francia — Baguettes y la Mona Lisa', en: 'France — Baguettes & Mona Lisa' },
    stampCode: 'FRA-PAR-12',
    coordinatesText: 'Torre Eiffel • Lat 48.85°N',
    badgeIcon: 'Palette',
    dateStamp: 'CARTA 10',
    note: {
      es: 'Curileta escala la Torre Eiffel, prueba un croissant dorado con sabor a nubes y juega al escondite en el Louvre.',
      en: 'Curileta climbs the Eiffel Tower, tastes a golden cloud croissant, and plays hide-and-seek at the Louvre.',
    },
    color: '#2563EB',
  },
  {
    id: 'espana-abrazo',
    stepNumber: 13,
    title: { es: 'El Mapa del Corazón', en: 'The Map of the Heart' },
    subtitle: { es: 'España — Reencuentro con Pompón', en: 'Spain — Reunion with Pompón' },
    stampCode: 'ESP-HOME-99',
    coordinatesText: 'Bosque Encantado (Regreso)',
    badgeIcon: 'Heart',
    dateStamp: 'FINAL DEL VIAJE',
    note: {
      es: 'Guiada por la tortuga Lola, Curileta encuentra la entrada invisible. El mayor tesoro es el hogar.',
      en: 'Guided by tortoise Lola, Curileta finds the portal. The greatest treasure is home.',
    },
    color: '#F59E0B',
  },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'las-aventuras-de-curileta',
    author: 'Sweety Taless',
    title: {
      es: 'Las Aventuras de Curileta',
      en: 'The Adventures of Curileta',
    },
    slug: 'las-aventuras-de-curileta',
    subtitle: {
      es: 'La Vuelta al Mundo de una Pequeña Lagartija',
      en: 'The Round-the-World Journey of a Little Lizard',
    },
    coverImage: {
      url: '/images/books/las-aventuras-de-curileta/portada.webp',
      alt: {
        es: 'Portada publicada de Las Aventuras de Curileta, con Curileta, Pompón y sus amigos listos para viajar.',
        en: 'Published cover of The Adventures of Curileta, with Curileta, Pompón and their friends ready to travel.',
      },
    },
    description: {
      es: 'La historia oficial de una curiosa lagartija que viaja por México, Perú, Egipto, Islandia, Japón, Australia, Nueva Zelanda, China, Italia y Francia, enviando cartas y sellos a su amigo Pompón, hasta descubrir que el mayor tesoro es el hogar.',
      en: 'The official story of a curious little lizard who travels through Mexico, Peru, Egypt, Iceland, Japan, Australia, New Zealand, China, Italy, and France, sending letters and stamps to her friend Pompón, until discovering that the greatest treasure is home.',
    },
    publicationDate: '2026-05-19',
    isbn: ['9798196216145'],
    languages: ['Español'],
    ageRange: '5–12 años',
    pageCount: 80,
    publisher: 'Amazon Digital Services LLC - KDP',
    format: { es: 'Tapa blanda', en: 'Paperback · Spanish edition' },
    purchaseLinks: [{ storeName: 'Amazon', url: 'https://www.amazon.com/dp/B0H2CT8S14' }],
    badge: {
      es: 'Libro Oficial • Novedad 2026',
      en: 'Official Book • 2026 Novelty',
    },
    colorTheme: 'from-emerald-600 via-amber-600 to-teal-700',
    destinations: ['México', 'Perú', 'Egipto', 'Islandia', 'Japón', 'Australia', 'Nueva Zelanda', 'China', 'Italia', 'Francia', 'España'],
    characters: ['curileta', 'pompon', 'quetzal', 'lulu', 'emi', 'picu', 'zipi-bot', 'canguro-mama', 'canguro-bebe', 'joey', 'kiki', 'bao', 'gino', 'lola', 'pez-volador', 'ornitorrinco', 'emu', 'basset', 'cobaya'],
    locations: ['espana-inicio', 'mexico', 'peru', 'egipto', 'islandia', 'japon', 'australia', 'nueva-zelanda', 'china', 'italia', 'francia', 'espana-regreso'],
  },
  {
    id: 'curileta-y-el-misterio-marino',
    title: {
      es: 'Curileta y el Misterio Marino',
      en: 'Curileta and the Marine Mystery',
    },
    slug: 'curileta-y-el-misterio-marino',
    subtitle: {
      es: 'Volumen 2 — El Mar de Filipinas y las Marianas',
      en: 'Volume 2 — The Philippine Sea & the Marianas',
    },
    coverImage: {
      url: '/images/characters/pez-volador-main.webp',
      alt: { es: 'Ilustración del pez volador Glub', en: 'Illustration of the flying fish Glub' },
    },
    description: {
      es: 'Inspirado en la travesía en velero con el pez volador Glub y las aguas bioluminiscentes, una expedición a las profundidades más secretas de la Tierra.',
      en: 'Inspired by the sailboat crossing with flying fish Glub and bioluminescent waters, an expedition to the deepest secrets on Earth.',
    },
    publicationDate: '2026-11-01',
    languages: ['Español', 'English'],
    ageRange: '5–11 años',
    pageCount: 56,
    publisher: 'Curileta Publishing',
    badge: {
      es: 'Próxima Expedición',
      en: 'Next Expedition',
    },
    colorTheme: 'from-cyan-600 via-blue-600 to-indigo-800',
    destinations: ['Mar de Filipinas', 'Fosa de las Marianas', 'Arrecifes'],
    characters: ['curileta', 'pez-volador'],
    locations: ['mar-filipinas', 'marianas'],
  },
];

export const INITIAL_MENTIONED_CURIOSITIES: MentionedCuriosity[] = [
  {
    id: 'chichen-itza',
    name: { es: 'Chichén Itzá', en: 'Chichen Itza' },
    country: { es: 'México', en: 'Mexico' },
    curiosityFact: {
      es: 'Si aplaudes frente a la pirámide de Kukulcán, el eco suena exactamente como el canto del Quetzal.',
      en: 'Clapping in front of Kukulcan pyramid echoes precisely like the sacred Quetzal bird call.',
    },
    isMentionOnly: true,
  },
  {
    id: 'cusco',
    name: { es: 'Cusco (Qosqo)', en: 'Cusco (Qosqo)' },
    country: { es: 'Perú', en: 'Peru' },
    curiosityFact: {
      es: 'Llamada por los incas el “Qosqo” (el ombligo del mundo), porque creían que era el centro del universo.',
      en: 'Called “Qosqo” (the navel of the world) by the Incas, believed to be the center of the universe.',
    },
    isMentionOnly: true,
  },
  {
    id: 'lineas-nazca',
    name: { es: 'Líneas de Nazca', en: 'Nazca Lines' },
    country: { es: 'Perú', en: 'Peru' },
    curiosityFact: {
      es: 'Dibujos de animales tan gigantescos en el desierto que solo se pueden ver completos desde el aire.',
      en: 'Giant desert animal geoglyphs preserved for millennia, fully seen only from the sky.',
    },
    isMentionOnly: true,
  },
  {
    id: 'rio-nilo',
    name: { es: 'Río Nilo', en: 'Nile River' },
    country: { es: 'Egipto', en: 'Egypt' },
    curiosityFact: {
      es: 'El río fluye de sur a norte regando todo el país; sin su limo negro no crecería ni una flor en Egipto.',
      en: 'Flows South to North across the sands; without its black silt, not a single flower could bloom.',
    },
    isMentionOnly: true,
  },
  {
    id: 'fosa-marianas',
    name: { es: 'Fosa de las Marianas', en: 'Mariana Trench' },
    country: { es: 'Océano Pacífico Occidental', en: 'Western Pacific Ocean' },
    curiosityFact: {
      es: 'El lugar más profundo de todo el planeta, contado a Curileta por el pez volador Glub.',
      en: 'The deepest abyss on Earth, described to Curileta by Glub the flying fish.',
    },
    isMentionOnly: true,
  },
  {
    id: 'rotorua',
    name: { es: 'Rotorua', en: 'Rotorua' },
    country: { es: 'Nueva Zelanda', en: 'New Zealand' },
    curiosityFact: {
      es: 'Pozas de lodo caliente y lagunas de azufre que burbujean como ollas gigantes de sopa mágica.',
      en: 'Boiling mud pools and sulfur springs that bubble like giant geothermal cauldrons.',
    },
    isMentionOnly: true,
  },
  {
    id: 'segovia',
    name: { es: 'Castillos de Segovia', en: 'Castles of Segovia' },
    country: { es: 'España', en: 'Spain' },
    curiosityFact: {
      es: 'Fortalezas de piedra que parecen sacadas de los libros de cuentos de hadas y caballería.',
      en: 'Stone cliff fortresses resembling the fairy-tale castles of storybooks.',
    },
    isMentionOnly: true,
  },
];

export const INITIAL_NARRATIVE_MILESTONES: NarrativeMilestone[] = [
  {
    order: 1,
    place: { es: 'Bosque Encantado — Hogar de Curileta', en: 'Enchanted Forest — Curileta’s Home' },
    country: { es: 'España', en: 'Spain' },
    whatHappens: {
      es: 'Curileta y Pompón juegan explorando los árboles del bosque. Curileta siente el deseo de conocer el mundo, prepara su mochila, se despide de su mejor amigo y comienza su gran aventura.',
      en: 'Curileta and Pompón explore the forest trees. Curileta yearns to see the world, packs her gear, says goodbye, and embarks on her journey.',
    },
    charactersPresent: ['curileta', 'pompon'],
    coordinates: { lat: 40.4168, lng: -3.7038 },
  },
  {
    order: 2,
    place: { es: 'Teotihuacán — Pirámide del Sol', en: 'Teotihuacan — Pyramid of the Sun' },
    country: { es: 'México', en: 'Mexico' },
    whatHappens: {
      es: 'Curileta contempla la inmensa pirámide y comienza a subir sus escalones. En la cima conoce a Quetzal, quien le habla sobre los antiguos conocimientos de astronomía y la relación entre las pirámides y las estrellas.',
      en: 'Curileta climbs the sun pyramid and meets Quetzal, who reveals ancient astronomical knowledge and constellation alignments.',
    },
    charactersPresent: ['curileta', 'quetzal'],
    coordinates: { lat: 19.6925, lng: -98.8437 },
  },
  {
    order: 3,
    place: { es: 'Cuexcomate — Puebla', en: 'Cuexcomate — Puebla' },
    country: { es: 'México', en: 'Mexico' },
    whatHappens: {
      es: 'Curileta cuenta en su carta que ha escalado este pequeño volcán en un segundo. Es uno de los descubrimientos sorprendentes que comparte con Pompón.',
      en: 'Curileta scales this 13-meter volcano in a flash, sharing this wonder in her letter to Pompón.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 19.0414, lng: -98.2063 },
  },
  {
    order: 4,
    place: { es: 'Machu Picchu', en: 'Machu Picchu' },
    country: { es: 'Perú', en: 'Peru' },
    whatHappens: {
      es: 'Curileta llega a la ciudad inca entre montañas y nubes. Conoce a Lulú, una llama que la protege del frío con su lana y le permite contemplar desde su lomo la extraordinaria construcción de piedra.',
      en: 'Curileta reaches the Inca citadel in the clouds, sheltered by Lulú the llama while marveling at seamless stone architecture.',
    },
    charactersPresent: ['curileta', 'lulu'],
    coordinates: { lat: -13.1631, lng: -72.545 },
  },
  {
    order: 5,
    place: { es: 'Océano Atlántico — El Galeón de los Sueños', en: 'Atlantic Ocean — The Galleon of Dreams' },
    country: { es: 'Travesía marítima entre América y África', en: 'Ocean voyage between Americas and Africa' },
    whatHappens: {
      es: 'Curileta viaja escondida a bordo de un antiguo galeón. Una terrible tormenta amenaza el barco y la pequeña lagartija trepa por el mástil para sujetar una cuerda que golpea el timón, ayudando a salvar la embarcación.',
      en: 'Stowed away on an old wooden galleon, Curileta climbs the mast during a tempest to secure a loose helm rope, saving the ship.',
    },
    charactersPresent: ['curileta'],
    isTravesia: true,
    coordinates: { lat: 15.0, lng: -35.0 },
  },
  {
    order: 6,
    place: { es: 'Puerto de Alejandría', en: 'Port of Alexandria' },
    country: { es: 'Egipto', en: 'Egypt' },
    whatHappens: {
      es: 'Curileta desembarca después de su gran travesía oceánica y comienza su recorrido por Egipto, dirigiéndose hacia las famosas pirámides.',
      en: 'Curileta disembarks in Alexandria after the ocean crossing, setting off across Egypt toward the pyramids.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 31.2001, lng: 29.9187 },
  },
  {
    order: 7,
    place: { es: 'Pirámides de Giza', en: 'Pyramids of Giza' },
    country: { es: 'Egipto', en: 'Egypt' },
    whatHappens: {
      es: 'Curileta descubre las enormes construcciones del antiguo Egipto, soporta el intenso calor del desierto y conoce a Emi, un escarabajo pelotero que le enseña que la sombra es el verdadero tesoro.',
      en: 'Curileta explores the desert pyramids under blazing heat, learning from dung beetle Emi that shade is a true treasure.',
    },
    charactersPresent: ['curileta', 'emi'],
    coordinates: { lat: 29.9792, lng: 31.1342 },
  },
  {
    order: 8,
    place: { es: 'Interior de la Gran Pirámide de Giza', en: 'Inside the Great Pyramid of Giza' },
    country: { es: 'Egipto', en: 'Egypt' },
    whatHappens: {
      es: 'Emi guía a Curileta por misteriosos pasadizos. La pequeña exploradora descubre jeroglíficos y aprende que las construcciones antiguas guardan historias de faraones y dioses egipcios.',
      en: 'Emi leads Curileta through hidden passages, deciphering wall hieroglyphs of pharaohs and sacred deities.',
    },
    charactersPresent: ['curileta', 'emi'],
    coordinates: { lat: 29.9792, lng: 31.1342 },
  },
  {
    order: 9,
    place: { es: 'Campos de lava negra y géiseres', en: 'Black Lava Fields and Geysers' },
    country: { es: 'Islandia', en: 'Iceland' },
    whatHappens: {
      es: 'Curileta camina entre paisajes volcánicos helados cuando un géiser lanza inesperadamente una enorme columna de agua caliente. El contraste entre hielo y calor volcánico la deja fascinada.',
      en: 'Curileta walks black volcanic plains when a geyser suddenly erupts steaming water, mesmerizing her with fire-and-ice contrast.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 64.3104, lng: -20.3024 },
  },
  {
    order: 10,
    place: { es: 'Laguna Azul', en: 'Blue Lagoon' },
    country: { es: 'Islandia', en: 'Iceland' },
    whatHappens: {
      es: 'Curileta conoce a Picu, un simpático frailecillo. Hablan sobre sus aventuras y el calor que esconde la tierra islandesa. Curileta disfruta de un baño en el agua templada mientras caen copos de nieve sobre su sombrero.',
      en: 'Curileta meets puffin Picu, enjoying warm turquoise waters as snowflakes settle gently on her explorer hat.',
    },
    charactersPresent: ['curileta', 'picu'],
    coordinates: { lat: 63.8804, lng: -22.4495 },
  },
  {
    order: 11,
    place: { es: 'Cielo nocturno de Islandia — Auroras boreales', en: 'Icelandic Night Sky — Northern Lights' },
    country: { es: 'Islandia', en: 'Iceland' },
    whatHappens: {
      es: 'Curileta descubre las luces verdes y violetas que iluminan el cielo nocturno y comparte con Pompón la maravilla de las auroras boreales.',
      en: 'Curileta gazes upon dancing green and violet aurora curtains, recording the celestial magic for Pompón.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 64.9631, lng: -19.0208 },
  },
  {
    order: 12,
    place: { es: 'Tokio', en: 'Tokyo' },
    country: { es: 'Japón', en: 'Japan' },
    whatHappens: {
      es: 'Curileta llega a una inmensa ciudad llena de luces, pantallas y movimiento. Se sorprende al descubrir un lugar donde la tecnología y las tradiciones conviven de forma extraordinaria.',
      en: 'Curileta arrives in neon-lit Tokyo, amazed by the harmony between cutting-edge technology and ancient traditions.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 35.6762, lng: 139.6503 },
  },
  {
    order: 13,
    place: { es: 'Tren bala Shinkansen y campos de cerezos', en: 'Shinkansen Bullet Train and Sakura Groves' },
    country: { es: 'Japón', en: 'Japan' },
    whatHappens: {
      es: 'Curileta viaja en un tren de alta velocidad y contempla los paisajes de cerezos en flor. Conoce a Zipi-Bot, un pequeño robot perdido, y lo ayuda a reencontrarse con su dueño.',
      en: 'Riding the ultra-fast bullet train through blooming sakura, Curileta helps lost toy robot Zipi-Bot reunite with his owner.',
    },
    charactersPresent: ['curileta', 'zipi-bot'],
    coordinates: { lat: 35.0116, lng: 135.7681 },
  },
  {
    order: 14,
    place: { es: 'Monte Fuji — Vista de la montaña', en: 'Mount Fuji — Mountain Vista' },
    country: { es: 'Japón', en: 'Japan' },
    whatHappens: {
      es: 'Curileta contempla el famoso volcán japonés, cuya forma de cono perfecto le parece dibujada con un lápiz. Lo describe posteriormente en su carta a Pompón sin ascender a la cumbre.',
      en: 'Curileta gazes upon sacred Mount Fuji’s symmetrical snowcap from afar, admiring its hand-drawn appearance.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 35.3606, lng: 138.7274 },
  },
  {
    order: 15,
    place: { es: 'Mar de Filipinas', en: 'Philippine Sea' },
    country: { es: 'Travesía marítima por el Pacífico occidental', en: 'Pacific Ocean Sea Voyage' },
    whatHappens: {
      es: 'Curileta navega en un velero y descubre la bioluminiscencia nocturna. Un grupo de peces voladores salta cerca de la cubierta y conoce a Glub, quien le cuenta curiosidades de las profundidades oceánicas.',
      en: 'Sailing through glowing bioluminescent waters, flying fish leap aboard and Glub shares oceanic abyss tales.',
    },
    charactersPresent: ['curileta'],
    isTravesia: true,
    coordinates: { lat: 18.0, lng: 130.0 },
  },
  {
    order: 16,
    place: { es: 'Outback australiano', en: 'Australian Outback' },
    country: { es: 'Australia', en: 'Australia' },
    whatHappens: {
      es: 'Curileta llega a un paisaje de tierra roja, grandes rocas y horizontes infinitos. Conoce a una familia de canguros e inicia una pequeña misión para devolver el peluche perdido de una cría.',
      en: 'Stepping into red desert earth, Curileta sets out on a quest to return the baby kangaroo’s lost stuffed toy.',
    },
    charactersPresent: ['curileta', 'canguro-mama', 'canguro-bebe'],
    coordinates: { lat: -25.0, lng: 133.0 },
  },
  {
    order: 17,
    place: { es: 'Riachuelo del Outback', en: 'Outback Creek' },
    country: { es: 'Australia', en: 'Australia' },
    whatHappens: {
      es: 'Durante su búsqueda, Curileta cruza un riachuelo y casi pisa a un ornitorrinco. Poco después debe esquivar a un emú que intenta picotear su sombrero.',
      en: 'Crossing a bush creek, Curileta almost steps on a platypus and dodges a curious emu pecking at her hat.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: -25.2, lng: 132.8 },
  },
  {
    order: 18,
    place: { es: 'Uluru', en: 'Uluru' },
    country: { es: 'Australia', en: 'Australia' },
    whatHappens: {
      es: 'Curileta llega hasta la enorme formación rocosa roja y encuentra a la familia canguro. Devuelve el peluche llamado Joey al bebé y recibe como agradecimiento un emocionante paseo a grandes saltos.',
      en: 'Curileta reaches the giant monolith, returns the stuffed koala Joey, and is gifted a joyful 4-meter leaping ride.',
    },
    charactersPresent: ['curileta', 'canguro-mama', 'canguro-bebe', 'joey'],
    coordinates: { lat: -25.3444, lng: 131.0369 },
  },
  {
    order: 19,
    place: { es: 'Hyams Beach', en: 'Hyams Beach' },
    country: { es: 'Australia', en: 'Australia' },
    whatHappens: {
      es: 'La mamá canguro lleva a Curileta hasta una playa de arena extraordinariamente blanca. La exploradora disfruta del paisaje, se despide de sus nuevos amigos, descubre un huevo de emú y prepara su siguiente travesía.',
      en: 'Mama Kangaroo carries Curileta to the whitest sands on Earth, discovering a dark emu egg before setting sail.',
    },
    charactersPresent: ['curileta', 'canguro-mama', 'canguro-bebe', 'joey'],
    coordinates: { lat: -35.1423, lng: 150.6936 },
  },
  {
    order: 20,
    place: { es: 'Mar de Tasmania', en: 'Tasman Sea' },
    country: { es: 'Entre Australia y Nueva Zelanda', en: 'Between Australia and New Zealand' },
    whatHappens: {
      es: 'Curileta contempla el mar desde la costa australiana y utiliza un pequeño tronco como balsa para iniciar su recorrido hacia Nueva Zelanda.',
      en: 'Curileta uses a small eucalyptus log as a raft to cross the ocean towards New Zealand.',
    },
    charactersPresent: ['curileta'],
    isTravesia: true,
    coordinates: { lat: -37.0, lng: 160.0 },
  },
  {
    order: 21,
    place: { es: 'Bosques de la Isla Norte', en: 'North Island Forests' },
    country: { es: 'Nueva Zelanda', en: 'New Zealand' },
    whatHappens: {
      es: 'Curileta explora un bosque de árboles gigantes y helechos plateados. Durante la noche conoce a Kiki, un kiwi que le explica por qué estos pájaros no vuelan y cómo viven.',
      en: 'Walking among giant silver ferns, Curileta meets nocturnal kiwi Kiki and learns about his unique life.',
    },
    charactersPresent: ['curileta', 'kiki'],
    coordinates: { lat: -38.0, lng: 175.5 },
  },
  {
    order: 22,
    place: { es: 'Cuevas de Waitomo', en: 'Waitomo Caves' },
    country: { es: 'Nueva Zelanda', en: 'New Zealand' },
    whatHappens: {
      es: 'Kiki lleva a Curileta a una cueva misteriosa cuyo techo está iluminado por miles de pequeños organismos bioluminiscentes. Curileta siente que está contemplando un cielo lleno de estrellas bajo tierra.',
      en: 'Kiki guides Curileta into underground caverns illuminated by thousands of sapphire glowworms like night skies.',
    },
    charactersPresent: ['curileta', 'kiki'],
    coordinates: { lat: -38.261, lng: 175.103 },
  },
  {
    order: 23,
    place: { es: 'Aldea maorí', en: 'Maori Village' },
    country: { es: 'Nueva Zelanda', en: 'New Zealand' },
    whatHappens: {
      es: 'Curileta conoce parte de la cultura maorí y presencia una haka. Intenta imitar los movimientos de los bailarines con sus pequeñas patitas, provocando las carcajadas de Kiki.',
      en: 'Curileta observes the powerful Maori Haka dance and tries imitating the moves with her little paws, making Kiki laugh.',
    },
    charactersPresent: ['curileta', 'kiki'],
    coordinates: { lat: -38.138, lng: 176.249 },
  },
  {
    order: 24,
    place: { es: 'Hobbiton — El pueblo de las puertas redondas', en: 'Hobbiton — Town of Round Doors' },
    country: { es: 'Nueva Zelanda', en: 'New Zealand' },
    whatHappens: {
      es: 'Curileta descubre un pueblo de fantasía escondido entre colinas verdes, con casitas de puertas redondas, chimeneas, jardines y huertos. Explora sus rincones y encuentra una pequeña pluma dorada que decide regalar a Pompón.',
      en: 'Curileta wanders tiny hill-homes with colorful round doors, finding a golden feather souvenir for Pompón.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: -37.872, lng: 175.683 },
  },
  {
    order: 25,
    place: { es: 'Gran Muralla China', en: 'Great Wall of China' },
    country: { es: 'China', en: 'China' },
    whatHappens: {
      es: 'Curileta descubre una construcción que serpentea entre las montañas como un enorme dragón de piedra. Comienza a trepar sus interminables escalones y admira la grandeza del monumento.',
      en: 'Curileta climbs the winding Great Wall resembling a resting stone dragon spanning mountain ridges.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 40.4319, lng: 116.5704 },
  },
  {
    order: 26,
    place: { es: 'Bosque de bambú junto a la Gran Muralla', en: 'Bamboo Forest by the Great Wall' },
    country: { es: 'China', en: 'China' },
    whatHappens: {
      es: 'Curileta conoce a Bao, un panda gigante que está comiendo bambú. Ambos entablan amistad, hablan de la suerte y los dragones de la cultura china y buscan juntos un brote especialmente tierno.',
      en: 'Curileta meets hungry panda Bao among bamboo shoots, sharing lore on dragons, luck, and friendship.',
    },
    charactersPresent: ['curileta', 'bao'],
    coordinates: { lat: 40.435, lng: 116.565 },
  },
  {
    order: 27,
    place: { es: 'Torre de vigilancia de la Gran Muralla', en: 'Great Wall Watchtower' },
    country: { es: 'China', en: 'China' },
    whatHappens: {
      es: 'Bao lleva a Curileta sobre su cabeza hasta una de las torres más altas de la muralla. Juntos contemplan un maravilloso atardecer sobre las montañas.',
      en: 'Bao carries Curileta atop his head to the highest watchtower to watch the sunset paint the distant peaks.',
    },
    charactersPresent: ['curileta', 'bao'],
    coordinates: { lat: 40.438, lng: 116.572 },
  },
  {
    order: 28,
    place: { es: 'Roma', en: 'Rome' },
    country: { es: 'Italia', en: 'Italy' },
    whatHappens: {
      es: 'Curileta llega a la capital italiana y descubre sus estatuas, fuentes, columnas y monumentos históricos en el museo al aire libre más grande del mundo.',
      en: 'Curileta explores fountains, ancient columns, and historic statues across Rome.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 41.9028, lng: 12.4964 },
  },
  {
    order: 29,
    place: { es: 'Florencia — Restaurante y calles artísticas', en: 'Florence — Art Streets and Kitchen' },
    country: { es: 'Italia', en: 'Italy' },
    whatHappens: {
      es: 'Curileta conoce a Gino, un ratoncito cocinero con un pequeño gorro de chef. Juntos descubren la gastronomía italiana, observan cómo se prepara una pizza y Curileta intenta pintar utilizando su cola como pincel.',
      en: 'Curileta meets mouse chef Gino, watches flying pizza dough, and paints using her tail as an art brush.',
    },
    charactersPresent: ['curileta', 'gino'],
    coordinates: { lat: 43.7696, lng: 11.2558 },
  },
  {
    order: 30,
    place: { es: 'Torre de Pisa', en: 'Leaning Tower of Pisa' },
    country: { es: 'Italia', en: 'Italy' },
    whatHappens: {
      es: 'Curileta descubre la famosa torre inclinada y se fotografía intentando sujetarla con sus pequeñas patitas para evitar que parezca caerse.',
      en: 'Curileta poses playfully holding up the famous 4-meter tilted tower with her paws.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 43.7229, lng: 10.3966 },
  },
  {
    order: 31,
    place: { es: 'Venecia', en: 'Venice' },
    country: { es: 'Italia', en: 'Italy' },
    whatHappens: {
      es: 'Curileta descubre una ciudad donde los canales sustituyen a muchas calles y las góndolas recorren el agua sobre miles de postes de madera.',
      en: 'Curileta marvels at Venice’s water streets, wooden piles, and singing gondoliers.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 45.4408, lng: 12.3155 },
  },
  {
    order: 32,
    place: { es: 'Alpes franceses — Travesía en autocaravana', en: 'French Alps — Camper Van Ride' },
    country: { es: 'Francia', en: 'France' },
    whatHappens: {
      es: 'Curileta viaja escondida en una autocaravana con turistas y el perro Barnaby. El olor a queso Roquefort provoca un alboroto y Curileta se esconde dentro de una baguette hasta que una niña la descubre.',
      en: 'Stowed away in a camper van, cheese odor excites dog Barnaby and Curileta hides safely inside a baguette.',
    },
    charactersPresent: ['curileta'],
    isTravesia: true,
    coordinates: { lat: 45.8326, lng: 6.8652 },
  },
  {
    order: 33,
    place: { es: 'Torre Eiffel — París', en: 'Eiffel Tower — Paris' },
    country: { es: 'Francia', en: 'France' },
    whatHappens: {
      es: 'Curileta escala las estructuras metálicas de la famosa torre. Descubre que el hierro se dilata con el calor y contempla la impresionante vista de París.',
      en: 'Curileta scales the iron girders of Paris, discovering that warm summer heat causes the metal to expand.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 48.8584, lng: 2.2945 },
  },
  {
    order: 34,
    place: { es: 'Cafetería de la Torre Eiffel', en: 'Eiffel Tower Cafe' },
    country: { es: 'Francia', en: 'France' },
    whatHappens: {
      es: 'Curileta encuentra un delicioso croissant y lo prueba por primera vez. Después dibuja en una servilleta, disfrutando de las vistas de París y de su nueva experiencia gastronómica.',
      en: 'Curileta tastes her first buttery crescent croissant and sketches her thoughts on a cafe napkin.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 48.8584, lng: 2.2945 },
  },
  {
    order: 35,
    place: { es: 'Museo del Louvre — París', en: 'Louvre Museum — Paris' },
    country: { es: 'Francia', en: 'France' },
    whatHappens: {
      es: 'Curileta visita el museo, descubre su entrada con forma de pirámide de cristal y contempla la Mona Lisa, cuya misteriosa mirada parece seguirla mientras se mueve.',
      en: 'Curileta visits the glass pyramid and plays peekaboo with the enigmatic eyes of the Mona Lisa.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 48.8606, lng: 2.3376 },
  },
  {
    order: 36,
    place: { es: 'Palacio de Versalles', en: 'Palace of Versailles' },
    country: { es: 'Francia', en: 'France' },
    whatHappens: {
      es: 'Curileta conoce el extraordinario palacio y su famosa Galería de los Espejos. Imagina lo divertido que sería compartir ese lugar con muchos reflejos de Pompón.',
      en: 'Curileta explores the Hall of Mirrors with 357 gold reflections, imagining hundreds of jumping Pompons.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 48.8049, lng: 2.1204 },
  },
  {
    order: 37,
    place: { es: 'Pirineos', en: 'Pyrenees Mountains' },
    country: { es: 'España', en: 'Spain' },
    whatHappens: {
      es: 'Curileta comienza su viaje de regreso al Bosque Encantado, atravesando las montañas que separan Francia de España. Los aromas y paisajes familiares le anuncian que está cerca de casa.',
      en: 'Curileta crosses the misty Pyrenees mountain passes, greeted by the scent of rosemary and Iberian stone.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 42.6667, lng: 0.5 },
  },
  {
    order: 38,
    place: { es: 'Tierras de Castilla', en: 'Castilian Plains' },
    country: { es: 'España', en: 'Spain' },
    whatHappens: {
      es: 'Curileta atraviesa paisajes de tierra rojiza en su recorrido hacia el hogar, descubriendo nuevos rincones del país donde comenzó su aventura.',
      en: 'Curileta walks across red clay plains toward home, marveling at the land where her journey began.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 41.5, lng: -4.5 },
  },
  {
    order: 39,
    place: { es: 'Andalucía', en: 'Andalusia' },
    country: { es: 'España', en: 'Spain' },
    whatHappens: {
      es: 'Curileta escucha música flamenca, baila y conoce a Lola, una tortuga mora muy sabia que le da pistas para encontrar la entrada invisible de su Bosque Encantado.',
      en: 'Listening to flamenco rhythms, Curileta meets wise tortoise Lola, who reveals the secret portal key.',
    },
    charactersPresent: ['curileta', 'lola'],
    coordinates: { lat: 37.3891, lng: -5.9845 },
  },
  {
    order: 40,
    place: { es: 'Entrada invisible del Bosque Encantado', en: 'Invisible Forest Portal' },
    country: { es: 'España', en: 'Spain' },
    whatHappens: {
      es: 'Siguiendo las indicaciones de Lola, Curileta encuentra una piedra con forma de tortuga que reconoce de su infancia. Sigue un camino de flores especiales y cruza un arroyo cristalino hasta localizar la entrada de su hogar.',
      en: 'Following Lola’s clues, Curileta spots the familiar tortoise-shaped stone, crossing crystal brooks into her forest.',
    },
    charactersPresent: ['curileta'],
    coordinates: { lat: 40.5, lng: -3.8 },
  },
  {
    order: 41,
    place: { es: 'Bosque Encantado — El gran reencuentro', en: 'Enchanted Forest — The Grand Reunion' },
    country: { es: 'España', en: 'Spain' },
    whatHappens: {
      es: 'Curileta regresa al árbol donde comenzó su aventura y vuelve a encontrarse con Pompón. Le trae recuerdos, regalos y una última carta que decide leerle personalmente. Comprende que el mayor tesoro es la amistad y el hogar.',
      en: 'Curileta reunites under the tallest tree with Pompón, reading her final letter aloud: true treasure is home and friendship.',
    },
    charactersPresent: ['curileta', 'pompon'],
    coordinates: { lat: 40.4168, lng: -3.7038 },
  },
];

export const INITIAL_VIDEOS: Video[] = [];

export const INITIAL_WALLPAPERS: Wallpaper[] = [];

export const INITIAL_SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: 'halloween-2026',
    slug: 'especial-halloween-calabazas-encantadas',
    name: {
      es: 'Especial de Halloween: El Huerto de Calabazas Encantadas',
      en: 'Halloween Special: The Enchanted Pumpkin Patch',
    },
    tagline: {
      es: '¡Una noche mágica de luces, linternas y misterios amistosos en el Bosque!',
      en: 'A magical night of lanterns, friendly mysteries, and enchanted autumn fun!',
    },
    themeKey: 'halloween',
    active: true,
    startDate: '2026-10-01T00:00:00Z',
    endDate: '2026-11-05T23:59:59Z',
    bannerImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&auto=format&fit=crop&q=80',
    ambientDecorations: {
      glowColor: 'rgba(249, 115, 22, 0.45)',
      accentColor: '#f97316',
      floatingEmojis: ['🎃', '✨', '🦇', '🍂', '🕯️', '🌙', '🧙‍♀️', '🍬'],
    },
    specialChapter: {
      id: 'capitulo-halloween-01',
      title: {
        es: 'Capítulo Especial: La Noche de las Calabazas Brillantes',
        en: 'Special Episode: Night of the Glowing Pumpkins',
      },
      synopsis: {
        es: 'Curileta y Pompón encuentran un sendero de hojas doradas que conduce al claro oculto del Bosque. Allí, las calabazas sabias no asustan: ¡iluminan el camino de las luciérnagas y guardan adivinanzas ancestrales!',
        en: 'Curileta and Pompón follow a golden leaf trail to the hidden forest clearing, discovering wise pumpkins that light up the night for friendly fireflies.',
      },
      releaseDate: '2026-10-31',
      status: 'coming_soon',
      badgeText: {
        es: '🎃 PRÓXIMAMENTE • ESTRENO 31 DE OCTUBRE',
        en: '🎃 COMING SOON • PREMIERE OCTOBER 31',
      },
      thumbnail: '/images/characters/pompon-main.webp',
    },
    featuredWallpapers: [],
    activities: [
      {
        title: {
          es: 'Máscara Imprimible de Curileta Hechicera',
          en: 'Printable Curileta Sorceress Mask',
        },
        description: {
          es: 'Descarga en PDF de alta resolución, colorea y recorta tu máscara para la noche de Halloween.',
          en: 'High-res PDF download: color and cut your mask for Halloween night.',
        },
        icon: '🎭',
        status: 'coming_soon',
      },
      {
        title: {
          es: 'Receta Secreta: Galletas de Calabaza de Pompón',
          en: 'Secret Recipe: Pompón’s Pumpkin Cookies',
        },
        description: {
          es: 'Una receta deliciosa y segura para cocinar en familia con canela y calabaza asada.',
          en: 'A delicious, child-safe family recipe with roasted pumpkin and sweet cinnamon.',
        },
        icon: '🍪',
        status: 'coming_soon',
      },
    ],
  },
];

export const INITIAL_LETTERS: LetterItem[] = [
  {
    id: 'mexico',
    order: 1,
    country: { es: 'México', en: 'Mexico' },
    city: { es: 'Teotihuacán & CDMX', en: 'Teotihuacan & CDMX' },
    postmark: 'TEOTIHUACÁN • 19.69°N • CARTA 01',
    postageColor: '#f59e0b',
    envelopeColor: 'from-amber-950/90 to-yellow-950/80',
    greeting: {
      es: 'Querido Pompón:',
      en: 'Dear Pompón:',
    },
    body: {
      es: [
        '¡México es increíble! He probado algo llamado “chocolate”, que aquí inventaron hace mucho tiempo, ¡pero el de antes era picante!',
        'He subido a una pirámide tan alta que casi toco las nubes. Por cierto, aquí las lagartijas tenemos parientes que parecen dragones y se llaman Iguanas.',
        'Además, he aprendido cosas asombrosas: en Chichén Itzá, si aplaudes frente a la pirámide de Kukulcán, ¡el eco suena exactamente como el canto del Quetzal!',
        'Y en Puebla está el volcán Cuexcomate: ¡mide solo 13 metros y lo escalé en un segundo!',
      ],
      en: [
        'Mexico is incredible! I tasted something called “chocolate,” invented here long ago, but back then it was spicy!',
        'I climbed a pyramid so tall I nearly touched the clouds. Also, we lizards have dragon-like relatives here called Iguanas.',
        'Plus, at Chichén Itzá, clapping in front of Kukulcán pyramid echoes exactly like the sacred Quetzal song!',
        'And in Puebla lies the Cuexcomate volcano: only 13 meters tall, I climbed it in a flash!',
      ],
    },
    signOff: {
      es: 'P.D. Te envío algunas fotos que me he tomado para ti. ¡Te echo de menos! Con amor, Curileta.',
      en: 'P.S. Sending you photos I took for you. Miss you! With love, Curileta.',
    },
    photos: [
      {
        title: { es: 'Resina de Chicozapote', en: 'Chicozapote Tree Resin' },
        fact: { es: 'Los mayas y aztecas obtenían la resina para mascarla. ¡Así nació el chicle que conocemos!', en: 'Mayans and Aztecs chewed tree resin, giving birth to modern chewing gum!' },
        tag: 'ORIGEN DEL CHICLE',
      },
      {
        title: { es: 'mmm... Chocolate Picante', en: 'mmm... Spicy Chocolate' },
        fact: { es: 'El “alimento de los dioses” (Theobroma cacao) funcionaba como moneda de intercambio.', en: 'The “food of the gods” served as sacred currency among ancient Aztecs.' },
        tag: 'MONEDA ANCESTRAL',
      },
      {
        title: { es: 'Volcán Cuexcomate (13m)', en: 'Cuexcomate Volcano (13m)' },
        fact: { es: 'El volcán más diminuto del planeta, en medio de la ciudad con una escalera de caracol.', en: 'World’s tiniest volcano, right in the city with a spiral staircase to its crater.' },
        tag: 'VOLCÁN ENANO',
      },
    ],
  },
  {
    id: 'peru',
    order: 2,
    country: { es: 'Perú', en: 'Peru' },
    city: { es: 'Machu Picchu & Cusco', en: 'Machu Picchu & Cusco' },
    postmark: 'MACHU PICCHU • 2.430m • CARTA 02',
    postageColor: '#10b981',
    envelopeColor: 'from-emerald-950/90 to-teal-950/80',
    greeting: {
      es: '¡Hola de nuevo, Pompón!',
      en: 'Hello again, Pompón!',
    },
    body: {
      es: [
        'He llegado a un lugar tan alto que las nubes te pasan por las rodillas. Se llama Machu Picchu. He hecho una nueva amiga muy peluda que me ha prestado su lana para no tener frío: ¡la llama Lulú!',
        '¡Aquí las montañas tienen caras y las piedras cuentan historias! He descubierto que existen más de 3.000 tipos de patatas diferentes. ¡Imagínate una cena con tantas opciones!',
        'Las piedras incas encajan con tanta precisión que no cabe ni una tarjeta. Y cuando hay terremotos, ¡bailan y vuelven a su lugar exacto!',
        'Por cierto, ¡he visto a tus parientes! Los Cuyes (conejillos de indias) son famosísimos aquí en los Andes.',
      ],
      en: [
        'I reached a sanctuary so high clouds drift past your knees. It’s Machu Picchu! I made a woolly friend named Lulú the Llama.',
        'Mountains have faces and stones tell stories! Did you know there are over 3,000 potato varieties here?',
        'Inca masonry is so precise not even a card fits through. In earthquakes, the stones dance and settle right back!',
        'And I found your fluffy relatives! Cuyes (guinea pigs) are celebrated throughout the Andes.',
      ],
    },
    signOff: {
      es: 'Un abrazo saltarín, Curileta.',
      en: 'A bouncy leap of love, Curileta.',
    },
    photos: [
      {
        title: { es: '3.000 Tipos de Patatas', en: '3,000 Potato Varieties' },
        fact: { es: 'Moradas, amarillas, rayadas y doradas cultivadas en terrazas agrícolas verticales.', en: 'Purple, yellow, striped, and golden spuds grown across vertical mountain terraces.' },
        tag: 'BIODIVERSIDAD',
      },
      {
        title: { es: 'Líneas de Nazca', en: 'Mysterious Nazca Lines' },
        fact: { es: 'Dibujos gigantes de animales en el desierto conservados por la falta de viento.', en: 'Giant animal geoglyphs preserved for millennia in the rainless desert sand.' },
        tag: 'MISTERIO ANDINO',
      },
      {
        title: { es: 'Conejillos de Indias (Cuy)', en: 'Andean Guinea Pigs (Cuy)' },
        fact: { es: 'No vienen de la India, sino de los Andes. ¡Aparecen en cuadros y leyendas antiguas!', en: 'Native to the Andes, revered and painted across centuries of folklore.' },
        tag: 'PARIENTES DE POMPÓN',
      },
    ],
  },
  {
    id: 'egipto',
    order: 3,
    country: { es: 'Egipto', en: 'Egypt' },
    city: { es: 'Guiza & Río Nilo', en: 'Giza & Nile River' },
    postmark: 'GIZA • VALLE DEL NILO • CARTA 03',
    postageColor: '#eab308',
    envelopeColor: 'from-amber-950/90 to-orange-950/80',
    greeting: {
      es: '¡Mi querido Pompón!',
      en: 'My dearest Pompón!',
    },
    body: {
      es: [
        '¡No vas a creer lo que me pasó! Cruzando el océano en el viejo galeón, una tormenta gigante sacudió el barco. Con mis patitas pegajosas trepé al mástil y amarré una cuerda suelta. ¡Salvé el timón y el viaje!',
        'Ahora te escribo desde Egipto, donde el sol brilla como oro fundido. Estoy frente a la Gran Pirámide: ¡hecha con más de 2 millones de bloques que pesan más que un elefante!',
        'He conocido a un Escarabajo Pelotero llamado “Emi”. Me enseñó que el verdadero tesoro del desierto es la sombra, y me guió por pasadizos secretos llenos de jeroglíficos.',
        '¿Y sabes qué? ¡Los antiguos egipcios dormían con almohadas de madera o piedra para no estropear sus peinados!',
      ],
      en: [
        'You won’t believe what happened! Crossing the ocean, a monster tempest struck. With my sticky paws I climbed the mast and secured the helm!',
        'Now writing from Egypt, where the sun shines like molten gold. The Great Pyramid has over 2 million stone blocks heavier than elephants!',
        'Emi the Dung Beetle taught me that the true treasure of the sands is shade, guiding me through hieroglyphic corridors.',
        'And ancient Egyptians slept on wooden or stone headrests to preserve elaborate hairstyles!',
      ],
    },
    signOff: {
      es: '¡Te extraño mucho, Pompón! Muchos besitos de arena, Curileta.',
      en: 'Miss you dearly, Pompón! Sand kisses, Curileta.',
    },
    photos: [
      {
        title: { es: 'Río Nilo que Fluye al Revés', en: 'The South-to-North Nile' },
        fact: { es: 'Fluye de sur a norte regando todo el desierto. ¡Sin su limo negro no habría flores!', en: 'Flows south to north, giving life and black silt to bloom in the desert.' },
        tag: 'AGUA SAGRADA',
      },
      {
        title: { es: 'Almohadas de Piedra', en: 'Stone Headrest Pillows' },
        fact: { es: 'Talladas para dejar circular el aire fresco por el cuello bajo el sol de 80°C.', en: 'Carved to circulate cool air around the neck beneath blazing 80°C heat.' },
        tag: 'INVENTO EGIPCIO',
      },
      {
        title: { es: 'Escarabajo Pelotero Emi', en: 'Emi the Dung Beetle' },
        fact: { es: 'Símbolo del sol naciente Ra, empujando su esfera de vida con infinita paciencia.', en: 'Symbol of the rising sun Ra, rolling his sphere with tireless patience.' },
        tag: 'GUÍA DEL DESIERTO',
      },
    ],
  },
  {
    id: 'islandia',
    order: 4,
    country: { es: 'Islandia', en: 'Iceland' },
    city: { es: 'Laguna Azul & Géiseres', en: 'Blue Lagoon & Geysers' },
    postmark: 'REYKJAVÍK • 64.96°N • CARTA 04',
    postageColor: '#38bdf8',
    envelopeColor: 'from-sky-950/90 to-blue-950/80',
    greeting: {
      es: '¡Querido Pompón!',
      en: 'Dear Pompón!',
    },
    body: {
      es: [
        '¡Brrr! Te escribo esta carta con una patita mientras me caliento la otra. ¡He llegado a Islandia! Es como si un volcán y un cubito de hielo se hubieran hecho mejores amigos.',
        'Caminando por lava negra, ¡BOOM! Un géiser disparó agua hirviendo hacia el cielo. Menos mal que conocí a Picu el Frailecillo, que me invitó a un baño caliente en la Laguna Azul mientras caían copos de nieve.',
        'Por la noche, el cielo se llena de luces verdes y moradas que bailan solas: ¡las Auroras Boreales! Y aquí hornean el pan enterrándolo bajo la tierra cerca de las zonas volcánicas.',
        '¿Lo mejor? ¡No hay ni un solo mosquito en toda la isla! Aunque para mí hay menos snacks, ¡para explorar es genial!',
      ],
      en: [
        'Brrr! Writing with one paw while warming the other. Iceland is like a volcano and an ice cube becoming best friends!',
        'Suddenly BOOM! A geyser shot boiling water into the clouds. Picu the Puffin showed me the warm Blue Lagoon as snowflakes fell.',
        'At night, green and purple lights dance across the sky: Northern Lights! They even bake bread underground with volcano heat for 24h.',
        'And there isn’t a single mosquito on the entire island! Fewer snacks for a lizard, but wonderful for exploring!',
      ],
    },
    signOff: {
      es: 'Te mando un abrazo muy apretado para no perder el calor. Tu exploradora valiente, Curileta.',
      en: 'A tight warm hug against the frost. Your brave explorer, Curileta.',
    },
    photos: [
      {
        title: { es: 'Pan Volcánico Bajo Tierra', en: 'Underground Volcano Bread' },
        fact: { es: 'Masa horneada durante 24 horas con el calor natural de manantiales hirvientes.', en: 'Sweet rye bread baked slowly for 24 hours in boiling geothermal ground.' },
        tag: 'MAGIA VOLCÁNICA',
      },
      {
        title: { es: 'Auroras Boreales Danzantes', en: 'Dancing Auroras' },
        fact: { es: 'Partículas solares chocando contra la atmósfera terrestre en cortinas de seda verde.', en: 'Solar wind colliding with Earth’s atmosphere in glowing emerald curtains.' },
        tag: 'CIELO MÁGICO',
      },
      {
        title: { es: 'Géiseres con Hipo', en: 'Geysers of the Earth' },
        fact: { es: 'Ollas a presión naturales que disparan chorros de agua pura a más de 20 metros.', en: 'Natural subterranean pressure pots erupting 20-meter steaming geysers.' },
        tag: 'FUERZA PURA',
      },
    ],
  },
  {
    id: 'japon',
    order: 5,
    country: { es: 'Japón', en: 'Japan' },
    city: { es: 'Tokio & Monte Fuji', en: 'Tokyo & Mount Fuji' },
    postmark: 'TOKIO • SHINKANSEN • CARTA 05',
    postageColor: '#f43f5e',
    envelopeColor: 'from-rose-950/90 to-red-950/80',
    greeting: {
      es: '¡Hola, mi querido Pompón!',
      en: 'Hello, my dear Pompón!',
    },
    body: {
      es: [
        '¡Kon’nichiwa! ¡Japón es el lugar más loco y divertido que he visitado! Me subí al Shinkansen (tren bala) que vuela tan rápido que mi reflejo en el cristal se quedó atrás.',
        'Allí conocí a Zipi-Bot, un pequeño robot de juguete perdido al que ayudé a encontrar a su dueño. ¡Incluso canta canciones alegres!',
        'He visto sandías con forma de cubo para que quepan en la nevera, zapatillas exclusivas para entrar al baño, y cafeterías donde la gente va solo para acariciar búhos y gatos.',
        'Y he contemplado el Monte Fuji: un volcán sagrado tan perfecto que parece dibujado con un lápiz y coronado con un sombrero blanco de nieve.',
      ],
      en: [
        'Kon’nichiwa! Japan is thrilling! I rode the Shinkansen bullet train which flies so fast my reflection lagged behind.',
        'I helped Zipi-Bot, a lost toy robot, reunite with his owner. He even sings cheerful melodies!',
        'I saw cube-shaped watermelons, special bathroom-only slippers, and cafes dedicated to petting friendly owls and cats.',
        'And I gazed upon Mount Fuji: a sacred volcano so symmetrical it looks hand-drawn, topped with a crisp snowy hat.',
      ],
    },
    signOff: {
      es: 'Sayonara, de tu amiga Curileta.',
      en: 'Sayonara, from your friend Curileta.',
    },
    photos: [
      {
        title: { es: 'Sandías Cuadradas', en: 'Square Watermelons' },
        fact: { es: 'Cultivadas dentro de cajas de cristal para que no rueden y encajen en las baldas.', en: 'Grown inside glass molds so they don’t roll away in compact refrigerators.' },
        tag: 'INVENTO CURIOSO',
      },
      {
        title: { es: 'Monte Fuji Sagrado', en: 'Sacred Mount Fuji' },
        fact: { es: 'Son en realidad tres volcanes superpuestos, venerados como símbolo del amanecer.', en: 'Three volcanoes layered in one, revered as the spiritual symbol of sunrise.' },
        tag: 'VOLCÁN SAGRADO',
      },
      {
        title: { es: 'Zipi-Bot & Robots', en: 'Zipi-Bot & Companions' },
        fact: { es: 'En Japón la tecnología convive en perfecta armonía con los templos milenarios.', en: 'Ultra-modern robots live side by side with peaceful ancient wooden shrines.' },
        tag: 'FUTURO Y TRADICIÓN',
      },
    ],
  },
  {
    id: 'australia',
    order: 6,
    country: { es: 'Australia', en: 'Australia' },
    city: { es: 'Uluru & Hyams Beach', en: 'Uluru & Hyams Beach' },
    postmark: 'OUTBACK • ULURU • CARTA 06',
    postageColor: '#ea580c',
    envelopeColor: 'from-orange-950/90 to-amber-950/80',
    greeting: {
      es: '¡Mi queridísimo Pompón! G’day mate!',
      en: 'My dearest Pompón! G’day mate!',
    },
    body: {
      es: [
        '¡Aquí todo está al revés! He rescatado el peluche de un bebé canguro llamado Joey en pleno desierto rojo del Outback.',
        'En agradecimiento, ¡Mamá Canguro me llevó en su marsupio y dimos saltos de 4 metros en el aire! Sentí lo que es volar sin tener alas.',
        'He conocido al ornitorrinco: ¡tiene pico de pato, cola de castor, patas de nutria y pone huevos! Es el chiste más divertido de la naturaleza.',
        'Y en Hyams Beach caminé sobre la arena más blanca del planeta: es tan pura que chirría como azúcar bajo las patitas.',
      ],
      en: [
        'Everything is upside-down here! I rescued baby kangaroo Joey’s toy koala in the vast red Outback.',
        'In thanks, Mama Kangaroo gave me a ride in her pouch with 4-meter leaps! I felt what it’s like to fly without wings.',
        'I met the platypus: duck bill, beaver tail, otter feet, and lays eggs! Nature’s most charming puzzle.',
        'At Hyams Beach, I walked upon the whitest sand on Earth: so pure it squeaks like sugar beneath your paws.',
      ],
    },
    signOff: {
      es: 'Un salto gigante de amor, tu amiga Curileta.',
      en: 'A giant kangaroo leap of love, Curileta.',
    },
    photos: [
      {
        title: { es: 'Ornitorrinco Confuso', en: 'The Curious Platypus' },
        fact: { es: 'Mamífero que detecta la electricidad de otros seres acuáticos bajo el agua.', en: 'Egg-laying mammal that senses electrical impulses underwater with its bill.' },
        tag: 'PUZZLE VIVIENTE',
      },
      {
        title: { es: 'Roca Roja de Uluru', en: 'Uluru Sacred Rock' },
        fact: { es: 'Cambia de color del naranja amanecer al rojo escarlata ardiente en el ocaso.', en: 'Shifts shades from sunrise amber to fiery sunset crimson across the desert.' },
        tag: 'CORAZÓN ROJO',
      },
      {
        title: { es: 'Huevo de Emú Verde Oscuro', en: 'Dark Green Emu Egg' },
        fact: { es: 'Pesa como 12 huevos de gallina y parece una esmeralda tallada para camuflaje.', en: 'Weighs as much as 12 hen eggs, looking like carved emerald stone for ground camouflage.' },
        tag: 'COLOR MÁGICO',
      },
    ],
  },
  {
    id: 'nueva-zelanda',
    order: 7,
    country: { es: 'Nueva Zelanda', en: 'New Zealand' },
    city: { es: 'Waitomo & Hobbiton', en: 'Waitomo & Hobbiton' },
    postmark: 'WAITOMO • HOBBITON • CARTA 07',
    postageColor: '#059669',
    envelopeColor: 'from-emerald-950/90 to-green-950/80',
    greeting: {
      es: '¡Hola, mi querido Pompón!',
      en: 'Hello, my dear Pompón!',
    },
    body: {
      es: [
        '¡He llegado a Nueva Zelanda y me sentí en un cuento de hadas! Los bosques de helechos plateados brillan bajo la luz de la luna.',
        'Kiki el Kiwi me llevó a la cueva de Waitomo: bajo tierra, el techo estaba cubierto por miles de gusanitos luminosos que brillaban como constelaciones de zafiro.',
        'Luego descubrí Hobbiton: colinas de terciopelo con casitas diminutas de puertas redondas y chimeneas que huelen a pastel de moras. ¡Eran perfectas para mi tamaño!',
        'Y aprendí a bailar la Haka maorí sacando la lengua y golpeando el suelo con mis patitas.',
      ],
      en: [
        'New Zealand feels like a fairy tale! Silver fern forests gleam in the moonlight.',
        'Kiki the Kiwi showed me Waitomo cave: underground ceilings dotted with thousands of blue glowworms sparkling like sapphire galaxies.',
        'Then I discovered Hobbiton: velvet hills with tiny round-door houses smelling of blackberry pie. Perfectly sized for me!',
        'I even practiced the Maori Haka, stamping my lizard feet with strength.',
      ],
    },
    signOff: {
      es: 'Con mucho cariño y un “Kia ora” (¡hola!), tu amiga Curileta.',
      en: 'With warm hugs and a “Kia ora”, your friend Curileta.',
    },
    photos: [
      {
        title: { es: 'Cielos Bajo Tierra en Waitomo', en: 'Waitomo Glowworm Skies' },
        fact: { es: 'Gusanitos de luz que iluminan cuevas calizas como un cielo nocturno estrellado.', en: 'Bioluminescent glowworms turning limestone cave ceilings into starfields.' },
        tag: 'CONSTELACIÓN SUBTERRÁNEA',
      },
      {
        title: { es: 'Casitas con Puertas Redondas', en: 'Hobbit Round Doors' },
        fact: { es: 'Construidas dentro de las colinas verdes con huertos y chimeneas activas.', en: 'Dug right into lush green hills with working hearths and tiny flower gardens.' },
        tag: 'REINO DIMINUTO',
      },
      {
        title: { es: 'Helechos Plateados', en: 'Silver Ferns (Cyathea)' },
        fact: { es: 'El envés de sus hojas refleja la luz lunar y guiaba a los guerreros en la noche.', en: 'Silver leaf undersides reflect moonlight to guide travelers in deep forests.' },
        tag: 'GUÍA NATURAL',
      },
    ],
  },
  {
    id: 'china',
    order: 8,
    country: { es: 'China', en: 'China' },
    city: { es: 'Gran Muralla & Pekín', en: 'Great Wall & Beijing' },
    postmark: 'GRAN MURALLA • 21.000km • CARTA 08',
    postageColor: '#dc2626',
    envelopeColor: 'from-red-950/90 to-rose-950/80',
    greeting: {
      es: '¡Ni Hao, mi querido Pompón!',
      en: 'Ni Hao, my dear Pompón!',
    },
    body: {
      es: [
        '¡Estoy caminando sobre la espalda de un dragón de piedra! La Gran Muralla tiene más de 21.000 kilómetros subiendo y bajando montañas.',
        'En un bosquecillo de bambú conocí al panda Bao. ¡Come hasta 12 kilos de bambú al día! Me llevó sobre su cabeza hasta la torre más alta para contemplar la puesta de sol.',
        'Aquí no escriben con letras como las nuestras, sino con caracteres mágicos. ¡Bao me enseñó a dibujar el que significa Amistad!',
        'Y descubrí que aquí se inventaron los fuegos artificiales para espantar a los malos espíritus y llenar la noche de estrellas de colores.',
      ],
      en: [
        'I am strolling atop the spine of a stone dragon! The Great Wall spans over 21,000 kilometers across mountain ridges.',
        'In a bamboo grove I met panda Bao. He chomps up to 12 kg of bamboo daily! He carried me on his head to watch the sunset from the highest tower.',
        'Writing here uses meaningful characters instead of letters. Bao taught me to paint the symbol for Friendship!',
        'And fireworks were invented here to scatter bad spirits and light up festivals with color.',
      ],
    },
    signOff: {
      es: 'Con mucho amor y un abrazo de oso panda, tu amiga Curileta.',
      en: 'With lots of love and a warm panda hug, Curileta.',
    },
    photos: [
      {
        title: { es: 'El Dragón de Piedra', en: 'The Stone Dragon' },
        fact: { es: 'La Gran Muralla recorre desiertos, valles y cumbres como un dragón guardián.', en: 'Stretches across deserts and peaks, appearing from above like a resting dragon.' },
        tag: 'MURALLA INFINITA',
      },
      {
        title: { es: 'Carácter de la Amistad (友)', en: 'Character of Friendship' },
        fact: { es: 'Representa dos manos unidas ayudándose en el camino del explorador.', en: 'Signifies two hands clasped together walking the explorer’s road.' },
        tag: 'TRAZOS SAGRADOS',
      },
      {
        title: { es: 'Bebiendo Té con Bao', en: 'Sharing Tea with Bao' },
        fact: { es: 'Golpear dos dedos suavemente en la mesa es el código de gratitud silenciosa.', en: 'Tapping two fingers gently on the table says “thank you” without breaking tea silence.' },
        tag: 'ARTE DEL TÉ',
      },
    ],
  },
  {
    id: 'italia',
    order: 9,
    country: { es: 'Italia', en: 'Italy' },
    city: { es: 'Florencia, Pisa & Venecia', en: 'Florence, Pisa & Venice' },
    postmark: 'FLORENCIA • PISA • CARTA 09',
    postageColor: '#16a34a',
    envelopeColor: 'from-green-950/90 to-emerald-950/80',
    greeting: {
      es: '¡Ciao, mi querido Pompón!',
      en: 'Ciao, my dear Pompón!',
    },
    body: {
      es: [
        '¡He llegado al país con forma de bota! La comida aquí huele tan deliciosa que mi nariz no para de moverse.',
        'En Florencia conocí al ratoncito chef Gino. ¡Me enseñó que existen más de 350 formas de pasta diferentes!',
        'He probado el Gelato artesanal: el de pistacho era tan verde como yo y me sirvió de camuflaje. ¡Es mucho más cremoso que el helado común!',
        'Y me tomé una foto intentando sujetar la Torre de Pisa con mis patitas: lleva cientos de años inclinada 4 metros sobre suelo blando sin caerse.',
      ],
      en: [
        'I arrived in the boot-shaped country! The aroma of basil and warm crust fills every cobblestone street.',
        'In Florence I met mouse chef Gino, who showed me over 350 pasta shapes!',
        'I tasted pistachio gelato: as green as my lizard skin, perfect camouflage and silky smooth!',
        'I posed holding up the Leaning Tower of Pisa with my paws: tilted 4 meters for centuries on soft soil!',
      ],
    },
    signOff: {
      es: 'Con mucho “amore” y sabor a pizza, tu amiga Curileta.',
      en: 'With lots of “amore” and pizza smiles, Curileta.',
    },
    photos: [
      {
        title: { es: 'Gelato de Pistacho', en: 'Pistachio Gelato' },
        fact: { es: 'Servido con espátula plana y con menos aire para que su sabor sea seda pura.', en: 'Served with a flat paddle and denser texture for velvet richness.' },
        tag: 'EL MEJOR HELADO',
      },
      {
        title: { es: 'Torre Inclinada de Pisa', en: 'Leaning Tower of Pisa' },
        fact: { es: 'Inclinada por arcilla arenosa; la ingeniería moderna la aseguró para siempre.', en: 'Tilted on sandy silt; secured by modern engineers so it never falls.' },
        tag: 'EQUILIBRIO MÁGICO',
      },
      {
        title: { es: 'Canales de Venecia', en: 'Venice Floating City' },
        fact: { es: 'Una ciudad sin coches construida sobre miles de troncos de madera en el agua.', en: 'No cars, only singing gondoliers atop thousands of petrified wooden piles in water.' },
        tag: 'CIUDAD SOBRE AGUA',
      },
    ],
  },
  {
    id: 'francia',
    order: 10,
    country: { es: 'Francia', en: 'France' },
    city: { es: 'París & Versalles', en: 'Paris & Versailles' },
    postmark: 'PARÍS • TORRE EIFFEL • CARTA 10',
    postageColor: '#2563eb',
    envelopeColor: 'from-blue-950/90 to-indigo-950/80',
    greeting: {
      es: '¡Bonjour, mi querido Pompón!',
      en: 'Bonjour, my dear Pompón!',
    },
    body: {
      es: [
        '¡Casi llego a Francia convertida en sándwich! Me escondí dentro de una baguette para huir de un perrito curioso en los Alpes, ¡y la niña de la familia me regaló una fresa creyendo que era una lagartija de la suerte!',
        'En París escalé la Torre Eiffel por sus vigas de hierro. Cuando hace calor, el metal se expande y ¡la torre crece varios centímetros!',
        'Allí arriba probé mi primer croissant: crujiente como hojas secas y dorado como una luna creciente. ¡Sabe a nubes y alegría!',
        'En el Museo del Louvre jugué al escondite con la Mona Lisa: no importa a qué lado me mueva con mis patitas, ¡sus ojos siempre me siguen!',
      ],
      en: [
        'I nearly reached France as a sandwich! I hid inside a hollow baguette to escape a dog, and a girl gifted me a strawberry thinking I was a good-luck lizard!',
        'In Paris I climbed the Eiffel Tower. When summer warms the iron, thermal expansion makes it grow several centimeters taller!',
        'At the first tier I tasted a fresh croissant: flaky like autumn leaves and curved like a golden crescent moon.',
        'At the Louvre I played peekaboo with the Mona Lisa: no matter where I scurry, her mysterious eyes follow me!',
      ],
    },
    signOff: {
      es: 'Con muchos besitos con aroma a mantequilla, tu amiga Curileta.',
      en: 'With warm buttery kisses, your friend Curileta.',
    },
    photos: [
      {
        title: { es: 'La Dama de Hierro Creciente', en: 'The Growing Iron Lady' },
        fact: { es: 'Los estiramientos térmicos de sus vigas de hierro hacen variar su altura en verano.', en: 'Thermal expansion of its iron lattice makes the tower stretch taller in heat.' },
        tag: 'ESTIRAMIENTO MATINAL',
      },
      {
        title: { es: 'Croissant Luna Creciente', en: 'Golden Crescent Croissant' },
        fact: { es: 'Capas de masa hojaldrada con mantequilla que crujen al morder.', en: 'Laminated golden dough with butter that crackles crisply with each bite.' },
        tag: 'SABOR A NUBES',
      },
      {
        title: { es: 'Galería de los Espejos (Versalles)', en: 'Hall of Mirrors (Versailles)' },
        fact: { es: '357 espejos que multiplican la luz del sol en un salón de oro.', en: '357 mirrors reflecting gardens and chandeliers in a hall of pure gold.' },
        tag: 'PALACIO REAL',
      },
    ],
  },
  {
    id: 'espana-regreso',
    order: 11,
    country: { es: 'España', en: 'Spain' },
    city: { es: 'Bosque Encantado (Regreso)', en: 'Enchanted Forest (Home)' },
    postmark: 'BOSQUE ENCANTADO • CORAZÓN • CARTA 11',
    postageColor: '#f59e0b',
    envelopeColor: 'from-amber-950/90 to-emerald-950/80',
    greeting: {
      es: '¡Mi queridísimo Pompón!',
      en: 'My dearest Pompón!',
    },
    body: {
      es: [
        '¡He vuelto! Esta carta no la envié por correo: la llevé apretada en mi bolsillo para leértela yo misma bajo nuestro árbol.',
        'He cruzado tormentas, escalado pirámides y abrazado pandas, pero ningún tesoro del mundo se compara con tu amistad.',
        'La sabia tortuga Lola me enseñó que el Bosque Encantado no se busca con los pies, sino con el corazón: es invisible para quienes no tienen curiosidad, ¡por eso solo nosotros y nuestros amigos podemos vivir aquí!',
        'He traído un poquito de azafrán dorado para cocinar una paella de hormigas deliciosa y miles de recuerdos en mi mochila para ti.',
      ],
      en: [
        'I am back! This letter wasn’t mailed: I kept it safe in my pocket to read aloud to you under our tallest tree.',
        'I weathered storms, climbed pyramids, and hugged pandas, but no treasure in the world equals our friendship.',
        'Wise tortoise Lola showed me the Enchanted Forest is found not with paws, but with the heart: invisible to those without curiosity!',
        'I brought golden saffron for an ant paella feast and a backpack brimming with treasures for you.',
      ],
    },
    signOff: {
      es: 'Y así comprendí que el mayor tesoro siempre te espera al final del camino: el lugar al que llamas “hogar”. Con todo mi amor, Curileta.',
      en: 'And thus I discovered the greatest treasure of all awaits at the end of the road: the place you call “home”. With all my love, Curileta.',
    },
    photos: [
      {
        title: { es: 'La Entrada Invisible', en: 'The Invisible Portal' },
        fact: { es: 'La piedra con forma de tortuga donde el azahar del sur se funde con los pinos del norte.', en: 'The tortoise-shaped rock where southern orange blossoms blend with northern pines.' },
        tag: 'MAPA DEL CORAZÓN',
      },
      {
        title: { es: 'Castillos de Segovia', en: 'Castles of Segovia' },
        fact: { es: 'Fortalezas de cuento de hadas que inspiraron los relatos de caballería.', en: 'Fairy-tale cliffside stone fortresses inspiring legends of adventure.' },
        tag: 'TIERRA DE HISTORIAS',
      },
      {
        title: { es: 'El Reencuentro Bajo el Árbol', en: 'Reunion Beneath the Tree' },
        fact: { es: 'El abrazo más cálido tras recorrer los cinco continentes.', en: 'The warmest hug after voyaging across five continents of wonders.' },
        tag: 'EL MAYOR TESORO',
      },
    ],
  },
];

export const INITIAL_ROADMAP: UniverseRoadmapItem[] = [
  {
    id: 'libros',
    title: { es: 'Nuevos Libros', en: 'New Books' },
    desc: {
      es: 'La próxima expedición está en preparación; publicaremos los detalles cuando estén confirmados.',
      en: 'The next expedition is in preparation; publication details will appear here when confirmed.',
    },
    iconName: 'Book',
    badge: { es: 'Editorial', en: 'Publishing' },
    orderIndex: 1,
  },
  {
    id: 'musica',
    title: { es: 'Música & Canciones', en: 'Music & Songs' },
    desc: {
      es: 'Aquí aparecerán las canciones cuando haya lanzamientos publicados con enlaces para escucharlas.',
      en: 'Songs will appear here when releases are published with links to listen.',
    },
    iconName: 'Music',
    badge: { es: 'Audio', en: 'Audio' },
    orderIndex: 2,
  },
  {
    id: 'eventos',
    title: { es: 'Eventos & Lecturas', en: 'Events & Readings' },
    desc: {
      es: 'Las lecturas y los encuentros públicos se anunciarán cuando tengan fecha confirmada.',
      en: 'Readings and public events will be listed when their dates are confirmed.',
    },
    iconName: 'Calendar',
    badge: { es: 'Comunidad', en: 'Community' },
    orderIndex: 3,
  },
  {
    id: 'merchandising',
    title: { es: 'Merchandising Oficial', en: 'Official Merch' },
    desc: {
      es: 'Estamos explorando materiales para la aventura. Aún no hay un catálogo disponible.',
      en: 'We are exploring ideas for the adventure. There is no catalogue available yet.',
    },
    iconName: 'ShoppingBag',
    badge: { es: 'Próximamente', en: 'Coming Soon' },
    orderIndex: 4,
  },
];

export const INITIAL_COLLABORATIONS: CollaborationOpportunity[] = [
  {
    id: 'publishing',
    title: { es: 'Editoriales & Distribución', en: 'Publishing & Distribution' },
    desc: {
      es: 'Derechos internacionales de publicación, coedición y traducción en nuevos mercados.',
      en: 'International publishing rights, co-editions, and translations in global markets.',
    },
    category: 'publishing',
    iconName: 'Building2',
    orderIndex: 1,
  },
  {
    id: 'licensing',
    title: { es: 'Licensing & Merchandising', en: 'Licensing & Merchandising' },
    desc: {
      es: 'Líneas oficiales de juguetes, papelería, moda y experiencias inmersivas de marca.',
      en: 'Official lines of toys, stationery, fashion, and immersive brand experiences.',
    },
    category: 'licensing',
    iconName: 'Award',
    orderIndex: 2,
  },
  {
    id: 'media',
    title: { es: 'Medios, Prensa & Festivales', en: 'Media, Press & Festivals' },
    desc: {
      es: 'Atendemos solicitudes de información, permisos de imagen y entrevistas según disponibilidad.',
      en: 'We review requests for information, image permissions, and interviews as available.',
    },
    category: 'press',
    iconName: 'Newspaper',
    orderIndex: 3,
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'Las Aventuras de Curileta',
  youtubeChannelUrl: 'https://www.youtube.com/@curileta',
  youtubeChannelTitle: { es: 'Canal oficial de Curileta', en: 'Curileta official channel' },
  youtubeChannelDescription: {
    es: 'Aventuras, canciones y vídeos cortos para descubrir el mundo en familia.',
    en: 'Adventures, songs and short videos to explore the world as a family.',
  },
  youtubeChannelTags: ['Aventuras', 'Familia', 'Música'],
  heroTagline: {
    es: 'Un viaje continuo de empatía y curiosidad por el mundo',
    en: 'A continuous journey of empathy and curiosity across the world',
  },
  heroSubtitle: {
    es: 'Sigue el mapa de Curileta: descubre nuevos lugares y las cartas que envía a Pompón desde el camino.',
    en: 'Follow Curileta’s map, discover new places, and read the letters she sends to Pompón along the way.',
  },
  totalCountriesCount: 11,
  totalCharactersCount: 19,
  totalBooksCount: 1,
  featuredQuote: {
    es: '«El mayor tesoro siempre es el camino recorrido y los amigos que encuentras en él.»',
    en: '«The greatest treasure is always the journey made and the friends you meet along the way.»',
  },
  statsBadges: [
    {
      icon: 'Globe2',
      label: { es: 'Países Explorados', en: 'Countries Explored' },
      value: '11',
    },
    {
      icon: 'Users',
      label: { es: 'Amigos & Personajes', en: 'Friends & Characters' },
      value: '19',
    },
    {
      icon: 'BookOpen',
      label: { es: 'Volúmenes Publicados', en: 'Published Volumes' },
      value: '1',
    },
    {
      icon: 'Mail',
      label: { es: 'Cartas a Pompón', en: 'Letters to Pompón' },
      value: '11',
    },
  ],
  homepageSections: [
    'hero', 'seasonalEvent', 'story', 'globe', 'radar', 'letters', 'characters',
    'books', 'videos', 'wallpapers', 'roadmap', 'collaborations', 'closing',
  ].map((key, order) => ({ key, visible: true, order })) as SiteSettings['homepageSections'],
};

export class LocalCMSProvider implements CMSProvider {
  async getCharacters(locale?: string): Promise<Character[]> {
    return INITIAL_CHARACTERS;
  }

  async getCharacterBySlug(slug: string, locale?: string): Promise<Character | null> {
    if (slug === 'joey-canguro') {
      return INITIAL_CHARACTERS.find((c) => c.slug === 'joey') || null;
    }
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
    return INITIAL_VIDEOS;
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

  async getNarrativeMilestones(locale?: string): Promise<NarrativeMilestone[]> {
    return INITIAL_NARRATIVE_MILESTONES;
  }

  async getMentionedCuriosities(locale?: string): Promise<MentionedCuriosity[]> {
    return INITIAL_MENTIONED_CURIOSITIES;
  }

  async getWallpapers(locale?: string): Promise<Wallpaper[]> {
    return INITIAL_WALLPAPERS;
  }

  async getActiveEvent(locale?: string, referenceDate: Date = new Date()): Promise<SeasonalEvent | null> {
    return INITIAL_SEASONAL_EVENTS.find((e) => isSeasonalEventActive(e, referenceDate)) || null;
  }

  async getSeasonalEvents(locale?: string): Promise<SeasonalEvent[]> {
    return INITIAL_SEASONAL_EVENTS;
  }

  async getLetters(locale?: string): Promise<LetterItem[]> {
    return INITIAL_LETTERS;
  }

  async getLetterById(id: string, locale?: string): Promise<LetterItem | null> {
    return INITIAL_LETTERS.find((l) => l.id === id) || null;
  }

  async getUniverseRoadmap(locale?: string): Promise<UniverseRoadmapItem[]> {
    return INITIAL_ROADMAP;
  }

  async getCollaborations(locale?: string): Promise<CollaborationOpportunity[]> {
    return INITIAL_COLLABORATIONS;
  }

  async getSiteSettings(locale?: string): Promise<SiteSettings> {
    return INITIAL_SETTINGS;
  }
}

/**
 * Determina si un evento estacional está activo en una fecha dada.
 * Comprueba el rango exacto de fechas y su ventana anual, incluidos eventos
 * que cruzan el cambio de año (por ejemplo, del 1 de diciembre al 6 de enero).
 * Permite además override por variable de entorno NEXT_PUBLIC_SEASONAL_OVERRIDE.
 */
export function isSeasonalEventActive(event: SeasonalEvent, now: Date = new Date()): boolean {
  if (!event.active) return false;

  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SEASONAL_OVERRIDE === 'none') {
    return false;
  }
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SEASONAL_OVERRIDE === event.themeKey) {
    return true;
  }

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  // Comprobación de rango exacto
  if (now >= start && now <= end) {
    return true;
  }

  // Comprobación de ventana estacional por mes y día para soporte anual.
  const currentYear = now.getUTCFullYear();
  const startMonth = start.getUTCMonth();
  const startDay = start.getUTCDate();
  const endMonth = end.getUTCMonth();
  const endDay = end.getUTCDate();
  const crossesYear = endMonth < startMonth || (endMonth === startMonth && endDay < startDay);

  const isInsideAnnualWindow = (windowStartYear: number) => {
    const windowStart = new Date(Date.UTC(windowStartYear, startMonth, startDay, 0, 0, 0));
    const windowEnd = new Date(Date.UTC(windowStartYear + (crossesYear ? 1 : 0), endMonth, endDay, 23, 59, 59));
    return now >= windowStart && now <= windowEnd;
  };

  return isInsideAnnualWindow(currentYear) || (crossesYear && isInsideAnnualWindow(currentYear - 1));
}

export const localCmsProvider = new LocalCMSProvider();
export const cmsProvider = localCmsProvider;

