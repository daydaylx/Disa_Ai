#!/usr/bin/env node
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = join(__dirname, "..", "dist");

// Patterns to detect CSP violations
const patterns = {
  inlineScript: /<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi,
  inlineScriptSelfClosing: /<script(?![^>]*src=)[^>]*\/>/gi,
  inlineStyle: /<style[^>]*>[\s\S]*?<\/style>/gi,
  inlineStyleAttr: /\sstyle\s*=\s*["'][^"']*["']/gi,
  eventHandlers: /\son\w+\s*=\s*["'][^"']*["']/gi,
  javascriptUrls: /href\s*=\s*["']javascript:[^"']*["']/gi,
};

const violationDescriptions = {
  inlineScript: "Inline <script> tag without src attribute",
  inlineScriptSelfClosing: "Self-closing inline <script> tag",
  inlineStyle: "Inline <style> tag",
  inlineStyleAttr: "Inline style attribute",
  eventHandlers: "Event handler attribute (onclick, onload, etc.)",
  javascriptUrls: "javascript: URL in href",
};

async function scanDirectory(dirPath) {
  const violations = [];

  try {
    const items = await readdir(dirPath);

    for (const item of items) {
      const itemPath = join(dirPath, item);
      const stats = await stat(itemPath);

      if (stats.isDirectory()) {
        const subViolations = await scanDirectory(itemPath);
        violations.push(...subViolations);
      } else if (item.endsWith(".html") || item.endsWith(".htm")) {
        const fileViolations = await scanFile(itemPath);
        violations.push(...fileViolations);
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Error scanning directory ${dirPath}:`, error.message);
    }
  }

  return violations;
}

async function scanFile(filePath) {
  const violations = [];

  try {
    const content = await readFile(filePath, "utf8");
    const lines = content.split("\n");

    for (const [patternName, pattern] of Object.entries(patterns)) {
      const matches = [...content.matchAll(pattern)];

      for (const match of matches) {
        const lineNumber = content.substring(0, match.index).split("\n").length;
        const columnNumber = match.index - content.lastIndexOf("\n", match.index - 1);

        violations.push({
          file: filePath,
          line: lineNumber,
          column: columnNumber,
          type: patternName,
          description: violationDescriptions[patternName],
          match: match[0].substring(0, 100) + (match[0].length > 100 ? "..." : ""),
          fullMatch: match[0],
        });
      }
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
  }

  return violations;
}

function formatViolation(violation) {
  const relativePath = violation.file.replace(process.cwd() + "/", "");
  return `
📍 ${relativePath}:${violation.line}:${violation.column}
   Type: ${violation.description}
   Content: ${violation.match}
`;
}

async function main() {
  console.log("🔍 Scanning dist/ for CSP violations...\n");

  try {
    await stat(distPath);
  } catch (error) {
    console.error(`❌ dist/ directory not found. Run 'npm run build' first.`);
    process.exit(1);
  }

  const violations = await scanDirectory(distPath);

  if (violations.length === 0) {
    console.log("✅ No CSP violations found in dist/");
    console.log("   All HTML files are compatible with strict CSP policy.");
    process.exit(0);
  }

  console.log(`❌ Found ${violations.length} CSP violation${violations.length === 1 ? "" : "s"}:`);

  // Group violations by file
  const violationsByFile = violations.reduce((acc, violation) => {
    const file = violation.file;
    if (!acc[file]) acc[file] = [];
    acc[file].push(violation);
    return acc;
  }, {});

  for (const [file, fileViolations] of Object.entries(violationsByFile)) {
    const relativePath = file.replace(process.cwd() + "/", "");
    console.log(
      `\n📄 ${relativePath} (${fileViolations.length} violation${fileViolations.length === 1 ? "" : "s"}):`,
    );

    for (const violation of fileViolations) {
      console.log(`   Line ${violation.line}: ${violation.description}`);
      console.log(`   Content: ${violation.match}`);
    }
  }

  console.log("\n💡 To fix these violations:");
  console.log("   • Move inline scripts to external .js files");
  console.log("   • Move inline styles to external .css files or use CSS-in-JS");
  console.log("   • Replace event handlers with addEventListener()");
  console.log("   • Remove javascript: URLs from href attributes");
  console.log("   • Or switch to CSP Profile B (nonce-based) in _headers");

  process.exit(1);
}

main().catch((error) => {
  console.error("💥 Unexpected error:", error);
  process.exit(1);
});
