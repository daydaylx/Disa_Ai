import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],

  use: {
    baseURL: "http://localhost:5174",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    // Fixed mobile viewport - no randomness
    viewport: { width: 390, height: 844 },
    // Disable device scaling and mobile emulation for consistency
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    // Force consistent browser settings
    ignoreHTTPSErrors: true,
    bypassCSP: false,
    // Consistent user agent
    userAgent:
      "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36 Playwright-Test",
  },

  webServer: {
    command: "npm run dev -- --port=5174",
    url: "http://localhost:5174",
    reuseExistingServer: true,
    timeout: 60_000,
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
