import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const sourcePath = path.resolve(process.cwd(), "src/config/models_metadata.json");
const targetPath = path.resolve(process.cwd(), "public/models_metadata.json");

async function syncModelsMetadata() {
  const sourceContent = await readFile(sourcePath, "utf8");
  let targetContent = null;

  try {
    targetContent = await readFile(targetPath, "utf8");
  } catch {
    targetContent = null;
  }

  if (targetContent === sourceContent) {
    return;
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, sourceContent, "utf8");
  console.log("[sync-models-metadata] public/models_metadata.json updated");
}

syncModelsMetadata().catch((error) => {
  console.error("[sync-models-metadata] failed:", error);
  process.exitCode = 1;
});
