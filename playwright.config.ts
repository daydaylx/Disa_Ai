import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PLAYWRIGHT_PORT ?? "5174";
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000, // Erhöht für bessere Stabilität
  expect: { timeout: 15_000 }, // Mehr Zeit für Assertions
  fullyParallel: true,
  retries: process.env.CI ? 3 : 1, // Mehr Retries für Stabilität
  workers: process.env.CI ? 1 : undefined, // Reduziert für Stabilität in CI
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],

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
    reuseExistingServer: true,
    timeout: 120_000, // Mehr Zeit für Server-Start
    stdout: "pipe", // Reduziert Noise
    stderr: "pipe",
  },

  projects: [
    {
      name: "android-chrome",
      use: {
        ...devices["Pixel 7"],
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
