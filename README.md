# Art Director

A portable [Agent Skill](https://agentskills.io/specification) that teaches a
coding agent how to design, refine, or review a frontend interface **in the
project already open**.

It does not pick a theme pack. It does not run an MCP server. It does not
require Node, an API key, or a daemon to use. Copy `skills/art-director/`
into a host skills directory and the workflow is available.

[Türkçe](README.tr.md) · [Install](docs/installation.md) · [Compatibility](docs/compatibility.md) · [Evals](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/README.md) · [Migration](docs/migration.md)

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

- Not a catalog of ready-made sites
- Not a guarantee of taste; eval scores are subjective and n=1 unless said
- Not a new browser, vision model, or permission set
- Not tested as a Cursor Marketplace plugin in this release

## Install

Manual copy works offline. See [docs/installation.md](docs/installation.md).

### Quick Start (npx, full skill)

The recommended install copies the **whole skill** — `SKILL.md`,
`references/`, `assets/` from one package version — into the folder the
assistant you name discovers. Pick the assistant and the scope yourself;
nothing is written until you do. Pin the version:

```bash
npx --yes art-director-skills@0.10.2 install --ai cursor           # → .cursor/skills/art-director
npx --yes art-director-skills@0.10.2 install --ai claude,codex     # several at once
npx --yes art-director-skills@0.10.2 install --ai cursor --global  # ~/.cursor/skills instead of the project
npx --yes art-director-skills@0.10.2 install --ai cursor --dry-run # plan only
npx --yes art-director-skills@0.10.2 status  --ai cursor
npx --yes art-director-skills@0.10.2 list
npx --yes art-director-skills@0.10.2 remove  --ai cursor
npx --yes art-director-skills@0.10.2 --version
```

No dependencies, no network after npm fetches the package, no telemetry,
no postinstall. Running with no arguments prints usage and writes nothing.
Existing folders are never overwritten silently: identical → `current`,
different → `conflict` (exit 2, nothing changed); `--force` replaces and
keeps the previous folder as `art-director.bak-<time>` beside it. Symbolic
links and junctions at the target, on its parent path, or inside it are
refused without changes; `--force` does not bypass that. `--dry-run` prints
the plan. Details and the safety model: [docs/installation.md](docs/installation.md#bundled-installer).

**Changed in 0.10.0 (security).** The 0.9.1 shortcuts `npx art-director-skills`
(wrote `SKILL.md`), `--cursor` (wrote `.cursorrules`) and `--claude` (wrote
`CLAUDE.md`) overwrote existing instruction files and followed symlinks.
They now stop with a message and write nothing. Your `SKILL.md`,
`.cursorrules`, `CLAUDE.md`, `AGENTS.md` are not touched by this package.
See [docs/migration.md](docs/migration.md).

The published binary is `art-director-skills` only. Do not use
`npx art-director`: that name is a different registry package, and having
it as a bin alias made Windows `npx art-director-skills` try to spawn
`art-director` (npm uses the first alias when they share a path).

From a clone: `node bin/cli.js install --ai cursor`.

| `--ai` | Assistant | Project path | Global path (`--global`) |
|---|---|---|---|
| `claude` | Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| `cursor` | Cursor | `.cursor/skills/` | `~/.cursor/skills/` |
| `copilot` | GitHub Copilot in VS Code, CLI, cloud agent | `.github/skills/` | `~/.copilot/skills/` |
| `kiro` | Kiro | `.kiro/skills/` | `~/.kiro/skills/` |
| `codex` | Codex CLI / IDE | `.agents/skills/` | `~/.agents/skills/` |
| `qoder` | Qoder IDE / CLI | `.qoder/skills/` | `~/.qoder/skills/` |
| `roocode` | Roo Code | `.roo/skills/` | `~/.roo/skills/` |
| `gemini` | Gemini CLI | `.gemini/skills/` | `~/.gemini/skills/` |
| `opencode` | OpenCode | `.opencode/skills/` | `~/.config/opencode/skills/` |
| `continue` | Continue IDE extension | `.continue/skills/` | `~/.continue/skills/` |
| `codebuddy` | CodeBuddy CLI | `.codebuddy/skills/` | `~/.codebuddy/skills/` |
| `droid` | Droid (Factory) | `.factory/skills/` | `~/.factory/skills/` |
| `kilocode` | Kilo Code | `.kilocode/skills/` | `~/.kilocode/skills/` |
| `all` | every assistant above | all of the above | all of the above |

Existing folders are kept unless you pass `--force`. `remove --ai <id>`
deletes only a folder that contains `SKILL.md`. `all` writes thirteen
copies; hosts that also read `.agents/skills/` or `.claude/skills/` will
then list the skill twice, so prefer naming the assistants you use.
Paths are what each vendor documents (see
[docs/compatibility.md](docs/compatibility.md#supported-assistants)); the
installer is install-tested for all thirteen, while real-session
discovery is recorded only where it was run.

### Vercel `skills` CLI (third-party)

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
npx skills add https://github.com/akifsen/art-director-skills/tree/v0.10.0 --skill art-director --agent cursor --copy
```

The v0.10.0 skill content equals 0.9.1 apart from the version line. The v0.8.0 skill still teaches Palatino-on-cream
applied fragments. The v0.7.0 tag still contains independent-host
wording in `SKILL.md`.

File install and hashes are not Cursor discovery. Explicit `/art-director`
is not natural selection. See [evals/HOST-TRIAL.md](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/HOST-TRIAL.md)
and the [0.8.0 evidence](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/ci-seefix-0.8.0/REPORT.md).
Previous records: [0.7.0 see-and-correct](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/see-and-fix-2026-09-20/REPORT.md),
the [0.6.0 native-craft record](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/native-craft-2026-09-19/REPORT.md),
and [earlier 0.5.0 comparison](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/2026-09-19/REPORT.md). Explicit-path
agent use and CLI installation do not prove automatic Cursor selection.

If you already installed an older version, back up local edits and replace the
`art-director` folder rather than mixing files. See [docs/installation.md](docs/installation.md#update-an-older-copy).

Telemetry on `npx skills` belongs to that CLI. Opt out with
`DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1`. The bundled installer above
makes no network calls and sends nothing.

## Use

Install for the assistant you actually open, then invoke **art-director**
in that host. Speak in your language. Same skill everywhere — not extra
commands. Name the job in the message; do not type DESIGN / REFINE /
REVIEW if the request already implies one.

Vendor invocation below is from each host’s skill docs. A recorded
session that listed or used this skill exists for **Cursor**; the other
rows are install-tested paths, not a claim that that host was opened
here. Details: [docs/compatibility.md](docs/compatibility.md).

### Cursor

```bash
npx --yes art-director-skills@0.10.2 install --ai cursor
```

Files: `.cursor/skills/art-director/`. In **Agent** chat:

```text
/art-director Design a booking flow for this site. Keep the current stack.
```

Or ask naturally (“design the settings page”); Cursor may select the
skill from its description. `/art-director` attaches for that message.
Do not also install `--ai all` in the same repo — Cursor also reads
`.agents/skills/` and the skill would appear twice.

### Gemini CLI

```bash
npx --yes art-director-skills@0.10.2 install --ai gemini
```

That writes `.gemini/skills/art-director/` (Gemini’s own tree). The CLI
**also** scans `.agents/skills/` as an alias. Workspace copies of either
tree load only when the folder is **trusted**. If `/skills list` stayed
empty until you renamed `.gemini` → `.agents`, that is this gate (or an
older CLI that only listed the alias). Then:

```text
/trust
/skills reload
/skills list
```

`art-director` should appear. Gemini asks before it activates a skill.

Still empty? Install the alias Gemini actually listed:

```bash
npx --yes art-director-skills@0.10.2 install --ai codex
```

That is `.agents/skills/art-director/` — same `SKILL.md` layout, not a
second skill. Do not keep both `.gemini/skills/art-director` and
`.agents/skills/art-director` if this Gemini build reads both; it would
show twice. `--global` writes `~/.gemini/skills/` and does not use the
workspace trust check.

### Claude Code

```bash
npx --yes art-director-skills@0.10.2 install --ai claude
```

Files: `.claude/skills/art-director/`. Type `/art-director` or ask a UI
question that matches the description. `/skills` lists what is loaded.

### Codex

```bash
npx --yes art-director-skills@0.10.2 install --ai codex
```

Files: `.agents/skills/art-director/`. In Codex CLI / IDE: `/skills` or
`$art-director`. ChatGPT desktop: `@` then the skill.

### GitHub Copilot

```bash
npx --yes art-director-skills@0.10.2 install --ai copilot
```

Files: `.github/skills/art-director/` (project) or `~/.copilot/skills/`
(`--global`). In Copilot CLI, `/skills reload`, then:

```text
/art-director Review the dashboard. Do not edit files.
```

Copilot also matches the description without a slash. `/skills list` and
`/skills info art-director` confirm it loaded.

### Kiro

```bash
npx --yes art-director-skills@0.10.2 install --ai kiro
```

Files: `.kiro/skills/art-director/`. In chat, `/art-director` or a
natural UI request. The default agent loads that folder. A **custom**
agent needs `"skill://.kiro/skills/**/SKILL.md"` in its `resources`.

### OpenCode and the rest

| Host | Install | Where | How to use |
|---|---|---|---|
| OpenCode | `--ai opencode` | `.opencode/skills/` | Agent `skill` tool: name `art-director` |
| Qoder | `--ai qoder` | `.qoder/skills/` | Skill list / `/art-director` as that host documents |
| Roo Code | `--ai roocode` | `.roo/skills/` | same |
| Continue | `--ai continue` | `.continue/skills/` | same |
| CodeBuddy | `--ai codebuddy` | `.codebuddy/skills/` | same |
| Droid | `--ai droid` | `.factory/skills/` | same |
| Kilo Code | `--ai kilocode` | `.kilocode/skills/` | same |

Global copies: add `--global` (home-directory skills folder). Paths and
caveats: [docs/installation.md](docs/installation.md#bundled-installer).

```text
DESIGN — new UI or explicit redesign
Design a booking flow for this site. Keep the current stack. Finish
list, detail, and empty states, not only the first screen.

REFINE — one named part of an existing UI
The mobile menu is unusable under 640px. Change only that.

REVIEW — inspect / critique
Review the dashboard: hierarchy, type, contrast, and empty states.
Do not edit files.
```

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
[evals/RESULTS.md](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/RESULTS.md). File tests are not IDE discovery.
Discovery is not a real-task run. Visual review that did not happen is
reported as not done. Keyword fixtures in `tests/run.mjs` are not proof
that a host selected this skill.

Current work is recorded in [0.9.1 state-craft evidence](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/state-craft-0.9.1/REPORT.md).
The 0.9.0 fragment rewrite stays in [craft-finish](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/craft-finish-0.9.0/REPORT.md)
and [action-quality](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/action-quality-0.9.0/REPORT.md).
The previous CI seefix / skill-split run stays in [0.8.0 evidence](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/ci-seefix-0.8.0/REPORT.md).
The previous see-and-correct run stays in [2026-09-20 evidence](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/see-and-fix-2026-09-20/REPORT.md).
The previous native-craft run stays in [2026-09-19 evidence](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/native-craft-2026-09-19/REPORT.md).
Complete means required gates passed. A useful delivery with blocked checks
is partial; a known significant defect is incomplete. More screenshots or
longer guidance are not evidence of better design.

## License

[MIT](LICENSE). Sources: [docs/sources.md](docs/sources.md).
