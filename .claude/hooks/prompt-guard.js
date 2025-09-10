#!/usr/bin/env node
(async () => {
  try {
    const input = await new Promise(res => {
      let buf=""; process.stdin.setEncoding("utf8");
      process.stdin.on("data", d => buf+=d); process.stdin.on("end", () => res(buf||"{}"));
    });
    const { prompt = "" } = JSON.parse(input);
    const banned = [/dump .*\.env/i, /exfiltrate/i, /private key/i];
    if (banned.some(rx => rx.test(prompt))) {
      console.error("❌ Prompt blockiert: möglicher Secret-Leak oder Exfiltration.");
      process.exit(2); // blockiert laut Hooks-Doku
    }
    // stdout wird als Kontext injiziert
    process.stdout.write("Prompt OK ✅\n");
    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
})();
