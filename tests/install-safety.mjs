// Installer safety: symbolic links, junctions, protected roots, rollback.
// Every scenario runs on synthetic fixtures under one temp root. For each
// negative case the check is not only the exit/throw but the existence and
// sha256 of every file that must survive. Nothing outside the temp root is
// used as a target.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  RefusedError,
  SKILL_SOURCE,
  installSkill,
  isInside,
  removeSkill,
  removeTree,
  statusSkill,
  targetDir,
  treeHash
} from "../tooling/install-skill.mjs";
import { repoRootPath } from "../tooling/validate-skill.mjs";

const root = repoRootPath();
const cli = path.join(root, "bin", "cli.js");
const win = process.platform === "win32";
const requireSymlinks = process.env.AD_REQUIRE_SYMLINKS === "1" || !win;
const tmp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "ad-safety-güvenlik ")));
const skipped = [];
let ran = 0;

const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
function snapshot(dir) {
  const rows = {};
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    for (const e of fs.readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, e.name);
      const st = fs.lstatSync(full);
      const rel = path.relative(dir, full);
      if (st.isSymbolicLink()) rows[rel] = `link:${fs.readlinkSync(full)}`;
      else if (st.isDirectory()) { rows[rel] = "dir"; stack.push(full); }
      else rows[rel] = sha(full);
    }
  }
  return rows;
}
function fixture(name) {
  const dir = path.join(tmp, name);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
function outsideTree(name) {
  const dir = fixture(name);
  fs.mkdirSync(path.join(dir, "deep"), { recursive: true });
  fs.writeFileSync(path.join(dir, "SKILL.md"), "---\nname: art-director\n---\n# user's own copy, must survive\n");
  fs.writeFileSync(path.join(dir, "notes.txt"), "sentinel one");
  fs.writeFileSync(path.join(dir, "deep", "keep.md"), "sentinel two");
  return dir;
}
/** Try to create a link; returns the link kind used or null (recorded as skipped). */
function tryLink(target, linkPath, kind) {
  const attempts = kind === "dir" ? (win ? ["junction", "dir"] : ["dir"]) : ["file"];
  for (const type of attempts) {
    try {
      fs.symlinkSync(target, linkPath, type);
      return type;
    } catch (err) {
      if (!["EPERM", "EACCES", "ENOSYS", "EINVAL"].includes(err.code)) throw err;
    }
  }
  skipped.push(`${kind} link at ${path.relative(tmp, linkPath)} (no privilege on this platform)`);
  return null;
}
function refuses(fn, label) {
  let err = null;
  try { fn(); } catch (e) { err = e; }
  assert.ok(err, `${label}: expected a refusal`);
  assert.ok(err instanceof RefusedError, `${label}: refusal is a RefusedError, got ${err.name}: ${err.message}`);
  return err;
}
function unchanged(before, dir, label) {
  assert.deepEqual(snapshot(dir), before, `${label}: ${path.relative(tmp, dir)} unchanged`);
}
const run = (cwd, ...args) => spawnSync(process.execPath, [cli, ...args], { cwd, encoding: "utf8", env: { ...process.env, NO_COLOR: "1" } });

// ---------------------------------------------------------------- isInside
assert.equal(isInside("/a/b", "/a/b/c"), true, "child inside");
assert.equal(isInside("/a/b", "/a/bc"), false, "sibling with shared prefix is not inside");
assert.equal(isInside("/a/b", "/a/b"), true, "same path counts as inside");
assert.equal(isInside("/a/b", "/a"), false, "parent is not inside child");
if (win) assert.equal(isInside("C:\\x", "D:\\x\\y"), false, "different drive is not inside");

// ---------------------------------------------------------------- 5. link at the target: remove / force-install / status
{
  const project = fixture("5 proje");
  const outside = outsideTree("5 dışarı");
  const dest = targetDir("cursor", { projectDir: project });
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const kind = tryLink(outside, dest, "dir");
  if (kind) {
    ran += 1;
    const before = snapshot(outside);
    refuses(() => removeSkill("cursor", { projectDir: project }), `remove through ${kind}`);
    unchanged(before, outside, `remove through ${kind}`);
    refuses(() => installSkill("cursor", { projectDir: project, force: true }), `force-install through ${kind}`);
    unchanged(before, outside, `force-install through ${kind}`);
    refuses(() => installSkill("cursor", { projectDir: project }), `install through ${kind}`);
    unchanged(before, outside, `install through ${kind}`);
    const st = statusSkill("cursor", { projectDir: project });
    assert.equal(st.action, "unsupported", "status names the link instead of following it");
    assert.ok(fs.lstatSync(dest).isSymbolicLink(), `${kind} itself still exists`);
    const viaCli = run(project, "remove", "--ai", "cursor");
    assert.equal(viaCli.status, 1, "cli remove through link exits 1");
    assert.match(viaCli.stderr, /refused/, "cli says refused");
    unchanged(before, outside, "cli remove through link");
    const forced = run(project, "install", "--ai", "cursor", "--force");
    assert.equal(forced.status, 1, "cli --force cannot bypass the link check");
    unchanged(before, outside, "cli force-install through link");
    console.log(`ok: 5. ${kind} at target — remove/install/--force refused, ${Object.keys(before).length} outside entries intact`);
  }
}

// ---------------------------------------------------------------- 6a. parent folder is a link
{
  const project = fixture("6a proje");
  const outside = fixture("6a dışarı skills");
  const other = path.join(outside, "art-director");
  fs.mkdirSync(other);
  fs.writeFileSync(path.join(other, "SKILL.md"), "---\nname: art-director\n---\nouter copy\n");
  fs.writeFileSync(path.join(outside, "sibling.txt"), "sentinel");
  const skillsDir = path.dirname(targetDir("codex", { projectDir: project }));
  fs.mkdirSync(path.dirname(skillsDir), { recursive: true });
  const kind = tryLink(outside, skillsDir, "dir");
  if (kind) {
    ran += 1;
    const before = snapshot(outside);
    refuses(() => installSkill("codex", { projectDir: project }), "install under linked parent");
    refuses(() => installSkill("codex", { projectDir: project, force: true }), "force-install under linked parent");
    refuses(() => removeSkill("codex", { projectDir: project }), "remove under linked parent");
    unchanged(before, outside, "linked parent");
    assert.equal(statusSkill("codex", { projectDir: project }).action, "unsupported", "status reports unsupported under linked parent");
    console.log(`ok: 6a. ${kind} parent — refused, outside intact`);
  }
}

// ---------------------------------------------------------------- 6b. dangling link at the target
{
  const project = fixture("6b proje");
  const dest = targetDir("kiro", { projectDir: project });
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const kind = tryLink(path.join(tmp, "6b does-not-exist"), dest, "dir");
  if (kind) {
    ran += 1;
    refuses(() => installSkill("kiro", { projectDir: project }), "install onto dangling link");
    refuses(() => removeSkill("kiro", { projectDir: project }), "remove dangling link");
    assert.ok(fs.lstatSync(dest).isSymbolicLink(), "dangling link left in place");
    assert.ok(!fs.existsSync(path.join(tmp, "6b does-not-exist")), "nothing created at the dangling link's target");
    assert.equal(statusSkill("kiro", { projectDir: project }).action, "unsupported", "dangling link is not reported as absent");
    console.log(`ok: 6b. dangling ${kind} — not treated as empty`);
  }
}

// ---------------------------------------------------------------- 6c/6d. links inside a real target
{
  const project = fixture("6c proje");
  const outsideDir = outsideTree("6c dışarı klasör");
  const outsideFile = path.join(fixture("6c dışarı dosya"), "secret.md");
  fs.writeFileSync(outsideFile, "sentinel file");
  const dest = targetDir("gemini", { projectDir: project });
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, "SKILL.md"), "---\nname: art-director\n---\nold\n");
  const dirLink = tryLink(outsideDir, path.join(dest, "references"), "dir");
  const fileLink = tryLink(outsideFile, path.join(dest, "linked.md"), "file");
  if (dirLink || fileLink) {
    ran += 1;
    const beforeDir = snapshot(outsideDir);
    const beforeFile = sha(outsideFile);
    refuses(() => removeSkill("gemini", { projectDir: project }), "remove target with inner link");
    refuses(() => installSkill("gemini", { projectDir: project, force: true }), "force-install over target with inner link");
    refuses(() => installSkill("gemini", { projectDir: project }), "install over target with inner link");
    unchanged(beforeDir, outsideDir, "inner dir link");
    assert.equal(sha(outsideFile), beforeFile, "inner file link target unchanged");
    assert.equal(statusSkill("gemini", { projectDir: project }).action, "unsupported", "status flags inner links");
    console.log(`ok: 6c/6d. inner ${[dirLink && "dir", fileLink && "file"].filter(Boolean).join("+")} link — refused, outside intact`);
  }
}

// ---------------------------------------------------------------- 2. retired flags with a linked .cursorrules
{
  const project = fixture("2 proje");
  const outsideFile = path.join(fixture("2 dışarı"), "rules.md");
  fs.writeFileSync(outsideFile, "user rules sentinel");
  fs.writeFileSync(path.join(project, "CLAUDE.md"), "claude sentinel");
  fs.writeFileSync(path.join(project, "SKILL.md"), "skill sentinel");
  fs.writeFileSync(path.join(project, "AGENTS.md"), "agents sentinel");
  tryLink(outsideFile, path.join(project, ".cursorrules"), "file");
  const before = snapshot(project);
  const outsideBefore = sha(outsideFile);
  for (const args of [[], ["--cursor"], ["--claude"], ["--help"], ["--version"], ["status", "--ai", "cursor"], ["install", "--ai", "cursor", "--dry-run"]]) {
    const r = run(project, ...args);
    assert.ok(r.status === 0 || r.status === 1, `${args.join(" ") || "(no args)"} exits cleanly (${r.status})`);
    unchanged(before, project, `after "${args.join(" ") || "(no args)"}"`);
    assert.equal(sha(outsideFile), outsideBefore, `linked .cursorrules target intact after "${args.join(" ")}"`);
  }
  ran += 1;
  console.log("ok: 2. retired flags, help, version, status, dry-run — instruction files and link targets intact");
}

// ---------------------------------------------------------------- 8. failed swap restores the previous copy
{
  const project = fixture("8 proje");
  const first = installSkill("cursor", { projectDir: project });
  assert.equal(first.action, "installed");
  const dest = first.dest;
  fs.appendFileSync(path.join(dest, "SKILL.md"), "\n<!-- user edit -->\n");
  const before = snapshot(dest);
  const realRename = fs.renameSync;
  let calls = 0;
  fs.renameSync = (a, b) => {
    calls += 1;
    if (calls === 2) throw Object.assign(new Error("simulated EPERM on rename"), { code: "EPERM" });
    return realRename(a, b);
  };
  let err = null;
  try { installSkill("cursor", { projectDir: project, force: true }); } catch (e) { err = e; }
  fs.renameSync = realRename;
  assert.ok(err && /simulated EPERM/.test(err.message), "rename failure surfaces");
  assert.deepEqual(snapshot(dest), before, "previous (edited) copy restored after failed swap");
  const leftovers = fs.readdirSync(path.dirname(dest)).filter((n) => n !== "art-director");
  assert.deepEqual(leftovers, [], `no staging or backup folders left: ${leftovers.join(", ")}`);
  ran += 1;
  console.log("ok: 8. failed rename — old copy restored, no leftovers");
}

// ---------------------------------------------------------------- 9. authorized replace/remove touches only the target
{
  const project = fixture("9 proje");
  const dest = targetDir("cursor", { projectDir: project });
  const skills = path.dirname(dest);
  fs.mkdirSync(path.join(skills, "other-skill"), { recursive: true });
  fs.writeFileSync(path.join(skills, "other-skill", "SKILL.md"), "---\nname: other\n---\n");
  fs.writeFileSync(path.join(project, ".cursor", "rules.md"), "user rules");
  fs.writeFileSync(path.join(project, "CLAUDE.md"), "claude");
  const neighbours = () => {
    const s = snapshot(project);
    for (const k of Object.keys(s)) if (k.startsWith(path.join(".cursor", "skills", "art-director"))) delete s[k];
    return s;
  };
  const before = neighbours();
  assert.equal(installSkill("cursor", { projectDir: project }).action, "installed");
  assert.equal(treeHash(dest).tree, treeHash(SKILL_SOURCE).tree, "installed tree equals source");
  fs.writeFileSync(path.join(dest, "SKILL.md"), "changed");
  const rep = installSkill("cursor", { projectDir: project, force: true });
  assert.equal(rep.action, "replaced");
  assert.equal(fs.readFileSync(path.join(rep.backup, "SKILL.md"), "utf8"), "changed", "backup keeps the user's version");
  removeTree(rep.backup, { boundary: skills });
  assert.deepEqual(neighbours(), before, "replace touched nothing beside the target");
  assert.equal(removeSkill("cursor", { projectDir: project }).action, "removed");
  assert.ok(!fs.existsSync(dest), "target removed");
  assert.deepEqual(neighbours(), before, "remove touched nothing beside the target");
  ran += 1;
  console.log("ok: 9. authorized replace/remove — only the verified target changed");
}

// ---------------------------------------------------------------- 10. overlap and protected roots
{
  const project = fixture("10 proje");
  const dest = targetDir("cursor", { projectDir: project });
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, "SKILL.md"), "---\nname: art-director\n---\n");
  refuses(() => installSkill("cursor", { projectDir: project, source: dest }), "source equals target");
  refuses(() => installSkill("cursor", { projectDir: project, source: path.dirname(dest) }), "target inside source");
  const before = snapshot(project);
  refuses(() => removeTree(project, { boundary: project }), "removeTree on the boundary itself");
  refuses(() => removeTree(path.join(tmp, "10 elsewhere"), { boundary: project }), "removeTree outside the boundary");
  refuses(() => removeTree(dest, { boundary: path.join(tmp, "10 elsewhere") }), "removeTree with an unrelated boundary");
  unchanged(before, project, "protected-root refusals");
  refuses(() => removeSkill("cursor", { projectDir: path.join(tmp, "10 missing root") }), "remove with a missing root");
  ran += 1;
  console.log("ok: 10. overlap / boundary / missing-root — refused without changes");
}

// ---------------------------------------------------------------- summary
for (const s of skipped) console.log(`SKIPPED (visible): ${s}`);
if (requireSymlinks && skipped.length) {
  console.error("symlink scenarios could not be created on a platform where they are required");
  process.exit(1);
}
assert.ok(ran >= 6, `at least six safety scenarios ran (${ran})`);
// Fixture cleanup: drop the links themselves first (never their targets), then the real tree.
(function unlinkLinks(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const st = fs.lstatSync(full);
    if (st.isSymbolicLink()) {
      try { fs.unlinkSync(full); } catch { fs.rmdirSync(full); }
    } else if (st.isDirectory()) unlinkLinks(full);
  }
})(tmp);
removeTree(tmp, { boundary: os.tmpdir() });
console.log(`installer safety ok: ${ran} scenario groups on ${process.platform}${skipped.length ? `, ${skipped.length} skipped` : ""}`);
