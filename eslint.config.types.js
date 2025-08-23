import base from "./eslint.config.js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...base.map((c) => {
    if (!c.files) return c;
    return {
      ...c,
      languageOptions: {
        ...(c.languageOptions || {}),
        parser: tsParser,
        parserOptions: {
          ...(c.languageOptions?.parserOptions || {}),
          project: ["tsconfig.json", "tsconfig.test.json", "e2e/tsconfig.json"],
          tsconfigRootDir: process.cwd(),
        },
      },
      plugins: { ...(c.plugins || {}), "@typescript-eslint": tsPlugin },
      rules: {
        ...(c.rules || {}),
        // Schalte einige type-aware Checks zu:
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/no-floating-promises": ["error", { ignoreIIFE: true }],
        "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
        "@typescript-eslint/require-await": "error",
        "@typescript-eslint/consistent-type-assertions": "warn"
      },
    };
  }),
];
