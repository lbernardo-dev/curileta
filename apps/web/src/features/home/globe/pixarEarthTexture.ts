// Generador de texturas procedurales para el Globo 3D Estilo Animado Pixar
// Diseñado con alto contraste, océanos zafiro profundos, plataformas costeras turquesas brillantes,
// continentes verdes esmeralda vibrantes, playas doradas y regiones desérticas y montañosas perfectamente delimitadas.

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

  // 1. BASE DE OCÉANOS PROFUNDOS (Gradiente vibrante estilo animación Pixar)
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
  oceanGrad.addColorStop(0, '#06193e');    // Polo norte: azul noche ártico
  oceanGrad.addColorStop(0.2, '#0c2461');  // Atlántico norte profundo
  oceanGrad.addColorStop(0.5, '#0984e3');  // Cinturón ecuatorial: azul zafiro luminoso
  oceanGrad.addColorStop(0.8, '#0c2461');  // Mares del sur
  oceanGrad.addColorStop(1, '#06193e');    // Océano Antártico
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, w, h);

  // Efecto de corrientes marinas y textura de agua animada
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1.8;
  for (let lat = -80; lat <= 80; lat += 12) {
    ctx.beginPath();
    const y = toY(lat);
    for (let x = 0; x <= w; x += 30) {
      const wave = Math.sin((x / w) * Math.PI * 14 + lat * 0.1) * 5;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
  ctx.restore();

  // 2. POLÍGONOS DE LOS CONTINENTES
  const landmasses: Array<{
    name: string;
    points: Array<[number, number]>;
    isDesert?: boolean;
    isSnow?: boolean;
    hasSahara?: boolean;
    hasOutback?: boolean;
    hasGobi?: boolean;
    hasSonora?: boolean;
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
      hasSonora: true,
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
    // Península Ibérica (España y Portugal)
    {
      name: 'Iberian Peninsula',
      points: [
        [-9, 43], [-2, 43.5], [3, 42.5], [0, 40], [-0.5, 38], [-2, 36.5],
        [-5.5, 36], [-9, 37], [-9.5, 39], [-9, 42], [-9, 43],
      ],
    },
    // Europa continental y Francia
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
    // Gran Bretaña
    {
      name: 'Great Britain',
      points: [
        [-5, 50], [1.5, 51], [0, 53], [-1, 55], [-2, 58], [-5, 58],
        [-5, 55], [-4, 52], [-5, 50],
      ],
    },
    // Irlanda
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
      hasSahara: true,
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
      name: 'Asia Mainland',
      points: [
        [60, 45], [70, 50], [80, 55], [90, 60], [110, 65], [130, 65],
        [150, 60], [165, 60], [170, 65], [180, 65], [180, 50], [160, 50],
        [145, 45], [135, 45], [130, 42], [125, 38], [122, 35], [120, 30],
        [118, 24], [110, 20], [105, 10], [100, 5], [98, 10], [90, 22],
        [85, 20], [80, 13], [77, 8], [75, 15], [70, 22], [68, 25],
        [60, 25], [55, 22], [50, 26], [48, 30], [40, 30], [35, 32],
        [35, 36], [40, 38], [50, 40], [60, 45],
      ],
      hasGobi: true,
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
    // Japón
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
    // Indonesia
    {
      name: 'Indonesia',
      points: [
        [95, 5], [105, -5], [115, -7], [120, -8], [115, -5],
        [110, -2], [105, 0], [98, 3], [95, 5],
      ],
    },
    // --- OCEANÍA ---
    // Australia
    {
      name: 'Australia',
      points: [
        [115, -22], [123, -15], [130, -12], [136, -12], [142, -11],
        [145, -15], [150, -22], [153, -28], [151, -34], [147, -38],
        [140, -38], [135, -34], [128, -32], [120, -34], [115, -34],
        [113, -27], [115, -22],
      ],
      hasOutback: true,
    },
    // Tasmania
    {
      name: 'Tasmania',
      points: [
        [145, -41], [148, -41], [148, -44], [145, -44], [145, -41],
      ],
    },
    // Nueva Zelanda
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
    // Antártida
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

  // 3. CAPA DE AGUAS COSTERAS TURQUESAS PROFUNDAS (Shelf costero luminoso Pixar)
  // Primer anillo exterior amplio (resplandor azul turquesa)
  ctx.save();
  ctx.strokeStyle = '#00d2d3';
  ctx.lineWidth = 22;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 18;
  landmasses.forEach((land) => {
    drawPolygon(land.points);
    ctx.stroke();
  });
  ctx.restore();

  // Segundo anillo intermedio turquesa brillante
  ctx.save();
  ctx.strokeStyle = '#48dbfb';
  ctx.lineWidth = 10;
  ctx.lineJoin = 'round';
  landmasses.forEach((land) => {
    drawPolygon(land.points);
    ctx.stroke();
  });
  ctx.restore();

  // 4. RELLENO DE CONTINENTES CON CLIPPING ESTRICTO (Para que NINGÚN desierto manche el océano)
  landmasses.forEach((land) => {
    ctx.save();
    drawPolygon(land.points);
    ctx.clip(); // CLIPPING ESTRICTO: todo lo que se pinte quedará dentro del continente

    if (land.isSnow) {
      // Región polar (nieve blanca luminosa)
      const snowGrad = ctx.createLinearGradient(0, 0, 0, h);
      snowGrad.addColorStop(0, '#ffffff');
      snowGrad.addColorStop(1, '#dfe6e9');
      ctx.fillStyle = snowGrad;
      ctx.fillRect(0, 0, w, h);
    } else if (land.isDesert) {
      // Arabia / Desierto puro
      const desertGrad = ctx.createLinearGradient(0, 0, 0, h);
      desertGrad.addColorStop(0, '#f59e0b');
      desertGrad.addColorStop(1, '#d97706');
      ctx.fillStyle = desertGrad;
      ctx.fillRect(0, 0, w, h);
    } else {
      // Tierra continental fértil (Verde esmeralda Pixar rico y saturado)
      const landGrad = ctx.createLinearGradient(0, 0, 0, h);
      landGrad.addColorStop(0.1, '#10ac84'); // Verde norte
      landGrad.addColorStop(0.35, '#2ecc71'); // Verde vibrante
      landGrad.addColorStop(0.65, '#27ae60'); // Verde bosque templado
      landGrad.addColorStop(0.9, '#16a085'); // Verde austral
      ctx.fillStyle = landGrad;
      ctx.fillRect(0, 0, w, h);
    }

    // DESIERTOS INTERNOS (Clipped de forma 100% segura dentro del continente)
    if (land.hasSahara) {
      // Sahara en África
      const saharaGrad = ctx.createRadialGradient(toX(18), toY(24), 20, toX(18), toY(24), 160);
      saharaGrad.addColorStop(0, '#f59e0b');
      saharaGrad.addColorStop(0.7, '#d97706');
      saharaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = saharaGrad;
      ctx.beginPath();
      ctx.ellipse(toX(18), toY(24), 180, 50, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (land.hasOutback) {
      // Outback de Australia (Tierra roja sagrada)
      const outbackGrad = ctx.createRadialGradient(toX(133), toY(-25), 15, toX(133), toY(-25), 90);
      outbackGrad.addColorStop(0, '#dc2626');
      outbackGrad.addColorStop(0.6, '#ea580c');
      outbackGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = outbackGrad;
      ctx.beginPath();
      ctx.ellipse(toX(133), toY(-25), 95, 45, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (land.hasGobi) {
      // Desierto de Gobi en Asia
      const gobiGrad = ctx.createRadialGradient(toX(102), toY(42), 10, toX(102), toY(42), 70);
      gobiGrad.addColorStop(0, '#fbbf24');
      gobiGrad.addColorStop(0.8, '#f59e0b');
      gobiGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = gobiGrad;
      ctx.beginPath();
      ctx.ellipse(toX(102), toY(42), 85, 28, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (land.hasSonora) {
      // Altiplano y desierto de México/Suroeste EE.UU.
      const sonoraGrad = ctx.createRadialGradient(toX(-103), toY(27), 10, toX(-103), toY(27), 50);
      sonoraGrad.addColorStop(0, '#ea580c');
      sonoraGrad.addColorStop(0.8, '#d97706');
      sonoraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sonoraGrad;
      ctx.beginPath();
      ctx.ellipse(toX(-103), toY(27), 45, 22, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Borde costero de playa de arena dorada
    ctx.save();
    drawPolygon(land.points);
    ctx.strokeStyle = '#ffeaa7';
    ctx.lineWidth = 3.5;
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
  });

  // 5. CÓDIGO CARTOGRÁFICO DECORATIVO (Nombres de Océanos y Mares estilo clásico ilustrado)
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText('OCÉANO  ATLÁNTICO', toX(-32), toY(16));
  ctx.fillText('OCÉANO  PACÍFICO', toX(-145), toY(10));
  ctx.fillText('OCÉANO  ÍNDICO', toX(78), toY(-12));
  ctx.fillText('MAR  MEDITERRÁNEO', toX(18), toY(35));
  ctx.restore();

  // 6. RED DE COORDENADAS ILUSTRADAS (Líneas de latitud / longitud sutiles)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  // Línea del Ecuador dorada brillante
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(0, toY(0));
  ctx.lineTo(w, toY(0));
  ctx.stroke();

  // Meridiano de Greenwich
  ctx.beginPath();
  ctx.moveTo(toX(0), 0);
  ctx.lineTo(toX(0), h);
  ctx.stroke();
  ctx.restore();

  return canvas;
}

// 7. GENERADOR DE NUBES ESTILIZADAS VOLUMÉTRICAS PIXAR
export function createPixarCloudsCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Nubes esponjosas en bandas ecuatoriales y templadas
  const drawCloudPuff = (cx: number, cy: number, radius: number) => {
    const puffGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    puffGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    puffGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
    puffGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = puffGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawCloudCluster = (x: number, y: number, scale: number) => {
    drawCloudPuff(x, y, 22 * scale);
    drawCloudPuff(x + 18 * scale, y - 5 * scale, 17 * scale);
    drawCloudPuff(x - 16 * scale, y + 2 * scale, 15 * scale);
    drawCloudPuff(x + 32 * scale, y + 4 * scale, 12 * scale);
    drawCloudPuff(x - 28 * scale, y + 6 * scale, 11 * scale);
  };

  // Nubes distribuidas estilizadas Pixar (sin cubrir en exceso los continentes)
  const clouds = [
    { x: 120, y: 140, s: 1.2 },
    { x: 280, y: 320, s: 1.5 },
    { x: 450, y: 160, s: 1.1 },
    { x: 600, y: 360, s: 1.3 },
    { x: 740, y: 200, s: 1.4 },
    { x: 890, y: 310, s: 1.2 },
    { x: 200, y: 410, s: 1.0 },
    { x: 520, y: 80, s: 1.2 },
    { x: 820, y: 100, s: 1.1 },
  ];

  clouds.forEach((c) => drawCloudCluster(c.x, c.y, c.s));

  return canvas;
}

// 8. GENERADOR DE EMBLEMAS Y CARTELES FLOTANTES 3D (BILLBOARDS PIXAR)
export function createPixarBadgeCanvas(
  title: string,
  emoji: string,
  accentColor: string = '#f59e0b'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, 300, 300);

  const cx = 150;
  const cy = 135;

  // Resplandor exterior circular
  const glowGrad = ctx.createRadialGradient(cx, cy, 25, cx, cy, 100);
  glowGrad.addColorStop(0, `${accentColor}99`);
  glowGrad.addColorStop(0.5, `${accentColor}44`);
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 100, 0, Math.PI * 2);
  ctx.fill();

  // Escudo / Burbuja circular de cristal 3D
  const bubbleGrad = ctx.createLinearGradient(cx, cy - 65, cx, cy + 65);
  bubbleGrad.addColorStop(0, '#1e293b');
  bubbleGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = bubbleGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 65, 0, Math.PI * 2);
  ctx.fill();

  // Borde luminoso brillante del color temático
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 6;
  ctx.stroke();

  // Arco de brillo superior (efecto cristal 3D)
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 58, Math.PI * 1.1, Math.PI * 1.9);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Icono / Emoji 3D en el centro
  ctx.font = '72px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, cx, cy + 2);

  // Cartela pill inferior con el nombre del monumento
  const bannerY = 222;
  const bannerHeight = 40;
  const textWidth = Math.min(270, Math.max(140, title.length * 12 + 28));
  const bannerX = cx - textWidth / 2;

  // Fondo de la cartela
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(bannerX, bannerY, textWidth, bannerHeight, 20);
  ctx.fill();
  ctx.stroke();

  // Texto del monumento con tipografía nítida
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, cx, bannerY + bannerHeight / 2);

  return canvas;
}
