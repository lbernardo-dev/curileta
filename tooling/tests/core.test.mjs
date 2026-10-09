import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateBookSchema, generateOrganizationSchema } from '../../packages/seo/src/index.ts';
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

  test('debe generar schema para Organización oficial', () => {
    const org = generateOrganizationSchema('https://curileta.com');
    assert.equal(org['@type'], 'Organization');
    assert.equal(org.name, 'Las Aventuras de Curileta');
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

