---
name: distill-ui
description: Deep UI extraction and design system distillation from any codebase — web (React, Vue, Svelte, Next.js), native (Rust, Swift, Kotlin, C++), or mobile (Flutter, React Native, SwiftUI) — with optional web translation for agent-ready output. Use this skill whenever the user wants to extract a design system, audit UI components, distill visual tokens, create a component registry, document a codebase's visual language, generate a design system presentation, or make an existing project's UI reproducible by AI agents. Also use when the user says "distill", "extract design", "UI audit", "design tokens", "component inventory", or wants to understand/document how any UI system looks and works — regardless of whether it's web, desktop, mobile, or terminal. This skill inspects actual source code and produces a complete, evidence-backed design system with interactive prototypes that feel like the original product.
---

# distill-ui

You are performing deep extraction of a codebase's entire UI system — tokens, components, layouts, interactions, and implicit design philosophy — regardless of platform.

Your output enables another AI agent to build new screens indistinguishable from the original. The production showcase must feel like the actual product — not documentation about it.

## Reference Files

Load these on demand during relevant phases:

| Reference | When to load | Path |
|-----------|-------------|------|
| Platform Detection | Phase 0 (orientation) | [reference/platform-detection.md](reference/platform-detection.md) |
| Quality Methodology | Phase 2-3, 8-9, 13 (extraction + system output) | [reference/quality-methodology.md](reference/quality-methodology.md) |
| Design Quality | Phase 15-16 (presentations) | [reference/design-quality.md](reference/design-quality.md) |
| Showcase Architecture | Phase 16 (production showcase) | [reference/showcase-architecture.md](reference/showcase-architecture.md) |

---

## Execution Strategy

This skill produces 30+ files. Context exhaustion before the highest-value outputs is the primary failure mode. Follow this order strictly:

| Phase | What | Priority | Notes |
|-------|------|----------|-------|
| A | **Research** | — | Read deeply. No writing yet. Understand the full picture. |
| B | **Extraction docs** | Medium | 11 documents. Tables over prose. ~100-150 lines each. |
| C | **Design system core** | High | tokens.json, SYSTEM.md, registry.json, components, layouts, blocks. |
| D | **Production showcase** | Critical | The most important single file. Never skip or shortcut this. |
| E | **index.html + web/** | Low | Skip these before skipping the showcase. |

If running low on context: drop Phase E entirely, compress Phase B, but always deliver Phase D at full depth.

---

## Target Platform

Determine the output target before starting:

| Target | What you produce | When |
|--------|-----------------|------|
| **Same as source** (default) | Tokens/components in source language | No specific request |
| **Web translation** | + React + Tailwind output | User says "for React/web" |
| **Agent-ready** | + CLAUDE.md, registry.json, SYSTEM.md | User says "agent-ready" or "for Claude" |

If the user says "make it agent-ready", do all three targets.

---

## Core Rules

1. **Extract what exists.** Do not invent tokens, components, or philosophy.
2. **Evidence-backed.** Every claim needs a file path or usage pattern.
3. **Trace actual code.** Config files and theme files are starting points, not endpoints.
4. **Depth over breadth.** A deeply-extracted subset beats a shallow full scan.
5. **The showcase is the product.** It must be interactive and feel real.
6. **Never stop early.** Continue until all high-importance files are inspected.

---

## Output Structure

```
project-root/
├── design-extraction/          ← Evidence trail (11 audit docs)
│   ├── 00-project-orientation.md
│   ├── 01-ui-inventory.md
│   ├── 02-token-audit.md
│   ├── 03-component-audit.md
│   ├── 04-layout-system.md
│   ├── 05-interaction-motion.md
│   ├── 06-assets-iconography.md
│   ├── 07-page-flow-audit.md
│   ├── 08-design-dna.md
│   ├── 99-coverage-report.md
│   └── 99-final-summary.md
│
└── design-system/              ← Consumable output
    ├── tokens.json             ← Universal token reference
    ├── tokens.{css|rs|swift}   ← Native format
    ├── token-decisions.md
    ├── SYSTEM.md               ← Agent instructions
    ├── registry.json           ← Component/token index
    ├── components/
    │   ├── primitives/
    │   ├── composites/
    │   ├── layouts/
    │   ├── blocks/
    │   └── templates/
    ├── layouts/
    ├── blocks/
    ├── presentation/
    │   ├── index.html              ← Design system showcase
    │   └── production-showcase.html ← Interactive product prototype ★
    └── web/                    ← (if web translation requested)
        ├── tailwind.config.ts
        ├── tokens.css
        ├── components/
        ├── blocks/
        └── CLAUDE.md
```

---

## Phase 0: Project Orientation

Identify the UI paradigm. This determines everything else. Load [reference/platform-detection.md](reference/platform-detection.md) for detection signals and grep patterns.

Detect platform category:
- **Web:** React/Vue/Svelte/Angular + Tailwind/CSS modules/styled-components
- **Native Desktop:** Rust GPU (Warp, Zed), GTK, Qt, AppKit, Electron
- **Mobile:** SwiftUI, Jetpack Compose, Flutter, React Native
- **Terminal UI:** ratatui, blessed, ink, crossterm

Determine the **register** (this affects presentation style):
- **Brand** — marketing site, landing page, editorial content. Design IS the product.
- **Product** — app UI, dashboard, tool. Design SERVES the product.

Document in `00-project-orientation.md`:
- UI platform, framework, rendering approach
- Register (brand or product)
- Styling system and how visual properties are expressed
- View/screen/route structure (list ALL routes)
- Component locations (list directories)
- Global style/theme source files (list with purpose)
- Third-party UI dependencies
- Theming system (light/dark, custom themes)
- Initial design system hypothesis
- Areas requiring deep inspection

---

## Phase 1: UI Inventory

Create `01-ui-inventory.md` — a complete table of every UI-relevant file.

Columns: File | Category | Status | Importance | Purpose

Categories: view, layout, primitive, composite, block, template, token-source, asset, utility, provider

Mark inspection status honestly. Do not proceed to final output unless all high-importance files are at least partially inspected.

---

## Phase 2: Token Extraction

Extract every visual primitive from the codebase. Search across ALL source files, not just theme files. Load [reference/quality-methodology.md](reference/quality-methodology.md) for extraction-as-relationships techniques.

**Extract:** Colors, typography (family/weight/size/line-height/letter-spacing), spacing, border-radius, shadows/elevation, borders, opacity, z-index, motion (duration/easing/spring configs), breakpoints, focus indicators, loading tokens.

Create `02-token-audit.md` with tables per category:
- Value | Token Name | Semantic Role | Source File | Frequency | Notes

Rules:
- Record all forms a value appears in (CSS var, Tailwind class, struct field)
- Preserve semantic names where they exist
- Document inconsistencies between token definitions and actual usage
- Every canonical token must trace to actual code
- Extract the SYSTEM behind the values, not just the values themselves:
  - Typography: identify the modular scale ratio (e.g., 1.25 Major Third)
  - Colors: note tinted neutrals, accent scarcity (% of surface), chroma at extremes
  - Spacing: categorize by semantic role (tight/default/loose/section/dramatic)
  - Motion: note constraints (what's banned) alongside what's used

---

## Phase 3: Component Extraction

Inspect every reusable component AND every repeated inline pattern. Apply state completeness audit from [reference/quality-methodology.md](reference/quality-methodology.md).

For each, document in `03-component-audit.md`:
- Name, file path, category, purpose
- Props/API, variants, states (audit all 8: default/hover/focus/active/disabled/loading/error/success)
- State completeness score (e.g., "6/8 states defined")
- Tokens used, child components, parent components
- Styling strategy
- Real usage examples (where it appears)

Also inspect: inline/local components, anonymous render blocks, repeated patterns across views, duplicated structures. If a pattern appears >1 time, it deserves extraction.

Flag components with fewer than 5/8 states — consuming agents need to know what's specified vs what they'd need to invent.

---

## Phase 4: Layout System

Extract how views are composed spatially. Document in `04-layout-system.md`:

- App shell / root layout (sidebar + content, header + body, etc.)
- Page shells and content width constraints
- Navigation structure
- Grid/flex/stack patterns
- Card, form, table, list, split-pane layouts
- Responsive/adaptive behavior
- Spacing rhythm and density patterns
- Scroll regions and overflow behavior

For each pattern: exact implementation, where it appears, how it adapts.

---

## Phase 5: Interaction and Motion

Extract all interaction behavior. Document in `05-interaction-motion.md`:

For each interaction pattern:
- Trigger → Visual response → Duration → Easing → Source

Cover: hover effects, focus indicators, active/pressed states, transitions, loading indicators, modal/sheet open/close, dropdown behavior, tooltip timing, accordion/collapse, tab switching, toast appearance, command palette, drag-and-drop, scroll-driven effects, keyboard shortcuts.

---

## Phase 6: Assets and Iconography

Document in `06-assets-iconography.md`:
- Icon system (library, sizes, stroke width, color rules)
- Logo usage, image treatment, avatar patterns
- Empty-state visuals, background patterns, decorative elements

---

## Phase 7: Page/Flow Audit

For each major view/route, document in `07-page-flow-audit.md`:
- Purpose, layout used, sections/regions
- Components used, states (loading/error/empty/populated)
- User actions available, modals/sheets triggered
- Key interactions and navigation behavior

This is the primary reference for the production showcase — be exhaustive here.

---

## Phase 8: Design DNA

Distill the implicit design language in `08-design-dna.md`. Load [reference/quality-methodology.md](reference/quality-methodology.md) — apply the reflex test and named rules pattern.

Document:
- Product feel (emotional/visual tone)
- Color philosophy, typography philosophy, spacing philosophy
- Shape language, density rules, motion philosophy
- What makes this UI instantly recognizable (5-10 traits)
- Anti-patterns with intent classification (intentional brand choice vs accidental debt)
- Named rules (e.g., "The One Voice Rule", "The Flat-by-Default Rule") with enforcement criteria

**The Reflex Test:** If someone could guess your Design DNA from the product category alone, you haven't gone deep enough. What's surprising or non-obvious about this system?

---

## Phase 9: Canonical Token System

Create from the audit (do not invent values):

- `/design-system/tokens.json` — universal structured reference
- `/design-system/tokens.{css|rs|swift|dart}` — native format
- `/design-system/token-decisions.md` — rationale for canonical choices

Token layers: primitive → semantic → component.

---

## Phase 10: Component Registry

Create components in `/design-system/components/` organized by: primitives/, composites/, layouts/, blocks/, templates/.

Each file: implementation in source language, all variants/states, usage examples, token references.

---

## Phase 11: Layout Library

Create `/design-system/layouts/README.md` with spacing rules, density rules, composition examples, and which layout to use when.

---

## Phase 12: Block Recipes

Create `/design-system/blocks/README.md` with full copy-pasteable block implementations. Use realistic content from the product domain — never lorem ipsum.

---

## Phase 13: Agent System Instructions

Create `/design-system/SYSTEM.md` — what another AI agent reads before building anything. Load [reference/quality-methodology.md](reference/quality-methodology.md) for named rules format.

Structure SYSTEM.md with:
- **Named design rules** (5-7, each with: name, one-sentence rule, enforcement test, source evidence)
- Token hierarchy (when to use primitive vs semantic vs component layer)
- Component selection guide (which component for which purpose)
- Composition rules (cognitive load limits, density parameters, layout selection)
- Interaction rules (which states are mandatory, transition constraints)
- Anti-patterns (what to never do, with WHY for each)
- Register declaration (brand or product — determines the quality bar)
- Done checklist (self-audit before delivering)

The rules must be testable. "Use the brand color" is vague. "Magenta occupies less than 10% of any viewport — if emphasis is needed, use size or weight" is testable.

---

## Phase 14: Registry Index

Create `/design-system/registry.json` mapping every token, component, layout, block, and template with metadata.

---

## Phase 15: Design System Presentation

Create `/design-system/presentation/index.html` — an interactive design system showcase.

Load [reference/design-quality.md](reference/design-quality.md) before building. Apply the AI slop test and production bar.

Requirements:
- Self-contained single HTML file, no external dependencies except Google Fonts
- CSS custom properties from extracted tokens
- Smooth scroll navigation with active section tracking
- Scroll-driven section entrance animations (IntersectionObserver)
- Interactive component demos (buttons respond to hover/active, toggles toggle, inputs focus with glow)
- Color swatches with copy-on-click
- Typography specimens with actual font stacks
- Dark/light toggle if source supports theming
- Toast notifications triggered by interactions
- Keyboard navigation (J/K sections, Escape close)
- Must look like the product's own design tool, not generic documentation
- Must pass the AI slop test (see reference/design-quality.md)

---

## Phase 16: Production Showcase

> **This is the single most important file you produce.**
> The user evaluates the entire extraction by opening this file.
> If it feels shallow or documentation-like, the extraction has failed.

Load [reference/showcase-architecture.md](reference/showcase-architecture.md) for the proven implementation pattern.
Load [reference/design-quality.md](reference/design-quality.md) for craft standards.

Create `/design-system/presentation/production-showcase.html` — a fully interactive prototype that feels like the actual product.

### Depth Formula

Scale the showcase proportional to codebase complexity:

| Codebase size | Minimum lines | Views | Requirement |
|---------------|---------------|-------|-------------|
| < 10 routes | 800+ | 4+ | Core product flows |
| 10–30 routes | 1200+ | 6+ | All major views |
| 30+ routes | 1500+ | 8+ | Every significant product flow |

Every significant route in the source must have a corresponding interactive implementation.

### Architecture Pattern

Always use this proven architecture:

```javascript
// 1. State object (single source of truth)
const state = {
  page: 'default',
  theme: localStorage.getItem('app-theme') || 'light',
  // ... all app state
};

// 2. Page renderers (one function per view, returns HTML string)
const pages = {
  products: () => `<div class="page">...</div>`,
  customers: () => `<div class="page">...</div>`,
  // ... every view
};

// 3. Navigation function
function navigate(page) {
  state.page = page;
  updateNav();
  render();
}

// 4. Sheet/modal system (reusable for all CRUD)
function openSheet(type) { ... }
function closeSheet() { ... }
function getSheetContent(type) { /* switch on type */ }

// 5. Toast system
function toast(msg, type) { ... }

// 6. Keyboard shortcuts
document.addEventListener('keydown', (e) => { ... });

// 7. Theme with localStorage persistence
function toggleTheme() { ... }
```

### Mandatory Features

1. **Full app frame** — sidebar navigation + main content area filling the viewport
2. **Every major view** — not just 2-3 pages. Implement ALL significant product views
3. **Working navigation** — click sidebar/tabs to switch between views
4. **State management** — clicks change state, UI responds
5. **Sheet/modal system** — for all CRUD operations (create, edit, delete)
6. **Command palette** — Cmd+K with search, keyboard nav, number shortcuts
7. **Toast notifications** — triggered by user actions, auto-dismiss
8. **Dark/light theme** — toggle persisted to localStorage
9. **Realistic data** — actual product domain content, not placeholders
10. **Search/filter** — working search on list views
11. **Table interactions** — sortable, clickable rows, status badges
12. **Form interactions** — inputs focus with proper glow, selects work, checkboxes toggle
13. **Confirmation dialogs** — for destructive actions
14. **Empty states** — for views with no data
15. **Keyboard shortcuts** — Cmd+K, Cmd+B (sidebar), Cmd+, (settings), Escape, number keys
16. **Detail views** — click a list item → navigate to detail page with back button
17. **Tabs within views** — secondary navigation inside detail pages

### Content Requirements

- Realistic content matching the product's actual domain
- Real navigation labels, real setting names, real feature names
- Multiple data states: populated tables, empty states, loading indicators
- 5+ items in every table/list (not 2-3)

### Technical Requirements

- Self-contained single HTML file
- No external dependencies (except Google Fonts link)
- Vanilla JS — no framework
- CSS custom properties from tokens.json
- The product's actual fonts, colors, spacing, radius, shadows
- Smooth animations (CSS transitions, not janky)
- Responsive but optimized for the product's primary viewport

### The CEO Test

Show this to the product's CEO. They should say "this looks like our app" — not "this looks like documentation about our app." If they wouldn't say that, it's not done.

---

## Phase 17: Quality Control

Create `99-coverage-report.md`: files scanned, files inspected, views covered, components covered, gaps, confidence score (0-100).

Create `99-final-summary.md`: what was extracted, most important rules, how an AI agent should use this.

---

## Phase 18: Web Translation (if requested)

Create `/design-system/web/`:

**tailwind.config.ts** — every value traces to token audit, includes colors, fonts, spacing, radius, shadows, transitions, keyframes.

**tokens.css** — complete CSS custom properties with primitive/semantic/component layers.

**components/** — React components using Tailwind, supporting all extracted variants/states, with TypeScript types.

**blocks/** — full page sections ready to copy-paste with realistic content.

**CLAUDE.md** — under 100 lines, dense and scannable:
- Quick reference (fonts, radius, transitions)
- Top 5-7 rules from SYSTEM.md
- Available components list
- Token usage guide
- Top 5 anti-patterns

---

## Post-Extraction: Design Quality Loop

After extraction is complete, the output can be refined using design-focused tools. If `impeccable` is available in the environment, recommend:

1. **`/impeccable critique`** on the production-showcase.html — get a UX design review
2. **`/impeccable polish`** on the showcase — final quality pass on spacing, alignment, consistency
3. **`/impeccable audit`** — accessibility and performance check on the HTML output

This turns distill-ui from extraction-only into an extraction → refinement pipeline. The extraction captures what exists; impeccable pushes it to a higher craft bar.

If impeccable is not available, self-audit against [reference/design-quality.md](reference/design-quality.md) before delivering.

---

## Integrity Rules

**Never:**
- Invent tokens, components, or philosophy not found in source
- Rewrite the system into your preferred aesthetic
- Claim coverage of files you didn't inspect
- Use lorem ipsum or generic placeholder content

**When uncertain:**
```
Status: unverified
Reason: [why]
Evidence needed: [what would confirm]
```

---

## Completion

When finished, respond with:

```
# Design System Extraction Complete

**Platform:** [detected]
**Routes/views:** [count]
**Components extracted:** [count]
**Coverage:** [score]/100

## Files Created
[list]

## Key Design Traits
[5-7 defining characteristics]

## Production Showcase
[which views are interactive, total lines]

## How to use
Open design-system/presentation/production-showcase.html in a browser.
Read design-system/SYSTEM.md before building anything new.
```
