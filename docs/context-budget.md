# Context budget (maintainers)

Phased plan: **0.12** shipped progressive disclosure; **0.13** adds
**LF-normalized character budgets**, routing profiles, and
`references/web-quality.md` for conditional web REVIEW/REFINE depth.

## Implemented scope

- `tooling/context-budget.mjs` + `tooling/context-budget.config.json` (maintainer **git clone** only — not invoked by the published npm skill install)
- Checks wired into `npm run validate` and `prepack` when developing this repository
- `tests/context-budget.mjs` via `npm test`
- Limits match the current tree (fail closed on growth)

Not proven: host model tokenizer spend, skill discovery, or taste. Static
checks only bound copied instructional Markdown size.

## Measurements (LF-normalized)

Reproduce from a clone of [art-director-skills](https://github.com/akifsen/art-director-skills):

```bash
node tooling/context-budget.mjs
node tooling/context-budget.mjs --json
```

| Metric | Baseline (pre-upgrade) | Current |
|---|---:|---:|
| All skill `.md` LF chars | 116 778 | 121 822 |
| `SKILL.md` LF chars | 8 625 | 8 571 (cap 8 625) |
| DESIGN core LF chars | 36 786 | 22 565 |
| `references/web-quality.md` | — | 3 613 (conditional) |

The earlier DESIGN core loaded entry, implementation, design method,
content/composition, and typography/color. The current core loads the first
three; the latter two remain available on demand. This is about 39% less
initial instructional text, not a measured reduction in whole-session tokens.

Token column in CLI is `ceil(UTF-8 bytes / 4)` — a coarse proxy, not a
tokenizer.

## Limits

- **Per file** — `perFileMaxLfChars` in config (entry `SKILL.md` ≤ 8 625).
- **Aggregate** — sum of every `.md` under `skills/art-director/`.
- **Profiles** — deduped loads for `design-web`, `design-web-starter`,
  `design-web-existing`, `design-native`, `design-web-responsive`,
  `refine-web-light`, `refine-web-react`, `refine-native-light`,
  `review-web`, `review-native`. Profiles bound instructional Markdown for
  those paths only, not full task cost (repo reads, user code, screenshots).
- **Corpus** — `studies`, `examples`, and `template` tracked separately;
  not part of initial mode loads.

## Conditional load contract

`SKILL.md` lists **core** mode essentials; agents open platform, foundation,
and depth references only when a concrete decision is missing.
`web-quality.md` loads with `visual-review.md` for web REVIEW, or as the
single extra guide for small web control REFINE — not for native-only work.

## Eval hooks

See `evals/context-cost/PROTOCOL.md` in the git repository for read-only
web audit and tiny REFINE cases (reference reads and tool log; no model
runs claimed from CI).

A narrow read-only agent smoke check is recorded in
`evals/context-cost/SMOKE-2026-10-01.md` in the git repository. It is not a
multi-host token benchmark or a visual quality comparison.
