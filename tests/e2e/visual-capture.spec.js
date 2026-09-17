import { test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const artifacts = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../evals/artifacts");

test.describe("visual captures (author inspection, not a quality score)", () => {
  test.beforeAll(() => {
    fs.mkdirSync(artifacts, { recursive: true });
  });

  test("kiln list, hold form, unknown id", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://127.0.0.1:5173/");
    await page.getByRole("heading", { name: "Loads in fire" }).waitFor({ timeout: 5000 });
    await page.screenshot({ path: path.join(artifacts, "kiln-list-1440.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(artifacts, "kiln-list-390.png"), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://127.0.0.1:5173/#/loads/K-214/hold");
    await page.getByRole("heading", { name: "Log a temperature hold" }).waitFor();
    await page.screenshot({ path: path.join(artifacts, "kiln-hold-1440.png"), fullPage: true });
    await page.goto("http://127.0.0.1:5173/#/loads/K-999");
    await page.getByText("Unknown load").waitFor();
    await page.screenshot({ path: path.join(artifacts, "kiln-unknown-1440.png"), fullPage: true });
  });

  test("nadir desk and dialog", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://127.0.0.1:5174/");
    await page.getByRole("heading", { name: "Morning list" }).waitFor();
    await page.screenshot({ path: path.join(artifacts, "nadir-list-1440.png"), fullPage: true });
    await page.getByRole("button", { name: "Add note" }).click();
    await page.getByRole("dialog").waitFor();
    await page.screenshot({ path: path.join(artifacts, "nadir-dialog-1440.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.keyboard.press("Escape");
    await page.screenshot({ path: path.join(artifacts, "nadir-list-390.png"), fullPage: true });
  });
});
