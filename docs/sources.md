# Sources and licenses

## This repository

Skill text, eval fixtures, tests, and docs are original work for
`art-director-skills`, released under MIT. See [LICENSE](../LICENSE).

Do not treat third-party skills as a source. No other public skill tree was
copied into `skills/art-director/`.

## Specifications used while authoring (2026-09-17)

- Agent Skills format: https://agentskills.io/specification
- Skill authoring: https://agentskills.io/skill-creation/best-practices
- Cursor skills: https://cursor.com/docs/skills
- Cursor plugins (marketplace packaging only): https://cursor.com/docs/reference/plugins
- Codex skills: https://developers.openai.com/codex/skills/
- Skill eval pattern: https://developers.openai.com/blog/eval-skills
- Vercel Labs skills CLI: https://github.com/vercel-labs/skills
- CLI add command: https://vercel-labs-skills.mintlify.app/commands/add
- CLI source formats: https://vercel-labs-skills.mintlify.app/guides/source-formats
- CLI telemetry: https://vercel-labs-skills.mintlify.app/advanced/telemetry

Those documents remain under their publishers' terms. This repo quotes
command shapes needed to install correctly.

## Relationship to Art Director MCP

The sibling product `akifsen/art-director-mcp` is MIT-licensed. This repo
does not include its source. A few **ideas** were rewritten; see
[migration.md](migration.md). Pack JSON, MCP tools, and the browser worker
were not imported.

Eval HTML fixtures are original, fictional, and tiny. They are not customer
sites and not copies of live brands.

## Third-party installer

`npx skills` is published by Vercel Labs. It is optional. It may phone
home unless telemetry is opted out. It is not bundled here and is not a
runtime of the skill.
