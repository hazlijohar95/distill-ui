# Design Quality Standards

Apply these principles when building the production showcase and index.html. The extraction documents what exists; the presentations must demonstrate it with craft.

## The AI Slop Test

If someone looks at your showcase and immediately thinks "AI made this," it has failed. This is a deterministic check — if any of these patterns appear without explicit source-code justification, remove them:

| Pattern | Tell |
|---------|------|
| Side-stripe borders | Thick colored border-left on cards |
| Overused fonts | Inter, Roboto, Plus Jakarta Sans as default choice |
| Flat type hierarchy | Font sizes within 1.25 ratio of each other |
| Gradient text | `background-clip: text` with gradients |
| Purple-blue gradients | Default accent without source justification |
| Nested cards | Cards inside cards |
| Identical-card grids | Same size, icon + heading + text, repeated 3+ times |
| Hero-metric template | Big number, small label, gradient accent |
| Bounce/elastic easing | Spring physics, overshoot curves |
| Glassmorphism | Blurred translucent cards used decoratively |
| Icon-tile stacks | Rounded-square icon containers above headings |
| Everything centered | All text center-aligned without hierarchy reason |
| Dark glow | Colored box-shadow on dark backgrounds |

**The Two-Altitude Reflex Test:**
1. Can someone guess the design from the product category? (fintech → navy, health → teal)
2. Can someone guess it from category + one anti-reference?

Both must fail. If your showcase reads as "generic [category] dashboard," it hasn't captured what makes this product distinct.

## Color

- Tint every neutral toward the brand hue (even 0.005 chroma is enough)
- Reduce chroma as lightness approaches extremes
- Match the extracted palette exactly — do not "improve" or normalize colors
- If the source uses warm stones, use warm stones. If it uses cold zinks, use cold zinks.

## Typography

- Cap body line length at 65-75ch
- Hierarchy through scale + weight contrast (minimum 1.25 ratio between steps)
- Use the extracted fonts — do not substitute
- Light text on dark backgrounds needs: bumped line-height (+0.05-0.1), slight letter-spacing, potentially one weight step up

## Spacing

- Vary spacing for rhythm. Same padding everywhere is monotony.
- Use the extracted spacing scale, not arbitrary values
- Group related elements with tight spacing, separate sections with generous spacing

## Motion

- Exit animations are faster than entrances (75% duration)
- Use exponential ease-out curves (quart/quint/expo) for micro-interactions
- No bounce, no elastic — they feel dated
- Duration guide: 100-150ms for instant feedback, 200-300ms for state changes, 300-500ms for layout changes

## Layout

- Cards are not required for grouping. Spacing and alignment work better in most cases.
- Never nest cards inside cards.
- Don't wrap everything in a container. Let content breathe.
- The showcase fills the viewport like an application, never scrolls like a document (unless the source product is a content site).

## Production Bar

The showcase is not a first draft. Before considering it done:

1. Does it use the exact extracted tokens (not approximations)?
2. Does every interactive element respond to hover, active, and focus?
3. Are transitions smooth (CSS transition on interactive properties)?
4. Is the content realistic and domain-appropriate?
5. Would the product's designer recognize this as their product?
6. Does the typography hierarchy match the source (correct ratio between steps)?
7. Are the shadows, borders, and radius values exact?
8. Does the dark mode (if extracted) work correctly?
9. Are neutrals tinted toward the brand hue (not pure gray)?
10. Is accent color used sparingly (< 10% of surface unless source commits more)?

## Register: Brand vs Product

Determine the register from the source codebase. This determines what "quality" means:

**Brand** (marketing, landing, editorial):
- Design IS the product
- Bar: **Distinctiveness.** If output is generic-for-category, it fails.
- Push visual identity, typography voice, composition asymmetry
- The showcase should feel editorial and crafted
- Allow dramatic spacing (80-120px sections), display typography, ambitious motion

**Product** (app UI, dashboard, tool):
- Design SERVES the product
- Bar: **Earned familiarity.** A Linear/Figma/Notion user should trust it instantly.
- Prioritize clarity, density, state richness, predictable patterns
- The showcase should feel like a working tool
- Enforce tight spacing, system fonts acceptable, minimal decorative motion

Match the register. A billing dashboard showcase shouldn't feel like a marketing site. A brand site showcase shouldn't feel like an admin panel.

## Cognitive Load Check

Before delivery, verify:
- Max 4 visible options at any decision point without progressive disclosure
- Navigation depth ≤ 3 clicks to any view
- Information density matches the source product's register
- Primary actions are visually dominant (not lost in equal-weight grids)
