/**
 * Layer: real browser on the Vite production preview of Rail Still.
 * Proves the inquire action is readable (computed contrast), not only present.
 * Not a native runtime. Does not open a mail client.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";
import {
  RAIL,
  contrastRatio,
  gotoApp,
  parseRgb
} from "./helpers.js";

const artifacts = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../evals/artifacts"
);

/** WCAG 2 AA for normal text. This label is ~1.05rem / weight 600, not large text. */
const AA_NORMAL = 4.5;

async function mailLink(page) {
  return page.getByRole("link", { name: "Email the desk" });
}

async function paint(locator) {
  return locator.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      color: cs.color,
      background: cs.backgroundColor,
      outlineWidth: cs.outlineWidth,
      outlineStyle: cs.outlineStyle,
      outlineColor: cs.outlineColor,
      outlineOffset: cs.outlineOffset,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      clientWidth: el.clientWidth,
      scrollWidth: el.scrollWidth,
      clientHeight: el.clientHeight,
      scrollHeight: el.scrollHeight,
      text: (el.innerText || "").trim()
    };
  });
}

function expectReadableFill(paintState, label) {
  const fg = parseRgb(paintState.color);
  const bg = parseRgb(paintState.background);
  expect(fg, `${label}: text color parsed`).not.toEqual(bg);
  const ratio = contrastRatio(fg, bg);
  expect(
    ratio,
    `${label}: contrast ${ratio.toFixed(2)}:1 (fg ${paintState.color} on ${paintState.background})`
  ).toBeGreaterThanOrEqual(AA_NORMAL);
}

function expectUnclippedLabel(paintState, label) {
  expect(paintState.scrollWidth, `${label}: label not clipped horizontally`).toBeLessThanOrEqual(
    paintState.clientWidth + 1
  );
  expect(paintState.scrollHeight, `${label}: label not clipped vertically`).toBeLessThanOrEqual(
    paintState.clientHeight + 1
  );
}

test.describe("rail still — inquire action", () => {
  test.beforeAll(() => {
    fs.mkdirSync(artifacts, { recursive: true });
  });

  for (const { width, height } of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 }
  ]) {
    test(`Email the desk is readable at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await gotoApp(page, RAIL, "/");
      await expect(page.getByRole("heading", { name: "Linear 40" })).toBeVisible();

      const work = page.getByRole("navigation", { name: "Studio" }).getByRole("link", { name: "Work" });
      await expect(work).toBeVisible();
      const workPaint = await paint(work);
      const bodyPaint = await page.evaluate(() => {
        const cs = getComputedStyle(document.body);
        return { color: cs.color, background: cs.backgroundColor };
      });
      expect(parseRgb(workPaint.color)).toEqual(parseRgb(bodyPaint.color));

      const link = await mailLink(page);
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", /mailto:desk@railstill\.example\?subject=Catalog%20still/);
      await expect(link).toHaveText("Email the desk");

      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      expect(box.width).toBeGreaterThan(8);
      expect(box.height).toBeGreaterThan(8);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);

      const rest = await paint(link);
      expect(rest.text).toBe("Email the desk");
      expectReadableFill(rest, `normal ${width}`);
      expectUnclippedLabel(rest, `normal ${width}`);

      await page.screenshot({
        path: path.join(artifacts, `rail-still-inquire-${width}.png`),
        fullPage: true
      });
    });
  }

  test("hover keeps readable fill and nav links stay inherited", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoApp(page, RAIL, "/");
    const link = await mailLink(page);
    await link.scrollIntoViewIfNeeded();
    const rest = await paint(link);
    await link.hover();
    const hovered = await paint(link);
    expectReadableFill(hovered, "hover");
    expect(hovered.background).not.toBe(rest.background);
    await link.screenshot({
      path: path.join(artifacts, "rail-still-mail-hover-1280.png")
    });

    const studio = page.getByRole("navigation", { name: "Studio" }).getByRole("link", { name: "Studio" });
    await studio.hover();
    const studioPaint = await paint(studio);
    const bodyColor = await page.evaluate(() => getComputedStyle(document.body).color);
    expect(parseRgb(studioPaint.color)).toEqual(parseRgb(bodyColor));
  });

  test("keyboard focus is visible on the inquire action", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoApp(page, RAIL, "/");
    const inquire = page.getByRole("navigation", { name: "Studio" }).getByRole("link", { name: "Inquire" });
    await inquire.focus();
    await page.keyboard.press("Tab");
    const link = await mailLink(page);
    await expect(link).toBeFocused();
    const focused = await paint(link);
    expectReadableFill(focused, "focus");
    expect(focused.outlineStyle).not.toBe("none");
    expect(Number.parseFloat(focused.outlineWidth)).toBeGreaterThanOrEqual(2);
    const outline = parseRgb(focused.outlineColor);
    const bg = parseRgb(focused.background);
    expect(
      contrastRatio(outline, bg),
      `focus outline ${focused.outlineColor} on ${focused.background}`
    ).toBeGreaterThanOrEqual(3);

    await link.scrollIntoViewIfNeeded();
    await link.screenshot({
      path: path.join(artifacts, "rail-still-mail-focus-1280.png")
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await link.scrollIntoViewIfNeeded();
    await inquire.focus();
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    const narrow = await paint(link);
    expectReadableFill(narrow, "focus 390");
    expectUnclippedLabel(narrow, "focus 390");
    expect(Number.parseFloat(narrow.outlineWidth)).toBeGreaterThanOrEqual(2);
    const nBox = await link.boundingBox();
    expect(nBox.x + nBox.width).toBeLessThanOrEqual(390 + 1);
  });
});
