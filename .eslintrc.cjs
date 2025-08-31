/* Strict, aber TS-freundlich */
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["@typescript-eslint", "simple-import-sort", "unused-imports", "react"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  settings: { react: { version: "detect" } },
  rules: {
    // Global: wir delegieren Unused an plugin
    "no-unused-vars": "off",
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: { ecmaFeatures: { jsx: true } },
      rules: {
        // TS kennt Typen wie JSX/RequestInit – diese Regel ist in TS-Projekten schlicht falsch
        "no-undef": "off",
        // Sortierung + Aufräumen
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "unused-imports/no-unused-imports": "error",
        // Empty-Blocks: wir ersparen uns kosmetische Kommentare in Platzhalterdateien
        "no-empty": "off",
      },
    },
    {
      files: ["tests/**/*.{ts,tsx}", "**/*.spec.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
      parser: "@typescript-eslint/parser",
      env: { browser: true, node: true },
      globals: {
        vi: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
  ],
};
