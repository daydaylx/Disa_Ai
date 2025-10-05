import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PLAYWRIGHT_PORT ?? "5174";
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: process.env.CI ? 20_000 : 45_000, // Kürzere Timeouts in CI
  expect: { timeout: process.env.CI ? 10_000 : 15_000 }, // Kürzere Timeouts in CI
  fullyParallel: true,
  retries: process.env.CI ? 1 : 1, // Reduzierte Retries für CI
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
  ],
});
