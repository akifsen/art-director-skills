# Typography, color, and assets

Read this when type, color, imagery, or licenses matter. Skip it for
structure-only or copy-only edits. For materials, crops, and component
finish see [visual-craft.md](visual-craft.md).

## Brand fonts vs leftovers

**When.** You decide whether to keep type already in the files.

**How.** Reuse faces that belong to a real system: tokens, a documented
pair, a logo lockup, or a webfont the product already ships on purpose.
Add a face only when a role is missing.

Do not treat the following as sacred brand:

- An unconsidered framework type hierarchy (not a font name by itself)
- A single Google font dropped by a template
- A heading face that never loaded (verify rendered faces, not only CSS intent)

On DESIGN / explicit redesign, choose roles first, then faces that can
render the project's languages. Prefer the project's existing loading
method. Do not introduce a new CDN because an example used one.

These CSS recipes are for web. Native work uses its platform type metrics,
font scaling and controls; keeping the system face can be the intended design.
For custom web fonts, computed family names alone do not establish loading.
Check font requests/loading and rendered-face information when available.

**Failure.** "The file already said `font-family: system-ui`, so I kept it"
on a blank marketing fixture.

## Type roles and craft

Assign roles before picking families:

- **Display:** rare, for the lead. Not for every heading.
- **Heading:** section structure. A clear step down in size and weight.
- **Body:** reading text. A comfortable measure is often near `60–70`
  characters for articles; shorter for UI chrome. Starting points only.
- **Meta:** dates, labels, captions, table headers. Smaller, not weaker
  in contrast.

Then actually art-direct the role:

- **Character:** what the face is *doing* (grotesque claim, old-style
  reading, mono for ids). Name the role, not only the file name.
- **Weight / width:** one display weight is enough on most pages; condensed
  display is a choice for a poster, not a default.
- **Fluid size:** `clamp()` (e.g. `clamp(2.4rem, 6vw, 5.5rem)` as a
  *starting* display range) so the lead scales without jumping. Recheck
  line breaks at a small width.
- **Line breaks:** break the display phrase for sense (`<br>` or a narrow
  max-width in `ch`), not wherever the container wraps.
- **Tracking:** display often wants slightly tighter tracking; meta labels
  slightly more open. Body usually stays near `0`.
- **Leading:** display can go tight (`~0.9–1.05`); body needs air
  (`~1.45–1.65` as a starting range).
- **Optical alignment:** hanging punctuation, optical left edge of a large
  round letter, icon aligned to x-height.
- **Language:** if the UI includes Turkish (`ğüşıöçĞÜŞİÖÇ`) or other marks,
  verify the face contains them. A fallback that changes x-height mid-word
  is a defect.

Serif, sans, mono, and display faces are all valid. Do not bind every
project to condensed grotesques or to the same serif pairing.

If you load a display face, use it in the composition (the lead), not as
a hidden `font-family` on `body`.

**Failure.** One size for `h1`–`h3`; `letter-spacing: 0.2em` on everything;
Impact on a long article.

## Choice versus quality

Voice is a choice. Readability and hierarchy are quality.

| Choice | Quality that still has to hold |
|---|---|
| Serif or sans, or a mix | Loaded faces, a clear scale, language coverage |
| Light or dark, warm or cool | Named roles, contrast on the actual pairing |
| Round, mixed, or sharp corners | One family; related controls; visible focus |
| Large media or type-led | The object serves the job and sits in the composition on purpose |

Do not treat "16px cards became sharp photographs" as universal progress.
That swap belongs to a catalog whose proof is the still. A photographer's
delivery tracker is a product workspace: the job, the filter, the selected
record, and the save path — not a portfolio landing.

If the skeleton used gray boxes and the finished file uses real stills,
score two improvements separately: better material, and better composition
of that material. Do not credit CSS craft for a photograph the skeleton
did not have.

Do not treat Palatino, tracked small-caps metadata, or cream paper as the
house finish. Those are valid when the *object* is editorial or ceramic and
the user asked for that voice. See [kiln-rest.material.html](studies/kiln-rest.material.html).
Do not replace that voice with a second house look (cool gray, system sans,
sharp corners) either. Unrelated products should not inherit pairings from
examples.

**Applied fragment (Rail Still catalog display — this product's voice):**

```css
.display {
  font-family: "Segoe UI Variable Display", "Segoe UI", "Avenir Next", sans-serif;
  font-weight: 650;
  font-size: clamp(2.8rem, 8vw, 5.6rem);
  line-height: 0.92;
  letter-spacing: -0.048em;
  max-width: 7ch;
}
.body { font-size: 1.05rem; line-height: 1.5; max-width: 36ch; }
.meta { font-size: 0.92rem; letter-spacing: 0; text-transform: none; color: var(--muted); }
.nav { font-size: 0.95rem; font-weight: 500; letter-spacing: 0; text-transform: none; }
```

**Applied fragment (Nadir-style product chrome — roles for a workspace; pick faces for the product in front of you):**

```css
.title {
  font-family: "Segoe UI", "Avenir Next", sans-serif;
  font-size: 1.5rem;
  font-weight: 650;
  letter-spacing: -0.03em;
}
.kicker { font-size: 0.8125rem; font-weight: 600; letter-spacing: 0; text-transform: none; }
.control { font-size: 0.9375rem; min-height: 2.35rem; }
```

## Color and surfaces

**When.** You are choosing more than a single accent on white.

**How.** Name colors by job, then relate them:

- **Canvas** — page background
- **Raised / secondary surface** — panels, header bar, table header
- **Brand field** — a large area the brand actually owns (a clay field, a
  material field that belongs to the work, a night ops canvas). Allowed when
  it fits. Not required.
- **Text hierarchy** — primary, secondary, inverse on brand fields
- **Separator** — hairline or tone step
- **Interactive** — links, filled actions, selected rows
- **Semantic status** — danger, warning, success, each with a non-color cue

Do not stop at one accent. Do not equate dark canvases, neon, or glass
with quality. Do not forbid a color. The worked examples' pairings (cool
catalog stone, clinic navy, kiln oxide paper, night closeout) belong to
those products; see Choice versus quality above.

Justify saturation and light/dark from context: a warehouse installation
may want a field of the actual material; a long article may want a stable
paper; an overnight dispatch board may want a dim canvas with loud overdue
rows.
Check contrast on the actual pairing (text on brand field, meta on canvas).

If a brand already defines a palette, map these roles onto it. If the
"palette" is leftover `#222` on white plus a purple button, replace it
on DESIGN.

Accent-only status (red vs green with no text or icon) fails for many
readers. Keep status in words.

**Failure.** `--accent: #7c5cfc` and nothing else; large paragraphs in
accent color; a new purple careers page on a paper-and-iron site.

**Applied fragment (Rail Still catalog surfaces — this product):**

```css
:root {
  --canvas: #e7eaee;
  --raised: #f6f7f9;
  --text: #121417;
  --text-dim: #5b636c;
  --hair: #c9ced6;
  --action: #121417;
  --action-ink: #f6f7f9;
  --accent: #b85a32; /* one tick, not a cream field */
}
```

**Applied fragment (Nadir clinic surfaces — this product's jobs, not a paste palette):**

```css
:root {
  --canvas: #e8eaee;
  --surface: #ffffff;
  --text: #16181c;
  --text-dim: #5c6570;
  --hair: #d0d5dc;
  --action: #1f4e79;
  --action-ink: #f4f7fb;
  --danger: #9b2c2c;
}
```

## Imagery and licenses

Choose media the product can actually supply. See
[visual-craft.md](visual-craft.md) for crop, diagrams, and captions.

Prefer assets already in the project with a known right to use. When adding
a new external file, prefer CC0 or another license the project can keep, and
record the license next to the file. Do not copy a competitor's layout,
brand, or images.

Do not invent screenshots, customer faces, logos, or metrics. If the host
has no image-generation tool, do not pretend assets were produced.

## Decision examples

### One form, two coherent surface treatments

A long application form can use a continuous canvas with section headings
and rules when reading order matters. Separately editable account settings
can use grouped secondary surfaces, each with its own edit action. Both need
the same legible labels, hint/error distinction and clear submission result.
Choose grouping from the save boundaries; do not merely recolor the button.

For either, compare a compact label/body scale with a more generous reading
scale using the actual longest label and error. Prefer compact when users
scan repeated known fields; give unfamiliar instructions more measure and
leading. Font selection alone does not settle that tradeoff.

### Content-led publication

Field Notes Weekly runs 1,200-word reported pieces. Display type on every
heading and a neon dark theme would fight the reading task. Better: a
reliable body face with full Turkish glyph coverage, restrained headings,
and a surface that keeps a stable measure. Color marks section, not mood.

### Existing brand, new section

Marrow & Co already uses a warm off-white, iron text, and a single red for
actions. A new Careers section should reuse those roles. Introducing a
separate "modern" purple and a geometric display face would look like a
second product. Hierarchy can still change: job posts as a list with
location and type, not a marketing grid of perks.

### Blank fixture, DESIGN

Ada's start files use Arial and a navy hero. That is a leftover, not a
brand. You may choose a reading serif for the memoir and a mono for tool
ids, as long as `Kılıç` stays correctly spelled and glyphs exist.
