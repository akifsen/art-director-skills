/**
 * Layer: subprocess helper. Not a skills CLI install and not a native runtime.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { duplicateKeysInJson } from "../tooling/unique-json-keys.mjs";
import { formatSpawnFailure, resolveNpxCli, runNodeCli, runNpx } from "../tooling/npx.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const echoArgv = path.join(root, "tests", "fixtures", "echo-argv.mjs");
const exit3 = path.join(root, "tests", "fixtures", "exit-3.mjs");
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log("ok:", name);
  } catch (err) {
    failed += 1;
    console.error("FAIL:", name, err.message);
  }
}

test("JSON.parse hides duplicate keys that the walker reports", () => {
  const raw = `{"scripts":{"test":"a","test":"b","example:kiln":"old","example:kiln":"vite"}}`;
  const parsed = JSON.parse(raw);
  assert.equal(parsed.scripts.test, "b");
  assert.equal(parsed.scripts["example:kiln"], "vite");
  assert.deepEqual(duplicateKeysInJson(raw).sort(), ["example:kiln", "test"]);
});

test("package.json scripts have unique keys", () => {
  const raw = fs.readFileSync(path.join(root, "package.json"), "utf8");
  const dupes = duplicateKeysInJson(raw);
  assert.deepEqual(dupes, [], `duplicate JSON keys: ${dupes.join(", ")}`);
});

test("npx-cli.js resolves next to this Node without a .cmd spawn", () => {
  const cli = resolveNpxCli();
  assert.match(cli, /npx-cli\.js$/);
  assert.equal(cli.endsWith(".cmd"), false);
});

test("node argv preserves spaces, Turkish letters, and shell metacharacters", () => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "ad-yönetmen yol-"));
  const args = [
    "hello",
    "x & echo pwned",
    "art-yönetmen kopya",
    work,
    "$(whoami)"
  ];
  const result = runNodeCli(echoArgv, args, { cwd: work, timeout: 10000 });
  assert.equal(result.error, undefined, formatSpawnFailure("echo-argv", result));
  assert.equal(result.status, 0, formatSpawnFailure("echo-argv", result));
  assert.equal(String(result.stderr || ""), "");
  assert.deepEqual(JSON.parse(result.stdout), args);
});

test("failed child status and stderr are reported separately from stdout", () => {
  const result = runNodeCli(exit3, [], { timeout: 10000 });
  assert.equal(result.status, 3);
  assert.match(String(result.stderr), /install failed on purpose/);
  assert.equal(String(result.stdout || ""), "");
  const report = formatSpawnFailure("skills add --copy", result);
  assert.match(report, /status: 3/);
  assert.match(report, /stderr:\ninstall failed on purpose/);
});

test("runNpx --version talks to the real npx CLI", () => {
  const result = runNpx(["--version"], { timeout: 20000 });
  assert.equal(result.error, undefined, formatSpawnFailure("npx --version", result));
  assert.equal(result.status, 0, formatSpawnFailure("npx --version", result));
  assert.match(String(result.stdout || result.stderr), /\d+\.\d+/);
});

if (failed) {
  console.error(`\n${failed} npx/json helper failure(s)`);
  process.exit(1);
}
console.log("\nnpx and json-key checks passed");
