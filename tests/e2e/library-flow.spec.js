import { test, expect } from '@playwright/test';
import { libraryArms, libraryFlow } from './library-support.js';

test.skip(process.env.ART_DIRECTOR_EVAL !== '1', 'Set ART_DIRECTOR_EVAL=1 for the bounded saved outputs');
for (const arm of libraryArms) for (const width of [1440, 390]) {
  test(`${arm.name}: search, reserve, cancel and release at ${width}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await libraryFlow(page, arm);
    expect(errors).toEqual([]);
  });
}
