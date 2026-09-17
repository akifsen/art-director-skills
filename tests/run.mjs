#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { validateSkill, repoRootPath, parseFrontmatter } from "../tooling/validate-skill.mjs";

const root = repoRootPath();
let failed = 0;

function assert(cond, message) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", message);
  } else {
    console.log("ok:", message);
  }
}

const structure = validateSkill();
for (const note of structure.notes) console.log(note);
assert(structure.problems.length === 0, structure.problems.length ? structure.problems.join("; ") : "structure");

const skillMd = fs.readFileSync(path.join(root, "skills", "art-director", "SKILL.md"), "utf8");
const { data } = parseFrontmatter(skillMd);

const triggers = JSON.parse(
  fs.readFileSync(path.join(root, "tests", "fixtures", "triggers.json"), "utf8")
);

function classifyFixturePrompt(prompt) {
  const p = prompt.toLowerCase();
  const negative = /\b(sql|migration|database|deploy|production and tag|backend)\b/.test(p)
    && !/\b(ui|interface|page|menu|layout|design|review|spacing|homepage|visual)\b/.test(p);
  if (negative) return { trigger: false, mode: null };
  const review = /\breview\b/.test(p) && /do not change|read-only|do not (edit|change)/.test(p);
  if (review || (/\breview\b/.test(p) && /do not change/.test(p))) return { trigger: true, mode: "REVIEW" };
  if (/\breview this ui\b/.test(p)) return { trigger: true, mode: "REVIEW" };
  if (/\b(mobile menu|navigation on small|spacing on the pricing|fix the)\b/.test(p) && !/\bredesign\b/.test(p) && !/\bdesign a homepage\b/.test(p)) {
    return { trigger: true, mode: "REFINE" };
  }
  if (/\b(design|redesign)\b/.test(p)) return { trigger: true, mode: "DESIGN" };
  if (/\b(layout|visual hierarchy|typography|landing page)\b/.test(p)) return { trigger: true, mode: "DESIGN" };
  return { trigger: false, mode: null };
}

console.log("fixture keyword heuristic (not host skill selection or model behavior)");
for (const caseRow of triggers) {
  const got = classifyFixturePrompt(caseRow.prompt);
  assert(got.trigger === caseRow.shouldTrigger, `${caseRow.id} fixture-heuristic trigger ${got.trigger} === ${caseRow.shouldTrigger}`);
  assert(got.mode === caseRow.expectedMode, `${caseRow.id} fixture-heuristic mode ${got.mode} === ${caseRow.expectedMode}`);
}

const desc = data.description.toLowerCase();
assert(desc.includes("mobile menu"), "description mentions mobile menu");
assert(/do not use/.test(desc), "description includes do-not-use clause");
assert(skillMd.includes("read-only") || skillMd.includes("Read-only"), "REVIEW stays read-only");
assert(skillMd.includes("visual-research.md"), "SKILL.md points at visual-research.md");
assert(skillMd.includes("polish-pass.md"), "SKILL.md points at polish-pass.md");
assert(/visually\s+finished/.test(skillMd), "promise mentions finished craft");
assert((data.metadata && data.metadata.version) === "0.2.0", `version 0.2.0 (got ${data.metadata && data.metadata.version})`);
assert(!skillMd.includes("disable-model-invocation: true"), "implicit invocation allowed");
assert(!/^allowed-tools:/m.test(skillMd), "no allowed-tools permission expansion");

const packedHint = fs.readFileSync(path.join(root, "skills", "art-director", "SKILL.md"), "utf8");
assert(!packedHint.includes("docs/installation.md"), "installed skill does not point at repo docs");

const caseDirs = fs.readdirSync(path.join(root, "evals", "cases"), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();
assert(caseDirs.length >= 7, `eval cases >= 7 (have ${caseDirs.length})`);
assert(caseDirs.includes("07-missing-css"), "eval fixture for missing stylesheet");
for (const name of caseDirs) {
  const dir = path.join(root, "evals", "cases", name);
  assert(fs.existsSync(path.join(dir, "brief.md")), `${name} brief`);
  assert(fs.existsSync(path.join(dir, "expected.md")), `${name} expected`);
  assert(fs.existsSync(path.join(dir, "start")), `${name} start/`);
}

const tmpParent = fs.mkdtempSync(path.join(os.tmpdir(), "ad-copy-"));
const tmp = path.join(tmpParent, "art-yönetmen kopya");
fs.mkdirSync(tmp);
const dest = path.join(tmp, "art-director");
const src = path.join(root, "skills", "art-director");
if (process.platform === "win32") {
  const copiedPs = spawnSync("powershell", [
    "-NoProfile",
    "-Command",
    `Copy-Item -LiteralPath '${src.replace(/'/g, "''")}' -Destination '${dest.replace(/'/g, "''")}' -Recurse -Force`
  ], { encoding: "utf8" });
  assert(copiedPs.status === 0, `PowerShell copy exit ${copiedPs.status}: ${copiedPs.stderr || copiedPs.stdout}`);
} else {
  fs.cpSync(src, dest, { recursive: true });
}
assert(fs.existsSync(path.join(dest, "SKILL.md")), `copied SKILL.md into ${dest}`);
const copied = validateSkill(dest);
assert(copied.problems.length === 0, copied.problems.length ? copied.problems.join("; ") : "copy under Turkish/space parent path");
assert(
  fs.existsSync(path.join(dest, "references", "studies", "media-in-composition.html")),
  "copied studies land in the portable skill folder"
);
console.log("copied skill to", dest);

if (failed) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log("\nall tests passed");
