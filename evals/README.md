# Eval method

Evals here follow the pattern in
https://developers.openai.com/blog/eval-skills: a prompt, a captured run,
a small set of checks, and a score you can compare. They are not a quality
guarantee.

## Layers

1. **Structure** — `npm test` in this repo (frontmatter, links, portable
   paths, skill self-containment). No host model required.
2. **Trigger / scope** — prompts in `tests/fixtures/triggers.json`. These
   check that SKILL.md encodes the documented mode rules. They are not a
   Cursor or Codex invocation log.
3. **Outcome** — cases under `evals/cases/`. Copy a case into an isolated
   work directory. Do not edit customer sites. Do not commit screenshots or
   run logs.

## Cases

| Id | Kind | Default mode |
|---|---|---|
| `01-creative-studio` | Several unlike offerings | DESIGN |
| `02-dev-portfolio` | Personal developer site | DESIGN |
| `03-dashboard` | Data-dense ops UI | DESIGN |
| `04-publication` | Long-form reading | DESIGN |
| `05-branded-section` | Strong existing brand, new section | REFINE / DESIGN of one route |
| `06-mobile-nav` | Navigation only | REFINE |

Each case has a `brief.md`, a `start/` tree, and `expected.md` (scope, not
a pixel template).

## Rubric (subjective, scored separately)

Score 0–2 on each axis. Do not average them into a fake overall quality
percent. See [rubric.md](rubric.md).

- Visual hierarchy
- Context fit
- Distinctiveness
- Content fidelity
- Small-screen task usability
- Existing-brand consistency (especially case 05 and 06)

Technical checks (overflow, lint, automated a11y) are recorded on another
line. They do not prove better design.

## With vs without the skill

Use the **same** model, brief, starting files, and tool access. Run once
without attaching this skill, once with `$art-director` / `/art-director`.
Compare with the rubric. One successful with-skill run is not a general
result. If you cannot run the without-skill arm, say so.

## How to run a case

```powershell
$work = Join-Path $env:TEMP ("art-director-eval-" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Force $work | Out-Null
Copy-Item -Recurse evals\cases\06-mobile-nav\start\* $work
Copy-Item evals\cases\06-mobile-nav\brief.md $work
# Point the host at $work. Do not install globally.
# Attach art-director explicitly. Record model, skill commit, files read.
```

Record in `evals/runs/` (gitignored):

- Date, host, model name/version if known
- Skill git commit
- Which skill files were loaded
- Mode the agent chose
- Files changed (or none, for REVIEW)
- Browser/visual inspection: done / not done / unavailable
- Rubric notes

## What we actually ran

See [RESULTS.md](RESULTS.md). Unrun hosts are listed as unrun. Do not
backfill transcripts or screenshots.
