import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getDatabase, seedDatabase, DatabaseCMSProvider } from '../../packages/cms/src/index.ts';

describe('Base de Datos Persistente & Backend CMS (@curileta/cms)', async () => {
  const db = getDatabase();
  assert.ok(db, 'La base de datos SQLite debe inicializarse correctamente');

  // Asegurar seed
  seedDatabase(false);

  const provider = new DatabaseCMSProvider();

  test('La base de datos SQLite debe contener las 19 entidades de personajes', async () => {
    const characters = await provider.getCharacters('es');
    assert.equal(characters.length, 19, 'Debe haber 19 personajes en la BD');
    const curileta = characters.find((c) => c.slug === 'curileta');
    assert.ok(curileta, 'Curileta debe existir en la BD');
    assert.equal(curileta.name, 'Curileta');
  });

  test('La base de datos SQLite debe contener los libros oficiales', async () => {
    const books = await provider.getBooks('es');
    assert.equal(books.length, 2, 'Debe haber 2 libros en la BD');
    const book1 = books.find((b) => b.slug === 'las-aventuras-de-curileta');
    assert.ok(book1, 'El libro oficial 1 debe existir');
    assert.equal(book1.title.es, 'Las Aventuras de Curileta');
  });

  test('La base de datos SQLite debe contener las 11 cartas a Pompón', async () => {
    const letters = await provider.getLetters('es');
    assert.equal(letters.length, 11, 'Debe haber 11 cartas postales en la BD');
    assert.equal(letters[0].country.es, 'México');
    assert.equal(letters[10].country.es, 'España');
  });

  test('getLetterById debe retornar la carta solicitada con fotos y matasellos', async () => {
    const letter = await provider.getLetterById('japon', 'es');
    assert.ok(letter, 'La carta de Japón debe existir');
    assert.equal(letter.order, 5);
    assert.ok(letter.photos.length > 0, 'Debe incluir fotografías de la expedición');
  });

  test('La base de datos SQLite debe contener las locaciones y waypoints del mapa', async () => {
    const locations = await provider.getLocations('es');
    const waypoints = await provider.getTrailWaypoints('es');
    assert.ok(locations.length >= 10, 'Debe haber locaciones registradas en la BD');
    assert.ok(waypoints.length >= 8, 'Debe haber hitos del mapa registrados en la BD');
  });

  test('La base de datos SQLite debe contener el roadmap del universo en expansión', async () => {
    const roadmap = await provider.getUniverseRoadmap('es');
    assert.equal(roadmap.length, 4, 'Debe haber 4 líneas de expansión en el universo');
  });

  test('La base de datos SQLite debe contener las categorías de colaboración B2B', async () => {
    const collabs = await provider.getCollaborations('es');
    assert.equal(collabs.length, 3, 'Debe haber 3 categorías de colaboración');
  });

  test('La base de datos SQLite debe contener la configuración y estadísticas del sitio', async () => {
    const settings = await provider.getSiteSettings('es');
    assert.ok(settings, 'Debe existir la configuración del sitio');
    assert.equal(settings.totalCountriesCount, 11);
    assert.equal(settings.totalCharactersCount, 19);
  });
});
