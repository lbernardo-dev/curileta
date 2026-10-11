import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { schemaTypes } from './schemas';

// Sanity project IDs are public identifiers. The environment variable can still
// select another project for a local or staging Studio build.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'l71yzb5e';

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
