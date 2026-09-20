# Cursor check (0.8.0) — file prep only

Date: 2026-09-20 (Europe/Istanbul).
This development session edited `skills/art-director` and is **not** an
independent Cursor trial.

Official directories (https://cursor.com/docs/skills.md, retrieved
2026-09-20):

- Project: `.agents/skills/`, `.cursor/skills/`
- User: `~/.agents/skills/`, `~/.cursor/skills/`
- Compatibility: `.claude/skills/`, `.codex/skills/` and user equivalents

Explicit invocation: `/art-director` in Agent chat (one message). Custom
Mode can keep it on (Alt+Enter on Windows). Natural selection uses `name`
+ `description`. Viewing: Customize → Skills.

How to run the two chats: [cursor-trial/USAGE.md](../../cursor-trial/USAGE.md).
Method detail: [HOST-TRIAL.md](../../HOST-TRIAL.md).

| Claim | Result |
| --- | --- |
| Isolated file install | Prepared; SKILL.md SHA256 `dbbd435d…c2375a8` matches source; tree `fafe460c…8f10415`; `.cursor/skills` only |
| Client discovered skill | Unverified |
| Natural selection | Not executed |
| Explicit `/art-director` | Not executed |
| Skill used in a Cursor task | Unverified |

Do not loop desktop SendInput. A file-path subagent is not Cursor discovery.
