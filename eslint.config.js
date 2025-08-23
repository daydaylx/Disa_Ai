import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y";
import imp from "eslint-plugin-import";
import unused from "eslint-plugin-unused-imports";
import sort from "eslint-plugin-simple-import-sort";
import globals from "globals";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // Ignoriere Output/Altlasten/Legacy-Ordner, die aktuell nicht produktiv genutzt werden
  { ignores: [
      "dist", "build", "coverage", "node_modules", "e2e/**",
      // Legacy/Prototypen – später aufräumen oder wieder aktivieren:
      "src/shared/**", "src/entities/**", "src/widgets/**",
      "src/features/**", "src/lib/openrouter.ts", "src/lib/client.tsx"
  ]},

  // Node-/Konfig-Dateien
  {
    files: ["eslint.config*.js", "vite.config.ts", "vitest.config.ts", "postcss.config.js", "tailwind.config.ts", "e2e/*.ts", "playwright.config.ts", "*.cjs", "*.mjs"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      globals: globals.node
    },
    plugins: { "simple-import-sort": sort },
    rules: {
      "simple-import-sort/imports": "off",
      "simple-import-sort/exports": "off"
    }
  },

  // App/Quellcode (Browser)
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        AbortController: "readonly",
        AbortSignal: "readonly",
        ReadableStream: "readonly",
        TextEncoder: "readonly",
        crypto: "readonly"
      }
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": { typescript: true }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react,
      "react-hooks": hooks,
      "jsx-a11y": a11y,
      import: imp,
      "unused-imports": unused,
      "simple-import-sort": sort
    },
    rules: {
      ...js.configs.recommended.rules,
      // Unused: nur Importe hart, Variablen weich
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // Import Hygiene
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
      // A11y
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/no-autofocus": "warn",
      // Stil
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn"
    }
  },

  // Test-Dateien: erlaub Node + Browser-Globals
  {
    files: ["src/__tests__/**/*.{ts,tsx}", "src/test/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      "no-undef": "off" // Tests haben gestubbte Globals
    }
  }
];
