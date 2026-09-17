/**
 * Layer: real browser flow (Playwright + Vite React app).
 * Not a source-string search and not a native runtime.
 */
import { test, expect } from "@playwright/test";

async function ready(page) {
  await expect(page.locator("#root")).not.toBeEmpty();
}

test.describe("kiln queue — browser flow", () => {
  test("list to hold save updates that load", async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/?fixture=empty", { waitUntil: "domcontentloaded" });
    await ready(page);
    await expect(page.getByText("No loads in this log")).toBeVisible();

    await page.goto("http://127.0.0.1:5173/", { waitUntil: "domcontentloaded" });
    await ready(page);
    await expect(page.getByRole("heading", { name: "Loads in fire" })).toBeVisible();
    await page.getByRole("link", { name: /K-214/ }).click();
    await expect(page.getByRole("heading", { name: "K-214" })).toBeVisible();
    await page.getByRole("button", { name: "Log a hold" }).click();
    await page.getByLabel("Reason").fill("Glaze crawl check");
    await page.getByRole("button", { name: "Save hold" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading")).toContainText("this session");
    await dialog.getByRole("button", { name: /Back to K-214/ }).click();
    await expect(page.getByText(/Glaze crawl check/)).toBeVisible();
    await page.getByRole("button", { name: "All loads" }).click();
    await page.getByLabel("Filter loads").fill("zzz");
    await expect(page.getByText("No loads match")).toBeVisible();
  });

  test("empty reason keeps the dialog closed and shows a field error", async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/#/loads/K-214/hold", { waitUntil: "domcontentloaded" });
    await ready(page);
    await expect(page.getByRole("heading", { name: "Log a temperature hold" })).toBeVisible();
    await page.getByRole("button", { name: "Save hold" }).click();
    await expect(page.getByText("Say why the hold exists")).toBeVisible();
    await expect(page.locator("dialog[open]")).toHaveCount(0);
  });

  test("unknown load and unknown hold are safe", async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/#/loads/K-999", { waitUntil: "domcontentloaded" });
    await ready(page);
    await expect(page.getByText("Unknown load")).toBeVisible();
    await page.getByRole("button", { name: "Back to loads" }).click();
    await expect(page.getByRole("heading", { name: "Loads in fire" })).toBeVisible();
    await page.goto("http://127.0.0.1:5173/#/loads/K-999/hold", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Unknown load")).toBeVisible();
    await page.goto("http://127.0.0.1:5173/#/nope", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Unknown place in the queue")).toBeVisible();
  });

  test("loading fixture stays on the wait state", async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/?fixture=loading", { waitUntil: "domcontentloaded" });
    await ready(page);
    await expect(page.getByText("Reading the kiln log")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Loads in fire" })).toHaveCount(0);
  });

  test("error fixture offers retry", async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/?fixture=error", { waitUntil: "domcontentloaded" });
    await ready(page);
    await expect(page.getByText("Kiln log unavailable")).toBeVisible();
    await page.getByRole("button", { name: "Retry" }).click();
    await expect(page.getByRole("heading", { name: "Loads in fire" })).toBeVisible();
  });

  test("dialog traps tab and restores focus", async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/#/loads/K-201/hold", { waitUntil: "domcontentloaded" });
    await ready(page);
    await expect(page.getByRole("heading", { name: "Log a temperature hold" })).toBeVisible();
    await page.getByLabel("Reason").fill("Cool-down soak");
    const save = page.getByRole("button", { name: "Save hold" });
    await save.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const back = dialog.getByRole("button", { name: /Back to K-201/ });
    await expect(back).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(back).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "K-201" })).toBeVisible();
  });

  test("save then cancel does not commit the hold", async ({ page }) => {
    await page.clock.install();
    await page.goto("http://127.0.0.1:5173/#/loads/K-201/hold", { waitUntil: "domcontentloaded" });
    await page.clock.fastForward(400);
    await ready(page);
    await expect(page.getByRole("heading", { name: "Log a temperature hold" })).toBeVisible();
    await page.getByLabel("Reason").fill("Should not land");
    await page.getByRole("button", { name: "Save hold" }).click();
    await expect(page.getByRole("button", { name: "Working…" })).toBeDisabled();
    await page.getByRole("button", { name: "Cancel write" }).click();
    await page.clock.fastForward(1000);
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "K-201" })).toBeVisible();
    await expect(page.getByText("Should not land")).toHaveCount(0);
    await expect(page.getByText("Cool below 80 °C")).toBeVisible();
  });

  test("leaving the hold form during write does not commit later", async ({ page }) => {
    await page.clock.install();
    await page.goto("http://127.0.0.1:5173/#/loads/K-201/hold", { waitUntil: "domcontentloaded" });
    await page.clock.fastForward(400);
    await ready(page);
    await page.getByLabel("Reason").fill("Stale write");
    await page.getByRole("button", { name: "Save hold" }).click();
    await page.getByRole("button", { name: "All loads" }).click();
    await page.clock.fastForward(1000);
    await page.getByRole("link", { name: /K-201/ }).click();
    await expect(page.getByText("Stale write")).toHaveCount(0);
  });

  test("double save keeps a single commit", async ({ page }) => {
    await page.clock.install();
    await page.goto("http://127.0.0.1:5173/#/loads/K-208/hold", { waitUntil: "domcontentloaded" });
    await page.clock.fastForward(400);
    await ready(page);
    await page.getByLabel("Reason").fill("One write");
    const save = page.getByRole("button", { name: "Save hold" });
    await save.click();
    await expect(page.getByRole("button", { name: "Working…" })).toBeDisabled();
    await save.click({ force: true }).catch(() => {});
    await page.clock.fastForward(500);
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(1);
  });

  test("rejected hold offers retry that can succeed", async ({ page }) => {
    await page.clock.install();
    await page.goto("http://127.0.0.1:5173/?fixture=hold-reject#/loads/K-201/hold", { waitUntil: "domcontentloaded" });
    await page.clock.fastForward(400);
    await ready(page);
    await page.getByLabel("Reason").fill("Controller busy");
    await page.getByRole("button", { name: "Save hold" }).click();
    await page.clock.fastForward(500);
    await expect(page.getByRole("alert")).toContainText("Nothing was recorded");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await page.getByRole("button", { name: "Retry" }).click();
    await page.clock.fastForward(500);
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toContainText("this session");
  });

  test("switching loads during write does not apply the first hold", async ({ page }) => {
    await page.clock.install();
    await page.goto("http://127.0.0.1:5173/#/loads/K-201/hold", { waitUntil: "domcontentloaded" });
    await page.clock.fastForward(400);
    await ready(page);
    await page.getByLabel("Reason").fill("For 201 only");
    await page.getByRole("button", { name: "Save hold" }).click();
    await page.getByRole("button", { name: "All loads" }).click();
    await page.clock.fastForward(400);
    await page.getByRole("link", { name: /K-208/ }).click();
    await page.clock.fastForward(1000);
    await expect(page.getByText("For 201 only")).toHaveCount(0);
    await page.getByRole("button", { name: "All loads" }).click();
    await page.getByRole("link", { name: /K-201/ }).click();
    await expect(page.getByText("For 201 only")).toHaveCount(0);
    await expect(page.getByText("Cool below 80 °C")).toBeVisible();
  });

  test("dialog inner padding does not close; true backdrop does", async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/#/loads/K-201/hold", { waitUntil: "domcontentloaded" });
    await ready(page);
    await page.getByLabel("Reason").fill("Padding check");
    await page.getByRole("button", { name: "Save hold" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box).toBeTruthy();
    await page.mouse.click(box.x + 10, box.y + 10);
    await expect(dialog).toBeVisible();
    await page.mouse.click(8, 8);
    await expect(page.locator("dialog[open]")).toHaveCount(0);
  });
});
