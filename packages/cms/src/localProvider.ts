import { CMSProvider } from './CMSProvider';
import {
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
} from './models';

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
    personality: ['Glotón', 'Sereno', 'Bondadoso', 'Rilax'],
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
      es: 'Guardián del desierto rojo australiano. Lleva a su cría en la bolsa y regala a Curileta saltos de 4 metros.',
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
      url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=800&auto=format&fit=crop&q=80',
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
    badgeIcon: 'Compass',
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
    badgeIcon: 'Navigation',
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
    badgeIcon: 'Sparkles',
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
    badgeIcon: 'Award',
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
    badgeIcon: 'Award',
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
    badgeIcon: 'Award',
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
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Portada oficial de Las Aventuras de Curileta', en: 'Official cover of The Adventures of Curileta' },
    },
    description: {
      es: 'La historia de una pequeña y muy curiosa lagartija que viaja por México, Perú, Egipto, Islandia, Japón, Australia, Nueva Zelanda, China, Italia y Francia, escribiendo cartas a su amigo el conejito Pompón, hasta descubrir que el mayor tesoro del mundo siempre es el hogar.',
      en: 'The story of a curious little lizard who travels the globe writing letters to her bunny friend Pompón, discovering that the greatest treasure is home.',
    },
    publicationDate: '2026-05-01',
    isbn: ['978-84-123456-0-1'],
    languages: ['Español', 'English'],
    ageRange: '4–10 años',
    pageCount: 64,
    publisher: 'Curileta Publishing',
    purchaseLinks: [
      { storeName: 'Preventa Exclusiva', url: 'https://curileta.com' },
      { storeName: 'Casa del Libro', url: 'https://www.casadellibro.com' },
      { storeName: 'Amazon Libros', url: 'https://www.amazon.es' },
    ],
    characters: ['curileta', 'pompon', 'quetzal', 'lulu', 'emi', 'picu', 'zipi-bot', 'canguro-mama', 'canguro-bebe', 'joey', 'kiki', 'bao', 'gino', 'lola', 'pez-volador', 'ornitorrinco', 'emu', 'basset', 'cobaya'],
    locations: ['espana-inicio', 'mexico', 'peru', 'egipto', 'islandia', 'japon', 'australia', 'nueva-zelanda', 'china', 'italia', 'francia', 'espana-regreso'],
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
    charactersPresent: ['curileta', 'joey-canguro'],
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
    charactersPresent: ['curileta', 'joey-canguro'],
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
    charactersPresent: ['curileta', 'joey-canguro'],
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

export const INITIAL_VIDEOS: Video[] = [
  // --- CAPÍTULOS DE LA SERIE ANIMADA ---
  {
    id: 'capitulo-01',
    title: {
      es: 'Capítulo 1: El Secreto del Árbol Más Alto',
      en: 'Episode 1: The Secret of the Tallest Tree',
    },
    slug: 'capitulo-01-arbol-mas-alto',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80',
    type: 'episode',
    episodeNumber: 1,
    duration: '09:24',
    publishedAt: '2026-09-01',
    highlightTag: { es: 'Estreno Serie', en: 'Series Premiere' },
    description: {
      es: 'Curileta y Pompón descubren un antiguo mapa entre las ramas más altas del Bosque Encantado. La lagartija prepara su mochila y promete escribirle a su amigo en cada destino.',
      en: 'Curileta and Pompón discover an ancient map atop the highest tree of the Enchanted Forest.',
    },
  },
  {
    id: 'capitulo-02',
    title: {
      es: 'Capítulo 2: Las Estrellas de Teotihuacán',
      en: 'Episode 2: The Stars of Teotihuacan',
    },
    slug: 'capitulo-02-piramide-del-sol',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&auto=format&fit=crop&q=80',
    type: 'episode',
    episodeNumber: 2,
    duration: '10:15',
    publishedAt: '2026-09-08',
    highlightTag: { es: 'México Ancestral', en: 'Ancient Mexico' },
    description: {
      es: 'Curileta sube los escalones de la Pirámide del Sol y conoce a Quetzal, quien le enseña a escuchar el baile de los planetas y el eco misterioso de Chichén Itzá.',
      en: 'Curileta climbs the Sun Pyramid and meets Quetzal, who teaches her how the ancient stones converse with the stars.',
    },
  },
  {
    id: 'capitulo-03',
    title: {
      es: 'Capítulo 3: Entre Nubes en Machu Picchu',
      en: 'Episode 3: Among Clouds in Machu Picchu',
    },
    slug: 'capitulo-03-machu-picchu',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80',
    type: 'episode',
    episodeNumber: 3,
    duration: '08:50',
    publishedAt: '2026-09-15',
    highlightTag: { es: 'Cumbres Andinas', en: 'Andean Peaks' },
    description: {
      es: 'En las alturas de los Andes, la llama Lulú cobija a Curileta con su lana tibia y le muestra la impresionante ciudadela inca construida sin argamasa.',
      en: 'High in the Andes, Lulú the llama shelters Curileta in her warm fleece and reveals the marvelous stone city.',
    },
  },
  {
    id: 'capitulo-04',
    title: {
      es: 'Capítulo 4: La Furia del Galeón de los Sueños',
      en: 'Episode 4: Fury of the Dream Galleon',
    },
    slug: 'capitulo-04-galeon-de-los-suenos',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
    type: 'episode',
    episodeNumber: 4,
    duration: '11:02',
    publishedAt: '2026-09-22',
    highlightTag: { es: 'Travesía Oceánica', en: 'Ocean Crossing' },
    description: {
      es: 'Viajando de polizón en un antiguo galeón por el Atlántico, una fuerte tormenta amenaza el timón. Curileta trepa al mástil para amarrar la soga salvadora.',
      en: 'Stowing away aboard an ancient galleon across the Atlantic, Curileta climbs the mast to save the ship rudder during a storm.',
    },
  },
  {
    id: 'capitulo-05',
    title: {
      es: 'Capítulo 5: El Escarabajo Sabio de Giza',
      en: 'Episode 5: The Wise Beetle of Giza',
    },
    slug: 'capitulo-05-piramides-de-giza',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&auto=format&fit=crop&q=80',
    type: 'episode',
    episodeNumber: 5,
    duration: '09:40',
    publishedAt: '2026-09-29',
    highlightTag: { es: 'Egipto y Pirámides', en: 'Egypt & Pyramids' },
    description: {
      es: 'Bajo el sol ardiente de Egipto, Emi el escarabajo pelotero enseña a Curileta que la sombra es el mayor tesoro y la guía por los jeroglíficos secretos.',
      en: 'Under Egypt’s blazing sun, Emi the dung beetle teaches Curileta that shade is the greatest treasure.',
    },
  },
  {
    id: 'capitulo-06',
    title: {
      es: 'Capítulo 6: Fuego y Hielo en la Laguna Azul',
      en: 'Episode 6: Fire and Ice at the Blue Lagoon',
    },
    slug: 'capitulo-06-islandia-laguna-azul',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&auto=format&fit=crop&q=80',
    type: 'episode',
    episodeNumber: 6,
    duration: '10:05',
    publishedAt: '2026-10-06',
    highlightTag: { es: 'Aguas Termales & Auroras', en: 'Hot Springs & Auroras' },
    description: {
      es: 'Curileta nada en aguas calientes mientras caen copos de nieve con Picu el frailecillo, y contempla maravillada el cielo verde de las auroras boreales.',
      en: 'Curileta swims in geothermal waters with Picu the puffin under falling snow and dances under northern lights.',
    },
  },
  {
    id: 'capitulo-07',
    title: {
      es: 'Capítulo 7: Luces de Tokio y el Amigo Robot',
      en: 'Episode 7: Tokyo Lights and the Robot Friend',
    },
    slug: 'capitulo-07-tokio-zipi-bot',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    type: 'episode',
    episodeNumber: 7,
    duration: '09:35',
    publishedAt: '2026-10-13',
    highlightTag: { es: 'Tecnología & Tradición', en: 'Future & Tradition' },
    description: {
      es: 'A bordo del tren bala Shinkansen entre cerezos en flor, Curileta rescata al pequeño Zipi-Bot y lo ayuda a reunirse con su dueño en el corazón de Tokio.',
      en: 'Aboard the bullet train through cherry blossoms, Curileta helps lost Zipi-Bot reunite with his owner.',
    },
  },
  {
    id: 'capitulo-08',
    title: {
      es: 'Capítulo 8: Misión Joey en la Gran Roca Roja',
      en: 'Episode 8: Mission Joey at the Great Red Rock',
    },
    slug: 'capitulo-08-australia-uluru',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=80',
    type: 'episode',
    episodeNumber: 8,
    duration: '10:48',
    publishedAt: '2026-10-20',
    highlightTag: { es: 'Aventura en el Outback', en: 'Outback Expedition' },
    description: {
      es: 'Curileta corre por el desierto australiano para devolver el koala de peluche Joey al bebé canguro, y recibe paseos a saltos de 4 metros con Mamá Canguro.',
      en: 'Curileta sprints across the red sands to reunite baby kangaroo with Joey the plush koala.',
    },
  },

  // --- VÍDEOS MUSICALES / CANCIONES OFICIALES ---
  {
    id: 'musical-01',
    title: {
      es: 'Videoclip Oficial: «El Baile del Mapa»',
      en: 'Official Music Video: “The Map Dance”',
    },
    slug: 'cancion-el-baile-del-mapa',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    type: 'song',
    duration: '03:15',
    publishedAt: '2026-09-05',
    highlightTag: { es: 'Coreografía Oficial', en: 'Official Coreography' },
    description: {
      es: '¡Aprende los puntos cardinales y los preparativos de la mochila con Curileta y Pompón al ritmo más pegadizo del Bosque Encantado!',
      en: 'Learn the cardinal points and backpack prep with Curileta and Pompón to the catchiest beat!',
    },
  },
  {
    id: 'musical-02',
    title: {
      es: 'Videoclip: «Cartas en el Viento (Canción de la Amistad)»',
      en: 'Music Video: “Letters in the Wind (Song of Friendship)”',
    },
    slug: 'cancion-cartas-en-el-viento',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    type: 'song',
    duration: '03:42',
    publishedAt: '2026-09-18',
    highlightTag: { es: 'Balada Tendedero', en: 'Friendship Ballad' },
    description: {
      es: 'Una emotiva balada acústica sobre cómo una carta sellada con cariño acorta miles de kilómetros entre dos mejores amigos.',
      en: 'An acoustic ballad celebrating how letters connect best friends across thousands of miles.',
    },
  },
  {
    id: 'musical-03',
    title: {
      es: 'Videoclip: «El Vuelo Verde de Quetzal»',
      en: 'Music Video: “Quetzal’s Emerald Flight”',
    },
    slug: 'cancion-vuelo-de-quetzal',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80',
    type: 'song',
    duration: '02:54',
    publishedAt: '2026-10-02',
    highlightTag: { es: 'Flautas & Ritmos del Mundo', en: 'World Winds' },
    description: {
      es: 'Melodía con instrumentos prehispánicos de viento y percusiones que celebra la libertad y los secretos de la selva maya.',
      en: 'Pre-Hispanic wind melodies and drumming honoring freedom and Mayan forests.',
    },
  },
  {
    id: 'musical-04',
    title: {
      es: 'Videoclip: «La Pizza Voladora de Chef Gino»',
      en: 'Music Video: “Chef Gino’s Flying Pizza”',
    },
    slug: 'cancion-la-pizza-de-gino',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    type: 'song',
    duration: '02:40',
    publishedAt: '2026-10-10',
    highlightTag: { es: 'Música Italiana', en: 'Italian Swing' },
    description: {
      es: 'Tarantela alegre y divertida mientras el ratoncito Gino hace girar la masa de pizza y enseña que cocinar es un arte con amor.',
      en: 'A cheerful tarantella as little mouse chef Gino spins pizza dough through Florence streets.',
    },
  },
  {
    id: 'musical-05',
    title: {
      es: 'Videoclip: «Estrellas Bajo Tierra en Waitomo»',
      en: 'Music Video: “Underground Stars in Waitomo”',
    },
    slug: 'cancion-estrellas-bajo-tierra',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    type: 'song',
    duration: '03:10',
    publishedAt: '2026-10-16',
    highlightTag: { es: 'Nana Bioluminiscente', en: 'Luminous Lullaby' },
    description: {
      es: 'Canción suave y mágica junto a Kiki el kiwi navegando en barca por las cuevas estrelladas de gusanitos de luz.',
      en: 'A gentle, magical song gliding beneath thousands of underground glowworms with Kiki the kiwi.',
    },
  },
  {
    id: 'musical-06',
    title: {
      es: 'Videoclip: «El Compás de Lola la Tortuga»',
      en: 'Music Video: “Lola Tortoise’s Flamenco Beat”',
    },
    slug: 'cancion-el-compas-de-lola',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=800&auto=format&fit=crop&q=80',
    type: 'song',
    duration: '03:02',
    publishedAt: '2026-10-22',
    highlightTag: { es: 'Flamenco & Raíces', en: 'Flamenco Roots' },
    description: {
      es: 'Rumba y palmas andaluzas con guitarra española para celebrar que el camino más emocionante siempre conduce de vuelta al hogar.',
      en: 'Andalusian rumba and clapping celebrating that the greatest journey always leads back home.',
    },
  },

  // --- YOUTUBE SHORTS (FORMATO VERTICAL 9:16) ---
  {
    id: 'short-01',
    title: {
      es: '¡Escalando el volcán más pequeño del planeta en 1 segundo! 🌋⚡️',
      en: 'Climbing the smallest volcano on Earth in 1 second! 🌋⚡️',
    },
    slug: 'short-volcan-cuexcomate',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    type: 'short',
    duration: '00:38',
    publishedAt: '2026-09-04',
    highlightTag: { es: 'Shorts 9:16', en: 'Shorts 9:16' },
    description: {
      es: 'Curileta te muestra el Cuexcomate en Puebla, México: ¡un volcán inactivo que puedes subir de un brinco!',
      en: 'Curileta visits Cuexcomate in Mexico: a tiny inactive volcano you can climb in a single hop!',
    },
  },
  {
    id: 'short-02',
    title: {
      es: 'Pompón reacciona a una carta con copos de nieve dentro 📬❄️🐇',
      en: 'Pompón reacts to a letter with snowflakes inside 📬❄️🐇',
    },
    slug: 'short-pompon-nieve-islandia',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80',
    type: 'short',
    duration: '00:45',
    publishedAt: '2026-09-12',
    highlightTag: { es: 'Shorts 9:16', en: 'Shorts 9:16' },
    description: {
      es: '¡El conejito blanco casi congela su bigote al abrir la carta sellada desde la Laguna Azul de Islandia!',
      en: 'The white bunny almost freezes his whiskers opening Curileta’s Iceland postcard!',
    },
  },
  {
    id: 'short-03',
    title: {
      es: '¡Un emú gigante intenta comerse mi sombrero de exploradora! 🎩🏃‍♀️',
      en: 'A giant emu tries to eat my explorer hat! 🎩🏃‍♀️',
    },
    slug: 'short-el-emu-y-el-sombrero',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1550935515-fdfd4107662c?w=600&auto=format&fit=crop&q=80',
    type: 'short',
    duration: '00:32',
    publishedAt: '2026-09-20',
    highlightTag: { es: 'Shorts 9:16', en: 'Shorts 9:16' },
    description: {
      es: '¡En el Outback australiano los emús son muy curiosos! Curileta hace piruetas para esquivar el picotazo.',
      en: 'In the Australian Outback emus are very curious! Curileta dodges pecks with acrobatics.',
    },
  },
  {
    id: 'short-04',
    title: {
      es: 'Curileta intentando bailar la Haka maorí con patitas 🦎🦶🤣',
      en: 'Curileta trying to dance the Maori Haka with tiny feet 🦎🦶🤣',
    },
    slug: 'short-curileta-baila-haka',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&auto=format&fit=crop&q=80',
    type: 'short',
    duration: '00:52',
    publishedAt: '2026-10-01',
    highlightTag: { es: 'Shorts 9:16', en: 'Shorts 9:16' },
    description: {
      es: 'Kiki el kiwi no puede parar de reír viendo la pose más feroz (y diminuta) de Curileta en Nueva Zelanda.',
      en: 'Kiki the kiwi cannot stop laughing at Curileta’s fiercest mini dance moves in New Zealand.',
    },
  },
  {
    id: 'short-05',
    title: {
      es: '¿Cómo hace el panda Bao para comer 12 kg de bambú al día? 🎋🐼',
      en: 'How does Bao the panda eat 12kg of bamboo daily? 🎋🐼',
    },
    slug: 'short-bao-el-panda-bambu',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&auto=format&fit=crop&q=80',
    type: 'short',
    duration: '00:41',
    publishedAt: '2026-10-09',
    highlightTag: { es: 'Shorts 9:16', en: 'Shorts 9:16' },
    description: {
      es: '¡Bao demuestra su técnica secreta de pelado de bambú en lo alto de la Gran Muralla China!',
      en: 'Bao reveals his bamboo peeling secret atop the Great Wall of China!',
    },
  },
  {
    id: 'short-06',
    title: {
      es: '¡Socorro! ¡Atrapada dentro de una baguette en los Alpes! 🥖🐶',
      en: 'Help! Trapped inside a French baguette in the Alps! 🥖🐶',
    },
    slug: 'short-baguette-alpes-barnaby',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    type: 'short',
    duration: '00:36',
    publishedAt: '2026-10-17',
    highlightTag: { es: 'Shorts 9:16', en: 'Shorts 9:16' },
    description: {
      es: 'Barnaby el perro basset olfatea un queso francés y Curileta se esconde en el único lugar crujiente disponible.',
      en: 'Barnaby sniffs out French cheese and Curileta hides in the crunchiest spot available.',
    },
  },
];


export const INITIAL_WALLPAPERS: Wallpaper[] = [
  // ==========================================
  // --- FONDOS 2K PARA MÓVILES (VERTICAL 9:16) ---
  // ==========================================
  {
    id: 'wp-mob-01',
    title: {
      es: 'Curileta con Mochila y Sombrero Verde',
      en: 'Curileta with Explorer Hat & Backpack',
    },
    slug: 'curileta-exploradora-movil-2k',
    deviceType: 'mobile',
    category: 'personajes',
    resolution: '1440 × 2560 (2K Vertical)',
    thumbnail: '/images/characters/curileta-main.webp',
    fullImageUrl: '/images/characters/curileta-main.webp',
    characterId: 'curileta',
    tags: ['Curileta', 'Móvil', '2K Ultra HD', 'Personajes 3D', 'Bosque Encantado'],
    country: { es: 'España', en: 'Spain' },
    fileSizeBytes: '4.2 MB',
    description: {
      es: 'Retrato 3D oficial de Curileta con su emblemático sombrero de exploradora y su mochila mágica sobre fondo esmeralda.',
      en: 'Official 3D portrait of Curileta with her explorer hat and magical backpack.',
    },
  },
  {
    id: 'wp-mob-02',
    title: {
      es: 'Pompón y el Gran Árbol del Bosque',
      en: 'Pompón & the Tallest Forest Tree',
    },
    slug: 'pompon-bosque-encantado-movil-2k',
    deviceType: 'mobile',
    category: 'personajes',
    resolution: '1440 × 2560 (2K Vertical)',
    thumbnail: '/images/characters/pompon-main.webp',
    fullImageUrl: '/images/characters/pompon-main.webp',
    characterId: 'pompon',
    tags: ['Pompón', 'Conejito', 'Móvil', '2K Ultra HD', 'Buzón Secreto'],
    country: { es: 'España', en: 'Spain' },
    fileSizeBytes: '3.9 MB',
    description: {
      es: 'El tierno conejito blanco guardián del hogar junto al buzón tallado de madera donde recibe las cartas del mundo.',
      en: 'The sweet white bunny guardian of the forest beside the carved wooden mailbox.',
    },
  },
  {
    id: 'wp-mob-03',
    title: {
      es: 'Quetzal: El Guardián de las Estrellas',
      en: 'Quetzal: Guardian of the Stars',
    },
    slug: 'quetzal-estrellas-movil-2k',
    deviceType: 'mobile',
    category: 'personajes',
    resolution: '1440 × 2560 (2K Vertical)',
    thumbnail: '/images/characters/quetzal-main.webp',
    fullImageUrl: '/images/characters/quetzal-main.webp',
    characterId: 'quetzal',
    tags: ['Quetzal', 'México', 'Teotihuacán', 'Móvil', '2K Ultra HD', 'Plumas Esmeralda'],
    country: { es: 'México', en: 'Mexico' },
    fileSizeBytes: '4.5 MB',
    description: {
      es: 'Ave sagrada de plumaje esmeralda iridiscente sobre el cielo nocturno y las constelaciones de Teotihuacán.',
      en: 'Sacred emerald bird soaring beneath the celestial constellations of Teotihuacan.',
    },
  },
  {
    id: 'wp-mob-04',
    title: {
      es: 'Bao el Panda en el Bosque de Bambú',
      en: 'Bao the Panda in the Bamboo Forest',
    },
    slug: 'bao-panda-bambu-movil-2k',
    deviceType: 'mobile',
    category: 'personajes',
    resolution: '1440 × 2560 (2K Vertical)',
    thumbnail: '/images/characters/bao-main.webp',
    fullImageUrl: '/images/characters/bao-main.webp',
    characterId: 'bao',
    tags: ['Bao', 'Oso Panda', 'China', 'Móvil', '2K Ultra HD', 'Bambú'],
    country: { es: 'China', en: 'China' },
    fileSizeBytes: '4.1 MB',
    description: {
      es: 'El pacífico panda gigante saboreando un tierno brote de bambú junto a las torres de la Gran Muralla China.',
      en: 'The peaceful giant panda enjoying sweet bamboo shoots near the Great Wall.',
    },
  },
  {
    id: 'wp-mob-05',
    title: {
      es: 'Lulú la Llama entre Nubes Andinas',
      en: 'Lulú the Llama in Andean Clouds',
    },
    slug: 'lulu-llama-machu-picchu-movil-2k',
    deviceType: 'mobile',
    category: 'personajes',
    resolution: '1440 × 2560 (2K Vertical)',
    thumbnail: '/images/characters/lulu-main.webp',
    fullImageUrl: '/images/characters/lulu-main.webp',
    characterId: 'lulu',
    tags: ['Lulú', 'Llama', 'Perú', 'Machu Picchu', 'Móvil', '2K Ultra HD'],
    country: { es: 'Perú', en: 'Peru' },
    fileSizeBytes: '3.8 MB',
    description: {
      es: 'Lulú con su lana tibia y reconfortante rodeada por la bruma mágica de las alturas de Machu Picchu.',
      en: 'Warm fleeced llama framed by mystical Andean mists above Machu Picchu.',
    },
  },
  {
    id: 'wp-mob-06',
    title: {
      es: 'Zipi-Bot: El Pequeño Robot de Tokio',
      en: 'Zipi-Bot: The Little Robot of Tokyo',
    },
    slug: 'zipi-bot-tokio-movil-2k',
    deviceType: 'mobile',
    category: 'personajes',
    resolution: '1440 × 2560 (2K Vertical)',
    thumbnail: '/images/characters/zipi-bot-main.webp',
    fullImageUrl: '/images/characters/zipi-bot-main.webp',
    characterId: 'zipi-bot',
    tags: ['Zipi-Bot', 'Robot', 'Japón', 'Tokio', 'Móvil', '2K Ultra HD', 'Shinkansen'],
    country: { es: 'Japón', en: 'Japan' },
    fileSizeBytes: '3.7 MB',
    description: {
      es: 'El robot cantor iluminado por las luces de neón futuristas y los cerezos en flor de Japón.',
      en: 'The musical robot surrounded by futuristic neon lights and blooming cherry blossoms.',
    },
  },
  {
    id: 'wp-mob-07',
    title: {
      es: 'Kiki el Kiwi y las Luces Subterráneas',
      en: 'Kiki the Kiwi & Underground Lights',
    },
    slug: 'kiki-kiwi-waitomo-movil-2k',
    deviceType: 'mobile',
    category: 'personajes',
    resolution: '1440 × 2560 (2K Vertical)',
    thumbnail: '/images/characters/kiki-main.webp',
    fullImageUrl: '/images/characters/kiki-main.webp',
    characterId: 'kiki',
    tags: ['Kiki', 'Kiwi', 'Nueva Zelanda', 'Waitomo', 'Móvil', '2K Ultra HD'],
    country: { es: 'Nueva Zelanda', en: 'New Zealand' },
    fileSizeBytes: '4.4 MB',
    description: {
      es: 'Kiki explorando el techo estrellado de las cuevas bioluminiscentes de Waitomo bajo los helechos gigantes.',
      en: 'Kiki exploring glowworm ceilings under silver fern canopies in New Zealand.',
    },
  },
  {
    id: 'wp-mob-08',
    title: {
      es: 'Familia Canguro & Joey en el Outback',
      en: 'Kangaroo Family & Joey in the Outback',
    },
    slug: 'canguro-joey-outback-movil-2k',
    deviceType: 'mobile',
    category: 'personajes',
    resolution: '1440 × 2560 (2K Vertical)',
    thumbnail: '/images/characters/canguro-mama-main.webp',
    fullImageUrl: '/images/characters/canguro-mama-main.webp',
    characterId: 'canguro-mama',
    tags: ['Canguro', 'Joey Peluche', 'Australia', 'Uluru', 'Móvil', '2K Ultra HD'],
    country: { es: 'Australia', en: 'Australia' },
    fileSizeBytes: '4.3 MB',
    description: {
      es: 'Mamá Canguro, el bebé y su inseparable koala de trapo Joey frente al cielo rojizo de Uluru.',
      en: 'Mama Kangaroo, baby, and plush koala Joey against the red glow of Uluru.',
    },
  },

  // ==========================================
  // --- FONDOS 2K PARA ORDENADORES (PANORÁMICA 16:9) ---
  // ==========================================
  {
    id: 'wp-dsk-01',
    title: {
      es: 'La Gran Expedición Mundial de Curileta',
      en: 'Curileta’s Great World Expedition',
    },
    slug: 'expedicion-mundial-ordenador-2k',
    deviceType: 'desktop',
    category: 'arte',
    resolution: '2560 × 1440 (2K QHD)',
    thumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&auto=format&fit=crop&q=80',
    fullImageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=2560&auto=format&fit=crop&q=90',
    tags: ['Mapamundi', 'Brújula Solar', 'Ordenador', '2K QHD', 'Arte Oficial', 'Aventura'],
    country: { es: 'Global', en: 'Global' },
    fileSizeBytes: '5.8 MB',
    description: {
      es: 'Ilustración panorámica 2K con el mapa del mundo de Curileta, rutas marinas con líneas discontinuas y la brújula dorada.',
      en: 'Panoramic 2K world map showing Curileta’s sea voyages and golden compass.',
    },
  },
  {
    id: 'wp-dsk-02',
    title: {
      es: 'Pirámides de Giza y el Ocaso Dorado',
      en: 'Pyramids of Giza & Golden Sunset',
    },
    slug: 'piramides-giza-ordenador-2k',
    deviceType: 'desktop',
    category: 'paisajes',
    resolution: '2560 × 1440 (2K QHD)',
    thumbnail: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200&auto=format&fit=crop&q=80',
    fullImageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=2560&auto=format&fit=crop&q=90',
    tags: ['Egipto', 'Pirámides', 'Giza', 'Desierto', 'Ordenador', '2K QHD'],
    country: { es: 'Egipto', en: 'Egypt' },
    fileSizeBytes: '5.4 MB',
    description: {
      es: 'Las majestuosas pirámides del antiguo Egipto bañadas por la luz del atardecer desértico donde Curileta conoció a Emi.',
      en: 'The majestic pyramids bathed in warm desert twilight where Curileta met Emi.',
    },
  },
  {
    id: 'wp-dsk-03',
    title: {
      es: 'Auroras Boreales y Nieve en Islandia',
      en: 'Northern Lights & Snow in Iceland',
    },
    slug: 'auroras-islandia-ordenador-2k',
    deviceType: 'desktop',
    category: 'paisajes',
    resolution: '2560 × 1440 (2K QHD)',
    thumbnail: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&auto=format&fit=crop&q=80',
    fullImageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=2560&auto=format&fit=crop&q=90',
    tags: ['Islandia', 'Auroras Boreales', 'Laguna Azul', 'Ordenador', '2K QHD', 'Hielo'],
    country: { es: 'Islandia', en: 'Iceland' },
    fileSizeBytes: '6.1 MB',
    description: {
      es: 'Cielo ártico iluminado por cintas de luz verde y violeta sobre paisajes volcánicos cubiertos de nieve.',
      en: 'Arctic skies lit by emerald and violet auroral ribbons above volcanic snowfields.',
    },
  },
  {
    id: 'wp-dsk-04',
    title: {
      es: 'La Gran Muralla China entre Montañas',
      en: 'The Great Wall of China Among Mist',
    },
    slug: 'gran-muralla-china-ordenador-2k',
    deviceType: 'desktop',
    category: 'paisajes',
    resolution: '2560 × 1440 (2K QHD)',
    thumbnail: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&auto=format&fit=crop&q=80',
    fullImageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=2560&auto=format&fit=crop&q=90',
    tags: ['China', 'Gran Muralla', 'Bao Panda', 'Ordenador', '2K QHD', 'Montañas'],
    country: { es: 'China', en: 'China' },
    fileSizeBytes: '5.9 MB',
    description: {
      es: 'El colosal dragón de piedra serpenteando por las crestas montañosas contemplado desde la torre más alta con Bao.',
      en: 'The stone dragon winding through misty ridges as viewed from the highest watchtower with Bao.',
    },
  },
  {
    id: 'wp-dsk-05',
    title: {
      es: 'El Galeón de los Sueños en el Océano Atlántico',
      en: 'The Dream Galleon Across the Atlantic',
    },
    slug: 'galeon-atlantico-ordenador-2k',
    deviceType: 'desktop',
    category: 'arte',
    resolution: '2560 × 1440 (2K QHD)',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=80',
    fullImageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=2560&auto=format&fit=crop&q=90',
    tags: ['Galeón', 'Océano Atlántico', 'Travesía', 'Ordenador', '2K QHD', 'Navío'],
    country: { es: 'Atlántico', en: 'Atlantic' },
    fileSizeBytes: '5.2 MB',
    description: {
      es: 'El legendario barco de madera navegando bajo constelaciones oceánicas durante la travesía entre América y África.',
      en: 'The legendary wooden ship sailing beneath oceanic star fields between continents.',
    },
  },
  {
    id: 'wp-dsk-06',
    title: {
      es: 'Atardecer en Uluru: La Roca Sagrada',
      en: 'Sunset at Uluru: The Sacred Monolith',
    },
    slug: 'uluru-outback-ordenador-2k',
    deviceType: 'desktop',
    category: 'paisajes',
    resolution: '2560 × 1440 (2K QHD)',
    thumbnail: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&auto=format&fit=crop&q=80',
    fullImageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=2560&auto=format&fit=crop&q=90',
    tags: ['Australia', 'Uluru', 'Outback', 'Tierra Roja', 'Ordenador', '2K QHD'],
    country: { es: 'Australia', en: 'Australia' },
    fileSizeBytes: '5.5 MB',
    description: {
      es: 'La inmensa formación roja australiana brillando con tonalidades bermellón al caer la tarde.',
      en: 'The immense Australian red rock glowing in vermilion tones at desert dusk.',
    },
  },
  {
    id: 'wp-dsk-07',
    title: {
      es: 'Hobbiton: El Pueblo de las Puertas Redondas',
      en: 'Hobbiton: Shire of Round Doors',
    },
    slug: 'hobbiton-nueva-zelanda-ordenador-2k',
    deviceType: 'desktop',
    category: 'paisajes',
    resolution: '2560 × 1440 (2K QHD)',
    thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80',
    fullImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2560&auto=format&fit=crop&q=90',
    tags: ['Hobbiton', 'Nueva Zelanda', 'Colinas Verdes', 'Ordenador', '2K QHD'],
    country: { es: 'Nueva Zelanda', en: 'New Zealand' },
    fileSizeBytes: '5.6 MB',
    description: {
      es: 'Colinas de verde esmeralda con casitas de puertas redondas y chimeneas humeantes descubiertas por Curileta.',
      en: 'Emerald green rolling hills with round-door cottages and smoking chimneys.',
    },
  },
  {
    id: 'wp-dsk-08',
    title: {
      es: 'El Gran Reencuentro en el Bosque Encantado',
      en: 'The Grand Reunion in the Enchanted Forest',
    },
    slug: 'reencuentro-bosque-encantado-ordenador-2k',
    deviceType: 'desktop',
    category: 'arte',
    resolution: '2560 × 1440 (2K QHD)',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
    fullImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=2560&auto=format&fit=crop&q=90',
    tags: ['Bosque Encantado', 'Pompón', 'Curileta', 'Amistad', 'Hogar', 'Ordenador', '2K QHD'],
    country: { es: 'España', en: 'Spain' },
    fileSizeBytes: '6.3 MB',
    description: {
      es: 'Curileta y Pompón abrazándose bajo el árbol más alto, compartiendo recuerdos y la última carta.',
      en: 'Curileta and Pompón reunited under the tallest tree, sharing letters and everlasting friendship.',
    },
  },
];

export class LocalCMSProvider implements CMSProvider {
  async getCharacters(locale?: string): Promise<Character[]> {
    return INITIAL_CHARACTERS;
  }

  async getCharacterBySlug(slug: string, locale?: string): Promise<Character | null> {
    if (slug === 'joey-canguro') {
      return INITIAL_CHARACTERS.find((c) => c.slug === 'canguro-mama') || null;
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
}

export const cmsProvider = new LocalCMSProvider();

