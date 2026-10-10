import { createClient } from '@sanity/client';
import { DatabaseCMSProvider } from '../../packages/cms/src/db/DatabaseCMSProvider.ts';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;
const dryRun = process.argv.includes('--dry-run');

if (!projectId || projectId === 'curileta-demo') {
  throw new Error('Configura SANITY_STUDIO_PROJECT_ID antes de importar contenido.');
}
if (!dryRun && !token) {
  throw new Error('Configura SANITY_WRITE_TOKEN o ejecuta el comando con --dry-run.');
}

const provider = new DatabaseCMSProvider();
const contentGroups = [
  ['character', await provider.getCharacters()],
  ['book', await provider.getBooks()],
  ['adventure', await provider.getAdventures()],
  ['video', await provider.getVideos()],
  ['song', await provider.getSongs()],
  ['location', await provider.getLocations()],
  ['trailWaypoint', await provider.getTrailWaypoints()],
  ['narrativeMilestone', await provider.getNarrativeMilestones()],
  ['mentionedCuriosity', await provider.getMentionedCuriosities()],
  ['wallpaper', await provider.getWallpapers()],
  ['seasonalEvent', await provider.getSeasonalEvents()],
  ['letter', await provider.getLetters()],
  ['universeRoadmapItem', await provider.getUniverseRoadmap()],
  ['collaboration', await provider.getCollaborations()],
];

const documents = contentGroups.flatMap(([contentType, entries]) =>
  entries.map((entry, index) => {
    const entryId = entry.id || `${contentType}-${entry.order ?? entry.stepNumber ?? index + 1}`;
    const document = {
      _id: `contentEntry.${contentType}.${entryId}`,
      _type: 'contentEntry',
      contentType,
      ...entry,
      id: entryId,
    };
    if (contentType === 'character' && document.name) {
      document.characterName = document.name;
      delete document.name;
    }
    if (contentType === 'book' && document.coverImage) {
      document.cover = document.coverImage;
      delete document.coverImage;
    }
    return document;
  }),
);

const settings = await provider.getSiteSettings();
const settingsDocument = { _id: 'siteSettings.singleton', _type: 'siteSettings', ...settings };
documents.push(settingsDocument);

for (const [contentType, entries] of contentGroups) {
  console.log(`${contentType}: ${entries.length}`);
}
console.log(`siteSettings: 1`);
console.log(`Total: ${documents.length} documentos para ${projectId}/${dataset}`);

if (dryRun) {
  console.log('Vista previa completada. No se escribieron documentos en Sanity.');
  process.exit(0);
}

const client = createClient({ projectId, dataset, apiVersion: '2025-02-19', token, useCdn: false });
for (let index = 0; index < documents.length; index += 50) {
  const batch = documents.slice(index, index + 50);
  let transaction = client.transaction();
  for (const document of batch) transaction = transaction.createOrReplace(document);
  await transaction.commit();
  console.log(`Importados ${Math.min(index + batch.length, documents.length)} de ${documents.length}`);
}

console.log('Importación terminada. Los documentos existentes con esos identificadores se actualizaron.');
