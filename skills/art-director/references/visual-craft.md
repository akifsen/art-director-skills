# Visual craft

Read this when the structure is already right but the surface still looks
like a default document: missing material, dumped images, or components
that do not share a family. For type and color roles see
[typography-color-assets.md](typography-color-assets.md). For page rhythm
see [content-and-composition.md](content-and-composition.md). For motion
and small screens see [responsive-interaction.md](responsive-interaction.md).

Numbers below are **starting points**, not quality laws. Do not score a
page by shadow count, blur, or CSS length.

## Materials and depth

**When.** You need edges, grouping, or elevation to explain layers (a
floating issue panel, a sticky header, a photo on paper). Skip extra depth
when the page is a single reading sheet.

**How.** Pick one lighting story and keep it:

- Edge: `1px` solid or a hairline with alpha (e.g. `rgb(20 16 12 / 12%)`)
  on a warm paper is usually clearer than a heavy gray ring.
- Nested radius: child radius smaller than parent so the inner curve sits
  concentric — a starting relation is parent `16px` / child `10px` on a
  padded `8px` inset, or both square if the brand is sharp.
- Tone: a 3–8% shift in L (lightness) between canvas and panel often
  groups better than a drop shadow.
- Shadow: if you use one, two layers (ambient + short) beat a single blurry
  gray. Tint shadow toward the canvas hue. Many pages need none.

Blur, grain, gradient, clip, and mask are tools. Use them when they crop
proof or separate a stage. Do not stack all of them on the first viewport.

**Common failure.** Every card gets the same 16px radius, 1px `#ddd`, and
a purple button — a kit default, not a material decision.

**Applied fragment** (panel on warm paper, no shadow required):

```css
.page { background: #efe7dc; color: #231e1a; }
.stage {
  background: #f7f1ea;
  border: 1px solid rgb(35 30 26 / 12%);
  border-radius: 2px;
}
.stage .inset {
  border-radius: 1px; /* tighter than parent */
  background: #ebe2d6;
}
```

## Product images and original graphics

**When.** A photograph, screenshot, or object exists — or the proof can be
drawn honestly from the content (a timetable, a map of berths, a typographic
lockup).

**How.**

- If media exists: decide crop, aspect, and focus. Align a face, a UI
  cursor, or a horizon on purpose (`object-position`). Give the image a
  role in the grid (full-bleed proof, column, or captioned specimen), not
  a random rounded rectangle in a card.
- If media does not exist: do not drop a gray box. Prefer a typographic
  composition, a diagram derived from the real content, or a small original
  SVG/CSS graphic. Label conceptual graphics as diagrams, not product
  photography. Label demo data as demo data.
- Do not present a generated picture as a captured product screen.

**Common failure.** `background: #eee; min-height: 220px` as "imagery," or
a stock gradient pretending to be the installation.

**Applied fragment** (honest SVG as proof, captioned):

```html
<figure class="proof">
  <svg viewBox="0 0 320 120" role="img" aria-labelledby="vault-title vault-desc">
    <title id="vault-title">Sodium Vault plan</title>
    <desc id="vault-desc">Diagram of a warehouse bay, not a photograph.</desc>
    <rect fill="#d8c16a" width="320" height="120"/>
    <rect fill="#1f1a12" x="36" y="28" width="248" height="64"/>
  </svg>
  <figcaption>Plan of Unit B — diagram, not a photo of the installation.</figcaption>
</figure>
```

Licenses: prefer files already in the project. New external files: CC0
(or another keepable license), recorded next to the file. Do not ship
third-party screenshots or fonts whose license you have not checked. If
the host has no image-generation tool, do not pretend you generated one.

## Component family

**When.** More than one control is on screen (nav, button, tabs, fields,
panels, footer).

**How.** Design them as relatives: shared radius language, shared hairline,
shared focus, shared spacing to icons. A component library or utility kit
is raw material. Specialize inside the project's system (tokens, classes,
styled-components already there). Do not dump a second kit.

Finish the states you ship:

- Hover/active/selected on the same control family
- Loading: keep the label, show busy, avoid layout jump
- Focus: visible, not clipped by `overflow: hidden`
- Hit area: visual mark may be small; the target should still be easy to
  use (a useful floor is ~24px pointer, ~44px on coarse pointers — starting
  values, not a contest)
- Icon + text: align to the text x-height, not optically drifting above it

**Common failure.** Hero button is a bright pill; footer links are raw
blue underlines; the nav hover is a browser default. Three products.

**Applied fragment** (one family, text button + filled action):

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  min-height: 2.75rem;
  padding: 0 0.95rem;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 14%);
  font: inherit;
}
.btn:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
.btn--solid { background: #f4f1ea; color: #111; border-color: transparent; }
```

Footer, tabs, and inputs should reuse the same radius and hairline story,
not invent a new one.

## Cross-project sameness

Within one project, consistency is required. Across eval fixtures or
unrelated user projects, if removing the name and accent leaves the same
section order, type ratio, image usage, and component shapes, treat that
as a signal to look again. Structural similarity is not automatically
failure: two dispatch boards may both need a table.

Do not install new formulas ("always asymmetric," "always one giant word,"
"never cards," "always gradient," "always 01/02/03").
