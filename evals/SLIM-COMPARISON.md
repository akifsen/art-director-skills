# Slim comparison: no skill vs 0.11.0 vs slim (0.12+)

Maintainer protocol. Not part of the distributed skill.

**Question.** Did cutting SKILL.md from ~22 KB to ~8.6 KB and the default
DESIGN load from ~68 KB to ~36 KB keep design quality, while making small
tasks cheaper and less over-triggered?

**Hypotheses, stated before any run:**

- **H1 (no regression).** On DESIGN and REVIEW cases, the slim arm does
  not lose to 0.11.0 on Gates A, C, or D, and its Gate B median is not
  more than 1 point lower on any axis.
- **H2 (light path).** On the REFINE case, the slim arm opens fewer
  reference files and does not restyle outside the named control.
- **H3 (skill still matters).** Both skill arms beat no-skill on Gate B.
  If they do not, the skill's value claim needs revisiting, not just its
  length.
- **H4 (trigger).** A single-property CSS tweak does not load the slim
  skill; it may load 0.11.0.

The decision rule is at the end. Write it down before looking at renders.

## Arms

| Arm | Skill | Source |
|---|---|---|
| `none` | no skill installed | — |
| `v011` | 0.11.0 | commit `13e96be` |
| `slim` | current slim skill | the commit you are testing (record it) |

Same host, same model, same tool access (including whether the agent can
open a browser or screenshots), same starting files. Record anything that
differs; an arm with a different model is not comparable.

## Cases

**Core set (required, 18 runs):**

| Case | Mode | Why it is here |
|---|---|---|
| `12-holdout-lumen-cart` | DESIGN | Holdout product workspace; main quality signal |
| `06-mobile-nav` | REFINE | Tests the new light path and scope discipline |

3 arms × 2 cases × **3 runs each**. One run per arm is what earlier
records had; three is the minimum that separates a pattern from luck.

**Extended set (recommended, +18 runs):** `15-weekend-workshops` (ordinary
web brief, DESIGN) and `07-missing-css` (REVIEW, must stay read-only).

**Native (optional):** `11-native-expo` only if a simulator or device is
available for every arm. Expo web does not count for Gate D.

**Trigger probe (H4, 3 runs per arm, no case folder):** in a fresh chat on
any small React project with a skill installed, send exactly:

> Change the primary button background to #0B62BF.

Record only: did the host load the skill (yes / no / unknown) and how many
reference files it opened. Use natural invocation, never `/art-director`.

## Setup

```bash
node evals/scripts/slim-setup.mjs --host cursor --runs 3
# extended: --cases 12-holdout-lumen-cart,06-mobile-nav,15-weekend-workshops,07-missing-css
```

This creates `evals/runs/slim-<date>/<case>/<arm>-r<n>/` (gitignored). Each
folder has the case's `start/` files, the arm's skill copied into the
host's project skill directory (`.cursor/skills/art-director`,
`.claude/skills/art-director`, …), the case `brief.md` as `BRIEF.md`, and
`RUN.md` to fill in. `manifest.json` at the top records commits and the
SHA256 of every installed skill file.

`--host` accepts any id from `npx art-director-skills list`. `--slim-ref`
defaults to `HEAD`; `--old-ref` defaults to `13e96be`.

## Running each folder

1. Open the run folder as its own workspace in a **new** chat. Nothing
   from this repository, the skill-editing history, or other runs may be
   in context.
2. Paste the contents of `BRIEF.md` as the only first message. Do not
   mention the skill, this protocol, or screenshots. Answer follow-up
   questions only with facts already in the brief; otherwise reply "use
   your judgment."
3. Let the agent finish. Allow at most **two** "continue" nudges, the same
   for every arm.
4. Fill in `RUN.md`: model, duration, whether the skill was loaded, which
   reference files it opened (from the host's tool log), token count if
   the host shows it, and nudges used.
5. Build and open the result. Save 390 px and 1440 px screenshots of every
   in-scope screen and state into `shots/` inside the run folder.

Run order: interleave arms (`none-r1`, `v011-r1`, `slim-r1`, `none-r2`, …)
so a model update or host change mid-session does not hit one arm only.

## Blind scoring

```bash
node evals/scripts/slim-blind.mjs evals/runs/slim-<date>
```

This copies each run's `shots/` and source (without the skill folder,
`RUN.md`, or `BRIEF.md`) into `blind/<random-id>/` and writes the id → arm
key to `blind-key.json`. Give only `blind/` to the reviewer. Ideally the
reviewer is not the person who ran the arms; if it must be the same person,
score at least a day later and say so.

The reviewer scores each blind id with [rubric.md](rubric.md) into
`evals/slim-comparison/RESULTS-TEMPLATE.md` (copy it first). Gates stay
separate; no overall percent. Unopened renders are **unverified**, not 2.

Blinding removes the skill folder and `.art-director/`, but an agent can
still leave traces (a comment naming the skill, a design-notes style
summary). If the reviewer spots one, note it next to that id rather than
guessing the arm.

Unblind only after every id is scored.

## Decision rule

Per case, compare medians across the three runs.

- **Ship slim as is** if H1 holds on every core case.
- **Restore specific text** if slim loses on one Gate B axis by more than 1
  point, or on any Gate A/C/D check in at least 2 of 3 runs. Diff that
  axis's text between `13e96be` and slim, restore the smallest part that
  explains the loss, and rerun that case only.
- **Revisit the skill's value** if H3 fails on both core cases: the skill
  arms do not beat `none` on Gate B.
- H2 and H4 are reported but do not block by themselves.

Report weak and failed runs next to good ones. If an arm or case could not
be run, write "not run" and why. Do not backfill.

## What this can and cannot show

Nine runs per case give a direction, not significance. The rubric is
subjective. A single host and model say nothing about other hosts. Say
these limits in the report.
