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
    name: 'Torii de Tokio',
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
    name: 'Hobbiton & Cuevas',
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
    name: 'Coliseo Romano',
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
export function createPixarMonumentMesh(id: string): THREE.Group {
  const group = new THREE.Group();

  switch (id) {
    // --- 1. ESPAÑA: EL GRAN ÁRBOL MÁGICO Y CABAÑA (BOSQUE ENCANTADO) ---
    case 'espana-inicio':
    case 'espana-regreso': {
      // Tronco curvado de madera cálida
      const trunkGeo = new THREE.CylinderGeometry(0.015, 0.026, 0.075, 8);
      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.8,
      });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.038;
      group.add(trunk);

      // Copa esponjosa de follaje Pixar (3 esferas verdes vibrantes)
      const foliageMat = new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        roughness: 0.5,
      });
      const leaves1 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), foliageMat);
      leaves1.position.set(0, 0.08, 0);
      group.add(leaves1);

      const leaves2 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), foliageMat);
      leaves2.position.set(0.025, 0.07, 0.015);
      group.add(leaves2);

      const leaves3 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), foliageMat);
      leaves3.position.set(-0.022, 0.072, -0.015);
      group.add(leaves3);

      // Tejadito de la casita / buzón de Pompón
      const roofGeo = new THREE.ConeGeometry(0.024, 0.028, 4);
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.4,
      });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(0, 0.115, 0);
      roof.rotation.y = Math.PI / 4;
      group.add(roof);

      // Farolillo dorado con brillo
      const lanternGeo = new THREE.SphereGeometry(0.009, 8, 8);
      const lanternMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
      const lantern = new THREE.Mesh(lanternGeo, lanternMat);
      lantern.position.set(0.032, 0.06, 0);
      group.add(lantern);
      break;
    }

    // --- 2. MÉXICO: PIRÁMIDE DEL SOL DE TEOTIHUACÁN ---
    case 'mexico': {
      // 4 niveles escalonados de piedra arenisca cálida
      const level1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.02, 0.12),
        new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.7 })
      );
      level1.position.y = 0.01;
      group.add(level1);

      const level2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.02, 0.09),
        new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.7 })
      );
      level2.position.y = 0.028;
      group.add(level2);

      const level3 = new THREE.Mesh(
        new THREE.BoxGeometry(0.062, 0.02, 0.062),
        new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 })
      );
      level3.position.y = 0.046;
      group.add(level3);

      // Altar solar en la cúspide
      const altar = new THREE.Mesh(
        new THREE.BoxGeometry(0.032, 0.015, 0.032),
        new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          emissive: 0xeab308,
          emissiveIntensity: 0.4,
          roughness: 0.3,
        })
      );
      altar.position.y = 0.062;
      group.add(altar);

      // Rampa de escalinata central
      const stair = new THREE.Mesh(
        new THREE.BoxGeometry(0.022, 0.06, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x9a3412 })
      );
      stair.position.set(0, 0.03, 0.055);
      stair.rotation.x = -Math.PI / 6;
      group.add(stair);
      break;
    }

    // --- 3. PERÚ: MACHU PICCHU & HUAYNA PICCHU ---
    case 'peru': {
      // Pico Huayna Picchu (Montaña cónica escarpada)
      const mountainGeo = new THREE.ConeGeometry(0.055, 0.11, 5);
      const mountainMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.9,
      });
      const mountain = new THREE.Mesh(mountainGeo, mountainMat);
      mountain.position.set(-0.02, 0.055, -0.015);
      group.add(mountain);

      // Terrazas agrícolas verdes incas (3 niveles)
      const terrace1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.018, 0.07),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 })
      );
      terrace1.position.set(0.015, 0.01, 0.015);
      group.add(terrace1);

      const terrace2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.07, 0.018, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.7 })
      );
      terrace2.position.set(0.02, 0.026, 0.015);
      group.add(terrace2);

      // Templo inca con tejado de paja dorada
      const hut = new THREE.Mesh(
        new THREE.BoxGeometry(0.028, 0.022, 0.022),
        new THREE.MeshStandardMaterial({ color: 0x78716c })
      );
      hut.position.set(0.025, 0.045, 0.015);
      group.add(hut);

      const hutRoof = new THREE.Mesh(
        new THREE.ConeGeometry(0.022, 0.02, 4),
        new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.5 })
      );
      hutRoof.position.set(0.025, 0.062, 0.015);
      hutRoof.rotation.y = Math.PI / 4;
      group.add(hutRoof);
      break;
    }

    // --- 4. EGIPTO: PIRÁMIDES DE GIZA & EL NILO ---
    case 'egipto': {
      // Gran Pirámide dorada
      const pyrGeo1 = new THREE.ConeGeometry(0.068, 0.082, 4);
      const pyrMat1 = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.5,
      });
      const pyr1 = new THREE.Mesh(pyrGeo1, pyrMat1);
      pyr1.position.set(-0.018, 0.041, -0.01);
      pyr1.rotation.y = Math.PI / 4;
      group.add(pyr1);

      // Piramidión de oro reluciente en la cúspide
      const capGeo = new THREE.ConeGeometry(0.02, 0.024, 4);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfacc15,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(-0.018, 0.07, -0.01);
      cap.rotation.y = Math.PI / 4;
      group.add(cap);

      // Segunda pirámide acompañante
      const pyrGeo2 = new THREE.ConeGeometry(0.045, 0.055, 4);
      const pyrMat2 = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.6,
      });
      const pyr2 = new THREE.Mesh(pyrGeo2, pyrMat2);
      pyr2.position.set(0.035, 0.028, 0.025);
      pyr2.rotation.y = Math.PI / 4;
      group.add(pyr2);
      break;
    }

    // --- 5. ISLANDIA: LAGUNA AZUL & GÉISER BOREAL ---
    case 'islandia': {
      // Roca volcánica de basalto
      const basalt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.065, 0.022, 7),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
      );
      basalt.position.y = 0.011;
      group.add(basalt);

      // Laguna azul geotermal brillante
      const lagoon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 0.005, 16),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      lagoon.position.y = 0.023;
      group.add(lagoon);

      // Columna de vapor / géiser cristalino
      const geyser = new THREE.Mesh(
        new THREE.ConeGeometry(0.02, 0.08, 8),
        new THREE.MeshStandardMaterial({
          color: 0xe0f2fe,
          transparent: true,
          opacity: 0.85,
          roughness: 0.2,
        })
      );
      geyser.position.y = 0.06;
      group.add(geyser);
      break;
    }

    // --- 6. JAPÓN: TORII ROJO & PAGODA DE TOKIO ---
    case 'japon': {
      const redMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.4,
      });

      // Pilares del Torii
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.065, 8), redMat);
      p1.position.set(-0.025, 0.032, 0);
      group.add(p1);

      const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.065, 8), redMat);
      p2.position.set(0.025, 0.032, 0);
      group.add(p2);

      // Dintel curvado superior (Kasagi)
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, 0.014), redMat);
      lintel.position.set(0, 0.066, 0);
      group.add(lintel);

      // Travesaño intermedio (Nuki)
      const subLintel = new THREE.Mesh(
        new THREE.BoxGeometry(0.065, 0.006, 0.01),
        new THREE.MeshStandardMaterial({ color: 0x0f172a })
      );
      subLintel.position.set(0, 0.052, 0);
      group.add(subLintel);

      // Linterna dorada central
      const lantern = new THREE.Mesh(
        new THREE.SphereGeometry(0.01, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfacc15 })
      );
      lantern.position.set(0, 0.04, 0);
      group.add(lantern);
      break;
    }

    // --- 7. AUSTRALIA: EL MONOLITO SAGRADO DE ULURU ---
    case 'australia': {
      // Bloque monolítico bermellón de Uluru
      const uluruGeo = new THREE.BoxGeometry(0.11, 0.045, 0.068);
      const uluruMat = new THREE.MeshStandardMaterial({
        color: 0xb91c1c,
        roughness: 0.85,
      });
      const uluru = new THREE.Mesh(uluruGeo, uluruMat);
      uluru.position.y = 0.022;
      group.add(uluru);

      // Arena roja del Outback en la base
      const dunes = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.09, 0.012, 12),
        new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.9 })
      );
      dunes.position.y = 0.006;
      group.add(dunes);
      break;
    }

    // --- 8. NUEVA ZELANDA: HOBBITON & CUEVAS DE WAITOMO ---
    case 'nueva-zelanda': {
      // Colina verde redonda
      const hillGeo = new THREE.SphereGeometry(0.058, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const hillMat = new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        roughness: 0.6,
      });
      const hill = new THREE.Mesh(hillGeo, hillMat);
      hill.position.y = 0;
      group.add(hill);

      // Puerta redonda de madera de Hobbit
      const doorGeo = new THREE.CircleGeometry(0.02, 16);
      const doorMat = new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.5,
      });
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(0, 0.022, 0.054);
      group.add(door);

      // Pomo dorado
      const knob = new THREE.Mesh(
        new THREE.SphereGeometry(0.004, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfacc15 })
      );
      knob.position.set(0, 0.022, 0.056);
      group.add(knob);

      // Chimenea con humo
      const chimney = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, 0.025, 0.012),
        new THREE.MeshStandardMaterial({ color: 0x64748b })
      );
      chimney.position.set(0.022, 0.055, -0.01);
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
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.065, 0.052), stoneMat);
      tower.position.y = 0.032;
      group.add(tower);

      // Tejado del torreón
      const towerRoof = new THREE.Mesh(
        new THREE.ConeGeometry(0.042, 0.025, 4),
        new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 })
      );
      towerRoof.position.y = 0.075;
      towerRoof.rotation.y = Math.PI / 4;
      group.add(towerRoof);

      // Muros laterales almenados de la muralla
      const wall1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, 0.022), stoneMat);
      wall1.position.set(-0.045, 0.018, 0);
      group.add(wall1);

      const wall2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, 0.022), stoneMat);
      wall2.position.set(0.045, 0.018, 0);
      group.add(wall2);

      // Banderín imperial rojo
      const flag = new THREE.Mesh(
        new THREE.ConeGeometry(0.015, 0.03, 3),
        new THREE.MeshBasicMaterial({ color: 0xdc2626 })
      );
      flag.position.set(0, 0.095, 0);
      flag.rotation.z = Math.PI / 2;
      group.add(flag);
      break;
    }

    // --- 10. ITALIA: COLISEO ROMANO ---
    case 'italia': {
      // Anillo exterior con arcos del Coliseo
      const colosseumGeo = new THREE.CylinderGeometry(0.058, 0.062, 0.042, 16, 1, true);
      const colosseumMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.7,
        side: THREE.DoubleSide,
      });
      const colosseum = new THREE.Mesh(colosseumGeo, colosseumMat);
      colosseum.position.y = 0.021;
      group.add(colosseum);

      // Arena central dorada
      const arena = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.01, 16),
        new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.9 })
      );
      arena.position.y = 0.005;
      group.add(arena);
      break;
    }

    // --- 11. FRANCIA: TORRE EIFFEL ---
    case 'francia': {
      const eiffelMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.4,
        roughness: 0.5,
      });

      // Base piramidal ancha
      const base1 = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.04, 4), eiffelMat);
      base1.position.y = 0.02;
      base1.rotation.y = Math.PI / 4;
      group.add(base1);

      // Cuerpo medio estilizado
      const mid = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.045, 4), eiffelMat);
      mid.position.y = 0.055;
      mid.rotation.y = Math.PI / 4;
      group.add(mid);

      // Aguja superior
      const spire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.004, 0.012, 0.05, 6),
        eiffelMat
      );
      spire.position.y = 0.095;
      group.add(spire);

      // Faro de luz dorado en la cima
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.008, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfde047 })
      );
      beacon.position.y = 0.125;
      group.add(beacon);
      break;
    }

    // --- MODELO POR DEFECTO: HITO DE EXPEDICIÓN ---
    default: {
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.05, 0.02, 8),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 })
      );
      base.position.y = 0.01;
      group.add(base);

      const jewel = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.03),
        new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 0.4,
        })
      );
      jewel.position.y = 0.05;
      group.add(jewel);
      break;
    }
  }

  // Anillo de brillo y pulso en la base sobre la superficie del globo
  const baseRingGeo = new THREE.RingGeometry(0.055, 0.075, 24);
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
    depthTest: false,
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.32, 0.32, 1);
  return sprite;
}
