#!/usr/bin/env node
// Flags that require a value must fail before any filesystem change.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "bin", "cli.js");

function run(cwd, args) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" }
  });
}

const cases = [
  [["install", "--ai"], "--ai"],
  [["install", "--project-dir"], "--project-dir"],
  [["install", "--home"], "--home"],
  [["install", "--source"], "--source"],
  [["remove", "--ai"], "--ai"],
  [["remove", "--home"], "--home"],
  [["install", "--ai", "cursor", "--home", "--force"], "--home"],
  [["install", "--ai", "cursor", "--project-dir", "--dry-run"], "--project-dir"],
  [["install", "--ai", "--force"], "--ai"],
  [["remove", "--ai", "--global"], "--ai"],
  [["install", "--ai="], "--ai"],
  [["install", "--source", "--ai", "cursor"], "--source"]
];

for (const [args, flag] of cases) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "ad-cli-missing-"));
  fs.writeFileSync(path.join(cwd, "sentinel.txt"), "keep");
  const before = fs.readdirSync(cwd).sort();
  const result = run(cwd, args);
  const after = fs.readdirSync(cwd).sort();
  assert.notEqual(result.status, 0, `${args.join(" ")} exits non-zero, got ${result.status}: ${result.stderr}`);
  assert.match(result.stderr, new RegExp(`Missing value for ${flag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), `${args.join(" ")} stderr: ${result.stderr}`);
  assert.deepEqual(after, before, `${args.join(" ")} mutated the directory`);
  assert.equal(fs.readFileSync(path.join(cwd, "sentinel.txt"), "utf8"), "keep");
  fs.rmSync(cwd, { recursive: true, force: true });
  console.log("ok:", args.join(" "));
}

{
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "ad-cli-dry-"));
  const result = run(cwd, ["install", "--ai", "cursor", "--dry-run", "--project-dir", cwd]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.deepEqual(fs.readdirSync(cwd), [], "dry-run with real values writes nothing");
  fs.rmSync(cwd, { recursive: true, force: true });
  console.log("ok: dry-run with values writes nothing");
}

console.log("ok: missing CLI values exit non-zero and do not write");
