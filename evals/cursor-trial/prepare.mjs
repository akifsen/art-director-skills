#!/usr/bin/env node
/**
 * Copy the frozen photographer start + one skill snapshot into a temp
 * Cursor workspace. Maintainer helper. Not a skill runtime.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { repoRootPath } from "../../tooling/validate-skill.mjs";

const root = repoRootPath();
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const dest = fs.mkdtempSync(path.join(os.tmpdir(), `art-director-cursor-trial-${stamp}-`));
const skillSrc = path.join(root, "skills", "art-director");
const skillDest = path.join(dest, ".cursor", "skills", "art-director");
const startSrc = path.join(root, "evals", "cursor-trial", "start");

fs.cpSync(startSrc, dest, { recursive: true });
fs.copyFileSync(path.join(root, "evals", "cursor-trial", "brief.md"), path.join(dest, "brief.md"));
fs.mkdirSync(path.dirname(skillDest), { recursive: true });

if (process.platform === "win32") {
  const copied = spawnSync("powershell", [
    "-NoProfile",
    "-Command",
    `Copy-Item -LiteralPath '${skillSrc.replace(/'/g, "''")}' -Destination '${skillDest.replace(/'/g, "''")}' -Recurse -Force`
  ], { encoding: "utf8" });
  if (copied.status !== 0) {
    console.error(copied.stderr || copied.stdout);
    process.exit(copied.status || 1);
  }
} else {
  fs.cpSync(skillSrc, skillDest, { recursive: true });
}

function fileHashes(directory) {
  return fs.readdirSync(directory, { recursive: true })
    .filter((name) => fs.statSync(path.join(directory, name)).isFile())
    .sort()
    .map((name) => {
      const rel = String(name).replaceAll("\\", "/");
      const digest = crypto.createHash("sha256").update(fs.readFileSync(path.join(directory, name))).digest("hex");
      return [rel, digest];
    });
}

const sourceHashes = fileHashes(skillSrc);
const installedHashes = fileHashes(skillDest);
const sourceJson = JSON.stringify(sourceHashes);
const installedJson = JSON.stringify(installedHashes);
if (sourceJson !== installedJson) {
  console.error("installed skill files differ from source snapshot");
  process.exit(1);
}

const agentsCopy = path.join(dest, ".agents", "skills", "art-director");
if (fs.existsSync(agentsCopy)) {
  console.error("duplicate .agents skill copy is not allowed in this trial");
  process.exit(1);
}

const skillMd = sourceHashes.find(([name]) => name === "SKILL.md");
const notes = [
  "# Isolated Cursor trial hashes",
  "",
  `Prepared: ${new Date().toISOString()}`,
  "Discovery path: .cursor/skills/art-director (project only)",
  "Duplicate .agents copy: none",
  `SKILL.md SHA256: ${skillMd ? skillMd[1] : "missing"}`,
  `Tree SHA256: ${crypto.createHash("sha256").update(sourceJson).digest("hex")}`,
  "",
  "Host discovery, /art-director, and natural selection are pending until a new Cursor chat in this folder runs.",
  "This file is a maintainer record. Do not paste it into the trial chat.",
  "",
  "## Files",
  ...sourceHashes.map(([name, digest]) => `- ${name} ${digest}`)
].join("\n");
fs.writeFileSync(path.join(dest, "SKILL-HASHES.md"), `${notes}\n`);

console.log(dest);
