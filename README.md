# Art Director

A portable [Agent Skill](https://agentskills.io/specification) that teaches a
coding agent how to design, refine, or review a frontend interface **in the
project already open**.

It does not pick a theme pack. It does not run an MCP server. It does not
require Node, an API key, or a daemon to use. Copy `skills/art-director/`
into a host skills directory and the workflow is available.

[Türkçe](README.tr.md) · [Install](docs/installation.md) · [Compatibility](docs/compatibility.md) · [Evals](evals/README.md) · [Migration](docs/migration.md)

## What it is for

Use it when the work is a UI: a new page, a stated redesign, a bounded fix
(for example a mobile menu), or a visual review.

The skill tells the host to:

1. Read the current stack, content, and what must not change — including
   platform (web vs native) and UI foundation (existing theme, local
   primitives, or a starter)
2. Give the real content a hierarchy (lead, proof, support, action)
3. On broad DESIGN, look at a few current references *if the host can see
   pages*; otherwise use the studies in the skill
4. Write a short visual thesis in concrete terms, not mood adjectives
5. Build and visually inspect a representative real screen, correct its
   weakest consequential decision, then extend the component/page language and finish the
   requested screens, flows, and states — not only the first viewport
6. Edit real files when implementation was requested
7. Keep four acceptance gates separate (load/function, craft, completeness,
   platform/a11y) and say when a check could not be done

It should stay out of backend, SQL, migrations, and deploy work unless the
user also asked for interface changes.

Color choice is not the whole design. A first skeleton is not the delivery
unless the user asked for a wireframe. Intentional minimalism is allowed;
unstyled leftovers are not.

## What it is not

- Not `@akifsen/art-director-mcp` and not a new version of that package
- Not a catalog of ready-made sites
- Not a guarantee of taste; eval scores are subjective and n=1 unless said
- Not a new browser, vision model, or permission set
- Not tested as a Cursor Marketplace plugin in this release

## Install

Manual copy works offline. See [docs/installation.md](docs/installation.md).

From a local clone, after you have this repository on disk:

```powershell
$env:DISABLE_TELEMETRY = "1"
npx skills add C:\path\to\art-director-skills --skill art-director --agent cursor --copy --yes
```

From GitHub (this repository is public):

```sh
npx skills add akifsen/art-director-skills --skill art-director --agent cursor --copy
```

Pin a tag with a tree URL, not `owner/repo@v0.1.0` (`@` is a skill filter in
this CLI):

```sh
npx skills add https://github.com/akifsen/art-director-skills/tree/v0.9.0 --skill art-director --agent cursor --copy
```

Use v0.9.0 after that tag exists. Until then, install from the commit on
`main` or from a local clone. The v0.8.0 skill still teaches Palatino-on-cream
applied fragments. The v0.7.0 tag still contains independent-host
wording in `SKILL.md`.

File install and hashes are not Cursor discovery. Explicit `/art-director`
is not natural selection. See [evals/HOST-TRIAL.md](evals/HOST-TRIAL.md)
and the [0.8.0 evidence](evals/evidence/ci-seefix-0.8.0/REPORT.md).
Previous records: [0.7.0 see-and-correct](evals/evidence/see-and-fix-2026-09-20/REPORT.md),
the [0.6.0 native-craft record](evals/evidence/native-craft-2026-09-19/REPORT.md),
and [earlier 0.5.0 comparison](evals/evidence/2026-09-19/REPORT.md). Explicit-path
agent use and CLI installation do not prove automatic Cursor selection.

If you already installed an older version, back up local edits and replace the
`art-director` folder rather than mixing files. See [docs/installation.md](docs/installation.md#update-an-older-copy).

Telemetry on `npx skills` belongs to that CLI. Opt out with
`DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1`. This skill has no install
scripts of its own.

## Use

In Cursor, `/art-director` or a natural UI-design request. In Codex,
`$art-director` or `/skills`. Speak to the agent in your language; the
skill follows that.

Modes (same skill, not extra commands):

| Mode | User intent | Agent default |
|---|---|---|
| DESIGN | New UI or explicit redesign | Thesis, then finished implementation |
| REFINE | Named part of an existing UI | Change only that part; still finish it |
| REVIEW | Inspect / critique | Read-only unless asked to patch |

## Repository layout

```text
skills/art-director/   # the only public skill (copy this folder)
tooling/               # maintainer validation; not a skill runtime
tests/
evals/                 # tiny fixtures, not customer sites
docs/
```

Skill users do not need `npm install`. `npm test` is for maintainers
(structure, stores, spawn/JSON checks). Example **Vite** builds and
Playwright flows need `npm ci` from the lockfile, then
`npm run test:examples:build`; they serve that production preview. They
are not a skill runtime.

## Status of checks

See [docs/compatibility.md](docs/compatibility.md) and
[evals/RESULTS.md](evals/RESULTS.md). File tests are not IDE discovery.
Discovery is not a real-task run. Visual review that did not happen is
reported as not done. Keyword fixtures in `tests/run.mjs` are not proof
that a host selected this skill.

Current work is recorded in [0.9.0 evidence](evals/evidence/craft-finish-0.9.0/REPORT.md).
The previous CI seefix / skill-split run stays in [0.8.0 evidence](evals/evidence/ci-seefix-0.8.0/REPORT.md).
The previous see-and-correct run stays in [2026-09-20 evidence](evals/evidence/see-and-fix-2026-09-20/REPORT.md).
The previous native-craft run stays in [2026-09-19 evidence](evals/evidence/native-craft-2026-09-19/REPORT.md).
Complete means required gates passed. A useful delivery with blocked checks
is partial; a known significant defect is incomplete. More screenshots or
longer guidance are not evidence of better design.

## License

[MIT](LICENSE). Sources: [docs/sources.md](docs/sources.md).
