#!/usr/bin/env node
/**
 * Isolated install via Vercel Labs `skills` CLI (network for npx).
 * Never uses --global.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { repoRootPath, validateSkill } from "../tooling/validate-skill.mjs";

const root = repoRootPath();
const work = fs.mkdtempSync(path.join(os.tmpdir(), "ad-skills-install-"));
const env = {
  ...process.env,
  DISABLE_TELEMETRY: "1",
  DO_NOT_TRACK: "1",
  CI: "true"
};

function run(args, cwd) {
  const bin = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(bin, ["--yes", ...args], {
    cwd,
    env,
    encoding: "utf8",
    shell: false,
    timeout: 180000
  });
  if (result.error) process.stderr.write(String(result.error) + "\n");
  process.stdout.write(result.stdout || "");
  process.stderr.write(result.stderr || "");
  return result;
}

console.log("work dir", work);
const install = run([
  "skills",
  "add",
  root,
  "--skill",
  "art-director",
  "--agent",
  "cursor",
  "--copy",
  "--yes"
], work);

if (install.status !== 0) {
  console.error("skills add --copy failed with status", install.status);
  process.exit(install.status || 1);
}

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

const extras = candidates.filter((p) => p !== installed && fs.existsSync(p));
if (extras.length) {
  console.warn("duplicate install paths:", extras.join(", "));
}
console.log("isolated CLI install ok at", installed);
console.log("files", fs.readdirSync(installed).join(", "));
