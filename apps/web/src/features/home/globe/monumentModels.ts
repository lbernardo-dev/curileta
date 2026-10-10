import * as THREE from 'three';
import { createPixarBadgeCanvas } from './pixarEarthTexture';

export interface MonumentConfig {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export const MONUMENT_CONFIGS: Record<string, MonumentConfig> = {
  'espana-inicio': {
    id: 'espana-inicio',
    name: 'El Gran Árbol Mágico',
    emoji: '🌳',
    color: '#10b981',
  },
  mexico: {
    id: 'mexico',
    name: 'Pirámide del Sol',
    emoji: '🏛️',
    color: '#f59e0b',
  },
  peru: {
    id: 'peru',
    name: 'Machu Picchu',
    emoji: '🏔️',
    color: '#059669',
  },
  egipto: {
    id: 'egipto',
    name: 'Pirámides de Giza',
    emoji: '🔺',
    color: '#eab308',
  },
  islandia: {
    id: 'islandia',
    name: 'Laguna Azul & Géiser',
    emoji: '❄️',
    color: '#38bdf8',
  },
  japon: {
    id: 'japon',
    name: 'Monte Fuji & Torii',
    emoji: '⛩️',
    color: '#ef4444',
  },
  australia: {
    id: 'australia',
    name: 'Uluru Sagrado',
    emoji: '🪨',
    color: '#ea580c',
  },
  'nueva-zelanda': {
    id: 'nueva-zelanda',
    name: 'Hobbiton & Waitomo',
    emoji: '🏡',
    color: '#84cc16',
  },
  china: {
    id: 'china',
    name: 'La Gran Muralla',
    emoji: '🏯',
    color: '#dc2626',
  },
  italia: {
    id: 'italia',
    name: 'Coliseo & Torre Pisa',
    emoji: '🏛️',
    color: '#d97706',
  },
  francia: {
    id: 'francia',
    name: 'Torre Eiffel',
    emoji: '🗼',
    color: '#6366f1',
  },
  'espana-regreso': {
    id: 'espana-regreso',
    name: 'El Gran Reencuentro',
    emoji: '📬',
    color: '#10b981',
  },
};

export function getMonumentConfig(id: string): MonumentConfig {
  return (
    MONUMENT_CONFIGS[id] || {
      id,
      name: 'Hito de Expedición',
      emoji: '🗺️',
      color: '#f59e0b',
    }
  );
}

// CONSTRUCTOR DE MODELOS 3D PROCEDURALES ESTILO PIXAR PARA CADA MONUMENTO
// Con escala visual ampliada (~1.8x - 2.2x), geometría volumétrica rica y colores vibrantes.
export function createPixarMonumentMesh(id: string): THREE.Group {
  const group = new THREE.Group();
  const SCALE = 1.85;

  switch (id) {
    // --- 1. ESPAÑA: EL GRAN ÁRBOL MÁGICO Y CABAÑA (BOSQUE ENCANTADO) ---
    case 'espana-inicio':
    case 'espana-regreso': {
      const treeScale = SCALE * 0.78;
      // Árbol de copas escalonadas y tronco visible desde la vista orbital.
      const trunkGeo = new THREE.CylinderGeometry(0.015 * treeScale, 0.026 * treeScale, 0.12 * treeScale, 8);
      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x76513a,
        roughness: 0.92,
      });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.06 * treeScale;
      group.add(trunk);

      const foliageMaterials = [
        new THREE.MeshStandardMaterial({ color: 0x47724c, roughness: 0.88 }),
        new THREE.MeshStandardMaterial({ color: 0x5d8755, roughness: 0.86 }),
        new THREE.MeshStandardMaterial({ color: 0x78965b, roughness: 0.84 }),
      ];
      const canopyLevels = [
        { radius: 0.078, height: 0.08, y: 0.13 },
        { radius: 0.061, height: 0.07, y: 0.19 },
        { radius: 0.044, height: 0.07, y: 0.235 },
      ];
      canopyLevels.forEach((level, index) => {
        const canopy = new THREE.Mesh(
          new THREE.ConeGeometry(level.radius * treeScale, level.height * treeScale, 7, 2),
          foliageMaterials[index]
        );
        canopy.position.y = level.y * treeScale;
        canopy.rotation.y = index * 0.22;
        group.add(canopy);
      });

      // Pequeña luz de bienvenida bajo las ramas.
      const lantern = new THREE.Mesh(
        new THREE.SphereGeometry(0.012 * treeScale, 10, 8),
        new THREE.MeshBasicMaterial({ color: 0xf4d68a })
      );
      lantern.position.set(0.03 * treeScale, 0.12 * treeScale, 0.018 * treeScale);
      group.add(lantern);
      break;
    }

    // --- 2. MÉXICO: PIRÁMIDE DEL SOL DE TEOTIHUACÁN ---
    case 'mexico': {
      // Terrazas trapezoidales de piedra, visibles desde el ángulo orbital.
      const level1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075 * SCALE, 0.105 * SCALE, 0.05 * SCALE, 4, 1),
        new THREE.MeshStandardMaterial({ color: 0xb98260, roughness: 0.88 })
      );
      level1.position.y = 0.025 * SCALE;
      level1.rotation.y = Math.PI / 4;
      group.add(level1);

      const level2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.052 * SCALE, 0.078 * SCALE, 0.045 * SCALE, 4, 1),
        new THREE.MeshStandardMaterial({ color: 0xc99a70, roughness: 0.86 })
      );
      level2.position.y = 0.0725 * SCALE;
      level2.rotation.y = Math.PI / 4;
      group.add(level2);

      const level3 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.031 * SCALE, 0.055 * SCALE, 0.04 * SCALE, 4, 1),
        new THREE.MeshStandardMaterial({ color: 0xd6ad82, roughness: 0.82 })
      );
      level3.position.y = 0.115 * SCALE;
      level3.rotation.y = Math.PI / 4;
      group.add(level3);

      // Santuario pequeño en la cúspide, sin brillo metálico excesivo.
      const altar = new THREE.Mesh(
        new THREE.BoxGeometry(0.038 * SCALE, 0.025 * SCALE, 0.038 * SCALE),
        new THREE.MeshStandardMaterial({
          color: 0xe3c28f,
          roughness: 0.78,
        })
      );
      altar.position.y = 0.1475 * SCALE;
      altar.rotation.y = Math.PI / 4;
      group.add(altar);

      // Escalinata frontal de la pirámide.
      const stair = new THREE.Mesh(
        new THREE.BoxGeometry(0.028 * SCALE, 0.12 * SCALE, 0.035 * SCALE),
        new THREE.MeshStandardMaterial({ color: 0x9b7055, roughness: 0.9 })
      );
      stair.position.set(0, 0.06 * SCALE, 0.096 * SCALE);
      group.add(stair);
      break;
    }

    // --- 3. PERÚ: MACHU PICCHU & HUAYNA PICCHU ---
    case 'peru': {
      // Pico Huayna Picchu (Montaña cónica escarpada)
      const mountainGeo = new THREE.ConeGeometry(0.065 * SCALE, 0.13 * SCALE, 5);
      const mountainMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.9,
      });
      const mountain = new THREE.Mesh(mountainGeo, mountainMat);
      mountain.position.set(-0.025 * SCALE, 0.065 * SCALE, -0.018 * SCALE);
      group.add(mountain);

      // Terrazas agrícolas verdes incas (3 niveles)
      const terrace1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.12 * SCALE, 0.022 * SCALE, 0.085 * SCALE),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 })
      );
      terrace1.position.set(0.018 * SCALE, 0.012 * SCALE, 0.018 * SCALE);
      group.add(terrace1);

      const terrace2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.085 * SCALE, 0.022 * SCALE, 0.06 * SCALE),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.7 })
      );
      terrace2.position.set(0.024 * SCALE, 0.032 * SCALE, 0.018 * SCALE);
      group.add(terrace2);

      // Templo inca con tejado de paja dorada
      const hut = new THREE.Mesh(
        new THREE.BoxGeometry(0.034 * SCALE, 0.026 * SCALE, 0.026 * SCALE),
        new THREE.MeshStandardMaterial({ color: 0x78716c })
      );
      hut.position.set(0.03 * SCALE, 0.054 * SCALE, 0.018 * SCALE);
      group.add(hut);

      const hutRoof = new THREE.Mesh(
        new THREE.ConeGeometry(0.026 * SCALE, 0.024 * SCALE, 4),
        new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.5 })
      );
      hutRoof.position.set(0.03 * SCALE, 0.074 * SCALE, 0.018 * SCALE);
      hutRoof.rotation.y = Math.PI / 4;
      group.add(hutRoof);
      break;
    }

    // --- 4. EGIPTO: PIRÁMIDES DE GIZA & EL NILO ---
    case 'egipto': {
      // Gran Pirámide dorada
      const pyrGeo1 = new THREE.ConeGeometry(0.082 * SCALE, 0.1 * SCALE, 4);
      const pyrMat1 = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.55,
      });
      const pyr1 = new THREE.Mesh(pyrGeo1, pyrMat1);
      pyr1.position.set(-0.022 * SCALE, 0.05 * SCALE, -0.012 * SCALE);
      pyr1.rotation.y = Math.PI / 4;
      group.add(pyr1);

      // Piramidión de oro reluciente en la cúspide
      const capGeo = new THREE.ConeGeometry(0.024 * SCALE, 0.028 * SCALE, 4);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfacc15,
        emissiveIntensity: 0.6,
        metalness: 0.8,
        roughness: 0.2,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(-0.022 * SCALE, 0.086 * SCALE, -0.012 * SCALE);
      cap.rotation.y = Math.PI / 4;
      group.add(cap);

      // Segunda pirámide acompañante
      const pyrGeo2 = new THREE.ConeGeometry(0.055 * SCALE, 0.068 * SCALE, 4);
      const pyrMat2 = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.65,
      });
      const pyr2 = new THREE.Mesh(pyrGeo2, pyrMat2);
      pyr2.position.set(0.042 * SCALE, 0.034 * SCALE, 0.03 * SCALE);
      pyr2.rotation.y = Math.PI / 4;
      group.add(pyr2);
      break;
    }

    // --- 5. ISLANDIA: LAGUNA AZUL & GÉISER BOREAL ---
    case 'islandia': {
      // Roca volcánica de basalto
      const basalt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065 * SCALE, 0.085 * SCALE, 0.026 * SCALE, 7),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
      );
      basalt.position.y = 0.013 * SCALE;
      group.add(basalt);

      // Laguna azul geotermal brillante
      const lagoon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.048 * SCALE, 0.048 * SCALE, 0.006 * SCALE, 16),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      lagoon.position.y = 0.028 * SCALE;
      group.add(lagoon);

      // Columna de vapor / géiser cristalino
      const geyser = new THREE.Mesh(
        new THREE.ConeGeometry(0.025 * SCALE, 0.1 * SCALE, 8),
        new THREE.MeshStandardMaterial({
          color: 0xe0f2fe,
          transparent: true,
          opacity: 0.85,
          roughness: 0.2,
        })
      );
      geyser.position.y = 0.075 * SCALE;
      group.add(geyser);
      break;
    }

    // --- 6. JAPÓN: MONTE FUJI & TORII ROJO ---
    case 'japon': {
      // Volcán Monte Fuji simétrico
      const fujiGeo = new THREE.ConeGeometry(0.075 * SCALE, 0.095 * SCALE, 16);
      const fujiMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.7,
      });
      const fuji = new THREE.Mesh(fujiGeo, fujiMat);
      fuji.position.set(0.025 * SCALE, 0.047 * SCALE, -0.015 * SCALE);
      group.add(fuji);

      // Cumbre nevada del Fuji
      const snowCapGeo = new THREE.ConeGeometry(0.038 * SCALE, 0.045 * SCALE, 16);
      const snowCapMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
      });
      const snowCap = new THREE.Mesh(snowCapGeo, snowCapMat);
      snowCap.position.set(0.025 * SCALE, 0.072 * SCALE, -0.015 * SCALE);
      group.add(snowCap);

      // Puerta Torii vermellón japonesa
      const redMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.4,
      });

      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.008 * SCALE, 0.008 * SCALE, 0.075 * SCALE, 8), redMat);
      p1.position.set(-0.035 * SCALE, 0.037 * SCALE, 0.025 * SCALE);
      group.add(p1);

      const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.008 * SCALE, 0.008 * SCALE, 0.075 * SCALE, 8), redMat);
      p2.position.set(0.015 * SCALE, 0.037 * SCALE, 0.025 * SCALE);
      group.add(p2);

      const lintel = new THREE.Mesh(new THREE.BoxGeometry(0.085 * SCALE, 0.012 * SCALE, 0.016 * SCALE), redMat);
      lintel.position.set(-0.01 * SCALE, 0.076 * SCALE, 0.025 * SCALE);
      group.add(lintel);
      break;
    }

    // --- 7. AUSTRALIA: EL MONOLITO SAGRADO DE ULURU ---
    case 'australia': {
      // Bloque monolítico bermellón de Uluru
      const uluruGeo = new THREE.BoxGeometry(0.13 * SCALE, 0.055 * SCALE, 0.08 * SCALE);
      const uluruMat = new THREE.MeshStandardMaterial({
        color: 0xb91c1c,
        roughness: 0.85,
      });
      const uluru = new THREE.Mesh(uluruGeo, uluruMat);
      uluru.position.y = 0.027 * SCALE;
      group.add(uluru);

      // Arena roja del Outback en la base
      const dunes = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09 * SCALE, 0.11 * SCALE, 0.015 * SCALE, 12),
        new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.9 })
      );
      dunes.position.y = 0.007 * SCALE;
      group.add(dunes);
      break;
    }

    // --- 8. NUEVA ZELANDA: HOBBITON & CUEVAS DE WAITOMO ---
    case 'nueva-zelanda': {
      // Colina verde redonda de Hobbiton
      const hillGeo = new THREE.SphereGeometry(0.07 * SCALE, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2);
      const hillMat = new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        roughness: 0.6,
      });
      const hill = new THREE.Mesh(hillGeo, hillMat);
      hill.position.y = 0;
      group.add(hill);

      // Puerta redonda de madera de Hobbit
      const doorGeo = new THREE.CircleGeometry(0.024 * SCALE, 16);
      const doorMat = new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.5,
      });
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(0, 0.026 * SCALE, 0.065 * SCALE);
      group.add(door);

      // Pomo dorado
      const knob = new THREE.Mesh(
        new THREE.SphereGeometry(0.005 * SCALE, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfacc15 })
      );
      knob.position.set(0, 0.026 * SCALE, 0.068 * SCALE);
      group.add(knob);

      // Chimenea con humo
      const chimney = new THREE.Mesh(
        new THREE.BoxGeometry(0.015 * SCALE, 0.03 * SCALE, 0.015 * SCALE),
        new THREE.MeshStandardMaterial({ color: 0x64748b })
      );
      chimney.position.set(0.026 * SCALE, 0.068 * SCALE, -0.012 * SCALE);
      group.add(chimney);
      break;
    }

    // --- 9. CHINA: LA GRAN MURALLA CHINA ---
    case 'china': {
      const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.8,
      });

      // Torreón central almenado
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.062 * SCALE, 0.078 * SCALE, 0.062 * SCALE), stoneMat);
      tower.position.y = 0.039 * SCALE;
      group.add(tower);

      // Tejado del torreón
      const towerRoof = new THREE.Mesh(
        new THREE.ConeGeometry(0.05 * SCALE, 0.03 * SCALE, 4),
        new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 })
      );
      towerRoof.position.y = 0.09 * SCALE;
      towerRoof.rotation.y = Math.PI / 4;
      group.add(towerRoof);

      // Muros laterales almenados de la muralla
      const wall1 = new THREE.Mesh(new THREE.BoxGeometry(0.075 * SCALE, 0.042 * SCALE, 0.026 * SCALE), stoneMat);
      wall1.position.set(-0.055 * SCALE, 0.021 * SCALE, 0);
      group.add(wall1);

      const wall2 = new THREE.Mesh(new THREE.BoxGeometry(0.075 * SCALE, 0.042 * SCALE, 0.026 * SCALE), stoneMat);
      wall2.position.set(0.055 * SCALE, 0.021 * SCALE, 0);
      group.add(wall2);

      // Banderín imperial rojo
      const flag = new THREE.Mesh(
        new THREE.ConeGeometry(0.018 * SCALE, 0.035 * SCALE, 3),
        new THREE.MeshBasicMaterial({ color: 0xdc2626 })
      );
      flag.position.set(0, 0.115 * SCALE, 0);
      flag.rotation.z = Math.PI / 2;
      group.add(flag);
      break;
    }

    // --- 10. ITALIA: COLISEO ROMANO & TORRE DE PISA ---
    case 'italia': {
      // Anillo exterior con arcos del Coliseo
      const colosseumGeo = new THREE.CylinderGeometry(0.065 * SCALE, 0.07 * SCALE, 0.048 * SCALE, 16, 1, true);
      const colosseumMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.7,
        side: THREE.DoubleSide,
      });
      const colosseum = new THREE.Mesh(colosseumGeo, colosseumMat);
      colosseum.position.set(-0.025 * SCALE, 0.024 * SCALE, 0);
      group.add(colosseum);

      // Arena central dorada
      const arena = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05 * SCALE, 0.05 * SCALE, 0.012 * SCALE, 16),
        new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.9 })
      );
      arena.position.set(-0.025 * SCALE, 0.006 * SCALE, 0);
      group.add(arena);

      // Torre de Pisa inclinada
      const pisaGeo = new THREE.CylinderGeometry(0.016 * SCALE, 0.018 * SCALE, 0.07 * SCALE, 8);
      const pisaMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
      const pisa = new THREE.Mesh(pisaGeo, pisaMat);
      pisa.position.set(0.04 * SCALE, 0.035 * SCALE, 0);
      pisa.rotation.z = -0.15; // Inclinación icónica
      group.add(pisa);
      break;
    }

    // --- 11. FRANCIA: TORRE EIFFEL ---
    case 'francia': {
      const eiffelMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.45,
        roughness: 0.5,
      });

      // Base piramidal ancha
      const base1 = new THREE.Mesh(new THREE.ConeGeometry(0.06 * SCALE, 0.048 * SCALE, 4), eiffelMat);
      base1.position.y = 0.024 * SCALE;
      base1.rotation.y = Math.PI / 4;
      group.add(base1);

      // Cuerpo medio estilizado
      const mid = new THREE.Mesh(new THREE.ConeGeometry(0.038 * SCALE, 0.055 * SCALE, 4), eiffelMat);
      mid.position.y = 0.065 * SCALE;
      mid.rotation.y = Math.PI / 4;
      group.add(mid);

      // Aguja superior
      const spire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005 * SCALE, 0.015 * SCALE, 0.06 * SCALE, 6),
        eiffelMat
      );
      spire.position.y = 0.115 * SCALE;
      group.add(spire);

      // Faro de luz dorado en la cima
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.01 * SCALE, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfde047 })
      );
      beacon.position.y = 0.15 * SCALE;
      group.add(beacon);
      break;
    }

    // --- MODELO POR DEFECTO: HITO DE EXPEDICIÓN ---
    default: {
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045 * SCALE, 0.06 * SCALE, 0.025 * SCALE, 8),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 })
      );
      base.position.y = 0.012 * SCALE;
      group.add(base);

      const jewel = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.036 * SCALE),
        new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 0.5,
        })
      );
      jewel.position.y = 0.06 * SCALE;
      group.add(jewel);
      break;
    }
  }

  // Anillo de brillo y pulso en la base sobre la superficie del globo
  const baseRingGeo = new THREE.RingGeometry(0.065 * SCALE, 0.09 * SCALE, 24);
  const baseRingMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(getMonumentConfig(id).color),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });
  const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.002;
  group.add(baseRing);

  return group;
}

// CREA EL EMBLEMA CARTEL FLOTANTE (BILLBOARD SPRITE) QUE SIEMPRE MIRA A LA CÁMARA
export function createPixarBadgeSprite(id: string): THREE.Sprite {
  const config = getMonumentConfig(id);
  const badgeCanvas = createPixarBadgeCanvas(config.name, config.emoji, config.color);
  const texture = new THREE.CanvasTexture(badgeCanvas);
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.38, 0.38, 1);
  return sprite;
}
