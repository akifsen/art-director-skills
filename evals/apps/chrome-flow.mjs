/**
 * Layer: real browser flow via Chrome DevTools Protocol.
 * Compiles the skill React source (not a CSS-only mock). Playwright is
 * used in CI when npm install of Vite/Playwright succeeds.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { APPS, listen } from "./serve-react.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const artifacts = path.join(repoRoot, "evals", "artifacts");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const debugPort = 9333;

let failed = 0;
function ok(name) {
  console.log("ok:", name);
}
function fail(name, err) {
  failed += 1;
  console.error("FAIL:", name, err && err.message ? err.message : err);
}

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.next = 0;
    this.pending = new Map();
  }

  ready() {
    return new Promise((resolve, reject) => {
      this.ws.addEventListener("open", () => resolve());
      this.ws.addEventListener("error", reject);
    this.exceptions = [];
    this.logs = [];
    this.ws.addEventListener("message", (event) => {
      const msg = JSON.parse(String(event.data));
      if (msg.method === "Runtime.exceptionThrown") {
        this.exceptions.push(msg.params?.exceptionDetails?.text || JSON.stringify(msg.params?.exceptionDetails?.exception || msg.params));
      }
      if (msg.method === "Runtime.consoleAPICalled") {
        const args = (msg.params?.args || []).map((a) => a.value || a.description || "").join(" ");
        this.logs.push(`${msg.params?.type}: ${args}`);
      }
      if (msg.id && this.pending.has(msg.id)) {
          const { resolve: res, reject: rej } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) rej(new Error(msg.error.message || JSON.stringify(msg.error)));
          else res(msg.result);
        }
      });
    });
  }

  send(method, params = {}) {
    const id = ++this.next;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  close() {
    this.ws.close();
  }
}

async function waitFor(cdp, expression, timeout = 8000) {
  const start = Date.now();
  let last = "";
  while (Date.now() - start < timeout) {
    const result = await cdp.send("Runtime.evaluate", { expression, returnByValue: true });
    last = result.result?.value;
    if (last) return last;
    await new Promise((r) => setTimeout(r, 150));
  }
  const dump = await cdp.send("Runtime.evaluate", {
    expression: "({ href: location.href, text: (document.body && document.body.innerText || '').slice(0, 1500), html: (document.documentElement && document.documentElement.outerHTML || '').slice(0, 1500) })",
    returnByValue: true
  });
  throw new Error(`timeout waiting for ${expression} dump=${JSON.stringify(dump.result?.value)} exceptions=${JSON.stringify(cdp.exceptions)} logs=${JSON.stringify(cdp.logs)}`);
}

async function text(cdp) {
  const result = await cdp.send("Runtime.evaluate", {
    expression: "document.body && document.body.innerText || ''",
    returnByValue: true
  });
  return result.result?.value || "";
}

async function click(cdp, selector) {
  await cdp.send("Runtime.evaluate", {
    expression: `document.querySelector(${JSON.stringify(selector)})?.click()`,
    returnByValue: true
  });
}

async function clickHasText(cdp, tag, needle) {
  const expression = `(() => {
    const nodes = [...document.querySelectorAll(${JSON.stringify(tag)})];
    const node = nodes.find((el) => (el.innerText || el.textContent || "").includes(${JSON.stringify(needle)}));
    if (!node) return false;
    node.click();
    return true;
  })()`;
  const result = await waitFor(cdp, expression, 5000);
  if (!result) throw new Error(`no ${tag} with ${needle}`);
}

async function fill(cdp, selector, value) {
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
      setter.call(el, ${JSON.stringify(value)});
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    })()`,
    returnByValue: true
  });
}

async function key(cdp, name) {
  const map = { Tab: { key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 }, Escape: { key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 } };
  const spec = map[name];
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", ...spec });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", ...spec });
}

async function screenshot(cdp, name) {
  const result = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.mkdirSync(artifacts, { recursive: true });
  fs.writeFileSync(path.join(artifacts, name), Buffer.from(result.data, "base64"));
}

async function connectBrowser() {
  const version = await fetch(`http://127.0.0.1:${debugPort}/json/version`).then((r) => r.json());
  const browser = new Cdp(version.webSocketDebuggerUrl);
  await browser.ready();
  return browser;
}

async function openPage(browser, url) {
  const created = await browser.send("Target.createTarget", { url });
  let target;
  for (let n = 0; n < 20 && !target; n += 1) {
    const listed = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((r) => r.json());
    target = listed.find((row) => row.id === created.targetId && row.webSocketDebuggerUrl);
    if (!target) await new Promise((r) => setTimeout(r, 100));
  }
  if (!target?.webSocketDebuggerUrl) {
    throw new Error(`no page target for ${url}: ${JSON.stringify(created)}`);
  }
  const cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.ready();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await waitFor(cdp, `location.href.includes(${JSON.stringify(new URL(url).host)}) && document.querySelector("#root")`, 8000);
  await new Promise((r) => setTimeout(r, 400));
  return cdp;
}

async function main() {
  if (!fs.existsSync(chromePath)) {
    console.error("Chrome not found; browser flow pending");
    process.exit(2);
  }

  const kilnServer = await listen(APPS.kiln);
  const deskServer = await listen(APPS.desk);
  const sample = await fetch("http://127.0.0.1:5173/main.jsx");
  const sampleText = await sample.text();
  if (!sample.ok || !sampleText.includes("createRoot")) {
    throw new Error(`main.jsx not served: ${sample.status} ${sampleText.slice(0, 400)}`);
  }
  console.log("served main.jsx bytes", sampleText.length);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "ad-chrome-"));
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    "--headless=new",
    "--disable-gpu",
    "--window-size=1440,900",
    "--no-first-run",
    "about:blank"
  ], { stdio: "pipe" });

  const started = Date.now();
  while (Date.now() - started < 8000) {
    try {
      const res = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (res.ok) break;
    } catch {
      await new Promise((r) => setTimeout(r, 150));
    }
  }
  const browser = await connectBrowser();

  try {
    {
      const page = await openPage(browser, "http://127.0.0.1:5173/?fixture=empty");
      await waitFor(page, `document.body.innerText.includes("No loads in this log")`);
      ok("kiln empty fixture (browser)");
      page.close();
    }
    {
      const page = await openPage(browser, "http://127.0.0.1:5173/?fixture=loading");
      await waitFor(page, `document.body.innerText.includes("Reading the kiln log")`);
      const body = await text(page);
      if (body.includes("Loads in fire")) throw new Error("loading fixture showed the list");
      ok("kiln loading fixture (browser)");
      page.close();
    }
    {
      const page = await openPage(browser, "http://127.0.0.1:5173/#/loads/K-999");
      await waitFor(page, `document.body.innerText.includes("Unknown load")`);
      ok("kiln unknown detail (browser)");
      await screenshot(page, "kiln-unknown-1440.png");
      page.close();
    }
    {
      const page = await openPage(browser, "http://127.0.0.1:5173/#/nope");
      await waitFor(page, `document.body.innerText.includes("Unknown place in the queue")`);
      ok("kiln unknown route (browser)");
      page.close();
    }
    {
      const page = await openPage(browser, "http://127.0.0.1:5173/");
      await waitFor(page, `document.body.innerText.includes("Loads in fire")`, 8000);
      await screenshot(page, "kiln-list-1440.png");
      await clickHasText(page, "a", "K-214");
      await waitFor(page, `document.body.innerText.includes("Log a hold")`);
      await clickHasText(page, "button", "Log a hold");
      await waitFor(page, `document.body.innerText.includes("Log a temperature hold")`);
      await screenshot(page, "kiln-hold-1440.png");
      await page.send("Runtime.evaluate", {
        expression: `(() => {
          const labels = [...document.querySelectorAll("label")];
          const reason = labels.find((l) => l.textContent.includes("Reason"));
          const input = reason.querySelector("input");
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
          setter.call(input, "Glaze crawl check");
          input.dispatchEvent(new Event("input", { bubbles: true }));
        })()`
      });
      await clickHasText(page, "button", "Save hold");
      await waitFor(page, `document.querySelector("dialog") && document.querySelector("dialog").open`, 8000);
      const dialogText = await text(page);
      if (!/this session/i.test(dialogText)) throw new Error("success dialog missing session copy");
      await clickHasText(page, "button", "Back to K-214");
      await waitFor(page, `document.body.innerText.includes("Glaze crawl check")`);
      ok("kiln save writes onto K-214 (browser)");
      page.close();
    }
    {
      const page = await openPage(browser, "http://127.0.0.1:5173/#/loads/K-214/hold");
      await waitFor(page, `document.body.innerText.includes("Log a temperature hold")`);
      await clickHasText(page, "button", "Save hold");
      await waitFor(page, `document.body.innerText.includes("Say why the hold exists")`);
      const hasDialog = await page.send("Runtime.evaluate", {
        expression: `document.querySelectorAll("dialog[open]").length`,
        returnByValue: true
      });
      if (hasDialog.result.value !== 0) throw new Error("validation opened a success dialog");
      ok("kiln empty reason does not fake success (browser)");
      page.close();
    }
    {
      const page = await openPage(browser, "http://127.0.0.1:5173/#/loads/K-201/hold");
      await waitFor(page, `document.body.innerText.includes("Log a temperature hold")`);
      await page.send("Runtime.evaluate", {
        expression: `(() => {
          const labels = [...document.querySelectorAll("label")];
          const reason = labels.find((l) => l.textContent.includes("Reason"));
          const input = reason.querySelector("input");
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
          setter.call(input, "Cool-down soak");
          input.dispatchEvent(new Event("input", { bubbles: true }));
        })()`
      });
      await clickHasText(page, "button", "Save hold");
      await waitFor(page, `document.body.innerText.includes("this session")`);
      const focused = await page.send("Runtime.evaluate", {
        expression: `document.activeElement && document.activeElement.textContent`,
        returnByValue: true
      });
      if (!String(focused.result.value).includes("Back to K-201")) {
        throw new Error(`dialog focus was ${focused.result.value}`);
      }
      await key(page, "Tab");
      const still = await page.send("Runtime.evaluate", {
        expression: `document.activeElement && document.activeElement.textContent`,
        returnByValue: true
      });
      if (!String(still.result.value).includes("Back to K-201")) {
        throw new Error(`tab escaped dialog to ${still.result.value}`);
      }
      await key(page, "Escape");
      await waitFor(page, `document.body.innerText.includes("K-201") && !document.body.innerText.includes("this session")`);
      ok("kiln dialog focus trap and escape (browser)");
      page.close();
    }
    {
      const page = await openPage(browser, "http://127.0.0.1:5174/");
      await waitFor(page, `document.body.innerText.includes("Morning list")`, 8000);
      await screenshot(page, "nadir-list-1440.png");
      await clickHasText(page, "button", "Add note");
      await waitFor(page, `!!document.querySelector("dialog[open], dialog") && document.body.innerText.includes("Note ·")`);
      await screenshot(page, "nadir-dialog-1440.png");
      await page.send("Runtime.evaluate", {
        expression: `(() => {
          const input = document.querySelector("dialog input, [role=dialog] input") || document.querySelector("input");
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
          setter.call(input, "Dressing dry.");
          input.dispatchEvent(new Event("input", { bubbles: true }));
        })()`
      });
      await clickHasText(page, "button", "Save note");
      await waitFor(page, `document.body.innerText.includes("Dressing dry.")`);
      await page.send("Runtime.evaluate", {
        expression: `([...document.querySelectorAll("tr")].find((row) => row.textContent.includes("N-442")) || {}).click?.()`,
        returnByValue: true
      });
      await waitFor(page, `document.body.innerText.includes("No clinical note yet.")`);
      await clickHasText(page, "button", "Add note");
      await page.send("Runtime.evaluate", {
        expression: `(() => {
          const input = document.querySelector("dialog input") || document.querySelector("input");
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
          setter.call(input, "Do not keep.");
          input.dispatchEvent(new Event("input", { bubbles: true }));
        })()`
      });
      await clickHasText(page, "button", "Cancel");
      await waitFor(page, `document.body.innerText.includes("No clinical note yet.")`);
      await page.send("Runtime.evaluate", {
        expression: `([...document.querySelectorAll("tr")].find((row) => row.textContent.includes("N-441")) || {}).click?.()`,
        returnByValue: true
      });
      await waitFor(page, `document.body.innerText.includes("Dressing dry.")`);
      ok("nadir per-row save and cancel (browser)");
      page.close();
    }
  } catch (err) {
    fail("browser flow", err);
  } finally {
    chrome.kill();
    browser.close();
    kilnServer.close();
    deskServer.close();
  }

  if (failed) {
    console.error(`\n${failed} browser failure(s)`);
    process.exit(1);
  }
  console.log("\nbrowser example flows passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
