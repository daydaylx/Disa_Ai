#!/usr/bin/env node
import { loadEnv } from "vite";
import { resolve } from "node:path";

if (process.env.SKIP_ENV_VALIDATION === "1") {
  process.exit(0);
}

const mode = process.env.BUILD_MODE || process.env.NODE_ENV || "production";
const root = resolve(process.cwd());

const fileEnv = loadEnv(mode, root, "");
const env = { ...fileEnv, ...process.env };

const requiredFrontend = [
  {
    key: "VITE_OPENROUTER_BASE_URL",
    description: "Base URL for the OpenRouter API",
  },
  {
    key: "VITE_ENV",
    description: "Deployment environment label (production, staging, etc.)",
  },
];

const missing = requiredFrontend.filter((item) => {
  const value = env[item.key];
  return typeof value !== "string" || value.trim() === "";
});

if (missing.length > 0) {
  console.error("\n❌ Missing required environment variables for the build:");
  for (const item of missing) {
    console.error(`  - ${item.key}: ${item.description}`);
  }
  console.error("\nSet the variables in your deployment environment or a .env file.");
  console.error("You can bypass this check temporarily with SKIP_ENV_VALIDATION=1, but this is not recommended.");
  process.exit(1);
}

const sentryConfig = ["SENTRY_AUTH_TOKEN", "SENTRY_ORG", "SENTRY_PROJECT"];
const hasSentryDsn = typeof env.VITE_SENTRY_DSN === "string" && env.VITE_SENTRY_DSN.trim() !== "";
const missingSentry = sentryConfig.filter((key) => {
  const value = env[key];
  return typeof value !== "string" || value.trim() === "";
});

if (hasSentryDsn && missingSentry.length > 0) {
  console.warn("\n⚠️ Sentry DSN is configured but some build-time credentials are missing:");
  for (const key of missingSentry) {
    console.warn(`  - ${key}`);
  }
  console.warn("Sentry source map upload will be skipped until all credentials are provided.\n");
}

console.log("✅ Environment validation passed.");
