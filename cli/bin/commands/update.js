/**
 * distill-ui update / check
 *
 * Checks GitHub for newer versions and updates local skill files.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { createInterface } from 'node:readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = 'hazlijohar95/distill-ui';

const PROVIDERS = [
  '.claude/skills',
  '.cursor/skills',
  '.windsurf/skills',
  '.gemini/skills',
  '.agents/skills',
  '.github/skills',
  '.kiro/skills',
  '.opencode/skills',
];

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(r => rl.question(question, ans => { rl.close(); r(ans.trim().toLowerCase()); }));
}

function findInstalled(root) {
  const found = [];
  for (const dir of PROVIDERS) {
    const skillDir = join(root, dir, 'distill-ui');
    if (existsSync(join(skillDir, 'SKILL.md'))) {
      found.push({ dir, path: skillDir });
    }
  }
  return found;
}

function getLocalVersion(skillPath) {
  try {
    const content = readFileSync(join(skillPath, 'SKILL.md'), 'utf8');
    const match = content.match(/^version:\s*(.+)$/m);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

async function getRemoteVersion() {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${REPO}/main/package.json`);
    if (!res.ok) return null;
    const pkg = await res.json();
    return pkg.version;
  } catch {
    return null;
  }
}

function downloadAndExtract() {
  const tmpDir = join(tmpdir(), `distill-ui-update-${Date.now()}`);
  mkdirSync(tmpDir, { recursive: true });

  execSync(
    `git clone --depth 1 https://github.com/${REPO}.git "${tmpDir}/repo"`,
    { stdio: 'pipe' }
  );

  return join(tmpDir, 'repo');
}

function copySkillFrom(src, dest) {
  mkdirSync(dest, { recursive: true });

  // Copy SKILL.md
  writeFileSync(
    join(dest, 'SKILL.md'),
    readFileSync(join(src, 'SKILL.md'), 'utf8')
  );

  // Copy reference/
  const refSrc = join(src, 'reference');
  const refDest = join(dest, 'reference');
  if (existsSync(refSrc)) {
    mkdirSync(refDest, { recursive: true });
    for (const file of readdirSync(refSrc)) {
      writeFileSync(
        join(refDest, file),
        readFileSync(join(refSrc, file), 'utf8')
      );
    }
  }
}

export async function check(args) {
  const root = process.cwd();
  const installed = findInstalled(root);

  if (installed.length === 0) {
    console.log('\n  distill-ui not installed in this project.');
    console.log('  Run `npx distill-ui install` first.\n');
    process.exit(0);
  }

  console.log('\n  Checking for updates...');

  const localPkg = JSON.parse(
    readFileSync(resolve(__dirname, '..', '..', '..', 'package.json'), 'utf8')
  );
  const remoteVersion = await getRemoteVersion();

  if (!remoteVersion) {
    console.log('  Could not reach GitHub. Check your connection.\n');
    process.exit(1);
  }

  if (remoteVersion === localPkg.version) {
    console.log(`  Up to date (v${localPkg.version}).\n`);
  } else {
    console.log(`  Update available: v${localPkg.version} → v${remoteVersion}`);
    console.log(`  Run 'npx distill-ui update' to update.\n`);
  }
}

export async function update(args) {
  const yes = args.includes('--yes') || args.includes('-y');
  const root = process.cwd();
  const installed = findInstalled(root);

  if (installed.length === 0) {
    console.log('\n  distill-ui not installed in this project.');
    console.log('  Run `npx distill-ui install` first.\n');
    process.exit(1);
  }

  console.log('\n  Updating distill-ui skill...');

  let repoDir;
  try {
    repoDir = downloadAndExtract();
  } catch (e) {
    console.error(`  Download failed: ${e.message}\n`);
    process.exit(1);
  }

  // Source is either skill/ dir or root (for git-clone approach)
  const src = existsSync(join(repoDir, 'skill', 'SKILL.md'))
    ? join(repoDir, 'skill')
    : repoDir;

  if (!yes) {
    const ans = await ask(`  Update ${installed.length} installation(s)? (Y/n) `);
    if (ans === 'n' || ans === 'no') {
      rmSync(repoDir.replace('/repo', ''), { recursive: true, force: true });
      console.log('  Aborted.\n');
      process.exit(0);
    }
  }

  let count = 0;
  for (const { dir, path } of installed) {
    copySkillFrom(src, path);
    console.log(`  ✓ Updated ${dir}/distill-ui/`);
    count++;
  }

  // Cleanup
  rmSync(repoDir.replace('/repo', ''), { recursive: true, force: true });

  let version = '';
  try {
    const pkg = JSON.parse(readFileSync(join(src, '..', 'package.json'), 'utf8'));
    version = ` to v${pkg.version}`;
  } catch {}
  console.log(`\n  Updated ${count} installation(s)${version}.`);
  console.log(`  Done!\n`);
}
