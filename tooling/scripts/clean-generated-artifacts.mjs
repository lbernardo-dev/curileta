import { realpath, rm } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRepositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const generatedDirectories = [
  'apps/web/.next',
  'apps/studio/dist',
  'apps/studio/.sanity',
  '.turbo',
  'coverage',
  'playwright-report',
  'test-results',
];

export async function cleanGeneratedArtifacts({
  repositoryRoot = defaultRepositoryRoot,
  dryRun = false,
  log = console.log,
} = {}) {
  const root = await realpath(repositoryRoot);

  for (const relativePath of generatedDirectories) {
    const absolutePath = resolve(root, relativePath);
    if (!absolutePath.startsWith(`${root}${sep}`)) {
      throw new Error(`Refusing to clean a path outside the repository: ${relativePath}`);
    }
    let realParentDirectory;
    try {
      realParentDirectory = await realpath(dirname(absolutePath));
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error
        && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) {
        log(`[clean] Skipped ${relativePath} because its parent directory is missing`);
        continue;
      }
      throw error;
    }
    if (realParentDirectory !== root
      && !realParentDirectory.startsWith(`${root}${sep}`)) {
      throw new Error(`Refusing to clean through a symlink outside the repository: ${relativePath}`);
    }

    if (dryRun) {
      log(`[clean] Would remove ${relativePath}`);
      continue;
    }

    await rm(absolutePath, { recursive: true, force: true });
    log(`[clean] Removed ${relativePath}`);
  }
}

const entryPoint = process.argv[1] ? resolve(process.argv[1]) : '';
if (entryPoint === resolve(fileURLToPath(import.meta.url))) {
  await cleanGeneratedArtifacts({ dryRun: process.argv.includes('--dry-run') });
}
