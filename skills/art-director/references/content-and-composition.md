# Content and composition

Read this when structure, grouping, or section rhythm is in play. Skip it
when the request is type, color, or a single control.

Page-level composition is a set of jobs: what is first, how wide it is, where
the edges sit, how empty space works, and how one band hands off to the next.
A "landing page" is not a template.

## Roles, not equal blocks

**When.** More than one idea is on the page.

**How.** Give each band a job:

- **Lead:** the one thing a visitor should understand first.
- **Proof:** the artifact, data, case, or sample that makes the lead true.
- **Support:** secondary services, notes, or context.
- **Action:** the next step, with a label that names the task.

A brief with five bullets is not five sections of equal height. Merge
weak items. Cut sections that only repeat the lead in vaguer words.

**Common failure.** Hero + three equal cards + quote + footer, or the same
content rewritten as "01 / 02 / 03" so it no longer looks like cards.
Numbered lists are a tool, not the replacement religion.

**Applied.** Northglass: lead is the live installation (name, dates, how to
visit). Proof is a composed stage for "Sodium Vault." Support is photography
retainers and workshops as *different* objects (inquiry vs dated sessions).
Action is appointment or email — not "Get started."

## Four compositional attitudes

Match the *task*, then pick a rhythm. These are starting attitudes, not
packs. Do not run all four on one page.

### Media-heavy

**When.** The proof is a photograph, still, spatial work, or film still the
brand actually has (or an honest diagram of that work).

**How.** Let the image (or diagram) set the opening geometry: full-bleed or
asymmetric crop, caption locked to an edge, type riding in a margin or on
the image with a real contrast check. Next band should change width or
density so the proof stays the event.

**Failure.** Square thumbnails in a three-column grid with the same H2 style
as "About."

### Product-centered

**When.** The proof is the working UI, object, or record the visitor will
use or buy.

**How.** Crop a believable fragment of the product (or a labeled diagram of
it) into the first viewport. Surround it with short claim + one action.
Chrome of the *marketing* page should recede (thin nav, small type) so the
object reads.

**Failure.** A slogan hero, then "screenshot" gray box in section three.

### Typographic

**When.** The distinctive material is voice, a title, or a long read.

**How.** Display type is part of the composition: size, line breaks, and
measure do the staging. Edges may be a narrow column (`~60–70ch` for
articles is a starting range). Imagery is optional.

**Failure.** A huge display font on every heading, or a default document
with no display role at all when the title *is* the artifact.

### Data-dense

**When.** The visitor compares, triages, or scans records.

**How.** Persistent context (filters, identity columns), compact rows,
tabular numbers, tight but even rhythm. Air goes to the rare alert, not to
a marketing masthead.

**Failure.** Card grid of KPIs above a shrunken table, or a hero that
restates the product name.

## Grid, edges, measure

**When.** You are laying out a band, not a single sentence.

**How.**

- Decide a content width per band (full viewport, `min(72rem, 100% - 2rem)`,
  or a reading measure). Changing width between bands is a transition.
- Align to a small set of edges (page gutter, column, optical center).
  Accidental leftover padding from a starter stylesheet is not a grid.
- Empty space is a frame for the lead, a pause before proof, or a gutter —
  not leftover because nothing was designed.

**Failure.** `padding: 4rem 1.5rem` on everything; cards `1fr 1fr 1fr` at
every breakpoint.

## Rhythm between bands

Vary width, density, and media **because the job changed**. A full-bleed
proof after a narrow lead can help. Alternating "text / image / text /
image" is not a strategy. Centered, symmetric layouts are valid when the
content is a single statement plus an action.

Keep source order meaningful. Visual reordering often breaks on small
screens.

For a workspace grid, let the content column shrink below its children's
intrinsic width. On web that often means `min-width: 0` on the grid item
and local overflow on the table wrapper. Check the viewport-sized capture,
not only a full-page image whose width can silently grow beyond the phone.
The narrow form/dialog deserves its own inspection, with long real content.

## Grouping several offerings

Group by visitor job, not by the org chart.

- Unlike offerings: feature one, then name the others as different paths
  (stage vs list vs timetable — not three clones).
- Comparable offerings: a table or definition list often beats identical
  cards.
- A series (issues, case studies, releases): show order, date, or status.

Avoid a grid that repeats the same heading structure with the name swapped.

## Decision examples

### Multi-product studio

Northglass lists photography retainers, exhibition design, and weekend
workshops. A three-card row treats them as SKUs. Better: open with the
current exhibition as a *media* stage, then a retainer inquiry path, then
workshops as a dated list. The visitor can tell which offering is live work
and which is a class.

### Personal developer portfolio

Ada has six shipped tools and one long technical memoir. Equal project
tiles bury the memoir. Better: a *typographic* opening from the memoir,
then a compact index of tools grouped by problem (data, games, internals).

### Dispatch board

Harbor Ops is not a landing page. *Data-dense* composition: overdue jobs
first, berth filter in reach, table as the stage. Do not add a proof
screenshot of the same table.
