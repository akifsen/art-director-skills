#!/usr/bin/env node
/**
 * Blind the runs prepared by slim-setup.mjs for scoring.
 *
 *   node evals/scripts/slim-blind.mjs evals/runs/slim-2026-10-01
 *
 * Copies each run in manifest.json into blind/<case>/<random-id>/ without
 * the installed skill, assistant folders, RUN.md, BRIEF.md, node_modules,
 * or .git, and writes blind-key.json (id → arm/run) next to blind/.
 * Give only blind/ and the case briefs to the reviewer. Refuses to run
 * twice so a key is never silently replaced.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { ASSISTANTS } from "../../tooling/install-skill.mjs";

const EXCLUDE_NAMES = new Set(["RUN.md", "BRIEF.md", "node_modules", ".git", ".art-director"]);
for (const def of Object.values(ASSISTANTS)) {
  EXCLUDE_NAMES.add(def.project.split("/")[0]);
}

function copyFiltered(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (EXCLUDE_NAMES.has(entry.name)) continue;
    if (entry.isSymbolicLink()) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyFiltered(from, to);
    else if (entry.isFile()) fs.copyFileSync(from, to);
  }
}

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = crypto.randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function main() {
  const target = process.argv[2];
  if (!target) throw new Error("usage: node evals/scripts/slim-blind.mjs <runs folder>");
  const out = path.resolve(target);
  const manifestPath = path.join(out, "manifest.json");
  if (!fs.existsSync(manifestPath)) throw new Error(`no manifest.json in ${out}`);
  const blindDir = path.join(out, "blind");
  const keyPath = path.join(out, "blind-key.json");
  if (fs.existsSync(blindDir) || fs.existsSync(keyPath)) {
    throw new Error("blind/ or blind-key.json already exists; remove both to re-blind");
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const key = {};
  const used = new Set();
  let missingShots = 0;

  for (const rel of shuffle(manifest.runOrder)) {
    const [caseId, runName] = rel.split("/");
    const src = path.join(out, caseId, runName);
    if (!fs.existsSync(src)) throw new Error(`missing run folder ${rel}`);
    const shots = path.join(src, "shots");
    if (!fs.existsSync(shots) || fs.readdirSync(shots).length === 0) missingShots += 1;

    let id;
    do id = crypto.randomBytes(3).toString("hex"); while (used.has(id));
    used.add(id);

    copyFiltered(src, path.join(blindDir, caseId, id));
    const [arm, run] = runName.split("-");
    key[`${caseId}/${id}`] = { arm, run };
  }

  fs.writeFileSync(keyPath, `${JSON.stringify(key, null, 2)}\n`);
  console.log(`blinded ${Object.keys(key).length} runs into ${blindDir}`);
  console.log(`key: ${keyPath} (keep it away from the reviewer until scoring is done)`);
  if (missingShots) console.log(`warning: ${missingShots} run(s) have an empty shots/ folder; visual axes will be unverified`);
}

try {
  main();
} catch (err) {
  console.error(`error ${err.message}`);
  process.exit(1);
}
