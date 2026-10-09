'use client';

import React, { useState } from 'react';
import { Locale } from '@curileta/i18n';
import {
  Mail,
  Send,
  Heart,
  Sparkles,
  MapPin,
  Stamp,
  BookOpen,
  Camera,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Volume2,
  CheckCircle2,
} from 'lucide-react';

interface LetterItem {
  id: string;
  order: number;
  country: { es: string; en: string };
  city: { es: string; en: string };
  postmark: string;
  postageColor: string;
  envelopeColor: string;
  greeting: { es: string; en: string };
  body: { es: string[]; en: string[] };
  signOff: { es: string; en: string };
  photos: {
    title: { es: string; en: string };
    fact: { es: string; en: string };
    tag: string;
  }[];
}

const LETTERS_DATA: LetterItem[] = [
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

export const LettersScene: React.FC<{ locale: Locale }> = ({ locale }) => {
  const [selectedLetterId, setSelectedLetterId] = useState<string>('mexico');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isReadModalOpen, setIsReadModalOpen] = useState<boolean>(false);

  const activeIndex = LETTERS_DATA.findIndex((l) => l.id === selectedLetterId);
  const letter = LETTERS_DATA[activeIndex !== -1 ? activeIndex : 0];

  const handlePrev = () => {
    const prev = (activeIndex - 1 + LETTERS_DATA.length) % LETTERS_DATA.length;
    setSelectedLetterId(LETTERS_DATA[prev].id);
    setActivePhotoIndex(0);
  };

  const handleNext = () => {
    const next = (activeIndex + 1) % LETTERS_DATA.length;
    setSelectedLetterId(LETTERS_DATA[next].id);
    setActivePhotoIndex(0);
  };

  return (
    <section id="escena-cartas" className="relative py-28 bg-slate-950 text-white overflow-hidden">
      {/* Trazado estético superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-sky-400 shadow-[0_0_20px_rgba(245,158,11,0.6)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg backdrop-blur-md">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>El Baúl Postal de la Expedición</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Cartas a Pompón.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-sky-300">
              Palabras que cruzaron océanos.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            «No estés triste, Pompón: te enviaré una carta siempre que llegue a un nuevo sitio». Lee las 10 cartas auténticas escritas por Curileta desde cada rincón del planeta.
          </p>
        </div>

        {/* Carrusel de Sobres / Selector de Cartas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-amber-400/30 scrollbar-track-slate-900 justify-start md:justify-center">
          {LETTERS_DATA.map((item, idx) => {
            const isSelected = item.id === selectedLetterId;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedLetterId(item.id);
                  setActivePhotoIndex(0);
                }}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/25 scale-105 font-black'
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-400/50 hover:text-white'
                }`}
                aria-pressed={isSelected}
              >
                <span className="font-mono text-[11px] opacity-75">#{String(idx + 1).padStart(2, '0')}</span>
                <span>{item.country[locale] || item.country.es}</span>
              </button>
            );
          })}
        </div>

        {/* Visor Postal Interactivo (El Sobre y La Hoja de Carta) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: La Hoja de Carta Manuscrita */}
          <div className="lg:col-span-7 bg-[#fdfbf7] text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-[#efe7d8] relative overflow-hidden">
            {/* Borde Vintage Airmail Superior e Inferior */}
            <div
              className="absolute top-0 left-0 right-0 h-3"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, #dc2626 0, #dc2626 15px, #ffffff 15px, #ffffff 30px, #0284c7 30px, #0284c7 45px, #ffffff 45px, #ffffff 60px)',
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-3"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, #dc2626 0, #dc2626 15px, #ffffff 15px, #ffffff 30px, #0284c7 30px, #0284c7 45px, #ffffff 45px, #ffffff 60px)',
              }}
            />

            {/* Cabecera Postal: Matasellos y Sello Oficial */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 pb-6 border-b-2 border-dashed border-[#e6dbc7]">
              {/* Matasellos Oficial Circular */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-red-700/70 flex flex-col items-center justify-center text-center p-1 rotate-[-6deg]">
                  <span className="text-[8px] font-black tracking-widest uppercase text-red-800">EXPEDICIÓN</span>
                  <Stamp className="w-3.5 h-3.5 text-red-700 my-0.5" />
                  <span className="text-[7px] font-mono font-bold text-red-900">AIR MAIL</span>
                </div>
                <div>
                  <div className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">
                    {letter.postmark}
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    De: Curileta • Para: Pompón
                  </div>
                </div>
              </div>

              {/* Sello de Pasaporte Ilustrado */}
              <div
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-black text-white shadow-md flex items-center gap-1.5 rotate-[3deg]"
                style={{ backgroundColor: letter.postageColor }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>SELLO CARTA #{letter.order}</span>
              </div>
            </div>

            {/* Cuerpo de la Carta Manuscrita */}
            <div className="py-8 space-y-4 font-serif text-slate-800 leading-relaxed text-base sm:text-lg">
              <h3 className="font-sans font-black text-xl sm:text-2xl text-slate-950 mb-2">
                {letter.greeting[locale] || letter.greeting.es}
              </h3>

              {(letter.body[locale] || letter.body.es).map((paragraph, pIdx) => (
                <p key={pIdx} className="text-slate-800/95 indent-4 text-justify sm:text-left">
                  {paragraph}
                </p>
              ))}

              <p className="pt-4 font-sans font-bold text-amber-800 text-sm sm:text-base border-t border-[#f0e7d5]">
                {letter.signOff[locale] || letter.signOff.es}
              </p>
            </div>

            {/* Pie de Carta: Navegación Anterior / Siguiente */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-[#e6dbc7]">
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Carta anterior</span>
              </button>

              <span className="text-xs font-mono font-black text-slate-500">
                {activeIndex + 1} de {LETTERS_DATA.length} cartas
              </span>

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                <span>Siguiente carta</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Columna Derecha: Cuaderno de Fotos de Curileta & Tesoros Adjuntos */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tarjeta de Polaroids / Curiosidades Adjuntas */}
            <div className="bg-slate-900/90 border border-amber-400/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <Camera className="w-4 h-4" />
                  <span>POLAROIDS ADJUNTAS ({letter.photos.length})</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  {letter.country[locale] || letter.country.es}
                </span>
              </div>

              {/* Selector de Polaroid */}
              <div className="mt-4 flex gap-2">
                {letter.photos.map((photo, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setActivePhotoIndex(pIdx)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      activePhotoIndex === pIdx
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Foto #{pIdx + 1}
                  </button>
                ))}
              </div>

              {/* Polaroid Activa */}
              {letter.photos[activePhotoIndex] && (
                <div className="mt-6 p-4 bg-white text-slate-900 rounded-2xl shadow-xl transform rotate-[1deg] transition-all duration-300">
                  <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/80 p-4 flex flex-col justify-between text-white relative overflow-hidden border border-slate-800">
                    <span className="self-start text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                      {letter.photos[activePhotoIndex].tag}
                    </span>
                    <div>
                      <h4 className="text-lg font-black leading-tight text-white">
                        {letter.photos[activePhotoIndex].title[locale] || letter.photos[activePhotoIndex].title.es}
                      </h4>
                      <p className="text-[11px] text-amber-300/90 font-medium mt-1">
                        Cuaderno Secreto de Curileta
                      </p>
                    </div>
                  </div>
                  <div className="pt-3">
                    <p className="font-serif text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      «{letter.photos[activePhotoIndex].fact[locale] || letter.photos[activePhotoIndex].fact.es}»
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Cuadro de Amistad y Hogar */}
            <div className="bg-gradient-to-br from-amber-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                <h4 className="text-lg font-black text-white">
                  El Buzón de Pompón
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Pompón guarda cada sobre en un buzón de madera tallada bajo el árbol más alto. Cada sello es una promesa cumplida: explorar el mundo entero para regresar y abrazar a quien más quieres.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-amber-300 font-bold">
                <span>Colección Postal Completa</span>
                <span className="font-mono">11 Sobres Sellados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
