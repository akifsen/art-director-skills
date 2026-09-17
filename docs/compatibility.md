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

Sources: https://cursor.com/docs/skills (retrieved 2026-09-17).

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
does not ship those manifests in v0.4.0 and does not claim marketplace
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

## Platforms claimed in v0.4.0

| Surface | Status |
|---|---|
| Portable skill structure, Windows/PowerShell copy, relative links | Structure verified + install tested (repo tests) |
| Web DESIGN/REFINE/REVIEW guidance | Used on tasks in prior evals; v0.4.0 adds honest save/dialog/state examples |
| Theme-less React / local primitives / original template evals | Cases 08–10 exist; tutorial Kiln/Nadir apps **Vite-build** in the `examples-web` job after `npm ci`; outcome rows only after a real run |
| React Native / Expo **source** example + case 11 | Structure + session-store tests; **device/simulator pending** unless RESULTS says otherwise |
| Expo web as iOS/Android | Not accepted as native verification |
| Flutter, SwiftUI, Jetpack Compose | Guide: keep the current framework; **not tested** |
| Commercial third-party themes | Not bundled; eval 10 is an original fixture |
