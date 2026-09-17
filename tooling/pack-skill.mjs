#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
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
    ["-NoProfile", "-Command", `Compress-Archive -Path '${staging.replace(/'/g, "''")}' -DestinationPath '${zip.replace(/'/g, "''")}' -Force`],
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
