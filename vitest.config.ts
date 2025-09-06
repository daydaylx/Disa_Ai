import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["tests/setupTests.ts"],
    globals: true,
    include: [
      "src/**/__tests__/**/*.{test,spec}.{ts,tsx,js,jsx}",
      "tests/unit/**/*.{test,spec}.{ts,tsx,js,jsx}",
    ],
    exclude: ["tests/e2e/**", "**/e2e/**", "node_modules/**", "dist/**"],
    fakeTimers: {
      toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date"],
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
    },
  },
});
