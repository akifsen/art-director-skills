# Slim comparison — results

Copy this file to `evals/evidence/slim-<date>/REPORT.md` before filling it
in. Protocol: [SLIM-COMPARISON.md](../SLIM-COMPARISON.md). Rubric:
[rubric.md](../rubric.md).

## Setup

- Date(s):
- Host and version:
- Model (same for every arm):
- Browser / screenshot access for the agent: yes / no
- `v011` commit: `13e96be`
- `slim` commit:
- Runs per arm per case:
- Cases run:
- Cases or arms not run, and why:
- Reviewer: author / second reader — blind: yes / no
- If author-scored: days between running and scoring:

## 1. Blind scores (fill before unblinding)

One row per blind id. Gate A, C, D: `pass` / `fail` / `unverified` /
`pending`. Gate B axes: `0` / `1` / `2` / `unverified`. One-line note per
failing or partial cell below the table.

| Case | Blind id | A | B hierarchy | B context fit | B surface/type/media | B components | B small screen | C | D | Scope kept (REFINE) | Read-only (REVIEW) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 12-holdout-lumen-cart | | | | | | | | | | — | — |
| 06-mobile-nav | | | | | | | | | | | — |

Notes:

-

## 2. Unblinded summary (median of runs per arm)

| Case | Arm | A pass | B hier. | B fit | B surf. | B comp. | B small | C pass | D pass | Refs opened (median) | Tokens (median, if shown) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 12-holdout-lumen-cart | none | /3 | | | | | | /3 | /3 | — | |
| 12-holdout-lumen-cart | v011 | /3 | | | | | | /3 | /3 | | |
| 12-holdout-lumen-cart | slim | /3 | | | | | | /3 | /3 | | |
| 06-mobile-nav | none | /3 | | | | | | /3 | /3 | — | |
| 06-mobile-nav | v011 | /3 | | | | | | /3 | /3 | | |
| 06-mobile-nav | slim | /3 | | | | | | /3 | /3 | | |

## 3. Trigger probe (H4)

Prompt: "Change the primary button background to #0B62BF."

| Arm | Run | Skill loaded (yes/no/unknown) | Refs opened |
|---|---|---|---|
| v011 | r1 | | |
| v011 | r2 | | |
| v011 | r3 | | |
| slim | r1 | | |
| slim | r2 | | |
| slim | r3 | | |

## 4. Hypotheses

| | Result | Evidence |
|---|---|---|
| H1 no regression (slim vs v011, A/C/D and B within 1) | holds / fails / unclear | |
| H2 light path (fewer refs, scope kept on 06) | | |
| H3 skill arms beat none on Gate B | | |
| H4 slim not loaded for a one-line CSS change | | |

## 5. Decision (per the rule in the protocol)

- [ ] Ship slim as is
- [ ] Restore specific text — which axis, which lines, rerun of which case
- [ ] Revisit the skill's value (H3 failed)

## 6. Limits

- Runs per case, single host/model, subjective rubric:
- Anything that differed between arms:
- Weak or failed runs are listed above, not dropped: yes
