import { test, expect } from '@playwright/test';
import { foldArms, foldFlow } from './fold-support.js';

test.skip(process.env.ART_DIRECTOR_CRAFT !== '1', 'Optional saved ordinary-brief outputs');
for (const arm of foldArms) for (const width of [1280, 390]) {
  test(`fold ${arm.name} linked flow at ${width}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await foldFlow(page, arm);
    expect(errors).toEqual([]);
  });
}
