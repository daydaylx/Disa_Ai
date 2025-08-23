import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: { reporter: ["text","lcov"] },
  },
});
