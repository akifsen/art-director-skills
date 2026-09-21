import { test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DESK, KILN, gotoApp } from "./helpers.js";
import { libraryArms, libraryFlow } from './library-support.js';
import { foldArms, foldFlow } from './fold-support.js';

const artifacts = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../evals/artifacts");

test.describe('ordinary-brief saved outputs', () => {
  test.skip(process.env.ART_DIRECTOR_CRAFT !== '1', 'Optional bounded ordinary-brief captures');
  for (const arm of foldArms) for (const width of [1280, 390]) {
    test(`fold ${arm.name} matching states at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await foldFlow(page, arm, true);
    });
  }
});

test.describe('saved independent library outputs', () => {
  test.skip(process.env.ART_DIRECTOR_EVAL !== '1', 'Optional bounded evaluation captures');
  for (const arm of libraryArms) for (const width of [1440, 390]) {
    test(`${arm.name} states at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await libraryFlow(page, arm, true);
    });
  }
  test('existing system main and long-note dialog', async ({ page }) => {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto('http://127.0.0.1:5194');
      await page.getByRole('heading', { name: 'Morning list' }).waitFor();
      await page.screenshot({ path: path.join(artifacts, `existing-main-${width}.png`), fullPage: true });
      await page.getByRole('button', { name: 'Add note' }).click();
      await page.getByRole('dialog').getByLabel('Clinical note').fill('Fictional evaluation: several sentences should wrap naturally in the selected record editor.\n\nİpek requests a written explanation before the routine check.');
      await page.screenshot({ path: path.join(artifacts, `existing-dialog-${width}.png`), fullPage: true });
    }
  });
});

test.describe("visual captures (author inspection, not a quality score)", () => {
  test.beforeAll(() => {
    fs.mkdirSync(artifacts, { recursive: true });
  });

  test("kiln list, hold form, unknown id", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoApp(page, KILN, "/");
    await page.getByRole("heading", { name: "Loads in fire" }).waitFor();
    await page.screenshot({ path: path.join(artifacts, "kiln-list-1440.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(artifacts, "kiln-list-390.png"), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoApp(page, KILN, "/#/loads/K-214/hold");
    await page.getByRole("heading", { name: "Log a temperature hold" }).waitFor();
    await page.screenshot({ path: path.join(artifacts, "kiln-hold-1440.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByLabel("Reason").fill("A long fictional inspection note: verify glaze at the rear shelf before cooling; keep the same record visible after save.");
    await page.screenshot({ path: path.join(artifacts, "kiln-hold-390.png"), fullPage: true });
    await page.getByRole("button", { name: "Save hold" }).click();
    await page.getByRole("dialog").waitFor();
    await page.screenshot({ path: path.join(artifacts, "kiln-success-390.png"), fullPage: true });
    await page.keyboard.press("Escape");
    await page.screenshot({ path: path.join(artifacts, "kiln-detail-390.png"), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoApp(page, KILN, "/#/loads/K-999");
    await page.getByText("Unknown load").waitFor();
    await page.screenshot({ path: path.join(artifacts, "kiln-unknown-1440.png"), fullPage: true });
    for (const state of ["empty", "error"]) {
      await gotoApp(page, KILN, `/?fixture=${state}`);
      await page.screenshot({ path: path.join(artifacts, `kiln-${state}-1440.png`), fullPage: true });
    }
  });

  test("nadir desk and dialog", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoApp(page, DESK, "/");
    await page.getByRole("heading", { name: "Morning list" }).waitFor();
    await page.screenshot({ path: path.join(artifacts, "nadir-list-1440.png"), fullPage: true });
    await page.getByRole("button", { name: "Add note" }).click();
    await page.getByRole("dialog").waitFor();
    await page.screenshot({ path: path.join(artifacts, "nadir-dialog-1440.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("dialog").getByLabel("Note").fill("Fictional long note for layout inspection. Patient prefers a quiet room and a written explanation before the next routine check.");
    await page.screenshot({ path: path.join(artifacts, "nadir-dialog-390.png"), fullPage: true });
    await page.keyboard.press("Escape");
    await page.screenshot({ path: path.join(artifacts, "nadir-list-390.png"), fullPage: true });
  });
});
