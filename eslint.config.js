import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y";
import imp from "eslint-plugin-import";
import unused from "eslint-plugin-unused-imports";
import sort from "eslint-plugin-simple-import-sort";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  { ignores: ["dist", "build", "node_modules", "coverage", "e2e/**"] },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
        // kein "project" => schnell; type-aware gibt's in eslint.config.types.js
      },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": { typescript: true },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react,
      "react-hooks": hooks,
      "jsx-a11y": a11y,
      import: imp,
      "unused-imports": unused,
      "simple-import-sort": sort,
    },
    rules: {
      // Base
      ...js.configs.recommended.rules,
      // TypeScript (ohne type-aware)
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // Imports
      "import/first": "error",
      "import/no-duplicates": "error",
      "import/no-mutable-exports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // React
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // A11y (sanft)
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/label-has-for": "off",
      // Style: Prettier regelt Format; keine Konflikt-Regeln
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
    },
  },
];
