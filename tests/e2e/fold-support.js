import { expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

export const foldArms = [{ name: 'baseline', port: 5203, all: 'All crafts' }, { name: 'candidate', port: 5204, all: 'All' }];

// The same task/data/state sequence; labels differ between independent outputs.
export async function foldFlow(page, arm, capture = false) {
  const base = `http://127.0.0.1:${arm.port}`;
  const out = path.resolve('evals/artifacts');
  fs.mkdirSync(out, { recursive: true });
  const width = page.viewportSize().width;
  const positions = {};
  const snap = async state => {
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (capture) {
      await page.screenshot({ path: path.join(out, `fold-${arm.name}-${state}-${width}.png`), fullPage: true });
      if (state === 'catalogue' || state === 'form-error') {
        await page.screenshot({ path: path.join(out, `fold-${arm.name}-${state}-${width}-viewport.png`) });
      }
    }
  };
  const reserve = () => page.getByRole('button', { name: /^Reserve (?:1 place|2 places|one place|two places)/ });
  await page.goto(base);
  await expect(page.locator('article')).toHaveCount(4);
  await page.evaluate(() => document.fonts.ready);
  await snap('catalogue');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle)).not.toBe('none');
  await page.getByRole('button', { name: 'Clay', exact: true }).click();
  await expect(page.locator('article')).toHaveCount(1);
  await page.getByRole('button', { name: 'Explore A small bowl for everyday things', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A small bowl for everyday things', exact: true })).toBeVisible();
  await snap('detail');
  await reserve().click();
  await expect(page.getByText('Choose an available session.')).toBeVisible();
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  await snap('form-error');
  const rect = await reserve().boundingBox();
  positions.reserveY = rect?.y;
  positions.viewportHeight = page.viewportSize().height;
  await page.getByLabel('Saturday · 14:00').check();
  await page.getByLabel('2. How many places?').selectOption('2');
  await page.getByLabel('3. Your name').fill('Ada Deniz');
  await reserve().click();
  await expect(page.locator('.confirmation')).toBeVisible();
  await expect(page.locator('.ticket')).toContainText('A small bowl for everyday things');
  await expect(page.locator('.ticket')).toContainText('Saturday · 14:00');
  await expect(page.locator('.ticket')).toContainText('Ada Deniz');
  await snap('confirmation');
  await page.getByRole('button', { name: 'Cancel reservation & choose again', exact: true }).click();
  await expect(page.getByText(/Reservation cancelled/)).toBeVisible();
  await expect(page.locator('.confirmation')).toHaveCount(0);
  await page.getByRole('button', { name: arm.all, exact: true }).click();
  await expect(page.locator('article')).toHaveCount(4);
  await page.getByRole('button', { name: 'Explore Two-colour printmaking', exact: true }).click();
  await expect(page.getByLabel('Sunday · 14:00')).toBeDisabled();
  await page.goto(`${base}/?workshop=paper`);
  await page.getByLabel('Sunday · 11:00').check();
  await page.getByLabel('2. How many places?').selectOption('2');
  await page.getByLabel('3. Your name').fill('Ada Deniz');
  await reserve().click();
  await expect(page.getByText('Only 1 place is available. Choose one place.')).toBeVisible();
  await expect(page.locator('.confirmation')).toHaveCount(0);
  await page.getByLabel('2. How many places?').selectOption('1');
  await reserve().click();
  await expect(page.locator('.confirmation')).toBeVisible();
  await page.reload();
  await expect(page.locator('.confirmation')).toHaveCount(0);
  await page.goto(`${base}/?workshop=unknown`);
  await expect(page.getByRole('heading', { name: 'Workshop not found' })).toBeVisible();
  await page.getByRole('button', { name: 'Browse workshops' }).click();
  await expect(page.locator('article')).toHaveCount(4);
  if (capture) fs.writeFileSync(path.join(out, `fold-${arm.name}-positions-${width}.json`), JSON.stringify(positions, null, 2));
}
