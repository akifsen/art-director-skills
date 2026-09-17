/**
 * Layer: compile-check of example JSX (JS-only transform).
 * Not a browser or native runtime.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileFile } from "../../evals/apps/serve-react.mjs";
import { transformJsx } from "../../evals/apps/transform-jsx.mjs";

const examples = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../skills/art-director/references/examples");
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

test("fragment and spread compile", () => {
  const out = transformJsx(`export function X(p){ return <><div {...p} className="a">{p.children}</div></>; }`);
  assert.match(out, /React\.createElement\(React\.Fragment/);
  assert.match(out, /Object\.assign/);
  assert.match(out, /className: "a"/);
});

test("kiln App.jsx compiles", () => {
  const out = compileFile(path.join(examples, "themeless-react", "App.jsx"));
  assert.match(out, /React\.createElement/);
  assert.match(out, /Loads in fire/);
  assert.match(out, /#\/loads\/\$\{row\.id\}/);
  assert.match(out, /Log a hold/);
  assert.doesNotMatch(out, /<div className/);
  assert.doesNotMatch(out, /<Button /);
});

test("kiln ui.jsx compiles", () => {
  const out = compileFile(path.join(examples, "themeless-react", "ui.jsx"));
  assert.match(out, /createElement\("dialog"/);
  assert.match(out, /showModal/);
});

test("nadir DeskScreen compiles", () => {
  const out = compileFile(path.join(examples, "component-system", "DeskScreen.jsx"));
  assert.match(out, /Morning list/);
  assert.match(out, /commitNote/);
  assert.doesNotMatch(out, /<[A-Za-z]/);
});

test("nadir Dialog compiles", () => {
  const out = compileFile(path.join(examples, "component-system", "Dialog.jsx"));
  assert.match(out, /createElement\("dialog"/);
});

if (failed) {
  console.error(`\n${failed} compile failure(s)`);
  process.exit(1);
}
console.log("\njsx compile checks passed");
