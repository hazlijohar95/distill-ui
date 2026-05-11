/**
 * distill-ui detect
 *
 * Scans HTML/CSS files for AI slop patterns.
 * Based on the quality methodology reference.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';

const PATTERNS = [
  {
    id: 'side-stripe',
    name: 'Side-stripe border',
    desc: 'Thick colored border-left on cards (AI dashboard tell)',
    test: (css) => /border-left:\s*(3|4|5|6)\s*px\s+solid\s+(?!(?:#[0-9a-f]{3,8}|rgb|hsl).*(?:gray|grey|neutral|slate|zinc))/i.test(css),
  },
  {
    id: 'gradient-text',
    name: 'Gradient text',
    desc: 'background-clip: text with gradient',
    test: (css) => /background-clip:\s*text/i.test(css) && /gradient/i.test(css),
  },
  {
    id: 'nested-cards',
    name: 'Nested cards',
    desc: 'Cards inside cards',
    test: (html) => /class="[^"]*card[^"]*"[^]*class="[^"]*card[^"]*"/i.test(html),
  },
  {
    id: 'bounce-easing',
    name: 'Bounce/elastic easing',
    desc: 'Spring physics or overshoot curves',
    test: (css) => /bounce|elastic|spring/i.test(css) || /cubic-bezier\([^)]*[2-9]\./i.test(css),
  },
  {
    id: 'pure-black-white',
    name: 'Pure black/white',
    desc: '#000000 or #ffffff without justification',
    test: (css) => /#000000|#000;|: black[;\s]|#ffffff|#fff;|: white[;\s]/i.test(css),
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    desc: 'Decorative backdrop-filter blur with transparency',
    test: (css) => /backdrop-filter:\s*blur/i.test(css) && /rgba?\([^)]*0\.[2-6]/i.test(css),
  },
  {
    id: 'icon-tile-stack',
    name: 'Icon tile stack',
    desc: 'Rounded-square icon container above heading, repeated',
    test: (html) => {
      const matches = html.match(/border-radius[^;]*;\s*[^}]*width:\s*(32|40|48|56|64|72|80|96|128)\s*px/gi);
      return matches && matches.length >= 3;
    },
  },
  {
    id: 'identical-card-grid',
    name: 'Identical card grid',
    desc: 'Same-size cards with icon+heading+text repeated 3+ times',
    test: (html) => {
      const cardPattern = /<div[^>]*class="[^"]*card[^"]*"[^>]*>\s*<(?:svg|img|i)[^>]*>[\s\S]*?<h[2-4]/gi;
      const matches = html.match(cardPattern);
      return matches && matches.length >= 3;
    },
  },
  {
    id: 'hero-metric',
    name: 'Hero metric template',
    desc: 'Big number + small label pattern repeated',
    test: (html) => {
      const metricPattern = /<(?:span|div|p)[^>]*class="[^"]*(?:metric|stat|number|value)[^"]*"[^>]*>\s*[\d$%,]+/gi;
      const matches = html.match(metricPattern);
      return matches && matches.length >= 3;
    },
  },
  {
    id: 'monotonous-spacing',
    name: 'Monotonous spacing',
    desc: 'Same padding/margin value used >60% of declarations',
    test: (css) => {
      const spacingValues = css.match(/(?:padding|margin|gap):\s*([^;]+)/gi) || [];
      if (spacingValues.length < 5) return false;
      const counts = {};
      for (const v of spacingValues) {
        const val = v.replace(/(?:padding|margin|gap):\s*/i, '').trim();
        counts[val] = (counts[val] || 0) + 1;
      }
      const max = Math.max(...Object.values(counts));
      return max / spacingValues.length > 0.6;
    },
  },
  {
    id: 'everything-centered',
    name: 'Everything centered',
    desc: 'All text center-aligned',
    test: (css) => {
      const centerCount = (css.match(/text-align:\s*center/gi) || []).length;
      const leftCount = (css.match(/text-align:\s*(?:left|start)/gi) || []).length;
      return centerCount > 5 && leftCount === 0;
    },
  },
  {
    id: 'overused-font',
    name: 'Overused AI font',
    desc: 'Inter, Roboto, or Plus Jakarta Sans as sole font choice',
    test: (css) => {
      const fonts = css.match(/font-family:[^;]+/gi) || [];
      const overused = /inter|roboto|plus jakarta|geist/i;
      const unique = new Set(fonts.map(f => f.toLowerCase()));
      return unique.size <= 2 && fonts.some(f => overused.test(f));
    },
  },
  {
    id: 'flat-type-hierarchy',
    name: 'Flat type hierarchy',
    desc: 'Font sizes too close together (< 1.25 ratio)',
    test: (css) => {
      const sizes = [];
      const matches = css.matchAll(/font-size:\s*([\d.]+)\s*(?:px|rem)/gi);
      for (const m of matches) {
        const val = parseFloat(m[1]);
        if (m[0].includes('rem')) sizes.push(val * 16);
        else sizes.push(val);
      }
      if (sizes.length < 3) return false;
      const unique = [...new Set(sizes)].sort((a, b) => a - b);
      for (let i = 1; i < unique.length; i++) {
        if (unique[i] / unique[i - 1] < 1.15 && unique[i] > 14) return true;
      }
      return false;
    },
  },
];

function scanFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const findings = [];

  for (const pattern of PATTERNS) {
    try {
      if (pattern.test(content)) {
        findings.push({
          file: filePath,
          pattern: pattern.id,
          name: pattern.name,
          desc: pattern.desc,
        });
      }
    } catch {
      // Pattern matching error — skip
    }
  }

  return findings;
}

function collectFiles(paths) {
  const files = [];
  const extensions = new Set(['.html', '.css', '.scss', '.vue', '.svelte', '.jsx', '.tsx']);

  for (const p of paths) {
    const resolved = resolve(p);
    if (!existsSync(resolved)) {
      console.error(`  Not found: ${p}`);
      continue;
    }

    const stat = statSync(resolved);
    if (stat.isFile() && extensions.has(extname(resolved))) {
      files.push(resolved);
    } else if (stat.isDirectory()) {
      walkDir(resolved, files, extensions);
    }
  }

  return files;
}

function walkDir(dir, files, extensions, depth = 0) {
  if (depth > 10) return;
  try {
    for (const entry of readdirSync(dir)) {
      if (entry.startsWith('.') || entry === 'node_modules') continue;
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isFile() && extensions.has(extname(full))) {
        files.push(full);
      } else if (stat.isDirectory()) {
        walkDir(full, files, extensions, depth + 1);
      }
    }
  } catch {}
}

export async function detect(args) {
  const paths = args.filter(a => !a.startsWith('-'));
  if (paths.length === 0) paths.push('.');

  const json = args.includes('--json');
  const files = collectFiles(paths);

  if (files.length === 0) {
    console.log('\n  No HTML/CSS files found to scan.\n');
    process.exit(0);
  }

  const allFindings = [];
  for (const file of files) {
    const findings = scanFile(file);
    allFindings.push(...findings);
  }

  if (json) {
    console.log(JSON.stringify({ files: files.length, findings: allFindings }, null, 2));
    process.exit(allFindings.length > 0 ? 1 : 0);
  }

  console.log(`\n  distill-ui detect — AI slop scanner`);
  console.log(`  Scanned ${files.length} file(s)\n`);

  if (allFindings.length === 0) {
    console.log('  ✓ No AI slop patterns detected. Clean output.\n');
    process.exit(0);
  }

  console.log(`  Found ${allFindings.length} pattern(s):\n`);

  const grouped = {};
  for (const f of allFindings) {
    if (!grouped[f.file]) grouped[f.file] = [];
    grouped[f.file].push(f);
  }

  for (const [file, findings] of Object.entries(grouped)) {
    const rel = file.replace(process.cwd() + '/', '');
    console.log(`  ${rel}`);
    for (const f of findings) {
      console.log(`    ⚠  ${f.name} — ${f.desc}`);
    }
    console.log('');
  }

  console.log(`  ${allFindings.length} issue(s) found. Fix before delivering.\n`);
  process.exit(1);
}
