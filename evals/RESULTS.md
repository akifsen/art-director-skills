# Eval results

This file records runs that actually happened. Missing hosts are listed as
not run. No screenshots or transcripts are fabricated. Screenshots were
inspected in the authoring tools; they are not stored in this repository.

Historical **v0.1.0**, **v0.2.0**, **v0.3.0**, and **v0.4.0** rows below stay
as written. They are not re-labeled as later evidence.

---

## This session — 2026-09-17 (reliability branch `fix/ci-vite-save-dialog`)

- Workspace: `C:\Users\akifsen\devel_ext\art-director-skills`
- Host: Cursor agent (Cursor Grok 4.6)
- Published pin at start of the reliability work: tag `v0.4.0` /
  `21c2fe1e0e109cf28fc9bd1e3fc01cd94cefedd6`
- Candidate skill: git `f2a1bc2d481ea398c617e93298a8e7947f5ac6ef` then a
  follow-up “do not copy example source files” line (retry arm)
- Skill metadata still **0.4.0** (no public tag)
- Maintainer Node: v22.20.0 (not a skill runtime)
- Repeats: n = 1. Author not blind. No A/B of rendered pixels.
- Isolated DESIGN: same brief/start, no parent quality brief in the agent
  prompt. Model: same family as this host (inherit).

### Tutorial apps (not host-agent proof)

Kiln Queue and Nadir Desk compile and run through Vite production preview in
GitHub Actions Ubuntu (`examples-web` success on `f2a1bc2`, run
[35221451042](https://github.com/akifsen/art-director-skills/actions/runs/35221451042)).
Save/Cancel, padding vs backdrop, Tab cycle, unknown routes: **run-verified**
there. Author did not inspect new PNGs in this pass (local Vite native bins
fail in the agent sandbox). Native Closeout: store tests only; device
**pending**.

### Isolated holdout — case 12 Lumen Cart

Workdirs (gitignored): `%TEMP%\ad-eval-v040-12` and `%TEMP%\ad-eval-cand-12`.
Agents: [Lumen Cart DESIGN v0.4.0](2ae2cc9d-19df-4ee8-b123-1ac43786ab13),
[Lumen Cart DESIGN candidate](f7962e21-7e72-4453-8672-480fc532ae28).
Parent author read the source trees. Both arms now have `RUN.md`. Parent did
**not** inspect either arm’s screenshots.

| Arm | Routing | Named-record save | Overlay | Visual notes |
|---|---|---|---|---|
| v0.4.0 snapshot `21c2fe1` | History API `/stops/:id/log` — **not** hash, **not** `?fixture=` | `applyLog` updates that id; 280ms `setTimeout` **does not abort** on Cancel (source still) | `<dialog showModal()>` | Circuit SVG + cloth rail. Isolated agent: Yarn build; preview `127.0.0.1:4174`; Chrome list/detail/log/unknown ~1440 and list ~390; CDP complete 12 min on LC-04. Skip UI not CDP’d |
| Candidate `f2a1bc2` | History API `/stops/:id/complete` and `/skip` | `applyComplete` / `applySkip` bind the named stop; already-recorded guard | same primitive + **verbatim** Kiln `dialog-geometry.js` | Enamel-teal mast. Isolated agent: Yarn build; preview `127.0.0.1:4173`; Chrome list/detail/forms/empty/unknown/dialog ~1280 and ~390. Preview later killed |

Both arms: `npm install` failed (`Yallist is not a constructor`); Yarn 1.22.22 built.

**Gates (not averaged):**

- **A.** Both kept the three LC ids and honest session copy. Candidate: complete/skip validation + already-recorded; isolated agent ran complete and skip on preview. Baseline: isolated agent ran complete + empty filter + LC-99; Cancel during the 280ms write can still commit — Gate A miss in source.
- **B.** Distinct from kiln cream/oxide in both token sheets. Baseline circuit diagram is more product-specific. Candidate cloned the tutorial helper file. Each isolated agent inspected its own screens; no matched A/B; parent not blind. No pixel winner.
- **C.** Both have list, detail, form, empty filter, unknown id/path. Candidate splits complete vs skip routes. Baseline combines them on `/log` (skip not exercised in the live CDP pass).
- **D.** Native `<dialog>` on both. Candidate Tab helper in source, not keyboard-exercised. Both agents saw ~390 list wrap.

**Weak result kept:** candidate listed `src/dialog-geometry.js` as created after opening the Kiln example file. Skill text was tightened (example files are not a kit). Retry: [Lumen Cart DESIGN retry](a0c79a82-f4b8-40e1-91a5-d9e2a524cf14) in `%TEMP%\ad-eval-cand-12b` — `src/session-log.js` present, no `dialog-geometry.js` under `src/`, `RUN.md` not yet written.

**Does the new skill better guide independent briefs?** Routing/`?fixture=` clone did **not** recur on either arm. Named-record complete/skip and abortable save are stronger in the candidate **source** (baseline still has the late-write race). Visual superiority vs v0.4.0 is **not** shown (separate agents, unmatched viewports, parent did not see the PNGs). File-level example cloning remained on the first candidate arm.

Cases 09 (shadcn-*pattern*, not shadcn source) and 11 (native): **not re-run**
as isolated hosts this session. Case 09 is not evidence of real shadcn/ui.

### Publish

No public tag. Branch `fix/ci-vite-save-dialog`. `gh` / GitKraken PR create
did not complete (CLI missing; GitKraken sign-in). Compare:
https://github.com/akifsen/art-director-skills/compare/main...fix/ci-vite-save-dialog

---


## This session — 2026-09-17 (v0.4.0 working tree)

- Workspace: `C:\Users\akifsen\devel_ext\art-director-skills`
- Host: Cursor agent (Cursor Grok 4.6)
- Baseline pin: tag `v0.3.0` / HEAD at start `b1ad5f7475d3189e3971ca6350c35b9d3d2161d1`
- New skill metadata: **0.4.0**
- Maintainer Node: v22.20.0 (not a skill runtime)
- Repeats: n = 1. Author not blind.

`SKILL.md` this session: **226 lines**, description **778** characters.

### Finding re-check (v0.3.0 tree, then fixed)

| Finding | Class |
|---|---|
| Closeout `save()` opened a sheet and did not write the note | **Reproduced**, then fixed (`session-store.js` + `onSave`) |
| Nadir `save()` closed the dialog without per-row notes | **Reproduced**, then fixed (`notes-store.js`) |
| Web dialogs were `div` + `aria-modal` without trap/inert | **Reproduced**, then fixed (`<dialog showModal()>`) |
| Kiln `loading` started false and was unreachable | **Reproduced**, then fixed (boot loading + `?fixture=`) |
| Unknown `#/loads/:id/hold` could render nothing | **Reproduced**, then fixed (explicit unknown states) |
| `accessibilityAnnounceForAccessibility` as a view prop | **Reproduced** in v0.3.0 `native-mobile.md`, then rewritten to `AccessibilityInfo.announceForAccessibility` (https://reactnative.dev/docs/accessibilityinfo, 2026-09-17) |

### Layer A — structure

`node tests/run.mjs` passed (structure, store behavior, JSX compile).
PowerShell copy into `art-yönetmen kopya\art-director` still includes
`kiln-store.js`. `node tooling/pack-skill.mjs` wrote
`dist/art-director-skill.zip`.

### Tutorial apps (not host-agent proof)

Kiln Queue and Nadir Desk were compiled from the skill JSX (JS-only
transform; Vite `npm install` failed in this agent sandbox because optional
esbuild/rollup native binaries were rolled back) and run in Chrome 1440 via
CDP (`node evals/apps/chrome-flow.mjs`):

- Kiln: empty/loading fixtures, unknown id/route, hold save onto K-214,
  empty-reason does not open a success dialog, dialog Tab stays on the
  single action, Escape returns to detail
- Nadir: note binds to N-441, cancel on N-442 does not commit, return to
  N-441 still shows the first note

Author inspected PNGs of kiln list/hold/unknown and nadir list/dialog
(1440×900). Native Closeout: store tests run-verified; device/simulator
**pending** (`adb`/`emulator`/`expo` not on PATH). Expo web not used.

### Isolated host eval (case 08 Tide Bindery)

Holdout brief is independent of Kiln/Nadir/Closeout. Workdir
`%TEMP%\ad-eval-v040-08` with a copied `art-director` skill **0.4.0**.
Subagent [Tide Bindery DESIGN](4c60bb4c-b677-4ec8-b7b3-b599d558224e)
received only that workdir + skill path (no parent quality brief).

Observed in the TEMP tree (author read the files; did not run Vite):

- New `src/ticket-store.js` + `src/ui.jsx`; `App.jsx` list/detail/hold
- `Save hold` calls `applyHold` onto `activeId`; other tickets left alone
- Dialog uses `<dialog showModal()>`
- Visual tokens are flax/cloth/Literata (`--tb-*`), not Kiln oxide or Nadir navy
- `npm install` failed (`Yallist is not a constructor`); **no browser run**
- Structure of routes/fixtures closely follows the skill’s Kiln Queue *method*
  (same `?fixture=` and hash-route shape). That is transferable procedure, not
  a second kiln look — and it is a remaining risk that examples become a
  skeleton to clone.

v0.3.0 isolated 08 also had React source and a failed `npm install`. This
arm is stronger on **named-record save and a real dialog primitive in
source**. It is **not** proof of a prettier running UI. n=1, author not
blind, no A/B.

Cases 09/11 and 01–07: **not re-run** this session.

---

## This session — 2026-09-17 (v0.3.0 working tree)

- Workspace: `C:\Users\akifsen\devel_ext\art-director-skills`
- Host: Cursor agent (Cursor Grok 4.6)
- Baseline pin: tag `v0.2.0` / HEAD at start `f2cee08432ac29c64c06eb5a0b7025d860e3df47`
  (`v0.2.0-3-gf2cee08`). Skill metadata then **0.2.0**. Snapshot:
  `evals/runs/snapshots/v0.2.0/` (gitignored). That tree has no
  `native-mobile.md` or `product-ui-system.md`.
- New skill metadata: **0.3.0**
- Maintainer Node: v22.20.0 (not a skill runtime)
- Repeats: n = 1. Author not blind. Model/skill versions as above.
- Isolated DESIGN arm for case 08: workdir
  `%TEMP%\ad-eval-v030-iso\08`. Subagent [Tide Bindery DESIGN](53272c12-92ab-4df1-bd55-6416d9b25541)
  was given only the skill path + that workdir (no parent “improve the
  skill” prompt).

`SKILL.md` this session: **222 lines**, description **778** characters.

### Layer A — structure

`node tests/run.mjs` passed after the v0.3.0 edits:

- Frontmatter 0.3.0; portable links; new refs + examples required
- Native DESIGN fixture heuristic (not host invocation)
- PowerShell copy into `art-yönetmen kopya\art-director` including examples
- `node tooling/pack-skill.mjs` → `dist/art-director-skill.zip` (43 entries)
  including `references/native-mobile.md` and
  `references/examples/themeless-react/App.jsx`

### Layer B — fixture heuristic

Prior seven prompts plus native app, themeless product, shadcn desk.
Keyword classifier matched. Still **not** a Cursor/Codex selection log.

### Layer C — product evals (08–11)

Matching conditions vs v0.2.0: same model family, clean workdirs, no
master-prompt leak into the isolated 08 arm. v0.2.0 snapshot cannot load
the new guides (files absent).

| Case | What ran | Gate notes (author, not blind) |
|---|---|---|
| **08 Tide Bindery** (holdout) | Isolated subagent implemented React source: `tokens.css`, `ui.jsx`, `App.jsx`, scope matrix in `.art-director/design-notes.md`. Tickets B-19/B-12/B-07 kept. Cloth/vellum identity, not Kiln oxide. `npm install` in that workdir **failed** (sandbox/native optional binaries), so Vite **not run-verified**. Isolated `RUN.md` not present at RESULTS write. | A implemented, run **pending**. B visually unread in Chrome (no bundle). C source has list/detail/hold. D web keyboard **pending**. |
| **Kiln Queue example** | Skill JSX + CSS. Vanilla harness using the **same** `tokens.css` (not a substitute for Vite). Chrome 1440 and ~390: list, empty filter (`zzz`), detail K-214, hold form. Author inspected PNGs. | A CSS loaded in the harness. B oxide/steel queue, not a marketing home. C empty state + three screens **visually inspected**. Form validation click **not** in the PNG set (form screen shown empty). Vite compile **pending** (npm reify failed here too). |
| **09 Plica** | Author token/variant CSS pass in a gitignored work copy: oxblood/ivory/sidebar, not only `--primary`. Dialog JS unchanged. Vite **not run**. | A behavior **implemented** in start (preserved in CSS-only pass). B **not** run-verified in the React app. |
| **10 Sable Ledger** (not Ecme) | Author `theme.css` + settings grouping. Chrome A/B 1440: teal/Arial start vs iron/cream ledger; settings follows the shell. ~390 list captured. Filter JS not re-clicked in headless. | A CSS loads (inspected). B concrete delta vs start (sidebar, paper, type). C settings in the same language. D narrow viewport visually inspected. **Not Ecme.** |
| **11 Railbag** | Author RN `App.js` in a work copy: SafeAreaProvider, KeyboardAvoidingView, sheet Modal, `accessibilityRole`/`Label`. `adb`/`emulator`/`expo` **not on PATH**. | A–C **implemented** in source. D device **pending**. Not passed via Expo web. |

Cases **01–07**: **not re-run** this session. Historical v0.2.0 clipping,
invented dates, and dashboard-delta notes stay historical.

### Evidence kinds

- **Implemented:** skill 0.3.0 tree, examples, eval starts 08–11, isolated 08 React source, author 09 CSS / 10 theme / 11 RN source
- **Run-verified:** structure tests; pack zip; Chrome file:// of Kiln harness and Sable A/B
- **Visually inspected:** those PNGs (author). Isolated 08 React UI: not inspected (no bundle)

### Native / licensed template

- Flutter, SwiftUI, Compose: **not tested**
- Ecme: **not used**; case 10 is an original fixture
- iOS/Android simulator: **pending**

### Publish

Git tag `v0.3.0` only after the commit that lands these files. `gh` may
still be missing. Do not treat this RESULTS file as a release.

---

## Historical — skill v0.1.0 (authoring of first public release)

- Date: 2026-09-17
- Workspace then: `C:\Users\lenovo\devel\art-director-skills`
- Host: Cursor agent (Cursor Grok 4.6) applying skill text from
  `skills/art-director/`
- Skill git commit: `e1e59710fb842c2dd20b185c9695186cd8693119` (`v0.1.0`)
- Repeats: none (n = 1)
- Full DESIGN cases 01–04: **not run** in that session
- Without-skill arm: **not run**
- Ran: 05-branded-section (scoped), 06-mobile-nav (REFINE), 01 as REVIEW
  (source only)

See the v0.1.0 table in git history if you need the original wording. Do
not treat those scoped jobs as full-page craft proof.

---

## This session — 2026-09-17 (v0.2.0 working tree)

- Workspace: `C:\Users\akifsen\devel_ext\art-director-skills`
- Host: Cursor agent (Cursor Grok 4.6)
- Baseline pin: tag `v0.1.0` / commit `e1e59710fb842c2dd20b185c9695186cd8693119`
  copied to `evals/runs/snapshots/v0.1.0/` (gitignored)
- New skill: `f391b1a45d12a34bff794ac33502b121341c4ddd` metadata **0.2.0**
- Maintainer Node: v22.20.0 (not a skill runtime)
- Isolated work: `%TEMP%\ad-eval-v010` (old skill) and `%TEMP%\ad-eval-v020`
  (new skill). Parent “improve the skill” prompt was not given to those
  subagents. Cases 01, 02, and 03 new arms later wrote `RUN.md`.
- Visual inspection: author looked at Chrome headless PNGs at ~1440×900 and
  ~390×844. Not blind. n = 1 per arm. Not a generalization.

`SKILL.md` this session: **~248–251 lines**, description 627 characters
(under 1024). Body is over the 5000-token *guidance* if a host counts
loosely; it is under the 500-line spec cap. Detail lives in references.

### Layer A — structure

`node tests/run.mjs` passed after the v0.2.0 edits:

- Frontmatter, portable links, studies present
- PowerShell copy into `art-yönetmen kopya\art-director`
- Fixture keyword heuristic (renamed; **not** host invocation)
- Case `07-missing-css` present
- `node tooling/pack-skill.mjs` produced `dist/art-director-skill.zip`
  including `references/studies/*`

### Layer B — fixture heuristic

Same seven prompts as v0.1.0. Keyword classifier matched. This is still
**not** a Cursor/Codex selection log.

### Layer C — DESIGN comparison (01, 02, 03)

Matching conditions: same model family (Cursor Grok 4.6), same briefs and
start files, Chrome available, isolated workdirs. Old arm loaded **only**
the v0.1.0 snapshot directory. New arm loaded **only**
`skills/art-director/` (v0.2.0 tree). Natural IDE discovery was **not**
tested (skill text was handed to subagents).

| Case | Old skill (v0.1.0 snapshot) | New skill (v0.2.0 tree) |
|---|---|---|
| 01-creative-studio | Isolated subagent. Installation-first poster: Palatino “Sodium Vault” on near-black, gold rail, metadata column. Hierarchy **pass**. Proof object **missing**. Author inspected desktop+mobile PNGs. | Isolated subagent **completed with `RUN.md`**. Installation-as-stage plus captioned sodium-lamp **section diagram**. Live web not seen; Kiln Rest study used (method only). Load check: computed `h1` Bahnschrift 75% stretch, body Segoe UI. First shot had CTA off-fold / caption on drawing; those were fixed. **Invented workshop dates** (3 / 31 October) admitted in `RUN.md` — Gate A miss; skill text was tightened after this. |
| 02-dev-portfolio | Isolated subagent. Memoir-first paper page, tools as a flat list, `Kılıç` intact. Author inspected. | Isolated subagent **completed with `RUN.md`**. Memoir title as a two-line Palatino lockup; tools grouped by problem. Live web research **not claimed** (studies fallback). Load check: `styles.css` `cssRules.length` 34; computed face Palatino Linotype; canvas `#efe9dc`. `--headless=new` 390 crop was a tooling miss; device-metrics recapture used. |
| 03-dashboard | Isolated subagent. Working dispatch board: overdue words, berth chips, mobile row cards, `board.js`. Author inspected. | Isolated subagent **completed with `RUN.md`**. Still a board, not a landing: enamel chrome, berth radios, overdue as word + docket + left rule. CSS load checked via screenshot pixels (`#1C241F`). No live research. Craft similar in kind to the old arm; not a night-and-day win. Headless `100vh` left a canvas strip in the 1440 PNG (capture quirk). |

**Same-session demo (not isolated):** `%TEMP%\ad-eval-v020-demo\01-creative-studio`
was designed in the parent session after seeing the v0.1.0 poster. Concrete
canvas + Unit B plan. Labeled **demo**. First mobile pass clipped the nav
and said “on the right”; one polish pass fixed that. Used to revise
`responsive-interaction.md`.

**Cross-brief signal (eval set only, names/accents stripped):** 01 is a
spatial stage, 02 is a reading column + index, 03 is a filter+table. They
did not collapse to one section recipe. Structural similarity of 03 old vs
new is expected (same task).

Without-skill arm: **not run**. Do not generalize.

### Gate notes (author, not blind)

**01 old — Gate A** pass (CSS loaded, facts present, unknown seats honest).
**Gate B** hierarchy 2; finished composition 1 (poster without a stage);
assets 0 (no diagram/photo); reference-justified 0 (no research pass in
v0.1.0 skill).

**01 new isolated — Gate A** fail on invented dates (agent stated the
brief asked for dated Saturdays, so days were supplied). CSS and faces
loaded. **Gate B** finished composition 2 (diagram is the vault); still a
dark field (justified as sodium night); first visual pass needed a polish
for fold/caption.

**02 new — Gate A** pass (`Kılıç`, memoir route, stylesheet actually
loaded). **Gate B** type craft 2 relative to the old arm’s flatter title;
reference axis is studies-fallback, not a live site pass.

**03** both arms: Gate A overdue-without-color-alone pass; new arm also
logged a pixel load check (`#1C241F` enamel, not unstyled white). Gate B
context fit 2. Distinctiveness vs a landing page 2. Old vs new craft delta
is small.

### 07-missing-css (REVIEW)

Author REVIEW, read-only, Chrome 1440×900: `brand.css` missing; page renders
as default HTML (blue link, bullets). `unused.css` not applied. Visual
craft of unused.css **not scored**. This is the load-failure check the
v0.1.0 evals did not have.

### Regression fixtures 04, 05, 06

**Not re-run** in this session. Expected files now include Gate A/B notes.
Do not claim brand/mobile REFINE still pass until those arms run.

### Client discovery

| Check | Result |
|---|---|
| Cursor listed `/art-director` from this repo in Customize | **not tested** |
| Cursor implicit select | **not tested** |
| Codex `$art-director` | **not tested** |
| Isolated `npx skills add` (v0.1.0 session) | passed then; **not re-run** here |
| GitHub install from the public repo | **not re-run** this session |

### Old product

No files in `art-director-mcp` were modified. npm dist-tags were not changed.

### Publish

`gh` was not on PATH on this machine. Git tag `v0.2.0` should be created
from the commit that lands these files. Do not treat this RESULTS file as
a release.
