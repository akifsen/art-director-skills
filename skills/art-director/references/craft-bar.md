# Craft bar

The level a finished screen is checked against. Values are starting points
and checks, not quotas. A deliberate departure with a stated reason passes;
an accidental one does not. DESIGN builds to this bar, REFINE matches the
regime already in the product, REVIEW reads against it.

For the full color-regime table and type pairing guidance, see
[typography-color-assets.md](typography-color-assets.md).

## Type

- Heading and body differ in tone (weight, width, or family), not only size.
- Editorial, technical, or luxury work: consider a display, serif, or
  grotesk pairing before a generic sans. A system face is fine when the
  reason is platform, density, or brand.
- Large headings usually want slight negative tracking (about `-0.02em` to
  `-0.04em`); body wants line height about 1.5–1.65 and a readable measure.
- Metrics, tables, code, and money use `tabular-nums`.
- Confirm the face actually loaded; CSS intent is not proof.

## Surface and light

- Name the color regime and a one-line reason before any hex (cool
  technical, editorial/craft, clinical/corporate, kinetic/bold, or the
  brand's own).
- Warm paper tones belong to subjects that own them (print, craft, place,
  food, heritage). Fintech, developer, operations, and clinical products
  start cool or neutral unless the brand says otherwise.
- Do not carry over the previous project's neutrals or a framework's stock
  palette as the answer.
- Avoid raw `#FFFFFF` / `#000000` with hard shadows unless the brand or
  medium asks for it.
- Adjacent surfaces differ by a visible tone step (roughly 1.08–1.15
  luminance ratio), so layering does not rest on shadow alone. Prefer
  hairline borders and soft ambient shadows; radius, border, and shadow
  come from one family.
- Keep the accent scarce (a rough 80/15/5 of ground, structure, accent is
  a useful check). Status color always carries a word or mark too.

## Space and focus

- Pick a focal anchor from the content's value; give secondary material
  unequal sizes around it. Equal cells only for true peers.
- Negative space is composition, not an omission — but on a workspace it
  must not push the main task below the fold.

## States

- Rest, hover, active/pressed, selected, focus, disabled, error, and
  loading or skeleton are
  designed as combinations; one state never breaks another's contrast,
  alignment, or size.
- Focus is visible against the surface it sits on.
- Hover/focus transitions about 150–200ms, respecting reduced motion.
- Hover-only presentation sits behind `@media (hover: hover)`; `:active`
  carries the pressed feedback touch users see.

## Mobile (native and web)

- Reorder, crop, and disclose; not a shrunk desktop.
- Frequent primary actions within thumb reach; rare or destructive ones
  may sit at the top.
- Touch targets ≥ 44×44pt / 44 CSS px, **measured** on rendered boxes at a
  phone width, with no horizontal overflow — not asserted in a comment.
- Pressed feedback follows the platform's convention (opacity, tint, or a
  slight scale), not a mandatory scale on every tap.
- Sheets, segmented controls, and scrolling chips suit short tasks; long
  forms and deep records get a full route. See
  [native-mobile.md](native-mobile.md).

## Web and desktop

- Do not waste a wide screen on a phone-width column when the task needs
  comparison or a working pane.
- Sidebar, command palette, and keyboard paths answer destination count and
  expert use; they are not defaults. Anything visible must work.
- Hover and focus use a border or surface shift, not color alone.
