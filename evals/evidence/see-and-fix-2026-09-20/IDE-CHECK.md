# Cursor check (0.7.0) — still pending as a host test

Date: 2026-09-20 (Europe/Istanbul).
This development session edited `skills/art-director` and is **not** an
independent Cursor trial.

Official skill directories (Cursor docs, retrieved 2026-09-20,
https://cursor.com/docs/skills.md):

- Project: `.agents/skills/`, `.cursor/skills/`
- User: `~/.agents/skills/`, `~/.cursor/skills/`
- Compatibility: `.claude/skills/`, `.codex/skills/` and user equivalents

Read-only inspection in this session: no `art-director` folder among the
checked user skill directories. The checked names were `.system` and
`android-game-release` only. This repository has no project copy under
`.agents/skills` or `.cursor/skills` (those trees are gitignored). Other
user skills were not changed.

Starting published skill (HEAD `3d7819d` / v0.6.0):
`skills/art-director/SKILL.md` SHA256
`FC8820EDCD8A30716D22EAE9D0CC32DF401162271B1B9483C98B01E79F206FAF`.

The 0.6.0 IDE attempt stopped on `SendInput sent 0 of 1 events;
GetLastError=87` before any brief was submitted. That is not evidence the
skill was unselected. This session did not repeat desktop input automation.

## How to run the two Cursor tests (separate chats)

Use two fresh folders outside this repo. Copy case 17 `start/` into one
web folder if you want the transfer brief, or case 15/16 for the original
ordinary briefs. Copy **one** `skills/art-director` tree from this commit
into `.cursor/skills/art-director` only. Do not also install `.agents` or
user copies. Record SHA256 of the installed `SKILL.md`.

1. **Natural:** paste only the case `brief.md`. Do not mention this report.
2. **Explicit:** a different chat, `/art-director` plus the same brief.

If input cannot be sent, stop and keep the result pending. Do not loop the
same GUI send.

| Claim | Result |
| --- | --- |
| Isolated file install in this session | Not performed (would not be discovery) |
| Client discovered skill | Unverified |
| Natural selection | Not executed |
| Explicit `/art-director` | Not executed |
| Skill used in a Cursor task | Unverified |
