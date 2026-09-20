# Study: same content, skeleton vs finished

Open when the first pass looks like a wireframe, a card grid, or "we will
style it later."

This is a **fragment**, not a site theme. Do not rename Rail Still onto a
client. Platform fonts only in the HTML pair; the React example may load
the same stills.

## Brief (shared)

Rail Still makes catalog stills of architectural lighting.

- Current frame: "Linear 40", ferry cabin, 48V ceiling channel, 2026
- Also in the book: Dock flood (municipal yard), Task arm (drafting table)
- Action: email `desk@railstill.example` with the fixture name and the room

Task: see the current fixture first, then other frames or an inquiry.

The stills are generated demo images, not a client commission. Caption them
that way.

## What changes

The skeleton already has the facts in the wrong materials: a welcome hero,
three equal cards, default type, gray "image" boxes. The finished file keeps
the facts and gives them jobs.

| | Skeleton | Finished |
|---|---|---|
| First look | Studio name + slogan | The current fixture still, title as display |
| Proof | Empty gray rectangle | A cropped still of the channel, captioned as a demo |
| Support | Three identical cards | Uneven crops (yard / arm) plus a short studio line |
| Surface | White + `#ddd` + purple button | Cool stone canvas, unrounded photos, one copper tick |
| Type | `system-ui` everywhere | Grotesque display with a sense-break; sentence-case nav |
| Radius | 16px cards | Photos square; the mail action is a sharp rectangle |

Finishing is **not** Palatino-on-cream, tracked small-caps, or a 2px ledger.
That pairing is a *material voice* when the object is clay or an archive the
user asked for — see [kiln-rest.material.html](kiln-rest.material.html) — not
the definition of done.

## Open

- [wireframe-to-finish.skeleton.html](wireframe-to-finish.skeleton.html)
- [wireframe-to-finish.finished.html](wireframe-to-finish.finished.html)

The worked React version of the same brief is
[media-portfolio.md](../examples/media-portfolio.md) (`npm run example:rail`).

If you can render them, look at both at ~1440px and ~390px. If you cannot,
the tables and source still carry the argument.

## Takeaway

Finishing is deciding the still is the lead, cropping it so the fixture is
in the frame, and letting the next band change density. Intentional quiet
would also be valid — see [minimal-vs-unfinished.md](minimal-vs-unfinished.md)
— but this content wanted a catalog stage, not a blank and not a shed ledger.
