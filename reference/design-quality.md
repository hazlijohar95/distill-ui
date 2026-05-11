# Design Quality Standards

Apply these principles when building the production showcase and index.html. The extraction documents what exists; the presentations must demonstrate it with craft.

## The AI Slop Test

If someone looks at your showcase and immediately thinks "AI made this," it has failed. Common tells to avoid:

- Purple-to-blue gradients as default accent
- Cards nested inside cards
- Identical-card grids (same size, icon + heading + text, repeated)
- Gray text on colored backgrounds without contrast check
- Inter font with no typographic personality
- Side-stripe borders (border-left as accent on cards)
- Gradient text (background-clip: text with gradients)
- The hero-metric template (big number, small label, gradient accent)
- Bounce/elastic easing
- Glassmorphism used decoratively

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
6. Does the typography hierarchy match the source?
7. Are the shadows, borders, and radius values exact?
8. Does the dark mode (if extracted) work correctly?

## Register: Brand vs Product

Determine the register from the source codebase:

**Brand** (marketing, landing, editorial): Design IS the product. Push visual identity, typography, and composition. The showcase should feel editorial and crafted.

**Product** (app UI, dashboard, tool): Design SERVES the product. Prioritize clarity, density, and function. The showcase should feel like a working tool.

Match the register. A billing dashboard showcase shouldn't feel like a marketing site. A brand site showcase shouldn't feel like an admin panel.
