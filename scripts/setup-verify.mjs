import fs from "node:fs";

const path = new URL("../package.json", import.meta.url);
const pkg = JSON.parse(fs.readFileSync(path, "utf8"));

// 2.1 Engines setzen/vereinheitlichen
pkg.engines = pkg.engines || {};
pkg.engines.node = ">=20.14.0 <21";

// 2.2 Scripts sicherstellen (nur ergänzen, Vorhandenes bleibt unberührt)
pkg.scripts = pkg.scripts || {};

const defaults = {
  lint: "eslint .",
  typecheck: "tsc -p tsconfig.json --noEmit",
  test: "vitest run",
  build: "vite build",
  preview: "vite preview --port 4173",
};

// Fehlende Standardskripte ergänzen, vorhandene nicht überschreiben
for (const [k, v] of Object.entries(defaults)) {
  if (!pkg.scripts[k]) pkg.scripts[k] = v;
}

// 2.3 Eine einheitliche Verify-Kette aufbauen
// Wenn es schon eine 'verify' gibt, lassen wir sie in Ruhe.
if (!pkg.scripts.verify) {
  // Baue verify dynamisch aus den tatsächlich vorhandenen Steps zusammen
  const chain = ["lint", "typecheck", "test", "build"]
    .filter((s) => pkg.scripts[s])
    .map((s) => `npm run ${s}`);
  pkg.scripts.verify = chain.join(" && ");
}

// Schreiben
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + "\n", "utf8");

console.log("package.json aktualisiert:");
console.log("- engines.node:", pkg.engines.node);
console.log("- scripts.verify:", pkg.scripts.verify);
