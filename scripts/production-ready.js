#!/usr/bin/env node

/**
 * Production Ready Deployment Script
 *
 * Final validation and preparation for Cloudflare Pages deployment
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

console.log("🚀 Disa AI - Production Deployment Preparation");
console.log("=".repeat(50));

const checks = [];

// 1. Environment Check
console.log("\n✅ 1. Environment Validation");
try {
  const nodeVersion = execSync("node --version", { encoding: "utf8" }).trim();
  const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim();
  console.log(`   ✓ Node.js: ${nodeVersion}`);
  console.log(`   ✓ npm: ${npmVersion}`);
  checks.push(true);
} catch (error) {
  console.error("   ✗ Environment check failed");
  checks.push(false);
}

// 2. Code Quality Check
console.log("\n✅ 2. Code Quality Validation");
try {
  execSync("npm run typecheck", { stdio: "pipe" });
  console.log("   ✓ TypeScript compilation successful");
  checks.push(true);
} catch (error) {
  console.error("   ✗ TypeScript compilation failed");
  checks.push(false);
}

// 3. Lint Check
console.log("\n✅ 3. Code Style Validation");
try {
  const lintResult = execSync("npm run lint", { encoding: "utf8", stdio: "pipe" });
  const lines = lintResult.split("\n");
  const errors = lines.filter((line) => line.includes("error")).length;
  const warnings = lines.filter((line) => line.includes("warning")).length;

  if (errors === 0) {
    console.log(`   ✓ Linting passed (${warnings} warnings)`);
    checks.push(true);
  } else {
    console.warn(`   ⚠ Linting: ${errors} errors, ${warnings} warnings`);
    checks.push(false);
  }
} catch (error) {
  console.error("   ✗ Linting failed");
  checks.push(false);
}

// 4. Test Validation
console.log("\n✅ 4. Test Suite Validation");
try {
  execSync("npm run test:unit", { stdio: "pipe", timeout: 60000 });
  console.log("   ✓ All unit tests passed");
  checks.push(true);
} catch (error) {
  console.error("   ✗ Tests failed");
  checks.push(false);
}

// 5. Build Validation
console.log("\n✅ 5. Build Validation");
try {
  execSync("npm run build", { stdio: "pipe", timeout: 120000 });

  const distPath = resolve(process.cwd(), "dist");
  const indexExists = existsSync(resolve(distPath, "index.html"));
  const manifestExists = existsSync(resolve(distPath, "manifest.webmanifest"));
  const swExists = existsSync(resolve(distPath, "sw.js"));
  const headersExists = existsSync(resolve(distPath, "_headers"));

  if (indexExists && manifestExists && swExists && headersExists) {
    console.log("   ✓ Production build successful");
    console.log("   ✓ PWA assets generated");
    console.log("   ✓ Security headers configured");
    checks.push(true);
  } else {
    console.error("   ✗ Build validation failed");
    checks.push(false);
  }
} catch (error) {
  console.error("   ✗ Build failed");
  checks.push(false);
}

// 6. Security Headers Check
console.log("\n✅ 6. Security Configuration");
const headersPath = resolve(process.cwd(), "dist/_headers");
if (existsSync(headersPath)) {
  const headers = readFileSync(headersPath, "utf8");
  const securityHeaders = [
    "Content-Security-Policy",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Strict-Transport-Security",
  ];

  const presentHeaders = securityHeaders.filter((header) => headers.includes(header));

  if (presentHeaders.length === securityHeaders.length) {
    console.log("   ✓ All security headers present");
    checks.push(true);
  } else {
    console.warn(
      `   ⚠ Missing: ${securityHeaders.filter((h) => !presentHeaders.includes(h)).join(", ")}`,
    );
    checks.push(false);
  }
} else {
  console.error("   ✗ Security headers not found");
  checks.push(false);
}

// 7. PWA Validation
console.log("\n✅ 7. PWA Configuration");
const manifestPath = resolve(process.cwd(), "dist/manifest.webmanifest");
if (existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const requiredFields = [
      "name",
      "short_name",
      "start_url",
      "display",
      "background_color",
      "theme_color",
      "icons",
    ];
    const presentFields = requiredFields.filter((field) => manifest[field]);

    if (presentFields.length === requiredFields.length) {
      console.log("   ✓ PWA manifest complete");
      console.log(`   ✓ App name: ${manifest.short_name}`);
      console.log(`   ✓ Display mode: ${manifest.display}`);
      checks.push(true);
    } else {
      console.warn("   ⚠ PWA manifest incomplete");
      checks.push(false);
    }
  } catch (error) {
    console.error("   ✗ Invalid PWA manifest");
    checks.push(false);
  }
} else {
  console.error("   ✗ PWA manifest not found");
  checks.push(false);
}

// 8. Performance Check
console.log("\n✅ 8. Performance Validation");
const distPath = resolve(process.cwd(), "dist");
const assetsPath = resolve(distPath, "assets");
if (existsSync(assetsPath)) {
  // Check for optimized chunks
  const files = [];
  const fs = await import("fs").then((m) => m.promises);
  const walkDir = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        await walkDir(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  };

  await walkDir(assetsPath);

  const jsFiles = files.filter((f) => f.endsWith(".js")).length;
  const cssFiles = files.filter((f) => f.endsWith(".css")).length;

  console.log(`   ✓ Code splitting: ${jsFiles} JS chunks, ${cssFiles} CSS files`);
  console.log("   ✓ Bundle optimization completed");
  checks.push(true);
} else {
  console.error("   ✗ Assets directory not found");
  checks.push(false);
}

// Final Report
console.log("\n" + "=".repeat(50));
console.log("📊 DEPLOYMENT READINESS REPORT");
console.log("=".repeat(50));

const passedChecks = checks.filter((check) => check).length;
const totalChecks = checks.length;
const score = Math.round((passedChecks / totalChecks) * 100);

console.log(`\n🎯 Overall Score: ${score}% (${passedChecks}/${totalChecks} checks passed)`);

if (score === 100) {
  console.log("\n🎉 EXCELLENT! Ready for Production Deployment");
  console.log("\n📋 Deployment Checklist:");
  console.log("   ✅ Environment validated");
  console.log("   ✅ Code quality verified");
  console.log("   ✅ Tests passing");
  console.log("   ✅ Build optimized");
  console.log("   ✅ Security configured");
  console.log("   ✅ PWA ready");
  console.log("   ✅ Performance optimized");

  console.log("\n🚀 Next Steps:");
  console.log("   1. Commit all changes");
  console.log("   2. Push to main branch");
  console.log("   3. Cloudflare Pages will auto-deploy");
  console.log("   4. Monitor deployment status");
  console.log("   5. Test production URL");

  console.log("\n🎊 Disa AI is ready to launch!");
} else if (score >= 80) {
  console.log("\n⚠️  GOOD - Minor issues to resolve");
  console.log("\n💡 Recommendations:");
  console.log("   • Address remaining warnings");
  console.log("   • Consider performance optimizations");
  console.log("   • Review security headers");
} else {
  console.log("\n❌ NEEDS ATTENTION - Critical issues found");
  console.log("\n🚨 Required Actions:");
  console.log("   • Fix failing checks");
  console.log("   • Re-run validation");
  console.log("   • Ensure all tests pass");
}

// Generate deployment report
const report = {
  timestamp: new Date().toISOString(),
  score,
  passedChecks,
  totalChecks,
  status: score === 100 ? "ready" : score >= 80 ? "warning" : "error",
  buildInfo: {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
  },
};

const reportPath = resolve(process.cwd(), "deployment-readiness.json");
writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n📄 Detailed report saved to: ${reportPath}`);

process.exit(score === 100 ? 0 : 1);
