# Changelog

## 0.10.2 — 2026-09-21 (skill: measured touch, hover guard, first paint)

- Skill: lessons from a two-project comparison (2026-09-21, static local
  news sites; one built with the skill, one without). The skill-built site
  passed the surface, type, composition, and honesty bar but was silent on
  four things the review had to add by hand; the other site *claimed*
  "strict 44×44" in a CSS comment while rendering 23px chips and a 431px
  `scrollWidth` at 390. Added:
  - `responsive-interaction.md`: hover-only presentation behind
    `@media (hover: hover)`, `:active` as the touch feedback, and hit
    areas measured from rendered boxes (`getBoundingClientRect`,
    `scrollWidth` vs `innerWidth`) rather than read from a comment.
  - `visual-review.md`: "Measure, do not read the comment" — overflow,
    hit-area list, hover guard, missing `<img>` dimensions, and first-frame
    theme flash as concrete checks.
  - `implementation.md`: intrinsic `width`/`height` + lazy/eager split,
    stored theme applied from an inline `<head>` script, remote font
    `@import` inside CSS, locale-aware case folding and escaping for
    search/filter code.
  - `SKILL.md` craft bar: one sentence each for the hover guard and for
    measured (not asserted) touch targets.
- Skill: color regime before hex. A third build of the same brief landed on
  `#F9F8F5` chalk + `#FFFFFF` cards (1.06 step) in light and a Tailwind
  slate/emerald/red set in dark. `typography-color-assets.md` gains "Regime
  before hex": sector → temperament → owned material, a five-regime table
  (cool technical, editorial/craft, clinical/corporate, kinetic/bold,
  brand-owned) with starting canvases, a ban on stock framework values,
  and a visible tone step (~1.08–1.15) between adjacent surfaces. `SKILL.md`
  "Surface and light" now requires naming the regime and reserves warm
  paper for subjects that own it. Derived tokens (hairlines, shadows,
  hover/active) follow the regime as well: ink at low alpha, not slate
  under warm paper; hover moves toward paper in dark mode.
- README (EN/TR): CLI examples (`--yes`, `--dry-run`, `list`, `remove`),
  DESIGN / REFINE / REVIEW chat prompts, and per-host use (Cursor, Gemini
  CLI including `.agents/skills` when `.gemini/skills` is not listed,
  Claude Code, Codex, Copilot, Kiro, and the rest).

## 0.10.1 — 2026-09-21 (npx Windows bin)

`npx art-director-skills@0.10.0` on Windows never reached the installer.
npm's `libnpmexec` picks the **first** `package.json` `bin` key when every
alias points at the same file. That key was `art-director`, so `npx`
asked `cmd.exe` to run `art-director`, which is not this package and is
not on PATH (`'art-director' is not recognized as an internal or
external command`). Reproduced 2026-09-21 with Node 22 / npm 10.9.3.

The only bin is now `art-director-skills`. Skill documents are unchanged
except `metadata.version`. 0.10.0 stays on the registry but Windows `npx`
of that exact version still fails; pin `@0.10.1` or omit the version so
npm takes latest.

## 0.10.0 — 2026-09-21 (CLI security fix; skill content unchanged)

Fixes three defects in the published `art-director-skills@0.9.1` CLI. The
design skill (`skills/art-director/`) is byte-identical to 0.9.1 except
`metadata.version` in `SKILL.md`; 0.9.1 skill tree sha256
`5c93ba25ba86df96aaf25a81bc48ae2b96e684bf44d10524b0b236e7de4564d1` (65 files).

- **Retire the single-file mode.** `npx art-director-skills` with no
  arguments wrote `./SKILL.md`; `--cursor` wrote `./.cursorrules`;
  `--claude` wrote `./CLAUDE.md`. They overwrote an existing file after a
  notice and wrote through a symbolic link at that path (reproduced against
  the 0.9.1 tarball: a linked `.cursorrules` changed its outside target).
  No arguments now prints usage; the two flags stop with a message pointing
  at `install --ai <id>`; nothing is written. The moving-`main` link rewrite
  is gone with it. Migration: `docs/migration.md`.
- **Refuse links everywhere a mutation happens.** 0.9.1's `remove` and
  `install --force` recursed into a target that was a symbolic link or
  junction and deleted the files inside the link's destination (reproduced:
  `remove --ai kiro` through a junction deleted the outside sentinels and
  printed `removed`). The installer now canonicalises the chosen root only,
  checks the target lies below it by path components, `lstat`s every
  component below the root and every entry inside an existing target, and
  refuses symbolic links, junctions, and dangling links before any write or
  delete. `--force` does not bypass it. Source trees with links are refused
  too. Protected locations (root, home, temp, filesystem root, package
  source, a folder not named `art-director`) are never replace/remove
  targets.
- **Stage, verify, swap, keep a backup.** Install copies into
  `.art-director.staging-<pid>-<rand>` beside the target
  (`COPYFILE_EXCL`), verifies the SHA256 inventory against the source,
  re-checks the target, renames the old folder to `art-director.bak-<time>`,
  renames staging into place, verifies again; a failed rename restores the
  old folder. Identical existing folder → `current` (no writes); differing
  → `conflict` (exit 2, kept) unless `--force`. `--dry-run` added.
- **Tests on the packaged CLI.** `tests/install-safety.mjs` (links at,
  above, and inside the target; dangling link; retired flags with a linked
  `.cursorrules`; simulated rename failure; authorised replace/remove
  touching only the target; overlap and boundary refusals — each asserting
  file hashes, not just exit codes) and `tests/packaged-cli.mjs` (`npm
  pack`, inventory vs source tree, offline install into a clean consumer
  project, the same scenarios through the packaged `bin/cli.js`, junction
  refusal, bin aliases via `npm exec`). CI requires symlink creation on
  both runners (`AD_REQUIRE_SYMLINKS=1`).
- Tarball now ships `CHANGELOG.md` and `docs/{installation,compatibility,
  migration,sources}.md` so README links resolve; eval links point at the
  `v0.10.0` tag. No dependencies, no install scripts.
- Versioning: the retired flags are a breaking CLI change, hence 0.10.0
  rather than a patch. 0.9.1 stays published; see the deprecation note in
  the release record below.

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
- Add a **craft bar** to SKILL.md and name the unconscious default as the
  failure. DESIGN now decides in order: tone in three words, type and
  surface/contrast regime, focal anchor and composition, then the rest
  (mirrored in design-method). The bar gives checkable starting values —
  heading/body tone contrast, negative tracking on large headings,
  body leading 1.5–1.65, `tabular-nums`; natural near-white or graphite
  grounds instead of raw white/black with hard shadows, hairline plus
  ambient depth, one scarce accent (80/15/5 as a check, not a rule); a
  focal anchor with unequal modules instead of the reflex three-card grid;
  states as combinations including active/pressed and loading/skeleton,
  150–200ms transitions with reduced motion; thumb reach, 44pt targets,
  platform-native press feedback, sheets and chips as options; wide
  screens not spent on gutters, sidebar and `Cmd/Ctrl+K` as answers to
  destination count. Nothing is banned or mandated; a stated reason passes.
  No new runtime dependency to reach the bar. Tests assert the bar and that
  sidebar / palette / scale stay conditional.
- Make the repo an installable npm package with a CLI: `package.json` is
  no longer `private`, carries `version` 0.9.1 (matches the skill),
  `type: module`, repository/license metadata, and `bin` entries
  `art-director`, `art-director-skills`, and the older `art-director-skill`,
  all pointing at the new `bin/cli.js` (mode `100755`). Single-file mode
  writes into the current directory: no args → `SKILL.md`, `--cursor` →
  `.cursorrules`, `--claude` → `CLAUDE.md` (frontmatter stripped for the
  last two, header comment pointing at the full install); relative
  `references/` links are rewritten to repository URLs so a lone file has
  no dead links; existing files are overwritten with a notice; missing
  source or unknown option exits 1. `install|remove|status|list` hand off
  to `tooling/install-skill.mjs` unchanged. Covered in `tests/run.mjs`
  (spawned CLI in a temp dir with Turkish letters). `npm pack` runs `validate-skill` and ships
  `bin/`, `skills/`, the installer, `LICENSE`, `README.md`. Verified from
  the packed tarball in a temp project on Windows (install / status /
  remove through all three bins). Not yet published; the registry `npx`
  form is untested until `npm publish`.
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

See [dated evidence](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/state-craft-0.9.1/REPORT.md).

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

See [dated evidence](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/craft-finish-0.9.0/REPORT.md) for the
fragment rewrite. Action contrast and photographer re-run:
[action-quality-0.9.0](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/action-quality-0.9.0/REPORT.md).

## 0.8.0 — 2026-09-20

- Run the hand-corrected Fold Playwright project in CI. Build and test
  both set `ART_DIRECTOR_SEEFIX=1`; missing env fails instead of skip-pass.
- Keep see-and-correct in the distributed skill. Move independent-host,
  authoring-chat, and IDE-trial how-to into maintainer eval docs.
- Freeze an isolated Cursor trial (photographer brief + one skill copy).
  Discovery and natural selection remain pending until a new Cursor chat
  runs that workspace.

See [dated evidence](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/ci-seefix-0.8.0/REPORT.md).

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

See [dated evidence](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/see-and-fix-2026-09-20/REPORT.md).
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

See [dated evidence](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/native-craft-2026-09-19/REPORT.md) for
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
