#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

async function* walk(dir) {
  for (const ent of await fs.readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".git" || ent.name === "dist") continue;
      yield* walk(p);
    } else {
      yield p;
    }
  }
}

function hasBadEllipsis(content) {
  // harte Heuristik: Literal "..." im Code, nicht in Kommentaren/Strings unterscheiden wir hier nicht.
  // Reicht, um die offensichtlichen Schnittkanten zu finden.
  return content.includes("...");
}

const bad = [];
for await (const p of walk(ROOT)) {
  const lower = p.toLowerCase();
  if (![...exts].some((e) => lower.endsWith(e))) continue;
  const s = await fs.readFile(p, "utf8");
  if (hasBadEllipsis(s)) bad.push(relative(ROOT, p));
}

// Schreibe Report als JSON, damit die App ihn anzeigen kann
await fs.mkdir("src/diagnostics", { recursive: true });
const report = {
  generatedAt: new Date().toISOString(),
  count: bad.length,
  files: bad.sort(),
};
await fs.writeFile("src/diagnostics/corruptionReport.json", JSON.stringify(report, null, 2));

if (bad.length > 0) {
  console.error(
    `❌ ${bad.length} beschädigte Datei(en) gefunden. Report: src/diagnostics/corruptionReport.json`,
  );
  process.exit(1);
} else {
  console.log("✓ Keine offensichtliche Korruption gefunden.");
}
