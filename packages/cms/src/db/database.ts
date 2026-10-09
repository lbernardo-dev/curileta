export type SQLiteDatabase = any;

let dbInstance: SQLiteDatabase | null = null;

function getNodeModule(name: string): any {
  if (typeof window !== 'undefined' || typeof process === 'undefined') return null;
  if (typeof (process as any).getBuiltinModule === 'function') {
    try {
      return (process as any).getBuiltinModule(name);
    } catch {
      // Fallback
    }
  }
  try {
    const { createRequire } = (process as any).getBuiltinModule('node:module');
    const req = createRequire(import.meta.url);
    return req(name);
  } catch {
    return null;
  }
}

/**
 * Resolves the absolute path to the curileta.db file.
 */
export function getDbPath(): string {
  const path = getNodeModule('node:path');
  const fs = getNodeModule('node:fs');
  if (!path || !fs) return '';

  if (typeof process !== 'undefined' && process.env.CURILETA_DB_PATH) {
    return path.resolve(process.env.CURILETA_DB_PATH);
  }

  const cwd = typeof process !== 'undefined' ? process.cwd() : '.';
  const candidates = [
    path.resolve(cwd, 'packages/cms/data/curileta.db'),
    path.resolve(cwd, '../../packages/cms/data/curileta.db'),
    path.resolve(cwd, '../packages/cms/data/curileta.db'),
    path.resolve(cwd, 'data/curileta.db'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return path.resolve(cwd, cwd.includes('packages/cms') ? 'data/curileta.db' : 'packages/cms/data/curileta.db');
}

/**
 * Gets or initializes the SQLite database connection using Node.js built-in `node:sqlite`.
 */
export function getDatabase(): SQLiteDatabase {
  if (typeof window !== 'undefined') return null;
  if (dbInstance) return dbInstance;

  try {
    const sqlite = getNodeModule('node:sqlite');
    const path = getNodeModule('node:path');
    const fs = getNodeModule('node:fs');
    if (!sqlite || !path || !fs) return null;

    const { DatabaseSync } = sqlite;
    const dbPath = getDbPath();
    if (!dbPath) return null;

    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const db = new DatabaseSync(dbPath);
    dbInstance = db;

    // Apply Schema
    initSchema(db);

    return db;
  } catch (error) {
    console.warn('[Database] node:sqlite could not be initialized directly, falling back:', error);
    return null;
  }
}

/**
 * Reads and applies schema.sql to the database.
 */
export function initSchema(db: SQLiteDatabase): void {
  const path = getNodeModule('node:path');
  const fs = getNodeModule('node:fs');
  if (!path || !fs || !db) return;

  const cwd = typeof process !== 'undefined' ? process.cwd() : '.';
  const schemaCandidates = [
    path.resolve(cwd, 'packages/cms/src/db/schema.sql'),
    path.resolve(cwd, '../../packages/cms/src/db/schema.sql'),
    path.resolve(cwd, '../packages/cms/src/db/schema.sql'),
    path.resolve(cwd, 'src/db/schema.sql'),
  ];

  let schemaSql = '';
  for (const sc of schemaCandidates) {
    if (fs.existsSync(sc)) {
      schemaSql = fs.readFileSync(sc, 'utf8');
      break;
    }
  }

  if (schemaSql) {
    db.exec(schemaSql);
  }
}
