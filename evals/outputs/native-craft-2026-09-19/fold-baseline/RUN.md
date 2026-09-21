# Fold web baseline run

Date: 2026-09-20 (Europe/Istanbul). One independent attempt; one correction pass (narrow catalogue illustration width and filter target height). No subagents, new packages, services, accounts, payments, commits or pushes.

## Direction and scope
DESIGN; React web; starter with no UI system. Added shared Button, Badge and concept-illustration components with common CSS tokens.

Visual thesis: the opening viewport pairs a compact weekend invitation with the actual craft catalogue. Original CSS diagrams distinguish layered print, pinch bowl, stitched notebook and woven sample. A dark green humanist sans hierarchy, thin borders and material-coloured diagram strips connect the programme with its booking slip. On phones the catalogue becomes a single column, diagram strips narrow, and detail/form stack; decorative detail art is deferred.

Selected compact catalogue over a single featured workshop: all four supplied crafts deserve equal access. Illustrations are conceptual, labelled, original CSS; no external media or font downloads. Segoe UI is the intentional local face with system fallback.

| Screen | Task / components | States / navigation | Check |
|---|---|---|---|
| Catalogue | Browse and craft filter; workshop composite | All / selected filter, retained on return | Four records and filtering |
| Workshop URL query | Inspect details; summary and form | Back, unknown ID recovery, fully booked disabled | Detail, back, unknown ID |
| Reservation form | Session, quantity, name | Missing session/name, capacity error, selected radio | Invalid and valid submissions |
| Confirmation | Read stored reservation; ticket | One/two places; cancel releases reservation | Confirmation fields, cancellation, choose again |

## Observable execution
- Read assigned skill and references listed below. No adjacent cases or alternate skill copies read.
- Initial native Vite build was blocked by filesystem traversal permissions. Escalated commands with explicit assigned working directory succeeded.
- Installed dependency versions observed: React 18.3.1, Vite 5.4.21, Playwright 1.63.0; existing root dependencies used.
- Ran representative catalogue on localhost:5201, captured and actually inspected slice-desktop.png and slice-mobile.png before adding detail/form/confirmation.
- Corrected narrow diagram allocation from 112px to 88px and mobile filter targets to 44px.
- Ran npm run build successfully: 33 modules, output in dist.
- Ran node check.mjs successfully using installed Playwright Chromium. Actual assertions listed in evidence/checks.json.
- Inspected final validation-desktop.png, confirmation-desktop.png, detail-mobile.png, confirmation-mobile.png and catalogue-mobile.png. Desktop 1280x900 and phone 390x844 viewport sizes; images are full-page captures.

## Evidence and gates
- A implemented / run-verified: Vite production build, CSS loaded, supplied records preserved, no browser page errors. Local font stack checked via computed style; no external font fetches.
- B implemented / visually inspected: catalogue, details, errors and confirmation share the component language. Phone layout accommodates long supplied names. Original diagrams are explicitly conceptual.
- C implemented / run-verified: filtering, selection, URL detail, unavailable session, required fields, capacity restriction, one/two places, confirmation, cancellation, filter retention, unknown workshop recovery and refresh reset.
- D implemented / run-verified / visually inspected: native radio/select/input semantics, visible labels and error associations, focus style, focus on invalid field, disabled full session, 390px horizontal overflow check. No overlays or menu needed. Screen-reader and physical-device testing not performed.

Status: complete requested functional implementation with scoped Chromium checks and visual inspection. Live external visual research was not performed in this bounded attempt; the supplied minimal-vs-unfinished study was read as source text only, not represented as visually inspected research. Keyboard verification is a focused smoke check, not a full accessibility audit. In-memory state intentionally resets on refresh/close; the UI states this. Only one active reservation is supported; cancel to choose again.

Files: src/App.jsx, src/ui.jsx, src/styles.css, check.mjs, RUN.md, evidence/*, dist/*. Supplied src/data.js and installed skill are unchanged.

## Loaded skill/reference SHA256
- .cursor/skills/art-director/SKILL.md — D81E494E5B19966687CF1BC505229A8ECF7EEB7237F0DD9BB1BDC83846AFB2A9
- .cursor/skills/art-director/references/implementation.md — 69EF9BAA588BFB73C9516F13A15FE02D33C15714DC97A38714FC9B6C9F214270
- .cursor/skills/art-director/references/design-method.md — 7E181C8927F87D75F4CBE0899ACF0BDE66F083250CDE04C90D9E1387BD540453
- .cursor/skills/art-director/references/content-and-composition.md — A6BC5A0A9E5681A53D9DE052A076DECF4B80BFC0EB3FD5A683BEAADD6C045511
- .cursor/skills/art-director/references/typography-color-assets.md — D30E6E04730E3DF0FE6B0A3C5142922FF6E57664D84F71BABADC2057C2A3D0C6
- .cursor/skills/art-director/references/visual-craft.md — 97A7F531C59E7806AA3A55E7FA3CF213722C0DFAD1C4FE65673F48C87411CB3B
- .cursor/skills/art-director/references/responsive-interaction.md — 68C5FFA239D3EE337B6783BA6B76814E79983A3B336314EAFD585FE7EC8F5318
- .cursor/skills/art-director/references/react-web.md — 509F1B0C52E2B5DCEC3D0C5CAE26D307E768DFF623C29CD3562E324C3EECE4EE
- .cursor/skills/art-director/references/product-ui-system.md — D37F7F957C943CEAA65420788422647551DEE30871AE60C537B1F6FF7CC3FC3C
- .cursor/skills/art-director/references/completeness-and-states.md — 98E94A78F7E8CB3D752698CB195C905F121E35B8EB968105CC01B28BFB3B8C53
- .cursor/skills/art-director/references/polish-pass.md — 5974D4CE6965931B5C7A3432843DB1AEB86ECCEF5CF54D136D26FC619BFA5B71
- .cursor/skills/art-director/references/studies/minimal-vs-unfinished.md — 4866A3DDEE00E90B51E5AE77309691AA7E968F91AB667A85C232D1D617A15A3F
- .cursor/skills/art-director/references/visual-research.md — 33DAA353FC62A5BF8B24EDBE4E891DCE4CC7102114234E5E7469A695D1FB21FB
