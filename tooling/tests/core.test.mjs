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
