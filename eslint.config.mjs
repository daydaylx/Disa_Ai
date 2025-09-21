import js from "@eslint/js";
import prettier from "eslint-config-prettier";
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
  // Disable stylistic rules that conflict with Prettier formatting
  prettier,
  // Global ignores
  {
    ignores: [
      "dist/**",
      "build/**",
      "coverage/**",
      "node_modules/**",
      "src/lib/openrouter.ts", // Legacy client
      "*.config.js",
      "*.config.ts",
      "tailwind.config.ts", // Ignore Tailwind config
      "src/styles/**/*.css", // Ignore CSS files (not parsed by ESLint)
    ],
  },

  // Configuration files (Node.js environment)
  {
    files: [
      "eslint.config*.js",
      "vite.config.ts",
      "vitest.config.ts",
      "postcss.config.js",
      "tailwind.config.ts",
      "*.cjs",
      "*.mjs",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "simple-import-sort": sort,
    },
    rules: {
      ...js.configs.recommended.rules,
      "simple-import-sort/imports": "off",
      "simple-import-sort/exports": "off",
    },
  },

  // Main source files
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
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
      ...js.configs.recommended.rules,

      // Core JavaScript/TypeScript
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-undef": "off", // TypeScript handles this

      // Import management
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "import/first": "error",
      "import/no-duplicates": "off",
      "import/no-mutable-exports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // TypeScript specific
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-floating-promises": ["error", { ignoreIIFE: true }],
      "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/consistent-type-assertions": "warn",

      // React
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Accessibility
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/no-autofocus": "warn",

      // Code quality
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",

      // Design token enforcement - prevent inline hex colors
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,6}$/]",
          message: "Direct hex colors are not allowed. Use design tokens from src/design-tokens.ts or CSS custom properties instead."
        },
        {
          selector: "CallExpression[callee.name='rgb']",
          message: "Direct rgb() colors are not allowed. Use design tokens from src/design-tokens.ts or CSS custom properties instead."
        },
        {
          selector: "CallExpression[callee.name='rgba']",
          message: "Direct rgba() colors are not allowed. Use design tokens from src/design-tokens.ts or CSS custom properties instead."
        }
      ],
    },
  },

  // Test files
  {
    files: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "src/**/__tests__/**/*.{ts,tsx}",
      "tests/**/*.{ts,tsx}",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        // Remove project reference for test files to avoid parsing errors
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        // Vitest globals
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        vi: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "unused-imports": unused,
      "simple-import-sort": sort,
    },
    rules: {
      "no-console": "off",
      "no-undef": "off",
      "@typescript-eslint/no-floating-promises": "off", // Tests can have floating promises
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  // Design tokens file - exception for hex colors (must be last to override)
  {
    files: ["src/design-tokens.ts"],
    rules: {
      "no-restricted-syntax": "off", // Allow hex colors in design tokens
    },
  },
]