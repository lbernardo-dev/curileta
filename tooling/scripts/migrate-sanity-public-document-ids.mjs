import { createClient } from '@sanity/client';
import { makePublicDocumentId } from './sanity-document-id.mjs';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;
const dryRun = process.argv.includes('--dry-run');

if (!projectId || projectId === 'curileta-demo') {
  throw new Error('Configura SANITY_STUDIO_PROJECT_ID antes de migrar documentos.');
}
if (!token) {
  throw new Error('Configura SANITY_WRITE_TOKEN para inspeccionar o migrar documentos.');
}

const client = createClient({ projectId, dataset, apiVersion: '2025-02-19', token, useCdn: false });
const documents = await client.fetch(
  '*[_type in ["contentEntry", "siteSettings"] && !(_id in path("drafts.**"))]',
);
const migrations = documents
  .filter((document) => document._id.includes('.'))
  .map((document) => ({ document, newId: makePublicDocumentId(document) }));

if (migrations.length === 0) {
  console.log(`No hay IDs con puntos que migrar en ${projectId}/${dataset}.`);
  process.exit(0);
}

const existingNewIds = new Set(await client.fetch('*[_id in $ids]._id', {
  ids: migrations.map(({ newId }) => newId),
}));
const collisions = migrations.filter(({ newId }) => existingNewIds.has(newId));
if (collisions.length > 0) {
  throw new Error(`La migración se detuvo porque ya existen ${collisions.length} IDs de destino. No se modificó ningún documento.`);
}

console.log(`${migrations.length} documentos con ID no legible públicamente en ${projectId}/${dataset}.`);
if (dryRun) {
  for (const { document, newId } of migrations) console.log(`${document._id} -> ${newId}`);
  console.log('Vista previa completada. No se escribieron documentos en Sanity.');
  process.exit(0);
}

for (let index = 0; index < migrations.length; index += 25) {
  const batch = migrations.slice(index, index + 25);
  let transaction = client.transaction();
  for (const { document, newId } of batch) {
    const { _rev, _createdAt, _updatedAt, ...content } = document;
    transaction = transaction.createOrReplace({ ...content, _id: newId });
    transaction = transaction.delete(document._id);
  }
  await transaction.commit();
  console.log(`Migrados ${Math.min(index + batch.length, migrations.length)} de ${migrations.length}`);
}

console.log('Migración terminada. El contenido se conservó y ahora usa IDs legibles en consultas públicas.');
