# Migration from Art Director MCP

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
| UI states as first-class work | Loading/empty/error/disabled/focus/menu were already concrete | `responsive-interaction.md` |
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
