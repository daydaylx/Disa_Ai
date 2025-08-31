import fs from "node:fs";
import path from "node:path";

const pkgPath = path.resolve(process.cwd(), "package.json");
const raw = fs.readFileSync(pkgPath, "utf8");
const pkg = JSON.parse(raw);

// Ziel-Scripts (konservativ & stabil)
const desired = {
  dev: "vite",
  build: "npm run typecheck && vite build",
  typecheck: "tsc -p tsconfig.json --noEmit && tsc -p tsconfig.test.json --noEmit",
  preview: "vite preview --host 127.0.0.1 --port 4173 --strictPort",
  lint: "eslint . --ext .ts,.tsx,.js,.jsx",
  "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
  format: "prettier --write .",
  "format:check": "prettier --check .",
  test: "vitest run",
  "test:watch": "vitest",
};

// Scripts-Objekt sicherstellen
pkg.scripts = pkg.scripts && typeof pkg.scripts === "object" ? pkg.scripts : {};

// 1) Alle Scripts entfernen, die 'jq' benötigen
for (const [k, v] of Object.entries(pkg.scripts)) {
  if (typeof v === "string" && v.includes("jq")) {
    delete pkg.scripts[k];
  }
}

// 2) Ziel-Scripts setzen/überschreiben
for (const [k, v] of Object.entries(desired)) {
  pkg.scripts[k] = v;
}

// 3) Optional: alte Dubletten säubern (z. B. preview:* Varianten)
for (const k of Object.keys(pkg.scripts)) {
  if (/^preview:/.test(k)) delete pkg.scripts[k];
}

// 4) Schön formatiert zurückschreiben
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");

console.log("package.json scripts aktualisiert. Verfügbare Befehle:");
for (const k of Object.keys(desired)) console.log("  -", k, "=>", desired[k]);
