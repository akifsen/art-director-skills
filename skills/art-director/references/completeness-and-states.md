# Completeness and states

Read this when the request includes more than one screen, a form, a list
with records, or named UI states. Skip it for a one-control REFINE.

“Complete” is not a feature shopping list. It is: **do not leave the
requested product half-built.**

## Scope matrix (keep it short)

For a broad DESIGN, list rows in design notes or the report:

| Screen / route | User task | Components | States needed | After navigation | How you will check |
|---|---|---|---|---|---|

One table is enough. No new JSON contract.

A single-component REFINE uses the same thinking locally (open, focus,
error, disabled) without a product-wide matrix.

## Flows beat screenshots

If the user asked for list → detail → edit → validation error → successful
save → back to list, a styled list screenshot is not completion.

Walk the path. Open the states that belong to it:

- Empty search / empty list
- Loading
- Save or network error
- Over-long title
- Many rows
- Small viewport (web) or keyboard + safe area (native)
- Website mobile menu when the web shell has one

Visible actions work, or they are honestly disabled with a reason.

Do not ship empty callbacks, decorative filters, inert tabs, fake success,
or every link as `#` when those controls were in scope.

If Save is on screen, the named record must change, then the next screen
must show that change. “Saved on this device” is a lie for in-memory demo
state — say “this session” (or actually persist and re-open the app).

Unknown record ids are in-scope states: labeled, with a way back. Do not
leave a blank shell or a form bound to a missing row.

Complex overlays (web dialog, native sheet): use the platform primitive
(`<dialog showModal()>`, the project’s dialog component, RN `Modal`).
`aria-modal` on a `div` is not a focus trap.

## Data honesty

If backend work is out of scope, local or mock state is allowed. Label it
as demo. Do not report that records were saved to production.

Do not change existing API contracts or business rules only to restyle a
screen.

## Shared components leak

After you style a Button, Table, or Dialog, open the other in-scope
screens that use it. A finished home and a default settings form is not
done.

## Marketing vs product apps

A studio landing can be complete as nav + opening viewport + the next
band proving rhythm — if that was the brief.

A tool is complete when the working surface and its in-scope actions
exist. Do not replace an ops board with a marketing hero.

## Three evidence labels

Keep them separate in the report:

- **Implemented** — source exists
- **Run-verified** — you exercised it in a running web app, native
  runtime, or equivalent
- **Visually inspected** — you looked at a render (who, viewport or
  device, states)

Not verified: say so. Do not fill the gap with confidence.
