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
  prettier, // Global ignores
  {
    ignores: [
      "dist/**",
      "dev-dist/**",
      "build/**",
      "coverage/**",
      "node_modules/**",
      "src/lib/openrouter.ts", // Legacy client
      "src/lib/icons/index.ts", // Icon library can import from lucide-react
      "*.config.js",
      "*.config.ts",
      "tailwind.config.ts", // Ignore Tailwind config
      "tailwind.config.optimized.ts",
      "src/styles/**/*.css", // Ignore CSS files (not parsed by ESLint)
      "**/*.d.ts", // Ignore TypeScript declaration files
      "public/**",
      "*.md",
      ".env",
      "docs/archive/**", // Archive directories
    ],
  }, // Configuration files (Node.js environment)
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
  }, // Main source files
  {
    files: ["functions/**/*.{ts,tsx}", "shared/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.serviceworker,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "unused-imports": unused,
      "simple-import-sort": sort,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
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
      "import/no-mutable-exports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Prevent direct lucide-react imports to avoid bootstrap errors (except in the icons lib itself)
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lucide-react",
              message:
                "Please import icons from '@/lib/icons' instead of directly from 'lucide-react'. This prevents bootstrap errors due to missing icon exports.",
              allowTypeImports: true,
            },
          ],
        },
      ],

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
      "react-hooks/exhaustive-deps": "error",

      // Accessibility
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/no-autofocus": "warn",

      // Code quality
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",

      // Design token enforcement - prevent inline hex colors, raw 100vh, and z-[9999]
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,6}$/]",
          message:
            "Direct hex colors are not allowed. Use semantic tokens or CSS custom properties instead.",
        },
        {
          selector:
            "Literal[value=/^100vh$/], TemplateElement[value.raw=/100vh/], TemplateElement[value.cooked=/100vh/]",
          message:
            "Avoid raw 100vh due to mobile viewport issues. Use 100dvh, safe-area aware utilities, or existing layout helpers.",
        },
        {
          selector:
            "Literal[value=/z-\\[9999\\]/], TemplateElement[value.raw=/z-\\[9999\\]/], TemplateElement[value.cooked=/z-\\[9999\\]/]",
          message:
            "Use semantic z-index utilities (e.g. z-toast, z-notification, z-bottom-nav) instead of arbitrary z-[9999].",
        },
      ],
    },
  }, // Test files
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
  }, // Design tokens file - exception for hex colors (must be last to override)
  {
    files: ["src/styles/design-tokens.ts"],
    rules: {
      "no-restricted-syntax": "off", // Allow hex colors in design tokens
    },
  },
];
