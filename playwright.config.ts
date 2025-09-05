import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: "http://localhost:4173",
    viewport: { width: 360, height: 800 }, // typisches Samsung-Viewport (kompakt)
    deviceScaleFactor: 3,
    userAgent: "Mozilla/5.0 (Linux; Android 13; SAMSUNG SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116 Mobile Safari/537.36",
    colorScheme: "light",
    launchOptions: { args: ["--no-sandbox"] }
  },
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  },
  projects: [
    {
      name: "android-samsung",
      use: {}
    },
    {
      name: "android-dark",
      use: { colorScheme: "dark" }
    }
  ]
});
