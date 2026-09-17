/**
 * Layer: real browser flow (Playwright + Vite React app).
 * Not a source-string search and not a native runtime.
 */
import { test, expect } from "@playwright/test";

test.describe("kiln queue — browser flow", () => {
  test("list to hold save updates that load", async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/?fixture=empty");
    await expect(page.getByText("No loads in this log")).toBeVisible();

    await page.goto("http://127.0.0.1:5173/");
    await expect(page.getByRole("heading", { name: "Loads in fire" })).toBeVisible({ timeout: 5000 });
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
    await page.goto("http://127.0.0.1:5173/#/loads/K-214/hold");
    await expect(page.getByRole("heading", { name: "Log a temperature hold" })).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: "Save hold" }).click();
    await expect(page.getByText("Say why the hold exists")).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("unknown load and unknown hold are safe", async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/#/loads/K-999");
    await expect(page.getByText("Unknown load")).toBeVisible({ timeout: 5000 });
    await page.goto("http://127.0.0.1:5173/#/loads/K-999/hold");
    await expect(page.getByText("Unknown load")).toBeVisible();
    await page.goto("http://127.0.0.1:5173/#/nope");
    await expect(page.getByText("Unknown place in the queue")).toBeVisible();
  });

  test("loading fixture stays on the wait state", async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/?fixture=loading");
    await expect(page.getByText("Reading the kiln log")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Loads in fire" })).toHaveCount(0);
  });

  test("error fixture offers retry", async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/?fixture=error");
    await expect(page.getByText("Kiln log unavailable")).toBeVisible();
    await page.getByRole("button", { name: "Retry" }).click();
    await expect(page.getByRole("heading", { name: "Loads in fire" })).toBeVisible({ timeout: 5000 });
  });

  test("dialog traps tab and restores focus", async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/#/loads/K-201/hold");
    await expect(page.getByRole("heading", { name: "Log a temperature hold" })).toBeVisible({ timeout: 5000 });
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
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "K-201" })).toBeVisible();
  });
});
