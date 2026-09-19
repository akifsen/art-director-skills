import { expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

export const libraryArms = [
  { name: 'baseline', port: 5191, card: '.book-card', record: '.reservation-row' },
  { name: 'candidate', port: 5192, card: '.book', record: '.reservation-card' },
  { name: 'candidate2', port: 5193, card: '.book-card', record: '.reservation' }
];

// One fixed case, through the existing Playwright project and Vite previews.
// Capture and flow assertions are separate calls, not aesthetic scoring.
export async function libraryFlow(page, arm, capture = false) {
  const base = `http://127.0.0.1:${arm.port}`;
  const second = arm.name === 'candidate2';
  const filter = second ? 'Available to borrow' : 'Available books only';
  const out = path.resolve('evals/artifacts');
  fs.mkdirSync(out, { recursive: true });
  const snap = async state => {
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width);
    if (capture) await page.screenshot({ path: path.join(out, `library-${arm.name}-${state}-${page.viewportSize().width}.png`), fullPage: true });
  };
  await page.goto(base);
  await expect(page.locator(arm.card)).toHaveCount(6);
  await page.evaluate(() => document.fonts.ready);
  await snap('catalogue');
  await page.getByLabel('Search title or author').fill('İpek');
  await expect(page.locator(arm.card)).toHaveCount(1);
  await page.getByLabel('Search title or author').fill('no-such-book');
  await expect(page.locator(arm.card)).toHaveCount(0);
  await snap('empty');
  await page.getByRole('button', { name: second ? 'Clear filters' : 'Clear search & filters' }).click();
  await page.getByLabel(filter).check();
  await expect(page.locator(arm.card)).toHaveCount(5);
  await page.getByLabel(filter).uncheck();
  await page.getByRole('button', { name: 'Simulate catalogue error' }).click();
  await snap('error');
  await page.getByRole('button', { name: /^Retry/ }).click();
  await expect(page.locator(arm.card)).toHaveCount(6);
  if (second) await page.locator(arm.card).nth(1).locator('a').first().click();
  else await page.locator(arm.card).nth(1).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A Field Guide');
  await snap('detail');
  await page.getByRole(second ? 'button' : 'link', { name: 'Reserve this book' }).click();
  const confirm = page.getByRole('button', { name: /Confirm.*reservation/ });
  await confirm.click();
  await expect(page.getByLabel('Reader name')).toHaveAttribute('aria-invalid', 'true');
  await snap('form-error');
  await page.getByLabel('Reader name').fill('Çağrı Işık');
  if (second) {
    await page.getByLabel('Tuesday', { exact: true }).check();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.getByRole('link', { name: /My reservations/ }).click();
    await expect(page.locator(arm.record)).toHaveCount(0);
    await page.getByRole('link', { name: 'Catalogue', exact: true }).click();
    await page.locator(arm.card).nth(1).locator('a').first().click();
    await page.getByRole('button', { name: 'Reserve this book' }).click();
    await page.getByLabel('Reader name').fill('Çağrı Işık');
    await page.getByLabel('Tuesday', { exact: true }).check();
  } else await page.getByLabel('Pickup day').selectOption('Tuesday');
  await confirm.click();
  await expect(page.locator(arm.record)).toHaveCount(1);
  await expect(page.locator(arm.record)).toContainText(/Tuesday/i);
  await snap('success');
  if (!second) {
  await page.getByRole('link', { name: 'Edit reservation' }).click();
  await page.getByLabel('Reader name').fill('Discard this change');
  await page.getByLabel('Pickup day').selectOption('Wednesday');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  if (arm.name === 'baseline') await page.getByRole('link', { name: 'View my reservation' }).click();
  await expect(page.locator(arm.record)).toContainText('Çağrı Işık');
  await expect(page.locator(arm.record)).toContainText(/Tuesday/i);
  await expect(page.locator(arm.record)).not.toContainText('Discard this change');
  await page.getByRole('link', { name: 'Edit reservation' }).click();
  await page.getByLabel('Pickup day').selectOption('Wednesday');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.locator(arm.record)).toContainText(/Wednesday/i);
  }
  await page.getByRole('link', { name: 'Catalogue', exact: true }).click();
  await page.getByLabel(filter).check();
  await expect(page.locator(arm.card)).toHaveCount(4);
  await page.getByRole('link', { name: /My reservations/ }).click();
  await page.getByRole('button', { name: 'Cancel reservation', exact: true }).click();
  await expect(page.locator(arm.record)).toHaveCount(0);
  await page.getByRole('link', { name: 'Catalogue', exact: true }).click();
  await expect(page.locator(arm.card)).toHaveCount(5);
}
