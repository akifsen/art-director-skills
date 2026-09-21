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
 * No network. No symlinks are created, followed, or traversed. Nothing is
 * written outside the chosen skill directory and its parent (staging and
 * backup folders live next to the target, never elsewhere).
 *
 * Local threat model (documented, not a sandbox): a target path, one of its
 * parent components under the chosen root, or an entry inside an existing
 * target may be a symbolic link or Windows junction pointing outside the
 * project. Every mutation preflights those with lstat, re-checks just
 * before the rename/delete, and refuses without changing anything when a
 * link is found. A concurrent process that swaps a directory for a link
 * between the re-check and the syscall is outside what this tool can
 * defend against; it only narrows the window.
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

export class RefusedError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "RefusedError";
    Object.assign(this, details);
  }
}

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

// ---------------------------------------------------------------- paths

const caseInsensitive = process.platform === "win32" || process.platform === "darwin";
const norm = (p) => (caseInsensitive ? p.toLowerCase() : p);

/** True when `child` is `parent` or lies below it, by path components (not string prefix). */
export function isInside(parent, child) {
  const rel = path.relative(norm(path.resolve(parent)), norm(path.resolve(child)));
  if (rel === "") return true;
  if (path.isAbsolute(rel)) return false; // different drive on Windows
  return rel !== ".." && !rel.startsWith(`..${path.sep}`);
}

export function samePath(a, b) {
  return norm(path.resolve(a)) === norm(path.resolve(b));
}

export function lstatSafe(p) {
  try {
    return fs.lstatSync(p);
  } catch (err) {
    if (err.code === "ENOENT" || err.code === "ENOTDIR") return null;
    throw err;
  }
}

/**
 * The root the user chose (project dir or home) is canonicalised once; the
 * root itself may legitimately be reached through an alias. Everything below
 * it must be real directories.
 */
export function canonicalRoot(dir) {
  const resolved = path.resolve(dir);
  const st = lstatSafe(resolved);
  if (!st) throw new RefusedError(`root does not exist: ${resolved}`);
  const real = fs.realpathSync(resolved);
  if (!fs.statSync(real).isDirectory()) throw new RefusedError(`root is not a directory: ${resolved}`);
  return real;
}

/** Path components strictly below `root` down to and including `target`. */
export function componentsBelow(root, target) {
  const rel = path.relative(root, target);
  if (rel === "" || path.isAbsolute(rel) || rel.startsWith("..")) {
    throw new RefusedError(`target ${target} is not below root ${root}`);
  }
  const out = [];
  let cur = root;
  for (const part of rel.split(path.sep)) {
    cur = path.join(cur, part);
    out.push(cur);
  }
  return out;
}

/**
 * lstat every component below the root. A symbolic link or junction anywhere
 * on the path (including a dangling one) refuses the operation. Missing
 * trailing components are fine (they will be created).
 */
export function assertNoLinkOnPath(root, target) {
  for (const component of componentsBelow(root, target)) {
    const st = lstatSafe(component);
    if (!st) return; // nothing below this exists yet
    if (st.isSymbolicLink()) {
      throw new RefusedError(`refusing: ${component} is a symbolic link or junction; install into a real directory`, { link: component });
    }
    if (!st.isDirectory()) {
      throw new RefusedError(`refusing: ${component} exists and is not a directory`, { notDir: component });
    }
  }
}

/** Walk without following links; refuse any link or special file inside. */
export function assertTreeHasNoLinks(dir, label = "target") {
  const st = lstatSafe(dir);
  if (!st) return;
  if (st.isSymbolicLink()) throw new RefusedError(`refusing: ${label} ${dir} is a symbolic link or junction`, { link: dir });
  if (!st.isDirectory()) throw new RefusedError(`refusing: ${label} ${dir} is not a directory`);
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, entry.name);
      const est = fs.lstatSync(full);
      if (est.isSymbolicLink()) {
        throw new RefusedError(`refusing: ${label} contains a symbolic link or junction at ${full}; remove it by hand first`, { link: full });
      }
      if (est.isDirectory()) stack.push(full);
      else if (!est.isFile()) throw new RefusedError(`refusing: ${label} contains a special file at ${full}`);
    }
  }
}

function filesystemRoot(p) {
  return path.parse(path.resolve(p)).root;
}

/** Places that must never be a replace/remove target, whatever their name. */
export function assertNotProtected(target, { root, source, home }) {
  const protectedPaths = [root, source, repoRoot, home, os.homedir(), os.tmpdir(), filesystemRoot(target), process.cwd()]
    .filter(Boolean);
  for (const p of protectedPaths) {
    if (samePath(target, p)) throw new RefusedError(`refusing: ${target} is a protected location, not a skill folder`);
    if (isInside(target, p)) throw new RefusedError(`refusing: ${target} contains ${p}; not a skill folder`);
  }
  if (path.basename(target) !== SKILL_NAME) {
    throw new RefusedError(`refusing: ${target} is not an ${SKILL_NAME} folder`);
  }
}

export function targetDir(id, { global = false, projectDir = process.cwd(), home = os.homedir() } = {}) {
  const entry = ASSISTANTS[id];
  const base = global ? path.join(path.resolve(home), entry.global) : path.join(path.resolve(projectDir), entry.project);
  return path.join(base, SKILL_NAME);
}

function chosenRoot({ global = false, projectDir = process.cwd(), home = os.homedir() } = {}) {
  return global ? path.resolve(home) : path.resolve(projectDir);
}

// ---------------------------------------------------------------- trees

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const st = fs.lstatSync(full);
    if (st.isSymbolicLink()) throw new RefusedError(`refusing: symbolic link inside tree at ${full}`, { link: full });
    if (st.isDirectory()) walk(full, files);
    else if (st.isFile()) files.push(full);
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
 * Recursive copy with mkdirSync + copyFileSync, lstat per entry, links
 * refused. fs.cpSync is avoided on purpose: on the authoring machine it
 * silently skipped a destination whose parent had Turkish letters and a
 * space. COPYFILE_EXCL so an unexpected existing file is an error, not a
 * follow-the-link overwrite.
 */
export function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    const st = fs.lstatSync(from);
    if (st.isSymbolicLink()) throw new RefusedError(`refusing: source contains a symbolic link at ${from}`, { link: from });
    if (st.isDirectory()) copyTree(from, to);
    else if (st.isFile()) fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
    else throw new RefusedError(`refusing: source contains a special file at ${from}`);
  }
}

/**
 * Recursive delete with unlinkSync + rmdirSync, after a full lstat scan that
 * refuses any link inside. fs.rmSync({ recursive }) is avoided on purpose:
 * Node 24.13 on Windows returned without deleting anything (and without
 * throwing) when the path contained Turkish letters. `boundary` must be a
 * real directory that contains the target; nothing above it is touched.
 */
export function removeTree(target, { boundary } = {}) {
  if (boundary && (samePath(boundary, target) || !isInside(boundary, target))) {
    throw new RefusedError(`refusing: ${target} is not strictly inside ${boundary}`);
  }
  const st = lstatSafe(target);
  if (!st) return;
  if (st.isSymbolicLink()) throw new RefusedError(`refusing: ${target} is a symbolic link or junction; not deleting through it`, { link: target });
  if (!st.isDirectory()) throw new RefusedError(`refusing: ${target} is not a directory`);
  if (boundary) assertNoLinkOnPath(boundary, target);
  assertTreeHasNoLinks(target, "folder to delete");
  const dirs = [];
  const stack = [target];
  while (stack.length) {
    const cur = stack.pop();
    dirs.push(cur);
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, entry.name);
      if (fs.lstatSync(full).isDirectory()) stack.push(full);
      else fs.unlinkSync(full);
    }
  }
  for (const dir of dirs.reverse()) fs.rmdirSync(dir);
  if (lstatSafe(target)) throw new Error(`could not remove ${target}`);
}

function assertSkillSource(source) {
  if (!fs.existsSync(path.join(source, "SKILL.md"))) {
    throw new Error(`skill source has no SKILL.md: ${source}`);
  }
  assertTreeHasNoLinks(source, "skill source");
}

function isOurSkillFolder(dir) {
  const skill = path.join(dir, "SKILL.md");
  const st = lstatSafe(skill);
  if (!st || !st.isFile()) return false;
  const head = fs.readFileSync(skill, "utf8").slice(0, 400);
  return new RegExp(`^---\\r?\\n(?:.*\\r?\\n)*?name:\\s*${SKILL_NAME}\\s*$`, "m").test(head);
}

// ---------------------------------------------------------------- preflight

function preflight(id, options, { forRemove = false } = {}) {
  const { source = SKILL_SOURCE } = options;
  const root = canonicalRoot(chosenRoot(options));
  const dest = path.join(root, options.global ? ASSISTANTS[id].global : ASSISTANTS[id].project, SKILL_NAME);
  if (!isInside(root, dest) || samePath(root, dest)) throw new RefusedError(`refusing: ${dest} escapes ${root}`);
  const sourceReal = forRemove ? null : fs.realpathSync(path.resolve(source));
  if (sourceReal && (isInside(sourceReal, dest) || isInside(dest, sourceReal))) {
    throw new RefusedError(`refusing: source ${sourceReal} and target ${dest} overlap`);
  }
  assertNoLinkOnPath(root, dest);
  const st = lstatSafe(dest);
  if (st) assertTreeHasNoLinks(dest, "existing target");
  return { root, dest, exists: Boolean(st), source: sourceReal };
}

function stagingName(prefix) {
  return `.${SKILL_NAME}.${prefix}-${process.pid}-${crypto.randomBytes(4).toString("hex")}`;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

// ---------------------------------------------------------------- commands

export function installSkill(id, options = {}) {
  const { force = false, dryRun = false } = options;
  const { root, dest, exists, source } = preflight(id, options);
  assertSkillSource(source);
  const expected = treeHash(source);

  if (exists) {
    const same = treeHash(dest).tree === expected.tree;
    if (same) return { id, dest, action: "current", reason: "already installed with identical content" };
    if (!force) {
      return { id, dest, action: "conflict", reason: "existing folder differs from this package (local edits or another version); --force replaces it and keeps a backup next to it" };
    }
    assertNotProtected(dest, { root, source, home: options.home });
  }
  if (dryRun) {
    return { id, dest, action: exists ? "would-replace" : "would-install", tree: expected.tree, dryRun: true };
  }

  const parent = path.dirname(dest);
  fs.mkdirSync(parent, { recursive: true });
  assertNoLinkOnPath(root, dest); // re-check after mkdir
  const staging = path.join(parent, stagingName("staging"));
  let backup = null;
  try {
    copyTree(source, staging);
    const staged = treeHash(staging);
    if (staged.tree !== expected.tree) throw new Error(`staged copy at ${staging} does not match the source tree`);

    if (exists) {
      // Re-verify the target right before the swap.
      const st = lstatSafe(dest);
      if (!st || st.isSymbolicLink() || !st.isDirectory()) throw new RefusedError(`refusing: ${dest} changed during install`);
      assertTreeHasNoLinks(dest, "existing target");
      backup = path.join(parent, `${SKILL_NAME}.bak-${timestamp()}`);
      fs.renameSync(dest, backup);
    }
    try {
      fs.renameSync(staging, dest);
    } catch (err) {
      if (backup) fs.renameSync(backup, dest); // restore the previous copy
      throw err;
    }
    const actual = treeHash(dest).tree;
    if (actual !== expected.tree) {
      if (backup) {
        removeTree(dest, { boundary: parent });
        fs.renameSync(backup, dest);
      }
      throw new Error(`copy to ${dest} does not match the source tree`);
    }
    return exists
      ? { id, dest, action: "replaced", tree: actual, backup, reason: `previous folder kept at ${backup}` }
      : { id, dest, action: "installed", tree: actual };
  } finally {
    if (lstatSafe(staging)) removeTree(staging, { boundary: parent });
  }
}

export function removeSkill(id, options = {}) {
  const { dryRun = false } = options;
  const { root, dest, exists } = preflight(id, options, { forRemove: true });
  if (!exists) return { id, dest, action: "absent" };
  if (!isOurSkillFolder(dest)) {
    return { id, dest, action: "kept", reason: `no ${SKILL_NAME} SKILL.md at that path; not removing` };
  }
  assertNotProtected(dest, { root, source: options.source || SKILL_SOURCE, home: options.home });
  if (dryRun) return { id, dest, action: "would-remove", dryRun: true };
  removeTree(dest, { boundary: root });
  return { id, dest, action: "removed" };
}

export function statusSkill(id, options = {}) {
  const { source = SKILL_SOURCE } = options;
  const root = canonicalRoot(chosenRoot(options));
  const dest = path.join(root, options.global ? ASSISTANTS[id].global : ASSISTANTS[id].project, SKILL_NAME);
  try {
    assertNoLinkOnPath(root, dest);
    const st = lstatSafe(dest);
    if (!st) return { id, dest, action: "absent" };
    assertTreeHasNoLinks(dest, "existing target");
  } catch (err) {
    if (err instanceof RefusedError) return { id, dest, action: "unsupported", reason: err.message };
    throw err;
  }
  if (!isOurSkillFolder(dest)) return { id, dest, action: "foreign", reason: "folder exists but is not this skill" };
  const same = treeHash(dest).tree === treeHash(source).tree;
  return { id, dest, action: same ? "current" : "differs" };
}

// ---------------------------------------------------------------- cli

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--ai" || arg === "--agent" || arg === "-a") args.ai = argv[++i];
    else if (arg.startsWith("--ai=")) args.ai = arg.slice(5);
    else if (arg === "--global" || arg === "-g") args.global = true;
    else if (arg === "--force" || arg === "-f") args.force = true;
    else if (arg === "--dry-run" || arg === "-n") args.dryRun = true;
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

export function usage() {
  return [
    "Usage: art-director-skills <install|remove|status|list> --ai <ids|all> [--global] [--force] [--dry-run]",
    "",
    "Copies the full art-director skill (SKILL.md, references/, assets/) from this",
    "package into the skills folder each assistant documents. Nothing else is written.",
    "",
    "  --ai, -a       comma-separated assistant ids, or all (required)",
    "  --global, -g   home-directory skills folder instead of the current project",
    "  --force, -f    replace a differing existing folder (previous copy kept as art-director.bak-<time>)",
    "  --dry-run, -n  print the plan; write, delete, and back up nothing",
    "  --project-dir  project root (default: current directory)",
    "  --home         home directory override (tests)",
    "  --source       skill folder to copy (default: this package's skills/art-director)",
    "  --json         machine-readable output",
    "  --version      print the package version",
    "",
    "Exit codes: 0 done or nothing to do · 2 conflict/differs (nothing changed) · 1 error or refused.",
    "Targets, their parent folders, and their contents must be real directories; symbolic links",
    "and junctions are refused without changes. --force does not bypass that.",
    "",
    "Assistants:",
    ...ASSISTANT_IDS.map((id) => `  ${id.padEnd(10)} ${ASSISTANTS[id].label.padEnd(44)} ${ASSISTANTS[id].project}/  ~/${ASSISTANTS[id].global}/`),
    "  all        every assistant above (duplicate discovery in hosts that also read .agents/.claude trees)"
  ].join("\n");
}

export function main(argv = process.argv.slice(2), log = console.log) {
  const args = parseArgs(argv);
  const command = args._[0];
  if (args.help || !command) {
    log(usage());
    return 0;
  }
  if (command === "list") {
    log(usage().split("\nAssistants:\n")[1]);
    return 0;
  }
  const ids = resolveAssistants(args.ai);
  const options = {
    global: args.global, force: args.force, dryRun: args.dryRun,
    projectDir: args.projectDir, home: args.home, source: args.source
  };
  if (options.source) options.source = path.resolve(options.source);
  const run = { install: installSkill, remove: removeSkill, status: statusSkill }[command];
  if (!run) throw new Error(`unknown command ${command}. Use install, remove, status, or list`);
  const results = ids.map((id) => run(id, options));
  if (args.json) {
    log(JSON.stringify(results, null, 2));
  } else {
    for (const r of results) {
      const detail = r.reason ? ` — ${r.reason}` : "";
      log(`${r.action.padEnd(13)} ${r.id.padEnd(10)} ${r.dest}${detail}`);
      if (command === "install" && ["installed", "replaced"].includes(r.action) && ASSISTANTS[r.id].note) log(`              note: ${ASSISTANTS[r.id].note}`);
    }
  }
  return results.some((r) => ["differs", "conflict", "unsupported", "foreign"].includes(r.action)) ? 2 : 0;
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
