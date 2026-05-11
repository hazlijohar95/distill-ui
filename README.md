# distill-ui

A Claude Code skill that reverse-engineers any codebase's design system into a complete, interactive, agent-consumable package.

Point it at a repo. Get back tokens, components, layouts, and a production showcase that looks and feels like the real product.

## What it does

```
Your codebase ──→ distill-ui ──→ Design extraction docs (11 files)
                                  Canonical token system (JSON + native)
                                  Component registry (organized by layer)
                                  Interactive presentations (2 HTML files)
                                  Web translation (Tailwind + React, optional)
                                  Agent instructions (SYSTEM.md + CLAUDE.md)
```

## Why

You want to build something that looks like an existing product. Or you want an AI agent to build it for you. Either way, you need the design system extracted — not summarized from a screenshot, but traced from actual source code.

distill-ui reads every view, component, token, layout, and interaction pattern in a codebase, then produces output structured for both human understanding and AI consumption.

## Install

Add to your Claude Code skills directory:

```bash
# Clone into your skills folder
git clone git@github.com:hazlijohar95/distill-ui.git ~/.claude/skills/distill-ui
```

The skill auto-triggers when you say things like:
- "extract the design system from this repo"
- "distill the UI from this codebase"
- "I want to reverse-engineer how this product looks"
- "make this design agent-ready"

## Usage

### Basic extraction

```
> distill the UI from this codebase
```

Produces `design-extraction/` (audit docs) + `design-system/` (consumable output) in the project root.

### Extract and translate to web

```
> extract the design system and give me React + Tailwind output
```

Also produces `design-system/web/` with tailwind.config.ts, React components, and a CLAUDE.md ready to paste into any project.

### Extract from a remote repo

```
> git clone https://github.com/org/repo.git /tmp/repo
> distill the UI from /tmp/repo
```

### Specify depth

```
> distill the UI — go really deep, don't miss anything
```

The skill scales its output depth proportional to the codebase size.

## Output

| Directory | Purpose |
|-----------|---------|
| `design-extraction/` | 11 audit documents — evidence trail |
| `design-system/tokens.json` | Universal token reference |
| `design-system/components/` | Extracted component library |
| `design-system/SYSTEM.md` | Agent instructions |
| `design-system/presentation/index.html` | Interactive design system showcase |
| `design-system/presentation/production-showcase.html` | Full interactive product prototype |
| `design-system/web/` | Tailwind config + React components (optional) |

### The Production Showcase

The highest-value output. A single HTML file that recreates the product as an interactive prototype:

- Full app frame with working navigation
- Every major view implemented and clickable
- Command palette (Cmd+K), keyboard shortcuts, dark/light toggle
- Sheet/modal system for CRUD operations
- Realistic data, search/filter, toast notifications
- Looks like the actual product, not documentation about it

## Tested on

| Codebase | Platform | Key extraction |
|----------|----------|----------------|
| [Warp](https://github.com/warpdotdev/warp) | Rust GPU terminal | Algorithmic theming (3-color → full palette via opacity) |
| [better-auth](https://github.com/better-auth/better-auth) | Next.js + shadcn/ui | Monochrome system, opacity as the color system |
| [better-hub](https://github.com/better-auth/better-hub) | React SaaS | 216 components, GitHub-like UI density |
| [opencode](https://github.com/anomalyco/opencode) | TUI + Desktop + Web | Same tokens across 3 surfaces |
| [Autumn](https://github.com/useautumn/autumn) | React billing SaaS | 348 views, physical button shadows, atomic form CSS |

## How it works

1. **Research** — Reads the full codebase. Views, components, styles, config, patterns.
2. **Extract** — Writes lean audit documents (tables over prose, evidence over opinion).
3. **Distill** — Produces canonical tokens, component registry, layout library.
4. **Present** — Builds interactive prototypes using the extracted system.
5. **Refine** — Optionally runs design quality checks via impeccable integration.
6. **Translate** — Optionally outputs web-ready Tailwind + React.

The skill prioritizes the production showcase above all other outputs — it's the proof that the extraction actually works.

## Architecture

```
SKILL.md (470 lines)          ← Core methodology, always loaded
reference/
├── platform-detection.md     ← Loaded during Phase 0
├── design-quality.md         ← Loaded during Phase 15-16
└── showcase-architecture.md  ← Loaded during Phase 16
```

Progressive disclosure: SKILL.md stays lean, reference files load on demand per phase. This keeps context efficient while providing deep guidance where it matters.

## Works with impeccable

distill-ui extracts. [impeccable](https://github.com/pbakaus/impeccable) refines.

After extraction, use impeccable commands on the output:
```
/impeccable critique production-showcase.html  # UX design review
/impeccable polish production-showcase.html    # Final quality pass
/impeccable audit production-showcase.html     # A11y + performance
```

This creates a pipeline: **extract → present → refine** — where the design system is captured faithfully, then pushed to a higher craft bar.

## Design principles

- **Evidence over opinion** — Every token, component, and rule traces to actual code
- **Depth over breadth** — A deeply-extracted subset beats a shallow full scan
- **Interactive over static** — Presentations must feel alive, not like documentation
- **Agent-native** — Output is structured for AI consumption, not just human reading
- **Framework-agnostic** — Works on Rust, Swift, Flutter, React, Vue, terminal UIs
- **Anti-slop** — Presentations must pass the "would someone know AI made this?" test

## License

MIT
