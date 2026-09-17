/**
 * Run the npm-shipped npx CLI through Node, without a shell.
 * Node cannot spawn Windows `.cmd` files with `shell: false`
 * (https://nodejs.org/api/child_process.html#spawning-bat-and-cmd-files-on-windows,
 * retrieved 2026-09-17). `shell: true` is not used: args stay argv.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export function resolveNpxCli(execPath = process.execPath, env = process.env) {
  const files = [];
  if (env.npm_execpath) {
    files.push(path.join(path.dirname(env.npm_execpath), "npx-cli.js"));
  }
  const nodeDir = path.dirname(execPath);
  files.push(
    path.join(nodeDir, "node_modules", "npm", "bin", "npx-cli.js"),
    path.join(nodeDir, "..", "lib", "node_modules", "npm", "bin", "npx-cli.js"),
    path.join(nodeDir, "..", "node_modules", "npm", "bin", "npx-cli.js")
  );
  for (const file of files) {
    if (file && fs.existsSync(file)) return path.resolve(file);
  }
  throw new Error(
    `npx-cli.js not found next to Node (${execPath}). Install npm with Node; do not spawn npx.cmd.`
  );
}

export function runNodeCli(cliPath, args, options = {}) {
  const { env, cwd, timeout, input, encoding = "utf8" } = options;
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    env,
    input,
    encoding,
    timeout,
    shell: false,
    windowsHide: true,
    stdio: ["pipe", "pipe", "pipe"],
    maxBuffer: 16 * 1024 * 1024
  });
}

export function runNpx(args, options = {}) {
  return runNodeCli(resolveNpxCli(process.execPath, options.env || process.env), args, options);
}

export function formatSpawnFailure(label, result) {
  const lines = [`${label} failed`];
  if (result.error) {
    lines.push(`spawn error: ${result.error.code || ""} ${result.error.message}`);
  }
  lines.push(`status: ${result.status === null || result.status === undefined ? "null" : result.status}`);
  if (result.signal) lines.push(`signal: ${result.signal}`);
  const stdout = String(result.stdout || "");
  const stderr = String(result.stderr || "");
  if (stdout) lines.push(`stdout:\n${stdout}`);
  if (stderr) lines.push(`stderr:\n${stderr}`);
  return lines.join("\n");
}
