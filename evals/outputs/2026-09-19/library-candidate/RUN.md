# Candidate run — İskele Reading Room

## Setup and provenance
- Date: 2026-09-19. Model described by host as GPT-6; exact model identifier was not exposed to this child agent. Inherited parent/default settings; no model override or subdelegation.
- Skill supplied explicitly by path: `../candidate-skill/SKILL.md`. This was not IDE discovery. Only that skill, its relevant references, the assigned brief, assigned starter and root package metadata were consulted; no baseline output or evaluation reports were read.
- Installed dependencies observed: React 18.3.1, Vite 5.4.21, Playwright 1.63.0. No dependencies installed by this agent. Parent supplied starter and centrally prepared Chromium.
- Initial sandbox Vite failed on ancestor directory access; Chromium launch failed with EPERM. Elevated local build/browser commands succeeded. This was environment setup, not a design defect or skill requirement.
- Preview: http://127.0.0.1:5182 (running Vite process). Production output: `dist/`.

## Design work
Mode: DESIGN. Platform: React web. Foundation: starter/no product system. Built reusable Button, Status, Jacket and ReservationForm components, application navigation and shared CSS tokens. Native form controls avoid unnecessary overlay dependencies.

Thesis: The opening is a small neighbourhood bookshelf: six original fictional jackets provide colour and book identity beneath a short invitation. The books, Turkish author names and pickup days are the distinctive material. Georgia serves the jacket and reading titles, Segoe UI the catalogue controls; muted paper and green ink frame the varied jackets. On a phone the shelf becomes two columns, details stack, and the form omits the duplicate decorative cover so the name and day remain close to the action.

Considered a compact text catalogue versus a visual bookshelf. Chose the bookshelf because six books allow browsable cover identities without burying search. Kept availability outside artwork so it remains scannable.

References were source reading only: implementation, design method, composition, typography/color/assets, visual craft, visual research, React web, product UI system, responsive interaction, completeness/states, polish pass, and the minimal-vs-unfinished study. Initial combined output was partly truncated; visual craft, visual research, React web and typography were read separately. No live external visual research was performed: this bounded run was restricted to supplied skill/reference material and prohibited external asset/font fetches. No third-party visual source is claimed as inspected. The study informed deliberate measure, edges and visible focus, not a copied theme.

## Scope matrix
| Screen | Task and components | States / navigation | Actual check |
|---|---|---|---|
| `/` | Search, availability filter, jacket catalogue | Full/filtered/empty/error; links to detail | Browser search, filter, empty and Retry assertions |
| `/books/:id` | Read unchanged book details | Available, on loan, reserved; back to catalogue | Desktop/phone images; disabled loan action; missing ID |
| `/books/:id/reserve` | Name and pickup day | Empty-name validation, submit, cancel | Browser commit, keyboard submit, phone form |
| `/books/:id/edit` | Edit current reservation | Save or discard | Changed fields discarded on Cancel; day updated on Save |
| `/reservations` | See/cancel reservation | Empty and populated; edit/detail links | Count/state assertions and availability release |

## Iteration budget
One initial implementation in two stages (representative catalogue, then remaining scope); two correction passes.
1. Viewed `slice-desktop.png` and `slice-phone.png` before extending. Detected collapsed intro line-break spacing and dense long-title jacket. Added real word spacing and lowered only the long jacket title size.
2. Viewed completed detail, form, reservation and catalogue renders. Cleared stale notices on subsequent navigation and removed inherited link underlines from reservation jacket artwork. Re-ran functional checks, keyboard submission and build; inspected `reservations-final.png` after cleanup.

## Acceptance evidence
A — Implemented and run-verified: production Vite build passed; unchanged supplied `books.js`; Turkish author search; CSS visibly applied; no browser runtime errors. CDP reported actual Georgia regular/italic rendered fonts on the main heading (see `checks.json`). System fonts only; no image or font network assets.

B — Visually inspected: actual Chromium screenshots opened with the image tool, not merely saved. First slice at 1440×900 and 390×844; final catalogue at both widths; desktop detail/form/reservations; phone long-title detail/form/reservation; final desktop reservation cleanup. Full-page captures preserve the viewport width and extend vertically for scrolling states. Titles wrap, controls share a family, and fictional jackets provide distinct book identities. No horizontal overflow in checked phone detail/form/reservation flow.

C — Implemented and run-verified: title/author search, availability filter, empty search, simulated catalogue error and Retry, details, blank-name prevention, reserve, My reservations update, edit-cancel immutability, edit-save, cancellation releasing availability, unknown book and unavailable book. `verify.mjs` contains checks; results are in `checks.json`.

D — Implemented and run-verified: native labelled input/select, links with URL navigation and popstate, active navigation, skip link, visible focus, status announcements, keyboard traversal and submit. `keyboard.mjs` verifies typing a name, Tab to select, ArrowDown, Tab to visible-focus submit and Enter committing the record. `keyboard-check.json` records this. Phone form uses 16px input text and 44px controls.

Delivery status: complete for the scoped browser demo. No backend, login, payment, asset service or real reservation. State lives in React memory and resets on reload as explicitly stated in UI. No physical phone, mobile software keyboard, screen reader or cross-browser audit performed. External visual research not performed. This does not claim a formal accessibility certification.

Changed application files: `src/App.jsx`, `src/styles.css`. Supplied books and framework setup unchanged. Run artifacts: screenshots, `inspect.mjs`, `verify.mjs`, `keyboard.mjs`, check JSON files, hashes and this report. Final build command: `node node_modules/vite/bin/vite.js build --config evals/runs/quality-2026-09-19/candidate/vite.config.js`.

## Actual SHA256 of supplied skill and loaded reference files
SKILL.md 20708E0C98CE05AAC3EE26CDC6083DB726AD2BE3202A2B357962F18990AEA9B1
references/implementation.md 30C19146BA448FEDAAE1E3AE5CC6D29F3EA414529410CF473068F6833C708759
references/design-method.md BFF3B433744476C0ACC034CCA0B51E649CE58109B1EC80BF8A594A5CB42B6DF9
references/content-and-composition.md EC4C2A1E287D5D7E5B4D08FDE8B976B76129A692E0371C4E985E017F6221EAF6
references/typography-color-assets.md 06BEB4100B3070B64C85AA33FF2B129EEA081DFF55CCC8A3A96CDE1A26087C6D
references/visual-craft.md 41ACA2FFC433C66E0CB798F8EA607C3DE29E05DF5529B14E808E3B0340A869B6
references/visual-research.md 365B1DFD12310969FFC05D256E61441C3AD30C1E1DCE965C19C4FD4F98C95E32
references/react-web.md 5D54A90E0F460FBCE3860033F480711845C927BF836AB8B0D7141AF1F0C89673
references/product-ui-system.md A69DC0968CA279EA003BAD6E526EB99E4575CC1E2D44EECA303F68662F3CACD6
references/responsive-interaction.md 40B43AC93915D6113681DB71EECB561F1ECE9CD202BED8AFF5FFDEEB842E4714
references/completeness-and-states.md 5B490A3D18401CC625B84FE0929F9372CABB45BFC27A3C6FE51A119A25AEAEFB
references/polish-pass.md 988A03754901993D4C6CD7C7B41AE628CFEEA1F3A67AF73BD1F2BC19CEE71B7B
references/studies/minimal-vs-unfinished.md 6DF42A1893E45E5B52AE09B0C5C0A09A504727EAADE069DE443A13ABE46128B8

Browser-check environment clarification: all browser checks and visual inspections used Vite development server port 5182. The final production bundle was built successfully but was not separately served or browser-tested as a production preview.
