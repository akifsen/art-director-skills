# Daypack design notes

Mode: DESIGN. Platform: React Native / Expo 52. Foundation: starter, no existing UI system.

Thesis: The first viewport is an outing index, with the actual three plans as inviting field-note rows. A small bag emblem and bright citron label suggest the ritual of gathering a few essentials, without adding a marketing screen. Ink-blue type on pale blue-gray surfaces keeps the supplied long titles readable; white checklist rows and explicit checks make the packed objects the working material. On small screens everything stays in one scrollable column, including completion actions, with native safe-area insets and scalable text.

Considered: an illustration-led destination picker versus a compact outing index. Chosen index preserves the supplied descriptions and gets directly to packing. No external imagery or fonts are needed. The minimal-vs-unfinished study informed deliberate measure, action treatment and spacing; it is a web composition study, not native verification. Live visual research/device inspection unavailable during this reserved-device run. Extension remains provisional.

| Screen | Task | Components | States | Navigation | Check |
|---|---|---|---|---|---|
| Outings | Choose or resume a supplied plan | Header, PlanRow, status label | New, partial, ready, finished | Open pack list or packed summary | Bundle + later device |
| Packing | Check, uncheck, finish | Plan heading, progress segments, CheckRow, Button | 0/partial/all; finish disabled until all | Back preserves each plan; finish opens summary | State assertions + later device |
| Ready | Review packed contents, amend, restart | Success badge, packed rows, actions | Completed | Back/edit returns to packing; restart clears only this plan | State assertions + later device |

No accounts, backend, notification permission or persistent storage. Fictional plans are explicitly labeled. No animation or keyboard UI required.
