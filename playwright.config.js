import { defineConfig } from "@playwright/test";

/**
 * Serve the production Vite preview of the example apps (same files as
 * `npm run test:examples:build`). Do not use `channel: "chrome"` /
 * devices["Desktop Chrome"]: Ubuntu CI installs bundled Chromium only.
 * Do not use page.clock: it patches requestAnimationFrame
 * (https://playwright.dev/docs/clock, retrieved 2026-09-17).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  expect: { timeout: 10000 },
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    browserName: "chromium",
    viewport: { width: 1280, height: 720 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off"
  },
  projects: [
    { name: "flows", testMatch: /kiln-flow|nadir-desk|narrow-flow/ },
    { name: "quality", testMatch: /library-flow|existing-flow/ },
    { name: "visual", testMatch: /visual-capture/ }
  ],
  webServer: [
    ...(process.env.ART_DIRECTOR_EVAL === '1' ?
      ['library-baseline', 'library-candidate', 'library-candidate2', 'existing-desk'].map((name, index) => ({
        command: `node tests/examples/preview.mjs ${name}`,
        url: `http://127.0.0.1:${5191 + index}`,
        timeout: 60000,
        reuseExistingServer: false
      })) : []),
    {
      command: "node tests/examples/preview.mjs kiln",
      url: "http://127.0.0.1:5173",
      timeout: 60000,
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      stderr: "pipe"
    },
    {
      command: "node tests/examples/preview.mjs desk",
      url: "http://127.0.0.1:5174",
      timeout: 60000,
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      stderr: "pipe"
    }
  ]
});
