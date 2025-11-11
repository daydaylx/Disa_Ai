#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";

const DIST_DIR = join(process.cwd(), "dist");
const INDEX_HTML = join(DIST_DIR, "index.html");

async function ensureFile(path, description) {
  try {
    await access(path, constants.R_OK);
  } catch {
    throw new Error(`🚫 ${description} fehlt: ${path}`);
  }
}

async function main() {
  await ensureFile(DIST_DIR, "dist-Verzeichnis");
  await ensureFile(INDEX_HTML, "dist/index.html");

  const indexHtml = await readFile(INDEX_HTML, "utf-8");

  if (/\/src\/main\.tsx/.test(indexHtml)) {
    throw new Error(
      "🚫 dist/index.html verweist noch auf /src/main.tsx. Der Produktions-Build wurde nicht gebundled. Bitte `npm run build` ausführen und den dist-Ordner deployen.",
    );
  }

  const scriptMatches = [...indexHtml.matchAll(/<script[^>]+src=\"([^\"]+)\"/g)]
    .map(([, src]) => src)
    .filter((src) => src.endsWith(".js"));

  if (scriptMatches.length === 0) {
    throw new Error(
      "🚫 Keine JS-Bundles in dist/index.html gefunden. Erwartet werden Dateien unter /assets/js/*.",
    );
  }

  const assetScripts = scriptMatches.filter((src) => src.startsWith("/assets/js/"));
  if (assetScripts.length === 0) {
    throw new Error(
      "🚫 dist/index.html enthält keine Hashed-Bundles unter /assets/js/. Bitte sicherstellen, dass Vite den Build erzeugt hat.",
    );
  }

  await Promise.all(
    assetScripts.map(async (src) => {
      const path = join(DIST_DIR, src.replace(/^[\/]/, ""));
      await ensureFile(path, "JavaScript-Bundle");
    }),
  );

  if (/\.tsx\b/.test(indexHtml)) {
    throw new Error(
      "🚫 dist/index.html enthält noch .tsx-Referenzen. Der Build muss transpilierte JavaScript-Dateien ausliefern.",
    );
  }

  console.log("✅ dist-Ordner geprüft: index.html liefert gebundelte Assets aus.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
