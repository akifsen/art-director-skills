#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  checkContextBudget,
  loadBudgetConfig,
  measureText,
  normalizeLf,
  readMeasuredFile,
  resolveUnderSkillRoot,
  sumProfileLf,
  toJsonSummary,
  validateRelativeSkillPath
} from "../tooling/context-budget.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(root, "skills", "art-director");
const configPath = path.join(root, "tooling", "context-budget.config.json");
const budgetCli = path.join(root, "tooling", "context-budget.mjs");

assert.equal(normalizeLf("a\r\nb\rc"), "a\nb\nc");
const emoji = measureText("é🎨");
assert.ok(emoji.utf8Bytes > emoji.lfChars, "multibyte UTF-8 counts bytes, not code units only");
assert.equal(emoji.tokenProxy, Math.ceil(emoji.utf8Bytes / 4));

assert.throws(() => validateRelativeSkillPath("../secret.md"), /escapes/);
assert.throws(() => validateRelativeSkillPath("a\\b.md"), /forward slashes/);

const inside = resolveUnderSkillRoot(skillRoot, "SKILL.md");
assert.ok(inside.endsWith("SKILL.md"));
assert.throws(() => resolveUnderSkillRoot(skillRoot, "../../package.json"), /escapes/);

loadBudgetConfig(configPath);

const live = checkContextBudget({ repoRoot: root, configPath });
assert.equal(live.ok, true, live.violations.join("; "));
assert.ok(live.measurements["SKILL.md"].lfChars <= 8625, "entry SKILL.md within 8625 LF chars");
assert.ok(live.measurements["references/web-quality.md"], "web-quality is measured");

const dup = sumProfileLf(skillRoot, ["SKILL.md", "SKILL.md", "references/implementation.md"]);
assert.equal(
  dup.totalLfChars,
  live.measurements["SKILL.md"].lfChars + live.measurements["references/implementation.md"].lfChars
);

const alias = sumProfileLf(skillRoot, ["SKILL.md", "./SKILL.md", "references/implementation.md"]);
assert.equal(alias.totalLfChars, dup.totalLfChars, "canonical duplicate profile paths dedupe");

assert.equal(measureText("a\r\nb\r\nc").lfChars, measureText("a\nb\nc").lfChars);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ad-budget-"));
try {
  const badConfig = path.join(tmp, "bad-aggregate.json");
  fs.writeFileSync(
    badConfig,
    JSON.stringify({ skillRoot: "skills/art-director", aggregateInstructionalMarkdownMax: -1 })
  );
  assert.throws(() => loadBudgetConfig(badConfig), /aggregateInstructionalMarkdownMax/);

  const emptyMaps = path.join(tmp, "empty.json");
  fs.writeFileSync(
    emptyMaps,
    JSON.stringify({
      skillRoot: "skills/art-director",
      aggregateInstructionalMarkdownMax: 1000,
      perFileMaxLfChars: {},
      corpus: { studies: { maxLfChars: 1, files: ["x.md"] }, examples: { maxLfChars: 1, files: ["x.md"] }, template: { maxLfChars: 1, files: ["x.md"] } },
      profiles: {}
    })
  );
  assert.throws(() => loadBudgetConfig(emptyMaps), /perFileMaxLfChars must not be empty/);

  const emptyProfiles = path.join(tmp, "empty-profiles.json");
  const base = JSON.parse(fs.readFileSync(configPath, "utf8"));
  base.profiles = {};
  base.required = { profiles: [] };
  fs.writeFileSync(emptyProfiles, JSON.stringify(base));
  assert.throws(() => loadBudgetConfig(emptyProfiles), /profiles must not be empty/);

  const overConfig = path.join(tmp, "over.json");
  const over = JSON.parse(fs.readFileSync(configPath, "utf8"));
  over.perFileMaxLfChars["SKILL.md"] = 1;
  fs.writeFileSync(overConfig, JSON.stringify(over));
  const overResult = checkContextBudget({ repoRoot: root, configPath: overConfig });
  assert.equal(overResult.ok, false);
  assert.ok(overResult.violations.some((v) => v.includes("SKILL.md")));

  const missingConfig = path.join(tmp, "missing.json");
  const miss = JSON.parse(fs.readFileSync(configPath, "utf8"));
  miss.perFileMaxLfChars["references/no-such-file.md"] = 10;
  fs.writeFileSync(missingConfig, JSON.stringify(miss));
  const missingResult = checkContextBudget({ repoRoot: root, configPath: missingConfig });
  assert.equal(missingResult.ok, false);
  assert.ok(missingResult.violations.some((v) => v.includes("missing on disk")));

  const profileOver = path.join(tmp, "profile-over.json");
  const po = JSON.parse(fs.readFileSync(configPath, "utf8"));
  po.profiles["design-web"].maxLfChars = 1;
  fs.writeFileSync(profileOver, JSON.stringify(po));
  const profileOverResult = checkContextBudget({ repoRoot: root, configPath: profileOver });
  assert.equal(profileOverResult.ok, false);
  assert.ok(profileOverResult.violations.some((v) => v.includes("profile design-web")));

  const corpusOver = path.join(tmp, "corpus-over.json");
  const co = JSON.parse(fs.readFileSync(configPath, "utf8"));
  co.corpus.template.maxLfChars = 1;
  fs.writeFileSync(corpusOver, JSON.stringify(co));
  const corpusOverResult = checkContextBudget({ repoRoot: root, configPath: corpusOver });
  assert.equal(corpusOverResult.ok, false);
  assert.ok(corpusOverResult.violations.some((v) => v.includes("corpus template")));

  const unbudgetedDir = fs.mkdtempSync(path.join(os.tmpdir(), "ad-budget-skill-"));
  const miniSkill = path.join(unbudgetedDir, "art-director");
  fs.mkdirSync(path.join(miniSkill, "references", "studies"), { recursive: true });
  fs.mkdirSync(path.join(miniSkill, "references", "examples"), { recursive: true });
  fs.mkdirSync(path.join(miniSkill, "assets"), { recursive: true });
  fs.writeFileSync(path.join(miniSkill, "SKILL.md"), "# x\n", "utf8");
  fs.writeFileSync(path.join(miniSkill, "references", "extra.md"), "# y\n", "utf8");
  fs.writeFileSync(path.join(miniSkill, "references", "studies", "x.md"), "# s\n", "utf8");
  fs.writeFileSync(path.join(miniSkill, "references", "examples", "x.md"), "# e\n", "utf8");
  fs.writeFileSync(path.join(miniSkill, "assets", "x.md"), "# t\n", "utf8");
  const miniConfig = path.join(tmp, "mini.json");
  fs.writeFileSync(
    miniConfig,
    JSON.stringify({
      skillRoot: "skills/art-director",
      aggregateInstructionalMarkdownMax: 99999,
      perFileMaxLfChars: {
        "SKILL.md": 99999,
        "references/studies/x.md": 99999,
        "references/examples/x.md": 99999,
        "assets/x.md": 99999
      },
      corpus: {
        studies: { maxLfChars: 99999, files: ["references/studies/x.md"] },
        examples: { maxLfChars: 99999, files: ["references/examples/x.md"] },
        template: { maxLfChars: 99999, files: ["assets/x.md"] }
      },
      profiles: { mini: { maxLfChars: 99999, files: ["SKILL.md"] } },
      required: { profiles: ["mini"] }
    })
  );
  const unbudgeted = checkContextBudget({ repoRoot: root, configPath: miniConfig, skillRoot: miniSkill });
  assert.equal(unbudgeted.ok, false);
  assert.ok(unbudgeted.violations.some((v) => v.includes("lacks per-file budget")));
  fs.rmSync(unbudgetedDir, { recursive: true, force: true });

  if (process.platform !== "win32") {
    const escapeDir = fs.mkdtempSync(path.join(os.tmpdir(), "ad-budget-escape-"));
    const escapeSkill = path.join(escapeDir, "art-director");
    fs.mkdirSync(escapeSkill, { recursive: true });
    fs.writeFileSync(path.join(escapeSkill, "SKILL.md"), "# skill\n", "utf8");
    const outside = path.join(escapeDir, "outside.md");
    fs.writeFileSync(outside, "# outside\n", "utf8");
    fs.symlinkSync(outside, path.join(escapeSkill, "leak.md"));
    const escapeConfig = path.join(tmp, "escape.json");
    fs.writeFileSync(
      escapeConfig,
      JSON.stringify({
        skillRoot: "skills/art-director",
        aggregateInstructionalMarkdownMax: 99999,
        perFileMaxLfChars: { "SKILL.md": 99999, "leak.md": 99999 },
        corpus: {
          studies: { maxLfChars: 99999, files: ["references/studies/x.md"] },
          examples: { maxLfChars: 99999, files: ["references/examples/x.md"] },
          template: { maxLfChars: 99999, files: ["assets/x.md"] }
        },
        profiles: { mini: { maxLfChars: 99999, files: ["SKILL.md"] } },
        required: { profiles: ["mini"] }
      })
    );
    assert.throws(
      () => checkContextBudget({ repoRoot: root, configPath: escapeConfig, skillRoot: escapeSkill }),
      /symlink|not allowed/
    );
    fs.rmSync(escapeDir, { recursive: true, force: true });
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

const cliJson = spawnSync(process.execPath, [budgetCli, "--json"], { cwd: root, encoding: "utf8" });
assert.equal(cliJson.status, 0, cliJson.stderr || cliJson.stdout);
assert.ok(!cliJson.stdout.includes("context budget ok"), "JSON mode must not append plain ok line");
const parsed = JSON.parse(cliJson.stdout.trim());
assert.equal(typeof parsed.ok, "boolean");
assert.equal(typeof parsed.aggregate.lfChars, "number");
assert.ok(parsed.skillMd.lfChars > 0);
assert.ok(cliJson.stdout.length < 200_000, "JSON must not dump full skill text");
assert.equal(JSON.stringify(parsed).includes("# Art Director"), false);

const summary = toJsonSummary(live);
assert.equal(summary.measurements, undefined);
assert.ok(summary.perFile["SKILL.md"].tokenProxy >= 1);

const utf8Skill = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "ad-budget-utf8-")), "art-director");
fs.mkdirSync(utf8Skill, { recursive: true });
fs.writeFileSync(path.join(utf8Skill, "SKILL.md"), "é\n", "utf8");
const utf8Measure = readMeasuredFile(fs.realpathSync.native(utf8Skill), "SKILL.md");
assert.ok(utf8Measure.utf8Bytes > utf8Measure.lfChars);

console.log("context-budget tests ok");
