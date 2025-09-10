#!/usr/bin/env node
const { execSync } = require("child_process");

(async () => {
  try {
    const input = await new Promise(res => {
      let buf = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", d => buf += d);
      process.stdin.on("end", () => res(buf || "{}"));
    });
    const payload = JSON.parse(input);
    const tool = payload.tool_name || "";
    const fp = payload?.tool_input?.file_path || "";

    // Nur TS/TSX anfassen
    const isTS = /\.(ts|tsx)$/.test(fp);

    if (tool.match(/Edit|Write|MultiEdit/) && isTS) {
      try { execSync(`npx prettier --write "${fp}"`, { stdio: "inherit" }); } catch {}
      try { execSync(`npx eslint "${fp}" --fix || true`, { stdio: "inherit" }); } catch {}
      try { execSync(`npx tsc --noEmit --skipLibCheck "${fp}" || true`, { stdio: "inherit" }); } catch {}
    }
    process.exit(0);
  } catch (e) {
    console.error("quality-check hook failed:", e?.message || e);
    process.exit(1);
  }
})();
