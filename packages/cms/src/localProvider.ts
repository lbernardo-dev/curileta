import { CMSProvider } from './CMSProvider';
import { Character, Book, Adventure, Video, Song, Location, TrailWaypoint } from './models';

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
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
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
      es: 'Conejito blanco de corazón tierno. Espera cada carta de Curileta bajo el árbol más alto del Bosque Encantado.',
      en: 'White rabbit with a tender heart. Awaits each letter under the tallest tree of the Enchanted Forest.',
    },
    biography: {
      es: 'Pompón es el mejor amigo de Curileta. Aunque le asusta el bullicio de los viajes lejanos, su amor y fidelidad lo mantienen conectado a Curileta a través de cada carta, cada sello y cada regalo que ella le envía.',
      en: 'Pompón is Curileta’s best friend who stays connected to her through every letter sent across the seas.',
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
      url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&auto=format&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Zipi-Bot el robot en Tokio', en: 'Zipi-Bot the robot in Tokyo' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['japon'],
  },
  {
    id: 'joey-canguro',
    name: 'Mamá Canguro & Joey',
    slug: 'joey-canguro',
    passportRole: {
      es: 'Saltarines del Outback Australiano',
      en: 'Hoppers of the Australian Outback',
    },
    shortDescription: {
      es: 'Curileta rescata el koala de peluche de Joey y recibe a cambio saltos de 4 metros por el desierto rojo.',
      en: 'Curileta rescues baby Joey’s toy koala and is rewarded with 4-meter leaps across the red desert.',
    },
    biography: {
      es: 'En las tierras rojas de Uluru y las arenas blancas de Hyams Beach, la familia Canguro enseña a Curileta que no importa lo alto del salto, sino disfrutar del vuelo.',
      en: 'Across red Uluru and Hyams Beach, the Kangaroo family teaches Curileta to enjoy the flight.',
    },
    species: 'Canguros Rojos de Australia',
    personality: ['Saltarines', 'Generosos', 'Protectores', 'Veloces'],
    values: ['Agradecimiento', 'Familia'],
    explorerStats: {
      curiosity: 88,
      courage: 93,
      agility: 100,
      wisdom: 86,
    },
    backpackItems: [
      { es: 'El koala de peluche favorito del pequeño Joey', en: 'Baby Joey’s favorite plush koala' },
      { es: 'Arena hiperblanca de Hyams Beach en un frasco', en: 'Ultra-white Hyams Beach sand' },
    ],
    curiosityFacts: [
      { es: 'Sus saltos pueden alcanzar los 4 metros de altura y avanzar 9 metros en un solo brinco.', en: 'Can leap 4 meters high and 9 meters forward in a single bound.' },
    ],
    voiceQuote: {
      es: '«No importa qué tan grande sea el salto: lo importante es disfrutar del vuelo.»',
      en: '“No matter how big the leap: what matters most is enjoying the flight.”',
    },
    mainImage: {
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Familia Canguro en el Outback', en: 'Kangaroo family in the Outback' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['australia'],
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
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&auto=format&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Lola la tortuga mora en España', en: 'Lola the tortoise in Spain' },
    },
    relatedBooks: ['las-aventuras-de-curileta'],
    relatedLocations: ['espana-regreso'],
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
    characters: ['curileta', 'joey-canguro'],
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
    characters: ['curileta', 'pompon', 'quetzal', 'lulu', 'emi', 'picu', 'zipi-bot', 'joey-canguro', 'kiki', 'bao', 'gino', 'lola'],
    locations: ['espana-inicio', 'mexico', 'peru', 'egipto', 'islandia', 'japon', 'australia', 'nueva-zelanda', 'china', 'italia', 'francia', 'espana-regreso'],
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
