#!/usr/bin/env node
/**
 * Prepare isolated run folders for evals/SLIM-COMPARISON.md.
 *
 *   node evals/scripts/slim-setup.mjs --host cursor --runs 3
 *   node evals/scripts/slim-setup.mjs --host claude --cases 12-holdout-lumen-cart,06-mobile-nav
 *
 * Options:
 *   --host <id>        assistant id from tooling/install-skill.mjs (default cursor)
 *   --cases <a,b>      case folder names (default 12-holdout-lumen-cart,06-mobile-nav)
 *   --runs <n>         runs per arm per case (default 3)
 *   --old-ref <ref>    git ref for the 0.11.0 arm (default 13e96be)
 *   --slim-ref <ref>   git ref for the slim arm (default HEAD)
 *   --out <dir>        output folder (default evals/runs/slim-<YYYY-MM-DD>)
 *
 * Node only, no dependencies, works on Windows. Skill files are read with
 * `git show <ref>:<path>` so the old arm never sees new reference files.
 * Writes only under --out, which must not already exist.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ASSISTANTS } from "../../tooling/install-skill.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SKILL_PATH = "skills/art-director";

function parseArgs(argv) {
  const opts = {
    host: "cursor",
    cases: "12-holdout-lumen-cart,06-mobile-nav",
    runs: "3",
    "old-ref": "13e96be",
    "slim-ref": "HEAD",
    out: ""
  };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i].replace(/^--/, "");
    if (!(key in opts)) throw new Error(`unknown option ${argv[i]}`);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) throw new Error(`${argv[i]} needs a value`);
    opts[key] = value;
    i += 1;
  }
  return opts;
}

function git(args, encoding = "utf8") {
  const r = spawnSync("git", args, { cwd: root, encoding, maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) {
    const err = Buffer.isBuffer(r.stderr) ? r.stderr.toString() : r.stderr;
    throw new Error(`git ${args.join(" ")} failed: ${err || r.error}`);
  }
  return r.stdout;
}

function resolveRef(ref) {
  return git(["rev-parse", "--verify", `${ref}^{commit}`]).trim();
}

/** Returns [{ rel, data }] for every file under skills/art-director at a commit. */
function readSkillAt(commit) {
  const list = git(["ls-tree", "-r", "--name-only", commit, SKILL_PATH])
    .split("\n")
    .filter(Boolean);
  if (!list.length) throw new Error(`no ${SKILL_PATH} at ${commit}`);
  return list.map((file) => ({
    rel: path.posix.relative(SKILL_PATH, file),
    data: git(["show", `${commit}:${file}`], "buffer")
  }));
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function runTemplate({ caseId, arm, run, host, commit }) {
  return `# Run record — ${caseId} / ${arm} / r${run}

Fill in after the run. Keep it factual; do not score here.

- Host: ${host}
- Skill arm: ${arm}${commit ? ` (commit ${commit.slice(0, 7)})` : " (no skill installed)"}
- Model (as shown by the host):
- Date and time:
- Duration (first message → agent stopped):
- "Continue" nudges used (max 2):
- Follow-up questions the agent asked, and your answers:

## Skill use

- Skill loaded? (yes / no / unknown):
- Reference files opened (from the tool log, in order):
- Tokens used, if the host shows it:

## Result

- Builds / runs? (yes / no, command used):
- Screenshots saved to shots/ (390 px and 1440 px, every in-scope state): yes / no
- Anything the agent claimed that you could not confirm:
- Notes:
`;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const hostDef = ASSISTANTS[opts.host];
  if (!hostDef) throw new Error(`unknown --host ${opts.host} (one of ${Object.keys(ASSISTANTS).join(", ")})`);
  const runs = Number.parseInt(opts.runs, 10);
  if (!(runs >= 1 && runs <= 10)) throw new Error("--runs must be 1–10");

  const cases = opts.cases.split(",").map((s) => s.trim()).filter(Boolean);
  for (const c of cases) {
    const dir = path.join(root, "evals", "cases", c);
    if (!fs.existsSync(path.join(dir, "brief.md")) || !fs.existsSync(path.join(dir, "start"))) {
      throw new Error(`case ${c} needs brief.md and start/`);
    }
  }

  const date = new Date().toISOString().slice(0, 10);
  const out = path.resolve(root, opts.out || path.join("evals", "runs", `slim-${date}`));
  if (fs.existsSync(out)) throw new Error(`${out} already exists; pass --out to choose another folder`);

  const arms = [
    { id: "none", commit: null },
    { id: "v011", commit: resolveRef(opts["old-ref"]) },
    { id: "slim", commit: resolveRef(opts["slim-ref"]) }
  ];
  for (const arm of arms) arm.files = arm.commit ? readSkillAt(arm.commit) : [];

  const manifest = {
    protocol: "evals/SLIM-COMPARISON.md",
    created: new Date().toISOString(),
    host: opts.host,
    skillDir: hostDef.project,
    runsPerArm: runs,
    cases,
    arms: arms.map((a) => ({
      id: a.id,
      commit: a.commit,
      files: Object.fromEntries(a.files.map((f) => [f.rel, sha256(f.data)]))
    })),
    runOrder: []
  };

  for (const caseId of cases) {
    const caseDir = path.join(root, "evals", "cases", caseId);
    for (let r = 1; r <= runs; r += 1) {
      for (const arm of arms) {
        const runDir = path.join(out, caseId, `${arm.id}-r${r}`);
        fs.cpSync(path.join(caseDir, "start"), runDir, { recursive: true });
        fs.copyFileSync(path.join(caseDir, "brief.md"), path.join(runDir, "BRIEF.md"));
        fs.writeFileSync(path.join(runDir, "RUN.md"), runTemplate({ caseId, arm: arm.id, run: r, host: opts.host, commit: arm.commit }));
        fs.mkdirSync(path.join(runDir, "shots"), { recursive: true });
        const skillRoot = path.join(runDir, ...hostDef.project.split("/"), "art-director");
        for (const f of arm.files) {
          const dest = path.join(skillRoot, ...f.rel.split("/"));
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.writeFileSync(dest, f.data);
        }
        manifest.runOrder.push(path.relative(out, runDir).split(path.sep).join("/"));
      }
    }
  }

  fs.writeFileSync(path.join(out, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`prepared ${manifest.runOrder.length} run folders in ${out}`);
  console.log(`skill dir per run: ${hostDef.project}/art-director (none arm has no skill)`);
  console.log("run them in manifest.json runOrder; see evals/SLIM-COMPARISON.md");
}

try {
  main();
} catch (err) {
  console.error(`error ${err.message}`);
  process.exit(1);
}
