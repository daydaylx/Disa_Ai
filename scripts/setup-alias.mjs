import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function readJsonCandidate(...names){
  for(const name of names){
    const p = path.join(root, name);
    if (fs.existsSync(p)) {
      try { return {file:p, json: JSON.parse(fs.readFileSync(p, "utf8"))}; } catch {}
    }
  }
  return null;
}
function writeJson(file, json){
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + "\n", "utf8");
}

// 1) TSConfig
{
  const cand = readJsonCandidate("tsconfig.base.json","tsconfig.json");
  if (cand){
    const {file, json} = cand;
    json.compilerOptions ||= {};
    json.compilerOptions.baseUrl ||= ".";
    json.compilerOptions.paths ||= {};
    const cur = json.compilerOptions.paths["@/*"];
    const same = Array.isArray(cur) && cur.length===1 && cur[0]==="src/*";
    if (!same) json.compilerOptions.paths["@/*"] = ["src/*"];
    writeJson(file, json);
    console.log("[tsconfig] Patched:", path.basename(file), "-> baseUrl:", json.compilerOptions.baseUrl, "paths @/* -> src/*");
  } else {
    console.warn("[tsconfig] Keine tsconfig gefunden.");
  }
}

// 2) Vite alias '@' -> ./src
{
  const viteFile = path.join(root, "vite.config.ts");
  if (!fs.existsSync(viteFile)) {
    console.warn("[vite] vite.config.ts nicht gefunden.");
  } else {
    let src = fs.readFileSync(viteFile, "utf8");
    let changed = false;

    // Imports sicherstellen
    if (!/from\s+['"]vite['"]/.test(src)) {
      src = `import { defineConfig } from 'vite'\n` + src;
      changed = true;
    }
    if (!/from\s+['"]node:url['"]/.test(src)) {
      src = `import { fileURLToPath, URL } from 'node:url'\n` + src;
      changed = true;
    }

    // alias prüfen: benutze dotAll-Flag korrekt mit /.../s
    const hasAlias = /resolve\s*:\s*{[^}]*alias\s*:\s*{[^}]*['"]@['"]\s*:.*?}/s.test(src);
    if (!hasAlias) {
      if (/resolve\s*:\s*{/.test(src)) {
        src = src.replace(/resolve\s*:\s*{/, m => `${m}
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },`);
      } else {
        src = src.replace(/defineConfig\(\{\s*/s, m => `${m}
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },`);
      }
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(viteFile, src, "utf8");
      console.log("[vite] Patched:", path.basename(viteFile));
    } else {
      console.log("[vite] Bereits ok:", path.basename(viteFile));
    }
  }
}

// 3) ESLint: plugin + Regeln + Resolver + Test-Override integrieren
{
  const eslintFile = path.join(root, "eslint.config.mjs");
  if (!fs.existsSync(eslintFile)) {
    console.warn("[eslint] eslint.config.mjs nicht gefunden.");
  } else {
    let s = fs.readFileSync(eslintFile, "utf8");
    let changed = false;

    if (!/from\s+['"]eslint-plugin-unused-imports['"]/.test(s)) {
      s = `import unusedImports from 'eslint-plugin-unused-imports'\n` + s;
      changed = true;
    }

    // Globaler Block: '^_' erlauben
    if (!s.includes("/* ALIAS&UNUSED-GLOBAL */")) {
      const inject = `
  /* ALIAS&UNUSED-GLOBAL */
  {
    plugins: { 'unused-imports': unusedImports },
    settings: { 'import/resolver': { typescript: true, node: true } },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['error', {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }]
    }
  }`;
      // Versuche, in export default [...] einzufügen
      if (/export\s+default\s+\[/s.test(s)) {
        s = s.replace(/\]\s*;?\s*$/s, m => `,${inject}\n]`);
        changed = true;
      }
    }

    // Test-Override: notfalls zusätzlich mildern (falls andere Blöcke vorher härter sind)
    if (!s.includes("/* ALIAS&UNUSED-TEST-OVERRIDE */")) {
      const injectTests = `
  /* ALIAS&UNUSED-TEST-OVERRIDE */
  {
    files: ["**/*.test.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
    rules: {
      'unused-imports/no-unused-vars': ['warn', {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }]
    }
  }`;
      if (/export\s+default\s+\[/s.test(s)) {
        s = s.replace(/\]\s*;?\s*$/s, m => `,${injectTests}\n]`);
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(eslintFile, s, "utf8");
      console.log("[eslint] Patched:", path.basename(eslintFile));
    } else {
      console.log("[eslint] Bereits ok:", path.basename(eslintFile));
    }
  }
}
