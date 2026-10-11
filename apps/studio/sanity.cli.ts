import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'l71yzb5e',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  studioHost: 'curileta-cms',
});
