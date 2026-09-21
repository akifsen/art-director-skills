/**
 * Source checks for the 2026-09-20 see-and-correct copies.
 * Historical native-craft-2026-09-19 outputs must stay unchanged.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { packingActionHint, packingActionTitle, reduce, initialState } from "../evals/outputs/see-and-fix-2026-09-20/daypack-corrected/state.js";
import { repoRootPath } from "../tooling/validate-skill.mjs";

const root = repoRootPath();
let failed = 0;

function check(cond, message) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", message);
  } else {
    console.log("ok:", message);
  }
}

const histFoldCss = fs.readFileSync(
  path.join(root, "evals/outputs/native-craft-2026-09-19/fold-candidate/src/styles.css"),
  "utf8"
);
const histFoldApp = fs.readFileSync(
  path.join(root, "evals/outputs/native-craft-2026-09-19/fold-candidate/src/App.jsx"),
  "utf8"
);
const histDayApp = fs.readFileSync(
  path.join(root, "evals/outputs/native-craft-2026-09-19/daypack-candidate/App.jsx"),
  "utf8"
);
const histDayUi = fs.readFileSync(
  path.join(root, "evals/outputs/native-craft-2026-09-19/daypack-candidate/ui.jsx"),
  "utf8"
);
check(histFoldCss.includes(".detail h1{font-size:42px"), "historical Fold mobile title size left in place");
check(histFoldApp.includes("Make time for making"), "historical Fold booking slogan left in place");
check(histDayApp.includes("Everything’s packed") || histDayApp.includes("Everything's packed"), "historical Daypack complete-on-disabled copy left in place");
check(!/accessibilityRole=\"text\"/.test(histDayUi), "historical Daypack read-only row still lacks text role");

const foldCss = fs.readFileSync(
  path.join(root, "evals/outputs/see-and-fix-2026-09-20/fold-corrected/src/styles.css"),
  "utf8"
);
const foldApp = fs.readFileSync(
  path.join(root, "evals/outputs/see-and-fix-2026-09-20/fold-corrected/src/App.jsx"),
  "utf8"
);
check(foldCss.includes(".detail h1{font-size:26px"), "corrected Fold narrow title is compact");
check(foldCss.includes("background:transparent"), "corrected Fold demo band is not a lime stage");
check(foldApp.includes("className=\"picked\""), "corrected Fold keeps a compact selected-record block");
check(foldApp.includes("← Back to workshops"), "corrected Fold keeps back navigation");
check(foldApp.includes("Reserve ") && foldApp.includes("one place"), "corrected Fold keeps the reserve action");
check(foldApp.includes("Cancel reservation & choose again"), "corrected Fold keeps cancel");

const dayApp = fs.readFileSync(
  path.join(root, "evals/outputs/see-and-fix-2026-09-20/daypack-corrected/App.jsx"),
  "utf8"
);
const dayUi = fs.readFileSync(
  path.join(root, "evals/outputs/see-and-fix-2026-09-20/daypack-corrected/ui.jsx"),
  "utf8"
);
check(!/Everything.s packed/.test(dayApp), "corrected Daypack does not claim packed on the pending action");
check(dayApp.includes("packingActionTitle"), "corrected Daypack uses state-based action labels");
check(dayUi.includes('accessibilityRole="text"'), "corrected Daypack summary uses text semantics");
check(dayUi.includes("summaryMark"), "corrected Daypack summary is not checkbox chrome");
check(dayUi.includes('accessibilityRole="checkbox"'), "corrected Daypack packing rows stay checkboxes");

check(packingActionTitle(0, 4) === "Finish packing", "empty list action names remaining work");
check(packingActionTitle(1, 4) === "Finish packing", "partial list action names remaining work");
check(packingActionTitle(4, 4) === "Complete packing list", "complete list action names the next commit");
check(packingActionHint(1, 4).includes("3 items still to pack"), "partial hint counts remaining items");
check(packingActionHint(3, 4).includes("1 item still to pack"), "singular remaining hint");

let s = reduce(initialState, { type: "open", id: "walk" });
s = reduce(s, { type: "toggle", item: "Keys" });
check(reduce(s, { type: "finish", items: ["Keys", "Water bottle", "Light jacket", "Sketchbook"] }).screen === "pack", "incomplete finish still guarded");
s = reduce(s, { type: "toggle", item: "Water bottle" });
s = reduce(s, { type: "toggle", item: "Light jacket" });
s = reduce(s, { type: "toggle", item: "Sketchbook" });
s = reduce(s, { type: "finish", items: ["Keys", "Water bottle", "Light jacket", "Sketchbook"] });
check(s.screen === "done", "complete finish still reaches summary");
s = reduce(s, { type: "back" });
check(s.screen === "pack", "summary back returns to the editable list");

const native = fs.readFileSync(path.join(root, "skills/art-director/references/native-mobile.md"), "utf8");
check(native.includes("Finish packing"), "native guide teaches pending action labels");
check(native.includes("read-only packed list"), "native guide separates summary from checkboxes");

const craft = fs.readFileSync(path.join(root, "skills/art-director/references/visual-craft.md"), "utf8");
check(craft.includes("operational screen") || craft.includes("working surface") || craft.includes("booking or edit form") || craft.includes("detail/form"), "visual-craft covers form vs intro");

const brief = fs.readFileSync(path.join(root, "evals/cases/17-pier-kettle/brief.md"), "utf8");
check(brief.includes("K-12") && brief.includes("K-19"), "Pier Kettle brief is frozen with supplied cups");
check(!brief.includes("screenshot") && !brief.includes("art-director"), "Pier Kettle brief does not coach the skill method");

const photoBrief = fs.readFileSync(path.join(root, "evals/cursor-trial/brief.md"), "utf8");
check(photoBrief.includes("fotoğrafçının çekim projelerini"), "photographer Cursor-trial brief is frozen");
check(!/art-director|screenshot|SKILL\.md|referans/i.test(photoBrief), "photographer brief does not coach the skill method");

const hostTrial = fs.readFileSync(path.join(root, "evals/HOST-TRIAL.md"), "utf8");
check(hostTrial.includes("independent host"), "host-trial method lives in evals");
check(hostTrial.includes("/art-director"), "host-trial documents explicit Cursor invocation");

const { remainingLabel, remainingMs, STEEP_MS } = await import("../evals/outputs/see-and-fix-2026-09-20/pier-kettle/src/timing.js");
check(remainingMs(1000, 500) === STEEP_MS, "timer does not run backwards when now is stale");
check(remainingLabel(1000, 1000) === "3:00", "fresh steep shows three minutes");
const pierApp = fs.readFileSync(path.join(root, "evals/outputs/see-and-fix-2026-09-20/pier-kettle/src/App.jsx"), "utf8");
check(pierApp.includes("Start steep for ${cup.id}"), "Pier Kettle actions name the cup");
check(pierApp.includes("Mark ready") && pierApp.includes("Undo start"), "Pier Kettle keeps start, ready, and undo");

if (failed) {
  console.error(`\n${failed} see-and-fix failure(s)`);
  process.exit(1);
}
console.log("see-and-fix source checks passed");
