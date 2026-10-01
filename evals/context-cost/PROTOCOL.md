# Context-cost eval protocol

Records **what references a host should open**, not model scores. CI does
not run these prompts.

## Arms

1. **Read-only web audit** — case `18-readonly-web-audit`
2. **Tiny REFINE** — case `19-refine-submit-busy`

Pin skill tree from git; do not edit fixture `start/` trees in place.

## Per run (host trial)

1. Copy case `start/` to an isolated work directory.
2. Paste `brief.md` verbatim.
3. Log which skill files the host loaded (path list or tool read log).
4. Record instructional Markdown loaded:
   - **Host tokens** — use the host’s reported prompt/input token count when
     the run provides it; label `unavailable` when not exposed.
   - **Proxy** — maintainers may compare LF chars or
     `node tooling/context-budget.mjs --json` profile totals from a **git
     clone** (not shipped in the npm skill tarball).
5. Score gates from `expected.md` only; preserve screenshots in a gitignored
   folder.

**Pass (host trial):** meets `expected.md` scope (mode, findings, no false
positives on labels/`aria-busy` alone) and avoids unnecessary reference
reads beyond the case’s initial-load guidance.

**Fail:** edits in REVIEW, rewarded false positives, or DESIGN-depth dumps
when the brief asked for a narrow audit.

Do not claim this protocol ran in CI unless a human or host trial did. Label
live host trials **unexecuted** in CI reports.

## Expected reference reads (guidance, not a fail if the host reasons without a read)

| Case | Mode | Expected initial reads | May open if stuck |
|---|---|---|---|
| 18 | REVIEW | `SKILL.md`, `visual-review.md`, `web-quality.md` | `implementation.md` for stack context only |
| 19 | REFINE | `SKILL.md`, `implementation.md`, `responsive-interaction.md` or `web-quality.md` for the button | not full DESIGN set |

## Evidence to keep

- Tool/read log with timestamps
- List of reference paths opened
- Gate checklist from `expected.md`
- Token column: host count, or `unavailable` / maintainer proxy
- Honest "not verified" for blocked visual checks

Preserve prior eval folders under `evals/evidence/` unchanged.
