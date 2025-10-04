#!/usr/bin/env node

/**
 * Build Info Script für Issue #81
 * Generiert Build-ID, Git-Infos und Cache-Busting für Cloudflare Pages
 */

import { execSync } from "child_process";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

function execGitCommand(command, fallback = "unknown") {
  try {
    return execSync(command, { encoding: "utf8", cwd: process.cwd() }).trim();
  } catch (error) {
    console.warn(`Git command failed: ${command}`, error.message);
    return fallback;
  }
}

function generateBuildInfo() {
  // Build timestamp
  const buildTime = new Date().toISOString();
  const buildTimestamp = Date.now().toString(36);

  const fallbackSha = `dev-${buildTimestamp}`;
  const gitShaRaw = execGitCommand("git rev-parse HEAD", fallbackSha);
  const gitSha = gitShaRaw || fallbackSha;
  const gitBranch = execGitCommand("git rev-parse --abbrev-ref HEAD", "main");
  const gitShort = gitSha.slice(0, 7);

  // Version from package.json
  let version = "2.0.0";
  try {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    version = packageJson.version || "2.0.0";
  } catch {
    console.warn("Could not read package.json version, using default");
  }

  // Build ID: v{version}-{short-sha}
  const buildId = `v${version}-${gitShort}`;

  const buildInfo = {
    VITE_BUILD_ID: buildId,
    VITE_BUILD_TIME: buildTime,
    VITE_BUILD_TIMESTAMP: buildTimestamp,
    VITE_GIT_SHA: gitSha,
    VITE_GIT_BRANCH: gitBranch,
    VITE_VERSION: version,
  };

  return buildInfo;
}

function writeBuildInfoFile(buildInfo) {
  const envContent = Object.entries(buildInfo)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // Write to .env.build for Vite to pick up
  writeFileSync(".env.build", envContent);

  // Also set in process.env for immediate use
  Object.entries(buildInfo).forEach(([key, value]) => {
    process.env[key] = value;
  });

  console.log("✅ Build info written to .env.build:");
  console.log(envContent);
}

function writeBuildInfoArtifact(buildInfo) {
  try {
    // Write build info as a JSON artifact that can be included in dist
    const buildInfoArtifact = {
      buildId: buildInfo.VITE_BUILD_ID,
      buildTime: buildInfo.VITE_BUILD_TIME,
      gitSha: buildInfo.VITE_GIT_SHA,
      gitBranch: buildInfo.VITE_GIT_BRANCH,
      version: buildInfo.VITE_VERSION,
    };

    // Create build-info.json for the app to read
    writeFileSync("build-info.json", JSON.stringify(buildInfoArtifact, null, 2));
    console.log("✅ Build info written to build-info.json");
  } catch (error) {
    console.warn("Could not write build info artifact:", error.message);
  }
}

// Main execution
console.log("🔧 Generating build info for Issue #81...");

const buildInfo = generateBuildInfo();
writeBuildInfoFile(buildInfo);
writeBuildInfoArtifact(buildInfo);

console.log(`\n🚀 Build ID: ${buildInfo.VITE_BUILD_ID}`);
console.log(`📅 Build Time: ${buildInfo.VITE_BUILD_TIME}`);
console.log(`🌿 Git Branch: ${buildInfo.VITE_GIT_BRANCH}`);
console.log(`📝 Git SHA: ${buildInfo.VITE_GIT_SHA.slice(0, 7)}`);

// Export for use in other scripts
export { generateBuildInfo };
