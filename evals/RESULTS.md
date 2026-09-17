# Eval results

This file records runs that actually happened. Missing hosts are listed as
not run. No screenshots or transcripts are fabricated. Screenshots were
inspected in the authoring tools; they are not stored in this repository.

Historical **v0.1.0** rows below are copied from the first public release
record. They are not re-labeled as v0.2.0 DESIGN evidence.

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
  subagents.
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
| 01-creative-studio | Isolated subagent. Installation-first poster: Palatino “Sodium Vault” on near-black, gold rail, metadata column. Hierarchy **pass**. Proof object **missing**. Author inspected desktop+mobile PNGs. | Isolated subagent. Same hierarchy plus a labeled **section diagram** of hanging sodium lamps (caption: not a photograph). Mobile stacks title then diagram. **Invented workshop dates** (3 / 31 October) — Gate A content miss; skill text was tightened after this. Desktop lede clipped in 1440×900. |
| 02-dev-portfolio | Isolated subagent. Memoir-first paper page, tools as a flat list, `Kılıç` intact. Author inspected. | Isolated subagent. Memoir title with designed line breaks; tools **grouped by problem** (inspection / maps / spreadsheets). Still paper/serif, but not the same object as 01. |
| 03-dashboard | Isolated subagent. Working dispatch board: overdue words, berth chips, mobile row cards, `board.js`. Author inspected. | Isolated subagent. Still a board, not a landing: radio berth list, selected row, overdue flags. Craft similar in kind to the old arm; not a night-and-day win. |

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

**01 new isolated — Gate A** fail on invented dates; CSS loaded. **Gate B**
finished composition 2 (diagram is the vault); still a dark field (justified
as sodium night, not a second SaaS kit by itself); mobile caption clips
“SODI…”.

**02 new — Gate A** pass (`Kılıç`, memoir route). **Gate B** type craft 2
relative to the old arm’s flatter title.

**03** both arms: Gate A overdue-without-color-alone pass. Gate B context
fit 2. Distinctiveness vs a landing page 2. Old vs new craft delta is
small.

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
