#!/usr/bin/env node
/**
 * art-director / art-director-skills CLI.
 *
 * Single-file mode (writes into the current working directory):
 *   npx art-director-skills            → ./SKILL.md
 *   npx art-director-skills --cursor   → ./.cursorrules
 *   npx art-director-skills --claude   → ./CLAUDE.md
 *
 * Full-skill mode (SKILL.md + references/ + assets/ into each assistant's
 * documented skills folder; see tooling/install-skill.mjs):
 *   npx art-director-skills install --ai cursor,claude [--global] [--force]
 *   npx art-director-skills status|remove --ai <ids|all>
 *   npx art-director-skills list
 *
 * Native Node only (fs, path, url). No dependencies, no network, no telemetry.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { main as installerMain } from "../tooling/install-skill.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const REPO_BLOB = "https://github.com/akifsen/art-director-skills/blob/main/skills/art-director/";

const useColor = process.stdout.isTTY && !process.env.NO_COLOR && process.env.TERM !== "dumb";
const paint = (code, text) => (useColor ? `\u001b[${code}m${text}\u001b[0m` : text);
const green = (t) => paint("32", t);
const yellow = (t) => paint("33", t);
const red = (t) => paint("31", t);
const dim = (t) => paint("2", t);

export const SINGLE_FILE_TARGETS = {
  default: { file: "SKILL.md", label: "project root SKILL.md", keepFrontmatter: true },
  cursor: { file: ".cursorrules", label: "Cursor rules", keepFrontmatter: false },
  claude: { file: "CLAUDE.md", label: "Claude project instructions", keepFrontmatter: false }
};

export function packageVersion() {
  return JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")).version;
}

/** Relative reference links only resolve inside the full skill folder; point a lone copy at the repository. */
export function rewriteRelativeLinks(markdown) {
  return markdown.replace(/\]\(((?:references|assets)\/[^)\s]+)\)/g, (_, rel) => `](${REPO_BLOB}${rel})`);
}

export function stripFrontmatter(markdown) {
  const m = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  return m ? markdown.slice(m[0].length).replace(/^\s+/, "") : markdown;
}

export function renderSingleFile(sourceDir, target) {
  const sourceFile = path.join(sourceDir, "SKILL.md");
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`source SKILL.md not found at ${sourceFile}. The package copy is incomplete; reinstall art-director-skills.`);
  }
  let text = fs.readFileSync(sourceFile, "utf8");
  if (!target.keepFrontmatter) text = stripFrontmatter(text);
  text = rewriteRelativeLinks(text);
  const header = target.keepFrontmatter
    ? ""
    : `<!-- art-director skill ${packageVersion()} · single-file copy for ${target.label}. Full skill with references: npx art-director-skills install --ai ${target === SINGLE_FILE_TARGETS.cursor ? "cursor" : "claude"} -->\n\n`;
  return header + text;
}

export function writeSingleFile(kind, { cwd = process.cwd(), source = path.join(packageRoot, "skills", "art-director"), log = console.log } = {}) {
  const target = SINGLE_FILE_TARGETS[kind];
  if (!target) throw new Error(`unknown target ${kind}`);
  const dest = path.join(cwd, target.file);
  const content = renderSingleFile(source, target);
  const existed = fs.existsSync(dest);
  if (existed) log(yellow(`Overwriting existing ${target.file}...`));
  fs.writeFileSync(dest, content, "utf8");
  log(`${green("✔")} ${target.label} written to ${dest}`);
  log(dim(`  ${content.split("\n").length} lines. Reference links point at the repository; for the full skill with references run:`));
  log(dim(`  npx art-director-skills install --ai ${kind === "default" ? "<assistant>" : kind}`));
  return { dest, existed };
}

function usage() {
  return [
    "Usage:",
    "  art-director-skills                 write SKILL.md into the current directory",
    "  art-director-skills --cursor        write .cursorrules into the current directory",
    "  art-director-skills --claude        write CLAUDE.md into the current directory",
    "  art-director-skills install --ai <ids|all> [--global] [--force]",
    "  art-director-skills status|remove --ai <ids|all> [--global]",
    "  art-director-skills list",
    "  art-director-skills --version",
    "",
    "Single-file mode accepts --source <skill-dir> (tests) and --cwd <dir>.",
    "Full-skill mode copies SKILL.md, references/ and assets/ to each assistant's documented folder."
  ].join("\n");
}

export function run(argv = process.argv.slice(2), io = { log: console.log, cwd: process.cwd() }) {
  const first = argv[0];
  if (first === "--version" || first === "-v" || first === "version") {
    io.log(packageVersion());
    return 0;
  }
  if (first === "--help" || first === "-h" || first === "help") {
    io.log(usage());
    return 0;
  }
  if (["install", "remove", "status", "list"].includes(first)) {
    return installerMain(argv);
  }

  let kind = "default";
  let source;
  let cwd = io.cwd;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--cursor") kind = "cursor";
    else if (arg === "--claude") kind = "claude";
    else if (arg === "--source") source = path.resolve(argv[++i] ?? "");
    else if (arg === "--cwd") cwd = path.resolve(argv[++i] ?? "");
    else throw new Error(`unknown option ${arg}\n\n${usage()}`);
  }
  writeSingleFile(kind, { cwd, source, log: io.log });
  return 0;
}

function realpathSafe(p) {
  try { return fs.realpathSync(p); } catch { return path.resolve(p); }
}
// npm's .bin entries are symlinks on POSIX; compare real paths so the shim still runs us.
const invokedDirectly = process.argv[1]
  && realpathSafe(process.argv[1]) === realpathSafe(fileURLToPath(import.meta.url));

if (invokedDirectly) {
  try {
    process.exit(run());
  } catch (err) {
    console.error(`${red("✖")} ${err.message}`);
    process.exit(1);
  }
}
