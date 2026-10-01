#!/usr/bin/env node
/**
 * Offline instructional Markdown size checks for skills/art-director.
 * LF-normalized char counts and UTF-8 bytes; tokenProxy = ceil(bytes/4) is
 * approximate, not a host tokenizer.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRootDefault = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const DEFAULT_REQUIRED_PROFILES = [
  "design-web",
  "design-web-starter",
  "design-web-existing",
  "design-native",
  "design-web-responsive",
  "refine-web-light",
  "refine-web-react",
  "refine-native-light",
  "review-web",
  "review-native"
];

export function normalizeLf(text) {
  return String(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export function measureText(text) {
  const lf = normalizeLf(text);
  const lfChars = lf.length;
  const utf8Bytes = Buffer.byteLength(lf, "utf8");
  const tokenProxy = Math.ceil(utf8Bytes / 4);
  return { lfChars, utf8Bytes, tokenProxy };
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertPositiveInt(name, value) {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`invalid limit ${name}: must be a positive integer`);
  }
  if (value > Number.MAX_SAFE_INTEGER) {
    throw new Error(`invalid limit ${name}: exceeds safe integer range`);
  }
}

function isContainedInRoot(childPath, rootPath) {
  const rel = path.relative(rootPath, childPath);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

export function realpathRoot(dir) {
  return fs.realpathSync.native(path.resolve(dir));
}

export function assertPathContained(childReal, rootReal, label = "path") {
  if (!isContainedInRoot(childReal, rootReal)) {
    throw new Error(`${label} escapes root: ${childReal}`);
  }
}

export function assertConfiguredSkillRootInRepo(repoRoot, skillRootRel) {
  const repoReal = realpathRoot(repoRoot);
  const configured = path.resolve(repoRoot, skillRootRel);
  if (!fs.existsSync(configured)) {
    throw new Error(`configured skillRoot missing: ${skillRootRel}`);
  }
  const configuredReal = realpathRoot(configured);
  assertPathContained(configuredReal, repoReal, "configured skillRoot");
  return configuredReal;
}

function assertInstructionalMarkdownRel(rel) {
  const safe = validateRelativeSkillPath(rel);
  if (!safe.endsWith(".md")) {
    throw new Error(`instructional path must be Markdown: ${rel}`);
  }
  return safe;
}

function validateProfileFileList(name, files) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error(`profiles.${name}.files must be a non-empty array`);
  }
  for (const rel of files) assertInstructionalMarkdownRel(rel);
}

export function loadBudgetConfig(configPath) {
  const raw = fs.readFileSync(configPath, "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    throw new Error(`invalid JSON in ${configPath}: ${err.message}`);
  }
  if (!isPlainObject(data)) throw new Error("config root must be an object");
  const skillRootRel = data.skillRoot;
  if (typeof skillRootRel !== "string" || !skillRootRel.trim()) {
    throw new Error("skillRoot must be a non-empty string");
  }
  if (skillRootRel.includes("..") || path.isAbsolute(skillRootRel)) {
    throw new Error("skillRoot must be a relative path inside the repo");
  }
  validateRelativeSkillPath(skillRootRel);
  assertPositiveInt("aggregateInstructionalMarkdownMax", data.aggregateInstructionalMarkdownMax);
  if (!isPlainObject(data.perFileMaxLfChars)) {
    throw new Error("perFileMaxLfChars must be an object");
  }
  const perFileKeys = Object.keys(data.perFileMaxLfChars);
  if (perFileKeys.length === 0) {
    throw new Error("perFileMaxLfChars must not be empty");
  }
  if (data.perFileMaxLfChars["SKILL.md"] === undefined) {
    throw new Error("perFileMaxLfChars must include SKILL.md");
  }
  for (const [rel, limit] of Object.entries(data.perFileMaxLfChars)) {
    assertInstructionalMarkdownRel(rel);
    assertPositiveInt(`perFileMaxLfChars.${rel}`, limit);
  }
  if (!isPlainObject(data.corpus)) throw new Error("corpus must be an object");
  for (const key of ["studies", "examples", "template"]) {
    if (!isPlainObject(data.corpus[key])) throw new Error(`corpus.${key} must be an object`);
    assertPositiveInt(`corpus.${key}.maxLfChars`, data.corpus[key].maxLfChars);
    if (!Array.isArray(data.corpus[key].files) || data.corpus[key].files.length === 0) {
      throw new Error(`corpus.${key}.files must be a non-empty array`);
    }
    for (const rel of data.corpus[key].files) assertInstructionalMarkdownRel(rel);
  }
  if (!isPlainObject(data.profiles)) throw new Error("profiles must be an object");
  if (Object.keys(data.profiles).length === 0) {
    throw new Error("profiles must not be empty");
  }
  const requiredProfiles = Array.isArray(data.required?.profiles)
    ? data.required.profiles
    : DEFAULT_REQUIRED_PROFILES;
  for (const name of requiredProfiles) {
    if (!data.profiles[name]) {
      throw new Error(`missing required profile: ${name}`);
    }
  }
  for (const [name, profile] of Object.entries(data.profiles)) {
    if (!isPlainObject(profile)) throw new Error(`profiles.${name} must be an object`);
    assertPositiveInt(`profiles.${name}.maxLfChars`, profile.maxLfChars);
    validateProfileFileList(name, profile.files);
  }
  return data;
}

export function validateRelativeSkillPath(rel) {
  if (typeof rel !== "string" || !rel.trim()) throw new Error("path must be a non-empty string");
  if (rel.includes("\\")) throw new Error(`path must use forward slashes: ${rel}`);
  if (path.isAbsolute(rel)) throw new Error(`path must be relative: ${rel}`);
  const normalized = path.posix.normalize(rel.replace(/^\.\//, ""));
  if (normalized.startsWith("..") || normalized.includes("/../")) {
    throw new Error(`path escapes skill root: ${rel}`);
  }
  return normalized;
}

export function resolveUnderSkillRoot(skillRoot, rel) {
  const safeRel = validateRelativeSkillPath(rel);
  const abs = path.resolve(skillRoot, safeRel);
  const relBack = path.relative(skillRoot, abs);
  if (relBack.startsWith("..") || path.isAbsolute(relBack)) {
    throw new Error(`resolved path escapes skill root: ${rel}`);
  }
  return abs;
}

function lstatNoFollow(p) {
  return fs.lstatSync(p);
}

function assertNoSymlinkSegment(skillRootReal, absPath) {
  const rel = path.relative(skillRootReal, absPath);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`path escapes skill root: ${absPath}`);
  }
  const segments = rel.split(path.sep).filter(Boolean);
  let cursor = skillRootReal;
  for (const segment of segments) {
    cursor = path.join(cursor, segment);
    let st;
    try {
      st = lstatNoFollow(cursor);
    } catch (err) {
      if (err.code === "ENOENT" && segment === segments.at(-1)) break;
      throw err;
    }
    if (st.isSymbolicLink()) {
      throw new Error(`symlink or junction not allowed under skill root: ${cursor}`);
    }
  }
}

export function resolvePhysicalUnderSkillRoot(skillRootReal, rel) {
  const safeRel = validateRelativeSkillPath(rel);
  const abs = path.resolve(skillRootReal, safeRel);
  assertNoSymlinkSegment(skillRootReal, abs);
  if (fs.existsSync(abs)) {
    const real = realpathRoot(abs);
    assertPathContained(real, skillRootReal, rel);
    return real;
  }
  assertNoSymlinkSegment(skillRootReal, abs);
  if (!isContainedInRoot(abs, skillRootReal)) {
    throw new Error(`resolved path escapes skill root: ${rel}`);
  }
  return abs;
}

function listInstructionalMarkdown(skillRootReal) {
  const out = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) {
        throw new Error(`symlink or junction not allowed under skill root: ${path.join(dir, entry.name)}`);
      }
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".md")) {
        out.push(path.relative(skillRootReal, full).split(path.sep).join("/"));
      }
    }
  }
  walk(skillRootReal);
  return out.sort();
}

export function readMeasuredFile(skillRootReal, rel) {
  const abs = resolvePhysicalUnderSkillRoot(skillRootReal, rel);
  if (!fs.existsSync(abs)) throw new Error(`missing file: ${rel}`);
  const st = lstatNoFollow(abs);
  if (st.isDirectory()) {
    throw new Error(`expected Markdown file, got directory: ${rel}`);
  }
  if (!st.isFile()) {
    throw new Error(`expected Markdown file: ${rel}`);
  }
  const text = fs.readFileSync(abs, "utf8");
  return measureText(text);
}

export function sumProfileLf(skillRootReal, files) {
  const seen = new Set();
  let totalLf = 0;
  let totalUtf8 = 0;
  let totalToken = 0;
  const breakdown = [];
  for (const rel of files) {
    const safe = validateRelativeSkillPath(rel);
    if (seen.has(safe)) continue;
    seen.add(safe);
    const m = readMeasuredFile(skillRootReal, safe);
    totalLf += m.lfChars;
    totalUtf8 += m.utf8Bytes;
    totalToken += m.tokenProxy;
    breakdown.push({ file: safe, lfChars: m.lfChars, utf8Bytes: m.utf8Bytes, tokenProxy: m.tokenProxy });
  }
  return { totalLfChars: totalLf, totalUtf8Bytes: totalUtf8, totalTokenProxy: totalToken, breakdown };
}

export function resolveSkillRootsForCheck(options = {}) {
  const repoRoot = path.resolve(options.repoRoot ?? repoRootDefault);
  const configPath = options.configPath ?? path.join(repoRoot, "tooling", "context-budget.config.json");
  const config = loadBudgetConfig(configPath);
  let skillRootReal;
  if (options.skillRoot !== undefined) {
    const candidate = path.resolve(options.skillRoot);
    if (!fs.existsSync(candidate)) throw new Error(`missing skill root ${candidate}`);
    skillRootReal = realpathRoot(candidate);
  } else {
    assertConfiguredSkillRootInRepo(repoRoot, config.skillRoot);
    skillRootReal = realpathRoot(path.join(repoRoot, config.skillRoot));
  }
  return { repoRoot, configPath, config, skillRootReal };
}

export function checkContextBudget(options = {}) {
  const { config, skillRootReal } = resolveSkillRootsForCheck(options);

  const violations = [];
  const measurements = {};
  const allMd = listInstructionalMarkdown(skillRootReal);
  let aggregateLf = 0;
  let aggregateUtf8 = 0;

  for (const rel of allMd) {
    const cap = config.perFileMaxLfChars[rel];
    if (cap === undefined) {
      violations.push(`instructional Markdown lacks per-file budget: ${rel}`);
    }
    const m = readMeasuredFile(skillRootReal, rel);
    measurements[rel] = m;
    aggregateLf += m.lfChars;
    aggregateUtf8 += m.utf8Bytes;
    if (cap !== undefined && m.lfChars > cap) {
      violations.push(`${rel} LF chars ${m.lfChars} > limit ${cap}`);
    }
  }

  for (const [rel] of Object.entries(config.perFileMaxLfChars)) {
    if (!measurements[rel]) violations.push(`configured file missing on disk: ${rel}`);
  }

  if (aggregateLf > config.aggregateInstructionalMarkdownMax) {
    violations.push(
      `aggregate instructional Markdown LF chars ${aggregateLf} > limit ${config.aggregateInstructionalMarkdownMax}`
    );
  }

  const profileResults = {};
  for (const [name, profile] of Object.entries(config.profiles)) {
    const summed = sumProfileLf(skillRootReal, profile.files);
    profileResults[name] = {
      totalLfChars: summed.totalLfChars,
      totalUtf8Bytes: summed.totalUtf8Bytes,
      totalTokenProxy: summed.totalTokenProxy,
      maxLfChars: profile.maxLfChars,
      breakdown: summed.breakdown
    };
    if (summed.totalLfChars > profile.maxLfChars) {
      violations.push(`profile ${name} LF chars ${summed.totalLfChars} > limit ${profile.maxLfChars}`);
    }
  }

  const corpusResults = {};
  for (const [key, block] of Object.entries(config.corpus)) {
    const summed = sumProfileLf(skillRootReal, block.files);
    corpusResults[key] = {
      totalLfChars: summed.totalLfChars,
      totalUtf8Bytes: summed.totalUtf8Bytes,
      totalTokenProxy: summed.totalTokenProxy,
      maxLfChars: block.maxLfChars,
      breakdown: summed.breakdown
    };
    if (summed.totalLfChars > block.maxLfChars) {
      violations.push(`corpus ${key} LF chars ${summed.totalLfChars} > limit ${block.maxLfChars}`);
    }
  }

  return {
    ok: violations.length === 0,
    violations,
    aggregateLfChars: aggregateLf,
    aggregateUtf8Bytes: aggregateUtf8,
    aggregateTokenProxy: Math.ceil(aggregateUtf8 / 4),
    aggregateMaxLfChars: config.aggregateInstructionalMarkdownMax,
    measurements,
    profileResults,
    corpusResults
  };
}

export function toJsonSummary(result) {
  const profiles = {};
  for (const [name, pr] of Object.entries(result.profileResults)) {
    profiles[name] = {
      totalLfChars: pr.totalLfChars,
      totalUtf8Bytes: pr.totalUtf8Bytes,
      tokenProxy: pr.totalTokenProxy,
      maxLfChars: pr.maxLfChars
    };
  }
  const corpus = {};
  for (const [name, cr] of Object.entries(result.corpusResults)) {
    corpus[name] = {
      totalLfChars: cr.totalLfChars,
      totalUtf8Bytes: cr.totalUtf8Bytes,
      tokenProxy: cr.totalTokenProxy,
      maxLfChars: cr.maxLfChars
    };
  }
  const perFile = {};
  for (const [rel, m] of Object.entries(result.measurements)) {
    perFile[rel] = { lfChars: m.lfChars, utf8Bytes: m.utf8Bytes, tokenProxy: m.tokenProxy };
  }
  const skillMd = result.measurements["SKILL.md"];
  return {
    ok: result.ok,
    violations: result.violations,
    aggregate: {
      lfChars: result.aggregateLfChars,
      utf8Bytes: result.aggregateUtf8Bytes,
      tokenProxy: result.aggregateTokenProxy,
      maxLfChars: result.aggregateMaxLfChars
    },
    skillMd: skillMd
      ? { lfChars: skillMd.lfChars, utf8Bytes: skillMd.utf8Bytes, tokenProxy: skillMd.tokenProxy }
      : null,
    profiles,
    corpus,
    perFile
  };
}

export function formatReport(result) {
  const lines = [];
  lines.push(
    `skill instructional Markdown aggregate: ${result.aggregateLfChars} LF chars (limit ${result.aggregateMaxLfChars})`
  );
  const entry = result.measurements["SKILL.md"];
  if (entry) {
    lines.push(
      `SKILL.md: ${entry.lfChars} LF chars, ${entry.utf8Bytes} UTF-8 bytes, ~${entry.tokenProxy} token proxy (bytes/4)`
    );
  }
  for (const [name, pr] of Object.entries(result.profileResults)) {
    lines.push(`profile ${name}: ${pr.totalLfChars} LF chars (limit ${pr.maxLfChars})`);
  }
  for (const [name, cr] of Object.entries(result.corpusResults)) {
    lines.push(`corpus ${name}: ${cr.totalLfChars} LF chars (limit ${cr.maxLfChars})`);
  }
  return lines.join("\n");
}

const invokedDirectly = process.argv[1]
  && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (invokedDirectly) {
  try {
    const json = process.argv.includes("--json");
    const result = checkContextBudget();
    if (json) {
      console.log(JSON.stringify(toJsonSummary(result)));
      process.exit(result.ok ? 0 : 1);
    } else {
      console.log(formatReport(result));
      if (!result.ok) {
        for (const v of result.violations) console.error("FAIL:", v);
        process.exit(1);
      }
      console.log("context budget ok");
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
