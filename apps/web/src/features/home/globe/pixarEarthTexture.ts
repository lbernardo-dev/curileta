// Generator de texturas procedurales para el Globo 3D Estilo Animado Pixar
// Dibuja los océanos con aguas profundas y costeras turquesas, y los continentes con vegetación, desiertos y montañas.

export function createPixarEarthCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const w = canvas.width;
  const h = canvas.height;

  const toX = (lng: number) => ((lng + 180) / 360) * w;
  const toY = (lat: number) => ((90 - lat) / 180) * h;

  // 1. BASE DE OCÉANOS PROFUNDOS (Gradiente vibrante estilo Pixar)
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
  oceanGrad.addColorStop(0, '#0c2461'); // Polo norte azul noche
  oceanGrad.addColorStop(0.25, '#1e3799'); // Atlántico / Pacífico norte
  oceanGrad.addColorStop(0.5, '#0984e3'); // Cinturón ecuatorial azul vibrante
  oceanGrad.addColorStop(0.75, '#1e3799'); // Mares del sur
  oceanGrad.addColorStop(1, '#0c2461'); // Polo sur antártico
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, w, h);

  // Efecto de corrientes marinas y textura de agua
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1.5;
  for (let lat = -80; lat <= 80; lat += 15) {
    ctx.beginPath();
    const y = toY(lat);
    for (let x = 0; x <= w; x += 40) {
      const wave = Math.sin((x / w) * Math.PI * 12 + lat) * 4;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  // 2. POLÍGONOS DE LOS CONTINENTES
  // Definición de masas continentales en coordenadas geográficas [lng, lat]
  const landmasses: Array<{
    name: string;
    points: Array<[number, number]>;
    isDesert?: boolean;
    isSnow?: boolean;
  }> = [
    // --- AMÉRICA DEL NORTE ---
    {
      name: 'North America',
      points: [
        [-168, 65], [-162, 71], [-130, 70], [-110, 72], [-85, 68], [-78, 62],
        [-64, 60], [-55, 52], [-60, 46], [-66, 44], [-70, 42], [-75, 36],
        [-80, 25], [-82, 28], [-85, 30], [-90, 30], [-97, 26], [-97, 20],
        [-90, 19], [-87, 21], [-88, 16], [-84, 10], [-79, 9], [-83, 8],
        [-87, 13], [-92, 15], [-97, 16], [-105, 20], [-109, 23], [-110, 29],
        [-115, 32], [-117, 32.5], [-122, 37], [-124, 43], [-125, 49], [-130, 54],
        [-136, 58], [-145, 60], [-152, 59], [-160, 56], [-166, 60], [-168, 65],
      ],
    },
    // Península de Baja California
    {
      name: 'Baja California',
      points: [
        [-115, 32], [-110, 23], [-109, 24], [-114, 30], [-115, 32],
      ],
    },
    // Florida
    {
      name: 'Florida',
      points: [
        [-81, 30], [-80, 25], [-82, 25], [-83, 29], [-81, 30],
      ],
    },
    // --- AMÉRICA DEL SUR ---
    {
      name: 'South America',
      points: [
        [-77, 8], [-72, 11], [-62, 10], [-50, 0], [-40, -3], [-35, -5],
        [-36, -8], [-38, -13], [-40, -22], [-48, -26], [-53, -33], [-57, -38],
        [-65, -43], [-66, -48], [-68, -54], [-73, -53], [-75, -45], [-73, -37],
        [-71, -30], [-70, -20], [-77, -12], [-81, -5], [-80, 0], [-77, 8],
      ],
    },
    // --- EUROPA ---
    {
      name: 'Iberian Peninsula', // España y Portugal
      points: [
        [-9, 43], [-2, 43.5], [3, 42.5], [0, 40], [-0.5, 38], [-2, 36.5],
        [-5.5, 36], [-9, 37], [-9.5, 39], [-9, 42], [-9, 43],
      ],
    },
    {
      name: 'Europe & Western Asia',
      points: [
        [-1, 44], [-4.5, 48.5], [1.5, 50], [5, 53], [8, 55], [12, 55],
        [15, 56], [18, 59], [22, 65], [28, 70], [35, 68], [40, 67],
        [50, 68], [60, 68], [68, 73], [75, 72], [80, 60], [70, 52],
        [60, 47], [50, 45], [44, 42], [37, 41], [30, 41], [25, 40],
        [22, 38], [24, 35], [20, 39], [15, 41], [13, 46], [6, 44],
        [3, 43], [-1, 44],
      ],
    },
    // Península Itálica (Italia)
    {
      name: 'Italy',
      points: [
        [8, 45], [12, 45.5], [13, 42], [18, 40], [16, 39], [15, 38],
        [14, 40], [10, 43], [8, 44], [8, 45],
      ],
    },
    // Escandinavia
    {
      name: 'Scandinavia',
      points: [
        [5, 59], [5, 62], [10, 63], [14, 68], [24, 71], [30, 70],
        [28, 65], [21, 63], [18, 59], [12, 56], [8, 58], [5, 59],
      ],
    },
    // Gran Bretaña e Irlanda
    {
      name: 'Great Britain',
      points: [
        [-5, 50], [1.5, 51], [0, 53], [-1, 55], [-2, 58], [-5, 58],
        [-5, 55], [-4, 52], [-5, 50],
      ],
    },
    {
      name: 'Ireland',
      points: [
        [-10, 51.5], [-6, 52], [-5.5, 54], [-8, 55], [-10, 54], [-10, 51.5],
      ],
    },
    // --- ÁFRICA ---
    {
      name: 'Africa',
      points: [
        [-6, 35], [10, 37], [20, 32], [30, 31.5], [34, 27], [40, 20],
        [50, 12], [51, 10], [45, 2], [41, -5], [35, -15], [33, -25],
        [28, -32], [20, -34], [18, -34], [15, -28], [12, -18], [12, -5],
        [9, 4], [3, 6], [-5, 5], [-15, 11], [-17, 15], [-16, 21],
        [-12, 28], [-6, 35],
      ],
    },
    // Madagascar
    {
      name: 'Madagascar',
      points: [
        [44, -12], [50, -14], [48, -25], [44, -25], [44, -12],
      ],
    },
    // --- ASIA ---
    {
      name: 'Asia Mainland (China, Siberia, India, SE Asia)',
      points: [
        [60, 45], [70, 50], [80, 55], [90, 60], [110, 65], [130, 65],
        [150, 60], [165, 60], [170, 65], [180, 65], [180, 50], [160, 50],
        [145, 45], [135, 45], [130, 42], [125, 38], [122, 35], [120, 30],
        [118, 24], [110, 20], [105, 10], [100, 5], [98, 10], [90, 22],
        [85, 20], [80, 13], [77, 8], [75, 15], [70, 22], [68, 25],
        [60, 25], [55, 22], [50, 26], [48, 30], [40, 30], [35, 32],
        [35, 36], [40, 38], [50, 40], [60, 45],
      ],
    },
    // Península Arábiga
    {
      name: 'Arabia',
      points: [
        [35, 30], [40, 25], [50, 15], [55, 18], [58, 23], [54, 27],
        [48, 30], [40, 32], [35, 30],
      ],
      isDesert: true,
    },
    // Japón (Archipiélago)
    {
      name: 'Japan',
      points: [
        [130, 32], [135, 35], [140, 40], [145, 45], [142, 44],
        [138, 37], [132, 34], [130, 32],
      ],
    },
    // Filipinas
    {
      name: 'Philippines',
      points: [
        [120, 18], [122, 16], [125, 12], [125, 8], [122, 7],
        [120, 11], [119, 15], [120, 18],
      ],
    },
    // Indonesia (Sumatra, Java, Borneo)
    {
      name: 'Indonesia',
      points: [
        [95, 5], [105, -5], [115, -7], [120, -8], [115, -5],
        [110, -2], [105, 0], [98, 3], [95, 5],
      ],
    },
    // --- OCEANÍA (Australia & Nueva Zelanda) ---
    {
      name: 'Australia',
      points: [
        [115, -22], [123, -15], [130, -12], [136, -12], [142, -11],
        [145, -15], [150, -22], [153, -28], [151, -34], [147, -38],
        [140, -38], [135, -34], [128, -32], [120, -34], [115, -34],
        [113, -27], [115, -22],
      ],
    },
    // Tasmania
    {
      name: 'Tasmania',
      points: [
        [145, -41], [148, -41], [148, -44], [145, -44], [145, -41],
      ],
    },
    // Nueva Zelanda (Isla Norte e Isla Sur)
    {
      name: 'New Zealand',
      points: [
        [173, -35], [178, -38], [176, -40], [174, -42], [170, -44],
        [167, -46], [169, -47], [172, -43], [175, -41], [173, -35],
      ],
    },
    // --- REGIONES POLARES & ISLAS ---
    // Islandia
    {
      name: 'Iceland',
      points: [
        [-24, 64], [-22, 66], [-14, 66], [-13, 65], [-18, 63.5], [-24, 64],
      ],
    },
    // Groenlandia
    {
      name: 'Greenland',
      points: [
        [-70, 78], [-55, 83], [-20, 83], [-18, 76], [-25, 70],
        [-40, 60], [-50, 62], [-58, 70], [-70, 78],
      ],
      isSnow: true,
    },
    // Antártida (Banda costera continua en el sur)
    {
      name: 'Antarctica',
      points: [
        [-180, -70], [-120, -72], [-60, -64], [-40, -72], [0, -68],
        [60, -66], [100, -66], [140, -66], [180, -72], [180, -90],
        [-180, -90], [-180, -70],
      ],
      isSnow: true,
    },
  ];

  // FUNCIÓN AUXILIAR: Dibuja un polígono continuo
  const drawPolygon = (pts: Array<[number, number]>) => {
    if (pts.length < 3) return;
    ctx.beginPath();
    const firstX = toX(pts[0][0]);
    const firstY = toY(pts[0][1]);
    ctx.moveTo(firstX, firstY);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(toX(pts[i][0]), toY(pts[i][1]));
    }
    ctx.closePath();
  };

  // 3. CAPA DE AGUAS COSTERAS POCO PROFUNDAS (Brillo turquesa brillante estilo Pixar)
  // Se traza un contorno ancho y brillante alrededor de todas las costas
  ctx.save();
  ctx.strokeStyle = '#00d2d3';
  ctx.lineWidth = 14;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 12;

  landmasses.forEach((land) => {
    drawPolygon(land.points);
    ctx.stroke();
  });
  ctx.restore();

  // Segundo anillo costero más fino (arena clara)
  ctx.save();
  ctx.strokeStyle = '#74b9ff';
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  landmasses.forEach((land) => {
    drawPolygon(land.points);
    ctx.stroke();
  });
  ctx.restore();

  // 4. RELLENO DE CONTINENTES (Verde exuberante con relieve)
  landmasses.forEach((land) => {
    drawPolygon(land.points);

    if (land.isSnow) {
      // Región polar (blanco nieve brillante)
      const snowGrad = ctx.createLinearGradient(0, 0, 0, h);
      snowGrad.addColorStop(0, '#ffffff');
      snowGrad.addColorStop(1, '#dfe6e9');
      ctx.fillStyle = snowGrad;
    } else if (land.isDesert) {
      // Desierto árabe cálido
      ctx.fillStyle = '#f39c12';
    } else {
      // Tierra continental fértil (verde Pixar con relieve)
      const landGrad = ctx.createLinearGradient(0, 0, 0, h);
      landGrad.addColorStop(0.2, '#1b8a5a');
      landGrad.addColorStop(0.4, '#2ecc71');
      landGrad.addColorStop(0.6, '#27ae60');
      landGrad.addColorStop(0.8, '#16a085');
      ctx.fillStyle = landGrad;
    }
    ctx.fill();

    // Borde de playa de arena dorada
    ctx.strokeStyle = '#f6e58d';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // 5. REGIONES DESÉRTICAS ESPECÍFICAS (Sahara, Gobi, Outback de Australia, México)
  // Desierto del Sahara (África Norte)
  ctx.save();
  ctx.fillStyle = '#f39c12';
  ctx.beginPath();
  ctx.ellipse(toX(15), toY(24), 220, 60, 0, 0, Math.PI * 2);
  ctx.fill();

  // Outback Australiano (Tierra roja sagrada)
  ctx.fillStyle = '#e67e22';
  ctx.beginPath();
  ctx.ellipse(toX(133), toY(-25), 110, 55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Desierto de Gobi (China / Mongolia)
  ctx.fillStyle = '#f1c40f';
  ctx.beginPath();
  ctx.ellipse(toX(102), toY(42), 120, 35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Altiplano & Desiertos de México
  ctx.fillStyle = '#e67e22';
  ctx.beginPath();
  ctx.ellipse(toX(-102), toY(24), 50, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. CORDILLERAS MONTAÑOSAS ESTILIZADAS CON PICOS DE NIEVE
  // Función para dibujar picos montañosos triangulares
  const drawMountainRidge = (points: Array<[number, number]>, count: number) => {
    ctx.save();
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      for (let s = 0; s < count; s++) {
        const t = s / count;
        const mx = p1[0] + (p2[0] - p1[0]) * t;
        const my = p1[1] + (p2[1] - p1[1]) * t;
        const cx = toX(mx);
        const cy = toY(my);
        const size = 12 + Math.random() * 8;

        // Base marrón de montaña
        ctx.fillStyle = '#795548';
        ctx.beginPath();
        ctx.moveTo(cx - size, cy + size * 0.5);
        ctx.lineTo(cx, cy - size);
        ctx.lineTo(cx + size, cy + size * 0.5);
        ctx.closePath();
        ctx.fill();

        // Pico nevado blanco
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(cx - size * 0.4, cy - size * 0.2);
        ctx.lineTo(cx, cy - size);
        ctx.lineTo(cx + size * 0.4, cy - size * 0.2);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  };

  // Cordillera de los Andes (Sudamérica)
  drawMountainRidge([[-77, 5], [-75, -10], [-70, -25], [-72, -45]], 14);

  // Cordillera del Himalaya (Asia)
  drawMountainRidge([[75, 34], [85, 30], [95, 28]], 10);

  // Alpes Europeos (Francia, Suiza, Italia)
  drawMountainRidge([[5, 46], [10, 46], [13, 47]], 5);

  // Montañas Rocosas (Norteamérica)
  drawMountainRidge([[-115, 52], [-110, 44], [-105, 36]], 10);

  // 7. LÍNEAS CARTOGRÁFICAS NAÚTICAS DORADAS (Ecuador y Trópicos)
  ctx.save();
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 2;

  // Ecuador (lat 0)
  ctx.beginPath();
  ctx.moveTo(0, toY(0));
  ctx.lineTo(w, toY(0));
  ctx.stroke();

  // Trópico de Cáncer (lat 23.5)
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
  ctx.beginPath();
  ctx.moveTo(0, toY(23.5));
  ctx.lineTo(w, toY(23.5));
  ctx.stroke();

  // Trópico de Capricornio (lat -23.5)
  ctx.beginPath();
  ctx.moveTo(0, toY(-23.5));
  ctx.lineTo(w, toY(-23.5));
  ctx.stroke();
  ctx.restore();

  // 8. ROSAS DE LOS VIENTOS NAÚTICAS Y ROTULACIÓN DE OCÉANOS
  const drawCompassRose = (cx: number, cy: number, radius: number) => {
    ctx.save();
    ctx.translate(cx, cy);

    // Anillo exterior
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // 4 puntas cardinales
    const tips = [
      [0, -radius * 1.3],
      [radius * 1.3, 0],
      [0, radius * 1.3],
      [-radius * 1.3, 0],
    ];

    tips.forEach(([tx, ty], idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#f59e0b' : '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(tx, ty);
      ctx.lineTo(ty * 0.3, -tx * 0.3);
      ctx.closePath();
      ctx.fill();
    });

    ctx.restore();
  };

  // Rosa de los vientos en el Pacífico Sur
  drawCompassRose(toX(-130), toY(-25), 35);
  // Rosa de los vientos en el Atlántico Sur
  drawCompassRose(toX(-25), toY(-20), 30);
  // Rosa de los vientos en el Índico
  drawCompassRose(toX(85), toY(-25), 30);

  // Rótulos de los océanos en tipografía clásica náutica
  ctx.save();
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';

  ctx.fillText('OCÉANO PACÍFICO', toX(-140), toY(5));
  ctx.fillText('OCÉANO ATLÁNTICO', toX(-32), toY(15));
  ctx.fillText('OCÉANO ÍNDICO', toX(80), toY(-10));
  ctx.fillText('MAR MEDITERRÁNEO', toX(18), toY(35));
  ctx.restore();

  return canvas;
}

// 9. TEXTURA PROCEDURAL DE NUBES FLOTANTES PIXAR
export function createPixarCloudsCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const w = canvas.width;
  const h = canvas.height;

  // Fondo transparente
  ctx.clearRect(0, 0, w, h);

  // Función para dibujar una nube esponjosa compuesta de esferas suaves
  const drawFluffyCloud = (cx: number, cy: number, scale: number) => {
    ctx.save();
    ctx.translate(cx, cy);

    const circles = [
      { x: -30, y: 0, r: 24 },
      { x: -15, y: -16, r: 30 },
      { x: 12, y: -18, r: 34 },
      { x: 34, y: -4, r: 26 },
      { x: 0, y: 6, r: 28 },
    ];

    circles.forEach((c) => {
      const grad = ctx.createRadialGradient(
        c.x * scale,
        c.y * scale,
        0,
        c.x * scale,
        c.y * scale,
        c.r * scale
      );
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.55)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c.x * scale, c.y * scale, c.r * scale, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  // Esparcir nubes en cúmulos sobre el ecuador y latitudes medias
  const cloudPositions = [
    [120, 180, 1.2],
    [320, 140, 1.4],
    [540, 220, 1.1],
    [760, 160, 1.5],
    [920, 240, 1.3],
    [210, 340, 1.1],
    [450, 360, 1.4],
    [680, 320, 1.2],
    [870, 350, 1.5],
    [150, 90, 0.9],
    [400, 80, 1.0],
    [620, 95, 0.9],
    [840, 75, 1.1],
  ];

  cloudPositions.forEach(([x, y, s]) => {
    drawFluffyCloud(x, y, s);
  });

  return canvas;
}

// 10. GENERADOR DE EMBLEMAS Y CARTELES FLOTANTES 3D (BILLBOARDS)
export function createPixarBadgeCanvas(
  title: string,
  emoji: string,
  accentColor: string = '#f59e0b'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, 256, 256);

  // Sombra circular exterior
  const shadowGrad = ctx.createRadialGradient(128, 110, 30, 128, 110, 85);
  shadowGrad.addColorStop(0, `${accentColor}88`);
  shadowGrad.addColorStop(0.6, `${accentColor}33`);
  shadowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.arc(128, 110, 85, 0, Math.PI * 2);
  ctx.fill();

  // Escudo circular 3D
  const bgGrad = ctx.createLinearGradient(128, 40, 128, 180);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.arc(128, 110, 60, 0, Math.PI * 2);
  ctx.fill();

  // Borde brillante con el color del monumento
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 5;
  ctx.stroke();

  // Anillo de oro interior
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(128, 110, 54, 0, Math.PI * 2);
  ctx.stroke();

  // Icono 3D Emoji en el centro
  ctx.font = '64px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 128, 108);

  // Cartela rectangular inferior con el nombre del monumento
  const bannerY = 186;
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2.5;

  const textWidth = Math.min(220, Math.max(120, title.length * 11 + 24));
  const bannerX = 128 - textWidth / 2;

  // Rectángulo redondeado
  ctx.beginPath();
  ctx.roundRect(bannerX, bannerY, textWidth, 34, 17);
  ctx.fill();
  ctx.stroke();

  // Texto del monumento
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 128, bannerY + 17);

  return canvas;
}
