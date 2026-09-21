# Host-trial method (maintainers)

This file is **not** part of the distributed skill. End users installing
`skills/art-director/` should not load it. It records how this repository
checks Cursor discovery and independent use.

## What a host trial is

An independent host trial is a **new** Cursor chat in a workspace that did
not already contain this authoring conversation, the master prompt, or the
skill-editing history.

This development chat is not independent host use. A file-path subagent in
the same session is not Cursor discovery.

## Evidence kinds (eval only)

Keep these labels in eval records. Do not ask a normal UI task to emit them.

- **implemented** — source changed
- **run-verified** — the app was built and exercised
- **visually inspected** — a person or producing agent opened a current render
- **independent host use** — a separate Cursor session selected or was invoked
  with the skill

Saving a screenshot is not inspection. Opening the image or live page is.

## Baseline vs candidate

When comparing skill versions, use the same model, brief, starting files,
and tool access. Isolate from the parent “improve this skill” prompt.
Record:

- git commit of the skill snapshot
- SHA256 of every installed skill file (not only the version line)
- which discovery path was used
- model name if the host shows it

If an arm cannot be run, say so. Do not backfill.

## Cursor discovery vs invocation

Official directories (https://cursor.com/docs/skills.md, retrieved
2026-09-20):

| Location | Scope |
|---|---|
| `.agents/skills/` | Project |
| `.cursor/skills/` | Project |
| `~/.agents/skills/` | User |
| `~/.cursor/skills/` | User |

Compatibility trees: `.claude/skills/`, `.codex/skills/`, and the user
equivalents. Nested `SKILL.md` files under those roots are found
recursively.

Viewing skills: Customize → Skills.

Invocation:

1. **Explicit:** type `/art-director` in Agent chat. That attaches the skill
   to one message. Custom Mode (Alt+Enter on Windows) can keep it on.
2. **Natural:** paste only the product brief. Do not mention this file, the
   skill name, or required screenshots. The agent may select the skill from
   `name` + `description`. `disable-model-invocation` is not set on this
   skill.

These are separate tests. Explicit success is not natural selection.
Reading `SKILL.md` is not proof every reference was followed.

Install **one** copy of `skills/art-director` from the same snapshot.
Prefer project `.cursor/skills/art-director` for an isolated trial. Do not
also install `.agents/skills/art-director` or a user copy in the same
trial. Do not delete the user’s other skills.

Compare hashes with `Get-FileHash -Algorithm SHA256` (or the prepare
script). The metadata version line is not enough.

## How to run the frozen Cursor trial

See [cursor-trial/USAGE.md](cursor-trial/USAGE.md). The photographer brief
is frozen there. Do not coach the skill method inside that brief.

If no authorized tool can open a real new Cursor session, leave the host
rows pending. Do not loop desktop input automation.
