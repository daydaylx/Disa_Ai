#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const TOOL_PATH = fileURLToPath(import.meta.url);
const TOOLS_DIR = dirname(TOOL_PATH);
const PROJECT_ROOT = dirname(TOOLS_DIR);
const SRC_DIR = join(PROJECT_ROOT, "src");
const TOKEN_FILE = join(SRC_DIR, "styles", "design-tokens.css");
const TOKENS_FILE = join(SRC_DIR, "styles", "tokens.css");

const HEX_REGEX = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?![0-9a-fA-F])/g;

async function collectCssFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      files.push(...(await collectCssFiles(entryPath)));
      continue;
    }

    if (!entry.name.endsWith(".css")) continue;
    files.push(entryPath);
  }

  return files;
}

async function main() {
  const cssFiles = await collectCssFiles(SRC_DIR);
  const offenders = [];

  for (const filePath of cssFiles) {
    if (filePath === TOKEN_FILE || filePath === TOKENS_FILE) continue;

    const content = await readFile(filePath, "utf8");
    const matches = [...content.matchAll(HEX_REGEX)];
    if (matches.length === 0) continue;

    const uniqueMatches = [...new Set(matches.map((m) => m[0]))];
    offenders.push({ filePath: relative(PROJECT_ROOT, filePath), matches: uniqueMatches });
  }

  if (offenders.length === 0) {
    process.exit(0);
  }

  console.error("Hex colors detected outside design token source:\n");
  offenders.forEach(({ filePath, matches }) => {
    console.error(`- ${filePath}: ${matches.join(", ")}`);
  });
  console.error("\nReplace these with CSS variables or token references.");
  process.exit(1);
}

main().catch((error) => {
  console.error("Failed to run CSS hex check:", error);
  process.exit(1);
});
