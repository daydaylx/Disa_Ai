// Flat ESLint config
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.ts","**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.base.json","./tsconfig.test.json"]
      }
    },
    rules: {
      "no-console": ["warn", { "allow": ["warn","error"] }]
    }
  }
];
