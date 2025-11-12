#!/usr/bin/env node

/**
 * Cloudflare Cache Purge Script
 * ==============================
 *
 * Purges Cloudflare's edge cache after deployment to ensure users
 * receive the latest version of the application.
 *
 * Usage:
 *   CF_API_TOKEN=xxx CF_ZONE_ID=yyy node tools/cf-purge.js
 *   CF_API_TOKEN=xxx CF_ZONE_ID=yyy node tools/cf-purge.js --dry-run
 *   CF_API_TOKEN=xxx CF_ZONE_ID=yyy node tools/cf-purge.js --files=/index.html,/assets/*
 *
 * Options:
 *   --dry-run       : Show what would be purged without actually purging
 *   --files=<paths> : Comma-separated list of file paths to purge
 *   --everything    : Purge everything (default behavior)
 *   --help          : Show this help message
 *
 * Environment Variables:
 *   CF_API_TOKEN : Cloudflare API token with Cache Purge permissions
 *   CF_ZONE_ID   : Cloudflare Zone ID for your domain
 *
 * Exit Codes:
 *   0 : Success
 *   1 : Missing credentials or API error
 *   2 : Invalid arguments
 */

const https = require("https");

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const showHelp = args.includes("--help") || args.includes("-h");
const purgeEverything = args.includes("--everything");

// Extract file paths if provided
let filesToPurge = null;
const filesArg = args.find((arg) => arg.startsWith("--files="));
if (filesArg) {
  const paths = filesArg.split("=")[1];
  filesToPurge = paths
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
}

// Get credentials from environment
const API_TOKEN = process.env.CF_API_TOKEN;
const ZONE_ID = process.env.CF_ZONE_ID;

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function showHelpMessage() {
  console.log(`
${colors.bold}Cloudflare Cache Purge Script${colors.reset}

${colors.cyan}Usage:${colors.reset}
  CF_API_TOKEN=xxx CF_ZONE_ID=yyy node tools/cf-purge.js [options]

${colors.cyan}Options:${colors.reset}
  --dry-run         Show what would be purged without actually purging
  --files=<paths>   Comma-separated list of file paths to purge
                    Example: --files=/index.html,/assets/*,/sw.js
  --everything      Purge everything (default behavior)
  --help, -h        Show this help message

${colors.cyan}Environment Variables:${colors.reset}
  CF_API_TOKEN      Cloudflare API token with Cache Purge permissions
  CF_ZONE_ID        Cloudflare Zone ID for your domain

${colors.cyan}Examples:${colors.reset}
  # Purge everything (default)
  CF_API_TOKEN=xxx CF_ZONE_ID=yyy node tools/cf-purge.js

  # Purge specific files
  CF_API_TOKEN=xxx CF_ZONE_ID=yyy node tools/cf-purge.js --files=/index.html,/sw.js

  # Dry run (show what would happen)
  CF_API_TOKEN=xxx CF_ZONE_ID=yyy node tools/cf-purge.js --dry-run

  # Purge critical assets after deploy
  CF_API_TOKEN=xxx CF_ZONE_ID=yyy node tools/cf-purge.js --files=/index.html,/assets/*,/sw.js

${colors.cyan}Exit Codes:${colors.reset}
  0   Success
  1   Missing credentials or API error
  2   Invalid arguments
  `);
}

function validateCredentials() {
  if (!API_TOKEN || !ZONE_ID) {
    log("❌ Error: Missing Cloudflare credentials", "red");
    log("", "reset");
    log("Please set the following environment variables:", "yellow");
    log("  CF_API_TOKEN : Your Cloudflare API token", "yellow");
    log("  CF_ZONE_ID   : Your Cloudflare Zone ID", "yellow");
    log("", "reset");
    log("You can find these in your Cloudflare dashboard:", "cyan");
    log("  1. Go to https://dash.cloudflare.com", "cyan");
    log("  2. Select your domain", "cyan");
    log("  3. Zone ID is in the right sidebar", "cyan");
    log("  4. API Token: My Profile → API Tokens → Create Token", "cyan");
    log("", "reset");
    return false;
  }
  return true;
}

function makeCloudflareRequest(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);

    const options = {
      hostname: "api.cloudflare.com",
      port: 443,
      path: `/client/v4/zones/${ZONE_ID}/purge_cache`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
        Authorization: `Bearer ${API_TOKEN}`,
      },
    };

    const req = https.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(body);
          if (response.success) {
            resolve(response);
          } else {
            reject(new Error(`API Error: ${JSON.stringify(response.errors)}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function purgeCache() {
  log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "cyan");
  log("  Cloudflare Cache Purge", "bold");
  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "cyan");
  log("");

  // Build purge payload
  let payload = {};
  let purgeDescription = "";

  if (filesToPurge && filesToPurge.length > 0) {
    payload = { files: filesToPurge };
    purgeDescription = `Specific files: ${filesToPurge.join(", ")}`;
  } else {
    payload = { purge_everything: true };
    purgeDescription = "Everything (full zone purge)";
  }

  // Show configuration
  log(`Zone ID:          ${ZONE_ID}`, "blue");
  log(`Purge Type:       ${purgeDescription}`, "blue");
  log(`Dry Run:          ${isDryRun ? "Yes" : "No"}`, "blue");
  log("");

  if (isDryRun) {
    log("🔍 Dry Run Mode - No actual purge will be performed", "yellow");
    log("");
    log("Would send the following payload:", "yellow");
    log(JSON.stringify(payload, null, 2), "cyan");
    log("");
    log("✅ Dry run completed successfully", "green");
    return;
  }

  // Confirm before purging everything
  if (purgeEverything && !isDryRun) {
    log("⚠️  Warning: You are about to purge the ENTIRE cache", "yellow");
    log("   This will affect all cached content on your domain.", "yellow");
    log("");
  }

  try {
    log("🚀 Sending purge request to Cloudflare...", "cyan");
    const response = await makeCloudflareRequest(payload);

    log("");
    log("✅ Cache purge successful!", "green");
    log("");
    log("Response:", "cyan");
    log(JSON.stringify(response, null, 2), "cyan");
    log("");
    log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "cyan");
  } catch (error) {
    log("");
    log("❌ Cache purge failed", "red");
    log("");
    log("Error details:", "red");
    log(error.message, "red");
    log("");
    log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "cyan");
    process.exit(1);
  }
}

// Main execution
async function main() {
  if (showHelp) {
    showHelpMessage();
    process.exit(0);
  }

  if (!validateCredentials()) {
    process.exit(1);
  }

  try {
    await purgeCache();
    process.exit(0);
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, "red");
    process.exit(1);
  }
}

// Run the script
main();
