import { test, expect } from '@playwright/test';
import { foldFlow } from './fold-support.js';

test.beforeAll(() => {
  if (process.env.ART_DIRECTOR_SEEFIX !== '1') {
    throw new Error('ART_DIRECTOR_SEEFIX=1 is required to run fold-corrected tests. Build fold-corrected first.');
  }
});

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

test('fold corrected catalogue still lists four workshops at 390', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:5205/');
  await expect(page.getByRole('heading', { name: /Less scrolling/ })).toBeVisible();
  await expect(page.locator('article')).toHaveCount(4);
  await expect(page.getByRole('button', { name: 'Clay', exact: true })).toBeVisible();
});

test('fold corrected narrow form keeps compact record context', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:5205/?workshop=clay');
  await expect(page.getByRole('heading', { name: 'A small bowl for everyday things', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /^Reserve (?:1 place|one place)/ }).click();
  await expect(page.getByText('Choose an available session.')).toBeVisible();
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  const metrics = await page.evaluate(() => {
    const h1 = document.querySelector('.detail h1');
    const booking = document.querySelector('.booking h2');
    const lead = document.querySelector('.detail .lead');
    const demo = document.querySelector('.demo');
    const reserve = [...document.querySelectorAll('.booking button')].at(-1);
    const introGone = !document.querySelector('.intro');
    return {
      titleSize: Number.parseFloat(getComputedStyle(h1).fontSize),
      bookingSize: Number.parseFloat(getComputedStyle(booking).fontSize),
      leadDisplay: lead ? getComputedStyle(lead).display : 'none',
      demoBg: getComputedStyle(demo).backgroundColor,
      titleY: h1.getBoundingClientRect().y,
      reserveY: reserve.getBoundingClientRect().y,
      viewport: innerHeight,
      h1Text: h1.textContent,
      introGone
    };
  });
  expect(metrics.introGone).toBe(true);
  expect(metrics.h1Text).toContain('A small bowl for everyday things');
  expect(metrics.titleSize).toBeLessThanOrEqual(28);
  expect(metrics.bookingSize).toBeLessThanOrEqual(24);
  expect(metrics.leadDisplay).toBe('none');
  expect(metrics.titleY).toBeGreaterThan(0);
  expect(metrics.titleY).toBeLessThan(220);
  expect(metrics.reserveY).toBeLessThan(metrics.viewport + 80);
  expect(metrics.demoBg === 'rgba(0, 0, 0, 0)' || metrics.demoBg === 'transparent').toBeTruthy();
});
