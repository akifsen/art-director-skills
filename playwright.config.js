import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    browserName: "chromium",
    viewport: { width: 1280, height: 720 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off"
  },
  webServer: [
    {
      command: "npm run example:kiln",
      url: "http://127.0.0.1:5173",
      timeout: 120000,
      reuseExistingServer: !process.env.CI
    },
    {
      command: "npm run example:desk",
      url: "http://127.0.0.1:5174",
      timeout: 120000,
      reuseExistingServer: !process.env.CI
    }
  ]
});
