import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
    // Visual comparison threshold
    threshold: 0.2,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [["list"], ["html", { outputFolder: "playwright-visual-report", open: "never" }]],

  use: {
    baseURL: "http://localhost:5174",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    // Mobile viewport for mobile-first app (390x844 primary target)
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    ignoreHTTPSErrors: true,
    bypassCSP: false,
  },

  webServer: {
    command: "npm run dev -- --port=5174",
    url: "http://localhost:5174",
    reuseExistingServer: true,
    timeout: 60_000,
  },

  projects: [
    {
      name: "mobile-dark",
      use: {
        ...devices["iPhone 12"],
        viewport: { width: 390, height: 844 },
        colorScheme: "dark",
      },
    },
  ],
});
