'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Locale } from '@curileta/i18n';
import {
  Globe,
  Compass,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  X,
  Search,
  Info,
} from 'lucide-react';
import { Location, NarrativeMilestone } from '@curileta/cms';
import { CharacterAvatarImage } from '@/components/CharacterAvatarImage';
import {
  createPixarEarthCanvas,
  createPixarCloudsCanvas,
} from './globe/pixarEarthTexture';
import {
  createPixarMonumentMesh,
  getMonumentConfig,
} from './globe/monumentModels';

interface Globe3DSceneProps {
  locale: Locale;
  locations?: Location[];
  milestones?: NarrativeMilestone[];
}

const MONUMENT_NAME_EN: Record<string, string> = {
  'espana-inicio': 'The Great Enchanted Tree',
  mexico: 'Pyramid of the Sun',
  peru: 'Machu Picchu',
  egipto: 'Pyramids of Giza',
  islandia: 'Blue Lagoon & Geyser',
  japon: 'Mount Fuji & Torii Gate',
  australia: 'Sacred Uluru',
  'nueva-zelanda': 'Hobbiton & Waitomo',
  china: 'The Great Wall',
  italia: 'Colosseum & Leaning Tower',
  francia: 'Eiffel Tower',
  'espana-regreso': 'The Reunion Tree',
};

function NauticalRose({ locale }: { locale: Locale }) {
  return (
    <svg
      aria-label={locale === 'en' ? 'Nautical compass rose' : 'Rosa náutica del atlas'}
      role="img"
      viewBox="0 0 80 80"
      className="h-14 w-14 text-[#826b43] dark:text-[#e0c88d] sm:h-16 sm:w-16"
      fill="none"
    >
      <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="29" stroke="currentColor" strokeOpacity=".45" />
      <path d="M40 8v7M40 65v7M8 40h7M65 40h7M17.4 17.4l5 5m35.2 35.2 5 5m0-45.2-5 5M22.4 57.6l-5 5" stroke="currentColor" strokeWidth="1.2" />
      <path d="m40 16 6.2 18 17.8 6-17.8 6L40 64l-6.2-18L16 40l17.8-6L40 16Z" fill="#a85635" />
      <path d="m40 21 3.2 15.8L59 40l-15.8 3.2L40 59l-3.2-15.8L21 40l15.8-3.2L40 21Z" fill="#214c62" />
      <path d="m40 29 2.5 8.5L51 40l-8.5 2.5L40 51l-2.5-8.5L29 40l8.5-2.5L40 29Z" fill="#f0d79c" />
      <circle cx="40" cy="40" r="2.2" fill="#fffaf0" />
      <text x="40" y="7" fill="currentColor" fontSize="6" fontWeight="700" textAnchor="middle">N</text>
      <text x="73" y="42" fill="currentColor" fontSize="6" fontWeight="700" textAnchor="middle">E</text>
      <text x="40" y="79" fill="currentColor" fontSize="6" fontWeight="700" textAnchor="middle">S</text>
      <text x="7" y="42" fill="currentColor" fontSize="6" fontWeight="700" textAnchor="middle">{locale === 'en' ? 'W' : 'O'}</text>
    </svg>
  );
}

interface GlobeRotation {
  x: number;
  y: number;
  z: number;
}

function getGlobeFocusRotation(lat: number, lng: number): GlobeRotation {
  const latitude = (lat * Math.PI) / 180;
  const longitude = (lng * Math.PI) / 180;
  const surfaceNormal = new THREE.Vector3(
    Math.cos(latitude) * Math.cos(longitude),
    Math.sin(latitude),
    -Math.cos(latitude) * Math.sin(longitude)
  ).normalize();
  // Dejar la parada ligeramente por encima del centro da profundidad al
  // monumento radial y evita que se vea como un sello plano sobre el globo.
  const front = new THREE.Vector3(0, 0.36, Math.sqrt(1 - 0.36 ** 2));
  const orientation = new THREE.Quaternion().setFromUnitVectors(surfaceNormal, front);
  const euler = new THREE.Euler().setFromQuaternion(orientation, 'XYZ');
  return { x: euler.x, y: euler.y, z: euler.z };
}

function lerpAngle(current: number, target: number, amount: number): number {
  const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + difference * amount;
}

export const Globe3DScene: React.FC<Globe3DSceneProps> = ({
  locale,
  locations: initialLocations = [],
  milestones = [],
}) => {
  const copy = (es: string, en: string) => locale === 'en' ? en : es;
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>('espana-inicio');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [isRoutePlaying, setIsRoutePlaying] = useState(false);
  const selectedIdRef = useRef(selectedId);
  const isAutoRotatingRef = useRef(isAutoRotating);
  const isHoveredRef = useRef(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isSceneReady, setIsSceneReady] = useState<boolean>(false);
  const [isMilestonesModalOpen, setIsMilestonesModalOpen] = useState<boolean>(false);
  const [milestoneSearch, setMilestoneSearch] = useState<string>('');

  // Destinos de la expedición
  const locationsList: Location[] = useMemo(() => {
    if (initialLocations && initialLocations.length > 0) return initialLocations;
    return [
      {
        id: 'espana-inicio',
        name: { es: 'El Bosque Encantado', en: 'The Enchanted Forest' },
        slug: 'espana-inicio',
        country: { es: 'España (Partida)', en: 'Spain (Departure)' },
        theme: { es: 'El árbol más alto, la mochila y la promesa a Pompón', en: 'The tallest tree & promise to Pompón' },
        climate: { es: 'Brisa templada mediterránea', en: 'Temperate Mediterranean' },
        coordinates: { lat: 40.41, lng: -3.70 },
        passportStamp: { icon: 'Compass', code: 'ESP-HOME-00', color: '#10B981' },
        description: {
          es: 'El hogar secreto de Curileta y Pompón. Un bosque mágico donde los árboles guardan historias y comienza la gran expedición por el mundo.',
          en: 'Curileta and Pompón’s secret home where the world expedition begins.',
        },
        heroImage: {
          url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
          alt: { es: 'El Bosque Encantado en España', en: 'The Enchanted Forest in Spain' },
        },
        curiosities: [
          { es: 'Es un lugar invisible para los humanos que no tienen curiosidad en el corazón.', en: 'Invisible to those lacking curiosity in their hearts.' },
        ],
        characters: ['curileta', 'pompon'],
      },
      {
        id: 'mexico',
        name: { es: 'Teotihuacán & Chichén Itzá', en: 'Teotihuacan & Chichen Itza' },
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
          alt: { es: 'Pirámides de Teotihuacán', en: 'Pyramids of Teotihuacan' },
        },
        curiosities: [
          { es: 'La Pirámide del Sol está alineada con el movimiento solar exacto.', en: 'The Pyramid of the Sun aligns precisely with solar motion.' },
          { es: 'El sonido de una palmada frente a la pirámide imita el eco del Quetzal.', en: 'A clap in front of the pyramid mimics a Quetzal call.' },
        ],
        characters: ['curileta', 'quetzal'],
      },
      {
        id: 'peru',
        name: { es: 'Machu Picchu & Valle Sagrado', en: 'Machu Picchu & Sacred Valley' },
        slug: 'peru',
        country: { es: 'Perú', en: 'Peru' },
        theme: { es: 'Montañas sagradas y senderos entre nubes', en: 'Sacred peaks and cloud trails' },
        climate: { es: 'Montañoso y fresco andino', en: 'Andean mountainous and fresh' },
        coordinates: { lat: -13.16, lng: -72.54 },
        passportStamp: { icon: 'Mountain', code: 'PER-MAC-02', color: '#10B981' },
        description: {
          es: 'Ciudadelas de piedra milenaria en las cumbres de los Andes custodiadas por cóndores.',
          en: 'Ancient stone citadels atop Andean peaks guarded by condors.',
        },
        heroImage: {
          url: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&auto=format&fit=crop&q=80',
          alt: { es: 'Machu Picchu en la niebla', en: 'Machu Picchu in mist' },
        },
        curiosities: [
          { es: 'Las piedras encajan con tanta precisión que no cabe ni una hoja de papel.', en: 'Stones fit together so tightly not even paper fits through.' },
          { es: 'Los incas domesticaron más de 3.000 variedades de patatas aquí.', en: 'The Incas cultivated over 3,000 potato varieties here.' },
        ],
        characters: ['curileta', 'lulu'],
      },
      {
        id: 'egipto',
        name: { es: 'El Nilo & Pirámides de Guiza', en: 'The Nile & Giza Pyramids' },
        slug: 'egipto',
        country: { es: 'Egipto', en: 'Egypt' },
        theme: { es: 'El calor dorado de Ra y el escarabajo sagrado Emi', en: 'Golden heat of Ra & sacred beetle Emi' },
        climate: { es: 'Desértico cálido', en: 'Warm desert' },
        coordinates: { lat: 29.97, lng: 31.13 },
        passportStamp: { icon: 'Sun', code: 'EGY-CAI-03', color: '#EAB308' },
        description: {
          es: 'Monumentos eternos bañados por el oro del desierto y el susurro milenario del gran río Nilo.',
          en: 'Eternal monuments bathed in desert gold alongside the Nile river.',
        },
        heroImage: {
          url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&auto=format&fit=crop&q=80',
          alt: { es: 'Pirámides de Guiza', en: 'Giza Pyramids' },
        },
        curiosities: [
          { es: 'Las pirámides se orientaron con las estrellas de la constelación de Orión.', en: 'Pyramids aligned with Orion constellation stars.' },
        ],
        characters: ['curileta', 'emi'],
      },
      {
        id: 'islandia',
        name: { es: 'Laguna Azul & Glaciares', en: 'Blue Lagoon & Glaciers' },
        slug: 'islandia',
        country: { es: 'Islandia', en: 'Iceland' },
        theme: { es: 'Fuego, hielo y el vuelo del frailecillo Picu', en: 'Fire, ice and puffin Picu flight' },
        climate: { es: 'Subártico volcánico', en: 'Volcanic subarctic' },
        coordinates: { lat: 64.14, lng: -21.94 },
        passportStamp: { icon: 'Snowflake', code: 'ISL-REK-04', color: '#38BDF8' },
        description: {
          es: 'La tierra donde las auroras boreales bailan en el cielo nocturno y las aguas termales brotan de la nieve.',
          en: 'Land of northern lights dancing over snowy thermal geysers.',
        },
        heroImage: {
          url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&auto=format&fit=crop&q=80',
          alt: { es: 'Laguna Azul en Islandia', en: 'Blue Lagoon in Iceland' },
        },
        curiosities: [
          { es: 'Bajo el hielo ártico duermen más de 130 volcanes activos.', en: 'Over 130 active volcanoes sleep under arctic ice.' },
        ],
        characters: ['curileta', 'picu'],
      },
      {
        id: 'japon',
        name: { es: 'Tokio & Monte Fuji', en: 'Tokyo & Mount Fuji' },
        slug: 'japon',
        country: { es: 'Japón', en: 'Japan' },
        theme: { es: 'Tecnología futurista, robots musicales y cerezos', en: 'Futuristic tech, musical robots & cherry blossoms' },
        climate: { es: 'Templado insular', en: 'Insular temperate' },
        coordinates: { lat: 35.67, lng: 139.65 },
        passportStamp: { icon: 'Sparkles', code: 'JPN-TOK-05', color: '#EF4444' },
        description: {
          es: 'El delicado equilibrio entre la sabiduría de los bosques milenarios y el tren bala del futuro.',
          en: 'Harmonious balance of ancient temple wisdom and bullet train future.',
        },
        heroImage: {
          url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
          alt: { es: 'Monte Fuji y Tokio', en: 'Mount Fuji and Tokyo' },
        },
        curiosities: [
          { es: 'El tren bala Shinkansen no se retrasa más de 30 segundos al año.', en: 'Shinkansen bullet trains average under 30 seconds delay per year.' },
        ],
        characters: ['curileta', 'zipi-bot'],
      },
      {
        id: 'australia',
        name: { es: 'Uluru & Hyams Beach', en: 'Uluru & Hyams Beach' },
        slug: 'australia',
        country: { es: 'Australia', en: 'Australia' },
        theme: { es: 'Tierra roja, saltos de 4 metros y el peluche Joey', en: 'Red earth, 4-meter leaps & plush Joey' },
        climate: { es: 'Desierto Outback cálido', en: 'Warm Outback desert' },
        coordinates: { lat: -25.34, lng: 131.03 },
        passportStamp: { icon: 'Award', code: 'AUS-ULU-06', color: '#EA580C' },
        description: {
          es: 'La tierra donde Uluru brilla con fuego al atardecer y las playas tienen la arena más blanca del mundo.',
          en: 'Where Uluru glows fiery red at dusk and sand is the whitest on Earth.',
        },
        heroImage: {
          url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=80',
          alt: { es: 'Uluru en Australia', en: 'Uluru in Australia' },
        },
        curiosities: [
          { es: 'Hyams Beach tiene la arena más blanca del mundo registrada en Guinness.', en: 'Hyams Beach holds Guinness record for whitest sand.' },
        ],
        characters: ['curileta', 'canguro-mama', 'canguro-bebe', 'joey'],
      },
      {
        id: 'nueva-zelanda',
        name: { es: 'Waitomo & Hobbiton', en: 'Waitomo & Hobbiton' },
        slug: 'nueva-zelanda',
        country: { es: 'Nueva Zelanda', en: 'New Zealand' },
        theme: { es: 'Cielos de luz bajo tierra, casitas de Hobbit y helechos', en: 'Glowworm caves, Hobbit houses & ferns' },
        climate: { es: 'Bosque húmedo templado', en: 'Temperate rainforest' },
        coordinates: { lat: -38.68, lng: 176.07 },
        passportStamp: { icon: 'Sparkles', code: 'NZL-WAI-07', color: '#84CC16' },
        description: {
          es: 'Bosques de helechos plateados y colinas de cuento con chimeneas y puertas redondas.',
          en: 'Silver fern forests and fairytale hills with round doors.',
        },
        heroImage: {
          url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
          alt: { es: 'Colinas de Nueva Zelanda', en: 'New Zealand hills' },
        },
        curiosities: [
          { es: 'Las larvas de Waitomo emiten luz azul mágica para orientar a los exploradores.', en: 'Waitomo glowworms emit blue light guiding nocturnal explorers.' },
        ],
        characters: ['curileta', 'kiki'],
      },
      {
        id: 'china',
        name: { es: 'La Gran Muralla & Bambú', en: 'The Great Wall & Bamboo' },
        slug: 'china',
        country: { es: 'China', en: 'China' },
        theme: { es: 'El dragón de piedra de 21.000 km y el panda Bao', en: 'The 21,000km stone dragon & panda Bao' },
        climate: { es: 'Continental montañoso', en: 'Mountainous continental' },
        coordinates: { lat: 40.43, lng: 116.57 },
        passportStamp: { icon: 'Award', code: 'CHN-BEI-08', color: '#DC2626' },
        description: {
          es: 'Una muralla infinita sobre las cumbres donde el panda Bao enseña caracteres de caligrafía.',
          en: 'An endless wall over mountain ridges where panda Bao shares bamboo.',
        },
        heroImage: {
          url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&auto=format&fit=crop&q=80',
          alt: { es: 'La Gran Muralla China', en: 'Great Wall of China' },
        },
        curiosities: [
          { es: 'Mide más de 21.000 kilómetros y parece el lomo de un dragón dormido.', en: 'Measures over 21,000 km resembling a sleeping dragon spine.' },
        ],
        characters: ['curileta', 'bao'],
      },
      {
        id: 'italia',
        name: { es: 'Florencia & Coliseo', en: 'Florence & Colosseum' },
        slug: 'italia',
        country: { es: 'Italia', en: 'Italy' },
        theme: { es: 'El aroma a albahaca, pizza al vuelo y el ratón Gino', en: 'Basil aroma, flying pizza & mouse Gino' },
        climate: { es: 'Mediterráneo soleado', en: 'Sunny Mediterranean' },
        coordinates: { lat: 41.90, lng: 12.49 },
        passportStamp: { icon: 'Sun', code: 'ITA-ROM-09', color: '#D97706' },
        description: {
          es: 'Calles adoquinadas donde el arte milenario se funde con la cocina de Gino el ratón chef.',
          en: 'Cobblestone streets blending ancient art with Gino the chef mouse recipes.',
        },
        heroImage: {
          url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80',
          alt: { es: 'Coliseo de Roma en Italia', en: 'Roman Colosseum in Italy' },
        },
        curiosities: [
          { es: 'El Coliseo podía llenarse de agua para librar batallas navales con barquitos.', en: 'Colosseum could be flooded for mini naval battles.' },
        ],
        characters: ['curileta', 'gino'],
      },
      {
        id: 'francia',
        name: { es: 'Alpes Franceses & París', en: 'French Alps & Paris' },
        slug: 'francia',
        country: { es: 'Francia', en: 'France' },
        theme: { es: 'La Torre Eiffel, el perro Barnaby y la baguette parlante', en: 'Eiffel Tower, Barnaby & the baguette' },
        climate: { es: 'Alpino fresco y templado', en: 'Alpine fresh' },
        coordinates: { lat: 48.85, lng: 2.35 },
        passportStamp: { icon: 'Compass', code: 'FRA-PAR-10', color: '#6366F1' },
        description: {
          es: 'Autocaravanas cruzando puertos alpinos nevados y la silueta mágica de la Torre Eiffel.',
          en: 'Campers crossing snowy alpine passes and the magical Eiffel Tower.',
        },
        heroImage: {
          url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
          alt: { es: 'Torre Eiffel en Francia', en: 'Eiffel Tower in France' },
        },
        curiosities: [
          { es: 'La Torre Eiffel crece hasta 15 centímetros en verano por la dilatación del hierro.', en: 'Eiffel Tower grows up to 15 cm in summer heat.' },
        ],
        characters: ['curileta', 'basset'],
      },
      {
        id: 'espana-regreso',
        name: { es: 'Regreso al Bosque Encantado', en: 'Return to the Forest' },
        slug: 'espana-regreso',
        country: { es: 'España (Llegada)', en: 'Spain (Arrival)' },
        theme: { es: 'El abrazo con Pompón bajo el árbol y la mochila llena de recuerdos', en: 'Reunion with Pompón & memory backpack' },
        climate: { es: 'Cálido hogar mediterráneo', en: 'Warm Mediterranean home' },
        coordinates: { lat: 40.41, lng: -3.70 },
        passportStamp: { icon: 'Award', code: 'ESP-END-11', color: '#10B981' },
        description: {
          es: 'El viaje culmina donde empezó: Curileta vuelve al árbol más alto para abrazar a Pompón y compartir las cartas y tesoros del mundo.',
          en: 'The expedition concludes under the tallest tree sharing world treasures.',
        },
        heroImage: {
          url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
          alt: { es: 'Reencuentro en el Bosque Encantado', en: 'Reunion in the Enchanted Forest' },
        },
        curiosities: [
          { es: 'El buzón de madera contenía exactamente 41 sellos de todos los continentes.', en: 'The mailbox held exactly 41 stamps from every continent.' },
        ],
        characters: ['curileta', 'pompon', 'lola'],
      },
    ];
  }, [initialLocations]);

  const currentIndex = locationsList.findIndex((loc) => loc.id === selectedId);
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;
  const activeDestination = locationsList[activeIndex] || locationsList[0];
  const activeMonumentConfig = getMonumentConfig(activeDestination.id);
  const firstStop = locationsList.find((location) => location.id === 'espana-inicio') || locationsList[0];
  const initialRotation = getGlobeFocusRotation(
    firstStop?.coordinates.lat || 0,
    firstStop?.coordinates.lng || 0
  );
  const activeMonumentName = locale === 'en'
    ? MONUMENT_NAME_EN[activeDestination.id] || activeMonumentConfig.name
    : activeMonumentConfig.name;

  const handlePrevLocation = () => {
    const prevIndex = (activeIndex - 1 + locationsList.length) % locationsList.length;
    focusLocation(locationsList[prevIndex]);
  };

  const handleNextLocation = () => {
    const nextIndex = (activeIndex + 1) % locationsList.length;
    focusLocation(locationsList[nextIndex]);
  };

  const startStoryRoute = () => {
    if (!locationsList.length) return;
    setIsRoutePlaying(true);
    focusLocation(locationsList[0], true);
  };

  useEffect(() => {
    if (!isRoutePlaying) return;
    const timer = window.setInterval(() => {
      const index = locationsList.findIndex((location) => location.id === selectedIdRef.current);
      if (index < 0) {
        focusLocation(locationsList[0], true);
      } else if (index >= locationsList.length - 1) {
        setIsRoutePlaying(false);
      } else {
        focusLocation(locationsList[index + 1], true);
      }
    }, 15_500);
    return () => window.clearInterval(timer);
  }, [isRoutePlaying, locationsList]);

  // Referencias para controlar Three.js
  const targetRotationRef = useRef<GlobeRotation>(initialRotation);
  const currentRotationRef = useRef<GlobeRotation>(initialRotation);
  const monumentMeshesRef = useRef<
    Array<{
      id: string;
      group: THREE.Group;
      marker: THREE.Mesh;
      normal: THREE.Vector3;
      markerColor: THREE.Color;
    }>
  >([]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  // Conversión de Lat/Lng a coordenadas esféricas 3D
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // Centrar el globo en el destino seleccionado
  const focusLocation = (loc: Location, keepRoutePlaying = false) => {
    if (!keepRoutePlaying) setIsRoutePlaying(false);
    selectedIdRef.current = loc.id;
    isAutoRotatingRef.current = false;
    setIsAutoRotating(false);
    setSelectedId(loc.id);
    const lat = loc.coordinates.lat;
    const lng = loc.coordinates.lng;

    targetRotationRef.current = getGlobeFocusRotation(lat, lng);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    setIsSceneReady(false);

    // Verificar soporte de WebGL
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // Escena, cámara y renderizador Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.98;

    container.appendChild(renderer.domElement);

    // Grupo principal del Globo
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    const GLOBE_RADIUS = 1.5;

    // 1. ESFERA DEL PLANETA CON TEXTURA PROCEDURAL PIXAR (Océanos zafiro/turquesa y continentes detallados)
    const earthCanvas = createPixarEarthCanvas();
    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.needsUpdate = true;

    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.78,
      metalness: 0.015,
    });
    const globeMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(globeMesh);

    // 2. CAPA VOLUMÉTRICA DE NUBES FLOTANTES PIXAR (Transparencia suave para no tapar los continentes)
    const cloudsCanvas = createPixarCloudsCanvas();
    const cloudsTexture = new THREE.CanvasTexture(cloudsCanvas);
    cloudsTexture.needsUpdate = true;

    const cloudsGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.022, 48, 48);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.20,
      depthWrite: false,
      roughness: 1.0,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);

    // 3. HALO CELESTIAL ATMOSFÉRICO (Resplandor estilo Pixar)
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.055, 48, 48);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x78c7f2,
      transparent: true,
      opacity: 0.075,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // 4. MONUMENTOS Y MARCADORES LUMINOSOS PARA CADA DESTINO
    const monumentsGroup = new THREE.Group();
    globeGroup.add(monumentsGroup);
    monumentMeshesRef.current = [];

    locationsList.forEach((loc) => {
      const pos = latLngToVector3(loc.coordinates.lat, loc.coordinates.lng, GLOBE_RADIUS);
      const normal = pos.clone().normalize();

      // Monumento 3D representativo
      const monument = createPixarMonumentMesh(loc.id);
      monument.position.copy(pos);
      // Orientar perpendicular a la superficie del planeta
      monument.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      monument.userData = { locationId: loc.id };
      monumentsGroup.add(monument);

      // Un punto de luz identifica la parada sin colocar iconos planos sobre el mapa.
      const markerColor = new THREE.Color(getMonumentConfig(loc.id).color);
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.034, 16, 12),
        new THREE.MeshStandardMaterial({
          color: 0xfff5d6,
          emissive: markerColor,
          emissiveIntensity: 1.15,
          roughness: 0.24,
          metalness: 0.05,
        })
      );
      marker.position.copy(pos.clone().multiplyScalar(1.045));
      marker.userData = { locationId: loc.id };
      monumentsGroup.add(marker);

      monumentMeshesRef.current.push({
        id: loc.id,
        group: monument,
        marker,
        normal,
        markerColor,
      });
    });

    // Aro y luz cálida que acompañan al destino seleccionado.
    const focusAuraMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd18a,
      transparent: true,
      opacity: 0.56,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const focusAura = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.009, 10, 48),
      focusAuraMaterial
    );
    focusAura.renderOrder = 4;
    globeGroup.add(focusAura);
    const focusLight = new THREE.PointLight(0xffd38a, 0.28, 0.34, 2);
    globeGroup.add(focusLight);
    const focusMarkerColor = new THREE.Color(0xe8b75f);

    // 5. RUTAS AÉREAS CURVAS ANIMADAS CON LÍNEAS DISCONTINUAS (EL SENDERO DE CURILETA)
    const arcGroup = new THREE.Group();
    globeGroup.add(arcGroup);
    const routeSegments: Array<{
      line: THREE.Line;
      material: THREE.LineDashedMaterial;
      step: number;
      pointCount: number;
    }> = [];

    for (let i = 0; i < locationsList.length - 1; i++) {
      const start = latLngToVector3(
        locationsList[i].coordinates.lat,
        locationsList[i].coordinates.lng,
        GLOBE_RADIUS * 1.01
      );
      const end = latLngToVector3(
        locationsList[i + 1].coordinates.lat,
        locationsList[i + 1].coordinates.lng,
        GLOBE_RADIUS * 1.01
      );

      const mid = start.clone().add(end).multiplyScalar(0.5);
      const distance = start.distanceTo(end);
      const altitude = GLOBE_RADIUS * (1.1 + Math.min(distance * 0.16, 0.42));
      mid.normalize().multiplyScalar(altitude);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(64);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcMat = new THREE.LineDashedMaterial({
        color: 0x98cbb6,
        dashSize: 0.045,
        gapSize: 0.055,
        transparent: true,
        opacity: 0.24,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcLine.computeLineDistances();
      arcGeo.setDrawRange(0, 0);
      arcGroup.add(arcLine);
      routeSegments.push({ line: arcLine, material: arcMat, step: i, pointCount: points.length });
    }

    // 6. LUCES DE ESCENA CÁLIDA ESTILO ANIMACIÓN PIXAR
    const ambientLight = new THREE.AmbientLight(0xe8f2fa, 1.05);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffe2b3, 1.45);
    sunLight.position.set(5, 5, 4);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x78c3ed, 0.72);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // 7. POLVO ESTELAR Y CONSTELACIONES ALREDEDOR DEL GLOBO
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 210;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 8;
      starCoords[i + 1] = (Math.random() - 0.5) * 8;
      starCoords[i + 2] = -2.2;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xf2dfad,
      size: 0.026,
      transparent: true,
      opacity: 0.43,
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // 8. INTERACCIÓN DE ARRASTRE Y RAYCASTER (CLIC EN MONUMENTO)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragDistance = 0;
    let activePointerId: number | null = null;
    let lastFocusedId = '';
    let lastRouteIndex = -1;
    let routeStartedAt = 0;
    const domElement = renderer.domElement;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDragging = true;
      activePointerId = e.pointerId;
      dragDistance = 0;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      domElement.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || activePointerId !== e.pointerId) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x = Math.max(-Math.PI / 2.4, Math.min(Math.PI / 2.4, targetRotationRef.current.x + deltaY * 0.005));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (activePointerId !== e.pointerId) return;
      isDragging = false;
      activePointerId = null;

      // Si no hubo arrastre apreciable, verificar si se pulsó sobre un monumento
      if (dragDistance < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(monumentsGroup.children, true);

        if (intersects.length > 0) {
          let target = intersects[0].object;
          while (target.parent && !target.userData?.locationId) {
            target = target.parent as any;
          }
          const locId = target.userData?.locationId;
          if (locId) {
            const clickedLoc = locationsList.find((l) => l.id === locId);
            if (clickedLoc) {
              focusLocation(clickedLoc);
            }
          }
        }
      }
    };

    domElement.style.display = 'block';
    domElement.style.width = '100%';
    domElement.style.height = '100%';
    domElement.style.touchAction = 'pan-y';
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('pointercancel', onPointerUp);

    // 9. BUCLE DE RENDERIZADO CON ANIMACIÓN PIXAR
    let animationFrameId: number;
    let isInViewport = true;
    let hasRenderedFirstFrame = false;
    const clock = new THREE.Clock();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Giro suave automático
      if (isAutoRotatingRef.current && !isDragging && !isHoveredRef.current && !prefersReducedMotion) {
        targetRotationRef.current.y += 0.00048;
      }

      // Rotación independiente de nubes
      if (!prefersReducedMotion) cloudsMesh.rotation.y += 0.00022;

      // La ruta une los destinos del relato y se va dibujando a ritmo pausado.
      const routeIndex = Math.max(0, locationsList.findIndex((location) => location.id === selectedIdRef.current));
      if (routeIndex !== lastRouteIndex) {
        routeStartedAt = elapsedTime;
        routeSegments.forEach(({ material, step }) => {
          material.color.set(step < routeIndex ? 0xf2c879 : step === routeIndex ? 0xffdfa1 : 0x9fcbbd);
          material.opacity = step < routeIndex ? 0.62 : step === routeIndex ? 0.48 : 0.18;
        });
        lastRouteIndex = routeIndex;
      }
      const routeProgress = prefersReducedMotion
        ? 1
        : Math.min(1, Math.max(0, (elapsedTime - routeStartedAt) / 13.5));
      routeSegments.forEach(({ line, step, pointCount }) => {
        const visiblePoints = step < routeIndex
          ? pointCount
          : step === routeIndex && routeIndex < locationsList.length - 1
            ? Math.ceil(pointCount * routeProgress)
            : 0;
        line.geometry.setDrawRange(0, visiblePoints);
      });

      // Los hitos respiran suavemente y la parada activa recibe un halo de luz.
      const currentLocation = locationsList[routeIndex];
      if (currentLocation && currentLocation.id !== lastFocusedId) {
        const position = latLngToVector3(currentLocation.coordinates.lat, currentLocation.coordinates.lng, GLOBE_RADIUS * 1.035);
        const normal = position.clone().normalize();
        focusAura.position.copy(position);
        focusAura.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
        focusLight.position.copy(position.clone().multiplyScalar(1.08));
        lastFocusedId = currentLocation.id;
      }

      const auraPulse = prefersReducedMotion ? 1 : 0.96 + (Math.sin(elapsedTime * 1.1) + 1) * 0.045;
      focusAura.scale.set(auraPulse, auraPulse, 1);
      focusAuraMaterial.opacity = prefersReducedMotion ? 0.4 : 0.33 + (Math.sin(elapsedTime * 1.1) + 1) * 0.035;

      monumentMeshesRef.current.forEach((item) => {
        // Calcular si el monumento está en la cara visible hacia la cámara
        const worldNormal = item.normal.clone().applyEuler(globeGroup.rotation);
        const facingCamera = worldNormal.z;

        // Si es el monumento actualmente enfocado, destacar y escalar con suavidad
        const isCurrent = item.id === selectedIdRef.current;
        item.group.visible = isCurrent;
        const targetScale = isCurrent ? 1.08 : 1;
        const scale = item.group.scale.x + (targetScale - item.group.scale.x) * 0.075;
        item.group.scale.setScalar(scale);

        const markerPulse = isCurrent
          ? prefersReducedMotion ? 1.32 : 1.24 + (Math.sin(elapsedTime * 1.55) + 1) * 0.08
          : 1;
        item.marker.scale.setScalar(markerPulse);
        const markerMaterial = item.marker.material as THREE.MeshStandardMaterial;
        markerMaterial.emissive.copy(isCurrent ? focusMarkerColor : item.markerColor);
        markerMaterial.emissiveIntensity = isCurrent ? 1.05 : facingCamera > 0 ? 0.72 : 0.45;
      });

      // Suavizado inercial (lerp) del giro del globo
      currentRotationRef.current.x = lerpAngle(currentRotationRef.current.x, targetRotationRef.current.x, 0.07);
      currentRotationRef.current.y = lerpAngle(currentRotationRef.current.y, targetRotationRef.current.y, 0.07);
      currentRotationRef.current.z = lerpAngle(currentRotationRef.current.z, targetRotationRef.current.z, 0.07);

      globeGroup.rotation.set(
        currentRotationRef.current.x,
        currentRotationRef.current.y,
        currentRotationRef.current.z,
        'XYZ'
      );

      // Rotación suave del campo de estrellas
      if (!prefersReducedMotion) stars.rotation.y += 0.0003;

      renderer.render(scene, camera);
      if (!hasRenderedFirstFrame) {
        hasRenderedFirstFrame = true;
        setIsSceneReady(true);
      }
    };

    animate();

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isInViewport = entry.isIntersecting;
      if (isInViewport && !animationFrameId) {
        animate();
      } else if (!isInViewport && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    }, { threshold: 0.05 });
    intersectionObserver.observe(container);

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 520;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      intersectionObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerup', onPointerUp);
      domElement.removeEventListener('pointercancel', onPointerUp);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      earthTexture.dispose();
      cloudsTexture.dispose();
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [locationsList]);

  return (
    <section id="escena-mapa" className="relative z-10 overflow-hidden bg-[#f3f2e8] py-12 text-[#1d392f] transition-colors duration-300 dark:bg-[#071b19] dark:text-white sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_38%_at_50%_0%,rgba(132,204,167,0.25),transparent_75%)] dark:bg-[radial-gradient(ellipse_65%_38%_at_50%_0%,rgba(16,185,129,0.14),transparent_75%)]" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto mb-9 max-w-3xl text-center sm:mb-14">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#d8c7a5] bg-[#f7f1e1] shadow-[0_12px_32px_rgba(25,74,53,0.16)] ring-4 ring-white/70 dark:border-sky-200/30 dark:bg-[#132d3a] dark:ring-slate-900/60 sm:mb-5 sm:h-20 sm:w-20">
            <NauticalRose locale={locale} />
          </div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-800/10 bg-white/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-900 shadow-sm dark:border-emerald-300/15 dark:bg-emerald-950/50 dark:text-emerald-200">
            <Globe className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
            <span>{locale === 'en' ? 'Curileta’s illustrated atlas' : 'El atlas ilustrado de Curileta'}</span>
            <span className="h-1 w-1 rounded-full bg-amber-500" />
            <span>{locationsList.length} {locale === 'en' ? 'stops' : 'paradas'}</span>
          </div>
          <h2 className="font-display text-3xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#19382e] dark:text-white sm:text-5xl md:text-6xl">
            {copy('El mapa cobra vida.', 'Her map comes to life.')}
            <span className="mt-1 block bg-gradient-to-r from-emerald-700 via-teal-600 to-sky-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-teal-200 dark:to-sky-300">
              {copy('Cada parada guarda una historia.', 'Every stop holds a story.')}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-6 text-[#53675c] dark:text-slate-300 sm:mt-5 sm:text-lg sm:leading-7">
            {copy(
              'Gira el globo y elige una parada. El monumento de ese capítulo aparece en 3D sobre su coordenada y se ilumina mientras la ruta del libro se va trazando.',
              'Turn the globe and choose a stop. Its chapter landmark appears in 3D at its coordinates and lights up while the book’s route is drawn.'
            )}
          </p>
          <button
            type="button"
            onClick={() => isRoutePlaying ? setIsRoutePlaying(false) : startStoryRoute()}
            aria-pressed={isRoutePlaying}
            className={`mt-6 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold shadow-[0_12px_28px_rgba(26,69,51,0.18)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${isRoutePlaying ? 'bg-amber-300 text-[#17372c] hover:bg-amber-200' : 'bg-[#1c493b] text-white hover:bg-[#27634e]'}`}
          >
            {isRoutePlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            <span>{isRoutePlaying ? copy('Pausar el recorrido', 'Pause the journey') : copy('Recorrer la ruta del libro', 'Follow the book route')}</span>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">{activeIndex + 1}/{locationsList.length}</span>
          </button>
        </div>

        {/* Panel Cartográfico 3D y Tarjeta de Destino */}
        <div className="relative grid grid-cols-1 items-start gap-6 overflow-hidden rounded-[2rem] border border-[#d9e3d6] bg-[#fffdf7] p-4 shadow-[0_28px_90px_rgba(25,67,48,0.12)] dark:border-emerald-500/20 dark:bg-[#0d2521] sm:gap-8 sm:p-7 lg:grid-cols-12 lg:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_45%_at_50%_0%,rgba(221,238,220,0.45),transparent)] dark:bg-[radial-gradient(ellipse_75%_45%_at_50%_0%,rgba(16,185,129,0.08),transparent)]" />

          {/* Selector rápido de destinos con iconos de monumentos */}
          <div role="group" aria-label={copy('Paradas del viaje', 'Journey stops')} className="relative z-10 -mx-1 flex snap-x snap-mandatory flex-nowrap items-center justify-start gap-2 overflow-x-auto border-b border-[#e7e9dd] px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-slate-700/80 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-5 lg:col-span-12">
            {locationsList.map((loc, index) => {
              const isSelected = selectedId === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => focusLocation(loc)}
                  className={`inline-flex min-h-10 shrink-0 snap-start items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#1c493b] text-white shadow-md shadow-emerald-950/15 ring-2 ring-emerald-700/15 dark:bg-emerald-300 dark:text-[#0c211c]'
                      : 'border border-[#dce4d9] bg-white/80 text-[#506359] hover:border-emerald-700/35 hover:bg-emerald-50 hover:text-emerald-950 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80 dark:hover:text-white'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`${copy('Ir a la parada', 'Go to stop')} ${index + 1}: ${loc.country[locale] || loc.country.es}`}
                >
                  <span className={`font-mono text-[10px] ${isSelected ? 'text-amber-200 dark:text-emerald-900' : 'text-emerald-700/70 dark:text-emerald-300/70'}`}>{String(index + 1).padStart(2, '0')}</span>
                  <span>{loc.country[locale] || loc.country.es}</span>
                </button>
              );
            })}
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-20 flex w-9 items-center justify-center bg-gradient-to-l from-[#fffdf7] via-[#fffdf7]/90 to-transparent text-emerald-800 dark:from-[#0d2521] dark:via-[#0d2521]/90 dark:text-emerald-200 sm:hidden">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Visualizador 3D Three.js */}
          <div className="relative z-10 flex flex-col items-center lg:col-span-8">
            {/* Contenedor del lienzo 3D */}
            <div className="relative isolate w-full overflow-hidden rounded-[1.75rem] border border-[#b7d3e6] bg-[#123c5a] shadow-[0_22px_65px_rgba(20,69,105,0.22)] dark:border-sky-300/20">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(89,166,222,0.36),transparent_44%),radial-gradient(ellipse_at_50%_115%,rgba(250,196,112,0.2),transparent_55%),linear-gradient(145deg,#174668,#153957_55%,#1a3c51)]" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(204,231,250,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(204,231,250,.14)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_74%)]" />
              <div
                ref={mountRef}
                onPointerEnter={() => { isHoveredRef.current = true; }}
                onPointerLeave={() => { isHoveredRef.current = false; }}
                className="relative z-10 flex aspect-square w-full select-none items-center justify-center touch-pan-y [cursor:grab] active:[cursor:grabbing] sm:max-h-[520px] lg:aspect-[1.1] lg:max-h-[680px]"
                aria-label={locale === 'en' ? 'Interactive 3D globe. Drag to turn it or select a stop above.' : 'Globo 3D interactivo. Arrastra para girarlo o elige una parada arriba.'}
              >
                {!isSceneReady && webglSupported && (
                  <div role="status" aria-live="polite" className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 text-emerald-50">
                    <Globe className="h-9 w-9 animate-[spin_14s_linear_infinite] text-emerald-200" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                      {copy('Preparando el atlas', 'Preparing the atlas')}
                    </span>
                  </div>
                )}
                {!webglSupported && (
                <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-100 to-emerald-50 dark:from-slate-950 dark:to-emerald-950/80 rounded-2xl border border-amber-400/40 relative overflow-hidden">
                  <div className="relative w-64 h-64 flex items-center justify-center my-4">
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-4 rounded-full border-2 border-dashed border-amber-400/50 animate-[spin_15s_linear_infinite_reverse]" />
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-white via-slate-100 to-emerald-100 dark:from-emerald-950 dark:via-slate-900 dark:to-emerald-900 border-2 border-amber-400/70 shadow-2xl flex flex-col items-center justify-center text-center p-3">
                      <Compass className="w-9 h-9 text-amber-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-300 mt-1">
                        {activeDestination.country[locale] || activeDestination.country.es}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300 text-center">
                    {copy('Atlas esférico de la expedición • Selecciona un destino arriba para enfocarlo', 'Expedition globe • Select a destination above to focus the view')}
                  </p>
                  </div>
                )}
              </div>
              <div className="pointer-events-none absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#0b2728]/65 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/85 shadow-lg backdrop-blur-md sm:bottom-5 sm:left-5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(253,224,71,.9)]" />
                {copy('Arrastra el planeta para girarlo', 'Drag the globe to turn it')}
              </div>
            </div>

            {/* Controles de navegación secuencial y cámara 3D */}
            <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-2">
              {/* Botón Parada Anterior */}
              <button
                onClick={handlePrevLocation}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-amber-300 hover:bg-amber-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-amber-400 dark:hover:text-slate-950 sm:flex-none"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>{copy('Parada anterior', 'Previous stop')}</span>
              </button>

              {/* Indicador de Etapa y Controles de Cámara */}
              <div className="order-first flex w-full items-center justify-center gap-2 rounded-full border border-[#d8e1d5] bg-white px-3.5 py-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-950/90 sm:order-none sm:w-auto">
                <span className="text-[11px] font-mono font-black text-amber-600 dark:text-amber-400 tracking-wider">
                  {copy('ETAPA', 'STOP')} {activeIndex + 1}/{locationsList.length}
                </span>
                <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-800" />
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  title={isAutoRotating ? copy('Pausar giro automático', 'Pause automatic rotation') : copy('Activar giro automático', 'Start automatic rotation')}
                >
                  {isAutoRotating ? <Pause className="w-3 h-3 text-amber-500" /> : <Play className="w-3 h-3 text-emerald-500" />}
                  <span className="hidden sm:inline">{isAutoRotating ? copy('Pausar', 'Pause') : copy('Girar', 'Rotate')}</span>
                </button>
                <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-800" />
                <button
                  onClick={() => focusLocation(activeDestination)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors cursor-pointer"
                  title={copy('Recentrar vista en el destino actual', 'Recenter on the current destination')}
                >
                  <RotateCcw className="w-3 h-3 text-sky-500" />
                  <span className="hidden sm:inline">{copy('Recentrar', 'Recenter')}</span>
                </button>
              </div>

              {/* Botón Siguiente Parada */}
              <button
                onClick={handleNextLocation}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-amber-300 hover:bg-amber-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-amber-400 dark:hover:text-slate-950 sm:flex-none"
              >
                <span>{copy('Siguiente parada', 'Next stop')}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Ficha de Expedición del Destino Seleccionado */}
          <div className="relative z-10 rounded-[1.75rem] border border-[#e7dfc7] bg-gradient-to-b from-[#fffefa] via-white to-[#fbfaf3] p-5 shadow-[0_18px_55px_rgba(65,68,44,0.08)] dark:border-amber-300/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:p-7 lg:col-span-4">
            {/* Distintivo de Pasaporte y Monumento 3D Oficial */}
            <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-2.5 py-1 font-mono text-[11px] font-bold text-[#342a17] shadow-sm">
                  <span>{activeMonumentName}</span>
                </span>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{copy('SELLO', 'STAMP')}: {activeDestination.passportStamp?.code || 'EXP-00'}</span>
                </div>
              </div>
              <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {activeDestination.coordinates.lat > 0 ? `${activeDestination.coordinates.lat}°N` : `${Math.abs(activeDestination.coordinates.lat)}°S`},{' '}
                {activeDestination.coordinates.lng > 0 ? `${activeDestination.coordinates.lng}°E` : `${Math.abs(activeDestination.coordinates.lng)}°W`}
              </div>
            </div>

            {/* Título del Destino */}
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {activeDestination.name[locale] || activeDestination.name.es}
            </h3>
            <span className="inline-block text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">
              {activeDestination.country[locale] || activeDestination.country.es}
            </span>

            {/* Tema y Clima */}
            <div className="mt-4 flex flex-wrap gap-2">
              {activeDestination.climate && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  🌤️ {activeDestination.climate[locale] || activeDestination.climate.es}
                </span>
              )}
              {activeDestination.theme && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300">
                  🗺️ {activeDestination.theme[locale] || activeDestination.theme.es}
                </span>
              )}
            </div>

            {/* Descripción Narrativa */}
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeDestination.description[locale] || activeDestination.description.es}
            </p>

            {/* Curiosidades del Destino */}
            {activeDestination.curiosities && activeDestination.curiosities.length > 0 && (
              <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-900/90 border border-amber-200 dark:border-slate-800/80">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{locale === 'en' ? 'A little discovery' : 'Una pequeña curiosidad'}</span>
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  «{activeDestination.curiosities[0][locale] || activeDestination.curiosities[0].es}»
                </p>
              </div>
            )}

            {/* Personajes de la expedición en este punto con Avatar 3D */}
            {activeDestination.characters && activeDestination.characters.length > 0 && (
              <div className="mt-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  {locale === 'en' ? 'Friends in this moment:' : 'Amigos en este momento:'}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {activeDestination.characters.map((charSlug) => {
                    const label =
                      charSlug === 'curileta'
                        ? copy('Curileta', 'Curileta')
                        : charSlug === 'pompon'
                        ? copy('Pompón', 'Pompón')
                        : charSlug === 'quetzal'
                        ? copy('Quetzal', 'Quetzal')
                        : charSlug === 'lulu'
                        ? copy('Lulú la Llama', 'Lulú the Llama')
                        : charSlug === 'emi'
                        ? copy('Emi el Escarabajo', 'Emi the Beetle')
                        : charSlug === 'picu'
                        ? copy('Picu el Frailecillo', 'Picu the Puffin')
                        : charSlug === 'zipi-bot'
                        ? 'Zipi-Bot'
                        : charSlug === 'canguro-mama'
                        ? copy('Mamá Canguro', 'Mama Kangaroo')
                        : charSlug === 'canguro-bebe'
                        ? copy('Bebé Canguro', 'Baby Kangaroo')
                        : charSlug === 'joey'
                        ? copy('Joey (koala de peluche)', 'Joey (plush koala)')
                        : charSlug === 'kiki'
                        ? copy('Kiki el Kiwi', 'Kiki the Kiwi')
                        : charSlug === 'bao'
                        ? copy('Bao el Panda', 'Bao the Panda')
                        : charSlug === 'gino'
                        ? copy('Gino el Ratoncito', 'Gino the Mouse')
                        : charSlug === 'lola'
                        ? copy('Lola la Tortuga', 'Lola the Tortoise')
                        : charSlug;
                    return (
                      <div
                        key={charSlug}
                        className="inline-flex items-center gap-2 pr-3 pl-1 py-1 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm"
                      >
                        <CharacterAvatarImage
                          slug={charSlug}
                          name={label}
                          size={32}
                          alt=""
                          className="border border-amber-400/40"
                        />
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Nota canónica sobre Pompón */}
                {!activeDestination.characters.includes('pompon') && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-300/80 italic mt-2.5">
                    {locale === 'en'
                      ? '* Pompón stays in the Enchanted Forest and receives Curileta’s letters.'
                      : '* Pompón espera las cartas de Curileta en el Bosque Encantado.'}
                  </p>
                )}
              </div>
            )}

            {/* Story itinerary and full atlas */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setIsMilestonesModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-black transition-all cursor-pointer shadow-lg shadow-amber-400/20"
              >
                <BookOpen className="w-4 h-4" />
                <span>{locale === 'en' ? `Story moments (${milestones.length})` : `Momentos del relato (${milestones.length})`}</span>
              </button>

              <a
                href={`/${locale}/mundo`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white group"
              >
                <span>{locale === 'en' ? 'Full atlas' : 'Atlas completo'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive story itinerary */}
      {isMilestonesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden">
            {/* Cabecera del Modal */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{locale === 'en' ? 'Story itinerary' : 'Itinerario del relato'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {locale === 'en'
                    ? `${milestones.length} story moments — The Adventures of Curileta`
                    : `${milestones.length} momentos del relato — Las Aventuras de Curileta`}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {locale === 'en' ? 'Browse the moments recorded in the itinerary.' : 'Explora los momentos recogidos en el itinerario.'}
                </p>
              </div>
              <button
                onClick={() => setIsMilestonesModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title={locale === 'en' ? 'Close itinerary' : 'Cerrar itinerario'}
                aria-label={locale === 'en' ? 'Close itinerary' : 'Cerrar itinerario'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aclaraciones Canónicas destacadas */}
            <div className="my-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/40 flex items-start gap-3 shrink-0">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-900 dark:text-amber-200/90 leading-relaxed space-y-1">
                <p>
                  <strong>{locale === 'en' ? '• Pompón stays in the Enchanted Forest:' : '• Pompón se queda en el Bosque Encantado:'}</strong>{' '}
                  {locale === 'en'
                    ? 'He receives Curileta’s letters while she travels.'
                    : 'Recibe las cartas de Curileta mientras ella viaja.'}
                </p>
                <p>
                  <strong>{locale === 'en' ? '• Joey is a koala plush:' : '• Joey es un koala de peluche:'}</strong>{' '}
                  {locale === 'en'
                    ? 'The kangaroo joey’s toy that Curileta rescues at Uluru.'
                    : 'El juguete del bebé canguro que Curileta rescata en Uluru.'}
                </p>
                <p>
                  <strong>{locale === 'en' ? '• Places mentioned in passing:' : '• Lugares mencionados como curiosidad:'}</strong>{' '}
                  {locale === 'en'
                    ? 'Some places appear as facts or references rather than confirmed stops on the route.'
                    : 'Algunos lugares aparecen como datos o referencias, no como paradas confirmadas del recorrido.'}
                </p>
              </div>
            </div>

            {/* Buscador de hitos */}
            <div className="relative mb-3 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={locale === 'en' ? 'Search places, countries or story moments…' : 'Buscar lugares, países o momentos del relato…'}
                value={milestoneSearch}
                onChange={(e) => setMilestoneSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Scrollable story itinerary */}
            <div className="overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-amber-400/30">
              {milestones
                .filter((m) => {
                  if (!milestoneSearch.trim()) return true;
                  const q = milestoneSearch.toLowerCase();
                  const place = (m.place[locale] || m.place.es).toLowerCase();
                  const country = (m.country[locale] || m.country.es).toLowerCase();
                  const text = (m.whatHappens[locale] || m.whatHappens.es).toLowerCase();
                  return place.includes(q) || country.includes(q) || text.includes(q);
                })
                .map((m) => (
                  <div
                    key={m.order}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-amber-400/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0">
                          {m.order}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {m.place[locale] || m.place.es}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        {m.country[locale] || m.country.es}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                      {m.whatHappens[locale] || m.whatHappens.es}
                    </p>

                    <div className="mt-2 pl-8 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">
                        {locale === 'en' ? 'Present:' : 'Presentes:'}
                      </span>
                      {m.charactersPresent.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 capitalize"
                        >
                          {c === 'curileta'
                            ? 'Curileta'
                            : c === 'canguro-mama'
                            ? locale === 'en' ? 'Mama Kangaroo' : 'Mamá Canguro'
                            : c === 'canguro-bebe'
                            ? locale === 'en' ? 'Baby Kangaroo' : 'Bebé Canguro'
                            : c === 'joey' || c === 'joey-canguro'
                            ? locale === 'en' ? 'Joey (plush koala)' : 'Joey (koala de peluche)'
                            : c}
                        </span>
                      ))}
                      {m.isTravesia && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700">
                          {locale === 'en' ? 'Boat journey' : 'Travesía en barco'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
