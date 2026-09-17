import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  timeout: 30000,
  use: { trace: "off" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npx vite --config evals/apps/kiln-queue/vite.config.js",
      port: 5173,
      reuseExistingServer: !process.env.CI
    },
    {
      command: "npx vite --config evals/apps/nadir-desk/vite.config.js",
      port: 5174,
      reuseExistingServer: !process.env.CI
    }
  ]
});
