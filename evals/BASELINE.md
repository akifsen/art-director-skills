# Baseline — skill v0.1.0 (2026-09-17)

This is a diagnosis of the published skill at commit
`e1e59710fb842c2dd20b185c9695186cd8693119` (tag `v0.1.0`). It is not a
scorecard of any customer site. Historical evals below are quoted as they
were recorded; they are not re-run results.

A file snapshot of the skill tree used for comparison arms lives at
`evals/runs/snapshots/v0.1.0/` (gitignored working copy). The durable pin
is the git tag, not that folder.

## What was actually on disk

- Workspace: `C:\Users\akifsen\devel_ext\art-director-skills`
- Branch: `main`, clean, tracking `origin/main`
- Remote: `https://github.com/akifsen/art-director-skills.git`
- Installed user copies: none found under `~/.cursor/skills`,
  `~/.agents/skills`, or `~/.codex/skills` on this machine
- `gh` CLI: not on PATH (release step may be blocked later)

## Structural vs subjective (keep separate)

### Structural gaps in v0.1.0 (observable in the files)

- `SKILL.md` is strong on scope, mode, stack fidelity, and honest reporting.
  Positive craft guidance for a *finished* interface is thin: thesis +
  hierarchy + “decide each axis,” then implement. Agents can satisfy the
  letter of that workflow with a tidy skeleton.
- `references/design-method.md` and `content-and-composition.md` examples
  repeatedly resolve “unlike offerings” / “portfolio” into *one featured
  artifact + a secondary list*. That is often right, and it is also a
  structural habit that different briefs can collapse into.
- `references/typography-color-assets.md` says reuse loaded fonts. It does
  not distinguish a real brand system from starter/default stacks
  (`system-ui`, Arial, Impact) or empty gray boxes.
- `references/responsive-interaction.md` treats motion mainly as a list of
  restrictions. It does not teach a controlled, meaningful motion pass.
- `docs/sources.md` lists skill/IDE/install sources, not observed interface
  studies.
- `tests/run.mjs` `classify()` is a local regex over fixture prompts. It
  does not prove a host model selected or followed the skill.
- `evals/RESULTS.md` (v0.1.0 session) records cases **01–04 DESIGN as not
  run**, without-skill arm **not run**. Cases 05 and 06 were small scoped
  jobs. Case 01 REVIEW was source-only. Those records are not evidence of
  full-page visual quality.
- Expected files check scope and content fidelity, not finished craft
  (type hierarchy, surfaces, asset integration, component states).

### User-reported visual quality (subjective, not a file proof)

When the skill is used, sites can look alike: sparse, unfinished, almost
unstyled HTML. Users want senior UI/UX decisions against current visual
references, not only a correct palette. This complaint is the product
target. It is not automatically caused by every weak screenshot — broken
CSS imports, unloaded fonts, missing assets, or a stale installed copy
can produce the same feeling and must be tested separately.

## What v0.1.0 already got right (do not throw away)

DESIGN / REFINE / REVIEW split; keep real copy and routes; REVIEW
read-only; no theme pack or MCP runtime; on-demand references; honest
“visual verification not done”; Windows copy path; isolated eval fixtures.

## Eval pin for comparison arms

| Field | Value |
|---|---|
| Skill version | 0.1.0 |
| Git | `e1e59710fb842c2dd20b185c9695186cd8693119` / `v0.1.0` |
| Host for later arms | Cursor agent, isolated workdirs under `%TEMP%\ad-eval-v010` |
| Matching conditions | same brief, start files, tools, no parent “improve the skill” prompt |

Full DESIGN cases 01–03 were **not run in the original RESULTS.md**. Any
v0.1.0 DESIGN output produced after this baseline is a new arm, labeled
with this snapshot hash, not a rewrite of the 0.1.0 RESULTS table.
