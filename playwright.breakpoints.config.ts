import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    trace: "off",
    serviceWorkers: "block",
  },
  outputDir: "test-artifacts",
  webServer: {
    command: "npm run preview",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "w360", use: { viewport: { width: 360, height: 740 } } },
    { name: "w768", use: { viewport: { width: 768, height: 900 } } },
    { name: "w1280", use: { viewport: { width: 1280, height: 900 } } },
  ],
});
