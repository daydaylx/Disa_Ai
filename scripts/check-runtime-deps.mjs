import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();

const SOURCE_DIRS = ["src", "functions", "scripts", "tools", "tests"];
const ROOT_FILES = [
  "vite.config.ts",
  "vitest.config.ts",
  "playwright.config.ts",
  "tailwind.config.ts",
  "postcss.config.js",
  "eslint.config.mjs",
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function listFilesRecursively(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") {
      continue;
    }
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursively(fullPath)));
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

async function collectSearchFiles() {
  const files = [];

  for (const relDir of SOURCE_DIRS) {
    const fullDir = path.join(projectRoot, relDir);
    try {
      files.push(...(await listFilesRecursively(fullDir)));
    } catch {
      // Directory is optional.
    }
  }

  for (const relFile of ROOT_FILES) {
    const fullFile = path.join(projectRoot, relFile);
    try {
      const fileStat = await stat(fullFile);
      if (fileStat.isFile()) {
        files.push(fullFile);
      }
    } catch {
      // Root file is optional.
    }
  }

  return files;
}

async function main() {
  const packageJsonPath = path.join(projectRoot, "package.json");
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
  const dependencies = Object.keys(packageJson.dependencies || {});

  if (dependencies.length === 0) {
    console.log("[check-runtime-deps] No runtime dependencies found.");
    return;
  }

  const files = await collectSearchFiles();
  const fileContents = await Promise.all(
    files.map(async (filePath) => ({
      filePath,
      content: await readFile(filePath, "utf8").catch(() => ""),
    })),
  );

  const missingDeps = [];

  for (const dep of dependencies) {
    const escaped = escapeRegex(dep);
    const importPattern = new RegExp(
      `(?:from\\s+['"]${escaped}(?:/|['"])|require\\(\\s*['"]${escaped}(?:/|['"])|import\\(\\s*['"]${escaped}(?:/|['"]))`,
      "m",
    );
    const isUsed = fileContents.some(({ content }) => importPattern.test(content));
    if (!isUsed) {
      missingDeps.push(dep);
    }
  }

  if (missingDeps.length > 0) {
    console.error("[check-runtime-deps] Unused runtime dependencies detected:");
    for (const dep of missingDeps) {
      console.error(` - ${dep}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`[check-runtime-deps] OK (${dependencies.length} dependencies referenced).`);
}

main().catch((error) => {
  console.error("[check-runtime-deps] failed:", error);
  process.exitCode = 1;
});
