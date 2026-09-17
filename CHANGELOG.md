# Changelog

## Unreleased

Reliability of the maintainer path and the tutorial product flows.

- Windows isolated `skills` install no longer spawns `npx.cmd` with `shell: false` (Node `EINVAL`). It runs `npx-cli.js` through `node`, argv intact
- `package.json` script keys are unique; a walker fails on duplicate JSON keys (`JSON.parse` would hide them)
- Examples compile and serve only through Vite. The custom JSX transformer is gone
- `package-lock.json` pins maintainer Vite/Playwright for `npm ci` in CI
- Kiln delayed Save can be cancelled; a late timer cannot commit after Cancel, route change, or another load
- Native `<dialog>` closes on a true backdrop click, not panel padding
- Playwright uses bundled Chromium (not `channel: "chrome"`). v0.4.0 Ubuntu
  installed Chromium then launched Desktop Chrome, which is not on the runner
- E2E serves `vite preview` of the production build (`test:examples:build`),
  not the Vite dev transformer
- Save/Cancel races do not use `page.clock` (it patches `requestAnimationFrame`).
  Tests pass `?holdDelay=` so Cancel can beat the timer
- Playwright GitHub reporter + traces/screenshots on failure
- Visual captures are a separate `--project=visual`, not the CI flow gate
- Open dialogs cycle Tab at the last control; Playwright Chromium otherwise
  leaves focus inactive. Double Save uses an in-flight guard, not a force
  click on the disabled button (that click was cancelling the write)
- Worked examples are methods, not a file kit: do not copy hash routers,
  `?fixture=`, palettes, or `dialog-geometry.js` / `ui.jsx` into another product
- Holdout eval case 12 (Lumen Cart). Isolated DESIGN vs v0.4.0 is recorded in
  `evals/RESULTS.md` (source; no browser run in that session)

## 0.4.0 — 2026-09-17

Make the shipped examples tell the truth and prove it.

- Save writes onto the named record (Kiln hold, Nadir note, Closeout session)
- Success copy matches session state, not fake device storage
- Web dialogs use `<dialog showModal()>` for focus trap and inert backdrop
- Kiln loading/error/empty are opt-in fixtures; unknown routes have a way back
- Node store tests plus Playwright flows on the real React apps
- `AccessibilityInfo.announceForAccessibility` is the documented RN API

## 0.3.0 — 2026-09-17

Product-complete web and native UI, without a purchased theme.

- DESIGN still uses one skill and three modes; adds **platform** (web vs
  native) and **UI foundation** (existing theme, shadcn-like primitives,
  or starter) so the right references load
- Theme-less React work builds a small shared system, then screens — not
  page-local CSS or a static HTML mock
- Existing themes and local primitives are enhanced in place (tokens,
  variants, composite screens) without a second UI kit
- Native (React Native / Expo) is a separate recipe: navigation, safe
  area, keyboard, sheets, native a11y — not a website mobile menu
- Completeness is the requested flow and states; polish is four gates
  (A–D), not a tour count
- Original implementation examples (Kiln Queue, Nadir Desk, Closeout)
  plus evals 08–11; template fixture is labeled **not Ecme**
- Flutter / SwiftUI / Compose: not claimed as tested

## 0.2.0 — 2026-09-17

Teach finished, context-specific craft — not only process and palettes.

- DESIGN now expects a representative slice of finished interface work
  (composition, type, surfaces, imagery, interaction) before extending
- Short visual-research pass when the host can *see* pages; offline
  fallback to original studies in the skill
- Brand vs starter-kit fonts called out; REFINE still finishes the named
  control; REVIEW stays read-only
- New on-demand references: visual research, visual craft, polish pass,
  four annotated HTML studies
- Eval rubric splits Gate A (functional/load) from Gate B (craft);
  keyword fixtures are labeled as heuristics, not host invocation
- Docs match the public GitHub repo; replacing a v0.1.0 folder is the
  update path

## 0.1.0 — 2026-09-17

First public skill release. Independent of `@akifsen/art-director-mcp`.

- One portable skill, `art-director`, with DESIGN / REFINE / REVIEW modes
- On-demand references for method, composition, type/color/assets, responsive
  interaction, implementation, and visual review
- Optional `.art-director/design-notes.md` example; no JSON contract engine
- Maintainer validation, trigger fixtures, eval cases, and isolated install check
- No npm package for the skill; no change to the old MCP package
