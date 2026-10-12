import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { cleanGeneratedArtifacts, generatedDirectories } from '../scripts/clean-generated-artifacts.mjs';

async function makeWorkspace() {
  const root = await mkdtemp(join(tmpdir(), 'curileta-clean-'));
  await Promise.all([
    mkdir(join(root, 'apps/web'), { recursive: true }),
    mkdir(join(root, 'apps/studio'), { recursive: true }),
    mkdir(join(root, '.git'), { recursive: true }),
  ]);
  return root;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

test('limpia solo los artefactos permitidos y conserva metadatos ajenos', async (t) => {
  const root = await makeWorkspace();
  t.after(() => rm(root, { recursive: true, force: true }));

  for (const directory of generatedDirectories) {
    const target = join(root, directory);
    await mkdir(target, { recursive: true });
    await writeFile(join(target, 'generated-output'), 'generated');
  }
  await writeFile(join(root, '.git/index'), 'git metadata');
  await writeFile(join(root, '._checkpoint'), 'apple double metadata');
  await writeFile(join(root, 'diagnostic.log'), 'project log');

  const dryRunOutput = [];
  await cleanGeneratedArtifacts({ repositoryRoot: root, dryRun: true, log: (line) => dryRunOutput.push(line) });
  assert.equal(dryRunOutput.length, generatedDirectories.length);
  assert.equal(await exists(join(root, 'apps/web/.next/generated-output')), true);

  await cleanGeneratedArtifacts({ repositoryRoot: root, log: () => undefined });
  for (const directory of generatedDirectories) {
    assert.equal(await exists(join(root, directory)), false, `${directory} should be removed`);
  }
  assert.equal(await exists(join(root, '.git/index')), true);
  assert.equal(await exists(join(root, '._checkpoint')), true);
  assert.equal(await exists(join(root, 'diagnostic.log')), true);
});

test('rechaza un directorio padre enlazado fuera del repositorio', async (t) => {
  const root = await makeWorkspace();
  const outside = await mkdtemp(join(tmpdir(), 'curileta-clean-outside-'));
  t.after(async () => {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  });

  await mkdir(join(outside, '.next'), { recursive: true });
  await writeFile(join(outside, '.next/generated-output'), 'must survive');
  await rm(join(root, 'apps/web'), { recursive: true, force: true });
  await symlink(outside, join(root, 'apps/web'), 'dir');

  await assert.rejects(
    cleanGeneratedArtifacts({ repositoryRoot: root, dryRun: true, log: () => undefined }),
    /symlink outside the repository/,
  );
  assert.equal(await exists(join(outside, '.next/generated-output')), true);
});

test('omite artefactos cuando falta un directorio padre', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'curileta-clean-missing-parent-'));
  t.after(() => rm(root, { recursive: true, force: true }));

  await mkdir(join(root, 'apps/web'), { recursive: true });
  await assert.doesNotReject(
    cleanGeneratedArtifacts({ repositoryRoot: root, log: () => undefined }),
  );
});
