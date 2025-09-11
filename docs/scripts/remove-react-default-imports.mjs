import fs from "node:fs";
import path from "node:path";

function walk(dir, files=[]) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) files.push(p);
  }
  return files;
}

const files = walk("src");
let changed = 0;

for (const f of files) {
  let s = fs.readFileSync(f, "utf8");

  // 1) import React from "react";
  s = s.replace(/^\s*import\s+React\s+from\s+["']react["']\s*;?\s*\n/mg, "");

  // 2) import React, { ... } from "react" -> import { ... } from "react"
  s = s.replace(/^\s*import\s+React\s*,\s*\{([^}]*)\}\s*from\s+["']react["']\s*;?\s*$/mg,
                'import {$1} from "react";');

  // 3) import * as React from "react"; (hart entfernen)
  s = s.replace(/^\s*import\s+\*\s+as\s+React\s+from\s+["']react["']\s*;?\s*\n/mg, "");

  fs.writeFileSync(f, s);
  changed++;
}
console.log("processed files:", changed);
