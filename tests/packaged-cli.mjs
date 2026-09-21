#!/usr/bin/env node
// Consumer test on the real tarball: `npm pack` → inventory check → offline
// `npm install <tgz>` in an empty temp project → run the packaged bin (not the
// repo's source scripts) for install/status/conflict/force/remove, the
// retired flags, and a junction/symlink refusal. Installed files must equal
// the repository's skills/art-director tree file-for-file.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { repoRootPath } from "../tooling/validate-skill.mjs";
import { removeTree, treeHash } from "../tooling/install-skill.mjs";

const root = repoRootPath();
const npmCli = (() => {
  // Resolve npm's JS entry so we never spawn npm.cmd / shell:true.
  // Same lookup as tooling/npx.mjs: npm_execpath (set under npm scripts), then Node's own layouts.
  const nodeDir = path.dirname(process.execPath);
  const candidates = [
    process.env.npm_execpath && path.join(path.dirname(process.env.npm_execpath), "npm-cli.js"),
    path.join(nodeDir, "node_modules", "npm", "bin", "npm-cli.js"),
    path.join(nodeDir, "..", "lib", "node_modules", "npm", "bin", "npm-cli.js"),
    path.join(nodeDir, "..", "node_modules", "npm", "bin", "npm-cli.js")
  ].filter(Boolean);
  const found = candidates.find((f) => fs.existsSync(f));
  if (found) return path.resolve(found);
  throw new Error(`cannot locate npm-cli.js next to Node (${process.execPath}); tried ${candidates.join(", ")}`);
})();
const npm = (args, opts = {}) => spawnSync(process.execPath, [npmCli, ...args], {
  encoding: "utf8",
  env: { ...process.env, NO_COLOR: "1", npm_config_update_notifier: "false", npm_config_fund: "false", npm_config_audit: "false" },
  ...opts
});

const work = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "ad-packaged tüketici ")));
const packDir = path.join(work, "pack");
const consumer = path.join(work, "consumer projesi");
fs.mkdirSync(packDir);
fs.mkdirSync(consumer);

// 1. Pack and check the inventory against the source tree (no fixed file count).
const packed = npm(["pack", "--json", "--pack-destination", packDir], { cwd: root });
assert.equal(packed.status, 0, `npm pack: ${packed.stderr}`);
// prepack (validate-skill) prints before npm's JSON; take the JSON array at the end.
const info = JSON.parse(packed.stdout.slice(packed.stdout.indexOf("\n[") + 1))[0];
const tgz = path.join(packDir, info.filename);
assert.ok(fs.existsSync(tgz), "tarball written");
const shipped = new Set(info.files.map((f) => f.path.replaceAll("\\", "/")));
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const source = path.join(root, "skills", "art-director");
const sourceHash = treeHash(source);
for (const [rel] of sourceHash.rows) {
  assert.ok(shipped.has(`skills/art-director/${rel}`), `tarball ships skills/art-director/${rel}`);
}
for (const must of ["bin/cli.js", "tooling/install-skill.mjs", "package.json", "README.md", "LICENSE", "CHANGELOG.md", "docs/installation.md", "docs/compatibility.md", "docs/migration.md", "docs/sources.md"]) {
  assert.ok(shipped.has(must), `tarball ships ${must}`);
}
// Shipped markdown must not link to files that are not in the tarball.
for (const doc of [...shipped].filter((f) => f.endsWith(".md") && !f.startsWith("skills/"))) {
  const text = fs.readFileSync(path.join(root, doc), "utf8");
  for (const m of text.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)) {
    const link = m[1];
    if (/^[a-z]+:/.test(link)) continue;
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(doc), link));
    assert.ok(shipped.has(resolved), `${doc} links to ${link} which is not in the tarball`);
  }
}
for (const f of shipped) {
  assert.ok(!/^(evals|tests|dist|playwright|\.playwright)/.test(f), `tarball does not ship ${f}`);
}
assert.ok(!pkg.scripts.postinstall && !pkg.scripts.preinstall && !pkg.scripts.prepare, "no install-time scripts");
assert.deepEqual(pkg.dependencies ?? {}, {}, "no runtime dependencies");
console.log(`ok: tarball ${info.filename} — ${shipped.size} files, skill tree complete, no eval/test payload`);

// 2. Offline install into the consumer project.
fs.writeFileSync(path.join(consumer, "package.json"), JSON.stringify({ name: "consumer", private: true, version: "0.0.0" }));
const installed = npm(["install", "--offline", "--ignore-scripts", "--no-package-lock", tgz], { cwd: consumer });
assert.equal(installed.status, 0, `npm install <tgz> offline: ${installed.stderr}`);
const pkgDir = path.join(consumer, "node_modules", "art-director-skills");
const bin = path.join(pkgDir, "bin", "cli.js");
assert.ok(fs.existsSync(bin), "packaged bin present");
assert.equal(treeHash(path.join(pkgDir, "skills", "art-director")).tree, sourceHash.tree, "packaged skill tree equals repository source");
for (const alias of Object.keys(pkg.bin)) {
  const shim = fs.readdirSync(path.join(consumer, "node_modules", ".bin")).some((n) => n === alias || n.startsWith(`${alias}.`));
  assert.ok(shim, `.bin shim for ${alias}`);
}

const cli = (args, cwd = consumer) => spawnSync(process.execPath, [bin, ...args], { cwd, encoding: "utf8", env: { ...process.env, NO_COLOR: "1" } });
const sha = (f) => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
const listing = (dir) => fs.readdirSync(dir).sort().join(",");

// 3. Non-mutating surface through the packaged bin.
fs.writeFileSync(path.join(consumer, ".cursorrules"), "consumer rules");
fs.writeFileSync(path.join(consumer, "CLAUDE.md"), "consumer claude");
fs.writeFileSync(path.join(consumer, "SKILL.md"), "consumer skill");
const before = { list: listing(consumer), rules: sha(path.join(consumer, ".cursorrules")), claude: sha(path.join(consumer, "CLAUDE.md")), skill: sha(path.join(consumer, "SKILL.md")) };
const check = (label) => {
  assert.equal(listing(consumer), before.list, `${label}: no new files in the project root`);
  assert.equal(sha(path.join(consumer, ".cursorrules")), before.rules, `${label}: .cursorrules intact`);
  assert.equal(sha(path.join(consumer, "CLAUDE.md")), before.claude, `${label}: CLAUDE.md intact`);
  assert.equal(sha(path.join(consumer, "SKILL.md")), before.skill, `${label}: SKILL.md intact`);
};
const v = cli(["--version"]);
assert.equal(v.stdout.trim(), pkg.version, "packaged --version");
check("--version");
const noArg = cli([]);
assert.ok(noArg.status === 0 && /Usage: art-director-skills/.test(noArg.stdout), "no-arg prints usage");
check("no-arg");
for (const flag of ["--cursor", "--claude"]) {
  const r = cli([flag]);
  assert.ok(r.status === 1 && /no longer writes/.test(r.stderr), `${flag} retired`);
  check(flag);
}
console.log("ok: packaged no-arg / --version / retired flags — project instruction files untouched");

// 4. Full install, idempotence, conflict, force with backup, remove.
const first = cli(["install", "--ai", "cursor,codex", "--json"]);
assert.equal(first.status, 0, `install: ${first.stderr}`);
assert.deepEqual(JSON.parse(first.stdout).map((r) => r.action), ["installed", "installed"], "two fresh installs");
const dest = path.join(consumer, ".cursor", "skills", "art-director");
assert.equal(treeHash(dest).tree, sourceHash.tree, "installed cursor tree equals repository source (all references and assets, same version)");
assert.equal(treeHash(path.join(consumer, ".agents", "skills", "art-director")).tree, sourceHash.tree, "installed codex tree equals source");
assert.ok(!fs.readFileSync(path.join(dest, "SKILL.md"), "utf8").includes("github.com/akifsen/art-director-skills/blob/main"), "installed SKILL.md keeps relative links, not moving main URLs");
before.list = listing(consumer); // .cursor/.agents now exist
check("after install");

const again = cli(["install", "--ai", "cursor", "--json"]);
assert.equal(JSON.parse(again.stdout)[0].action, "current", "re-install is idempotent");
fs.appendFileSync(path.join(dest, "SKILL.md"), "\n<!-- consumer edit -->\n");
const editedHash = sha(path.join(dest, "SKILL.md"));
const conflict = cli(["install", "--ai", "cursor", "--json"]);
assert.equal(conflict.status, 2, "conflict exits 2");
assert.equal(JSON.parse(conflict.stdout)[0].action, "conflict", "differing folder reported as conflict");
assert.equal(sha(path.join(dest, "SKILL.md")), editedHash, "conflict leaves the edit in place");
const status = cli(["status", "--ai", "cursor"]);
assert.equal(status.status, 2, "status differs exits 2");
const forced = cli(["install", "--ai", "cursor", "--force", "--json"]);
assert.equal(forced.status, 0, `force: ${forced.stderr}`);
const fr = JSON.parse(forced.stdout)[0];
assert.equal(fr.action, "replaced", "--force replaces");
assert.equal(sha(path.join(fr.backup, "SKILL.md")), editedHash, "backup keeps the edited file");
assert.equal(treeHash(dest).tree, sourceHash.tree, "replaced tree equals source");
removeTree(fr.backup, { boundary: path.dirname(dest) });
const removed = cli(["remove", "--ai", "codex", "--json"]);
assert.equal(JSON.parse(removed.stdout)[0].action, "removed", "remove");
assert.ok(!fs.existsSync(path.join(consumer, ".agents", "skills", "art-director")), "codex copy gone");
assert.ok(fs.existsSync(dest), "cursor copy untouched by codex remove");
console.log("ok: packaged install/current/conflict/force+backup/remove");

// 5. Link refusal through the packaged bin (junction on Windows, symlink elsewhere).
{
  const outside = path.join(work, "dışarıdaki gerçek klasör");
  fs.mkdirSync(outside);
  fs.writeFileSync(path.join(outside, "SKILL.md"), "---\nname: art-director\n---\nkeep\n");
  fs.writeFileSync(path.join(outside, "keep.txt"), "sentinel");
  const kiroDest = path.join(consumer, ".kiro", "skills", "art-director");
  fs.mkdirSync(path.dirname(kiroDest), { recursive: true });
  let linked = null;
  for (const type of process.platform === "win32" ? ["junction", "dir"] : ["dir"]) {
    try { fs.symlinkSync(outside, kiroDest, type); linked = type; break; } catch (err) { if (!["EPERM", "EACCES"].includes(err.code)) throw err; }
  }
  if (linked) {
    const outsideBefore = [sha(path.join(outside, "SKILL.md")), sha(path.join(outside, "keep.txt"))];
    for (const args of [["remove", "--ai", "kiro"], ["install", "--ai", "kiro", "--force"], ["install", "--ai", "kiro"]]) {
      const r = cli(args);
      assert.equal(r.status, 1, `${args.join(" ")} through ${linked} exits 1`);
      assert.match(r.stderr, /refused/, `${args.join(" ")} says refused`);
    }
    assert.deepEqual([sha(path.join(outside, "SKILL.md")), sha(path.join(outside, "keep.txt"))], outsideBefore, "outside sentinels intact");
    assert.ok(fs.lstatSync(kiroDest).isSymbolicLink(), "link left in place");
    // Remove the link itself (junction needs rmdir on Windows; symlink needs unlink on POSIX), never its target.
    try { fs.unlinkSync(kiroDest); } catch { fs.rmdirSync(kiroDest); }
    assert.ok(fs.existsSync(path.join(outside, "keep.txt")), "removing the link did not touch its target");
    console.log(`ok: packaged remove/force-install through ${linked} refused, outside intact`);
  } else {
    console.log("SKIPPED (visible): link creation not permitted here; packaged link refusal not exercised");
    if (process.env.AD_REQUIRE_SYMLINKS === "1") process.exit(1);
  }
}

// 6. Bin aliases through npm's shim (offline, local package only).
for (const alias of Object.keys(pkg.bin)) {
  const r = npm(["exec", "--offline", "--no", "--", alias, "--version"], { cwd: consumer });
  assert.equal(r.stdout.trim(), pkg.version, `alias ${alias} resolves to this package (${r.stderr})`);
}
console.log(`ok: bin aliases ${Object.keys(pkg.bin).join(", ")} via npm exec`);

removeTree(work, { boundary: os.tmpdir() });
console.log(`packaged cli ok: ${info.filename} verified in a clean consumer project on ${process.platform}`);
