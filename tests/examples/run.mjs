/**
 * Layer: component-store (Node assert). Not a browser or native runtime.
 */
import assert from "node:assert/strict";
import { createSession, getStation, saveNote, cancelNote } from "../../skills/art-director/references/examples/native-mobile/session-store.js";
import { createDesk, selectRow, openNoteDialog, setDraft, commitNote, cancelNoteDialog, noteFor } from "../../skills/art-director/references/examples/component-system/notes-store.js";
import { parseRoute, readFixture, readHoldDelay, filterLoads, validateHold, applyHold, createSaveGate, finishHoldCommit } from "../../skills/art-director/references/examples/themeless-react/kiln-store.js";
import { isDialogBackdropClick as kilnBackdrop, cycleDialogTab as kilnTab } from "../../skills/art-director/references/examples/themeless-react/dialog-geometry.js";
import { isDialogBackdropClick as deskBackdrop, cycleDialogTab as deskTab } from "../../skills/art-director/references/examples/component-system/dialog-geometry.js";
import { LOADS } from "../../skills/art-director/references/examples/themeless-react/data.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../skills/art-director");
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log("ok:", name);
  } catch (err) {
    failed += 1;
    console.error("FAIL:", name, err.message);
  }
}

const stations = [
  { id: "pass", title: "Pass" },
  { id: "dish", title: "Dish pit" }
];

test("closeout save writes the note onto that station", () => {
  let session = createSession(stations);
  const result = saveNote(session, "pass", "Cover sauces.");
  assert.equal(result.ok, true);
  assert.equal(getStation(result.session, "pass").note, "Cover sauces.");
  assert.match(result.message, /session/i);
  assert.doesNotMatch(result.message, /this device only/i);
});

test("closeout notes stay on their own station", () => {
  let session = createSession(stations);
  session = saveNote(session, "pass", "Pass note.").session;
  session = saveNote(session, "dish", "Dish note.").session;
  assert.equal(getStation(session, "pass").note, "Pass note.");
  assert.equal(getStation(session, "dish").note, "Dish note.");
});

test("closeout cancel does not write a draft", () => {
  const session = createSession(stations);
  const next = cancelNote(session);
  assert.equal(getStation(next, "pass").note, "");
});

test("closeout empty note is rejected and leaves prior note", () => {
  let session = saveNote(createSession(stations), "pass", "Keep me.").session;
  const result = saveNote(session, "pass", "   ");
  assert.equal(result.ok, false);
  assert.equal(getStation(result.session, "pass").note, "Keep me.");
});

test("desk save binds the note to the selected row only", () => {
  let state = createDesk([
    { id: "N-441", name: "E. Kaplan" },
    { id: "N-442", name: "M. Öztürk" }
  ]);
  state = openNoteDialog(state);
  state = setDraft(state, "Dressing dry.");
  state = commitNote(state);
  assert.equal(noteFor(state, "N-441"), "Dressing dry.");
  assert.equal(noteFor(state, "N-442"), "");
  assert.equal(state.dialogOpen, false);
});

test("desk cancel discards draft and keeps committed note", () => {
  let state = createDesk([{ id: "N-441", name: "E. Kaplan", note: "Old." }]);
  state = openNoteDialog(state);
  state = setDraft(state, "Should not commit.");
  state = cancelNoteDialog(state);
  assert.equal(noteFor(state, "N-441"), "Old.");
  assert.equal(state.dialogOpen, false);
});

test("desk switching rows then returning keeps the first note", () => {
  let state = createDesk([
    { id: "N-441", name: "E. Kaplan" },
    { id: "N-442", name: "M. Öztürk" }
  ]);
  state = openNoteDialog(state);
  state = setDraft(state, "First.");
  state = commitNote(state);
  state = selectRow(state, "N-442");
  state = openNoteDialog(state);
  state = setDraft(state, "Second.");
  state = commitNote(state);
  state = selectRow(state, "N-441");
  assert.equal(noteFor(state, "N-441"), "First.");
  assert.equal(noteFor(state, "N-442"), "Second.");
});

test("kiln hold writes onto that load and leaves others", () => {
  const result = applyHold(LOADS, "K-214", { minutes: "30", reason: "Glaze crawl." });
  assert.equal(result.ok, true);
  const saved = result.loads.find((row) => row.id === "K-214");
  const other = result.loads.find((row) => row.id === "K-208");
  assert.match(saved.note, /Glaze crawl/);
  assert.equal(saved.status, "hold");
  assert.equal(other.note, LOADS.find((row) => row.id === "K-208").note);
});

test("kiln empty reason does not mutate loads", () => {
  const result = applyHold(LOADS, "K-214", { minutes: "30", reason: "" });
  assert.equal(result.ok, false);
  assert.equal(result.loads, LOADS);
  assert.ok(validateHold({ minutes: "30", reason: "" }).reason);
});

test("kiln unknown routes are explicit", () => {
  assert.equal(parseRoute("#/nope").screen, "unknown");
  assert.equal(parseRoute("#/loads/K-999").screen, "detail");
  assert.equal(parseRoute("#/loads/K-999/hold").screen, "hold");
  assert.equal(parseRoute("#/loads/K-999").id, "K-999");
});

test("kiln fixtures are opt-in via query, not random", () => {
  assert.equal(readFixture("?fixture=loading"), "loading");
  assert.equal(readFixture("?fixture=error"), "error");
  assert.equal(readFixture("?fixture=empty"), "empty");
  assert.equal(readFixture("?fixture=hold-reject"), "hold-reject");
  assert.equal(readFixture(""), null);
  assert.equal(filterLoads(LOADS, "zzz").length, 0);
});

test("holdDelay is opt-in and bounded", () => {
  assert.equal(readHoldDelay(""), 400);
  assert.equal(readHoldDelay("?holdDelay=2000"), 2000);
  assert.equal(readHoldDelay("?holdDelay=1"), 400);
  assert.equal(readHoldDelay("?holdDelay=9000"), 400);
  assert.equal(readHoldDelay("?holdDelay=nope"), 400);
});

test("late hold commit is ignored after cancel", () => {
  const gate = createSaveGate();
  const prepared = applyHold(LOADS, "K-214", { minutes: "30", reason: "Glaze crawl." });
  const token = gate.begin();
  gate.cancel();
  const finished = finishHoldCommit(gate, token, prepared);
  assert.equal(finished.aborted, true);
  assert.equal(finished.applied, false);
  assert.equal(LOADS.find((row) => row.id === "K-214").status, "hold");
});

test("hold commit applies only for the current token", () => {
  const gate = createSaveGate();
  const prepared = applyHold(LOADS, "K-214", { minutes: "30", reason: "Glaze crawl." });
  const token = gate.begin();
  const finished = finishHoldCommit(gate, token, prepared);
  assert.equal(finished.applied, true);
  assert.equal(finished.loads.find((row) => row.id === "K-214").status, "hold");
  assert.equal(finished.loads.find((row) => row.id === "K-208").note, LOADS.find((row) => row.id === "K-208").note);
});

test("hold-reject does not mutate loads", () => {
  const gate = createSaveGate();
  const prepared = applyHold(LOADS, "K-214", { minutes: "30", reason: "Glaze crawl." });
  const token = gate.begin();
  const finished = finishHoldCommit(gate, token, prepared, { reject: true });
  assert.equal(finished.rejected, true);
  assert.equal(finished.applied, false);
  assert.match(finished.message, /Nothing was recorded/);
});

test("a newer save invalidates the older token", () => {
  const gate = createSaveGate();
  const first = applyHold(LOADS, "K-214", { minutes: "30", reason: "First." });
  const t1 = gate.begin();
  const second = applyHold(LOADS, "K-201", { minutes: "20", reason: "Second." });
  const t2 = gate.begin();
  assert.equal(finishHoldCommit(gate, t1, first).aborted, true);
  const done = finishHoldCommit(gate, t2, second);
  assert.equal(done.applied, true);
  assert.equal(done.loads.find((row) => row.id === "K-201").status, "hold");
});

test("dialog padding and inner clicks are not backdrop closes", () => {
  const node = {
    getBoundingClientRect: () => ({ left: 100, right: 400, top: 80, bottom: 320 })
  };
  assert.equal(kilnBackdrop({ currentTarget: node, target: node, clientX: 108, clientY: 88 }), false);
  assert.equal(deskBackdrop({ currentTarget: node, target: node, clientX: 108, clientY: 88 }), false);
  assert.equal(kilnBackdrop({ currentTarget: node, target: node, clientX: 10, clientY: 10 }), true);
  assert.equal(kilnBackdrop({ currentTarget: node, target: {}, clientX: 10, clientY: 10 }), false);
});

test("dialog Tab on the last control cycles to the first", () => {
  const first = { disabled: false, hidden: false, getAttribute: () => null, focus() { this.focused = true; } };
  const last = { disabled: false, hidden: false, getAttribute: () => null, focus() { this.focused = true; } };
  const node = {
    open: true,
    querySelectorAll: () => [first, last],
    focus() {}
  };
  const event = { key: "Tab", shiftKey: false, currentTarget: node, target: last, preventDefault() { this.prevented = true; } };
  kilnTab(event);
  assert.equal(event.prevented, true);
  assert.equal(first.focused, true);
  const shift = { key: "Tab", shiftKey: true, currentTarget: node, target: first, preventDefault() { this.prevented = true; } };
  deskTab(shift);
  assert.equal(shift.prevented, true);
  assert.equal(last.focused, true);
});

test("native guide names AccessibilityInfo.announceForAccessibility", () => {
  const text = fs.readFileSync(path.join(skillRoot, "references", "native-mobile.md"), "utf8");
  assert.match(text, /AccessibilityInfo\.announceForAccessibility/);
  assert.doesNotMatch(text, /accessibilityAnnounceForAccessibility/);
});

test("web examples open dialogs with showModal", () => {
  const ui = fs.readFileSync(path.join(skillRoot, "references", "examples", "themeless-react", "ui.jsx"), "utf8");
  const dialog = fs.readFileSync(path.join(skillRoot, "references", "examples", "component-system", "Dialog.jsx"), "utf8");
  assert.match(ui, /showModal/);
  assert.match(dialog, /showModal/);
  assert.match(ui, /<dialog/);
  assert.match(dialog, /<dialog/);
});

test("success copy in native screens is session-honest", () => {
  const screens = fs.readFileSync(path.join(skillRoot, "references", "examples", "native-mobile", "screens.js"), "utf8");
  const app = fs.readFileSync(path.join(skillRoot, "references", "examples", "native-mobile", "App.jsx"), "utf8");
  assert.doesNotMatch(screens, /Saved on this device only/);
  assert.match(screens, /onSave/);
  assert.match(app, /saveNote/);
});

if (failed) {
  console.error(`\n${failed} example-behavior failure(s)`);
  process.exit(1);
}
console.log("\nexample behavior tests passed");
