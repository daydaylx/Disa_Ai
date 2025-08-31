/* ESLint config – Disa_Ai (klassisch, kompatibel) */
module.exports = {
  root: true,
  env: {
    es2022: true,
    browser: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    project: false
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "import",
    "unused-imports"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  settings: {
    react: { version: "detect" }
  },
  rules: {
    // --- TypeScript Striktheit, aber praxistauglich ---
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": "off", // wir nutzen unused-imports statt dessen
    // --- React ---
    "react/jsx-uses-react": "off", // neue JSX-Transform
    "react/react-in-jsx-scope": "off",
    // --- Imports ---
    "import/order": ["warn", {
      "groups": ["builtin", "external", "internal", ["parent", "sibling", "index"]],
      "newlines-between": "always",
      "alphabetize": { "order": "asc", "caseInsensitive": true }
    }],
    "import/no-unresolved": "off", // Vite alias/bundler-resolve
    // --- Unused Imports (schnell + zuverlässig) ---
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
    ]
  },
  overrides: [
    {
      files: ["**/*.test.*", "**/*.spec.*"],
      env: { jest: false },
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
};
