# Outcome rubric

Subjective. Two reviewers can disagree. Do not treat a passing score as a
product guarantee. Score each axis `0` (fail), `1` (partial), `2` (meets
the case bar). Write a one-line note per axis.

Keep **two gates**. Do not average them into one quality percent. Do not
award visual craft because the HTML is semantic, or functional pass because
the page looks styled.

Do not use shadow count, gradient presence, CSS length, or animation count
as automatic scores.

If you did not inspect a current render, write visual axes as **unverified**,
not `2`.

## Gate A — functional / accessible / semantic

Pass/fail (not averaged with Gate B):

- Pages render; CSS and fonts that the thesis depends on actually load
- Heading order and landmarks are honest
- Keyboard path and focus visibility for controls that were in scope
- Real content, routes, and empty states; no invented quotes/metrics
- Missing assets and 404 stylesheets are reported, not ignored
- REVIEW made no source edits

A broken `link rel="stylesheet"` or an unloaded display face is a Gate A
fail even if the source looks designed.

## Gate B — visual craft (0–2 each)

### Hierarchy

Does the first screen make the lead obvious, with proof and action in
supporting roles? Equal-weight sections for unequal content scores `0`.

### Context fit

Would this structure still make sense if the product name changed but the
content type stayed the same? A studio of unlike services laid out as a
SaaS feature grid scores low.

### Distinctiveness

Is there a decision a generic "modern landing" would not have made? Stock
hero + three cards + testimonial, with no tie to the actual artifact,
scores `0`.

### Finished composition

Does the opening slice look directed (type, surfaces, edges, proof
integration) rather than a wireframe or unstyled document? Intentional
minimalism can score `2`. Default margins and gray boxes score `0`.

### Type craft

Roles, measure, line breaks, and hierarchy — not only a font name. Display
used as composition when the brief needs it; not the same condensed poster
on every case.

### Color and surfaces

Canvas, raised surface, text steps, hairline, interactive, and status relate.
One accent on white with no surface story scores at most `1` unless the
brief is a single-sheet quiet page that justified that.

### Asset integration

Photographs/screenshots are cropped and captioned; missing media becomes
type, a timetable, or a labeled diagram — not a gray rectangle. Conceptual
graphics are not labeled as product photos. Demo data is labeled.

### Component and interaction finish

Nav, buttons, tables, and links share a family. States that exist (hover,
focus, selected, overdue, open menu) were designed. Motion, if any, is
purposeful.

### Reference-justified decisions

For broad DESIGN: either a short visual-research note from screens that
were actually seen, or an explicit fallback to this skill's studies. Do
not credit "looks like Linear" without a transferable principle. Unverified
if no research was possible and that was not said.

### Small-screen usability

Can the stated task be done without hover, tiny hit targets, or a shrunk
desktop? Mobile is a different composition, not only a breakpoint. Unverified
mobile (no browser) must be marked unverified, not `2`.

### Brand consistency

For cases with an existing visual system, did the work extend it? A new
palette or display face without a request scores `0` here. Starter-kit
fonts on a blank DESIGN fixture are not a brand.

### Cross-brief difference (eval set only)

On the permitted eval set (or user-supplied examples), if names and accents
are stripped and 01/02/03 still share section order, type ratio, image
usage, and component shapes, treat that as a **signal to inspect** — not
an automatic fail. Two tools can both need tables. Do not scrape user
projects for this check.

## Process checks (pass/fail, not averaged)

- Mode matched the brief (DESIGN / REFINE / REVIEW)
- REVIEW produced no source edits
- REFINE did not rewrite unrelated brand/type systems
- References: only files in scope were needed; whole-catalog load is a miss
- Visual vs technical evidence was labeled honestly
- Skill path and version/commit recorded; an old installed copy was not
  mistaken for this run
- Parent "improve the skill" prompt was not in the eval agent's context

## Who scored

Record who looked (author / second reader / anonymous A/B). Author-looking
at their own run is not blind. Say so.
