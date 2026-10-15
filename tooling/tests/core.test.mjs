import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateBookSchema, generateVideoSchema, generateOrganizationSchema } from '../../packages/seo/src/index.ts';
import { isValidLocale, locales, defaultLocale } from '../../packages/i18n/src/config.ts';

describe('Internacionalización (@curileta/i18n)', () => {
  test('debe tener español como idioma principal', () => {
    assert.equal(defaultLocale, 'es');
  });

  test('debe validar idiomas soportados', () => {
    assert.equal(isValidLocale('es'), true);
    assert.equal(isValidLocale('en'), true);
    assert.equal(isValidLocale('fr'), false);
  });
});

describe('SEO y Schema.org JSON-LD (@curileta/seo)', () => {
  test('debe generar schema válido para libros', () => {
    const schema = generateBookSchema({
      title: 'El Misterio del Quetzal Dorado',
      isbn: '978-84-123456-0-1',
      datePublished: '2026-05-15',
      description: 'Aventura ilustrada en México',
      image: 'https://curileta.com/images/quetzal.jpg',
      inLanguage: 'es',
    });

    assert.equal(schema['@type'], 'Book');
    assert.equal(schema.name, 'El Misterio del Quetzal Dorado');
    assert.equal(schema.isbn, '978-84-123456-0-1');
  });

  test('debe generar schema válido para vídeos (VideoObject)', () => {
    const schema = generateVideoSchema({
      title: 'El misterio del reloj de arena',
      description: 'Episodio 1 de Curileta',
      thumbnailUrl: ['https://curileta.com/images/hero/curileta-world-expedition-clean-v1.jpg'],
      uploadDate: '2026-01-01T00:00:00Z',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });

    assert.equal(schema['@type'], 'VideoObject');
    assert.equal(schema.name, 'El misterio del reloj de arena');
    assert.equal(schema.description, 'Episodio 1 de Curileta');
    assert.equal(schema.embedUrl, 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    assert.ok(Array.isArray(schema.thumbnailUrl));
  });

  test('debe generar schema para Organización oficial', () => {
    const org = generateOrganizationSchema('https://curileta.com');
    assert.equal(org['@type'], 'Organization');
    assert.equal(org.name, 'Las Aventuras de Curileta');
  });
});

describe('Amazon Marketplace y Geolocalización (@curileta/web)', async () => {
  const {
    normalizeAmazonCountry,
    getAmazonBookUrl,
    detectAmazonCountryFromHeaders,
  } = await import('../../apps/web/src/lib/amazon-marketplace.ts');

  test('debe normalizar alias europeos hacia sus tiendas asignadas', () => {
    assert.equal(normalizeAmazonCountry('PT', 'es'), 'ES');
    assert.equal(normalizeAmazonCountry('AT', 'es'), 'DE');
    assert.equal(normalizeAmazonCountry('IE', 'en'), 'GB');
    assert.equal(normalizeAmazonCountry('NZ', 'en'), 'AU');
  });

  test('debe usar idioma de respaldo si el país no tiene tienda directa ni alias', () => {
    assert.equal(normalizeAmazonCountry('XX', 'es'), 'ES');
    assert.equal(normalizeAmazonCountry('XX', 'en'), 'US');
  });

  test('debe detectar país desde cabeceras Edge (Vercel / Cloudflare)', () => {
    const fakeHeaders = new Headers({ 'x-vercel-ip-country': 'ES' });
    assert.equal(detectAmazonCountryFromHeaders(fakeHeaders), 'ES');
  });

  test('debe generar URL canónica de producto con ASIN correspondiente', () => {
    const url = getAmazonBookUrl('ES', 'B0H2CT8S14');
    assert.ok(url.includes('amazon.es/dp/B0H2CT8S14'));
  });

  test('debe anexar tag de afiliado si está configurado en entorno', () => {
    const originalTag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG;
    try {
      process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG = 'curileta-affiliate-21';
      const url = getAmazonBookUrl('ES', 'B0H2CT8S14');
      assert.ok(url.endsWith('?tag=curileta-affiliate-21'));
    } finally {
      process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG = originalTag;
    }
  });
});

describe('Eventos Estacionales y Tema Temporal (@curileta/cms)', async () => {
  const { isSeasonalEventActive, cmsProvider } = await import('../../packages/cms/src/localProvider.ts');

  const mockHalloween = {
    id: 'test-halloween',
    slug: 'test-halloween',
    name: { es: 'Halloween', en: 'Halloween' },
    tagline: { es: 'Otoño', en: 'Autumn' },
    themeKey: 'halloween',
    active: true,
    startDate: '2026-10-01T00:00:00Z',
    endDate: '2026-11-05T23:59:59Z',
    bannerImage: '',
    ambientDecorations: { glowColor: '', accentColor: '', floatingEmojis: [] },
    specialChapter: {
      id: '',
      title: { es: '', en: '' },
      synopsis: { es: '', en: '' },
      releaseDate: '',
      status: 'coming_soon',
      badgeText: { es: '', en: '' },
      thumbnail: '',
    },
  };

  test('debe activar el evento temporal durante el periodo de Halloween (Octubre)', () => {
    const duringEvent = new Date('2026-10-15T12:00:00Z');
    assert.equal(isSeasonalEventActive(mockHalloween, duringEvent), true);
  });

  test('debe desactivar el evento automáticamente y volver al tema original tras el fin del evento (6 de Noviembre)', () => {
    const afterEvent = new Date('2026-11-06T00:00:01Z');
    assert.equal(isSeasonalEventActive(mockHalloween, afterEvent), false);
  });

  test('debe desactivar el evento si active es falso', () => {
    const duringEvent = new Date('2026-10-15T12:00:00Z');
    assert.equal(isSeasonalEventActive({ ...mockHalloween, active: false }, duringEvent), false);
  });

  test('getActiveEvent debe retornar null fuera de temporada, restaurando el tema original', async () => {
    const pastEventDate = new Date('2026-11-10T00:00:00Z');
    const event = await cmsProvider.getActiveEvent('es', pastEventDate);
    assert.equal(event, null);
  });
});

describe('Radar de Aventura & Navegación Geodésica (@curileta/web)', () => {
  // Haversine geodesic distance in km
  function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  // Bearing in degrees (0 = North, 90 = East, 180 = South, 270 = West)
  function calculateBearing(lat1, lon1, lat2, lon2) {
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
    const theta = Math.atan2(y, x);
    const bearing = (theta * 180) / Math.PI;
    return Math.round((bearing + 360) % 360);
  }

  test('debe calcular la distancia geodésica exacta en línea recta entre Madrid y París (~1053 km)', () => {
    const madrid = { lat: 40.4168, lng: -3.7038 };
    const paris = { lat: 48.8566, lng: 2.3522 };
    const dist = calculateHaversineDistance(madrid.lat, madrid.lng, paris.lat, paris.lng);
    assert.ok(dist >= 1040 && dist <= 1065, `Distancia esperada ~1053 km, obtenida: ${dist} km`);
  });

  test('debe calcular el rumbo azimutal de brújula en grados de 0 a 360 correctamente', () => {
    const madrid = { lat: 40.4168, lng: -3.7038 };
    const paris = { lat: 48.8566, lng: 2.3522 };
    const bearing = calculateBearing(madrid.lat, madrid.lng, paris.lat, paris.lng);
    // Madrid a París se sitúa en dirección noreste (~27° NNE)
    assert.ok(bearing >= 20 && bearing <= 35, `Rumbo esperado ~27°, obtenido: ${bearing}°`);
  });
});

describe('Perfil Editorial de Autora & Colección Solapada (@curileta/web)', async () => {
  const { normalizeAuthorName } = await import('../../apps/web/src/lib/author-pages.ts');

  test('debe normalizar el nombre literario de SweetyTaless y enlazarlo con las publicaciones del catálogo', () => {
    assert.equal(normalizeAuthorName('Sweety Taless'), 'sweetytaless');
    assert.equal(normalizeAuthorName('SweetyTaless'), 'sweetytaless');
    assert.equal(normalizeAuthorName('  SWEETY TALESS  '), 'sweetytaless');
  });
});


