import { expect } from "@playwright/test";

export const KILN = "http://127.0.0.1:5173";
export const DESK = "http://127.0.0.1:5174";

/** Product UI is up: React painted and fonts settled. Not a sleep. */
export async function ready(page) {
  await expect(page.locator("#root")).not.toBeEmpty();
  await page.evaluate(() => document.fonts.ready);
}

export async function gotoApp(page, origin, path = "/") {
  await page.goto(`${origin}${path}`, { waitUntil: "domcontentloaded" });
  await ready(page);
}

/** Click the dialog element's padding (inside the panel box, not a child). */
export async function clickDialogPadding(dialog) {
  const pos = await dialog.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const inset = Math.max(4, Math.min(parseFloat(cs.paddingTop) || 16, 24) / 2);
    return { x: r.left + inset, y: r.top + inset };
  });
  await dialog.page().mouse.click(pos.x, pos.y);
}

/** Click the dimmed area outside the panel box. */
export async function clickOutsideDialog(dialog) {
  const pos = await dialog.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const x = r.left >= 24 ? r.left - 12 : Math.min(r.right + 12, window.innerWidth - 4);
    const y = r.top >= 24 ? r.top - 12 : Math.min(r.bottom + 12, window.innerHeight - 4);
    return { x, y };
  });
  await dialog.page().mouse.click(pos.x, pos.y);
}
