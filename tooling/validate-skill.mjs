#!/usr/bin/env node
/**
 * Structural checks for skills/art-director.
 * Node is a maintainer tool here, not a skill runtime.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(repoRoot, "skills", "art-director");
const skillMdPath = path.join(skillRoot, "SKILL.md");

export function fail(message) {
  throw new Error(message);
}

export function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) fail("SKILL.md must start with YAML frontmatter delimited by ---");
  const raw = match[1];
  const body = match[2];
  const data = {};
  let key = null;
  let folded = null;
  for (const line of raw.split(/\r?\n/)) {
    if (folded) {
      if (line.startsWith("  ") || line.startsWith("\t")) {
        folded.chunks.push(line.trim());
        continue;
      }
      data[folded.key] = folded.chunks.join(" ").replace(/\s+/g, " ").trim();
      folded = null;
    }
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) {
      const nested = line.match(/^\s+([A-Za-z0-9_-]+):\s*(.*)$/);
      if (nested && (key === "metadata" || data.metadata)) {
        data.metadata = data.metadata || {};
        data.metadata[nested[1]] = nested[2].replace(/^"|"$/g, "");
        continue;
      }
      if (!line.trim()) continue;
      fail(`Unsupported frontmatter line: ${line}`);
    }
    key = kv[1];
    const value = kv[2];
    if (value === ">" || value === ">-" || value === "|" || value === "|-") {
      folded = { key, chunks: [] };
      continue;
    }
    if (key === "metadata") {
      data.metadata = {};
      continue;
    }
    if (key === "author" || key === "version") {
      data.metadata = data.metadata || {};
      data.metadata[key] = value.replace(/^"|"$/g, "");
      continue;
    }
    data[key] = value.replace(/^"|"$/g, "");
  }
  if (folded) {
    data[folded.key] = folded.chunks.join(" ").replace(/\s+/g, " ").trim();
  }
  return { data, body, raw };
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

export function validateSkill(root = skillRoot) {
  const problems = [];
  const notes = [];
  const skillMd = path.join(root, "SKILL.md");
  if (!fs.existsSync(skillMd)) fail(`Missing ${skillMd}`);
  const text = fs.readFileSync(skillMd, "utf8");
  const { data, body } = parseFrontmatter(text);
  const dirName = path.basename(root);

  if (!data.name) problems.push("frontmatter.name is required");
  if (data.name !== dirName) problems.push(`name "${data.name}" must match directory "${dirName}"`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.name || "")) {
    problems.push("name must be lowercase alphanumeric with single hyphens");
  }
  if ((data.name || "").length > 64) problems.push("name longer than 64 characters");
  const description = data.description || "";
  if (!description) problems.push("frontmatter.description is required");
  if (description.length > 1024) problems.push("description longer than 1024 characters");
  if (description.length < 1) problems.push("description is empty");

  const lines = text.split(/\r?\n/);
  notes.push(`SKILL.md lines=${lines.length} chars=${text.length} descriptionChars=${description.length}`);
  if (lines.length > 500) problems.push("SKILL.md exceeds 500 lines (Agent Skills guidance)");
  if (lines.length < 150 || lines.length > 250) {
    notes.push(`SKILL.md line count ${lines.length} is outside the 150-250 authoring target (not a spec failure)`);
  }

  const mdFiles = walk(root).filter((f) => f.endsWith(".md"));
  const relativeFromSkill = [];
  for (const file of mdFiles) {
    const content = fs.readFileSync(file, "utf8");
    if (/[A-Za-z]:\\/.test(content) || content.includes("C:\\")) {
      problems.push(`absolute Windows path in ${path.relative(root, file)}`);
    }
    if (/\]\([^)]*\\[^)]*\)/.test(content)) {
      problems.push(`backslash path in markdown link in ${path.relative(root, file)}`);
    }
    const links = [...content.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
    for (const href of links) {
      if (/^https?:\/\//i.test(href) || href.startsWith("#") || href.startsWith("mailto:")) continue;
      const cleaned = href.split("#")[0];
      if (!cleaned) continue;
      if (cleaned.startsWith("/")) problems.push(`absolute link ${href} in ${path.relative(root, file)}`);
      const target = path.normalize(path.join(path.dirname(file), cleaned));
      const relToRoot = path.relative(root, target);
      if (relToRoot.startsWith("..")) {
        problems.push(`link escapes skill root: ${href} in ${path.relative(root, file)}`);
      }
      if (!fs.existsSync(target)) problems.push(`missing link target ${href} from ${path.relative(root, file)}`);
      relativeFromSkill.push({ from: path.relative(root, file), href });
    }
  }

  const required = [
    "references/design-method.md",
    "references/visual-research.md",
    "references/content-and-composition.md",
    "references/typography-color-assets.md",
    "references/visual-craft.md",
    "references/responsive-interaction.md",
    "references/polish-pass.md",
    "references/implementation.md",
    "references/visual-review.md",
    "references/product-ui-system.md",
    "references/existing-ui-system.md",
    "references/react-web.md",
    "references/native-mobile.md",
    "references/completeness-and-states.md",
    "references/examples/media-portfolio.md",
    "references/examples/media-portfolio/App.jsx",
    "references/examples/media-portfolio/data.js",
    "references/examples/media-portfolio/styles.css",
    "references/examples/media-portfolio/index.html",
    "references/examples/media-portfolio/main.jsx",
    "references/examples/media-portfolio/ASSETS.md",
    "references/examples/media-portfolio/stills/linear40.png",
    "references/examples/media-portfolio/stills/dock-flood.png",
    "references/examples/media-portfolio/stills/task-arm.png",
    "references/examples/themeless-react.md",
    "references/examples/themeless-react/App.jsx",
    "references/examples/themeless-react/ui.jsx",
    "references/examples/themeless-react/tokens.css",
    "references/examples/themeless-react/data.js",
    "references/examples/themeless-react/kiln-store.js",
    "references/examples/themeless-react/index.html",
    "references/examples/themeless-react/main.jsx",
    "references/examples/component-system.md",
    "references/examples/component-system/DeskScreen.jsx",
    "references/examples/component-system/notes-store.js",
    "references/examples/component-system/index.html",
    "references/examples/component-system/main.jsx",
    "references/examples/component-system/Button.jsx",
    "references/examples/component-system/Field.jsx",
    "references/examples/component-system/Dialog.jsx",
    "references/examples/component-system/theme.css",
    "references/examples/native-mobile-example.md",
    "references/examples/native-mobile/App.jsx",
    "references/examples/native-mobile/screens.js",
    "references/examples/native-mobile/session-store.js",
    "references/examples/native-mobile/theme.js",
    "references/studies/kiln-rest.material.html",
    "references/studies/wireframe-to-finish.md",
    "references/studies/wireframe-to-finish.skeleton.html",
    "references/studies/wireframe-to-finish.finished.html",
    "references/studies/two-readings.md",
    "references/studies/two-readings.archive.html",
    "references/studies/two-readings.object.html",
    "references/studies/minimal-vs-unfinished.md",
    "references/studies/minimal-vs-unfinished.quiet.html",
    "references/studies/minimal-vs-unfinished.unfinished.html",
    "references/studies/media-in-composition.md",
    "references/studies/media-in-composition.html",
    "assets/design-notes.example.md"
  ];
  for (const rel of required) {
    if (!fs.existsSync(path.join(root, rel))) problems.push(`missing ${rel}`);
  }

  const forbiddenSnippets = [
    "art-director-mcp",
    "@akifsen/art-director-mcp",
    "npx art-director",
    "../../tests/",
    "../../docs/",
    "../../evals/"
  ];
  for (const file of walk(root)) {
    const content = fs.readFileSync(file, "utf8");
    for (const snippet of forbiddenSnippets) {
      if (content.includes(snippet)) {
        problems.push(`${path.relative(root, file)} depends on repo or MCP path "${snippet}"`);
      }
    }
  }

  if (!body.includes("DESIGN") || !body.includes("REFINE") || !body.includes("REVIEW")) {
    problems.push("SKILL.md body must define DESIGN, REFINE, and REVIEW");
  }
  const lowerDesc = description.toLowerCase();
  for (const word of ["design", "review", "layout"]) {
    if (!lowerDesc.includes(word)) problems.push(`description should mention "${word}" for triggering`);
  }
  if (!/backend|database|sql|deploy/i.test(description)) {
    problems.push("description should say when not to use the skill (backend/sql/deploy)");
  }

  return { problems, notes, data, lineCount: lines.length, charCount: text.length, relativeFromSkill };
}

export function repoRootPath() {
  return repoRoot;
}

const invokedDirectly = process.argv[1]
  && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (invokedDirectly) {
  try {
    const result = validateSkill();
    for (const note of result.notes) console.log(note);
    if (result.problems.length) {
      for (const p of result.problems) console.error("FAIL:", p);
      process.exit(1);
    }
    console.log("skill structure ok");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
