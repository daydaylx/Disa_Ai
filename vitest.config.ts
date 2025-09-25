/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";

// Unit tests configuration - separate from Storybook tests
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    pool: "threads",
    setupFiles: ["tests/setup.ts", "tests/polyfills.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/*.stories.{ts,tsx}"],
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
        "**/*.stories.{ts,tsx}",
      ],
    },
  },
});
