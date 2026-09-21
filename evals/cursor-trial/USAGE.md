# Isolated Cursor trial (pending until a new chat runs)

This is **not** a completed host test. File install and hashes can be
prepared here. Discovery, `/art-director`, and natural selection only
count when a **new** Cursor chat in this workspace actually runs.

Do not use the art-director-skills authoring chat for that test.

Official sources (retrieved 2026-09-20):
https://cursor.com/docs/skills.md

Project discovery used for this trial: `.cursor/skills/` only.
Do not also copy `.agents/skills/` or a user-global `art-director`.

## Prepare the workspace

From the repository root:

```powershell
node evals/cursor-trial/prepare.mjs
```

The script prints the trial directory. It copies `start/` and **one**
`skills/art-director` tree from the current worktree into
`.cursor/skills/art-director`, then writes SHA256 hashes.

Open **that directory** as the Cursor workspace. Start a **new Agent
chat**. Do not attach this USAGE file.

## Chat 1 — natural selection

Paste **only** the contents of `brief.md` (also copied into the trial
folder). Do not mention art-director, screenshots, or this repository.

## Chat 2 — explicit invocation

A **different** new chat in the same workspace. Type `/art-director`
then paste the same `brief.md` text on that message.

These two chats are separate. Explicit success is not natural selection.

## After the agent finishes

Run the produced React app (`npm install` then `npm run dev` or the
build/preview scripts it added). Look at list, filter/empty, detail,
edit/validation/save/cancel, wide and narrow viewports.

Record in an eval note (not in the distributed skill):

- whether Customize → Skills listed art-director
- whether natural selection happened (chat 1)
- whether `/art-director` attached (chat 2)
- which references were actually opened
- whether the producer inspected a live render

Do not treat reading `SKILL.md` as proof the whole method ran.
