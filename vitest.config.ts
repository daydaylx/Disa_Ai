import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["tests/setup.ts", "tests/polyfills.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
    coverage: {
      provider: "v8",
      thresholds: {
        statements: 15,
        branches: 45,
        functions: 30,
        lines: 15,
      },
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/e2e/**",
        "**/coverage/**",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/test/**",
        "**/tests/**",
        "**/*.config.{ts,js}",
        "**/docs/**",
        "**/scripts/**",
        "**/tools/**",
      ],
    },
  },
});
