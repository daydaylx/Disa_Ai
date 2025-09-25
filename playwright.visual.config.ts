import { defineConfig, devices } from "@playwright/test";

// Visual regression specific configuration
export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "**/visual-regression.spec.ts",
  timeout: 60_000, // Longer timeout for visual tests
  expect: { timeout: 15_000 },
  fullyParallel: false, // Sequential for consistent baselines
  retries: 0, // No retries for visual tests
  workers: 1, // Single worker for consistency

  use: {
    baseURL: "http://localhost:4173",
    // Strict settings for visual consistency
    viewport: { width: 390, height: 844 }, // Fixed mobile viewport
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,

    // Visual-specific settings
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",

    // Consistent rendering
    colorScheme: "dark", // Force dark mode for consistency
    reducedMotion: "reduce", // Disable animations
    forcedColors: "none",

    // Stable user agent
    userAgent:
      "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36 Playwright-Visual",

    // Network stability
    ignoreHTTPSErrors: true,
    bypassCSP: false,
  },

  webServer: {
    command: "npm run build && npm run preview -- --port=4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },

  projects: [
    {
      name: "visual-regression",
      use: {
        ...devices["Desktop Chrome"],
        // Override device settings with our fixed viewport
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1,
      },
    },
  ],

  // Visual test specific settings
  expect: {
    // Global screenshot comparison settings
    toHaveScreenshot: {
      // Animation handling
      animations: "disabled",
      // Color adjustment
      caret: "hide",
      // Threshold can be overridden per test
      threshold: 0.2,
      // Comparison mode
      mode: "rgb",
    },
  },
});
