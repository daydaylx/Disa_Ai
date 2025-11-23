import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PLAYWRIGHT_PORT ?? "5174";
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45000,
  expect: { timeout: process.env.CI ? 10_000 : 15_000 }, // Kürzere Timeouts in CI
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0, // CI darf einmal wiederholen, lokal nicht
  workers: process.env.CI ? 1 : undefined, // Reduziert für Stabilität in CI
  use: {
    baseURL: BASE_URL,
    locale: "de-DE",
    timezoneId: "Europe/Berlin",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  webServer: {
    command: `npm run dev -- --port=${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000, // Mehr Zeit für Server-Start
    stdout: "pipe", // Reduziert Noise
    stderr: "pipe",
  },
  projects: [
    {
      name: "mobile-small",
      use: {
        viewport: { width: 360, height: 800 },
        isMobile: true,
        hasTouch: true,
        userAgent: devices["Pixel 7"].userAgent,
      },
    },
    {
      name: "mobile-medium",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        userAgent: devices["iPhone 13"].userAgent,
      },
    },
    {
      name: "mobile-large",
      use: {
        viewport: { width: 414, height: 896 },
        isMobile: true,
        hasTouch: true,
        userAgent: devices["iPhone XR"].userAgent,
      },
    },
    {
      name: "desktop-chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
