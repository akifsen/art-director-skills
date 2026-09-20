import { expect } from "@playwright/test";

export const KILN = "http://127.0.0.1:5173";
export const DESK = "http://127.0.0.1:5174";
export const RAIL = "http://127.0.0.1:5176";

/** Parse `rgb()` / `rgba()` from getComputedStyle. Flat-surface checks only. */
export function parseRgb(color) {
  const m = String(color).match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (!m) throw new Error(`unparsed color: ${color}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** WCAG 2 relative luminance (sRGB). */
export function relativeLuminance([r, g, b]) {
  const toLin = (channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

export function contrastRatio(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

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
