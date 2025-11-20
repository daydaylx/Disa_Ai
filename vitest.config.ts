/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

// Unit tests configuration - separate from Storybook tests
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: false,
    environment: "jsdom",
    pool: "threads",
    setupFiles: ["tests/setup.ts", "tests/polyfills.ts"],
    environmentOptions: {
      jsdom: {
        resources: "usable",
      },
    },
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
      "tests/smoke/**/*.{test,spec}.{ts,tsx}",
      "tests/build/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/*.stories.{ts,tsx}"],
    coverage: {
      provider: "v8",
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
