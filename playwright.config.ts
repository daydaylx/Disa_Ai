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
    serviceWorkers: "block", // Block Service Workers in E2E tests to prevent crashes
    // Block external font requests to prevent DNS resolution failures in test environment
    // These are not needed for functional E2E tests
    extraHTTPHeaders: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
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
      name: "android-chrome",
      use: {
        ...devices["Pixel 7"],
        launchOptions: {
          args: [
            "--disable-dev-shm-usage", // Fix crashes in limited /dev/shm environments
          ],
        },
      },
    },
  ],
});
