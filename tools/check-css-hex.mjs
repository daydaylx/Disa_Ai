#!/usr/bin/env node

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const IGNORED_FILES = [
  "src/styles/design-tokens.generated.ts",
  "src/styles/design-tokens.ts",
  "src/styles/tokens.css",
  "src/styles/unified-tokens.css",
  "src/theme/tokens.css",
  "src/styles/design-tokens-consolidated.css",
  "src/styles/design-system-tokens.css",
  "src/styles/oled-theme.css", // OLED theme requires specific hex values for pure black
  "src/styles/reduce-motion.css", // Accessibility theme with specific color requirements
];

const HEX_COLOR_REGEX = /#[0-9a-fA-F]{3,8}\b/g;

function isIgnored(filePath) {
  return IGNORED_FILES.some((ignore) => filePath.endsWith(ignore));
}

/**
 * Recursively collect CSS files.
 */
function collectCssFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (
        [
          "node_modules",
          "dist",
          "dev-dist",
          "coverage",
          ".git",
          "playwright-report",
          "test-results",
        ].includes(entry.name)
      ) {
        return [];
      }
      return collectCssFiles(fullPath);
    }

    if (entry.isFile() && entry.name.endsWith(".css")) {
      return [fullPath];
    }

    return [];
  });
}

function checkFile(filePath) {
  if (isIgnored(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf8");
  const matches = content.match(HEX_COLOR_REGEX);

  if (!matches) return [];

  return matches.map((hex) => ({ filePath, hex }));
}

function main() {
  const cssFiles = collectCssFiles(rootDir);

  const violations = cssFiles.flatMap((file) => checkFile(file));

  if (violations.length === 0) {
    process.exit(0);
  }

  console.error("Found disallowed hex colors in CSS files (use tokens or CSS vars instead):");
  for (const v of violations) {
    console.error(` - ${v.filePath}: ${v.hex}`);
  }

  process.exit(1);
}

main();
