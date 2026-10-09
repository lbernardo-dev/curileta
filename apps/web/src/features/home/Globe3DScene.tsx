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
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Mountain,
  Sun,
  Snowflake,
  Award,
  BookOpen,
  X,
  Search,
  Info,
} from 'lucide-react';
import { Location, NarrativeMilestone } from '@curileta/cms';

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
  const [selectedId, setSelectedId] = useState<string>('mexico');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isMilestonesModalOpen, setIsMilestonesModalOpen] = useState<boolean>(false);
  const [milestoneSearch, setMilestoneSearch] = useState<string>('');

  // Destinos por defecto si no vienen pasados
  const locationsList: Location[] = useMemo(() => {
    if (initialLocations && initialLocations.length > 0) return initialLocations;
    return [
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
        name: { es: 'Machu Picchu y Valle Sagrado', en: 'Machu Picchu & Sacred Valley' },
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
          alt: { es: 'Pirámides de Guiza', en: 'Pyramids of Giza' },
        },
        curiosities: [
          { es: 'El Nilo fluye de sur a norte a lo largo de más de 6.600 kilómetros.', en: 'The Nile flows South to North across more than 6,600 km.' },
        ],
        characters: ['curileta', 'emi'],
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
          alt: { es: 'Aurora boreal en Islandia', en: 'Aurora borealis in Iceland' },
        },
        curiosities: [
          { es: 'Islandia obtiene casi el 100% de su energía de la fuerza de la tierra (geotermia).', en: 'Iceland gets nearly 100% of its energy from geothermal power.' },
        ],
        characters: ['curileta', 'picu'],
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
          alt: { es: 'Monte Fuji coronado de nieve', en: 'Snowcapped Mount Fuji' },
        },
        curiosities: [
          { es: 'El Monte Fuji es en realidad tres volcanes superpuestos uno sobre otro.', en: 'Mount Fuji is actually three volcanoes stacked atop one another.' },
        ],
        characters: ['curileta', 'zipi-bot'],
      },
    ];
  }, [initialLocations]);

  const currentIndex = locationsList.findIndex((loc) => loc.id === selectedId);
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;
  const activeDestination = locationsList[activeIndex] || locationsList[0];

  const handlePrevLocation = () => {
    const prevIndex = (activeIndex - 1 + locationsList.length) % locationsList.length;
    focusLocation(locationsList[prevIndex]);
  };

  const handleNextLocation = () => {
    const nextIndex = (activeIndex + 1) % locationsList.length;
    focusLocation(locationsList[nextIndex]);
  };

  // Referencias para controlar Three.js desde React
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.2, y: 0 });
  const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0.2, y: 0 });
  const globeGroupRef = useRef<THREE.Group | null>(null);

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
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Limpiar contenido previo si hubiese
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Grupo principal del Globo
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    const GLOBE_RADIUS = 1.45;

    // 1. Esfera base del planeta (azul noche profundo / pergamino esmeralda)
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x062821,
      emissive: 0x021712,
      specular: 0x10b981,
      shininess: 25,
      transparent: true,
      opacity: 0.95,
    });
    const globeMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(globeMesh);

    // 2. Malla de meridianos y paralelos estilo cartografía mágica
    const wireframeGeometry = new THREE.WireframeGeometry(
      new THREE.SphereGeometry(GLOBE_RADIUS * 1.002, 24, 24)
    );
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.18,
    });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    globeGroup.add(wireframe);

    // 3. Anillos ecuatoriales y trópicos luminosos
    const equatorGeo = new THREE.RingGeometry(GLOBE_RADIUS * 1.01, GLOBE_RADIUS * 1.03, 64);
    const equatorMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const equator = new THREE.Mesh(equatorGeo, equatorMat);
    equator.rotation.x = Math.PI / 2;
    globeGroup.add(equator);

    // 4. Pines y Marcadores 3D para cada ubicación
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    locationsList.forEach((loc) => {
      const pos = latLngToVector3(loc.coordinates.lat, loc.coordinates.lng, GLOBE_RADIUS * 1.01);

      // Pin esférico con brillo
      const pinGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const pinColor = loc.passportStamp?.color ? new THREE.Color(loc.passportStamp.color) : new THREE.Color(0xf59e0b);
      const pinMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinGroup.add(pinMesh);

      // Anillo de pulso exterior
      const ringGeo = new THREE.RingGeometry(0.06, 0.08, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      pinGroup.add(ringMesh);

      // Línea radial conectora
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        pos,
        pos.clone().multiplyScalar(1.08),
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: pinColor, transparent: true, opacity: 0.8 });
      const line = new THREE.Line(lineGeo, lineMat);
      pinGroup.add(line);
    });

    // 4.5 Arcos aéreos 3D que conectan las paradas consecutivas de la expedición
    const arcGroup = new THREE.Group();
    globeGroup.add(arcGroup);

    for (let i = 0; i < locationsList.length - 1; i++) {
      const start = latLngToVector3(locationsList[i].coordinates.lat, locationsList[i].coordinates.lng, GLOBE_RADIUS * 1.01);
      const end = latLngToVector3(locationsList[i + 1].coordinates.lat, locationsList[i + 1].coordinates.lng, GLOBE_RADIUS * 1.01);

      const mid = start.clone().add(end).multiplyScalar(0.5);
      const distance = start.distanceTo(end);
      const altitude = GLOBE_RADIUS * (1.08 + Math.min(distance * 0.15, 0.45));
      mid.normalize().multiplyScalar(altitude);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(36);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineDashedMaterial({
        color: 0xf59e0b,
        dashSize: 0.08,
        gapSize: 0.05,
        transparent: true,
        opacity: 0.65,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcLine.computeLineDistances();
      arcGroup.add(arcLine);
    }

    // 5. Luces de escena (ambiental, luz direccional dorada y luz de borde celeste)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef3c7, 1.8);
    sunLight.position.set(5, 4, 3);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // 6. Polvo estelar / partículas mágicas alrededor del globo
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 12;
      starCoords[i + 1] = (Math.random() - 0.5) * 12;
      starCoords[i + 2] = (Math.random() - 0.5) * 12;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xfcd34d,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // 7. Interacción de arrastre con ratón / toque
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
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

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x = Math.max(
        -Math.PI / 2.5,
        Math.min(Math.PI / 2.5, targetRotationRef.current.x + deltaY * 0.005)
      );

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Bucle de renderizado con interpolación suave
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto-rotación cuando no se interactúa
      if (isAutoRotating && !isDragging && !isHovered) {
        targetRotationRef.current.y += 0.0018;
      }

      // Suavizado inercial (lerp)
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.07;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.07;

      globeGroup.rotation.x = currentRotationRef.current.x;
      globeGroup.rotation.y = currentRotationRef.current.y;

      // Rotación sutil de estrellas
      stars.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Manejo de redimensionamiento
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
  }, [locationsList, isAutoRotating, isHovered]);

  return (
    <section id="escena-mapa" className="relative py-28 bg-slate-950 text-white overflow-hidden">
      {/* Trazado estético superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-400 shadow-[0_0_20px_rgba(245,158,11,0.8)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg backdrop-blur-md">
            <Globe className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '15s' }} />
            <span>Escena 02 — Cartografía 3D Interactiva</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            El Globo se ilumina.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-300 to-sky-300">
              La Tierra te llama en 3D.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Arrastra el globo terráqueo con el ratón o el dedo, explora los meridianos luminosos y pulsa en cualquier destino para enfocar su cuaderno de expedición oficial.
          </p>
        </div>

        {/* Panel Cartográfico 3D y Tarjeta de Destino */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Fondo estético de rejilla */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(16,185,129,0.1),transparent)] pointer-events-none" />

          {/* Selector rápido de destinos */}
          <div className="lg:col-span-12 flex flex-wrap items-center justify-center gap-2 pb-4 border-b border-slate-800">
            {locationsList.map((loc) => {
              const isSelected = selectedId === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => focusLocation(loc)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 scale-105 font-black'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700'
                  }`}
                  aria-pressed={isSelected}
                >
                  <MapPin className="w-3.5 h-3.5" />
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
              aria-label="Globo terráqueo interactivo en 3D"
            >
              {!webglSupported && (
                <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-950 to-emerald-950/80 rounded-2xl border border-amber-400/40 relative overflow-hidden">
                  {/* Anillos celestiales y esfera cartográfica animada */}
                  <div className="relative w-64 h-64 flex items-center justify-center my-4">
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-4 rounded-full border-2 border-dashed border-amber-400/50 animate-[spin_15s_linear_infinite_reverse]" />
                    <div className="absolute inset-8 rounded-full border border-sky-400/40 animate-[spin_30s_linear_infinite]" />
                    {/* Núcleo del planeta */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-950 via-slate-900 to-emerald-900 border-2 border-amber-400/70 shadow-2xl shadow-emerald-500/30 flex flex-col items-center justify-center text-center p-3 relative">
                      <Compass className="w-9 h-9 text-amber-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase text-amber-300 mt-1">
                        {activeDestination.country[locale] || activeDestination.country.es}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-300 text-center">
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
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/90 hover:bg-amber-400 hover:text-slate-950 text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer shadow-md group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Parada anterior</span>
              </button>

              {/* Indicador de Etapa y Controles de Cámara */}
              <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 px-3.5 py-1.5 rounded-full shadow-lg">
                <span className="text-[11px] font-mono font-black text-amber-400 tracking-wider">
                  ETAPA {activeIndex + 1}/{locationsList.length}
                </span>
                <div className="w-px h-3.5 bg-slate-800" />
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-amber-400 transition-colors"
                  title={isAutoRotating ? 'Pausar giro automático' : 'Reanudar giro automático'}
                >
                  {isAutoRotating ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                  <span className="hidden sm:inline">{isAutoRotating ? 'Pausar' : 'Girar'}</span>
                </button>
                <div className="w-px h-3.5 bg-slate-800" />
                <button
                  onClick={() => focusLocation(activeDestination)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-sky-400 transition-colors"
                  title="Recentrar vista en destino actual"
                >
                  <RotateCcw className="w-3 h-3 text-sky-400" />
                  <span className="hidden sm:inline">Recentrar</span>
                </button>
              </div>

              {/* Botón Siguiente Parada */}
              <button
                onClick={handleNextLocation}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/90 hover:bg-amber-400 hover:text-slate-950 text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer shadow-md group"
              >
                <span>Siguiente parada</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Ficha de Expedición del Destino Seleccionado */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-amber-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            {/* Distintivo de Pasaporte y Etapa */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 font-mono text-[11px] font-black border border-amber-500/30">
                  ETAPA {activeIndex + 1}/{locationsList.length}
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SELLO: {activeDestination.passportStamp?.code || 'EXP-00'}</span>
                </div>
              </div>
              <div className="text-xs font-mono text-emerald-400 font-bold">
                {activeDestination.coordinates.lat > 0 ? `${activeDestination.coordinates.lat}°N` : `${Math.abs(activeDestination.coordinates.lat)}°S`},{' '}
                {activeDestination.coordinates.lng > 0 ? `${activeDestination.coordinates.lng}°E` : `${Math.abs(activeDestination.coordinates.lng)}°W`}
              </div>
            </div>

            {/* Título del Destino */}
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {activeDestination.name[locale] || activeDestination.name.es}
            </h3>
            <span className="inline-block text-sm font-bold text-amber-400 mt-1">
              {activeDestination.country[locale] || activeDestination.country.es}
            </span>

            {/* Tema y Clima */}
            <div className="mt-4 flex flex-wrap gap-2">
              {activeDestination.climate && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
                  🌤️ {activeDestination.climate[locale] || activeDestination.climate.es}
                </span>
              )}
              {activeDestination.theme && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-300">
                  🗺️ {activeDestination.theme[locale] || activeDestination.theme.es}
                </span>
              )}
            </div>

            {/* Descripción Narrativa */}
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              {activeDestination.description[locale] || activeDestination.description.es}
            </p>

            {/* Curiosidades del Destino */}
            {activeDestination.curiosities && activeDestination.curiosities.length > 0 && (
              <div className="mt-5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Dato Curioso de Curileta</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  «{activeDestination.curiosities[0][locale] || activeDestination.curiosities[0].es}»
                </p>
              </div>
            )}

            {/* Personajes de la expedición en este punto */}
            {activeDestination.characters && activeDestination.characters.length > 0 && (
              <div className="mt-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Exploradores presentes:
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
                        : charSlug === 'joey-canguro'
                        ? 'Mamá Canguro & Bebé (con Joey)'
                        : charSlug === 'kiki'
                        ? 'Kiki el Kiwi'
                        : charSlug === 'bao'
                        ? 'Bao el Panda'
                        : charSlug === 'gino'
                        ? 'Gino el Ratoncito'
                        : charSlug === 'lola'
                        ? 'Lola la Tortuga'
                        : charSlug;
                    return (
                      <span
                        key={charSlug}
                        className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-900/60 text-emerald-200 border border-emerald-700/50"
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
                {/* Nota canónica sobre Pompón */}
                {!activeDestination.characters.includes('pompon') && (
                  <p className="text-[11px] text-amber-300/80 italic mt-2.5">
                    * Pompón permanece en el Bosque Encantado custodiando el hogar y esperando las cartas de Curileta.
                  </p>
                )}
              </div>
            )}

            {/* Lugares mencionados como curiosidad (sin visita presencial) */}
            {activeDestination.mentionedPlaces && activeDestination.mentionedPlaces.length > 0 && (
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-400 block mb-1">
                  Mencionado en el libro como Curiosidad (sin visita presencial):
                </span>
                {activeDestination.mentionedPlaces.map((m) => (
                  <p key={m.id} className="text-xs text-slate-300">
                    <strong className="text-white">{m.name[locale] || m.name.es}:</strong>{' '}
                    {m.curiosityFact[locale] || m.curiosityFact.es}
                  </p>
                ))}
              </div>
            )}

            {/* Botones de acción: Bitácora de 41 Hitos & Cuaderno */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setIsMilestonesModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-black transition-all cursor-pointer shadow-lg shadow-amber-400/20"
              >
                <BookOpen className="w-4 h-4" />
                <span>Bitácora de 41 Hitos Narrativos</span>
              </button>

              <a
                href={`/${locale}/mundo`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white group"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden">
            {/* Cabecera del Modal */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Itinerario Canónico Oficial</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Lista de 41 Lugares y Escenarios — Las Aventuras de Curileta
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Recorrido narrativo cronológico exacto según el libro oficial.
                </p>
              </div>
              <button
                onClick={() => setIsMilestonesModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Cerrar bitácora"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aclaraciones Canónicas destacadas */}
            <div className="my-3 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 shrink-0">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-200/90 leading-relaxed space-y-1">
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
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
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
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-400/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0">
                          {m.order}
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {m.place[locale] || m.place.es}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0">
                        {m.country[locale] || m.country.es}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pl-8">
                      {m.whatHappens[locale] || m.whatHappens.es}
                    </p>

                    <div className="mt-2 pl-8 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">
                        Presentes:
                      </span>
                      {m.charactersPresent.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 capitalize"
                        >
                          {c === 'joey-canguro' ? 'Mamá Canguro & Bebé (con Joey)' : c}
                        </span>
                      ))}
                      {m.isTravesia && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-950 text-sky-300 border border-sky-700">
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
