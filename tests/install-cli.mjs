#!/usr/bin/env node
/**
 * Isolated install via Vercel Labs `skills` CLI (network for npx).
 * Never uses --global. Never spawns npx.cmd / shell:true.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { formatSpawnFailure, runNpx } from "../tooling/npx.mjs";
import { repoRootPath, validateSkill } from "../tooling/validate-skill.mjs";

const root = repoRootPath();
const work = fs.mkdtempSync(path.join(os.tmpdir(), "ad-skills-install-"));
const env = {
  ...process.env,
  DISABLE_TELEMETRY: "1",
  DO_NOT_TRACK: "1",
  CI: "true"
};
delete env.npm_config_cache;
delete env.NPM_CONFIG_CACHE;

console.log("work dir", work);
const install = runNpx(
  [
    "--yes",
    "skills",
    "add",
    root,
    "--skill",
    "art-director",
    "--agent",
    "cursor",
    "--copy",
    "--yes"
  ],
  { cwd: work, env, timeout: 180000 }
);

if (install.status !== 0 || install.error) {
  console.error(formatSpawnFailure("skills add --copy", install));
  process.exit(install.status || 1);
}

process.stdout.write(install.stdout || "");
if (install.stderr) process.stderr.write(install.stderr);

const candidates = [
  path.join(work, ".agents", "skills", "art-director"),
  path.join(work, ".cursor", "skills", "art-director")
];
const installed = candidates.find((p) => fs.existsSync(path.join(p, "SKILL.md")));
if (!installed) {
  console.error("skill not found under", work);
  process.exit(1);
}

const result = validateSkill(installed);
if (result.problems.length) {
  for (const p of result.problems) console.error(p);
  process.exit(1);
}

// A version string and valid links alone cannot detect a stale mixed copy.
function fileHashes(directory) {
  return fs.readdirSync(directory, { recursive: true })
    .filter((name) => fs.statSync(path.join(directory, name)).isFile())
    .sort().map((name) => [name.replaceAll('\\', '/'), crypto.createHash('sha256')
      .update(fs.readFileSync(path.join(directory, name))).digest('hex')]);
}
const sourceHashes = fileHashes(path.join(root, 'skills/art-director'));
assert.deepEqual(fileHashes(installed), sourceHashes, 'installed content differs from source');
console.log('installed tree sha256', crypto.createHash('sha256')
  .update(JSON.stringify(sourceHashes)).digest('hex'));

const extras = candidates.filter((p) => p !== installed && fs.existsSync(p));
if (extras.length) {
  console.warn("duplicate install paths:", extras.join(", "));
}
console.log("isolated CLI install ok at", installed);
console.log("files", fs.readdirSync(installed).join(", "));
