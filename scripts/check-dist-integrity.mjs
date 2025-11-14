import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const INDEX_PATH = path.join(DIST_DIR, "index.html");

function extractAssetReferences(html) {
  const assetPattern = /(href|src)\s*=\s*"([^"]+\.(?:css|js))"/g;
  const references = new Set();

  let match;
  while ((match = assetPattern.exec(html)) !== null) {
    const url = match[2];
    // Only consider assets served from the build output
    if (url.includes("/assets/") || url.startsWith("assets/")) {
      references.add(url);
    }
  }

  return Array.from(references);
}

function resolveAssetPath(reference) {
  const normalized = reference.replace(/^\/+/, "");
  return path.join(DIST_DIR, normalized);
}

function checkAssetsExist(references) {
  const missing = [];

  for (const reference of references) {
    const assetPath = resolveAssetPath(reference);
    if (!fs.existsSync(assetPath)) {
      missing.push({ reference, assetPath });
    }
  }

  return missing;
}

function main() {
  if (!fs.existsSync(INDEX_PATH)) {
    console.error(`❌ Datei nicht gefunden: ${INDEX_PATH}`);
    process.exit(1);
  }

  const html = fs.readFileSync(INDEX_PATH, "utf8");
  const references = extractAssetReferences(html);

  if (references.length === 0) {
    console.log("ℹ️  Keine CSS/JS-Referenzen im dist/index.html gefunden.");
    process.exit(0);
  }

  const missing = checkAssetsExist(references);

  if (missing.length === 0) {
    console.log("✅ Alle referenzierten Assets sind im dist/assets-Ordner vorhanden.");
    process.exit(0);
  }

  console.error("❌ Die folgenden Asset-Referenzen fehlen im dist/assets-Ordner:");
  for (const item of missing) {
    console.error(` - ${item.reference} (erwartet: ${item.assetPath})`);
  }

  process.exit(1);
}

main();
