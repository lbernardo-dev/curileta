import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

export default defineConfig({
  name: 'curileta-studio',
  title: 'Las Aventuras de Curileta — Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'curileta-demo',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool()],

  schema: {
    types: [],
  },
});
