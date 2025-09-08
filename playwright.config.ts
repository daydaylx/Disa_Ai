import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    serviceWorkers: "block", // verhindert SW-Störungen
  },
  outputDir: "test-artifacts",
  webServer: {
    command: "npx vite preview --port 4173 --strictPort",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "android-samsung", use: { ...devices["Galaxy S8+"] } },
    { name: "android-dark", use: { ...devices["Galaxy S8+"], colorScheme: "dark" } },
  ],
});
