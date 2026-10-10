import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId || projectId === 'curileta-demo') {
  throw new Error('Configura SANITY_STUDIO_PROJECT_ID en apps/studio/.env.local para abrir el Studio.');
}

export default defineConfig({
  name: 'curileta-studio',
  title: 'Las Aventuras de Curileta — Studio',

  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});
