import { defineConfig, devices } from "@playwright/test";

const IS_LIVE = process.env.PLAYWRIGHT_LIVE === "1";
const PORT = process.env.PLAYWRIGHT_PORT ?? "5173";
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

// Cross-browser testing for CI and local development
if (process.env.CI || process.env.PLAYWRIGHT_FIREFOX) {
  projects.push(
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1366, height: 768 },
      },
    },
  );
}

// #region agent log
try {
  fetch("http://127.0.0.1:7242/ingest/0ae7fc31-3847-4426-952c-f3c7a5827cea", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H2",
      location: "playwright.config.ts:config",
      message: "Playwright base URL and mode",
      data: {
        baseUrl: BASE_URL,
        isLive: IS_LIVE,
        ciEnv: process.env.CI === "true",
        port: PORT,
        hasLiveBaseEnv: Boolean(process.env.LIVE_BASE_URL),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
} catch (error) {
  console.warn("Agent log failed in playwright.config.ts", error);
}
// #endregion

export default defineConfig({
  testDir: "tests/e2e",
  timeout: IS_LIVE ? 90_000 : 45_000,
  expect: { timeout: process.env.CI ? 10_000 : 15_000 }, // Kürzere Timeouts in CI
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0, // CI darf einmal wiederholen, lokal nicht
  workers: IS_LIVE ? 2 : process.env.CI ? 2 : undefined, // Weniger Last auf Live-Seite
  use: {
    baseURL: BASE_URL,
    locale: "de-DE",
    timezoneId: "Europe/Berlin",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    // Disable animations for stable tests
    reducedMotion: "reduce",
    // Performance metrics collection
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },
  outputDir: IS_LIVE ? "test-results/live" : "test-results",

  // Custom reporters
  reporter: [
    ["html", { outputFolder: "playwright-report", open: process.env.CI ? "never" : "on-failure" }],
    ["json", { outputFile: "test-results/playwright-results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],

  webServer: IS_LIVE
    ? undefined
    : {
        command: `npm run dev -- --port=${PORT}`,
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120_000, // Mehr Zeit für Server-Start
        stdout: "pipe", // Reduziert Noise
        stderr: "pipe",
      },
  projects,

  // Global setup and teardown
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",

  // Metadata for reports
  metadata: {
    CI: process.env.CI || false,
    BUILD_ID: process.env.BUILD_ID || "local",
    COMMIT_SHA: process.env.COMMIT_SHA || "unknown",
    BRANCH: process.env.BRANCH || "main",
  },
});
