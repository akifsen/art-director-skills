import { test, expect } from '@playwright/test';
import { foldFlow } from './fold-support.js';

test.skip(process.env.ART_DIRECTOR_SEEFIX !== '1', 'Hand-corrected Fold copy; not the historical craft arms');

const arm = { name: 'corrected', port: 5205, all: 'All' };

for (const width of [1280, 390]) {
  test(`fold corrected linked flow at ${width}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await foldFlow(page, arm, true);
    expect(errors).toEqual([]);
  });
}

test('fold corrected narrow form keeps compact record context', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:5205/?workshop=clay');
  await page.getByRole('button', { name: /^Reserve (?:1 place|one place)/ }).click();
  await expect(page.getByText('Choose an available session.')).toBeVisible();
  const metrics = await page.evaluate(() => {
    const h1 = document.querySelector('.detail h1');
    const booking = document.querySelector('.booking h2');
    const lead = document.querySelector('.detail .lead');
    const demo = document.querySelector('.demo');
    const reserve = [...document.querySelectorAll('.booking button')].at(-1);
    return {
      titleSize: Number.parseFloat(getComputedStyle(h1).fontSize),
      bookingSize: Number.parseFloat(getComputedStyle(booking).fontSize),
      leadDisplay: lead ? getComputedStyle(lead).display : 'none',
      demoBg: getComputedStyle(demo).backgroundColor,
      titleY: h1.getBoundingClientRect().y,
      reserveY: reserve.getBoundingClientRect().y,
      viewport: innerHeight,
      h1Text: h1.textContent
    };
  });
  expect(metrics.h1Text).toContain('A small bowl for everyday things');
  expect(metrics.titleSize).toBeLessThanOrEqual(28);
  expect(metrics.bookingSize).toBeLessThanOrEqual(24);
  expect(metrics.leadDisplay).toBe('none');
  expect(metrics.titleY).toBeLessThan(220);
  expect(metrics.demoBg === 'rgba(0, 0, 0, 0)' || metrics.demoBg === 'transparent').toBeTruthy();
});
