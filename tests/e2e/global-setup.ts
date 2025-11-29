import { FullConfig } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

export default async function globalSetup(config: FullConfig) {
  console.log("🌍 Global E2E Test Setup");

  const reportDirs = ["report/e2e", "report/visual", "test-results", "playwright-report"];

  for (const dir of reportDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  }

  // Set up performance monitoring
  if (config.metadata?.CI) {
    console.log("🚀 Running in CI environment");
  }

  // Clean up old reports (keep last 10 runs)
  const cleanupOldReports = () => {
    try {
      const reportDir = "report/e2e";
      if (fs.existsSync(reportDir)) {
        const files = fs.readdirSync(reportDir);
        const jsonFiles = files.filter((f: string) => f.endsWith(".json"));
        const sortedFiles = jsonFiles.sort().slice(0, -10);

        for (const file of sortedFiles) {
          fs.unlinkSync(path.join(reportDir, file));
        }

        if (sortedFiles.length > 0) {
          console.log(`🧹 Cleaned up ${sortedFiles.length} old report files`);
        }
      }
    } catch (error) {
      console.warn("⚠️ Could not cleanup old reports:", error);
    }
  };

  cleanupOldReports();

  return {
    setupTime: new Date().toISOString(),
    ci: config.metadata?.CI || false,
    buildId: config.metadata?.BUILD_ID || "local",
  };
}
