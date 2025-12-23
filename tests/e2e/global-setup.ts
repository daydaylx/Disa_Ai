import type { FullConfig } from "@playwright/test";
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

  // #region agent log
  try {
    fetch("http://127.0.0.1:7242/ingest/0ae7fc31-3847-4426-952c-f3c7a5827cea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "tests/e2e/global-setup.ts:globalSetup",
        message: "E2E global setup start",
        data: {
          ci: Boolean(config.metadata?.CI),
          port: process.env.PLAYWRIGHT_PORT ?? "5173",
          baseUrl:
            process.env.PLAYWRIGHT_BASE_URL ??
            `http://localhost:${process.env.PLAYWRIGHT_PORT ?? "5173"}`,
          liveBaseUrl: process.env.LIVE_BASE_URL ?? null,
          reportDirs,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  } catch (error) {
    console.warn("Agent log failed in global-setup", error);
  }
  // #endregion

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
