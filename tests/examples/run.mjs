/**
 * Layer: component-store (Node assert). Not a browser or native runtime.
 */
import assert from "node:assert/strict";
import { createSession, getStation, saveNote, cancelNote } from "../../skills/art-director/references/examples/native-mobile/session-store.js";
import { createDesk, selectRow, openNoteDialog, setDraft, commitNote, cancelNoteDialog, noteFor } from "../../skills/art-director/references/examples/component-system/notes-store.js";
import { parseRoute, readFixture, filterLoads, validateHold, applyHold } from "../../skills/art-director/references/examples/themeless-react/kiln-store.js";
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
  assert.equal(readFixture(""), null);
  assert.equal(filterLoads(LOADS, "zzz").length, 0);
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
