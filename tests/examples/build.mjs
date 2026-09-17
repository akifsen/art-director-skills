/**
 * Layer: Vite production build of the tutorial React apps.
 * Maintainer path only. Not a skill runtime and not a custom JSX compiler.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { formatSpawnFailure, runNodeCli } from "../../tooling/npx.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(import.meta.url);

let viteBin;
try {
  viteBin = require.resolve("vite/bin/vite.js");
} catch {
  console.error("vite is not installed. From the repo root run npm ci (maintainer lockfile).");
  process.exit(1);
}

function build(configRel) {
  const result = runNodeCli(
    viteBin,
    ["build", "--config", configRel],
    { cwd: root, timeout: 120000, env: process.env }
  );
  if (result.status !== 0 || result.error) {
    console.error(formatSpawnFailure(`vite build ${configRel}`, result));
    process.exit(result.status || 1);
  }
  process.stdout.write(result.stdout || "");
  if (result.stderr) process.stderr.write(result.stderr);
}

build("evals/apps/kiln-queue/vite.config.js");
build("evals/apps/nadir-desk/vite.config.js");

const kilnDir = path.join(root, "evals/artifacts/kiln-queue");
const deskDir = path.join(root, "evals/artifacts/nadir-desk");
const kilnHtml = fs.readFileSync(path.join(kilnDir, "index.html"), "utf8");
const deskHtml = fs.readFileSync(path.join(deskDir, "index.html"), "utf8");
assert.match(kilnHtml, /<div id="root">/);
assert.match(deskHtml, /<div id="root">/);
assert.match(kilnHtml, /main\.jsx|\/assets\//);
assert.match(deskHtml, /main\.jsx|\/assets\//);

const kilnAssets = fs.readdirSync(path.join(kilnDir, "assets"));
const deskAssets = fs.readdirSync(path.join(deskDir, "assets"));
const kilnJs = fs.readFileSync(path.join(kilnDir, "assets", kilnAssets.find((f) => f.endsWith(".js"))), "utf8");
const deskJs = fs.readFileSync(path.join(deskDir, "assets", deskAssets.find((f) => f.endsWith(".js"))), "utf8");
assert.match(kilnJs, /Loads in fire/);
assert.match(kilnJs, /Log a temperature hold/);
assert.match(deskJs, /Morning list/);
assert.match(deskJs, /commitNote|Save note/);
assert.doesNotMatch(kilnJs, /React\.createElement\(React\.Fragment/);

console.log("vite example builds ok");
