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

**Applied fragment** (Rail Still catalog lighting). Copy the *one lighting
story* rule, not the hexes or the square corners:

```css
.page { background: #e7eaee; color: #121417; }
.still img { border-radius: 0; object-fit: cover; }
.mail {
  min-height: 2.75rem;
  padding: 0 1rem;
  background: #121417;
  color: #f6f7f9;
  border-radius: 0;
}
```

A ceramic shed may still use warm clay and a 2px mend line — that is
[kiln-rest.material.html](studies/kiln-rest.material.html), not "finished."

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

**Applied fragment** (Rail Still's sharp family — text button + filled
action). A clinic may share a `0.45rem` radius; a ceramic shed may use
`2px`. Quality is that relatives match, not the number:

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  min-height: 2.75rem;
  padding: 0 0.95rem;
  border-radius: 0;
  border: 1px solid rgb(18 20 23 / 14%);
  font: inherit;
}
.btn:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
.btn--solid { background: #121417; color: #f6f7f9; border-color: transparent; }
```

A filled action must keep type and focus visible on its fill. A `color:
inherit` rule on `a` that is more specific than the action class paints
the label in the same ink as the fill. Keep that reset at element
specificity, or let the action class win. `toBeVisible` does not prove
the label can be read.

Footer, tabs, and inputs should reuse the same radius and hairline story,
not invent a new one.

Shared shape does not mean equal emphasis. In an editor, distinguish the
commit action from Cancel and back navigation through label, placement and
surface weight, not hue alone. A quiet action still needs a readable label,
pressed/focus feedback and a full touch target. Check the same roles on the
detail and success surfaces; making every control prominent erases priority.

## Cross-project sameness

At the representative render, compare visible task material with the space
spent framing it. For a browsing collection, a larger tile can paradoxically
make the actual object smaller if it adds a padded stage around a miniature.
Choose between compact objects with immediate comparison and larger objects
with more readable detail; avoid paying for a larger tile without gaining
either. Inspect at viewport height as well as full page. State what the user
can compare or act on before scrolling, not a target card count.

For transactional forms, repeat the selected object's identity briefly and
lead with the task. A second slogan or oversized cover may delay input
without helping recognition. Compare a summary beside the form with a compact
summary above it; choose from width, title length and amount of explanation.
Keep demo or session labels honest and visible; do not let a warning band
become the strongest surface on an operational screen.

An intro that earns its scale on a catalogue should not be reused as the
detail/form chrome. On the working surface, one compact record line plus
the action is usually enough; long description, metadata and a second
display title stacked above the first field fight the task. Do not crush
every form into the first viewport by shrinking type or hiding required
errors — keep the primary action, invalid fields and recovery related.

Within one project, consistency is required. Across eval fixtures or
unrelated user projects, if removing the name and accent leaves the same
section order, type ratio, image usage, and component shapes, treat that
as a signal to look again. Structural similarity is not automatically
failure: two dispatch boards may both need a table.

Do not install new formulas ("always asymmetric," "always one giant word,"
"never cards," "always gradient," "always 01/02/03").
