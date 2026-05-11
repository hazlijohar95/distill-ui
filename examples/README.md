# Example Extractions

Real extractions performed with distill-ui across different platforms and frameworks.

## Warp (Rust GPU Terminal)

**Source:** [github.com/warpdotdev/warp](https://github.com/warpdotdev/warp)
**Platform:** Native desktop (Rust, custom GPU renderer)

Key findings:
- Algorithmic theming: 3 base colors → full palette via opacity blending
- No CSS, no HTML — colors are `ColorU` structs, layouts are Rust trait impls
- Theme system uses TOML + Rust enums, not runtime CSS
- Translated to web: warm stone palette, 6px radius, JetBrains Mono

## better-auth (Next.js Docs Site)

**Source:** [github.com/better-auth/better-auth](https://github.com/better-auth/better-auth)
**Platform:** Web (Next.js + Tailwind + shadcn/ui)

Key findings:
- Pure monochrome brand — opacity IS the color system
- Dark mode: #000 pure black background
- Inter + Geist Mono typography
- Documentation-focused layout with sidebar nav

## better-hub (React SaaS)

**Source:** [github.com/better-auth/better-hub](https://github.com/better-auth/better-hub)
**Platform:** Web (React + Tailwind + shadcn/ui)

Key findings:
- 216 components, GitHub-like density
- #030304 background, #27272a zinc borders
- 40px navbar, Geist font family
- Complex table system with inline actions

## opencode (Multi-Surface AI Coding Tool)

**Source:** [github.com/anomalyco/opencode](https://github.com/anomalyco/opencode)
**Platform:** Terminal (Ink/React) + Desktop (Electron) + Web

Key findings:
- Same design tokens across 3 surfaces (TUI, desktop, web)
- Catppuccin-derived palette with semantic mapping
- Terminal uses box-drawing chars + ANSI colors
- Desktop/web share React component library

## Autumn (Billing SaaS)

**Source:** [github.com/useautumn/autumn](https://github.com/useautumn/autumn)
**Platform:** Web (React + Vite + Tailwind + CVA)

Key findings:
- 348 views, 214 components
- Single accent: #8838ff purple (actions only)
- Warm stone backgrounds (#fafaf9, never cold grays)
- 3-layer atomic form CSS (base + shadow + state)
- Physical button depth via inset shadows
- Spring animations (stiffness 500, damping 40)
- Inter + JetBrains Mono, 13px body / 17px headings
