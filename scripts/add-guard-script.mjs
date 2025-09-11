import fs from "node:fs";
const path = "package.json";
const pkg = JSON.parse(fs.readFileSync(path,"utf8"));
pkg.scripts ||= {};
pkg.scripts["guard:build"] = "bash scripts/build-guard.sh";
fs.writeFileSync(path, JSON.stringify(pkg,null,2));
console.log("added scripts.guard:build");
