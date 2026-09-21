#!/usr/bin/env node
/**
 * Copy the art-director skill folder into the skill directory of one or
 * more coding assistants. Node is a maintainer/installer tool here, not a
 * skill runtime: the copied folder works without this script.
 *
 *   node tooling/install-skill.mjs install --ai cursor,codex
 *   node tooling/install-skill.mjs install --ai all --global
 *   node tooling/install-skill.mjs status  --ai all
 *   node tooling/install-skill.mjs remove  --ai kiro
 *   node tooling/install-skill.mjs list
 *
 * No network, no symlinks, no writes outside the chosen skill directory.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SKILL_NAME = "art-director";
export const SKILL_SOURCE = path.join(repoRoot, "skills", SKILL_NAME);

/**
 * Discovery directories as documented by each vendor (see
 * docs/compatibility.md for the sources and retrieval dates). `project` is
 * relative to the project root; `global` is relative to the home directory.
 */
export const ASSISTANTS = {
  claude: { label: "Claude Code", project: ".claude/skills", global: ".claude/skills" },
  cursor: { label: "Cursor", project: ".cursor/skills", global: ".cursor/skills" },
  copilot: { label: "GitHub Copilot (VS Code, CLI, cloud agent)", project: ".github/skills", global: ".copilot/skills" },
  kiro: {
    label: "Kiro",
    project: ".kiro/skills",
    global: ".kiro/skills",
    note: "Kiro's default agent loads .kiro/skills. A custom agent needs \"skill://.kiro/skills/**/SKILL.md\" in its resources."
  },
  codex: { label: "Codex CLI / IDE", project: ".agents/skills", global: ".agents/skills" },
  qoder: { label: "Qoder IDE / CLI", project: ".qoder/skills", global: ".qoder/skills" },
  roocode: { label: "Roo Code", project: ".roo/skills", global: ".roo/skills" },
  gemini: {
    label: "Gemini CLI",
    project: ".gemini/skills",
    global: ".gemini/skills",
    note: "Gemini CLI loads workspace skills only from a trusted folder; run /skills reload after install."
  },
  opencode: { label: "OpenCode", project: ".opencode/skills", global: ".config/opencode/skills" },
  continue: { label: "Continue", project: ".continue/skills", global: ".continue/skills" },
  codebuddy: { label: "CodeBuddy", project: ".codebuddy/skills", global: ".codebuddy/skills" },
  droid: { label: "Droid (Factory)", project: ".factory/skills", global: ".factory/skills" },
  kilocode: { label: "Kilo Code", project: ".kilocode/skills", global: ".kilocode/skills" }
};

export const ASSISTANT_IDS = Object.keys(ASSISTANTS);

export function resolveAssistants(spec) {
  if (!spec) throw new Error(`--ai is required (one of ${ASSISTANT_IDS.join(", ")}, or all)`);
  const wanted = String(spec).split(/[,\s]+/).filter(Boolean);
  if (wanted.includes("all") || wanted.includes("*")) return [...ASSISTANT_IDS];
  const unknown = wanted.filter((id) => !ASSISTANTS[id]);
  if (unknown.length) {
    throw new Error(`unknown assistant(s): ${unknown.join(", ")}. Known: ${ASSISTANT_IDS.join(", ")}, all`);
  }
  return [...new Set(wanted)];
}

export function targetDir(id, { global = false, projectDir = process.cwd(), home = os.homedir() } = {}) {
  const entry = ASSISTANTS[id];
  const base = global ? path.join(home, entry.global) : path.join(path.resolve(projectDir), entry.project);
  return path.join(base, SKILL_NAME);
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

export function treeHash(dir) {
  const rows = walk(dir)
    .map((file) => [
      path.relative(dir, file).split(path.sep).join("/"),
      crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")
    ])
    .sort((a, b) => a[0].localeCompare(b[0]));
  return { rows, tree: crypto.createHash("sha256").update(JSON.stringify(rows)).digest("hex") };
}

/**
 * Recursive copy with mkdirSync + copyFileSync. fs.cpSync is avoided on
 * purpose: on this authoring machine it silently skipped a destination whose
 * parent had Turkish letters and a space.
 */
export function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else if (entry.isFile()) fs.copyFileSync(from, to);
  }
}

/**
 * Recursive delete with unlinkSync + rmdirSync. fs.rmSync({ recursive })
 * is avoided on purpose: Node 24.13 on Windows returned without deleting
 * anything (and without throwing) when the path contained Turkish letters.
 */
export function removeTree(target) {
  if (!fs.existsSync(target)) return;
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) removeTree(full);
    else fs.unlinkSync(full);
  }
  fs.rmdirSync(target);
  if (fs.existsSync(target)) throw new Error(`could not remove ${target}`);
}

function assertSkillSource(source) {
  if (!fs.existsSync(path.join(source, "SKILL.md"))) {
    throw new Error(`skill source has no SKILL.md: ${source}`);
  }
}

export function installSkill(id, options = {}) {
  const { force = false, source = SKILL_SOURCE } = options;
  assertSkillSource(source);
  const dest = targetDir(id, options);
  const existed = fs.existsSync(dest);
  if (existed && !force) {
    return { id, dest, action: "kept", reason: "already exists (use --force to replace)" };
  }
  if (existed) removeTree(dest);
  copyTree(source, dest);
  const expected = treeHash(source).tree;
  const actual = treeHash(dest).tree;
  if (expected !== actual) throw new Error(`copy to ${dest} does not match the source tree`);
  return { id, dest, action: existed ? "replaced" : "installed", tree: actual };
}

export function removeSkill(id, options = {}) {
  const dest = targetDir(id, options);
  if (!fs.existsSync(dest)) return { id, dest, action: "absent" };
  if (!fs.existsSync(path.join(dest, "SKILL.md"))) {
    return { id, dest, action: "kept", reason: "no SKILL.md at that path; not removing" };
  }
  removeTree(dest);
  return { id, dest, action: "removed" };
}

export function statusSkill(id, options = {}) {
  const { source = SKILL_SOURCE } = options;
  const dest = targetDir(id, options);
  if (!fs.existsSync(path.join(dest, "SKILL.md"))) return { id, dest, action: "absent" };
  const same = treeHash(dest).tree === treeHash(source).tree;
  return { id, dest, action: same ? "current" : "differs" };
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--ai" || arg === "--agent" || arg === "-a") args.ai = argv[++i];
    else if (arg.startsWith("--ai=")) args.ai = arg.slice(5);
    else if (arg === "--global" || arg === "-g") args.global = true;
    else if (arg === "--force" || arg === "-f") args.force = true;
    else if (arg === "--project-dir") args.projectDir = argv[++i];
    else if (arg === "--home") args.home = argv[++i];
    else if (arg === "--source") args.source = argv[++i];
    else if (arg === "--json") args.json = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg.startsWith("-")) throw new Error(`unknown option ${arg}`);
    else args._.push(arg);
  }
  return args;
}

function usage() {
  return [
    "Usage: art-director-skills <install|remove|status|list> --ai <ids|all> [--global] [--force]",
    "       (also: npx art-director-skills …, node tooling/install-skill.mjs …, --version)",
    "",
    "  --ai, -a       comma-separated assistant ids, or all",
    "  --global, -g   write to the home-directory skills folder instead of the project",
    "  --force, -f    replace an existing art-director folder",
    "  --project-dir  project root (default: current directory)",
    "  --home         home directory override (tests)",
    "  --source       skill folder to copy (default: this repo's skills/art-director)",
    "  --json         machine-readable output",
    "",
    "Assistants:",
    ...ASSISTANT_IDS.map((id) => `  ${id.padEnd(10)} ${ASSISTANTS[id].label.padEnd(44)} ${ASSISTANTS[id].project}/  ~/${ASSISTANTS[id].global}/`),
    "  all        every assistant above (duplicate discovery in hosts that also read .agents/.claude trees)"
  ].join("\n");
}

export function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const command = args._[0];
  if (args.help || !command) {
    console.log(usage());
    return 0;
  }
  if (command === "list") {
    console.log(usage().split("\nAssistants:\n")[1]);
    return 0;
  }
  const ids = resolveAssistants(args.ai);
  const options = { global: args.global, force: args.force, projectDir: args.projectDir, home: args.home, source: args.source };
  if (options.source) options.source = path.resolve(options.source);
  const run = { install: installSkill, remove: removeSkill, status: statusSkill }[command];
  if (!run) throw new Error(`unknown command ${command}. Use install, remove, status, or list`);
  const results = ids.map((id) => run(id, options));
  if (args.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    for (const r of results) {
      const detail = r.reason ? ` — ${r.reason}` : "";
      console.log(`${r.action.padEnd(9)} ${r.id.padEnd(10)} ${r.dest}${detail}`);
      if (command === "install" && r.action !== "kept" && ASSISTANTS[r.id].note) console.log(`          note: ${ASSISTANTS[r.id].note}`);
    }
  }
  return results.some((r) => r.action === "differs") ? 2 : 0;
}

const invokedDirectly = process.argv[1]
  && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (invokedDirectly) {
  try {
    process.exit(main());
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
