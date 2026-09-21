# Changelog

## 0.9.1 — 2026-09-21

- Make the Rail Still focus ring readable: the ring is drawn outside the
  control, so it now uses an ink `--rs-focus` token against the canvas /
  paper surface instead of `currentColor` (a paper ring on paper measured
  1.00:1). Same change in the finished-fragment study and the
  `visual-craft` applied fragment.
- Fix the Playwright focus check to compare the ring with the composited
  surface it is painted over (`surfaceAt` / `ringPoint` helpers), not with
  the control's own fill. WCAG 2.2 SC 1.4.11 (3:1) is the stated bar for
  that one pair; a passing check is not a full audit.
- Add a hand-corrected copy of the Shoot board eval output
  (`evals/outputs/shoot-board-0.9.0-corrected`): `.chip:hover` outranked
  `.chip--on` and put the light selected label on the light hover surface
  (1.09:1). Selected + hover now has its own tone. Built and tested in the
  existing `seefix` CI project with a full list → detail → edit → error →
  save → cancel flow. The original 0.9.0 output is kept as recorded.
- Teach state combinations (selected + hover, selected + focus, invalid +
  focus, disabled + hover) as a design step in visual-craft,
  responsive-interaction, and native-mobile (native controls, not CSS/ARIA).
- Replace "fill the first viewport" wording in SKILL.md and
  product-ui-system with a container decision from content volume, task
  order, comparison need, and screen size. Add working-surface craft
  decisions (type levels, surfaces, row priority, control family, equal
  finish across list/detail/form, wide vs narrow).
- Run a clean same-brief trial on the frozen candidate (no coaching, no
  author patch) and inspect it live: selected + hover chip 15.66:1, real
  Tab focus ring 13.67:1 against the canvas, full list → detail → edit →
  error → save → cancel flow, unknown id and filter. Gaps kept as producer
  output: 13px muted text 4.05:1, 38px chips on 390.
- Strengthen the design claim without a house look. SKILL.md: fonts,
  warm/cool, light/dark, symmetry, cards, gradients, spacing and hairlines
  are tools that need a justification from task, content, brand, audience
  and platform — none banned, none required; keep the user's stated and
  rejected directions, do not assume unstated ones. DESIGN opens with a
  short direction of six decisions (task and content priority, composition
  and density, type roles, color/surface/state pairs, imagery's role,
  platform interaction), adjectives turned into checkable decisions, one or
  two distinctive moves. "Finished" now names the level: composition,
  type, imagery or its honest substitute, surfaces, component detail and
  states done together; a colored wireframe is not final, an unworked page
  is not minimalism, and nothing promises awards. Correction is by problem
  (readability, composition, action hierarchy), not one recipe, and covers
  loading. Design-method's thesis list became that six-item direction and
  drops the duplicated metaphor bans; typography's duplicate house-look
  paragraph is folded into "Choice versus quality". Web nav: sidebar,
  command palette and shortcuts are answers to destination count, not
  defaults. Native: placement and press feedback follow the task; keep
  platform fonts and working controls.
- Second clean trial on the same brief with that candidate frozen
  (`evals/outputs/shoot-board-0.9.1-direction`, inspected live): the
  direction step produced one applied decision (countdown as lead figure)
  and all measured text pairs cleared 4.5:1; material character did not
  improve (neutral gray canvas, placeholder idle pane). One run per arm;
  recorded as not a clear win, no quality gain claimed from the text edits.
- Add `tooling/install-skill.mjs` (also `npm run install-skill` and the
  `art-director-skill` bin for `npx github:akifsen/art-director-skills`):
  copies the skill folder to the vendor-documented path for Claude Code,
  Cursor, GitHub Copilot, Kiro, Codex, Qoder, Roo Code, Gemini CLI,
  OpenCode, Continue, CodeBuddy, Droid and Kilo Code (`--ai <ids|all>`,
  `--global`, `--force`, `status`, `remove`). No network, no telemetry,
  hash-verified copy. Uses its own copy/delete loops because Node 24
  `fs.rmSync` deleted nothing (and did not throw) on a Windows path with
  Turkish letters. Install-tested for all thirteen in
  `tests/install-targets.mjs`; per-host discovery status stays separate in
  `docs/compatibility.md`.

See [dated evidence](evals/evidence/state-craft-0.9.1/REPORT.md).

## 0.9.0 — 2026-09-20 (not tagged)

- Teach job vs domain (portfolio / product workspace / native) so a field
  like photography does not default to an editorial ledger.
- Replace Palatino, tracked small-caps, and cream-paper applied fragments
  with catalog and workspace recipes taken from a rendered example.
- Add Rail Still (media-led catalog) as a worked React example and as the
  skeleton-vs-finished study. Keep Kiln Rest clay/serif as a labeled
  material voice, not the definition of finished.
- Restyle Nadir Desk chrome away from display serif; cool Closeout tokens
  and drop tracked all-caps eyebrows. Native device proof remains pending.
- Keep filled-action type readable when a link reset is present: Rail Still
  inquire uses an element-only `a` color reset, and focus outline follows
  `currentColor`. Playwright checks contrast, hover, keyboard focus, and
  clipping on the real Vite preview at 1280 and 390.
- Separate voice choice (serif/sans, warm/cool, radius, large media) from
  quality (hierarchy, contrast, family consistency, composition). Visual
  review inspects in-scope actions and states, not only the opening view.

See [dated evidence](evals/evidence/craft-finish-0.9.0/REPORT.md) for the
fragment rewrite. Action contrast and photographer re-run:
[action-quality-0.9.0](evals/evidence/action-quality-0.9.0/REPORT.md).

## 0.8.0 — 2026-09-20

- Run the hand-corrected Fold Playwright project in CI. Build and test
  both set `ART_DIRECTOR_SEEFIX=1`; missing env fails instead of skip-pass.
- Keep see-and-correct in the distributed skill. Move independent-host,
  authoring-chat, and IDE-trial how-to into maintainer eval docs.
- Freeze an isolated Cursor trial (photographer brief + one skill copy).
  Discovery and natural selection remain pending until a new Cursor chat
  runs that workspace.

See [dated evidence](evals/evidence/ci-seefix-0.8.0/REPORT.md).

## 0.7.0 — 2026-09-20

- Make the DESIGN working method a short see-and-correct loop: context,
  needed references, thesis, one working surface, inspect the real render,
  focused correction, then related screens. A later validator is not the
  producing agent.
- Teach comparison density, pending action labels, and read-only summary
  semantics in the existing native and completeness guides. Teach compact
  selected-record forms without copying a Fold or Daypack layout into the
  skill.
- Keep the 0.6.0 Fold/Daypack candidate sources. Record hand-corrected
  copies and a frozen Pier Kettle transfer brief separately.

See [dated evidence](evals/evidence/see-and-fix-2026-09-20/REPORT.md).
Cursor discovery remains a separate, currently pending host test.

## 0.6.0 — 2026-09-20

- Refine the existing native tutorial with differentiated action roles,
  readable status text, shared list/detail/editor surfaces and contextual,
  bounded save feedback; retain the same data and session store.
- Teach proportional feedback and rechecking affected screens after shared
  type, spacing or control changes, without prescribing the example's look.
- Preserve two new ordinary-language briefs and independent explicit-path
  baseline/candidate runs. Cursor workspace opening is separate from skill
  discovery: input failed before submission, so normal Cursor use is unverified.
- Align compatibility claims with specific Android evidence and untested iOS/
  IDE scope. Retain existing Vite/Playwright and packaging/install gates.

See [dated evidence](evals/evidence/native-craft-2026-09-19/REPORT.md) for
actual outcomes, weak results and the distinction between manual tutorial
improvement and independent skill outputs.

## 0.5.0 — 2026-09-19

- Inspect and correct the representative render before extending broad DESIGN;
  inspect cross-screen consistency again at final acceptance.
- Separate complete, partial delivery and incomplete. Blocked checks do not pass.
- Compare viable alternatives for the same task; preserve deliberate native
  system typography and distinguish CSS font intent from actual loaded faces.
- Add dated first-party workspace/native visual observations, a fictional
  library evaluation and narrow form/dialog flow and capture coverage.
- Selected manual CI runs retain successful screenshots for review; capture
  is never automatic aesthetic approval. See the dated evidence report for
  actual independent-run, device, install and publication status.

The following reliability changes were already on main at `9e2e4bc`; they
were not present in the old v0.4.0 tag and are included in this release scope.

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
- Vendor-specific guidance removed from skill instructions, docs, eval
  briefs, and fixture labels. Existing-system work discovers the repo’s
  real UI; it does not assume a named kit
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
  native) and **UI foundation** (existing theme, local primitives,
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
  plus evals 08–11; template fixture is an original eval template
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
