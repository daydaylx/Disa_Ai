#!/usr/bin/env node
/**
 * Z.AI Vision MCP Server - Wrapper für Disa AI Projekt
 *
 * Dieses Skript dient als Wrapper für das @z_ai/mcp-server Paket
 * und stellt sicher, dass die Environment Variablen korrekt geladen werden.
 */

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lade Environment Variablen aus .env.local
const projectRoot = join(__dirname, "..");
const envPath = join(projectRoot, ".env.local");

let env: Record<string, string> = {};
try {
  const envContent = readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").trim();
      if (key && value) {
        env[key.trim()] = value;
      }
    }
  });
} catch (error) {
  console.error("⚠️ Konnte .env.local nicht lesen:", error);
}

// Validiere erforderliche Environment Variablen
const requiredEnvVars = ["Z_AI_API_KEY", "Z_AI_MODE"];
const missingVars = requiredEnvVars.filter((varName) => !env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Fehlende Environment Variablen:");
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error("\nBitte setzen Sie die fehlenden Variablen in Ihrer .env.local Datei.");
  process.exit(1);
}

// Setze Environment Variablen für den Child Process
const childEnv = {
  ...process.env,
  Z_AI_API_KEY: env.Z_AI_API_KEY,
  Z_AI_MODE: env.Z_AI_MODE,
};

console.error("🚀 Starte Z.AI Vision MCP Server...");
console.error(`📋 API Key: ${env.Z_AI_API_KEY?.substring(0, 8)}...`);
console.error(`🔧 Mode: ${env.Z_AI_MODE}`);

// Starte den Z.AI MCP Server
const zaiServer = spawn("npx", ["-y", "@z_ai/mcp-server"], {
  stdio: "inherit",
  env: childEnv,
  shell: true,
});

// Handle Process Signale
process.on("SIGINT", () => {
  console.error("\n🛑 Beende Z.AI Vision MCP Server...");
  zaiServer.kill("SIGINT");
});

process.on("SIGTERM", () => {
  console.error("\n🛑 Beende Z.AI Vision MCP Server...");
  zaiServer.kill("SIGTERM");
});

// Handle Server Errors
zaiServer.on("error", (error) => {
  console.error("❌ Fehler beim Starten des Z.AI MCP Servers:", error);
  process.exit(1);
});

zaiServer.on("exit", (code, signal) => {
  if (signal) {
    console.error(`\n🛑 Z.AI Vision MCP Server wurde mit Signal ${signal} beendet.`);
  } else if (code !== 0) {
    console.error(`\n❌ Z.AI Vision MCP Server wurde mit Code ${code} beendet.`);
    process.exit(code);
  } else {
    console.error("\n✅ Z.AI Vision MCP Server wurde erfolgreich beendet.");
  }
});
