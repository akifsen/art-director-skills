// Installer checks: every supported assistant gets the same skill tree at the
// vendor-documented path, under a project path with Turkish letters and a
// space, and under a fake home for --global. Nothing is written outside the
// temp directories. This is an install test, not host discovery.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  ASSISTANTS,
  ASSISTANT_IDS,
  SKILL_SOURCE,
  installSkill,
  removeSkill,
  removeTree,
  resolveAssistants,
  statusSkill,
  targetDir,
  treeHash
} from "../tooling/install-skill.mjs";
import { repoRootPath, validateSkill } from "../tooling/validate-skill.mjs";

const root = repoRootPath();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ad-targets-"));
const projectDir = path.join(tmp, "çekim panosu");
const home = path.join(tmp, "ev dizini");
fs.mkdirSync(projectDir);
fs.mkdirSync(home);

const expectedIds = [
  "claude", "cursor", "copilot", "kiro", "codex", "qoder", "roocode",
  "gemini", "opencode", "continue", "codebuddy", "droid", "kilocode"
];
assert.deepEqual(ASSISTANT_IDS, expectedIds, "assistant ids and order");
assert.deepEqual(resolveAssistants("all"), expectedIds, "all expands to every assistant");
assert.deepEqual(resolveAssistants("cursor,codex"), ["cursor", "codex"], "comma list");
assert.deepEqual(resolveAssistants("cursor cursor"), ["cursor"], "duplicates collapse");
assert.throws(() => resolveAssistants("windsurf"), /unknown assistant/, "unknown id is refused");
assert.throws(() => resolveAssistants(""), /--ai is required/, "missing --ai is refused");

for (const id of ASSISTANT_IDS) {
  const entry = ASSISTANTS[id];
  assert.ok(entry.label && entry.project && entry.global, `${id} has label, project, global`);
  assert.ok(!entry.project.startsWith("/") && !entry.global.startsWith("/"), `${id} paths are relative`);
  assert.ok(entry.project.endsWith("skills"), `${id} project path ends in a skills folder`);
}

const sourceTree = treeHash(SKILL_SOURCE).tree;

// Project scope, all assistants.
const projectResults = resolveAssistants("all").map((id) => installSkill(id, { projectDir, home }));
for (const r of projectResults) {
  assert.equal(r.action, "installed", `${r.id} installed`);
  assert.equal(r.tree, sourceTree, `${r.id} tree hash equals source`);
  const expected = path.join(projectDir, ASSISTANTS[r.id].project, "art-director");
  assert.equal(r.dest, expected, `${r.id} lands at ${ASSISTANTS[r.id].project}/art-director`);
  assert.ok(fs.existsSync(path.join(r.dest, "SKILL.md")), `${r.id} SKILL.md present`);
  assert.ok(fs.existsSync(path.join(r.dest, "references", "native-mobile.md")), `${r.id} references copied`);
  assert.ok(fs.existsSync(path.join(r.dest, "references", "examples", "media-portfolio", "stills", "linear40.png")), `${r.id} binary still copied`);
  const validated = validateSkill(r.dest);
  assert.equal(validated.problems.length, 0, `${r.id} copy validates: ${validated.problems.join("; ")}`);
}
const projectDirs = new Set(projectResults.map((r) => r.dest));
assert.equal(projectDirs.size, ASSISTANT_IDS.length, "every assistant has a distinct project path");

// Global scope, fake home.
const globalResults = resolveAssistants("all").map((id) => installSkill(id, { global: true, projectDir, home }));
for (const r of globalResults) {
  assert.equal(r.action, "installed", `${r.id} global installed`);
  assert.equal(r.dest, path.join(home, ASSISTANTS[r.id].global, "art-director"), `${r.id} global path`);
  assert.ok(r.dest.startsWith(home), `${r.id} global stays under home`);
}
assert.equal(
  targetDir("opencode", { global: true, home }),
  path.join(home, ".config", "opencode", "skills", "art-director"),
  "opencode global uses ~/.config/opencode/skills"
);
assert.equal(
  targetDir("copilot", { global: true, home }),
  path.join(home, ".copilot", "skills", "art-director"),
  "copilot personal skills live in ~/.copilot/skills"
);

// Nothing written outside the two temp roots.
const outside = fs.readdirSync(tmp).filter((name) => !["çekim panosu", "ev dizini"].includes(name));
assert.deepEqual(outside, [], "no stray files next to the temp roots");

// Second install keeps, --force replaces, status tracks edits.
assert.equal(installSkill("cursor", { projectDir, home }).action, "kept", "existing folder is kept without --force");
assert.equal(statusSkill("cursor", { projectDir, home }).action, "current", "status current after install");
const cursorSkill = path.join(targetDir("cursor", { projectDir }), "SKILL.md");
fs.appendFileSync(cursorSkill, "\n<!-- local edit -->\n");
assert.equal(statusSkill("cursor", { projectDir, home }).action, "differs", "status differs after a local edit");
assert.equal(installSkill("cursor", { projectDir, home, force: true }).action, "replaced", "--force replaces");
assert.equal(statusSkill("cursor", { projectDir, home }).action, "current", "status current after replace");

// Remove only removes a folder that is a skill.
assert.equal(removeSkill("kiro", { projectDir, home }).action, "removed", "remove deletes the kiro copy");
assert.equal(removeSkill("kiro", { projectDir, home }).action, "absent", "second remove reports absent");
assert.equal(statusSkill("kiro", { projectDir, home }).action, "absent", "status absent after remove");
assert.ok(!fs.existsSync(targetDir("kiro", { projectDir })), "kiro folder is really gone (rmSync silently no-ops on Turkish paths in Node 24 on Windows)");
const notASkill = targetDir("roocode", { projectDir });
removeTree(notASkill);
fs.mkdirSync(notASkill, { recursive: true });
fs.writeFileSync(path.join(notASkill, "notes.txt"), "user file");
assert.equal(removeSkill("roocode", { projectDir, home }).action, "kept", "remove refuses a folder without SKILL.md");
assert.ok(fs.existsSync(path.join(notASkill, "notes.txt")), "user file survives");

// CLI entry: argv parsing, --json, exit codes.
const cli = path.join(root, "tooling", "install-skill.mjs");
const cliProject = path.join(tmp, "cli çalışma");
fs.mkdirSync(cliProject);
const installed = spawnSync(process.execPath, [cli, "install", "--ai", "codex,gemini", "--project-dir", cliProject, "--json"], { encoding: "utf8" });
assert.equal(installed.status, 0, `cli install exit 0: ${installed.stderr}`);
const parsed = JSON.parse(installed.stdout);
assert.deepEqual(parsed.map((r) => [r.id, r.action]), [["codex", "installed"], ["gemini", "installed"]], "cli json result");
assert.ok(fs.existsSync(path.join(cliProject, ".agents", "skills", "art-director", "SKILL.md")), "cli wrote codex copy");
assert.ok(fs.existsSync(path.join(cliProject, ".gemini", "skills", "art-director", "SKILL.md")), "cli wrote gemini copy");

const status = spawnSync(process.execPath, [cli, "status", "--ai", "codex", "--project-dir", cliProject], { encoding: "utf8" });
assert.equal(status.status, 0, "status exit 0 when current");
assert.match(status.stdout, /^current\s+codex/, "status prints current");

const bad = spawnSync(process.execPath, [cli, "install", "--ai", "nope", "--project-dir", cliProject], { encoding: "utf8" });
assert.equal(bad.status, 1, "unknown assistant exits 1");
assert.match(bad.stderr, /unknown assistant/, "unknown assistant message");

const list = spawnSync(process.execPath, [cli, "list"], { encoding: "utf8" });
assert.equal(list.status, 0, "list exit 0");
for (const id of ASSISTANT_IDS) assert.ok(list.stdout.includes(`  ${id}`), `list names ${id}`);

removeTree(tmp);
assert.ok(!fs.existsSync(tmp), "temp tree removed");
console.log(`installer targets ok for ${ASSISTANT_IDS.length} assistants (project + global, Turkish/space paths, force/remove/status, cli)`);
