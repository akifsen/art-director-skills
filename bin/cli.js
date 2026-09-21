#!/usr/bin/env node
/**
 * art-director-skills CLI (bins: art-director-skills, art-director, art-director-skill).
 *
 *   npx art-director-skills install --ai cursor            full skill into .cursor/skills/art-director
 *   npx art-director-skills install --ai claude,codex --global
 *   npx art-director-skills status  --ai all
 *   npx art-director-skills remove  --ai kiro
 *   npx art-director-skills list | --help | --version
 *
 * Running with no arguments prints usage and writes nothing. The 0.9.1
 * single-file flags (--cursor → .cursorrules, --claude → CLAUDE.md, no-arg →
 * SKILL.md) overwrote project instruction files and followed symlinks; they
 * are retired and now stop with a message instead of writing.
 *
 * Native Node only. No dependencies, no network, no telemetry.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { main as installerMain, usage } from "../tooling/install-skill.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");

const useColor = process.stdout.isTTY && !process.env.NO_COLOR && process.env.TERM !== "dumb";
const paint = (code, text) => (useColor ? `\u001b[${code}m${text}\u001b[0m` : text);
const red = (t) => paint("31", t);

export const RETIRED_FLAGS = {
  "--cursor": { file: ".cursorrules", ai: "cursor" },
  "--claude": { file: "CLAUDE.md", ai: "claude" }
};

export function packageVersion() {
  return JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")).version;
}

export function retiredMessage(flag) {
  const { file, ai } = RETIRED_FLAGS[flag];
  return [
    `${flag} no longer writes ${file}. In 0.9.1 that flag overwrote an existing ${file} and followed`,
    "symbolic links; it was retired for that reason and nothing has been written now.",
    "",
    `Install the full skill (SKILL.md + references/ + assets/) where ${ai} discovers skills:`,
    `  npx art-director-skills install --ai ${ai}`,
    "",
    `Your ${file} and other instruction files are not touched by this package.`
  ].join("\n");
}

export function run(argv = process.argv.slice(2), io = { log: console.log, error: console.error }) {
  const first = argv[0];
  if (first === "--version" || first === "-v" || first === "version") {
    io.log(packageVersion());
    return 0;
  }
  if (first === undefined || first === "--help" || first === "-h" || first === "help") {
    io.log(usage());
    return 0;
  }
  const retired = argv.find((a) => RETIRED_FLAGS[a]);
  if (retired) {
    io.error(`${red("stopped")} ${retiredMessage(retired)}`);
    return 1;
  }
  return installerMain(argv, io.log);
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
    console.error(`${red(err.name === "RefusedError" ? "refused" : "error")} ${err.message}`);
    process.exit(1);
  }
}
