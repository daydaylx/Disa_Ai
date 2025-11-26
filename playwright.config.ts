import { defineConfig, devices } from "@playwright/test";

const IS_LIVE = process.env.PLAYWRIGHT_LIVE === "1";
const PORT = process.env.PLAYWRIGHT_PORT ?? "5174";
const LOCAL_BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;
const LIVE_BASE_URL = process.env.LIVE_BASE_URL ?? "https://disaai.de";
const BASE_URL = IS_LIVE ? LIVE_BASE_URL : LOCAL_BASE_URL;

const projects = [
  {
    name: "android-chrome",
    use: {
      ...devices["Pixel 7"],
    },
  },
];

if (IS_LIVE) {
  projects.push({
    name: "desktop-chrome",
    use: {
      ...devices["Desktop Chrome"],
      viewport: { width: 1366, height: 768 },
    },
  });
}

export default defineConfig({
  testDir: "tests/e2e",
  timeout: IS_LIVE ? 90_000 : 45_000,
  expect: { timeout: process.env.CI ? 10_000 : 15_000 }, // Kürzere Timeouts in CI
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0, // CI darf einmal wiederholen, lokal nicht
  workers: IS_LIVE ? 2 : process.env.CI ? 1 : undefined, // Weniger Last auf Live-Seite
  use: {
    baseURL: BASE_URL,
    locale: "de-DE",
    timezoneId: "Europe/Berlin",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  outputDir: IS_LIVE ? "test-results/live" : "test-results",

  webServer: IS_LIVE
    ? undefined
    : {
        command: `npm run dev -- --port=${PORT}`,
        url: BASE_URL,
        reuseExistingServer: false,
        timeout: 120_000, // Mehr Zeit für Server-Start
        stdout: "pipe", // Reduziert Noise
        stderr: "pipe",
      },
  projects,
});
