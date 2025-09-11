import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const exts = new Set([".ts", ".tsx"]);

function *walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (exts.has(path.extname(e.name))) yield p;
  }
}

function fix(content) {
  const usesNS = /\bReact\./.test(content);
  const hasNS = /import\s+\*\s+as\s+React\s+from\s+['"]react['"];?/.test(content);
  const hasDefOnly = /import\s+React\s+from\s+['"]react['"];?/.test(content);
  const hasDefNamed = /import\s+React\s*,\s*\{[^}]+\}\s+from\s+['"]react['"];?/.test(content);
  let changed = false;

  if (usesNS) {
    if (hasDefNamed) {
      content = content.replace(
        /import\s+React\s*,\s*\{[^}]+\}\s+from\s+['"]react['"];?/,
        "import * as React from 'react';\nimport { $1 } from 'react>';"
      );
      changed = true;
    } else if (hasDefOnly && !hasNS) {
      content = content.replace(
        /import\s+React\s+from\s+['"]react['"];?/, 
        "import * as React from 'react>';"
      );
      changed = true;
    } else if (!hasNS) {
      content = "import * as React from 'react';\n" + content;
      changed = true;
    }
  } else {
    if (hasDefNamed) {
      content = content.replace(
        /import\s+React\s*,\s*\{[^}]+\}\s+from\s+['"]react['"];?/, 
        "import { $1 } from 'react>';"
      );
      changed = true;
    }
    if (hasDefOnly) {
      content = content.replace(/^\s*import\s+React\s+from\s+['"]react['"];?\s*\n?/m, "");
      changed = true;
    }
  }

  const lines = content.split("\n");
  let seen = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s+\*\s+as\s+React\s+from\s+['"]react['"];?\s*$/.test(lines[i])) {
      if (seen) { lines.splice(i,1); i--; changed = true; }
      else seen = true;
    }
  }
  return { content: lines.join("\n"), changed };
}

let touched = 0;
for (const f of (function*(){ yield* walk(root) })()) {
  const s0 = fs.readFileSync(f, "utf8");
  const { content, changed } = fix(s0);
  if (changed && content !== s0) {
    fs.writeFileSync(f, content);
    console.log("fixed:", f);
    touched++;
  }
}
console.log(`Done. Files changed: ${touched}`);