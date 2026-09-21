# Candidate 2 — İskele Reading Room

## Setup and provenance

- Supplied-path skill evaluation; no IDE discovery is claimed. Read `../candidate2-skill/SKILL.md` and only the references listed below. The sole product brief was `evals/cases/13-library/brief.md`.
- Model: host described the agent as GPT-6; an exact backend model identifier was not exposed to this worker. No model override, no delegation.
- Setup: existing React 18.3.1, Vite 5.4.21 and Playwright 1.63.0 at repository root. No package installation or external asset/font fetch. Read assigned starter and root package metadata. Did not read current skills, other candidates, or evaluation reports.
- Initial sandbox build could not read the config through esbuild (access denied); the same explicit-repository build passed after approved escalation. Browser and preview commands also used approved escalation.
- Production preview: http://127.0.0.1:5184 (tool session 85193). Build command: `node node_modules/vite/bin/vite.js build --config evals/runs/quality-2026-09-19/candidate2/vite.config.js`.
- Skill reference source reads were batched; one large output was truncated, so visual-craft, visual-research and responsive-interaction were reread independently. No external rendered reference site was inspected. The minimal-vs-unfinished study was source-read, not visually inspected. Existing observation examples within visual-research.md are the skill author's observations, not mine.

## Design work

Mode DESIGN; platform web; foundation starter with no product system. Created shared Button, Badge, Cover and Empty primitives plus CSS tokens and composite catalogue/detail/form/reservation patterns. No UI kit installed.

Thesis:
1. First viewport is a working lending shelf: six compact typographic jackets, title/author search and visible availability. The small library introduction frames the shelf without replacing it.
2. Distinctive material is the supplied fictional neighbourhood reading collection, including Turkish authors and the unusually long gardening title. Original jackets repeat those exact identities and are explicitly labeled fictional.
3. Georgia gives book titles a reading voice; Arial makes catalogue and pickup controls plain. Dark green ink, light paper and individually coloured covers organise the shelf. Hairlines, restrained square corners and shared fields connect the screens.
4. Phone uses a two-column shelf and stacked full-page details/forms. Both navigation destinations remain visible. The form uses a small selected-book summary and full-width day choices.

Compared a dense text-only lending index with the jacket shelf. Chose the shelf because six supplied books fit as comparable objects, while exact titles remain readable and availability stays next to each record.

## Scope matrix

| Screen | Task | Components | States | Navigation | Check |
|---|---|---|---|---|---|
| Catalogue `/` | Find available title/author | Search, checkbox, cover cards | Six books, filtered, empty, simulated error/retry | Book query URL | Browser assertions and desktop/phone render |
| Detail `?book=b2` | Inspect a book | Cover, facts, availability, action | Available, on loan, own reservation, unknown id | Back/catalogue or reservation form | Long-title render and functional checks |
| Form `?book=b2&reserve=1` | Reserve pickup | Reader field, radio days, actions | Empty-name error, draft, cancel, success | Cancel to detail; commit to My reservations | State assertions, keyboard, desktop/phone render |
| My reservations `?view=reservations` | See/cancel reservation | Record rows, feedback, empty panel | Empty, reserved, cancelled | Detail/catalogue | Availability mutation and release assertions |

## Actual sequence and correction budget

Initial implementation built shared tokens/components and the catalogue only. Built production output, captured and actually inspected initial-desktop.png (1440x900) and initial-phone.png (390x844) before implementing the remaining screens.

Correction pass 1: the desktop long title and author extended beyond the viewport; reduced intro spacing and jacket height so all six identities fit more comfortably. Extended the reviewed system through detail, form and reservations.

Ran the full scripted flow and inspected desktop catalogue/detail/form and phone detail/form/reservations. Correction pass 2: fixed a missing space when the form heading line break is hidden on phone; changed navigation focus to preventScroll so focusing main does not scroll the header away. Rebuilt and reran the same checks, then inspected corrected desktop form and phone form as well as desktop reservations and phone catalogue. No third correction pass.

## Evidence and acceptance gates

- A — Run-verified: production build passed, no page errors, supplied books.js preserved. Browser rendered the styles. CDP platform-font inspection reported actual Georgia for the heading; Arial is the system control/body stack. Turkish author/name glyphs were visible in screenshots. No external assets or webfonts.
- B — Visually inspected: real production screenshots at 1440x900 and 390x844; original jacket and long-title hierarchy, detail, form, reservation feedback and list checked. Corrected the two issues recorded above. The phone detail/form naturally scroll; they are not compressed desktop views.
- C — Implemented and run-verified: title/author search, available-only filter, empty search and reset, simulated catalogue error and Retry, available/unavailable/unknown detail, empty-name validation and focused field, Cancel leaving records unchanged, successful reservation reflected in availability and My reservations, cancellation releasing the book, reload clearing session. All checks in check.mjs passed after final build; machine-readable evidence is checks.json.
- D — Implemented and run-verified within Chromium: semantic headings, labels, radio group, skip link, focus styles, keyboard day changes and Tab/Enter submission, active navigation, phone flow and no horizontal overflow on the reservation page. Native form controls and page navigation avoid custom modal/focus traps. No screen-reader or physical-device testing was performed.

Status: complete for the requested local demo scope and the checks exercised here. Accessibility verification is bounded to the browser keyboard/semantics checks above, not a full audit. Live visual research did not occur; study source reading is not visual-reference evidence. Browser Back support is implemented via popstate but not separately exercised in the recorded script. No backend, persistence, real booking, login or payment.

## Files and evidence

- src/App.jsx: state, navigation and all requested screens.
- src/ui.jsx: shared primitives and fictional jacket component.
- src/styles.css: shared design tokens, components and responsive layouts.
- src/books.js and starter main/config/index were preserved.
- inspect.mjs: initial representative-render capture.
- check.mjs, checks.json: repeatable local browser flow and observed results.
- initial-desktop.png, initial-phone.png: initial slice actually inspected.
- desktop-catalogue.png, desktop-detail.png, desktop-form.png, desktop-reservations.png; phone-catalogue.png, phone-detail.png, phone-form.png, phone-reservations.png: production captures. Phone detail/form/reservations use full-page captures with a 390x844 viewport; catalogue captures use viewport height.
- dist/: built production assets.

## Loaded skill files — SHA256

All paths below are relative to `../candidate2-skill/`. These hashes were calculated from the actual supplied files.

| File | SHA256 |
|---|---|
| SKILL.md | 20708E0C98CE05AAC3EE26CDC6083DB726AD2BE3202A2B357962F18990AEA9B1 |
| references/implementation.md | 30C19146BA448FEDAAE1E3AE5CC6D29F3EA414529410CF473068F6833C708759 |
| references/design-method.md | BFF3B433744476C0ACC034CCA0B51E649CE58109B1EC80BF8A594A5CB42B6DF9 |
| references/content-and-composition.md | E66D82ED3090F7DFC4C35D200218C4A62305310E5FBDFE087D9BB0B943E25C0F |
| references/typography-color-assets.md | 06BEB4100B3070B64C85AA33FF2B129EEA081DFF55CCC8A3A96CDE1A26087C6D |
| references/visual-craft.md | E199FA5C3D7B81B0435B75C922BA28547597AB2073C7F8897BA4C00D6C71581C |
| references/visual-research.md | 365B1DFD12310969FFC05D256E61441C3AD30C1E1DCE965C19C4FD4F98C95E32 |
| references/responsive-interaction.md | 40B43AC93915D6113681DB71EECB561F1ECE9CD202BED8AFF5FFDEEB842E4714 |
| references/react-web.md | 5D54A90E0F460FBCE3860033F480711845C927BF836AB8B0D7141AF1F0C89673 |
| references/product-ui-system.md | A69DC0968CA279EA003BAD6E526EB99E4575CC1E2D44EECA303F68662F3CACD6 |
| references/completeness-and-states.md | 5B490A3D18401CC625B84FE0929F9372CABB45BFC27A3C6FE51A119A25AEAEFB |
| references/polish-pass.md | 988A03754901993D4C6CD7C7B41AE628CFEEA1F3A67AF73BD1F2BC19CEE71B7B |
| references/studies/minimal-vs-unfinished.md | 6DF42A1893E45E5B52AE09B0C5C0A09A504727EAADE069DE443A13ABE46128B8 |
