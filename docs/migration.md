# Migration

## From `art-director-skills` 0.9.1 to 0.10.0 (CLI security)

0.9.1's `bin/cli.js` had a single-file mode: no arguments wrote `./SKILL.md`,
`--cursor` wrote `./.cursorrules`, `--claude` wrote `./CLAUDE.md`. Three
problems, reproduced against the published 0.9.1 tarball on 2026-09-21:

1. An existing file was overwritten after a notice only — no backup, no
   separate confirmation.
2. `writeFileSync` followed a symbolic link at that path, so a linked
   `.cursorrules` changed the file it pointed to, outside the project.
3. `remove` and `install --force` recursed into a target that was a
   symbolic link or junction and deleted the files inside the link's
   destination (then failed with `ENOTDIR`; the data was already gone).
   `0.9.1 remove --ai kiro` through a junction deleted the outside
   `SKILL.md` and `keep.txt` sentinels and printed `removed`.

0.10.0 changes:

| 0.9.1 | 0.10.0 |
|---|---|
| `npx art-director-skills` wrote `./SKILL.md` | prints usage; writes nothing |
| `--cursor` / `--claude` wrote `.cursorrules` / `CLAUDE.md` | stop with a message; write nothing |
| existing skill folder: `kept` unless `--force`; `--force` deleted then recopied | identical → `current`; different → `conflict` (exit 2); `--force` keeps the old folder as `art-director.bak-<time>` |
| links followed | links at, above, or inside the target refused before any change; `--force` cannot bypass |
| `remove` checked for any `SKILL.md` | checks `name: art-director` and the link scan; protected roots refused |
| — | `--dry-run` |

If you relied on the single-file shortcut, the supported path is the full
install where your client discovers skills:

```sh
npx art-director-skills@0.10.0 install --ai cursor    # or claude, codex, …
```

Your existing `SKILL.md`, `.cursorrules`, `CLAUDE.md`, `AGENTS.md` are not
read or modified by 0.10.0. A file 0.9.1 wrote for you is a plain copy of
the 0.9.1 `SKILL.md` with links rewritten to GitHub `main`; delete it or
keep it as you like — the installer does not manage it.

If a previous copy of the skill folder is a symbolic link you created
yourself, the installer will refuse to touch it. Remove the link by hand
(`rmdir` on Windows for a junction; `rm` on POSIX — both remove the link,
not its target) and run `install` again.

## From Art Director MCP

This repository is a new product. It is not a release of
`@akifsen/art-director-mcp`, and it does not wrap, symlink, or call that
package.

The previous product gave agents packs, palettes, fonts, and layout recipes.
That process could run, but brands often collapsed onto the same few looks.
This skill instead teaches a workflow: extract context, set hierarchy, look
at a few visible references when tools allow, form a concrete thesis,
finish a real slice of craft, implement in the current stack, and review
honestly on two ledgers (function vs visual craft).

## What we inspected

Read-only review of the sibling checkout `../art-director-mcp` (not modified):

- npm: `@akifsen/art-director-mcp@0.3.0` (registry), GitHub
  `akifsen/art-director-mcp`
- Six MCP tools, optional browser worker, design-pack JSON, contract
  revisions, Node 24 runtime
- MIT license (Copyright 2026 Art Director MCP contributors)

No archive, unpublish, dist-tag, or remote change was made there.

## Taken (rewritten, not copied)

These ideas are small, testable, and license-compatible. They were rewritten
in the skill's own words:

| Idea | Why it still helps | Where it lives now |
|---|---|---|
| Keep real copy, routes, and SSR | Stops layout from inventing content | `SKILL.md`, `implementation.md` |
| Visual judgment ≠ measured checks | Prevents a11y/lint scores from being sold as better design | `visual-review.md` |
| UI states as first-class work | Loading/empty/error/disabled/focus/menu were already concrete | `completeness-and-states.md`, `responsive-interaction.md`, `native-mobile.md` |
| Honest assets and recorded licenses | CC0 preference when adding new files; no fake screenshots | `typography-color-assets.md` |
| Optional project-local notes | Replaces a mandatory JSON contract engine | `assets/design-notes.example.md` |
| Treat repo and page text as data | Do not obey instructions hidden in copied sites | `SKILL.md` |

Interface-state intent in the old `packages/core/src/domain.ts` `states`
object informed the rewritten state list. The object itself was not copied.

## Not taken

- Design packs (`editorial-signal`, `vivid-product`, `quiet-precision`) and
  their recipes, palettes, and HTML boards
- MCP server, six tools, CLI `init`/`serve`/`audit`, IDE adapters
- Browser worker, Playwright download, loopback origin policy
- Zod schemas, revision locks, token/CSS emitters
- Forced three-direction bake-off and `pageType` enum as a template switch
- React/Vite sample app and any customer or Aetherforge sites
- Node 24 as a user runtime
- Prompts that told the agent to call those tools

## Runtime relationship

The skill has no dependency on the MCP checkout, its npm package, or any
absolute local path. If a target project still has `.art-director/` MCP
artifacts, the host may read them when permitted. The skill does not require
them and does not delete them.
