#!/usr/bin/env node
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE_URL = "http://localhost:4173";
const TIMEOUT = 30000;

// Severity levels for exit codes
const SEVERITY_LEVELS = {
  minor: 1,
  moderate: 2,
  serious: 3,
  critical: 4,
};

// Color codes for console output
const colors = {
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

function log(level, message, data = "") {
  const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
  const prefix = `${colors.dim}[${timestamp}]${colors.reset}`;

  switch (level) {
    case "info":
      console.log(`${prefix} ${colors.blue}ℹ️  ${message}${colors.reset}`, data);
      break;
    case "success":
      console.log(`${prefix} ${colors.green}✅ ${message}${colors.reset}`, data);
      break;
    case "warning":
      console.log(`${prefix} ${colors.yellow}⚠️  ${message}${colors.reset}`, data);
      break;
    case "error":
      console.log(`${prefix} ${colors.red}❌ ${message}${colors.reset}`, data);
      break;
    case "critical":
      console.log(`${prefix} ${colors.red}${colors.bold}🚨 ${message}${colors.reset}`, data);
      break;
  }
}

function formatViolation(violation) {
  const severityColor = {
    minor: colors.yellow,
    moderate: colors.yellow,
    serious: colors.red,
    critical: colors.red + colors.bold,
  };

  const color = severityColor[violation.impact] || colors.reset;
  const impact = violation.impact?.toUpperCase() || "UNKNOWN";

  return `
${color}${impact}${colors.reset} - ${colors.bold}${violation.id}${colors.reset}
${violation.description}
${colors.cyan}Help:${colors.reset} ${violation.helpUrl}

${colors.dim}Affected elements:${colors.reset}
${violation.nodes.map((node) => `  • ${node.target.join(", ")}`).join("\n")}
${violation.nodes
  .map((node) =>
    node.failureSummary ? `    ${colors.dim}${node.failureSummary}${colors.reset}` : "",
  )
  .filter(Boolean)
  .join("\n")}
`;
}

async function checkPageAccessibility(page, url, pageName) {
  log("info", `Scanning ${pageName}...`);

  try {
    // Navigate to page
    await page.goto(url, { waitUntil: "networkidle", timeout: TIMEOUT });

    // Wait for any dynamic content to load
    await page.waitForTimeout(2000);

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    return {
      pageName,
      url,
      violations: accessibilityScanResults.violations,
      passes: accessibilityScanResults.passes.length,
      incomplete: accessibilityScanResults.incomplete,
      inapplicable: accessibilityScanResults.inapplicable.length,
    };
  } catch (error) {
    log("error", `Failed to scan ${pageName}: ${error.message}`);
    return {
      pageName,
      url,
      error: error.message,
      violations: [],
      passes: 0,
      incomplete: [],
      inapplicable: 0,
    };
  }
}

async function checkServerAvailability() {
  try {
    const response = await fetch(BASE_URL, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log(`${colors.bold}🔍 Accessibility Scanner${colors.reset}`);
  console.log(`${colors.dim}Testing against: ${BASE_URL}${colors.reset}\n`);

  // Check if preview server is running
  log("info", "Checking server availability...");
  const serverAvailable = await checkServerAvailability();

  if (!serverAvailable) {
    log("error", `Server not available at ${BASE_URL}`);
    log("info", "Please run: npm run preview");
    process.exit(1);
  }

  log("success", "Server is running");

  // Launch browser
  log("info", "Launching browser...");
  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });

  const context = await browser.newContext({
    // Simulate real user settings
    viewport: { width: 1280, height: 720 },
    userAgent: "Mozilla/5.0 (compatible; AccessibilityScanner/1.0)",
  });

  const page = await context.newPage();

  // Configure page for accessibility testing
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  try {
    // Test pages - extend this list as needed
    const pagesToTest = [
      { url: `${BASE_URL}/`, name: "Homepage" },
      // Add more pages as needed:
      // { url: `${BASE_URL}/settings`, name: 'Settings' },
      // { url: `${BASE_URL}/unknown-route`, name: '404 Fallback' }
    ];

    const results = [];

    for (const { url, name } of pagesToTest) {
      const result = await checkPageAccessibility(page, url, name);
      results.push(result);
    }

    // Generate report
    console.log(`\n${colors.bold}📊 Accessibility Report${colors.reset}`);
    console.log("=".repeat(50));

    let totalViolations = 0;
    let criticalIssues = 0;
    let seriousIssues = 0;
    let maxSeverity = 0;

    for (const result of results) {
      if (result.error) {
        log("error", `${result.pageName}: ${result.error}`);
        continue;
      }

      const violationCount = result.violations.length;
      totalViolations += violationCount;

      console.log(`\n${colors.bold}${result.pageName}${colors.reset} (${result.url})`);
      console.log(`${colors.green}✅ Passed:${colors.reset} ${result.passes}`);
      console.log(`${colors.red}❌ Violations:${colors.reset} ${violationCount}`);

      if (result.incomplete.length > 0) {
        console.log(
          `${colors.yellow}⚠️  Incomplete:${colors.reset} ${result.incomplete.length} (manual review needed)`,
        );
      }

      if (violationCount > 0) {
        console.log(`\n${colors.bold}Violations found:${colors.reset}`);

        // Group violations by severity
        const violationsBySeverity = result.violations.reduce((acc, v) => {
          const severity = v.impact || "unknown";
          if (!acc[severity]) acc[severity] = [];
          acc[severity].push(v);
          return acc;
        }, {});

        // Count critical and serious issues
        criticalIssues += (violationsBySeverity.critical || []).length;
        seriousIssues += (violationsBySeverity.serious || []).length;

        // Calculate max severity for exit code
        for (const violation of result.violations) {
          const severityLevel = SEVERITY_LEVELS[violation.impact] || 0;
          maxSeverity = Math.max(maxSeverity, severityLevel);
        }

        // Display violations grouped by severity
        for (const [severity, violations] of Object.entries(violationsBySeverity)) {
          console.log(
            `\n${colors.dim}${severity.toUpperCase()} (${violations.length}):${colors.reset}`,
          );
          for (const violation of violations) {
            console.log(formatViolation(violation));
          }
        }
      }
    }

    // Final summary
    console.log(`\n${colors.bold}📈 Summary${colors.reset}`);
    console.log("=".repeat(30));
    console.log(`Pages tested: ${results.length}`);
    console.log(`Total violations: ${totalViolations}`);
    console.log(`Critical issues: ${criticalIssues}`);
    console.log(`Serious issues: ${seriousIssues}`);

    // Exit with appropriate code
    if (totalViolations === 0) {
      log("success", "No accessibility violations found! 🎉");
      process.exit(0);
    } else {
      if (criticalIssues > 0) {
        log("critical", `Found ${criticalIssues} critical accessibility issues`);
      } else if (seriousIssues > 0) {
        log("error", `Found ${seriousIssues} serious accessibility issues`);
      } else {
        log("warning", "Found accessibility issues that should be addressed");
      }

      console.log(`\n${colors.cyan}💡 Next steps:${colors.reset}`);
      console.log("1. Review the violations above");
      console.log("2. Check docs/a11y-checklist.md for guidance");
      console.log("3. Test manually with keyboard navigation");
      console.log("4. Consider screen reader testing");

      // Exit with code based on most severe issue
      process.exit(Math.min(maxSeverity, 4));
    }
  } catch (error) {
    log("error", `Accessibility scan failed: ${error.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  log("info", "Shutting down...");
  process.exit(130);
});

process.on("unhandledRejection", (error) => {
  log("error", `Unhandled rejection: ${error.message}`);
  process.exit(1);
});

// Check for required dependencies
try {
  await import("@axe-core/playwright");
  await import("playwright");
} catch (error) {
  log("error", "Missing dependencies. Install with:");
  console.log("npm install --save-dev @axe-core/playwright");
  console.log("npx playwright install chromium");
  process.exit(1);
}

main().catch((error) => {
  log("error", `Script failed: ${error.message}`);
  process.exit(1);
});
