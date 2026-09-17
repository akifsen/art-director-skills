/**
 * Layer: real browser flow (Playwright + Vite production preview).
 * Not a source-string search and not a native runtime.
 * Does not use page.clock (patches rAF; https://playwright.dev/docs/clock).
 */
import { test, expect } from "@playwright/test";
import {
  KILN,
  clickDialogPadding,
  clickOutsideDialog,
  gotoApp
} from "./helpers.js";

const HOLD_MS = 2000;

test.describe("kiln queue — browser flow", () => {
  test("list to hold save updates that load", async ({ page }) => {
    await gotoApp(page, KILN, "/?fixture=empty");
    await expect(page.getByText("No loads in this log")).toBeVisible();

    await gotoApp(page, KILN, "/");
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
    await gotoApp(page, KILN, "/#/loads/K-214/hold");
    await expect(page.getByRole("heading", { name: "Log a temperature hold" })).toBeVisible();
    await page.getByRole("button", { name: "Save hold" }).click();
    await expect(page.getByText("Say why the hold exists")).toBeVisible();
    await expect(page.locator("dialog[open]")).toHaveCount(0);
  });

  test("unknown load and unknown hold are safe", async ({ page }) => {
    await gotoApp(page, KILN, "/#/loads/K-999");
    await expect(page.getByText("Unknown load")).toBeVisible();
    await page.getByRole("button", { name: "Back to loads" }).click();
    await expect(page.getByRole("heading", { name: "Loads in fire" })).toBeVisible();
    await gotoApp(page, KILN, "/#/loads/K-999/hold");
    await expect(page.getByText("Unknown load")).toBeVisible();
    await gotoApp(page, KILN, "/#/nope");
    await expect(page.getByText("Unknown place in the queue")).toBeVisible();
  });

  test("loading fixture stays on the wait state", async ({ page }) => {
    await gotoApp(page, KILN, "/?fixture=loading");
    await expect(page.getByText("Reading the kiln log")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Loads in fire" })).toHaveCount(0);
  });

  test("error fixture offers retry", async ({ page }) => {
    await gotoApp(page, KILN, "/?fixture=error");
    await expect(page.getByText("Kiln log unavailable")).toBeVisible();
    await page.getByRole("button", { name: "Retry" }).click();
    await expect(page.getByRole("heading", { name: "Loads in fire" })).toBeVisible();
  });

  test("dialog traps tab and restores focus", async ({ page }) => {
    await gotoApp(page, KILN, "/#/loads/K-201/hold");
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
    await gotoApp(page, KILN, `/?holdDelay=${HOLD_MS}#/loads/K-201/hold`);
    await expect(page.getByRole("heading", { name: "Log a temperature hold" })).toBeVisible();
    await page.getByLabel("Reason").fill("Should not land");
    await page.getByRole("button", { name: "Save hold" }).click();
    await expect(page.getByRole("button", { name: "Working…" })).toBeDisabled();
    await page.getByRole("button", { name: "Cancel write" }).click();
    await expect(page.getByRole("heading", { name: "K-201" })).toBeVisible();
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(page.getByText("Should not land")).toHaveCount(0);
    await expect(page.getByText("Cool below 80 °C")).toBeVisible();
    await expect(page.getByText("Should not land")).toHaveCount(0);
    await page.evaluate((ms) => new Promise((resolve) => setTimeout(resolve, ms)), HOLD_MS + 300);
    await expect(page.getByText("Should not land")).toHaveCount(0);
    await expect(page.getByText("Cool below 80 °C")).toBeVisible();
  });

  test("leaving the hold form during write does not commit later", async ({ page }) => {
    await gotoApp(page, KILN, `/?holdDelay=${HOLD_MS}#/loads/K-201/hold`);
    await page.getByLabel("Reason").fill("Stale write");
    await page.getByRole("button", { name: "Save hold" }).click();
    await expect(page.getByRole("button", { name: "Working…" })).toBeDisabled();
    await page.getByRole("button", { name: "All loads" }).click();
    await page.evaluate((ms) => new Promise((resolve) => setTimeout(resolve, ms)), HOLD_MS + 300);
    await page.getByRole("link", { name: /K-201/ }).click();
    await expect(page.getByText("Stale write")).toHaveCount(0);
  });

  test("double save keeps a single commit", async ({ page }) => {
    await gotoApp(page, KILN, `/?holdDelay=${HOLD_MS}#/loads/K-208/hold`);
    await page.getByLabel("Reason").fill("One write");
    const save = page.getByRole("button", { name: "Save hold" });
    await save.click();
    await expect(page.getByRole("button", { name: "Working…" })).toBeDisabled();
    await save.click({ force: true }).catch(() => {});
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(1);
  });

  test("rejected hold offers retry that can succeed", async ({ page }) => {
    await gotoApp(page, KILN, `/?fixture=hold-reject&holdDelay=${HOLD_MS}#/loads/K-201/hold`);
    await page.getByLabel("Reason").fill("Controller busy");
    await page.getByRole("button", { name: "Save hold" }).click();
    await expect(page.getByRole("alert")).toContainText("Nothing was recorded");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await page.getByRole("button", { name: "Retry" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toContainText("this session");
  });

  test("switching loads during write does not apply the first hold", async ({ page }) => {
    await gotoApp(page, KILN, `/?holdDelay=${HOLD_MS}#/loads/K-201/hold`);
    await page.getByLabel("Reason").fill("For 201 only");
    await page.getByRole("button", { name: "Save hold" }).click();
    await expect(page.getByRole("button", { name: "Working…" })).toBeDisabled();
    await page.getByRole("button", { name: "All loads" }).click();
    await page.getByRole("link", { name: /K-208/ }).click();
    await page.evaluate((ms) => new Promise((resolve) => setTimeout(resolve, ms)), HOLD_MS + 300);
    await expect(page.getByText("For 201 only")).toHaveCount(0);
    await page.getByRole("button", { name: "All loads" }).click();
    await page.getByRole("link", { name: /K-201/ }).click();
    await expect(page.getByText("For 201 only")).toHaveCount(0);
    await expect(page.getByText("Cool below 80 °C")).toBeVisible();
  });

  test("dialog inner padding does not close; true backdrop does", async ({ page }) => {
    await gotoApp(page, KILN, "/#/loads/K-201/hold");
    await page.getByLabel("Reason").fill("Padding check");
    await page.getByRole("button", { name: "Save hold" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await clickDialogPadding(dialog);
    await expect(dialog).toBeVisible();
    await clickOutsideDialog(dialog);
    await expect(page.locator("dialog[open]")).toHaveCount(0);
  });
});
