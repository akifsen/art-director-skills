# See-and-correct evidence — 2026-09-20

Starting tree: `main` = `origin/main` = tag `v0.6.0` =
`3d7819df5917a716e6d85a28da51d6476f02c799`. CI run `35470370911` was green
on that commit; it is not evidence for this commit.

Candidate skill in this worktree: metadata `0.7.0`, `SKILL.md` SHA256
`59E7471B1142E706A43B1D5B034EDB0A18F5B902E488CA7A85496C11C3389211`.
Isolated `npx skills add --copy` tree SHA256
`413b850e3027eef116b1a1fbc0bb38e18211e0777cc61c17229606e872e178e2`
(temp dir, not a user install).

Inspector for the visual notes below: the producing agent in this
repository session (Cursor Grok 4.6), opening live Chromium renders and
the saved PNGs.

## Findings A–F against current sources

| Id | Current status | Kind | Evidence |
|---|---|---|---|
| A | Still true on the 0.6.0 Fold candidate | Behavior | Candidate `RUN.md` records full flow before first screenshot. SKILL.md already told the agent to inspect first; the run did not. |
| B | Still true on the 0.6.0 Fold candidate; fixed in the **hand-corrected** copy | Visual + layout | 390 form stacked 42px title, lead, facts, 32px form title. Not a z-index collision. Corrected copy: 26px title, lead hidden on narrow, transparent demo band, reserve Y 859 vs candidate 1172. |
| C | Still true on the 0.6.0 Daypack candidate; source-fixed in the hand-corrected copy | Visual | Tall plan cards vs a denser checklist. Corrected copy tightens plan padding/type. Device image of the corrected copy was not taken (no `adb` device). |
| D | Still true on the 0.6.0 Daypack candidate; source-fixed in the hand-corrected copy | Behavior + a11y | Disabled button said “Everything’s packed” at 1/4. Read-only summary reused checkbox chrome without a text role. Corrected: `Finish packing` / `Complete packing list`; summary `accessibilityRole="text"`. |
| E | Still true of the 0.6.0 Daypack producer | Process | Candidate `RUN.md`: visually inspected none. Later device review is not producer inspection. |
| F | Unchanged | Host input | Brief never submitted (`SendInput` error 87). Not proof of non-selection. Not retried with the same GUI send. |

## What changed in the skill

Working method is now: read → needed references → thesis → one working
surface → see-and-correct checkpoint → related screens. Four evidence
kinds. Native/completeness/visual-craft/responsive guides got the
comparison-density, pending-action, and compact-record principles. No new
engine, JSON contract, MCP, or example library.

## Cursor loading

See [IDE-CHECK.md](IDE-CHECK.md). **Pending.** This chat is not that test.

## Producer see-and-correct

- **Fold hand-corrected:** producer opened 390 catalogue, 390 form/error,
  390 confirmation, 1280 form. Catalogue kept character. Confirmation
  still named the workshop and cancel. Narrow form no longer restages the
  intro.
- **Daypack hand-corrected:** source and reducer verified. **Not visually
  inspected on a device.** A web render was not used as native proof.
- **Pier Kettle:** producer opened the live board, recorded the checkpoint
  in `evals/outputs/see-and-fix-2026-09-20/pier-kettle/RUN.md`, and
  rechecked idle / steeping / ready / clear.

## Hand-fixed vs independent skill output

| Output | Label |
|---|---|
| `fold-corrected`, `daypack-corrected` | Hand-corrected demos |
| `pier-kettle` | This session followed the skill method on a frozen unseen brief |
| Cursor natural / explicit | Not run |

Pier Kettle is a transfer check of the method inside this authoring
session. It is not a clean isolated host. Do not read it as Cursor
discovery.

## Tests and environments

- `npm test` (structure, stores, see-and-fix source) — run on this tree
- Fold corrected Vite production build — run
- Fold corrected live Chromium inspection — run, images opened
- Playwright `--project=seefix` locally — **not run**: bundled Chromium
  missing on this Windows agent (`chrome-headless-shell` absent). CI Ubuntu
  installs Chromium; that job still does not set `ART_DIRECTOR_SEEFIX`
- Kiln/Desk Playwright flows locally — same missing browser; CI
  `examples-web` remains the gate
- Daypack `verify-state.mjs` — run
- Android device/emulator for corrected Daypack — **not run** (`adb devices`
  empty)
- Isolated `npx skills add` — run if `npm run test:install` succeeds on
  this commit

## Honest remainder

The skill can now *ask* the producing agent to see and correct. Fold
corrected and Pier Kettle show that loop when the agent actually opens a
browser. Daypack corrected is source-only. Cursor still has not selected
or been invoked with this skill on a user brief in a separate session.
