# Visual craft

Read this when structure is right but the surface still looks like a
default document: missing material, dumped images, or components that do
not share a family. Type and color roles:
[typography-color-assets.md](typography-color-assets.md). Page rhythm:
[content-and-composition.md](content-and-composition.md). Motion and small
screens: [responsive-interaction.md](responsive-interaction.md).

Numbers are **starting points**, not quality laws. Do not score a page by
shadow count, blur, or CSS length.

## Materials and depth

Use depth only when layers need explaining (a floating panel, a sticky
header, a photo on paper); a single reading sheet needs none. Pick one
lighting story and keep it:

- **Edge:** `1px` hairline with alpha in the regime's ink (e.g.
  `rgb(20 16 12 / 12%)` on warm paper) beats a heavy gray ring.
- **Nested radius:** child smaller than parent so curves sit concentric
  (parent `16px` / child `10px` on an `8px` inset), or both square.
- **Tone:** a 3–8% lightness step between canvas and panel often groups
  better than a shadow.
- **Shadow:** if used, ambient + short beats one blurry gray; tint toward
  the canvas hue.

Blur, grain, gradient, clip, and mask are tools for cropping proof or
separating a stage, not a stack for the first viewport. A ceramic shed's
warm clay and 2px mend line ([kiln-rest.material.html](studies/kiln-rest.material.html))
is that product's voice, not "finished."

**Common failure.** Every card gets 16px radius, `1px #ddd`, and a purple
button — a kit default, not a material decision.

## Product images and original graphics

- **Media exists:** decide crop, aspect, and focus (`object-position` on a
  face, cursor, or horizon). Give the image a grid role — full-bleed proof,
  column, or captioned specimen — not a rounded rectangle in a card.
- **No media:** no gray box, and no bare ruled list as the finish. Make it
  complete without pictures: typographic composition, a diagram derived
  from the real content, or a small original SVG/CSS graphic. Label
  diagrams as diagrams and demo data as demo data. Never present a
  generated picture as a captured product screen.

```html
<figure class="proof">
  <svg viewBox="0 0 320 120" role="img" aria-labelledby="t d">
    <title id="t">Unit B plan</title>
    <desc id="d">Diagram of a warehouse bay, not a photograph.</desc>
    <rect fill="#d8c16a" width="320" height="120"/>
    <rect fill="#1f1a12" x="36" y="28" width="248" height="64"/>
  </svg>
  <figcaption>Plan of Unit B — diagram, not a photo.</figcaption>
</figure>
```

Licenses: prefer files already in the project; new external files CC0 (or
keepable), recorded next to the file. No unchecked third-party screenshots
or fonts.

**Common failure.** `background: #eee; min-height: 220px` as "imagery," or
a stock gradient pretending to be the installation.

## Component family

Nav, buttons, tabs, fields, panels, and footer are relatives: shared radius
language, hairline, focus, and icon spacing. A UI kit is raw material;
specialize inside the project's system, never add a second kit. Finish the
states you ship: hover/active/selected on the same family; loading keeps
the label and avoids layout jump; focus is visible and not clipped by
`overflow: hidden`; hit areas stay usable even when the mark is small
(~24px pointer, ~44px coarse pointer); icons align to the text x-height.

### Design the valid state combinations, not the base look

Selected, hover, focus, disabled, and validation must not break each
other's text, surface, and indicator pairs. Check pairs that can co-occur:
selected + hover, selected + focus, invalid + focus, disabled + hover.

- **Specificity trap.** `.chip:hover { background: light }` outranks
  `.chip--on` because the pseudo-class adds specificity, so the selected
  light label lands on a light hover surface. Restate the selected surface
  for hover, or write the selected rule at equal or higher specificity
  after hover.
- **Ring trap.** An `outline-offset` ring sits outside the control, so it
  must contrast with the surrounding surface, not the control's type.
  `currentColor` on a light-on-dark button paints a light ring on a light
  page. Use a focus token chosen against the surrounding surface; on mixed
  surfaces use a two-tone ring.
- **Link-reset trap.** A `color: inherit` rule on `a` that is
  more specific than the action class paints a filled action's label in
  the fill's ink.
  Keep that reset at element specificity, or let the action class win.

Measure text against the composited surface it sits on and the ring
against the surface it is drawn over. `toBeVisible` does not prove a label
is readable; an outline that exists does not prove it can be seen. Native
controls have the same pairs via pressed, selected, disabled, and
`accessibilityState` ([native-mobile.md](native-mobile.md)).

```css
:root { --focus: #121417; } /* chosen against the page surfaces, not the label */
.btn {
  display: inline-flex; align-items: center; gap: 0.4em;
  min-height: 2.75rem; padding: 0 0.95rem;
  border: 1px solid rgb(18 20 23 / 14%); border-radius: 0; font: inherit;
}
.btn:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }
.btn--solid { background: #121417; color: #f6f7f9; border-color: transparent; }
```

The radius (here `0`, elsewhere `0.45rem` or `2px`) is the product's; the
quality is that relatives match. Shared shape is not equal emphasis: set
commit vs Cancel vs back apart by label, placement, and surface weight,
not hue alone, and check the same roles on detail and success screens.

**Common failure.** A bright pill hero button, raw blue footer links, and a
browser-default nav hover — three products on one page.

## Working-surface craft (list, detail, form)

Decisions to make on purpose, not numbers to copy:

- **Four type levels** — product name, screen title, record name, meta —
  each with a deliberate size/weight relation. Two levels at one size read
  as one.
- **Surfaces** — canvas, working surface, selected region, controls are
  distinguishable without four unrelated colors (a lightness step plus one
  hairline). Two flat tones everywhere removes the map.
- **Row priority** — decide the order the task ranks (e.g. name, owner,
  status, date). Helper text is smaller, not faint.
- **Control family** — chips, buttons, badges, fields, and the dialog share
  height, padding, border, radius, and icon alignment. A chip 2px shorter
  than its neighbor button is a second family.
- **Equal finish** — a polished list beside a browser-default form is not
  done.
- **Narrow is its own design** — one compact identity line; do not restate
  metadata above the first field.

## Cross-project sameness

At the representative render, compare task material with the space spent
framing it. A bigger tile that adds a padded stage around a miniature makes
the object smaller; choose compact objects for comparison or larger ones
for readable detail. State what the user can compare or act on before
scrolling, at viewport height, not a card count.

On a detail/form or operational screen, repeat the selected object's
identity briefly and lead with the task; a catalogue intro reused as form
chrome, a second slogan, or a warning band louder than the task fights the
work. Do not crush a form into the first viewport by shrinking type or
hiding errors — keep the primary action, invalid fields, and recovery
together.

Within a project, consistency is required. Across unrelated projects, if
removing the name and accent leaves the same section order, type ratio,
imagery, and component shapes, look again — though two dispatch boards may
both honestly need a table. Do not install new formulas ("always
asymmetric," "never cards," "always one giant word," "always 01/02/03").
