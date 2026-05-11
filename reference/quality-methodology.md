# Quality Methodology

Techniques for producing higher-quality extraction output. Applied during token extraction, component documentation, Design DNA, and SYSTEM.md generation.

## The Reflex Test

Before finalizing your extraction, run this test on the output:

**First-order reflex:** Can someone guess the design system from the product category alone? ("fintech → navy + gold", "healthcare → white + teal", "dev tool → dark mode + purple accent")

**Second-order reflex:** Can someone guess the aesthetic from category + one anti-reference? ("billing tool that's not stripe-cream → ???")

If your extraction reads as generic-for-category, you haven't captured what makes THIS product distinct. Go deeper on the Design DNA.

## Anti-Pattern Detection During Extraction

While extracting, actively flag patterns in the source that are generic/low-quality so the output system can document what NOT to reproduce:

| Pattern | What to Flag |
|---------|-------------|
| Side-stripe borders | Thick colored border-left on cards (the AI-dashboard tell) |
| Overused fonts | Inter, Roboto, Plus Jakarta Sans without brand justification |
| Flat type hierarchy | Font sizes within 1.25 ratio of each other |
| Gradient text | `background-clip: text` with gradients |
| Nested cards | Cards containing cards |
| Monotonous spacing | Same value > 60% of all spacing declarations |
| Bounce/elastic easing | Spring physics, overshoot curves |
| Pure black/white | #000 or #fff without perceptual justification |
| Icon-tile stacks | 32-128px rounded-square icon above heading, repeated |

If the source contains these patterns, document them in the anti-pattern section of Design DNA — but note whether they're INTENTIONAL (part of the brand) or ACCIDENTAL (technical debt).

## State Completeness Audit

For every extracted component, verify coverage of these 8 states:

1. **Default** — resting appearance
2. **Hover** — cursor over (desktop)
3. **Focus** — keyboard/tab navigation
4. **Active/Pressed** — during click/tap
5. **Disabled** — non-interactive
6. **Loading** — async operation in progress
7. **Error** — validation or failure state
8. **Success** — completion confirmation

Flag missing states in the component audit. Include a completeness score (e.g., "6/8 states defined"). This tells consuming agents what they need to invent vs what's already specified.

## Token Extraction as Relationships

Don't just extract values — extract the SYSTEM behind the values:

### Typography: Modular Scale
Instead of just listing sizes, identify the ratio:
```
14 → 16 → 20 → 24 → 32 → 40 → 48
Ratio: ~1.25 (Major Third scale)
```

Include in token-decisions.md: what the ratio IS, how many steps exist, and which steps map to which hierarchy levels (body, subheading, heading, display).

### Typography: Dark Mode Compensation
If the source has dark mode, check for these adjustments:
- Line-height bumped +0.05–0.1
- Letter-spacing added +0.01–0.02em  
- Weight stepped up one notch
Document whether the source applies these or not.

### Color: Perceptual Modeling
When extracting colors, note:
- **Tinted neutrals** — are grays pure or tinted toward the brand hue?
- **Chroma reduction at extremes** — do near-black/near-white colors reduce saturation?
- **Accent scarcity** — what percentage of surface area uses the accent color?

If possible, express colors in OKLCH alongside hex:
```
--primary: #8838ff;  /* oklch(52% 0.24 295) */
```

### Spacing: Rhythm Vocabulary
Categorize spacing values by their semantic role:
- **Tight** (4-8px): related elements within a group
- **Default** (12-16px): standard element separation
- **Loose** (24-32px): between distinct groups
- **Section** (48-80px): between page sections
- **Dramatic** (80-120px): editorial breathing room

Note which the source uses. A product UI uses tight/default/loose. A brand site uses loose/section/dramatic.

## Named Rules Over Raw Values

In SYSTEM.md and Design DNA, express rules as named principles with enforcement criteria:

**Bad:** "Primary color is #8838ff, used for buttons and links."

**Good:** "**The One Voice Rule** — Editorial Magenta (#8838ff) is the single accent. It occupies less than 10% of any screen. If something needs emphasis and can't use magenta, use size or weight — never a second color."

Named rules are:
- Memorable (agents recall them)
- Testable (you can check compliance)
- Transferable (apply to new screens without ambiguity)

Format: **Name** — one-sentence rule. Enforcement: how to check. Source: where this was observed.

## Cognitive Load Constraints

When documenting components and layouts, note cognitive load factors:

- **Decision points:** How many visible options at each step? (Max 4 without progressive disclosure)
- **Information density:** How much content per viewport? (Note if the source is dense-product or sparse-editorial)
- **Navigation depth:** How many clicks to reach any view? (Note the maximum depth)

Include these as system rules in SYSTEM.md when the source enforces them.

## The Register Determines the Quality Bar

The register (brand vs product) determines what "good" means:

### Brand Register
- **Bar:** Distinctiveness. If output is generic-for-category, it fails.
- Extract: color strategy (restrained/committed/full/drenched), typographic voice, composition asymmetry
- The showcase must feel EDITORIAL — like a design publication

### Product Register  
- **Bar:** Earned familiarity. If a Linear/Figma/Notion user wouldn't trust it, it fails.
- Extract: state vocabulary, density parameters, predictable patterns
- The showcase must feel like a WORKING TOOL — functional and trustworthy

Document the register in 00-project-orientation.md and let it inform every subsequent phase.

## Self-Audit Checklist (Before Delivery)

Run this against your extracted output:

| Check | Pass? |
|-------|-------|
| Can someone identify the product from the token system alone? | |
| Does every component document at least 5/8 states? | |
| Are typography sizes expressed as a ratio system? | |
| Are spacing values categorized by semantic role? | |
| Does SYSTEM.md have 5+ named rules (not just value lists)? | |
| Are anti-patterns documented with intent classification? | |
| Does the showcase pass the AI slop test? | |
| Is the register (brand/product) explicit and consistent? | |
| Can an agent build a new screen using only the extracted system? | |
