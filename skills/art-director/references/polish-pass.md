# Acceptance gates (not tour counts)

Read this before you declare DESIGN done, and whenever the first render
looks like a skeleton. Skip the full product matrix for a one-control
REFINE; there, still pass the gates **on the named piece**.

A representative slice is the first checkpoint. It is not permission to
leave the rest of the requested product untouched.

Pass count is a budget, not a success criterion. Do not start an endless
aesthetic loop either. Prioritize evidenced defects; re-verify each fix.

## Four gates (do not average)

### Gate A — Load, function, content

Styles, fonts, and images the thesis depends on actually load. Routes and
controls that were asked for run. Copy, names, and figures are real.
Unknown stays unknown. REVIEW did not edit sources.

A missing stylesheet is an A fail even if the markup looks designed.
Computed `font-family` still on the fallback means the face did not load —
do not praise the intended pairing.

### Gate B — Craft and consistency

Hierarchy, distinctive material, type, surfaces, density, and interaction
match the thesis **across in-scope screens**, not only the first view.
Settings, forms, and dialogs that share the system are part of this gate.

### Gate C — Scope, flows, and states

The matrix (or the named REFINE control) is implemented: screens,
navigation outcomes, empty/loading/error/success as required. Decorative
or dead controls fail this gate even if they look finished.

### Gate D — Platform and accessibility

Web: keyboard path, focus visible, headings, small viewport, website menu
if in scope. Native: safe area, keyboard, back/dismiss, touch, screen
reader props for that OS. Do not grade native with ARIA checklists.

## Sequence

1. Thesis, then references if you can see pages.
2. Slice in real files (marketing: nav + opening + next band; tool: the
   working surface).
3. Gate A on that slice (load check below).
4. Extend the language through the requested scope — do not invent a
   second system for later screens.
5. Walk a real flow and one stressing state (C).
6. Platform check you can actually run (D).
7. Highest-impact remaining defect; re-verify. Stop when gates pass or
   when remaining work is blocked (name the block).

## Load check (Gate A)

In the running UI, or by inspecting network/CSSOM / native font loading:

- The stylesheet or theme you edited is the one that runs
- Intended faces are the computed/native faces
- Images resolve; reserved space for known dimensions
- 404 `@import`s count as broken

Cannot run it: write **load check not done**.

## Honest stopping

**Done:** gates A–D passed on the requested scope, or failed gates are
explicitly blocked (no device, no rights, no network) and the delivered
part is listed.

**Not done:** “two tours finished.” **Not done:** beautiful hero, dead
save. **Not done:** tests green, UI still a skeleton. **Not done:** known
clipped content, keyboard covering submit, broken navigation, fake data.

**Not done:** “I did not see it but it should feel expensive.”
