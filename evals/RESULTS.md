# Eval results

This file records runs that actually happened. Missing hosts are listed as
not run. No screenshots or transcripts are fabricated. Screenshots were
inspected in the authoring browser; they are not stored in this repository.

## Environment (authoring session)

- Date: 2026-09-17
- Workspace: `C:\Users\lenovo\devel\art-director-skills` (new project; MCP
  repo was not modified)
- Host: Cursor agent (Cursor Grok 4.6) applying the skill text from
  `skills/art-director/`
- Skill files loaded: `SKILL.md`; `responsive-interaction.md` for case 06;
  `implementation.md` and `typography-color-assets.md` for case 05;
  `visual-review.md` and `content-and-composition.md` for case 01 REVIEW
- Skill git commit: see the first tagged commit on `v0.1.0` after publish
- Repeats: none (n = 1)
- Maintainer Node: v24.13.0 (not a skill runtime requirement)
- Isolated work: `evals/runs/` (gitignored)

`SKILL.md` size in this session: **183 lines**, 7709 characters, description
550 characters (under 1024). Rough body size is well under the 5000-token
guidance.

## Layer A — structure

`node tests/run.mjs` passed:

- Frontmatter `name`/`description`, directory match, relative links
- Skill copy under `art-yönetmen kopya\art-director` via PowerShell
  (`fs.cpSync` on this Windows Node build did not copy into that Unicode
  path and did not throw; documented in `docs/installation.md`)
- Trigger fixtures in `tests/fixtures/triggers.json`

## Layer B — trigger fixtures

Deterministic classifier in `tests/run.mjs` matched all seven prompts
(DESIGN, redesign, mobile menu REFINE, read-only REVIEW, SQL negative,
deploy negative, scoped pricing REFINE).

This is **not** a Cursor or Codex invocation log.

## Layer C — outcome fixtures

| Case | Mode | Run? | Files changed | Visual inspection | Notes |
|---|---|---|---|---|---|
| 01-creative-studio | DESIGN | **not run** | — | — | Fixture only |
| 02-dev-portfolio | DESIGN | **not run** | — | — | Fixture only |
| 03-dashboard | DESIGN | **not run** | — | — | Fixture only |
| 04-publication | DESIGN | **not run** | — | — | Fixture only |
| 05-branded-section | scoped DESIGN | **yes** (n=1) | `careers.html`, `styles.css` (job list + wordmark color) | Browser at `http://127.0.0.1:5188/05-branded-section/careers.html` | Paper/iron/action red kept; two jobs from `jobs.json`; no invented perks. First paint showed a browser-default blue wordmark; color was set to iron and re-checked |
| 06-mobile-nav | REFINE | **yes** (n=1) | `index.html`, `styles.css`, `nav.js` | Viewport ~390px; menu click + Escape | Brand copy/type kept. Menu is a real button, `aria-expanded` toggles, links appear above the hero, Escape collapses and leaves focus on the button |
| 01 as REVIEW | REVIEW | **yes** (source only) | **none** in `evals/cases/01-creative-studio/start` | no browser pass | See findings below |

Without-skill comparison arm: **not run**. Do not generalize from these
with-skill passes.

### Subjective rubric (n=1, author is not blind)

**06-mobile-nav:** hierarchy n/a (nav-only); context fit 2; distinctiveness
n/a; content fidelity 2; small-screen usability 2 after browser check;
brand consistency 2. Process: REFINE respected. Technical: button/expanded/
Escape observed. Visual: menu stacks above the hero; last link sits at the
hero edge (acceptable, not a polish pass).

**05-branded-section:** hierarchy 2 for a jobs list; context fit 2;
distinctiveness 1 (plain list, appropriate); content fidelity 2; mobile
usability unverified at a dedicated phone width after the wordmark fix
(page was viewed in the same 390px session); brand consistency 2 after the
wordmark color fix.

**01 REVIEW findings (read-only):** the first viewport restates the studio
name with generic “premium modern” copy. Three equal cards treat unlike
offerings as SKUs. Brief facts (Sodium Vault, dates, appointment, workshop
seats unknown) are absent from the HTML. Recommendation: lead with the
installation as proof. No files in the case `start/` tree were edited.

## Client discovery

| Check | Result |
|---|---|
| Cursor listed `/art-director` from this repo in Customize | **not tested** |
| Cursor implicit select on a natural UI prompt | **not tested** |
| Codex `$art-director` | **not tested** |
| `npx skills add <local-path> --skill art-director --agent cursor --copy --yes` | **passed** into a temp project `.agents/skills/art-director` (telemetry opted out; `CI=true`; no `--global`) |
| Duplicate `.cursor/skills` copy | **not created** by that CLI run |
| GitHub install | filled after publish, if publish succeeds |

## Old product

No files in `art-director-mcp` were modified. npm dist-tags were not changed.
