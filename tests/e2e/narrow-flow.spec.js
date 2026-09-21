import { test, expect } from '@playwright/test';
import { DESK, KILN, gotoApp } from './helpers.js';

test.use({ viewport: { width: 390, height: 844 } });

async function contained(locator) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(844);
}

test('narrow desk dialog saves, cancels and restores focus', async ({ page }) => {
  await gotoApp(page, DESK);
  const opener = page.getByRole('button', { name: /^(Add|Edit) note$/ });
  await opener.click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Note').fill('Dar ekran doğrulaması: İpek, ölçüm ve açıklama.');
  await contained(dialog.getByRole('button', { name: 'Save note' }));
  await dialog.getByRole('button', { name: 'Save note' }).click();
  await expect(page.getByText('Dar ekran doğrulaması: İpek, ölçüm ve açıklama.')).toBeVisible();
  await opener.click();
  await dialog.getByLabel('Note').fill('Discard this draft.');
  await contained(dialog.getByRole('button', { name: 'Cancel' }));
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(opener).toBeFocused();
  await expect(page.getByText('Discard this draft.')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('narrow hold form validates and reaches saved detail', async ({ page }) => {
  await gotoApp(page, KILN, '/#/loads/K-214/hold');
  const save = page.getByRole('button', { name: 'Save hold' });
  await contained(save);
  await save.click();
  await expect(page.getByText('Say why the hold exists')).toBeVisible();
  await page.getByLabel('Reason').fill('Long narrow-screen note — retain the named load and check the rear shelf before cooling.');
  await save.click();
  const back = page.getByRole('dialog').getByRole('button', { name: /Back to K-214/ });
  await contained(back);
  await back.click();
  await expect(page.getByText(/Long narrow-screen note/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
