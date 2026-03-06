import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = process.cwd();
const reportsRoot = path.join(projectRoot, "docs", "reports");
const allowedSnapshotRoot = "ui-after-2026-02-23";
const allowedSnapshotLeaf = "phase-3-before";
const maxReportFileBytes = 5 * 1024 * 1024;
const maxSnapshotFileCount = 200;

async function listFilesRecursively(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursively(fullPath)));
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

async function checkReportStructure(errors) {
  const entries = await readdir(reportsRoot, { withFileTypes: true });
  const snapshotRoots = entries.filter(
    (entry) => entry.isDirectory() && entry.name.startsWith("ui-"),
  );

  for (const entry of snapshotRoots) {
    if (entry.name !== allowedSnapshotRoot) {
      errors.push(
        `Disallowed report snapshot root: docs/reports/${entry.name} (allowed: ${allowedSnapshotRoot})`,
      );
      continue;
    }

    const rootPath = path.join(reportsRoot, entry.name);
    const phaseEntries = await readdir(rootPath, { withFileTypes: true });
    const disallowedPhaseDirs = phaseEntries.filter(
      (phase) => phase.isDirectory() && phase.name !== allowedSnapshotLeaf,
    );
    for (const phase of disallowedPhaseDirs) {
      errors.push(
        `Disallowed report phase directory: docs/reports/${entry.name}/${phase.name} (allowed: ${allowedSnapshotLeaf})`,
      );
    }
  }
}

async function checkReportFileBudget(errors) {
  const reportFiles = await listFilesRecursively(reportsRoot);
  for (const filePath of reportFiles) {
    const fileStat = await stat(filePath);
    if (fileStat.size > maxReportFileBytes) {
      const relativePath = path.relative(projectRoot, filePath);
      errors.push(
        `Report file exceeds size budget (${maxReportFileBytes} bytes): ${relativePath} (${fileStat.size} bytes)`,
      );
    }
  }

  const snapshotPath = path.join(reportsRoot, allowedSnapshotRoot, allowedSnapshotLeaf);
  const snapshotFiles = await listFilesRecursively(snapshotPath);
  if (snapshotFiles.length > maxSnapshotFileCount) {
    errors.push(
      `Snapshot file count exceeds budget (${maxSnapshotFileCount}): ${snapshotFiles.length}`,
    );
  }
}

async function checkModelsMetadataSync(errors) {
  const sourcePath = path.join(projectRoot, "src", "config", "models_metadata.json");
  const targetPath = path.join(projectRoot, "public", "models_metadata.json");

  let sourceContent = "";
  let targetContent = "";
  try {
    sourceContent = await readFile(sourcePath, "utf8");
  } catch (error) {
    errors.push(`Missing source metadata file: ${sourcePath} (${String(error)})`);
    return;
  }

  try {
    targetContent = await readFile(targetPath, "utf8");
  } catch {
    errors.push(
      "Missing generated public/models_metadata.json. Run `npm run predev` before hygiene checks.",
    );
    return;
  }

  if (sourceContent !== targetContent) {
    errors.push(
      "Metadata sync mismatch: src/config/models_metadata.json != public/models_metadata.json",
    );
  }

  const trackedCheck = spawnSync(
    "git",
    ["ls-files", "--error-unmatch", "public/models_metadata.json"],
    {
      cwd: projectRoot,
      stdio: "ignore",
    },
  );
  if (trackedCheck.status === 0) {
    errors.push("public/models_metadata.json must not be tracked in git.");
  }
}

async function main() {
  const errors = [];

  await checkReportStructure(errors);
  await checkReportFileBudget(errors);
  await checkModelsMetadataSync(errors);

  if (errors.length > 0) {
    console.error("[check-repo-hygiene] FAILED");
    for (const error of errors) {
      console.error(` - ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("[check-repo-hygiene] OK");
}

main().catch((error) => {
  console.error("[check-repo-hygiene] failed:", error);
  process.exitCode = 1;
});
