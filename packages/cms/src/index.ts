export type * from './models.ts';
export type * from './CMSProvider.ts';
export * from './localProvider.ts';
export * from './db/database.ts';
export * from './db/seed.ts';
export * from './db/DatabaseCMSProvider.ts';

import { DatabaseCMSProvider } from './db/DatabaseCMSProvider.ts';

// Instancia principal respaldada por base de datos SQLite persistente
export const cmsProvider = new DatabaseCMSProvider();
