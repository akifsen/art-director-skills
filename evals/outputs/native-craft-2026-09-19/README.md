# Saved independent outputs

`fold-baseline` / `fold-candidate` are responsive React outputs from case15; `daypack-baseline` / `daypack-candidate` are React Native outputs from case16. These are original generation results, not hand-corrected comparison mockups. Baseline uses0.5.0; candidate uses the frozen0.6.0 content identified in the [run manifest](../../evidence/native-craft-2026-09-19/manifest.json). `native-harness` instead contains the manually refined tutorial, not an independent evaluation arm.

RUN and DESIGN records preserve what their generation agents knew at delivery. Their pending-device statements are historical; the subsequent common validator's evidence is recorded separately in the [main report](../../evidence/native-craft-2026-09-19/REPORT.md). No generator was given another arm's result. Loaded-reference files identify actual explicit-path reads, not natural Cursor discovery.

For Fold, use the repository's existing Vite/Playwright commands in that report. Original one-off generator scripts retain ports5201/5202 and write to a local `evidence/` folder; their preserved captures are under the report's `web-baseline/` and `web-candidate/`. `web-matched/` contains the later common-run comparison. Its desktop viewport is1280×900, unlike the candidate generator's original1440×1000 capture.

For Daypack, copy one saved arm into an isolated temporary directory, run `npm ci` with its unchanged lockfile, then use the existing Expo52-compatible Android harness described in the device report. No `node_modules`, emulator images, private paths, runtime logs or generated Hermes bundles are distributed. `verify-state.mjs` in the candidate checks its reducer only; actual device evidence is separate.

[Output integrity](../../evidence/native-craft-2026-09-19/output-integrity.json) records the saved files' raw-byte SHA256 values and verifies matching installed skill copies and identical supplied data. Checkout line-ending conversion can change raw-byte hashes; the frozen run hashes identify the tested working copies.
