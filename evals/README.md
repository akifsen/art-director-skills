# Eval method

The [native craft and normal-brief run](evidence/native-craft-2026-09-19/REPORT.md)
starts from 0.5.0, preserves same-device before/after evidence and distinguishes
an unsuccessful Cursor input attempt from explicit-path independent fallback.

The [2026-09-19 quality run](evidence/2026-09-19/REPORT.md) preserves independent baseline/candidate outputs, weak results, inspected renders, native device evidence and explicit scope limits. Reproduction uses the existing Vite/Playwright path with `ART_DIRECTOR_EVAL=1`.

Evals here follow the pattern in
https://agentskills.io/skill-creation/evaluating-skills and
https://developers.openai.com/blog/eval-skills: a prompt, a captured run,
a small set of checks, and a score you can compare. They are not a quality
guarantee. One run is a first signal, not a generalization.

## Layers

1. **Structure** — `npm test` in this repo (frontmatter, links, portable
   paths, skill self-containment, studies copied). No host model required.
2. **Fixture heuristic** — prompts in `tests/fixtures/triggers.json`. These
   check that SKILL.md still encodes the documented mode words. They are
   **not** a Cursor or Codex invocation log and not proof the host selected
   the skill.
3. **Outcome** — cases under `evals/cases/`. Copy a case into an isolated
   work directory. Do not edit customer sites. Do not commit screenshots or
   run logs.

Pin the previous skill with git (`v0.1.0`) or a copied snapshot under
`evals/runs/snapshots/` (gitignored). Do not load new reference files into
an old-skill arm.

## Cases

| Id | Kind | Default mode |
|---|---|---|
| `01-creative-studio` | Several unlike offerings | DESIGN |
| `02-dev-portfolio` | Personal developer site | DESIGN |
| `03-dashboard` | Data-dense ops UI | DESIGN |
| `04-publication` | Long-form reading | DESIGN |
| `05-branded-section` | Strong existing brand, new section | REFINE / DESIGN of one route |
| `06-mobile-nav` | Navigation only (website menu) | REFINE |
| `07-missing-css` | Stylesheet 404 | REVIEW |
| `08-themeless-react` | Starter React product UI (holdout) | DESIGN |
| `09-component-system` | Local primitives (original fixture) | DESIGN |
| `10-template-adapt` | Original admin template | DESIGN |
| `11-native-expo` | React Native / Expo list-detail-edit | DESIGN |
| `12-holdout-lumen-cart` | Bookmobile stop log (holdout, not Kiln/Tide) | DESIGN |

Each case has a `brief.md`, a `start/` tree, and `expected.md` (scope plus
gates, not a pixel template).

Primary comparison after v0.4.0: case **12 Lumen Cart** (holdout, not the
Kiln Queue or Tide Bindery tutorials), plus 08/09/11 as needed. Tutorial
example quality is recorded separately from host-agent output. Do not treat
a prettier Kiln Queue as proof that an independent brief improved.

## Rubric (subjective, four gates)

See [rubric.md](rubric.md). Gates A–D stay separate. Do not average them
into a fake overall quality percent. Historical RESULTS rows that used two
gates are not rewritten.

## With vs without / old vs new

Use the **same** model, brief, starting files, and tool access. Isolate
from the parent "improve this skill" prompt. Record the skill path and
commit. If you cannot run an arm, say so — do not backfill.

Natural IDE discovery and "here is the skill text" are different tests;
label which one you ran.

## How to run a case

```powershell
$work = Join-Path $env:TEMP ("art-director-eval-" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Force $work | Out-Null
Copy-Item -Recurse evals\cases\06-mobile-nav\start\* $work
Copy-Item evals\cases\06-mobile-nav\brief.md $work
# Point the host at $work. Do not install globally.
# Attach art-director explicitly. Record model, skill commit, files read.
```

Optional headless screenshot (Chrome on this authoring machine) after the
agent finishes:

```powershell
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$html = (Resolve-Path "$work\index.html").Path
$uri = ([Uri]$html).AbsoluteUri
$png = "$work\desktop.png" -replace '\\','/'
& $chrome --headless=new --allow-file-access-from-files --window-size=1440,900 "--screenshot=$png" $uri
```

Record in `evals/runs/` (gitignored):

- Date, host, model name/version if known
- Skill git commit and the real directory that was loaded
- Which skill files were loaded
- Mode the agent chose
- Files changed (or none, for REVIEW)
- Browser/visual inspection: done / not done / unavailable; who looked
- Rubric notes for Gates A–D
- Evidence kind: implemented / run-verified / visually inspected

## What we actually ran

See [RESULTS.md](RESULTS.md), [BASELINE.md](BASELINE.md), and
[BASELINE-0.2.0.md](BASELINE-0.2.0.md). Unrun hosts are listed as unrun.
Do not backfill transcripts or screenshots. Do not rewrite v0.1.0 or
v0.2.0 rows as if they were later DESIGN runs.
