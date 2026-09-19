#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { repoRootPath, validateSkill } from "./validate-skill.mjs";

const root = repoRootPath();
const src = path.join(root, "skills", "art-director");
const distDir = path.join(root, "dist");
const staging = path.join(distDir, "art-director");
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });
fs.cpSync(src, staging, { recursive: true });
const result = validateSkill(staging);
if (result.problems.length) {
  for (const p of result.problems) console.error(p);
  process.exit(1);
}
const zip = path.join(distDir, "art-director-skill.zip");
if (process.platform === "win32") {
  const packed = spawnSync(
    "powershell",
    // Use the built-in .NET ZIP API. Loading the Archive script module can
    // fail under Windows execution policy; do not weaken that policy.
    ["-NoProfile", "-Command", `Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${staging.replace(/'/g, "''")}', '${zip.replace(/'/g, "''")}', [System.IO.Compression.CompressionLevel]::Optimal, $true)`],
    { encoding: "utf8" }
  );
  if (packed.status !== 0) {
    process.stderr.write(packed.stderr || packed.stdout || "zip failed");
    process.exit(packed.status || 1);
  }
} else {
  const packed = spawnSync("zip", ["-r", zip, "art-director"], { cwd: distDir, encoding: "utf8" });
  if (packed.status !== 0) {
    process.stderr.write(packed.stderr || "zip not available; dist/art-director folder is still valid");
  }
}
console.log("packed", fs.existsSync(zip) ? zip : staging);

const hashes = fs.readdirSync(staging, { recursive: true })
  .filter((name) => fs.statSync(path.join(staging, name)).isFile())
  .sort().map((name) => [name.replaceAll('\\', '/'), crypto.createHash('sha256')
    .update(fs.readFileSync(path.join(staging, name))).digest('hex')]);
const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
const manifest = {
  version: fs.readFileSync(path.join(staging, 'SKILL.md'), 'utf8').match(/version:\s*"([^"]+)"/)?.[1],
  sourceCommit: head.status === 0 ? head.stdout.trim() : null,
  // Content hashes identify working-tree content even before a release commit.
  files: hashes,
  treeSha256: crypto.createHash('sha256').update(JSON.stringify(hashes)).digest('hex'),
  archiveSha256: fs.existsSync(zip) ? crypto.createHash('sha256').update(fs.readFileSync(zip)).digest('hex') : null
};
fs.writeFileSync(path.join(distDir, 'release-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
