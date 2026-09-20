# Installation

The skill is a directory. If `skills/art-director/` (with `SKILL.md`,
`references/`, and `assets/`) is on disk, the design workflow can be used
by copying that folder into a host discovery path. No MCP server, API key,
or extra daemon is required for that.

Two install paths are documented:

1. The bundled installer `tooling/install-skill.mjs` (this repository,
   Node ≥ 20, no dependencies, no network, no telemetry). It supports the
   thirteen assistants listed under [Bundled installer](#bundled-installer).
2. Vercel Labs' third-party `skills` CLI. That CLI is not this product. It
   may use the network. See [Telemetry](#telemetry). Verified against the
   CLI docs at https://github.com/vercel-labs/skills and
   https://vercel-labs-skills.mintlify.app/commands/add (retrieved
   2026-09-17; agent table re-checked 2026-09-21).

## Bundled installer

```sh
node tooling/install-skill.mjs install --ai <ids|all> [--global] [--force]
node tooling/install-skill.mjs status  --ai <ids|all>
node tooling/install-skill.mjs remove  --ai <ids|all> [--global]
node tooling/install-skill.mjs list
npm run install-skill -- install --ai cursor      # same thing through npm
npx --yes github:akifsen/art-director-skills install --ai cursor   # without a clone
```

The `npx github:` form was run once from an empty temp directory on this
Windows machine (2026-09-21, branch `craft-finish`): it wrote
`.kiro/skills/art-director` and `.opencode/skills/art-director` and printed
the Kiro note. It needs network for that fetch and uses npm's cache; it
is still not an npm-published package.

| `--ai` | Assistant | Project path | Global path | Vendor source |
|---|---|---|---|---|
| `claude` | Claude Code | `.claude/skills/` | `~/.claude/skills/` | Claude Code skills docs |
| `cursor` | Cursor | `.cursor/skills/` | `~/.cursor/skills/` | https://cursor.com/docs/skills |
| `copilot` | GitHub Copilot in VS Code, Copilot CLI, cloud agent | `.github/skills/` | `~/.copilot/skills/` | https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills |
| `kiro` | Kiro | `.kiro/skills/` | `~/.kiro/skills/` | https://kiro.dev/docs/skills/ |
| `codex` | Codex CLI / IDE | `.agents/skills/` | `~/.agents/skills/` | https://developers.openai.com/codex/skills/ |
| `qoder` | Qoder IDE / CLI | `.qoder/skills/` | `~/.qoder/skills/` | https://docs.qoder.com/extensions/skills |
| `roocode` | Roo Code | `.roo/skills/` | `~/.roo/skills/` | Roo Code skills docs; Vercel agent table |
| `gemini` | Gemini CLI | `.gemini/skills/` | `~/.gemini/skills/` | https://geminicli.com/docs/cli/using-agent-skills/ |
| `opencode` | OpenCode | `.opencode/skills/` | `~/.config/opencode/skills/` | https://opencode.ai/docs/skills/ |
| `continue` | Continue IDE extension | `.continue/skills/` | `~/.continue/skills/` | Vercel agent table |
| `codebuddy` | CodeBuddy CLI | `.codebuddy/skills/` | `~/.codebuddy/skills/` | Vercel agent table |
| `droid` | Droid (Factory) | `.factory/skills/` | `~/.factory/skills/` | Vercel agent table |
| `kilocode` | Kilo Code | `.kilocode/skills/` | `~/.kilocode/skills/` | Vercel agent table; Kilo also reads `.agents/skills/` and its newer `.kilo/skills/` |
| `all` | every row above | | | |

Behaviour:

- Copies `skills/art-director/` file by file (`mkdirSync` + `copyFileSync`)
  and verifies the SHA256 of the copied tree against the source before it
  reports `installed`. No symlinks.
- An existing `art-director` folder is **kept** unless `--force` is passed;
  `--force` deletes and recopies it. Back up local edits first.
- `remove` deletes only a folder that contains `SKILL.md`; anything else
  at that path is left alone.
- `status` prints `current`, `differs` (exit code 2), or `absent`.
- Nothing is written outside the chosen skill directory. No lockfile, no
  network, no telemetry.
- `fs.cpSync` and `fs.rmSync` are not used: on this Windows authoring
  machine with Node 24, both returned without doing their job on a path
  that contained Turkish letters (`rmSync` deleted nothing and did not
  throw). The installer's own copy and delete loops are covered by
  `tests/install-targets.mjs` under a project path with Turkish letters and
  a space.

Notes printed after install:

- Kiro: the default agent loads `.kiro/skills/`; a custom agent needs
  `"skill://.kiro/skills/**/SKILL.md"` in its `resources`.
- Gemini CLI: workspace skills load only from a trusted folder; run
  `/skills reload`.

`--ai all` writes thirteen copies into one project. Cursor, Codex, Copilot,
Gemini CLI, OpenCode, Kilo Code and Claude-compatible hosts also read
`.agents/skills/` or `.claude/skills/`, so they will list the skill more
than once. Name the assistants you actually use.

What the installer proves: the copy exists at the vendor-documented path
with the same hashes as the source (**install tested** for all thirteen).
What it does not prove: that a given host build listed or used the skill in
a real session (**client discovered / used on a task**). Those rows are in
[compatibility.md](compatibility.md#supported-assistants).

## Project vs user scope

| Scope | Typical flag | Effect |
|---|---|---|
| Project (default) | none | Files land in the current repo (bundled installer: the vendor's project path, e.g. `.cursor/skills/`; Vercel CLI for Cursor: `.agents/skills/`) and can be committed with the project |
| User / global | `-g` / `--global` | Files land in a home-directory skills folder and apply across projects |

Do not use `--global` unless you want the skill on every project on this
machine. This repository's tests never write global skills.

Installing the same skill into several discovery directories for one host
can register it twice. Prefer one target agent per install, or one
canonical copy plus the CLI's default symlink behavior.

## Manual copy (offline)

Copy the folder, keep the name `art-director`, and keep relative links
intact:

```text
art-director/
  SKILL.md
  references/
  assets/
```

Cursor discovers project skills from `.agents/skills/` and `.cursor/skills/`,
and user skills from `~/.agents/skills/` and `~/.cursor/skills/` (also
Claude/Codex-compatible trees). Codex scans `.agents/skills` from the
working directory up to the repo root, and user skills from
`$HOME/.agents/skills`. Cursor also loads `.codex/skills/` and
`~/.codex/skills/` for compatibility. See [compatibility.md](compatibility.md).

On Windows, copy rather than symlink if Developer Mode is off.
`Copy-Item -LiteralPath` handles spaces and Turkish characters in the path.
Node's `fs.cpSync` on this authoring machine silently failed to copy into a
directory named `art-yönetmen kopya`; PowerShell succeeded. Prefer
PowerShell or Explorer for manual Windows copies.

PowerShell example (project, Cursor-style path):

```powershell
New-Item -ItemType Directory -Force .agents\skills | Out-Null
Copy-Item -Recurse -Force path\to\art-director-skills\skills\art-director .agents\skills\art-director
```

## Vercel CLI from a local folder (test this first)

From a **different** project directory, so this repo is only a source:

```powershell
$env:DISABLE_TELEMETRY = "1"
npx skills add C:\path\to\art-director-skills --skill art-director --agent cursor --copy --yes
```

Local sources must be real paths (`./`, `..\`, or `C:\...`). `--copy` writes
real files (important on Windows). `--yes` skips prompts. `--skill` limits
the install to `art-director`. `--agent cursor` targets Cursor's project
path used by this CLI (`.agents/skills/`).

Paths with spaces or Turkish characters are valid. Quote them:

```powershell
npx skills add "C:\Users\lenovo\devel\art-director-skills" --skill art-director --agent cursor --copy --yes
```

Codex-only project install:

```powershell
$env:DISABLE_TELEMETRY = "1"
npx skills add C:\path\to\art-director-skills --skill art-director --agent codex --copy --yes
```

Do not pass both `--agent cursor` and `--agent codex` if you are trying to
avoid two copies. Cursor already reads `.agents/skills/` in many setups.

## Vercel CLI from GitHub

This repository is public at `akifsen/art-director-skills`. Network install
is optional; manual copy still works offline.

```sh
npx skills add akifsen/art-director-skills --skill art-director --agent cursor --copy
```

Whether a given machine can reach GitHub is an environment fact, not a
skill runtime requirement.

### Pinning a release

In this CLI, `owner/repo@skill-name` is a **skill filter**, not a version.
Do not write `akifsen/art-director-skills@v0.4.0` expecting a tag.

Documented pin: a GitHub tree URL whose path segment is the branch or tag.

```sh
npx skills add https://github.com/akifsen/art-director-skills/tree/v0.9.1 --skill art-director --agent cursor --copy
```

Use a real tag after it exists. Prefer the tag or commit published in
[CHANGELOG.md](../CHANGELOG.md). A release archive of `skills/art-director/`
can be copied manually the same way as the offline folder.

The v0.9.1 skill designs interaction-state combinations (selected + hover,
focus ring vs surrounding surface) and treats container size as a content
decision, not a fill-the-viewport rule. The untagged 0.9.0 work taught job
vs domain and replaced Palatino-on-cream applied fragments without making
cool-gray sharp chrome the next house look. v0.8.0
still has those fragments and drops host-eval protocol from `SKILL.md`.
v0.7.0 still contains that wording. Do not treat v0.6.0 as the current
method, and do not treat the old v0.4.0 tag as the current cleaned main.

## Update an older copy

v0.4.0 keeps those guides and requires the example stores
(`kiln-store.js`, `notes-store.js`, `session-store.js`) so a copied skill
still has the working methods. v0.3.0 added platform/foundation guides
under `references/` and `references/examples/`. v0.2.0 added
`references/studies/`. Merging by hand and leaving the old `SKILL.md` is
how a host keeps producing skeleton pages, or web-only recipes on a native
brief, while you think you upgraded.

Back up the existing folder and compare any user edits before replacing it.
Replace the whole `art-director` directory. Keep the folder name
`art-director`. On Windows prefer `Copy-Item -LiteralPath` (see above).
Turkish letters and spaces in the parent path are supported by that
cmdlet; do not switch to `fs.cpSync` in a one-off script without testing.

Project copy:

```powershell
$skillSource = (Resolve-Path 'path\to\art-director-skills\skills\art-director').Path
$skillTarget = Join-Path (Get-Location) '.agents\skills\art-director'
if (Test-Path -LiteralPath $skillTarget) {
  $skillBackup = Join-Path (Get-Location) ('skill-backups\art-director-' + (Get-Date -Format 'yyyyMMdd-HHmmss-fff'))
  New-Item -ItemType Directory -Force (Split-Path $skillBackup) | Out-Null
  Move-Item -LiteralPath $skillTarget -Destination $skillBackup
  # Compare this backup and reapply intentional local edits to the new copy.
}
New-Item -ItemType Directory -Force (Split-Path $skillTarget) | Out-Null
Copy-Item -LiteralPath $skillSource -Destination $skillTarget -Recurse
```

With the bundled installer (the target folder is replaced only with
`--force`):

```sh
node tooling/install-skill.mjs status  --ai cursor
node tooling/install-skill.mjs install --ai cursor --force
```

If you installed with the Vercel CLI:

```sh
npx skills add akifsen/art-director-skills --skill art-director --agent cursor --copy --yes
```

or, from a local clone of the new tag, the same `npx skills add <path>`
form as install. Then confirm the copied `SKILL.md` metadata version is
`0.9.1`, that `references/native-mobile.md` exists, and that
`references/examples/media-portfolio/App.jsx` exists.

Compare file contents too: `Get-FileHash -Algorithm SHA256` on source and
installed `SKILL.md` detects a stale entrypoint. Line endings change that
hash: a Windows checkout with `core.autocrlf=true` has CRLF, while a copy
fetched through `npx github:…` or a Linux clone has LF, so the same text
can show two SHA256 values. `git hash-object <file>` normalises line
endings and gives the same id for both; the installer's own check compares
the copy with the source it copied from, so it is unaffected. Maintainer `npm run
test:install` compares every relative file and SHA256, not just the version.
If local edits are intentionally reapplied, document that the hash differs.

Do not keep a second copy in `.cursor/skills/` if `.agents/skills/` already
has it — duplicate discovery is confusing, not "more updated."

## Update and remove

These affect **this** skill when you name it. They can still remove other
skills if you pass wildcards. Do not use `--all` or `--skill '*'` unless
you intend to change every installed skill.

```sh
npx skills update art-director
npx skills remove art-director --agent cursor
```

Add `-g` only for a previous global install.

## Telemetry

The `skills` CLI documents anonymous install telemetry, disabled in CI, with
opt-out via `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1`
(https://vercel-labs-skills.mintlify.app/advanced/telemetry). That behavior
belongs to the CLI, not to Art Director. Manual copy does not call it.

## Native Cursor marketplace

Cursor can load skills from a **plugin** with plugin metadata
(`.cursor-plugin/plugin.json` or a root `plugin.json`, and optionally a
marketplace manifest). That is a separate packaging path. This repository's
primary distribution is the Agent Skills directory. An untested marketplace
import is not claimed to work. See [compatibility.md](compatibility.md).
