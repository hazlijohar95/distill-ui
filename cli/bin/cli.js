#!/usr/bin/env node

/**
 * distill-ui CLI
 *
 * Usage:
 *   npx distill-ui install          Install skill into your AI tools
 *   npx distill-ui update           Update to latest version
 *   npx distill-ui detect [path]    Scan output for AI slop patterns
 *   npx distill-ui --help
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  console.log(`
  distill-ui — Reverse-engineer any codebase's design system

  Usage: distill-ui <command> [options]

  Commands:
    install              Install skill into detected AI tools
    update               Update skill to latest version
    check                Check if updates are available
    detect [path...]     Scan HTML/CSS for AI slop patterns
    help                 Show this message

  Options:
    --help       Show this help message
    --version    Show version number

  After installing, tell your AI tool:
    "extract the design system from this codebase"
`);
  process.exit(0);
}

if (command === '--version' || command === '-v') {
  const pkg = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8'));
  console.log(pkg.version);
  process.exit(0);
}

if (command === 'install') {
  const { install } = await import('./commands/install.js');
  await install(args.slice(1));
} else if (command === 'update') {
  const { update } = await import('./commands/update.js');
  await update(args.slice(1));
} else if (command === 'check') {
  const { check } = await import('./commands/update.js');
  await check(args.slice(1));
} else if (command === 'detect') {
  const { detect } = await import('./commands/detect.js');
  await detect(args.slice(1));
} else if (command === 'help') {
  process.argv = [process.argv[0], process.argv[1], '--help'];
  const { execSync } = await import('node:child_process');
  execSync(`node ${fileURLToPath(import.meta.url)} --help`, { stdio: 'inherit' });
} else {
  console.error(`Unknown command: ${command}`);
  console.error(`Run 'distill-ui --help' for usage.`);
  process.exit(1);
}
