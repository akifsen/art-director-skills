#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { validateSkill, repoRootPath, parseFrontmatter } from "../tooling/validate-skill.mjs";

const root = repoRootPath();
let failed = 0;

function assert(cond, message) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", message);
  } else {
    console.log("ok:", message);
  }
}

const structure = validateSkill();
for (const note of structure.notes) console.log(note);
assert(structure.problems.length === 0, structure.problems.length ? structure.problems.join("; ") : "structure");

const skillMd = fs.readFileSync(path.join(root, "skills", "art-director", "SKILL.md"), "utf8");
const { data } = parseFrontmatter(skillMd);

const triggers = JSON.parse(
  fs.readFileSync(path.join(root, "tests", "fixtures", "triggers.json"), "utf8")
);

function classifyFixturePrompt(prompt) {
  const p = prompt.toLowerCase();
  const negative = /\b(sql|migration|database|deploy|production and tag|backend)\b/.test(p)
    && !/\b(ui|interface|page|menu|layout|design|review|spacing|homepage|visual)\b/.test(p);
  if (negative) return { trigger: false, mode: null };
  const review = /\breview\b/.test(p) && /do not change|read-only|do not (edit|change)/.test(p);
  if (review || (/\breview\b/.test(p) && /do not change/.test(p))) return { trigger: true, mode: "REVIEW" };
  if (/\breview this ui\b/.test(p)) return { trigger: true, mode: "REVIEW" };
  if (/\b(mobile menu|navigation on small|spacing on the pricing|fix the)\b/.test(p) && !/\bredesign\b/.test(p) && !/\bdesign a homepage\b/.test(p)) {
    return { trigger: true, mode: "REFINE" };
  }
  if (/\b(design|redesign)\b/.test(p)) return { trigger: true, mode: "DESIGN" };
  if (/\b(layout|visual hierarchy|typography|landing page)\b/.test(p)) return { trigger: true, mode: "DESIGN" };
  return { trigger: false, mode: null };
}

console.log("fixture keyword heuristic (not host skill selection or model behavior)");
for (const caseRow of triggers) {
  const got = classifyFixturePrompt(caseRow.prompt);
  assert(got.trigger === caseRow.shouldTrigger, `${caseRow.id} fixture-heuristic trigger ${got.trigger} === ${caseRow.shouldTrigger}`);
  assert(got.mode === caseRow.expectedMode, `${caseRow.id} fixture-heuristic mode ${got.mode} === ${caseRow.expectedMode}`);
}

const desc = data.description.toLowerCase();
assert(desc.includes("mobile menu"), "description mentions mobile menu");
assert(desc.includes("react native"), "description mentions React Native");
assert(desc.includes("expo"), "description mentions Expo");
assert(desc.includes("native ui") || desc.includes("mobile app"), "description mentions native/mobile app");
assert(desc.includes("existing theme") || desc.includes("design system"), "description mentions existing UI systems");
assert(/do not use/.test(desc), "description includes do-not-use clause");
assert(skillMd.includes("read-only") || skillMd.includes("Read-only"), "REVIEW stays read-only");
assert(skillMd.includes("visual-research.md"), "SKILL.md points at visual-research.md");
assert(skillMd.includes("polish-pass.md"), "SKILL.md points at polish-pass.md");
assert(skillMd.includes("product-ui-system.md"), "SKILL.md routes starter work to product-ui-system.md");
assert(skillMd.includes("existing-ui-system.md"), "SKILL.md routes existing systems to existing-ui-system.md");
assert(skillMd.includes("react-web.md"), "SKILL.md routes React web to react-web.md");
assert(skillMd.includes("native-mobile.md"), "SKILL.md routes native work to native-mobile.md");
assert(skillMd.includes("completeness-and-states.md"), "SKILL.md routes scope to completeness-and-states.md");
assert(/finished product interface|visually finished|finished craft/.test(skillMd), "promise mentions finished craft");
assert(!/sodium/i.test(skillMd), "main skill is not tied to a sodium/eval example");
assert((data.metadata && data.metadata.version) === "0.9.0", `version 0.9.0 (got ${data.metadata && data.metadata.version})`);
assert(skillMd.includes("Job of the screen"), "SKILL.md names job vs domain");
assert(skillMd.includes("media-portfolio.md"), "SKILL.md routes media work to media-portfolio");
assert(!skillMd.includes("serif-on-cream default"), "skill no longer treats serif-on-cream as the copyable default phrase");
assert(skillMd.includes("working surface"), "SKILL.md names a working surface, not only a hero");
assert(!skillMd.includes("independent host use"), "distributed skill does not load host-eval protocol");
assert(!skillMd.includes("authoring chat"), "distributed skill does not mention this authoring chat");
assert(!skillMd.includes("Which real image and state"), "distributed skill does not require an eval checkpoint form");
assert(fs.existsSync(path.join(root, "evals", "HOST-TRIAL.md")), "host-trial method is in evals");
assert(fs.readFileSync(path.join(root, "evals", "HOST-TRIAL.md"), "utf8").includes("This development chat is not independent host use"), "evals keep the honest host-trial distinction");
assert(!skillMd.includes("disable-model-invocation: true"), "implicit invocation allowed");
assert(!/^allowed-tools:/m.test(skillMd), "no allowed-tools permission expansion");

const typeRef = fs.readFileSync(path.join(root, "skills", "art-director", "references", "typography-color-assets.md"), "utf8");
assert(!/font-family:\s*Palatino/.test(typeRef), "applied type fragments are not Palatino");
assert(typeRef.includes("media / catalog display"), "type guide has a catalog display fragment");
assert(typeRef.includes("product workspace chrome"), "type guide has a workspace fragment");

const craftRef = fs.readFileSync(path.join(root, "skills", "art-director", "references", "visual-craft.md"), "utf8");
assert(!craftRef.includes("background: #efe7dc"), "visual-craft applied fragment is not warm paper");

const method = fs.readFileSync(path.join(root, "skills", "art-director", "references", "design-method.md"), "utf8");
assert(method.includes("Job vs domain"), "design-method separates job from domain");
assert(method.includes("First look"), "design-method lists concrete art-direction decisions");

const research = fs.readFileSync(path.join(root, "skills", "art-director", "references", "visual-research.md"), "utf8");
assert(/Do not copy layout, assets, or brand/i.test(research), "visual-research forbids copying layout/assets/brand");
assert(!/^Copy layout, assets, or brand/m.test(research), "visual-research does not instruct copying layout");

const polish = fs.readFileSync(path.join(root, "skills", "art-director", "references", "polish-pass.md"), "utf8");
assert(polish.includes("Gate A") && polish.includes("Gate C") && polish.includes("Gate D"), "polish-pass has four gates");
assert(!/Two reasoned passes after the first slice is enough/i.test(polish), "polish-pass does not stop on tour count");

const nativeRef = fs.readFileSync(path.join(root, "skills", "art-director", "references", "native-mobile.md"), "utf8");
assert(nativeRef.includes("KeyboardAvoidingView"), "native guide covers keyboard");
assert(/safe area/i.test(nativeRef), "native guide covers safe area");
assert(nativeRef.includes("accessibilityLabel"), "native guide uses RN a11y props");
assert(nativeRef.includes("Do not sprinkle") && nativeRef.includes("aria-"), "native guide does not copy ARIA as the recipe");

const nativeExample = fs.readFileSync(path.join(root, "skills", "art-director", "references", "examples", "native-mobile", "screens.js"), "utf8");
const nativeApp = fs.readFileSync(path.join(root, "skills", "art-director", "references", "examples", "native-mobile", "App.jsx"), "utf8");
assert(nativeExample.includes("KeyboardAvoidingView"), "native example uses KeyboardAvoidingView");
assert(nativeExample.includes("accessibilityRole"), "native example sets accessibilityRole");
assert(nativeExample.includes("AccessibilityInfo.announceForAccessibility"), "native example announces via AccessibilityInfo");
assert(nativeApp.includes("saveNote"), "native app persists through saveNote");

const themelessApp = fs.readFileSync(path.join(root, "skills", "art-director", "references", "examples", "themeless-react", "App.jsx"), "utf8");
assert(themelessApp.includes("Log a hold") || themelessApp.includes("hold"), "themeless example has a form flow");
assert(!themelessApp.includes("TODO"), "themeless example is not stubbed with TODO");
assert(!themelessApp.includes("dangerouslySetInnerHTML"), "themeless example is real React");

const packedHint = fs.readFileSync(path.join(root, "skills", "art-director", "SKILL.md"), "utf8");
assert(!packedHint.includes("docs/installation.md"), "installed skill does not point at repo docs");

const caseDirs = fs.readdirSync(path.join(root, "evals", "cases"), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();
assert(caseDirs.length >= 12, `eval cases >= 12 (have ${caseDirs.length})`);
assert(caseDirs.includes("07-missing-css"), "eval fixture for missing stylesheet");
assert(caseDirs.includes("08-themeless-react"), "eval 08 themeless React");
assert(caseDirs.includes("09-component-system"), "eval 09 component system");
assert(caseDirs.includes("10-template-adapt"), "eval 10 template adapt");
assert(caseDirs.includes("11-native-expo"), "eval 11 native Expo");
assert(caseDirs.includes("12-holdout-lumen-cart"), "eval 12 Lumen Cart holdout");
assert(caseDirs.includes("17-pier-kettle"), "eval 17 Pier Kettle transfer brief");
assert(fs.existsSync(path.join(root, "evals", "cases", "09-component-system", "start", "ORIGIN.txt")), "component-system fixture has provenance note");
assert(fs.existsSync(path.join(root, "evals", "cases", "10-template-adapt", "start", "ORIGIN.txt")), "template fixture has provenance note");
for (const name of caseDirs) {
  const dir = path.join(root, "evals", "cases", name);
  assert(fs.existsSync(path.join(dir, "brief.md")), `${name} brief`);
  assert(fs.existsSync(path.join(dir, "expected.md")), `${name} expected`);
  assert(fs.existsSync(path.join(dir, "start")), `${name} start/`);
}

const tmpParent = fs.mkdtempSync(path.join(os.tmpdir(), "ad-copy-"));
const tmp = path.join(tmpParent, "art-yönetmen kopya");
fs.mkdirSync(tmp);
const dest = path.join(tmp, "art-director");
const src = path.join(root, "skills", "art-director");
if (process.platform === "win32") {
  const copiedPs = spawnSync("powershell", [
    "-NoProfile",
    "-Command",
    `Copy-Item -LiteralPath '${src.replace(/'/g, "''")}' -Destination '${dest.replace(/'/g, "''")}' -Recurse -Force`
  ], { encoding: "utf8" });
  assert(copiedPs.status === 0, `PowerShell copy exit ${copiedPs.status}: ${copiedPs.stderr || copiedPs.stdout}`);
} else {
  fs.cpSync(src, dest, { recursive: true });
}
assert(fs.existsSync(path.join(dest, "SKILL.md")), `copied SKILL.md into ${dest}`);
const copied = validateSkill(dest);
assert(copied.problems.length === 0, copied.problems.length ? copied.problems.join("; ") : "copy under Turkish/space parent path");
assert(
  fs.existsSync(path.join(dest, "references", "examples", "media-portfolio", "App.jsx")),
  "copied media-portfolio lands in the portable skill folder"
);
assert(
  fs.existsSync(path.join(dest, "references", "examples", "themeless-react", "kiln-store.js")),
  "copied kiln-store lands in the portable skill folder"
);
assert(
  fs.existsSync(path.join(dest, "references", "examples", "themeless-react", "dialog-geometry.js")),
  "copied dialog geometry lands in the portable skill folder"
);
assert(
  fs.existsSync(path.join(dest, "references", "native-mobile.md")),
  "copied native guide lands in the portable skill folder"
);
console.log("copied skill to", dest);

const seeAndFixTests = spawnSync(process.execPath, [path.join(root, "tests", "see-and-fix.mjs")], {
  encoding: "utf8",
  cwd: root
});
process.stdout.write(seeAndFixTests.stdout || "");
process.stderr.write(seeAndFixTests.stderr || "");
assert(seeAndFixTests.status === 0, "see-and-fix source checks");

const exampleTests = spawnSync(process.execPath, [path.join(root, "tests", "examples", "run.mjs")], {
  encoding: "utf8",
  cwd: root
});
process.stdout.write(exampleTests.stdout || "");
process.stderr.write(exampleTests.stderr || "");
assert(exampleTests.status === 0, "example behavior tests");

const helperTests = spawnSync(process.execPath, [path.join(root, "tests", "npx-spawn.mjs")], {
  encoding: "utf8",
  cwd: root
});
process.stdout.write(helperTests.stdout || "");
process.stderr.write(helperTests.stderr || "");
assert(helperTests.status === 0, "npx spawn and unique JSON key checks");

if (failed) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log("\nall tests passed");
