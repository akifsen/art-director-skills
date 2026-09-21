# Outcome rubric

Subjective. Two reviewers can disagree. Do not treat a passing score as a
product guarantee. Score each axis `0` (fail), `1` (partial), `2` (meets
the case bar). Write a one-line note per axis.

Keep **four gates**. Do not average them into one quality percent. Do not
award visual craft because the HTML is semantic, or functional pass because
the page looks styled. A strong first screen does not pass Gate C.

Historical v0.1.0 / v0.2.0 rows that used two gates stay as written in
`RESULTS.md`. New runs use A–D.

Do not use shadow count, gradient presence, CSS length, or animation count
as automatic scores.

If you did not inspect a current render, write visual axes as **unverified**,
not `2`. If you did not run a native simulator/device, Gate D for native is
**pending**, not passed via Expo web.

## Gate A — load, function, content

Pass/fail (not averaged with other gates):

- Pages or native screens render; CSS and fonts the thesis depends on load
- Heading order and landmarks (web) are honest
- Real content, routes, and figures; no invented quotes/metrics/dates
- Missing assets and 404 stylesheets are reported, not ignored
- REVIEW made no source edits

A broken stylesheet or unloaded display face is an A fail even if the
source looks designed.

## Gate B — craft and consistency

Score the axes below `0–2`. They describe craft, not Gate A.

### Hierarchy

Does the first screen make the lead obvious, with proof and action in
supporting roles? Equal-weight sections for unequal content scores `0`.

### Context fit

Would this structure still make sense if the product name changed but the
job stayed? A generic card grid on unlike offerings scores `0`.

### Surfaces, type, media, components, references, small screen, brand

Same meaning as previous Gate B axes: finished material, not a skeleton;
type with character; media in composition; shared component family;
research or honest fallback; small-screen or native composition; brand
extended rather than starter leftovers treated as sacred.

In-scope secondary screens (settings, forms, dialogs) must share the
language. A polished home and default dialogs fail consistency.

### Cross-brief difference (eval set only)

On the permitted eval set, if names and accents are stripped and unrelated
products still share section order, type ratio, image usage, and component
shapes, treat that as a **signal to inspect** — not an automatic fail.

## Gate C — scope, flows, and states

Pass/fail for the requested matrix (or the named REFINE control):

- In-scope screens/routes exist and navigate
- Asked-for actions work or are honestly disabled
- Relevant empty/loading/error/success/long-content states were opened
- No decorative filters, inert tabs, fake saves, or `#` action links
- Demo/local data is labeled; production save is not claimed

A list screenshot does not pass a list→detail→edit brief.

## Gate D — platform and accessibility

Web: keyboard path, focus visible, website mobile menu if in scope,
usable narrow viewport.

Native: safe area, keyboard vs submit, back/dismiss, touch without hover,
native screen-reader props. Not ARIA copied from the web guide.

Unrun device checks stay **pending**.

## Process checks (pass/fail, not averaged)

- Mode matched the brief (DESIGN / REFINE / REVIEW)
- Platform and UI foundation were named; matching references used
- REVIEW produced no source edits
- REFINE did not rewrite unrelated brand/type systems
- Visual vs technical evidence was labeled (implemented / run-verified /
  visually inspected)
- Skill path and version/commit recorded
- Parent "improve the skill" prompt was not in the eval agent's context

## Who scored

Record who looked (author / second reader / anonymous A/B). Author-looking
at their own run is not blind. Say so. Record repeat count.
