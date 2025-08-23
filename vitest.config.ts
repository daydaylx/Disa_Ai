import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: { reporter: ["text", "lcov"] },
    exclude: ["e2e/**", "node_modules/**", "dist/**", "build/**"],
  },
});
