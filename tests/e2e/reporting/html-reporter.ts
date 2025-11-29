// @ts-nocheck
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test";

interface AccessibilityMetrics {
  totalViolations: number;
  criticalViolations: number;
  seriousViolations: number;
  moderateViolations: number;
  minorViolations: number;
}

interface TestMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  performanceMetrics: PerformanceMetrics;
  accessibilityMetrics: AccessibilityMetrics;
  visualRegressionMetrics: VisualRegressionMetrics;
}

interface PerformanceMetrics {
  averageLCP: number;
  averageFID: number;
  averageCLS: number;
  averageTTFB: number;
}

interface AccessibilityMetrics {
  totalViolations: number;
  criticalViolations: number;
  seriousViolations: number;
  moderateViolations: number;
  minorViolations: number;
}

interface VisualRegressionMetrics {
  totalScreenshots: number;
  failedComparisons: number;
  passedComparisons: number;
  diffImages: string[];
}

export class CustomHTMLReporter implements Reporter {
  private _config!: FullConfig;
  private suite!: Suite;
  private startTime!: number;
  private metrics: TestMetrics;
  private testResults: TestCase[] = [];

  constructor() {
    this.metrics = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      performanceMetrics: {
        averageLCP: 0,
        averageFID: 0,
        averageCLS: 0,
        averageTTFB: 0,
      },
      accessibilityMetrics: {
        totalViolations: 0,
        criticalViolations: 0,
        seriousViolations: 0,
        moderateViolations: 0,
        minorViolations: 0,
      },
      visualRegressionMetrics: {
        totalScreenshots: 0,
        failedComparisons: 0,
        passedComparisons: 0,
        diffImages: [],
      },
    };
  }

  onBegin(config: FullConfig, suite: Suite): void {
    this._config = config;
    this.suite = suite;
    this.startTime = Date.now();
    console.log("🧪 Starting E2E test suite...");
  }

  onTestBegin(test: TestCase): void {
    this.testResults.push(test);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.metrics.totalTests++;

    switch (result.status) {
      case "passed":
        this.metrics.passedTests++;
        break;
      case "failed":
        this.metrics.failedTests++;
        break;
      case "skipped":
        this.metrics.skippedTests++;
        break;
    }

    // Extract performance metrics from attachments
    const performanceAttachment = result.attachments.find(
      (a: TestResult["attachments"][0]) => a.name === "performance-metrics",
    );
    if (performanceAttachment) {
      try {
        const perfData = JSON.parse(performanceAttachment.body as string);
        this.updatePerformanceMetrics(perfData);
      } catch (e) {
        console.warn("Could not parse performance metrics:", e);
      }
    }

    // Extract accessibility metrics
    const accessibilityAttachment = result.attachments.find(
      (a: TestResult["attachments"][0]) => a.name === "accessibility-report",
    );
    if (accessibilityAttachment) {
      try {
        const a11yData = JSON.parse(accessibilityAttachment.body as string);
        this.updateAccessibilityMetrics(a11yData);
      } catch (e) {
        console.warn("Could not parse accessibility metrics:", e);
      }
    }

    // Extract visual regression metrics
    const visualAttachment = result.attachments.find(
      (a: TestResult["attachments"][0]) => a.name === "visual-regression-report",
    );
    if (visualAttachment) {
      try {
        const visualData = JSON.parse(visualAttachment.body as string);
        this.updateVisualRegressionMetrics(visualData);
      } catch (e) {
        console.warn("Could not parse visual regression metrics:", e);
      }
    }
  }

  onEnd(result: FullResult): void {
    const duration = Date.now() - this.startTime;

    console.log(`📊 Generating comprehensive test report...`);
    this.generateHTMLReport(result, duration);
    this.generateJSONReport(result, duration);
  }

  private updatePerformanceMetrics(perfData: any): void {
    if (perfData.lcp) this.metrics.performanceMetrics.averageLCP = perfData.lcp;
    if (perfData.fid) this.metrics.performanceMetrics.averageFID = perfData.fid;
    if (perfData.cls) this.metrics.performanceMetrics.averageCLS = perfData.cls;
    if (perfData.ttfb) this.metrics.performanceMetrics.averageTTFB = perfData.ttfb;
  }

  private updateAccessibilityMetrics(a11yData: any): void {
    this.metrics.accessibilityMetrics.totalViolations += a11yData.violations?.length || 0;

    if (a11yData.violations) {
      a11yData.violations.forEach((violation: any) => {
        switch (violation.impact) {
          case "critical":
            this.metrics.accessibilityMetrics.criticalViolations++;
            break;
          case "serious":
            this.metrics.accessibilityMetrics.seriousViolations++;
            break;
          case "moderate":
            this.metrics.accessibilityMetrics.moderateViolations++;
            break;
          case "minor":
            this.metrics.accessibilityMetrics.minorViolations++;
            break;
        }
      });
    }
  }

  private updateVisualRegressionMetrics(visualData: any): void {
    this.metrics.visualRegressionMetrics.totalScreenshots += visualData.totalScreenshots || 0;
    this.metrics.visualRegressionMetrics.failedComparisons += visualData.failedComparisons || 0;
    this.metrics.visualRegressionMetrics.passedComparisons += visualData.passedComparisons || 0;

    if (visualData.diffImages) {
      this.metrics.visualRegressionMetrics.diffImages.push(...visualData.diffImages);
    }
  }

  private generateHTMLReport(result: FullResult, duration: number): void {
    const reportDir = "report/e2e";
    const fs = require("fs");
    const path = require("path");

    // Ensure report directory exists
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const htmlContent = this.createHTMLContent(result, duration);
    const reportPath = path.join(reportDir, "index.html");

    fs.writeFileSync(reportPath, htmlContent);
    console.log(`📄 HTML report generated: ${reportPath}`);
  }

  private generateJSONReport(_result: FullResult, duration: number): void {
    const reportDir = "report/e2e";
    const fs = require("fs");
    const path = require("path");

    const jsonReport = {
      summary: {
        duration,
        ...this.metrics,
        successRate: ((this.metrics.passedTests / this.metrics.totalTests) * 100).toFixed(2) + "%",
      },
      tests: this.suite.allTests().map((test) => ({
        title: test.title,
        file: test.location?.file,
        line: test.location?.line,
        status: test.results.length > 0 ? test.results[test.results.length - 1].status : "unknown",
        duration: test.results.length > 0 ? test.results[test.results.length - 1].duration : 0,
        failures:
          test.results.length > 0
            ? test.results[test.results.length - 1].errors.map((e) => e.message)
            : [],
      })),
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: process.env.USER_AGENT || "Playwright",
        nodeVersion: process.version,
        platform: process.platform,
      },
    };

    const reportPath = path.join(reportDir, "test-results.json");
    fs.writeFileSync(reportPath, JSON.stringify(jsonReport, null, 2));
    console.log(`📊 JSON report generated: ${reportPath}`);
  }

  private createHTMLContent(result: FullResult, duration: number): string {
    return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E2E Test Report - Disa AI</title>
    <style>
        ${this.getReportCSS()}
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>🧪 E2E Test Report</h1>
            <div class="meta-info">
                <span class="timestamp">Erstellt: ${new Date().toLocaleString("de-DE")}</span>
                <span class="duration">Dauer: ${(duration / 1000).toFixed(1)}s</span>
                <span class="status ${result.status === "passed" ? "passed" : "failed"}">
                    ${result.status === "passed" ? "✅ Erfolgreich" : "❌ Fehlgeschlagen"}
                </span>
            </div>
        </header>

        <main class="content">
            ${this.createSummarySection()}
            ${this.createTestResultsSection()}
            ${this.createPerformanceSection()}
            ${this.createAccessibilitySection()}
            ${this.createVisualRegressionSection()}
            ${this.createDetailedTestSection()}
        </main>

        <footer class="footer">
            <p>Generated by Custom Playwright HTML Reporter</p>
        </footer>
    </div>

    <script>
        ${this.getReportJavaScript()}
    </script>
</body>
</html>`;
  }

  private createSummarySection(): string {
    const passedRate = ((this.metrics.passedTests / this.metrics.totalTests) * 100).toFixed(1);
    const failedRate = ((this.metrics.failedTests / this.metrics.totalTests) * 100).toFixed(1);
    const skippedRate = ((this.metrics.skippedTests / this.metrics.totalTests) * 100).toFixed(1);

    return `
<section class="summary">
    <h2>📊 Testübersicht</h2>
    <div class="metrics-grid">
        <div class="metric-card total">
            <div class="metric-value">${this.metrics.totalTests}</div>
            <div class="metric-label">Gesamt</div>
        </div>
        <div class="metric-card passed">
            <div class="metric-value">${this.metrics.passedTests}</div>
            <div class="metric-label">Bestanden</div>
            <div class="metric-percentage">${passedRate}%</div>
        </div>
        <div class="metric-card failed">
            <div class="metric-value">${this.metrics.failedTests}</div>
            <div class="metric-label">Fehlgeschlagen</div>
            <div class="metric-percentage">${failedRate}%</div>
        </div>
        <div class="metric-card skipped">
            <div class="metric-value">${this.metrics.skippedTests}</div>
            <div class="metric-label">Übersprungen</div>
            <div class="metric-percentage">${skippedRate}%</div>
        </div>
    </div>

    <div class="progress-bar">
        <div class="progress-fill passed" style="width: ${passedRate}%"></div>
        <div class="progress-fill failed" style="width: ${failedRate}%"></div>
        <div class="progress-fill skipped" style="width: ${skippedRate}%"></div>
    </div>
</section>`;
  }

  private createTestResultsSection(): string {
    const failedTests = this.suite
      .allTests()
      .filter(
        (test: TestCase) =>
          test.results.length > 0 && test.results[test.results.length - 1].status === "failed",
      );

    if (failedTests.length === 0) {
      return `
<section class="test-results">
    <h2>✅ Alle Tests Bestanden</h2>
    <p>Glückwunsch! Alle E2E-Tests haben erfolgreich abgeschlossen.</p>
</section>`;
    }

    return `
<section class="test-results">
    <h2>❌ Fehlgeschlagene Tests</h2>
    <div class="failed-tests">
        ${failedTests
          .map(
            (test: TestCase) => `
        <div class="failed-test">
            <h3>${test.title}</h3>
            <p class="test-file">${test.location?.file}:${test.location?.line}</p>
            <div class="failure-details">
                ${test.results[test.results.length - 1].errors
                  .map(
                    (error: TestResult["errors"][number]) => `
                    <div class="error">
                        <h4>Fehler:</h4>
                        <pre>${error.message}</pre>
                        ${error.stack ? `<details><summary>Stack Trace</summary><pre>${error.stack}</pre></details>` : ""}
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
        `,
          )
          .join("")}
    </div>
</section>`;
  }

  private createPerformanceSection(): string {
    const { averageLCP, averageFID, averageCLS, averageTTFB } = this.metrics.performanceMetrics;

    return `
<section class="performance">
    <h2>⚡ Performance-Metriken</h2>
    <div class="performance-metrics">
        <div class="metric">
            <div class="metric-label">Largest Contentful Paint (LCP)</div>
            <div class="metric-value ${averageLCP > 2500 ? "warning" : "good"}">
                ${averageLCP.toFixed(0)}ms
            </div>
        </div>
        <div class="metric">
            <div class="metric-label">First Input Delay (FID)</div>
            <div class="metric-value ${averageFID > 100 ? "warning" : "good"}">
                ${averageFID.toFixed(0)}ms
            </div>
        </div>
        <div class="metric">
            <div class="metric-label">Cumulative Layout Shift (CLS)</div>
            <div class="metric-value ${averageCLS > 0.1 ? "warning" : "good"}">
                ${averageCLS.toFixed(3)}
            </div>
        </div>
        <div class="metric">
            <div class="metric-label">Time to First Byte (TTFB)</div>
            <div class="metric-value ${averageTTFB > 600 ? "warning" : "good"}">
                ${averageTTFB.toFixed(0)}ms
            </div>
        </div>
    </div>
</section>`;
  }

  private createAccessibilitySection(): string {
    const {
      totalViolations,
      criticalViolations,
      seriousViolations,
      moderateViolations,
      minorViolations,
    } = this.metrics.accessibilityMetrics;

    return `
<section class="accessibility">
    <h2>♿ Accessibility-Metriken</h2>
    <div class="a11y-summary">
        <div class="total-violations">
            <h3>Gesamt: ${totalViolations} Verstöße</h3>
        </div>
        <div class="violations-breakdown">
            <div class="violation critical">Kritisch: ${criticalViolations}</div>
            <div class="violation serious">Ernsthaft: ${seriousViolations}</div>
            <div class="violation moderate">Mäßig: ${moderateViolations}</div>
            <div class="violation minor">Gering: ${minorViolations}</div>
        </div>
    </div>

    ${
      totalViolations > 0
        ? `
    <div class="violations-list">
        <h4>Verletzungen nach Schweregrad:</h4>
        <div class="violation-critical">
            <h5>🔴 Kritische Verletzungen</h5>
            <p>${criticalViolations} Elemente erfordern sofortige Behebung</p>
        </div>
        <div class="violation-serious">
            <h5>🟠 Ernsthafte Verletzungen</h5>
            <p>${seriousViolations} Elemente sollten priorisiert werden</p>
        </div>
        <div class="violation-moderate">
            <h5>🟡 Moderate Verletzungen</h5>
            <p>${moderateViolations} Elemente sollten verbessert werden</p>
        </div>
        <div class="violation-minor">
            <h5>🟢 Geringe Verletzungen</h5>
            <p>${minorViolations} Elemente geringer Priorität</p>
        </div>
    </div>
    `
        : `
    <div class="a11y-success">
        <h4>🎉 Keine Accessibility-Verletzungen!</h4>
        <p>Die Anwendung erfüllt alle WCAG 2.2 AA-Anforderungen.</p>
    </div>
    `
    }
</section>`;
  }

  private createVisualRegressionSection(): string {
    const { totalScreenshots, failedComparisons, passedComparisons, diffImages } =
      this.metrics.visualRegressionMetrics;
    const successRate =
      totalScreenshots > 0 ? ((passedComparisons / totalScreenshots) * 100).toFixed(1) : 0;

    return `
<section class="visual-regression">
    <h2>🖼️ Visual Regression Tests</h2>
    <div class="visual-summary">
        <div class="metric">
            <div class="metric-label">Gesamt Screenshots</div>
            <div class="metric-value">${totalScreenshots}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Bestanden</div>
            <div class="metric-value passed">${passedComparisons}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Fehlgeschlagen</div>
            <div class="metric-value failed">${failedComparisons}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Erfolgsquote</div>
            <div class="metric-value">${successRate}%</div>
        </div>
    </div>

    ${
      diffImages.length > 0
        ? `
    <div class="diff-images">
        <h3>🔍 Unterschiede entdeckt:</h3>
        <div class="diff-grid">
            ${diffImages
              .map(
                (img) => `
                <div class="diff-image">
                    <img src="${img}" alt="Visual diff" />
                    <p>${img.split("/").pop()}</p>
                </div>
            `,
              )
              .join("")}
        </div>
    </div>
    `
        : ""
    }
</section>`;
  }

  private createDetailedTestSection(): string {
    return `
<section class="detailed-tests">
    <h2>📋 Detaillierte Testergebnisse</h2>
    <div class="test-table-container">
        <table class="test-table">
            <thead>
                <tr>
                    <th>Test</th>
                    <th>Status</th>
                    <th>Dauer</th>
                    <th>Datei</th>
                </tr>
            </thead>
            <tbody>
                ${this.suite
                  .allTests()
                  .map((test: TestCase) => {
                    const result = test.results[test.results.length - 1];
                    const status = result?.status || "unknown";
                    const duration = result?.duration || 0;

                    return `
                    <tr class="test-row ${status}">
                        <td class="test-name">${test.title}</td>
                        <td class="test-status">
                            <span class="status-badge ${status}">
                                ${this.getStatusIcon(status)} ${status.toUpperCase()}
                            </span>
                        </td>
                        <td class="test-duration">${duration}ms</td>
                        <td class="test-file">${test.location?.file.split("/").pop()}:${test.location?.line}</td>
                    </tr>
                    `;
                  })
                  .join("")}
            </tbody>
        </table>
    </div>
</section>`;
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case "passed":
        return "✅";
      case "failed":
        return "❌";
      case "skipped":
        return "⏭️";
      default:
        return "❓";
    }
  }

  private getReportCSS(): string {
    return `
        :root {
            --primary: #007bff;
            --success: #28a745;
            --warning: #ffc107;
            --danger: #dc3545;
            --info: #17a2b8;
            --dark: #343a40;
            --light: #f8f9fa;
            --text: #212529;
            --border: #dee2e6;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text);
            background-color: #fff;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .header {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--border);
        }

        .header h1 {
            color: var(--primary);
            margin-bottom: 1rem;
        }

        .meta-info {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .meta-info span {
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            background-color: var(--light);
            font-size: 0.9rem;
        }

        .status.passed {
            background-color: var(--success);
            color: white;
        }

        .status.failed {
            background-color: var(--danger);
            color: white;
        }

        .content {
            display: grid;
            gap: 2rem;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .metric-card {
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid var(--border);
            text-align: center;
        }

        .metric-card.total {
            background-color: var(--light);
        }

        .metric-card.passed {
            background-color: #d4edda;
            border-color: var(--success);
        }

        .metric-card.failed {
            background-color: #f8d7da;
            border-color: var(--danger);
        }

        .metric-card.skipped {
            background-color: #fff3cd;
            border-color: var(--warning);
        }

        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }

        .metric-label {
            font-size: 0.9rem;
            color: #666;
        }

        .metric-percentage {
            font-size: 0.8rem;
            color: #888;
        }

        .progress-bar {
            height: 8px;
            background-color: var(--light);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 2rem;
        }

        .progress-fill {
            height: 100%;
            float: left;
        }

        .progress-fill.passed {
            background-color: var(--success);
        }

        .progress-fill.failed {
            background-color: var(--danger);
        }

        .progress-fill.skipped {
            background-color: var(--warning);
        }

        .performance-metrics,
        .visual-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .metric {
            padding: 1rem;
            border: 1px solid var(--border);
            border-radius: 4px;
            text-align: center;
        }

        .metric-label {
            font-size: 0.8rem;
            color: #666;
            margin-bottom: 0.5rem;
        }

        .metric-value {
            font-size: 1.2rem;
            font-weight: bold;
        }

        .metric-value.good {
            color: var(--success);
        }

        .metric-value.warning {
            color: var(--warning);
        }

        .metric-value.failed {
            color: var(--danger);
        }

        .failed-tests {
            space-y: 1rem;
        }

        .failed-test {
            border: 1px solid var(--danger);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .failed-test h3 {
            color: var(--danger);
            margin-bottom: 0.5rem;
        }

        .test-file {
            font-family: monospace;
            background-color: var(--light);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.9rem;
        }

        .error {
            margin-top: 1rem;
            padding: 1rem;
            background-color: #fff5f5;
            border-left: 4px solid var(--danger);
        }

        .error h4 {
            margin-bottom: 0.5rem;
        }

        .error pre {
            background-color: white;
            padding: 0.75rem;
            border-radius: 4px;
            font-size: 0.8rem;
            overflow-x: auto;
        }

        .violations-breakdown {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .violation {
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-weight: bold;
        }

        .violation.critical {
            background-color: #ffe6e6;
            color: #dc3545;
        }

        .violation.serious {
            background-color: #fff3cd;
            color: #856404;
        }

        .violation.moderate {
            background-color: #e7f3ff;
            color: #0c5460;
        }

        .violation.minor {
            background-color: #f8f9fa;
            color: #495057;
        }

        .diff-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }

        .diff-image {
            text-align: center;
        }

        .diff-image img {
            max-width: 100%;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .test-table-container {
            overflow-x: auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .test-table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
        }

        .test-table th,
        .test-table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }

        .test-table th {
            background-color: var(--light);
            font-weight: 600;
        }

        .test-row.passed {
            background-color: #f8fff9;
        }

        .test-row.failed {
            background-color: #fff8f8;
        }

        .test-row.skipped {
            background-color: #fffbf0;
        }

        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
        }

        .status-badge.passed {
            background-color: var(--success);
            color: white;
        }

        .status-badge.failed {
            background-color: var(--danger);
            color: white;
        }

        .status-badge.skipped {
            background-color: var(--warning);
            color: #212529;
        }

        .footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border);
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }

            .meta-info {
                flex-direction: column;
                gap: 0.5rem;
            }

            .metrics-grid {
                grid-template-columns: 1fr;
            }

            .violations-breakdown {
                grid-template-columns: 1fr;
            }

            .diff-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
  }

  private getReportJavaScript(): string {
    return `
        // Add interactivity to the report
        document.addEventListener('DOMContentLoaded', function() {
            // Add click handlers for error details
            const errorDetails = document.querySelectorAll('.error details');
            errorDetails.forEach(details => {
                const summary = details.querySelector('summary');
                if (summary) {
                    summary.addEventListener('click', function(e) {
                        e.preventDefault();
                        details.open = !details.open;
                    });
                }
            });

            // Add sorting to test table
            const testTable = document.querySelector('.test-table');
            if (testTable) {
                const headers = testTable.querySelectorAll('thead th');
                headers.forEach(header => {
                    if (header.textContent !== 'Test') return;

                    header.style.cursor = 'pointer';
                    header.addEventListener('click', function() {
                        const table = this.closest('table');
                        const tbody = table.querySelector('tbody');
                        const rows = Array.from(tbody.querySelectorAll('tr'));

                        rows.sort((a, b) => {
                            const aText = a.querySelector('.test-name').textContent;
                            const bText = b.querySelector('.test-name').textContent;
                            return aText.localeCompare(bText);
                        });

                        tbody.innerHTML = '';
                        rows.forEach(row => tbody.appendChild(row));
                    });
                });
            }
        });
    `;
  }
}
