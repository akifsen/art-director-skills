/**
 * Layer: real browser on the Vite production preview of the hand-corrected
 * Shoot board eval output (not the distributed skill, not a customer app).
 * Proves filter chip states stay readable in every reachable combination
 * and that the list → detail → edit → error → save → cancel path works.
 */
import { test, expect } from "@playwright/test";
import { contrastRatio, gotoApp, parseRgb, ringPoint, surfaceAt } from "./helpers.js";

const SHOOT = "http://127.0.0.1:5206";
const AA_NORMAL = 4.5;
/** WCAG 2.2 SC 1.4.11 Non-text Contrast (AA) for the focus ring vs adjacent surface. */
const NON_TEXT = 3;

test.beforeAll(() => {
  if (process.env.ART_DIRECTOR_SEEFIX !== "1") {
    throw new Error("ART_DIRECTOR_SEEFIX=1 is required. Build shoot-board-corrected first.");
  }
});

async function paint(locator) {
  return locator.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      color: cs.color,
      background: cs.backgroundColor,
      outlineStyle: cs.outlineStyle,
      outlineWidth: cs.outlineWidth,
      outlineColor: cs.outlineColor,
      outlineOffset: cs.outlineOffset,
      pressed: el.getAttribute("aria-pressed")
    };
  });
}

/** Label color vs the composited surface under the label (idle chips are transparent over the group). */
async function expectReadable(page, locator, state, label) {
  const box = await locator.boundingBox();
  const behind = await surfaceAt(page, box.x + box.width / 2, box.y + box.height / 2);
  const ratio = contrastRatio(parseRgb(state.color), behind.rgb);
  expect(
    ratio,
    `${label}: ${state.color} on rgb(${behind.rgb.join(", ")}) via ${behind.hit} = ${ratio.toFixed(2)}:1`
  ).toBeGreaterThanOrEqual(AA_NORMAL);
  return behind.rgb;
}

test.describe("shoot board corrected — filter chip states", () => {
  for (const { width, height } of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    test(`selected, hover, and focus stay readable and distinct at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await gotoApp(page, SHOOT, "/");
      await expect(page.getByRole("heading", { name: "Teslimatlar" })).toBeVisible();

      const group = page.getByRole("group", { name: "Duruma göre süz" });
      const all = group.getByRole("button", { name: /^Tümü/ });
      const shooting = group.getByRole("button", { name: /^Çekim/ });
      await expect(all).toHaveAttribute("aria-pressed", "true");
      await expect(shooting).toHaveAttribute("aria-pressed", "false");

      // Default and selected at rest.
      const idle = await paint(shooting);
      const selected = await paint(all);
      const idleSurface = await expectReadable(page, shooting, idle, `idle ${width}`);
      const selectedSurface = await expectReadable(page, all, selected, `selected ${width}`);
      expect(
        contrastRatio(selectedSurface, idleSurface),
        "selected surface differs from idle surface"
      ).toBeGreaterThanOrEqual(NON_TEXT);

      // Hover on an unselected chip: feedback, still readable.
      await shooting.hover();
      const idleHover = await paint(shooting);
      const idleHoverSurface = await expectReadable(page, shooting, idleHover, `idle hover ${width}`);
      expect(idleHoverSurface, "idle hover changes the surface").not.toEqual(idleSurface);

      // Hover on the selected chip: still reads as selected and readable.
      await all.hover();
      const selectedHover = await paint(all);
      const selectedHoverSurface = await expectReadable(page, all, selectedHover, `selected hover ${width}`);
      expect(selectedHover.pressed).toBe("true");
      expect(
        contrastRatio(selectedHoverSurface, idleHoverSurface),
        "selected+hover surface still differs from idle hover surface"
      ).toBeGreaterThanOrEqual(NON_TEXT);

      // Keyboard focus on the selected chip: ring over the surface it is drawn on.
      await page.mouse.move(0, 0);
      await all.focus();
      const focused = await paint(all);
      await expectReadable(page, all, focused, `selected focus ${width}`);
      expect(focused.outlineStyle).not.toBe("none");
      expect(Number.parseFloat(focused.outlineWidth)).toBeGreaterThanOrEqual(2);
      const point = await ringPoint(all, focused);
      const behind = await surfaceAt(page, point.x, point.y);
      expect(behind.hit, `ring point is outside the chip (${behind.hit})`).not.toMatch(/\bchip\b/);
      const ringRatio = contrastRatio(parseRgb(focused.outlineColor), behind.rgb);
      expect(
        ringRatio,
        `ring ${focused.outlineColor} over ${behind.hit} rgb(${behind.rgb.join(", ")}) = ${ringRatio.toFixed(2)}:1`
      ).toBeGreaterThanOrEqual(NON_TEXT);

      // Selected + focus + hover together.
      await all.hover();
      const focusedHover = await paint(all);
      await expectReadable(page, all, focusedHover, `selected focus hover ${width}`);
    });
  }

  test("filter, detail, edit, validation, save, cancel, and back", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoApp(page, SHOOT, "/");
    const group = page.getByRole("group", { name: "Duruma göre süz" });
    await group.getByRole("button", { name: /^Çekim/ }).click();
    const rows = page.locator(".docket").getByRole("link");
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText("Studio portraits");

    await rows.first().click();
    await expect(page.getByRole("heading", { name: "Studio portraits" })).toBeVisible();
    await page.getByRole("link", { name: "Teslimatı düzenle" }).click();
    await expect(page.getByRole("heading", { name: "Teslimatı düzenle" })).toBeVisible();

    const date = page.locator("#deliveryDate");
    await date.fill("");
    await page.getByRole("button", { name: "Kaydet" }).click();
    await expect(page.getByText("Teslimat tarihi gerekli.")).toBeVisible();
    await expect(date).toHaveAttribute("aria-invalid", "true");

    await date.fill("2026-10-09");
    await page.getByRole("button", { name: "Vazgeç" }).click();
    await expect(page.getByRole("heading", { name: "Studio portraits" })).toBeVisible();
    await expect(page.getByText("2 Ekim 2026")).toBeVisible();

    await page.getByRole("link", { name: "Teslimatı düzenle" }).click();
    await page.locator("#note").fill("Kontakt sayfası önce.");
    await page.getByRole("button", { name: "Kaydet" }).click();
    await expect(page.getByRole("status")).toContainText("bu oturumda güncellendi");
    await expect(page.getByText("Kontakt sayfası önce.")).toBeVisible();

    await page.getByRole("link", { name: "Shoot board" }).click();
    await expect(page.getByRole("heading", { name: "Teslimatlar" })).toBeVisible();
    await expect(group.getByRole("button", { name: /^Çekim/ })).toHaveAttribute("aria-pressed", "true");
  });
});
