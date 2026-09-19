# Nadir Desk holdout run

Delivery status: complete for the requested browser scope. Mode: DESIGN. Platform: React web. Foundation: existing Nadir tokens and Button/Field/native Dialog components. Skill explicitly attached by path, not IDE discovery. Model identifier exposed by host: GPT-6 (exact serving revision not exposed).

## Direction and supplied visual reference
Observed 2026-09-19: supplied Nadir app at localhost:5183, 1440×900 (`before-desktop.png`). The navy rail already establishes the workspace; the full-width selected banner separates the note action from its record, and the table's loose equal spacing gives IDs undue weight. Preserve navy, sharp edges, Cambria headings and Segoe UI controls. Reuse the product's own context rather than import another brand. No external live visual research was conducted; the supplied app is the visual reference. Skill research notes were read as method, not claimed as personally inspected sites.

Compared persistent inspector with roomy full-width detail: chose inspector for repeated appointment comparison, stacking it after the locally scrolling table on phones. First viewport contains actual appointment records, not invented dashboard metrics. Person/ID form one scanning unit; selection has a border and the word Selected. A paper inspector groups slot, bay and reason above a readable clinical note. On phones, preserve type size and sticky person identity while scrolling the remaining table columns.

## Scope matrix

| Screen/state | Task | Components | Navigation/state | Check |
|---|---|---|---|---|
| Morning list | Select appointment | Existing table, navy shell | Three unchanged records; selected marker | Mouse selection; record count; screenshots |
| Selected record | Read context and committed note | Details, note surface, existing Button | Selection updates record and note | Cross-record isolation; long text screenshot |
| Editor | Read/edit several sentences | Existing Dialog, Field, Button; textarea | Save commits selected row; Cancel/Escape discard | Required error, long save, cancel, focus and backdrop checks |
| Narrow list/editor | Read and edit at 390×844 | Same components, local table overflow | Stack details; scroll columns; bounded dialog | Viewport overflow assertion; screenshot inspection; narrow save |

## Work and passes
Setup: used supplied Vite config and existing dependencies, no installs. Installed Vite reports 5.4.21. Initial sandbox build failed from esbuild directory access; approved explicit-workdir execution succeeded. A first edit attempt used unavailable `python`; it changed no JSX; implementation continued with the patch tool. Production preview on port 5183 (session 39961).
Design: changed only DeskScreen.jsx and theme.css as product source. Preserved all records, navy/font tokens and Button/Field/Dialog APIs. Dialog.jsx, dialog-geometry.js, notes-store.js remain unchanged. Multiline textarea replaces the single-line input while preserving Field validation. No new data, backend, dependencies or kit. Test note is evaluation input only, not seed data.

Initial implementation inspected in `representative-desktop.png` before extension/flow testing. Correction 1 raised the undersized table text to better match the inspector. Full desktop/mobile flow and state inspection followed. Correction 2 added explicit narrow table scroll guidance and keyboard focus treatment for its named region. Both corrections rebuilt; final full check reran successfully. Before and after images retained.

## Acceptance evidence

- A — implemented and run-verified: production build; three source records unchanged; no runtime page errors; session-only commits; reload clears notes. Rendered-face CDP results confirm Cambria heading and Segoe UI Semibold for M. Öztürk (checks.json), beyond computed CSS alone.
- B — visually inspected: before-desktop, representative-desktop, after-desktop (1440×900), desktop-dialog, desktop-error, narrow-saved full-page (390px width), narrow-dialog and narrow-default (390×844). Table, selected details, empty note, multiline saved note, dialog and required error share the original surface and control family. Narrow notes wrap naturally and the Save/Cancel controls remain inside the dialog.
- C — run-verified: selection, required-note error, several-sentence save, per-record isolation, Cancel draft discard, narrow save and honest reload/session semantics. See check.mjs and checks.json.
- D — run-verified: Escape, focus restoration, forward/reverse Tab containment, inside padding remains open, true backdrop closes, no page-width overflow at 390px, dialog entirely inside 390×844 viewport. Visually inspected focus ring and Turkish name rendering.

Limits: Chromium on Windows only. No real mobile software keyboard, iOS/Safari, screen-reader or hardware touch session was available. Table horizontal scrolling is intentional and local; selected details provide all fields without sideways reading. No external assets or custom fonts were added. No claim of production/backend persistence.

## Loaded skill files (SHA256)

Base: evals/runs/quality-2026-09-19/final-skill/

| File | SHA256 |
|---|---|
| SKILL.md | 20708E0C98CE05AAC3EE26CDC6083DB726AD2BE3202A2B357962F18990AEA9B1 |
| references/implementation.md | 30C19146BA448FEDAAE1E3AE5CC6D29F3EA414529410CF473068F6833C708759 |
| references/existing-ui-system.md | 360D292CF6310B1A602AE8C3FA07C865D550CE68FEAF1D514FBE221A5076719B |
| references/design-method.md | BFF3B433744476C0ACC034CCA0B51E649CE58109B1EC80BF8A594A5CB42B6DF9 |
| references/react-web.md | 5D54A90E0F460FBCE3860033F480711845C927BF836AB8B0D7141AF1F0C89673 |
| references/polish-pass.md | 988A03754901993D4C6CD7C7B41AE628CFEEA1F3A67AF73BD1F2BC19CEE71B7B |
| references/content-and-composition.md | E66D82ED3090F7DFC4C35D200218C4A62305310E5FBDFE087D9BB0B943E25C0F |
| references/typography-color-assets.md | 06BEB4100B3070B64C85AA33FF2B129EEA081DFF55CCC8A3A96CDE1A26087C6D |
| references/visual-craft.md | 41ACA2FFC433C66E0CB798F8EA607C3DE29E05DF5529B14E808E3B0340A869B6 |
| references/visual-research.md | 365B1DFD12310969FFC05D256E61441C3AD30C1E1DCE965C19C4FD4F98C95E32 |
| references/responsive-interaction.md | 40B43AC93915D6113681DB71EECB561F1ECE9CD202BED8AFF5FFDEEB842E4714 |
| references/completeness-and-states.md | 5B490A3D18401CC625B84FE0929F9372CABB45BFC27A3C6FE51A119A25AEAEFB |
