/**
 * Layer: real browser flow (Playwright + Vite production preview).
 * Not a source-string search and not a native runtime.
 */
import { test, expect } from "@playwright/test";
import { DESK, clickDialogPadding, clickOutsideDialog, gotoApp } from "./helpers.js";

test.describe("nadir desk — per-record notes", () => {
  test("save binds to the selected row and cancel does not clobber it", async ({ page }) => {
    await gotoApp(page, DESK, "/");
    await expect(page.getByRole("heading", { name: "Morning list" })).toBeVisible();
    await page.getByRole("button", { name: "Add note" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByLabel("Note").fill("Dressing dry.");
    await dialog.getByRole("button", { name: "Save note" }).click();
    await expect(page.getByText("Dressing dry.")).toBeVisible();

    await page.getByRole("row", { name: /N-442/ }).click();
    await page.getByRole("button", { name: "Add note" }).click();
    await page.getByRole("dialog").getByLabel("Note").fill("Do not keep.");
    await page.getByRole("dialog").getByRole("button", { name: "Cancel" }).click();
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(page.getByText("No clinical note yet.")).toBeVisible();

    await page.getByRole("row", { name: /N-441/ }).click();
    await expect(page.getByText("Dressing dry.")).toBeVisible();
  });

  test("dialog focuses the field, traps tab, and restores the opener", async ({ page }) => {
    await gotoApp(page, DESK, "/");
    const add = page.getByRole("button", { name: "Add note" });
    await add.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Note")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Save note" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Cancel" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByLabel("Note")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(add).toBeFocused();
  });

  test("inner panel click keeps the draft; backdrop cancel discards it", async ({ page }) => {
    await gotoApp(page, DESK, "/");
    await page.getByRole("button", { name: "Add note" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByLabel("Note").fill("Keep drafting.");
    await clickDialogPadding(dialog);
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Note")).toHaveValue("Keep drafting.");
    await clickOutsideDialog(dialog);
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(page.getByText("No clinical note yet.")).toBeVisible();
  });
});
