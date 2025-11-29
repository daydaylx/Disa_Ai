import { FullConfig } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

export default async function globalTeardown(config: FullConfig) {
  console.log("🛑 Global E2E Test Teardown");

  try {
    // Create a summary of test results
    const summaryData = {
      teardownTime: new Date().toISOString(),
      ci: config.metadata?.CI || false,
      buildId: config.metadata?.BUILD_ID || "local",
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };

    const summaryPath = path.join("report/e2e", `teardown-summary-${Date.now()}.json`);
    fs.writeFileSync(summaryPath, JSON.stringify(summaryData, null, 2));

    console.log(`📋 Teardown summary saved to: ${summaryPath}`);

    // Clean up temporary files
    if (config.metadata?.CI) {
      // Remove large files in CI to save space
      const cleanupDirs = ["test-results", "playwright-report"];

      for (const dir of cleanupDirs) {
        if (fs.existsSync(dir)) {
          try {
            const files = fs.readdirSync(dir);
            let cleanedFiles = 0;

            for (const file of files) {
              const filePath = path.join(dir, file);
              const stats = fs.statSync(filePath);

              // Remove files older than 1 hour in CI
              if (Date.now() - stats.mtime.getTime() > 3600000) {
                if (stats.isDirectory()) {
                  fs.rmSync(filePath, { recursive: true, force: true });
                } else {
                  fs.unlinkSync(filePath);
                }
                cleanedFiles++;
              }
            }

            if (cleanedFiles > 0) {
              console.log(`🧹 Cleaned up ${cleanedFiles} old files from ${dir}`);
            }
          } catch (error) {
            console.warn(`⚠️ Could not cleanup ${dir}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Global teardown failed:", error);
  }
}
