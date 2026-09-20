# Compatibility

Statuses are separate. A later status is not implied by an earlier one.

| Status | Meaning |
|---|---|
| **Structure verified** | `SKILL.md` frontmatter, names, and relative files pass repo tests |
| **Install tested** | Files were copied or installed into an isolated directory |
| **Client discovered** | The IDE listed or attached the skill in a real session |
| **Used on a task** | A host agent followed the skill on an actual request |

Config files or copied folders alone are not a client-discovery test.
Client discovery is not a task-use test.

## Agent Skills file format

Checked against https://agentskills.io/specification (retrieved 2026-09-17):

- Directory named `art-director` containing `SKILL.md`
- YAML frontmatter with `name` and `description`
- `name` matches the directory, lowercase hyphenated
- Optional `references/` and `assets/`
- Relative links from `SKILL.md` are one level deep

## Cursor

Sources: https://cursor.com/docs/skills.md (retrieved 2026-09-20).

Discovery trees include `.agents/skills/`, `.cursor/skills/`,
`~/.agents/skills/`, `~/.cursor/skills/`, plus Claude/Codex-compatible
paths. Nested `SKILL.md` files are found recursively.

Invocation:

- Explicit: `/art-director` in Agent chat (attaches to one message; Custom
  Mode can keep it on)
- Implicit: the agent may select the skill from `name` + `description`

`disable-model-invocation` is **not** set, so implicit selection is allowed.
Whether a given Cursor build actually selects it for a prompt is a
**client discovered / used on a task** result, not a file-format result.

The Vercel `skills` CLI maps `--agent cursor` to project `.agents/skills/`
and global `~/.cursor/skills/` (CLI README, retrieved 2026-09-17). Cursor
itself also reads `.cursor/skills/`. Installing into both for one project
can duplicate the skill; pick one.

Cloud Agents sync only `~/.cursor/skills/` when that setting is on. This
skill does not turn that setting on.

### Native plugin marketplace (optional, untested here)

https://cursor.com/docs/reference/plugins describes plugins that bundle
skills via `.cursor-plugin/plugin.json` or Agent Plugins `plugin.json`, and
multi-plugin repos via `.cursor-plugin/marketplace.json`. Public listing
goes through Cursor review (`cursor.com/marketplace/publish`). This repo
does not ship those manifests in v0.8.0 and does not claim marketplace
visibility.

## Codex / ChatGPT skills

Sources: https://developers.openai.com/codex/skills/ (retrieved 2026-09-17).

- Explicit: `/skills` or `$art-director` in Codex CLI / IDE extension;
  `@` in ChatGPT desktop
- Implicit: description matching, with a budget on the initial skills list
- Repo skills: `.agents/skills` from cwd up to repo root
- User skills: `$HOME/.agents/skills`
- Optional `agents/openai.yaml` is **not** included; appearance metadata
  was not required for the portable skill

The Vercel CLI maps `--agent codex` to project `.agents/skills/` and global
`~/.codex/skills/`. OpenAI's page lists user skills under
`$HOME/.agents/skills`. Both trees can work depending on the client.
Copy to the path your Codex build documents; do not assume one global
folder is universal.

## What this skill does not provide

- MCP server or the six former Art Director tools
- A guaranteed browser, screenshot, or vision step
- Node 24, Ollama, or an API key
- Permission to push, deploy, or publish
- Identity with `@akifsen/art-director-mcp`

Host tools vary. Missing tools are reported, not simulated.

## Current evidence (0.9.0)

| Surface | Status |
|---|---|
| Portable skill structure, Windows/PowerShell copy, relative links | Structure verified + install tested (repo tests, after 0.9.0 edits) |
| Job vs domain + concrete art direction | Implemented in SKILL.md and design-method; independent host use is a separate test |
| Rail Still media example | Vite-compiled; opening, work, inquire, hover, and keyboard focus inspected at 1280 and 390. Contrast of “Email the desk” is gated in `tests/e2e/rail-flow.spec.js` |
| Nadir Desk restyle | Source restyle of tokens/type; flows still the CI gate. Visual inspect of the restyle in this session if the desk server was opened |
| Closeout native restyle | Source only. Device/simulator not opened for 0.9.0 |
| ThemeForest catalog (user craft reference) | Not seen: Playwright received Cloudflare 403 ("Bir dakika lütfen..."). No demo pages inspected. No layout copied |
| Independent skill trial on a new brief | File-path subagent on Willow Bay (clinic board), not Cursor discovery. Inspected 1280/390/dialog. Not Palatino-on-cream. No 0.8.0 same-brief arm |
| Hand-corrected Fold Playwright (`--project=seefix`) | Unchanged 0.8.0 wiring |
| Cursor isolated photographer trial | File-path subagent on the frozen photographer brief with 0.9.0 skill copy, plus one focused revision and one author CSS patch. Not a new Cursor GUI chat. See [action-quality](../evals/evidence/action-quality-0.9.0/REPORT.md). Historical 0.8.0 cream ledger stays in [ci-seefix TRIAL](../evals/evidence/ci-seefix-0.8.0/TRIAL.md) and was not edited |

See [0.9.0 evidence](../evals/evidence/craft-finish-0.9.0/REPORT.md) and
[action-quality](../evals/evidence/action-quality-0.9.0/REPORT.md). Historical
[0.8.0](../evals/evidence/ci-seefix-0.8.0/REPORT.md),
[0.7.0](../evals/evidence/see-and-fix-2026-09-20/REPORT.md), and
[0.6.0](../evals/evidence/native-craft-2026-09-19/REPORT.md) stay as written.

## Previous evidence (0.8.0)

| Surface | Status |
|---|---|
| Portable skill structure, Windows/PowerShell copy, relative links | Structure verified + install tested (repo tests) |
| See-and-correct working method in SKILL.md | Implemented in the skill text; independent Cursor selection is a separate host test |
| Distributed skill vs eval method | Host-trial protocol lives in `evals/HOST-TRIAL.md`, not in `SKILL.md` |
| Hand-corrected Fold Playwright (`--project=seefix`) | Wired into `examples-web` with `ART_DIRECTOR_SEEFIX=1` on build and test |
| Hand-corrected Fold/Daypack copies | Source-checked; Fold is a CI browser gate. Not independent skill output |
| Web DESIGN/REFINE/REVIEW guidance | Used in earlier explicit-path runs; those rows are not relabelled as 0.8.0 host use |
| Closeout React Native / Expo example | Actual Android Pixel_9/API37 execution recorded in 0.5.0/0.6.0 evidence; not re-run for this release unless a new native regression appears |
| Daypack ordinary-brief baseline/candidate | Historical 0.6.0 outputs preserved; the hand-corrected copy is source-checked. Device evidence for that copy is pending |
| iOS, physical devices, VoiceOver/TalkBack | Not run; accessibility props are source evidence, not a screen-reader audit |
| Cursor isolated workspace | Isolated photographer trial: natural selection on the first brief; `/art-director` in the same chat. See [TRIAL.md](../evals/evidence/ci-seefix-0.8.0/TRIAL.md). A separate second-chat explicit-only run was not done |
| Fresh Codex/file-path fallback | Useful and must be labeled separately from Cursor discovery |
| Expo web as iOS/Android | Not accepted as native verification |
| Flutter, SwiftUI, Jetpack Compose | Guide: keep the current framework; **not tested** |
| Commercial third-party themes | Not bundled; eval 10 is an original fixture |

See [0.8.0 evidence](../evals/evidence/ci-seefix-0.8.0/REPORT.md) for that
release, [see-and-correct evidence](../evals/evidence/see-and-fix-2026-09-20/REPORT.md)
for 0.7.0, [native craft / normal briefs](../evals/evidence/native-craft-2026-09-19/REPORT.md)
for 0.6.0 outcomes, and [0.5.0 evidence](../evals/evidence/2026-09-19/REPORT.md)
for the earlier run. Historical results are not relabelled as new tests.
