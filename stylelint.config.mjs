/**
 * Stylelint configuration enforcing design-token usage.
 *
 * Hex colors are only allowed inside the token source file.
 */
export default {
  ignoreFiles: ["src/styles/design-tokens.css"],
  rules: {
    "color-no-hex": true,
  },
};
