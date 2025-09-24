import fs from "node:fs";
const p = "src/main.tsx";
const s = fs.readFileSync(p, "utf8");
if (!s.includes('import "@/bootstrap/migrations";')) {
  const out = s.replace(/(^import .+\n)+/m, (m) => m + 'import "@/bootstrap/migrations";\n');
  fs.writeFileSync(p, out);
  console.log("added migration import in", p);
} else {
  console.log("migration import already present");
}
