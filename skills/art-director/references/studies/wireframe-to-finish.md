# Study: same content, skeleton vs finished

Open when the first pass looks like a wireframe, a card grid, or "we will
style it later."

This is a **fragment**, not a site theme. Do not rename Kiln Rest onto a
client. Platform fonts only; no third-party files.

## Brief (shared)

Kiln Rest mends ceramics. Unlike offerings:

- Current showing: "Twelve mended bowls", through 3 November, kiln shed,
  Saturday visits 11–14
- Restoration commissions, inquiry by email
- Two Saturday clinics; remaining seats unknown

Task: understand the live showing first, then restoration or a clinic.

## What changes

The skeleton already has the right facts in the wrong materials: a welcome
hero, three equal cards, default type, gray "image" boxes. The finished
file keeps the facts and gives them jobs.

| | Skeleton | Finished |
|---|---|---|
| First look | Studio name + slogan | The showing title, as display type |
| Proof | Empty gray rectangle | A captioned kintsugi diagram (SVG, not a photo) |
| Support | Three identical cards | Restoration as one inquiry line; clinics as a timetable |
| Surface | White + `#ddd` + purple button | Clay canvas, iron text, gold mend line |
| Type | `system-ui` everywhere | Palatino display, small meta, body on a measure |
| Radius | 16px cards | Near-sharp (`2px`) — a shed, not an app |

## Open

- [wireframe-to-finish.skeleton.html](wireframe-to-finish.skeleton.html)
- [wireframe-to-finish.finished.html](wireframe-to-finish.finished.html)

If you can render them, look at both at ~1440px and ~390px. If you cannot,
the tables and source still carry the argument.

## Takeaway

Finishing is not "more CSS." It is deciding the showing is the lead, drawing
an honest diagram instead of a gray box, and letting workshops be a schedule
instead of a third card. Intentional quiet would also be valid — see
[minimal-vs-unfinished.md](minimal-vs-unfinished.md) — but this content
wanted a material stage, not a blank.
