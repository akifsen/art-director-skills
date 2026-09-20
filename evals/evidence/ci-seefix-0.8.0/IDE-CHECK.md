# Cursor check (0.8.0)

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
| Client discovered skill | **Yes** in the isolated trial: first message was the photographer brief only; the agent read `.cursor/skills/art-director/SKILL.md` |
| Natural selection | **Executed and selected** (same trial, 3:32). Brief was pasted twice in one message; no slash command |
| Explicit `/art-director` | Same chat at 3:35, not a second isolated chat |
| Skill used in a Cursor task | **Yes** — Shoot board React app; see [TRIAL.md](TRIAL.md) |

Do not loop desktop SendInput. A file-path subagent is not Cursor discovery.
