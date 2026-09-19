# İskele Reading Room — baseline run

## Provenance and setup (separate from design)

- Date: 2026-09-19. Host context describes GPT-6; exact deployed model identifier was not exposed to this agent. Default host model inherited; no model override and no delegation.
- Skill explicitly supplied by path: `../baseline-skill/SKILL.md`. This was not IDE discovery. Declared skill version: 0.4.0.
- SKILL.md SHA256: `F8AF81E116455807E094D2AFE8B7AB4CADCC2EE9618B277D8C8B03D115A83D78`.
- Product request: `../../../cases/13-library/brief.md`. Supplied `src/books.js` preserved unchanged.
- Read the assigned starter, root package.json, and listed skill references only. Did not read current skills, sibling outputs, evaluation reports, or shared tests.
- Root dependencies were installed centrally by the parent. Initially Vite directory existed before installation finished, so the first build/preview attempt failed with module-not-found. The next sandboxed Vite attempt failed on esbuild ancestor directory access. An approved elevated execution started Vite successfully. These were setup failures, not design corrections.
- Versions observed: Node 24.13.0, React/React DOM 18.3.1, Vite 5.4.21, React plugin 4.7.0, Playwright 1.63.0. No dependency was added by this implementation.
- Dev preview: http://127.0.0.1:5181. Tool session 11934. No production deployment.

## Design

Mode: DESIGN. Platform: web. Foundation: supplied React/Vite starter without a product system. Built local shared Button, Link, Jacket, Status, Empty and ReservationForm components plus shared CSS tokens. Native inputs/select; forms are routes, so no overlay library or custom focus trap needed.

Thesis:
1. The opening is a neighbourhood shelf: six actual titles presented as original typographic jackets under an immediately usable search bar.
2. The distinctive material is the supplied harbour, garden and ordinary-life book collection, including the deliberately long garden title and Turkish author names.
3. Georgia gives titles a reading voice; Segoe UI keeps controls precise. Green ink, pale shelf surfaces and different jacket colours distinguish books while thin rules connect the catalogue and lending record.
4. On phone the shelf becomes two columns. Detail stacks a readable cover above metadata. The form drops the repeated jacket and extended description, keeping book identity followed by name/day fields.

Considered a compact text-only inventory versus a small visual shelf. Selected the shelf because six books benefit from recognizable covers across catalogue, detail and reservations; typography-only jackets remain honest fictional artwork.

Observable research: no external websites or assets loaded, in keeping with the bounded supplied-reference scope. Read the supplied minimal-vs-unfinished study and both HTML sources; these were source readings, not visually observed third-party designs. Reused the principle of deliberate measure and complete focus states, not the study's composition. First actual visual inspection was the app's `slice.png` before extending the catalogue into the remaining flows.

## Scope matrix

| Screen / URL | Task and components | States | Navigation | Check |
|---|---|---|---|---|
| `/` | Search/filter shelf; Jacket, Status, Empty | Six books, available-only, empty query result, simulated error/retry | Book details or reservations | Automated at both viewports; screenshot inspected |
| `/book/:id` | Read description and facts | Available, own reservation, on loan, unknown ID | Reserve, reservations, catalogue | Automated and detail screenshot inspected |
| `/book/:id/reserve` | Reader name and native day select | Required-name error, create, edit draft, cancel draft | Save to reservations; cancel to unchanged detail | Automated; error form screenshot inspected |
| `/reservations` | Review reader/day, edit or cancel | Success, populated, empty, released book | Details, edit, catalogue | Automated and screenshot inspected |

All state is React memory for the current loaded session. Refresh resets it. Copy explicitly labels fictional books/covers and demo reservations. No login, payment, backend, external font or asset request.

## Implementation and correction budget

One initial implementation, including representative catalogue render then extension to complete flows. One evidence-driven correction pass: mobile screenshots revealed joined sentences when desktop line breaks were hidden. Added explicit inter-sentence spaces and made phone text actions at least 44px high. Rebuilt, reran both complete flows, regenerated screenshots and visually checked the corrected catalogue/reservations. No second correction pass.

Changed: `src/App.jsx`, `src/styles.css`. Added local evidence scripts `check.mjs`, `fonts-check.mjs`, their JSON results, screenshots, and this report. Build output in `dist/`. Starter `books.js`, `main.jsx`, `index.html`, and vite config retained.

## Actual checks and evidence

- Production command passed: `node node_modules/vite/bin/vite.js build --config evals/runs/quality-2026-09-19/baseline/vite.config.js` (32 modules).
- Playwright `check.mjs` passed at 1440×900 and 390×844: six supplied books, title/author search using İpek, available filter, empty search recovery, simulated error and Retry, long-title detail, empty-name blocking and focused invalid input, Tuesday create, edit-cancel preserves name/day, Wednesday edit-save, reserved availability removal, cancellation releases book, empty reservations, disabled on-loan action, unknown book recovery, keyboard Tab focus with solid outline, and catalogue no horizontal overflow.
- No browser page errors observed during these flows. `checks.json` records viewport dimensions, font CSS and results.
- CDP actual platform-font evidence in `fonts.json`: heading Georgia; first author and jacket-author (İpek Aydın) Segoe UI, with no custom webfont. This confirms actual font selection for those sampled nodes, beyond computed font-family intent.
- Screenshots actually opened and inspected: `slice.png`; `catalogue-1440.png`, `detail-1440.png`, `form-1440.png`, `reservations-1440.png`; `catalogue-390.png`, `detail-390.png`, `form-390.png`, `reservations-390.png`. Form screenshots show the validation error. The slice preceded full flow implementation.

Acceptance gates:
- A — Implemented and run-verified: production build, intact catalogue data, running styles/local fonts, functional state transitions.
- B — Visually inspected: catalogue, detail, validation form and populated reservation at both requested sizes; shared jacket/type/control language; long title readable.
- C — Implemented and run-verified: required flow and error/empty states as listed. Session availability changes track actual reservation records.
- D — Implemented and partly run-verified: semantic controls, label association, validation focus, visible keyboard outline, phone layout. No native device or screen reader used; exhaustive WCAG audit not claimed.

Limitations: Chromium on Windows only, no Safari/Firefox or physical phone/keyboard occlusion test; full-page screenshots can exceed the requested viewport height because the page scrolls. Horizontal overflow assertion samples the catalogue; detail/form widths were visually inspected. Error/empty states were run-verified but not separately screenshot-inspected. No external visual research. No backend reservation or persistence beyond the loaded session.

## Loaded reference files and SHA256

The following files were actually read from the supplied baseline skill snapshot. Some initial combined output was truncated; typography, craft, React and foundation guides were reread separately to recover their content.
- SKILL.md — F8AF81E116455807E094D2AFE8B7AB4CADCC2EE9618B277D8C8B03D115A83D78
- references/implementation.md — 30C19146BA448FEDAAE1E3AE5CC6D29F3EA414529410CF473068F6833C708759
- references/design-method.md — A2F1C6175EE0AD63C98077A411EA62A4E16DFCF09D6946C68985525D174D44CF
- references/content-and-composition.md — EC4C2A1E287D5D7E5B4D08FDE8B976B76129A692E0371C4E985E017F6221EAF6
- references/typography-color-assets.md — 8CACDEF062917A62C2A0F5C7C32B57627AAB3BD2D5AB44ACCE8E768F9728077A
- references/visual-craft.md — 41ACA2FFC433C66E0CB798F8EA607C3DE29E05DF5529B14E808E3B0340A869B6
- references/react-web.md — 5D54A90E0F460FBCE3860033F480711845C927BF836AB8B0D7141AF1F0C89673
- references/product-ui-system.md — EDEBEB9C4E7AC8858DADD28975046FC18DE6E06D069598B0C5C3F348B5777FC7
- references/responsive-interaction.md — 40B43AC93915D6113681DB71EECB561F1ECE9CD202BED8AFF5FFDEEB842E4714
- references/completeness-and-states.md — 5B490A3D18401CC625B84FE0929F9372CABB45BFC27A3C6FE51A119A25AEAEFB
- references/polish-pass.md — A1667912F786502E6AC487FFB5033C88685F7925544D7532C08D5B4718C9645A
- references/visual-research.md — 0B2E2D00E2A011A17B5EFCABB725289C241C4B3778F30D192B72D547CAB4822A
- references/studies/minimal-vs-unfinished.md — 6DF42A1893E45E5B52AE09B0C5C0A09A504727EAADE069DE443A13ABE46128B8
- references/studies/minimal-vs-unfinished.quiet.html — C404083BCBA9DDCAC435B7E7129A71665168B6753F08DAD7CE46BE25950C2636
- references/studies/minimal-vs-unfinished.unfinished.html — FF697CB1ADD00D6C57C9523415BEED620AC61793C8778D2588DE469A6B972689
