/**
 * Decision and path checks for Art Director direction files.
 * The skill text is what an agent follows; this module is the tested
 * contract for the same rules. It does not write files.
 */
import fs from "node:fs";
import path from "node:path";
import {
  RefusedError,
  canonicalRoot,
  componentsBelow,
  isInside,
  lstatSafe
} from "./install-skill.mjs";

export const DIRECTION_MARKER = "<!-- art-director:direction v1 -->";
export const CANONICAL_NOTES = ".art-director/design-notes.md";

const CONTROL_LINE = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(rules|instructions)/i,
  /ignore\s+all\s+previous/i,
  /\b(run|execute)\b[^\n]{0,40}\b(shell|commands?)\b/i,
  /\barbitrary\s+shell\b/i,
  /\bdelete\s+tests\b/i,
  /\bpublish\b[^\n]{0,24}\bpackage\b/i,
  /\bnpm\s+publish\b/i,
  /\bchange\s+unrelated\s+files\b/i,
  /\brm\s+-rf\b/i
];

export function rootDesignOwned(text, { userDesignates = false } = {}) {
  if (userDesignates) return true;
  return String(text ?? "").includes(DIRECTION_MARKER);
}

/** Split stored direction text into design facts and rejected control lines. */
export function partitionDirection(text) {
  const facts = [];
  const rejected = [];
  for (const line of String(text ?? "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === DIRECTION_MARKER) continue;
    if (CONTROL_LINE.some((re) => re.test(trimmed))) rejected.push(trimmed);
    else facts.push(trimmed);
  }
  return { facts: facts.join("\n"), rejected };
}

/**
 * Decide what to read and what may be written. Never merges the two files.
 *
 * @param {"DESIGN"|"REFINE"|"REVIEW"} mode
 * @param {boolean} persist DESIGN should keep a direction for the next session
 * @param {boolean} directionChanges the named REFINE task changes the direction
 * @param {boolean} userAuthoritativeRoot user says root DESIGN.md is the direction for this task
 */
export function planDirection({
  mode,
  rootExists = false,
  rootText = "",
  notesExist = false,
  persist = false,
  directionChanges = false,
  userAuthoritativeRoot = false
} = {}) {
  const designates = Boolean(userAuthoritativeRoot);
  const owned = rootExists && rootDesignOwned(rootText, { userDesignates: designates });
  const rootWins = designates && owned;

  let authoritative = null;
  if (rootWins) authoritative = "root";
  else if (notesExist) authoritative = "notes";

  let rootRole = "absent";
  if (rootExists && owned && rootWins) rootRole = "owned-authoritative";
  else if (rootExists && owned) rootRole = "owned-secondary";
  else if (rootExists) rootRole = "context";

  let write = null;
  if (mode === "DESIGN" && persist) write = rootWins ? "root" : "notes";
  else if (mode === "REFINE" && directionChanges) write = rootWins ? "root" : (notesExist ? "notes" : null);
  if (write === "root" && !owned) write = "notes";

  return {
    authoritative,
    rootRole,
    write,
    merge: false,
    readNotes: notesExist && !rootWins,
    claimRoot: Boolean(owned)
  };
}

function normalizedRel(relPath) {
  const normalized = path.normalize(String(relPath ?? ""));
  if (!normalized || path.isAbsolute(normalized) || normalized.split(path.sep).includes("..")) {
    throw new RefusedError(`refusing: ${relPath} is not a design-direction path inside the project`);
  }
  return normalized.split(path.sep).join("/");
}

/**
 * Confirm a direction path is a normal file location inside `projectRoot`.
 * Does not create, replace, or follow links. Missing files are allowed.
 */
export function assertDesignDirectionWritable(projectRoot, relPath) {
  const key = normalizedRel(relPath);
  if (key !== "DESIGN.md" && key !== CANONICAL_NOTES) {
    throw new RefusedError(`refusing: ${relPath} is not an Art Director direction file`);
  }
  const root = canonicalRoot(projectRoot);
  const target = path.resolve(root, ...key.split("/"));
  if (!isInside(root, target)) {
    throw new RefusedError(`refusing: ${target} resolves outside the project root`);
  }
  const parts = componentsBelow(root, target);
  const leaf = parts[parts.length - 1];
  for (const component of parts.slice(0, -1)) {
    const st = lstatSafe(component);
    if (!st) break;
    if (st.isSymbolicLink()) {
      throw new RefusedError(`refusing: ${component} is a symbolic link or junction`);
    }
    if (!st.isDirectory()) {
      throw new RefusedError(`refusing: ${component} exists and is not a directory`);
    }
    const real = fs.realpathSync(component);
    if (!isInside(root, real)) {
      throw new RefusedError(`refusing: ${component} resolves outside the project root`);
    }
  }
  const leafSt = lstatSafe(leaf);
  if (leafSt?.isSymbolicLink()) {
    throw new RefusedError(`refusing: ${leaf} is a symbolic link or junction`);
  }
  if (leafSt && !leafSt.isFile()) {
    throw new RefusedError(`refusing: ${leaf} exists and is not a file`);
  }
  if (leafSt?.isFile()) {
    const real = fs.realpathSync(leaf);
    if (!isInside(root, real)) {
      throw new RefusedError(`refusing: ${leaf} resolves outside the project root`);
    }
  }
  return target;
}
