import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./",
  globalSetup: "./global-setup.ts",
  workers: 1,
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run build && npx vite preview --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
});
