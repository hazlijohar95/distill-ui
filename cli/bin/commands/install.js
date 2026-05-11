/**
 * distill-ui install
 *
 * Detects which AI coding tools are present in the project (or globally)
 * and installs SKILL.md + reference/ into the appropriate directories.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_SOURCE = resolve(__dirname, '..', '..', '..', 'skill');

const PROVIDERS = [
  { dir: '.claude/skills', name: 'Claude Code' },
  { dir: '.cursor/skills', name: 'Cursor' },
  { dir: '.windsurf/skills', name: 'Windsurf' },
  { dir: '.gemini/skills', name: 'Gemini' },
  { dir: '.agents/skills', name: 'Agents (generic)' },
  { dir: '.github/skills', name: 'GitHub Copilot' },
  { dir: '.kiro/skills', name: 'Kiro' },
  { dir: '.opencode/skills', name: 'OpenCode' },
];

const GLOBAL_PROVIDERS = [
  { dir: '.claude/skills', name: 'Claude Code (global)' },
];

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(r => rl.question(question, ans => { rl.close(); r(ans.trim().toLowerCase()); }));
}

function copySkill(destDir) {
  const skillDest = join(destDir, 'distill-ui');
  mkdirSync(skillDest, { recursive: true });

  writeFileSync(
    join(skillDest, 'SKILL.md'),
    readFileSync(join(SKILL_SOURCE, 'SKILL.md'), 'utf8')
  );

  const refSrc = join(SKILL_SOURCE, 'reference');
  const refDest = join(skillDest, 'reference');
  mkdirSync(refDest, { recursive: true });

  for (const file of readdirSync(refSrc)) {
    writeFileSync(
      join(refDest, file),
      readFileSync(join(refSrc, file), 'utf8')
    );
  }
}

function isAlreadyInstalled(root) {
  for (const { dir } of PROVIDERS) {
    const skillDir = join(root, dir, 'distill-ui');
    if (existsSync(join(skillDir, 'SKILL.md'))) return dir;
  }
  return null;
}

export async function install(args) {
  const global = args.includes('--global') || args.includes('-g');
  const yes = args.includes('--yes') || args.includes('-y');
  const root = global ? (process.env.HOME || process.env.USERPROFILE) : process.cwd();

  console.log(`\n  distill-ui installer\n`);

  const existing = isAlreadyInstalled(root);
  if (existing) {
    console.log(`  Already installed in ${existing}/distill-ui`);
    console.log(`  Run 'distill-ui update' to get the latest version.\n`);
    process.exit(0);
  }

  // Detect which providers exist in the project
  const providers = global ? GLOBAL_PROVIDERS : PROVIDERS;
  const detected = [];

  for (const provider of providers) {
    const parentDir = join(root, provider.dir.split('/')[0]);
    if (existsSync(parentDir)) {
      detected.push(provider);
    }
  }

  if (detected.length === 0) {
    // No existing provider dirs — create for common tools
    console.log('  No AI tool directories detected. Installing for:');
    console.log('    - Claude Code (.claude/skills/)');
    console.log('    - Cursor (.cursor/skills/)');
    console.log('');

    if (!yes) {
      const ans = await ask('  Proceed? (Y/n) ');
      if (ans === 'n' || ans === 'no') {
        console.log('  Aborted.\n');
        process.exit(0);
      }
    }

    const defaults = [
      { dir: '.claude/skills', name: 'Claude Code' },
      { dir: '.cursor/skills', name: 'Cursor' },
    ];

    for (const provider of defaults) {
      const dest = join(root, provider.dir);
      mkdirSync(dest, { recursive: true });
      copySkill(dest);
      console.log(`  ✓ ${provider.name} → ${provider.dir}/distill-ui/`);
    }
  } else {
    console.log(`  Detected AI tools:`);
    for (const p of detected) {
      console.log(`    - ${p.name}`);
    }
    console.log('');

    if (!yes) {
      const ans = await ask('  Install distill-ui skill into these? (Y/n) ');
      if (ans === 'n' || ans === 'no') {
        console.log('  Aborted.\n');
        process.exit(0);
      }
    }

    for (const provider of detected) {
      const dest = join(root, provider.dir);
      mkdirSync(dest, { recursive: true });
      copySkill(dest);
      console.log(`  ✓ ${provider.name} → ${provider.dir}/distill-ui/`);
    }
  }

  console.log(`\n  Done! Tell your AI tool:`);
  console.log(`  "extract the design system from this codebase"\n`);
}
