# Cursor check and reproducible follow-up

Run started 2026-09-19 and continued 2026-09-20 (Europe/Istanbul).
Baseline commit: `be2a2cd4d49833b6d4b7dca79502db5a795fce5b`, skill 0.5.0.
Cursor 3.20.17, build `0c32194e3fb5ffaced9fb36430b860ec301e1fc0`, Windows x64.

The normal web brief is fixed in [case 15](../../cases/15-weekend-workshops/brief.md).
The native brief is fixed in [case 16](../../cases/16-daypack/brief.md).
Neither asks for the skill's procedure, references or screenshots.

## What actually happened

- Read-only inspection found no `art-director` folder in the checked user `.agents/skills`, `.cursor/skills`, `.codex/skills` locations or the checked project/parent discovery directories. Other skills/configuration were not changed.
- A separate temporary workspace received the exact baseline skill under `.cursor/skills/art-director`, plus the case 15 starter. Existing user projects were not edited.
- Cursor opened that workspace in a new window titled `web-baseline - Cursor`. Its fresh Agent input was empty; the UI showed `High Fast`. This is a displayed selector label, not proof of an actual serving model.
- Initial Computer Use was stopped by the user's physical Escape. After explicit user resumption, observation worked but an indexed click and a fresh screenshot-coordinate retry both failed with `SendInput sent 0 of 1 events; GetLastError=87`.
- No brief was submitted. No discovery list or loaded-file trace was observed. No natural-selection failure can be inferred from a request that never reached the agent. No explicit Cursor invocation was executed either.
- No private IDE screenshots, other project conversations, account details or absolute user paths are included in this record.

| Claim | Result |
| --- | --- |
| Installed in isolated workspace | Yes, baseline copy; hashes in run manifest |
| Client discovered skill | Unverified |
| Selected from natural request | Not executed: input failure |
| Selected by explicit Cursor call | Not executed: same input failure |
| Skill used in Cursor task | Unverified |
| Independent explicit-path fallback | Separate fresh Codex subagents, not Cursor; RUN files list loaded content |

## Re-run without changing global configuration

1. Create four separate folders outside other projects: web baseline/candidate and native baseline/candidate. Copy the matching case's `start/` files into each; keep data and lockfiles identical between its two arms.
2. Extract `skills/art-director` from baseline commit `be2a2cd` into each baseline folder's `.cursor/skills/art-director`. Put the release candidate skill in the corresponding candidate folders. Do not also install a second copy under `.agents`, `.codex` or another discovery root.
3. Record relative filenames and SHA256 for each installed copy, client version, selected model and available tools. Open one folder per new Cursor window; use a fresh chat for each arm. Keep the same model and a bounded budget (one attempt, at most two corrections).
4. First submit only that case's exact `brief.md` text. Do not attach this report, audit, expected checks, another output or design advice. Save observable skill-use/read events with their relative path and hashes. A skill badge or discovered list proves less than an observed file read and task use.
5. If normal selection does not happen, retain that result. In a **separate fresh workspace/chat**, repeat with `/art-director` plus the same brief. Record this as explicit invocation, not repair of the natural-selection result.
6. Build/run actual React or React Native output. Check the requested flow and inspect matching states at the same viewport/device. Preserve at least one weak result, source and build/flow logs; redact private host metadata before sharing.

Cursor's [official skills documentation](https://cursor.com/docs/skills), checked 2026-09-19, distinguishes automatic discovery/relevance selection from slash invocation and lists project/user discovery directories. It describes expected behavior; it does not establish what occurred in this run.
