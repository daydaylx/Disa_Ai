#!/usr/bin/env node
/**
 * 🚀 Disa AI - Deployment Validation Script
 *
 * Überprüft kritische Konfigurationsprobleme vor dem Deployment
 * Verhindert defekte Deployments durch fehlende KV-Namespaces oder API-Keys
 *
 * Usage: node scripts/validate-deploy.js
 * oder: npm run validate:deploy
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

let hasErrors = false;
let hasWarnings = false;

function logError(message) {
  console.error(`❌ ERROR: ${message}`);
  hasErrors = true;
}

function logWarning(message) {
  console.warn(`⚠️  WARNING: ${message}`);
  hasWarnings = true;
}

function logSuccess(message) {
  console.log(`✅ OK: ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  INFO: ${message}`);
}

console.log("🔍 Disa AI - Deployment Validation\n");

// 1. Validiere wrangler.toml Konfiguration
console.log("📋 Checking wrangler.toml configuration...");

const wranglerPath = join(rootDir, "wrangler.toml");
if (!existsSync(wranglerPath)) {
  logError("wrangler.toml not found");
} else {
  const wranglerConfig = readFileSync(wranglerPath, "utf-8");

  // Check für Platzhalter KV-IDs
  if (wranglerConfig.includes("YOUR_PRODUCTION_RATE_LIMIT_KV_NAMESPACE_ID")) {
    logError("Production KV Namespace ID is still a placeholder in wrangler.toml");
    logInfo('Create KV namespace: wrangler kv:namespace create "RATE_LIMIT_KV" --env production');
  } else {
    logSuccess("Production KV Namespace ID is configured");
  }

  if (wranglerConfig.includes("YOUR_PREVIEW_RATE_LIMIT_KV_NAMESPACE_ID")) {
    logError("Preview KV Namespace ID is still a placeholder in wrangler.toml");
    logInfo('Create KV namespace: wrangler kv:namespace create "RATE_LIMIT_KV" --env preview');
  } else {
    logSuccess("Preview KV Namespace ID is configured");
  }

  if (wranglerConfig.includes("RATE_LIMIT_KV_NAMESPACE_ID")) {
    logError("Default KV Namespace ID is still a placeholder in wrangler.toml");
  } else {
    logSuccess("Default KV Namespace ID is configured");
  }

  // Check compatibility date
  if (wranglerConfig.includes('compatibility_date = "2025-11-16"')) {
    logSuccess("Compatibility date is current (2025-11-16)");
  } else {
    logWarning("Compatibility date might be outdated");
  }
}

// 2. Validiere functions/api/chat.ts
console.log("\n🔌 Checking API function configuration...");

const chatApiPath = join(rootDir, "functions/api/chat.ts");
if (!existsSync(chatApiPath)) {
  logError("functions/api/chat.ts not found");
} else {
  const chatApiContent = readFileSync(chatApiPath, "utf-8");

  // Check für KV-Usage
  if (chatApiContent.includes("env.RATE_LIMIT_KV")) {
    logSuccess("API function expects RATE_LIMIT_KV namespace");

    if (chatApiContent.includes("OPENROUTER_API_KEY")) {
      logSuccess("API function expects OPENROUTER_API_KEY environment variable");
    } else {
      logError("API function does not check for OPENROUTER_API_KEY");
    }
  } else {
    logError("API function does not use RATE_LIMIT_KV namespace");
  }
}

// 3. Validiere Security Headers
console.log("\n🔒 Checking security headers...");

const headersPath = join(rootDir, "public/_headers");
if (!existsSync(headersPath)) {
  logWarning("public/_headers file not found - security headers not configured");
} else {
  const headersContent = readFileSync(headersPath, "utf-8");

  if (headersContent.includes("Content-Security-Policy")) {
    logSuccess("Content Security Policy is configured");

    // Check für unsichere CSP-Direktiven
    if (headersContent.includes("'unsafe-inline'")) {
      logWarning("CSP allows unsafe-inline (acceptable for Vite builds)");
    }

    if (headersContent.includes("openrouter.ai")) {
      logSuccess("CSP allows connections to OpenRouter API");
    } else {
      logError("CSP does not allow connections to openrouter.ai");
    }
  } else {
    logError("Content Security Policy not configured");
  }

  if (headersContent.includes("Strict-Transport-Security")) {
    logSuccess("HSTS header is configured");
  } else {
    logWarning("HSTS header not configured");
  }
}

// 4. Validiere Build-Konfiguration
console.log("\n🏗️  Checking build configuration...");

const packagePath = join(rootDir, "package.json");
if (!existsSync(packagePath)) {
  logError("package.json not found");
} else {
  const packageContent = JSON.parse(readFileSync(packagePath, "utf-8"));

  if (packageContent.scripts && packageContent.scripts["validate:deploy"]) {
    logSuccess("validate:deploy script is configured");
  } else {
    logError("validate:deploy script not found in package.json");
  }

  if (packageContent.scripts && packageContent.scripts["verify:dist"]) {
    logSuccess("verify:dist script is available");
  } else {
    logWarning("verify:dist script not found");
  }
}

// 5. Validiere kritische Dateien
console.log("\n📁 Checking critical files...");

const criticalFiles = [
  "src/lib/icons/index.ts",
  "dist/index.html",
  "public/manifest.webmanifest",
  "public/sw.js",
];

criticalFiles.forEach((file) => {
  const filePath = join(rootDir, file);
  if (existsSync(filePath)) {
    logSuccess(`${file} exists`);
  } else if (file.startsWith("dist/")) {
    logInfo(`${file} missing (run 'npm run build' first)`);
  } else {
    logError(`${file} missing`);
  }
});

// 6. Environment Variables Check
console.log("\n🌍 Environment Variables Checklist...");
logInfo("The following environment variables must be set in Cloudflare Pages:");
logInfo("Production: OPENROUTER_API_KEY, VITE_OPENROUTER_API_KEY");
logInfo("Preview: OPENROUTER_API_KEY, VITE_OPENROUTER_API_KEY");
logInfo("Optional: SENTRY_AUTH_TOKEN (if using Sentry)");

// 7. Zusammenfassung
console.log("\n📊 Validation Summary:");

if (hasErrors) {
  console.error(
    `\n💥 VALIDATION FAILED: ${hasErrors ? "Critical errors found" : "Issues detected"}`,
  );
  console.error("❌ Deployment would likely fail or have broken functionality");
  console.error("\n🔧 Required fixes:");
  console.error("1. Create KV namespaces in Cloudflare Dashboard");
  console.error("2. Update wrangler.toml with real namespace IDs");
  console.error("3. Set OPENROUTER_API_KEY in Cloudflare Pages environment");
  console.error("4. Build the application (npm run build)");
  process.exit(1);
} else if (hasWarnings) {
  console.warn("\n⚠️  VALIDATION PASSED WITH WARNINGS");
  console.warn("🚀 Deployment should work but some optimizations recommended");
  process.exit(0);
} else {
  console.log("\n🎉 VALIDATION PASSED");
  console.log("✅ All critical configuration checks passed");
  console.log("🚀 Ready for deployment!");
  process.exit(0);
}
