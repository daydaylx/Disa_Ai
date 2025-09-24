#!/usr/bin/env node
import { spawn } from "child_process";
import { mkdir, access, readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const reportsDir = join(projectRoot, "reports");

async function ensureReportsDir() {
  try {
    await access(reportsDir);
  } catch {
    await mkdir(reportsDir, { recursive: true });
    console.log("📁 Created reports/ directory");
  }
}

async function runViteBuild() {
  console.log("🔄 Running Vite build with bundle analysis...");

  return new Promise((resolve, reject) => {
    // Use vite-bundle-analyzer which is already installed
    const env = {
      ...process.env,
      ANALYZE: "true", // Enable bundle analyzer
      ANALYZE_OPTS: JSON.stringify({
        analyzerMode: "static",
        openAnalyzer: false,
        reportFilename: join(reportsDir, "bundle-report.html"),
        logLevel: "info",
      }),
    };

    const child = spawn("npm", ["run", "build"], {
      cwd: projectRoot,
      stdio: "inherit",
      env,
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Build completed successfully");
        resolve();
      } else {
        reject(new Error(`Build failed with exit code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(new Error(`Build process error: ${error.message}`));
    });
  });
}

async function generateBundleStats() {
  console.log("📊 Generating bundle statistics...");

  const distDir = join(projectRoot, "dist");
  const assetsDir = join(distDir, "assets");

  try {
    const files = await readdir(assetsDir);
    const jsFiles = files.filter((f) => f.endsWith(".js"));
    const cssFiles = files.filter((f) => f.endsWith(".css"));

    console.log("\n📈 Bundle Summary:");
    console.log(`   JavaScript chunks: ${jsFiles.length}`);
    console.log(`   CSS files: ${cssFiles.length}`);
    console.log(`   Total assets: ${files.length}`);

    // Show largest files for quick overview
    const { stat } = await import("fs/promises");
    const fileStats = await Promise.all(
      files.slice(0, 10).map(async (file) => {
        try {
          const stats = await stat(join(assetsDir, file));
          return { name: file, size: stats.size };
        } catch {
          return { name: file, size: 0 };
        }
      }),
    );

    fileStats.sort((a, b) => b.size - a.size);

    console.log("\n📦 Largest files:");
    fileStats.slice(0, 5).forEach(({ name, size }) => {
      const sizeKB = (size / 1024).toFixed(1);
      console.log(`   ${name}: ${sizeKB} KB`);
    });
  } catch (error) {
    console.warn("⚠️  Could not analyze bundle files:", error.message);
  }
}

async function findReportFile() {
  const possiblePaths = [
    join(reportsDir, "bundle-report.html"),
    join(projectRoot, "dist", "stats.html"),
    join(projectRoot, "stats.html"),
    join(projectRoot, "bundle-report.html"),
  ];

  for (const path of possiblePaths) {
    try {
      await access(path);
      return path;
    } catch {
      continue;
    }
  }

  return null;
}

async function main() {
  console.log("🚀 Bundle Analysis Tool\n");

  try {
    await ensureReportsDir();
    await runViteBuild();
    await generateBundleStats();

    const reportPath = await findReportFile();

    if (reportPath) {
      const relativePath = reportPath.replace(process.cwd() + "/", "");
      console.log("\n🎉 Bundle analysis complete!");
      console.log(`📊 Report available at: ${relativePath}`);
      console.log(`🌐 Open in browser: file://${reportPath}`);
    } else {
      console.log("\n⚠️  Bundle report not found at expected locations.");
      console.log("💡 Try checking dist/ directory for generated files.");

      // List dist directory contents as fallback
      try {
        const distFiles = await readdir(join(projectRoot, "dist"));
        console.log("\n📁 Files in dist/:");
        distFiles.forEach((file) => console.log(`   ${file}`));
      } catch (error) {
        console.log("❌ Could not list dist/ directory:", error.message);
      }
    }
  } catch (error) {
    console.error("💥 Bundle analysis failed:", error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("💥 Unexpected error:", error);
  process.exit(1);
});
