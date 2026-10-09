'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Locale } from '@curileta/i18n';
import {
  Globe,
  Compass,
  Sparkles,
  MapPin,
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
import {
  createPixarEarthCanvas,
  createPixarCloudsCanvas,
} from './globe/pixarEarthTexture';
import {
  createPixarMonumentMesh,
  createPixarBadgeSprite,
  getMonumentConfig,
} from './globe/monumentModels';

interface Globe3DSceneProps {
  locale: Locale;
  locations?: Location[];
  milestones?: NarrativeMilestone[];
}

export const Globe3DScene: React.FC<Globe3DSceneProps> = ({
  locale,
  locations: initialLocations = [],
  milestones = [],
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>('espana-inicio');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
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

  const handlePrevLocation = () => {
    const prevIndex = (activeIndex - 1 + locationsList.length) % locationsList.length;
    focusLocation(locationsList[prevIndex]);
  };

  const handleNextLocation = () => {
    const nextIndex = (activeIndex + 1) % locationsList.length;
    focusLocation(locationsList[nextIndex]);
  };

  // Referencias para controlar Three.js
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.35, y: -Math.PI / 2 });
  const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0.35, y: -Math.PI / 2 });
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const monumentMeshesRef = useRef<
    Array<{
      id: string;
      group: THREE.Group;
      badge: THREE.Sprite;
      normal: THREE.Vector3;
      basePos: THREE.Vector3;
    }>
  >([]);

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
  const focusLocation = (loc: Location) => {
    setSelectedId(loc.id);
    const lat = loc.coordinates.lat;
    const lng = loc.coordinates.lng;

    // Calcular la rotación para encarar el punto hacia el observador (z positivo)
    const targetY = -((lng * Math.PI) / 180) - Math.PI / 2;
    const targetX = (lat * Math.PI) / 180;

    targetRotationRef.current = { x: targetX, y: targetY };
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Grupo principal del Globo
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    const GLOBE_RADIUS = 1.48;

    // 1. ESFERA DEL PLANETA CON TEXTURA PROCEDURAL PIXAR (Océanos zafiro/turquesa y continentes detallados)
    const earthCanvas = createPixarEarthCanvas();
    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.needsUpdate = true;

    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.08,
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
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // 4. MONUMENTOS 3D PROCEDURALES Y CARTELES ANIMADOS PIXAR PARA CADA DESTINO
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

      // Cartel / Emblema flotante 3D (Billboard sprite elevado para no tapar el monumento)
      const badgePos = pos.clone().multiplyScalar(1.26);
      const badge = createPixarBadgeSprite(loc.id);
      badge.position.copy(badgePos);
      badge.userData = { locationId: loc.id };
      monumentsGroup.add(badge);

      monumentMeshesRef.current.push({
        id: loc.id,
        group: monument,
        badge,
        normal,
        basePos: badgePos,
      });
    });

    // 5. RUTAS AÉREAS CURVAS ANIMADAS CON LÍNEAS DISCONTINUAS (EL SENDERO DE CURILETA)
    const arcGroup = new THREE.Group();
    globeGroup.add(arcGroup);
    const arcMaterials: THREE.LineDashedMaterial[] = [];

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
      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcMat = new THREE.LineDashedMaterial({
        color: 0xf59e0b,
        dashSize: 0.08,
        gapSize: 0.045,
        transparent: true,
        opacity: 0.75,
      });
      arcMaterials.push(arcMat);

      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcLine.computeLineDistances();
      arcGroup.add(arcLine);
    }

    // 6. LUCES DE ESCENA CÁLIDA ESTILO ANIMACIÓN PIXAR
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef3c7, 2.2);
    sunLight.position.set(5, 5, 4);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.4);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // 7. POLVO ESTELAR Y CONSTELACIONES ALREDEDOR DEL GLOBO
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 380;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 14;
      starCoords[i + 1] = (Math.random() - 0.5) * 14;
      starCoords[i + 2] = (Math.random() - 0.5) * 14;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.038,
      transparent: true,
      opacity: 0.7,
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // 8. INTERACCIÓN DE ARRASTRE Y RAYCASTER (CLIC EN MONUMENTO)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragDistance = 0;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      dragDistance = 0;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;
      dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x = Math.max(
        -Math.PI / 2.4,
        Math.min(Math.PI / 2.4, targetRotationRef.current.x + deltaY * 0.005)
      );

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      isDragging = false;

      // Si no hubo arrastre apreciable, verificar si se pulsó sobre un monumento
      if (dragDistance < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;

        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

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

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 9. BUCLE DE RENDERIZADO CON ANIMACIÓN PIXAR
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Giro suave automático
      if (isAutoRotating && !isDragging && !isHovered) {
        targetRotationRef.current.y += 0.0016;
      }

      // Rotación independiente de nubes
      cloudsMesh.rotation.y += 0.0007;

      // Animación de los trazos discontinuos de vuelo de Curileta
      arcMaterials.forEach((mat) => {
        (mat as any).dashOffset = ((mat as any).dashOffset || 0) - 0.015;
      });

      // Animación viva de los monumentos y carteles Pixar (idle bobbing + scale active + oclusión trasera)
      monumentMeshesRef.current.forEach((item, idx) => {
        // Calcular si el monumento está en la cara visible hacia la cámara
        const worldNormal = item.normal.clone().applyEuler(globeGroup.rotation);
        const facingCamera = worldNormal.z;
        const isVisible = facingCamera > 0.12;

        // Ocultar carteles en la cara posterior del globo para evitar solapamientos visuales
        item.badge.visible = isVisible;

        // Flotación suave del cartel con respiración vertical Pixar
        const bob = Math.sin(elapsedTime * 2.8 + idx) * 0.018;
        const targetPos = item.basePos.clone().add(item.normal.clone().multiplyScalar(bob));
        item.badge.position.copy(targetPos);

        // Si es el monumento actualmente enfocado, destacar y escalar con suavidad
        const isCurrent = item.id === selectedId;
        const targetScale = isCurrent ? 1.35 : 1.0;
        item.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        item.badge.scale.lerp(
          new THREE.Vector3(isCurrent ? 0.44 : 0.34, isCurrent ? 0.44 : 0.34, 1),
          0.1
        );
      });

      // Suavizado inercial (lerp) del giro del globo
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.07;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.07;

      globeGroup.rotation.x = currentRotationRef.current.x;
      globeGroup.rotation.y = currentRotationRef.current.y;

      // Rotación suave del campo de estrellas
      stars.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

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
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [locationsList, isAutoRotating, isHovered, selectedId]);

  return (
    <section id="escena-mapa" className="relative py-28 bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Trazado estético superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-400 shadow-[0_0_20px_rgba(245,158,11,0.8)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado con Quetzal 3D */}
        <div className="relative max-w-4xl mx-auto mb-14 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-amber-300 p-1 shadow-2xl shadow-emerald-500/30 group-hover:rotate-3 transition-transform duration-300">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center overflow-hidden relative">
                  <img
                    src="/images/characters/quetzal-main.webp"
                    alt="Quetzal el Guardián Alado"
                    className="w-24 h-24 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] group-hover:scale-115 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow border border-emerald-200">
                🌍 ORBITAL
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-widest mb-3 shadow-md backdrop-blur-md">
                <Globe className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-spin" style={{ animationDuration: '15s' }} />
                <span>Escena 02 — Cartografía 3D Animada Estilo Pixar</span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                El Globo se Ilumina.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-emerald-500 to-sky-500 dark:from-amber-300 dark:via-emerald-300 dark:to-sky-300">
                  Océanos, Continentes & Monumentos 3D.
                </span>
              </h2>
            </div>
          </div>

          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Descubre los continentes ilustrados, las aguas turquesas y los monumentos 3D del libro. Pulsa o arrastra el planeta para explorar las pirámides, templos, montañas y el gran árbol de Curileta.
          </p>
        </div>

        {/* Panel Cartográfico 3D y Tarjeta de Destino */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Fondo estético de rejilla */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(16,185,129,0.08),transparent)] pointer-events-none" />

          {/* Selector rápido de destinos con iconos de monumentos */}
          <div className="lg:col-span-12 flex flex-wrap items-center justify-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            {locationsList.map((loc) => {
              const isSelected = selectedId === loc.id;
              const monument = getMonumentConfig(loc.id);
              return (
                <button
                  key={loc.id}
                  onClick={() => focusLocation(loc)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 scale-105 font-black ring-2 ring-amber-400/50'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span>{monument.emoji}</span>
                  <span>{loc.country[locale] || loc.country.es}</span>
                </button>
              );
            })}
          </div>

          {/* Visualizador 3D Three.js */}
          <div className="lg:col-span-7 relative flex flex-col items-center">
            {/* Contenedor del lienzo 3D */}
            <div
              ref={mountRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full aspect-square max-h-[480px] sm:max-h-[520px] rounded-2xl flex items-center justify-center relative cursor-grab active:cursor-grabbing select-none"
              aria-label="Globo terráqueo animado en 3D con monumentos estilo Pixar"
            >
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
                    Carta Esférica de Expedición • Selecciona un país arriba para enfocar
                  </p>
                </div>
              )}
            </div>

            {/* Controles de navegación secuencial y cámara 3D */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
              {/* Botón Parada Anterior */}
              <button
                onClick={handlePrevLocation}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-400 hover:text-slate-950 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-md group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Parada anterior</span>
              </button>

              {/* Indicador de Etapa y Controles de Cámara */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-full shadow-lg">
                <span className="text-[11px] font-mono font-black text-amber-600 dark:text-amber-400 tracking-wider">
                  ETAPA {activeIndex + 1}/{locationsList.length}
                </span>
                <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-800" />
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  title={isAutoRotating ? 'Pausar giro automático' : 'Reanudar giro automático'}
                >
                  {isAutoRotating ? <Pause className="w-3 h-3 text-amber-500" /> : <Play className="w-3 h-3 text-emerald-500" />}
                  <span className="hidden sm:inline">{isAutoRotating ? 'Pausar' : 'Girar'}</span>
                </button>
                <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-800" />
                <button
                  onClick={() => focusLocation(activeDestination)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors cursor-pointer"
                  title="Recentrar vista en destino actual"
                >
                  <RotateCcw className="w-3 h-3 text-sky-500" />
                  <span className="hidden sm:inline">Recentrar</span>
                </button>
              </div>

              {/* Botón Siguiente Parada */}
              <button
                onClick={handleNextLocation}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-400 hover:text-slate-950 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-md group"
              >
                <span>Siguiente parada</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Ficha de Expedición del Destino Seleccionado */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-amber-400/40 dark:border-amber-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            {/* Distintivo de Pasaporte y Monumento 3D Oficial */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-mono text-[11px] font-black shadow-md flex items-center gap-1">
                  <span>{activeMonumentConfig.emoji}</span>
                  <span>{activeMonumentConfig.name}</span>
                </span>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>SELLO: {activeDestination.passportStamp?.code || 'EXP-00'}</span>
                </div>
              </div>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
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
                  <span>Dato Curioso de Curileta</span>
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
                  Exploradores presentes en este hito:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {activeDestination.characters.map((charSlug) => {
                    const label =
                      charSlug === 'curileta'
                        ? 'Curileta'
                        : charSlug === 'pompon'
                        ? 'Pompón'
                        : charSlug === 'quetzal'
                        ? 'Quetzal'
                        : charSlug === 'lulu'
                        ? 'Lulú la Llama'
                        : charSlug === 'emi'
                        ? 'Emi el Escarabajo'
                        : charSlug === 'picu'
                        ? 'Picu el Frailecillo'
                        : charSlug === 'zipi-bot'
                        ? 'Zipi-Bot'
                        : charSlug === 'canguro-mama'
                        ? 'Mamá Canguro'
                        : charSlug === 'canguro-bebe'
                        ? 'Bebé Canguro'
                        : charSlug === 'joey'
                        ? 'Joey (Peluche)'
                        : charSlug === 'kiki'
                        ? 'Kiki el Kiwi'
                        : charSlug === 'bao'
                        ? 'Bao el Panda'
                        : charSlug === 'gino'
                        ? 'Gino el Ratoncito'
                        : charSlug === 'lola'
                        ? 'Lola la Tortuga'
                        : charSlug;
                    const charImg = `/images/characters/${charSlug}-main.webp`;
                    return (
                      <div
                        key={charSlug}
                        className="inline-flex items-center gap-2 pr-3 pl-1 py-1 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm"
                      >
                        <div className="w-7 h-7 rounded-xl bg-slate-950 p-0.5 overflow-hidden shrink-0 border border-amber-400/40">
                          <img
                            src={charImg}
                            alt={label}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
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
                    * Pompón permanece en el Bosque Encantado custodiando el hogar y esperando las cartas de Curileta.
                  </p>
                )}
              </div>
            )}

            {/* Botones de acción: Bitácora de 41 Hitos & Cuaderno */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setIsMilestonesModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-black transition-all cursor-pointer shadow-lg shadow-amber-400/20"
              >
                <BookOpen className="w-4 h-4" />
                <span>Bitácora de 41 Hitos Narrativos</span>
              </button>

              <a
                href={`/${locale}/mundo`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white group"
              >
                <span>Cuaderno completo</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Interactivo: Los 41 Hitos Narrativos del Libro */}
      {isMilestonesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden">
            {/* Cabecera del Modal */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Itinerario Canónico Oficial</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Lista de 41 Lugares y Escenarios — Las Aventuras de Curileta
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Recorrido narrativo cronológico exacto según el libro oficial.
                </p>
              </div>
              <button
                onClick={() => setIsMilestonesModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Cerrar bitácora"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aclaraciones Canónicas destacadas */}
            <div className="my-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/40 flex items-start gap-3 shrink-0">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-900 dark:text-amber-200/90 leading-relaxed space-y-1">
                <p>
                  <strong>• Pompón permanece en el Bosque Encantado:</strong> Recibe las cartas de Curileta pero no viaja físicamente por el mundo.
                </p>
                <p>
                  <strong>• Joey es el koala de peluche:</strong> El juguete del bebé canguro que Curileta rescata en Uluru.
                </p>
                <p>
                  <strong>• Lugares mencionados como curiosidad:</strong> Chichén Itzá, Cusco, Nazca, Río Nilo, Fosa de las Marianas, Rotorua y Segovia aparecen como datos compartidos sin visita presencial confirmada.
                </p>
              </div>
            </div>

            {/* Buscador de hitos */}
            <div className="relative mb-3 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por lugar, país o acontecimiento..."
                value={milestoneSearch}
                onChange={(e) => setMilestoneSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Lista con scroll de los 41 hitos */}
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
                        Presentes:
                      </span>
                      {m.charactersPresent.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 capitalize"
                        >
                          {c === 'joey-canguro' ? 'Mamá Canguro & Bebé (con Joey)' : c}
                        </span>
                      ))}
                      {m.isTravesia && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700">
                          Travesía en barco
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
