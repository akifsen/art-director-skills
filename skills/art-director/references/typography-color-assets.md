# Typography, color, and assets

Read this when type, color, imagery, or licenses matter. Skip it for
structure-only or copy-only edits. Materials, crops, and component finish
are in [visual-craft.md](visual-craft.md); the short checklist is in
[craft-bar.md](craft-bar.md).

## Brand fonts vs leftovers

Reuse faces that belong to a real system: tokens, a documented pair, a logo
lockup, or a webfont the product ships on purpose. Add a face only when a
role is missing. Not sacred: an unconsidered framework type hierarchy, a
single Google font dropped by a template, a heading face that never loaded.

On DESIGN, choose roles first, then faces that render the project's
languages. Prefer the project's existing loading method; do not add a CDN
because an example used one. Native work uses platform type metrics and
scaling; keeping the system face can be the design. On the web, computed
family names do not prove loading — check font requests or rendered faces.

**Failure.** "The file already said `font-family: system-ui`, so I kept it"
on a blank marketing fixture.

## Type roles and craft

- **Display:** rare, for the lead. **Heading:** section structure, a clear
  step down. **Body:** reading text, measure near `60–70` characters for
  articles, shorter for UI. **Meta:** smaller, not weaker in contrast.
- **Character:** name what the face is doing (grotesque claim, old-style
  reading, mono for ids). One display weight is usually enough; condensed
  display is a poster choice, not a default.
- **Size and breaks:** fluid `clamp()` (e.g. `clamp(2.4rem, 6vw, 5.5rem)`
  as a starting display range); break the display phrase for sense, and
  recheck breaks at a small width.
- **Tracking and leading:** display slightly tight (`~0.9–1.05` leading),
  meta slightly open, body near `0` tracking and `~1.45–1.65` leading.
- **Optics:** hanging punctuation, optical left edge on large round
  letters, icons aligned to x-height.
- **Language:** if the UI includes Turkish (`ğüşıöçĞÜŞİÖÇ`) or other marks,
  verify glyph coverage. A fallback that changes x-height mid-word is a
  defect.
- A loaded display face is used in the composition, not hidden on `body`.

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

"Soft cards became sharp photographs" is not universal progress; it belongs
to a catalog whose proof is the still. When a skeleton had gray boxes and
the finish has real stills, credit better material and better composition
separately. Palatino, tracked small caps, and cream paper are valid for an
editorial or ceramic object that asked for that voice
([kiln-rest.material.html](studies/kiln-rest.material.html)); neither they
nor cool gray + system sans + sharp corners are a house finish.

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
.meta { font-size: 0.92rem; color: var(--muted); }
```

**Applied fragment (product chrome — roles for a workspace; pick faces for
the product in front of you):**

```css
.title { font-size: 1.5rem; font-weight: 650; letter-spacing: -0.03em; }
.kicker { font-size: 0.8125rem; font-weight: 600; }
.control { font-size: 0.9375rem; min-height: 2.35rem; }
```

## Color and surfaces

### Regime before hex

Agents anchor: after two warm-paper projects every canvas turns cream, and
every dark mode becomes a framework's slate/emerald set. Before any hex,
answer in one line each: **sector and function** (who uses it all day),
**temperament** (grounded, technical, clinical, kinetic), **owned material**
(a real material, place, or craft the brand owns — or none; do not invent
one). Then name one regime in the tokens comment:

| Regime | Fits | Canvas / surface | Ink | Accent |
|---|---|---|---|---|
| **Cool technical** | fintech, developer tools, ops, logistics, B2B SaaS | steel `#E6E9ED` → `#F3F5F7`; dark graphite `#121417` → `#1A1E23` | `#14181D` / `#E8EBEF` | one signal: `#0B62BF`, `#0F766E`, `#E4572E` |
| **Editorial / craft** | print, publishing, food, place, heritage, makers | chalk or bone `#F3F0EA` → `#FDFCFA`; dark umber `#15130F` → `#1E1B16` | `#1A1611` / `#EFE9DF` | a dye or material tone: madder, ochre, pine |
| **Clinical / corporate** | health, insurance, government, legal, HR | cool white `#EEF1F4` → `#F8FAFB`; dark slate-blue `#0F151C` → `#171F28` | `#16181C` / `#EEF2F6` | restrained navy or teal; status carries words |
| **Kinetic / bold** | sport, music, fashion drops, youth culture | ice `#F4F6F8` → `#FAFBFC` or obsidian `#0B0D10` → `#14171B` | `#0B0D10` / `#F4F6F8` | one loud signature; large fields allowed |
| **Brand-owned** | a product with a palette | map the roles onto it | as defined | as defined |

- Warm neutrals are a regime, not a default. A newspaper may sit on chalk;
  an invoice ledger or deployment console may not, unless the brand says so.
- Light and dark modes share one regime. Warm paper in light and framework
  navy in dark is two products.
- Stock framework values (`#0F172A`, `#64748B`, `#94A3B8`, `#22C55E`,
  `#EF4444`, `#D97706` and neighbours) are a tell; derive from the regime.
- Adjacent surfaces step at roughly 1.08–1.15 luminance ratio each.
  `#F9F8F5` on `#FFFFFF` (1.06) is a shadow dependency, not a step.
- Check the smallest text on the darkest surface it can land on. AA is
  4.5:1 for body and 3:1 for ≥ 24px; aim for 4.5:1 on 12–13px meta.
- Hairlines, borders, and shadows are the regime's ink at low alpha, not a
  slate `rgba(15, 23, 42, …)` under warm paper. Hover moves toward ink in
  light mode and toward paper in dark mode.
- REFINE keeps an inherited palette but names its regime and fixes failing
  pairs. Changing regime in REFINE needs the user's word.

### Roles

Name colors by job, then relate them: canvas; raised surface; an optional
brand field the brand actually owns; text primary / secondary / inverse;
separator; interactive; semantic status with a non-color cue. Do not stop
at one accent, do not equate dark, neon, or glass with quality, and do not
forbid a color. Justify saturation and light/dark from context: a long
article wants stable paper, an overnight dispatch board a dim canvas with
loud overdue rows. If the "palette" is leftover `#222` on white plus a
purple button, replace it on DESIGN.

**Failure.** Third project in a row on `#F9F8F5` with madder; a slate/
emerald dark mode for a Mediterranean newspaper; a fintech dashboard on
cream because "paper is calm"; `--accent: #7c5cfc` and nothing else;
paragraphs in accent color.

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

## Imagery and licenses

Choose media the product can actually supply. Prefer assets already in the
project with a known right to use; for new files prefer CC0 and record the
license next to the file. Do not copy a competitor's layout, brand, or
images. Do not invent screenshots, faces, logos, or metrics, and do not
claim generated assets without a generation tool.

## Decision examples

- **One form, two treatments.** A long application reads on one canvas with
  section rules; independently saved account settings get grouped surfaces
  with their own edit actions. Grouping follows save boundaries. Test
  compact vs generous scale with the longest real label and error.
- **Content-led publication.** 1,200-word pieces want a reliable body face
  with full Turkish coverage and a stable measure, not display type on
  every heading or a neon dark theme.
- **Existing brand, new section.** A site with warm off-white, iron text,
  and one red action keeps those roles for Careers; hierarchy may change
  (a job list with location and type), the voice may not.
- **Blank fixture.** Arial and a navy hero are leftovers, not brand. A
  reading serif plus a mono for ids is fine if glyphs like `Kılıç` render.
