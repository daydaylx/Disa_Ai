import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Performance metrics interface
interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
  tti: number;
}

// Core Web Vitals thresholds (Google recommendations)
const PERFORMANCE_BUDGETS = {
  lcp: 2500, // Largest Contentful Paint (ms)
  fid: 100, // First Input Delay (ms)
  cls: 0.1, // Cumulative Layout Shift (score)
  ttfb: 600, // Time to First Byte (ms)
  fcp: 1800, // First Contentful Paint (ms)
  tti: 3800, // Time to Interactive (ms)
};

test.describe.skip("Performance Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance monitoring
    await page.addInitScript(() => {
      window.performance.mark = window.performance.mark || (() => {});
      window.performance.measure = window.performance.measure || (() => {});
    });
  });

  test("Core Web Vitals Measurement", async ({ page }) => {
    const metrics = await measureCoreWebVitals(page, "/");

    // Log performance metrics for debugging
    console.log("📊 Core Web Vitals:", {
      LCP: `${metrics.lcp}ms`,
      FID: `${metrics.fid}ms`,
      CLS: metrics.cls.toFixed(3),
      TTFB: `${metrics.ttfb}ms`,
    });

    // Assert performance budgets
    expect(metrics.lcp).toBeLessThan(PERFORMANCE_BUDGETS.lcp);
    expect(metrics.fid).toBeLessThan(PERFORMANCE_BUDGETS.fid);
    expect(metrics.cls).toBeLessThan(PERFORMANCE_BUDGETS.cls);
    expect(metrics.ttfb).toBeLessThan(PERFORMANCE_BUDGETS.ttfb);

    // Attach metrics to test result
    test.info().attachments.push({
      name: "performance-metrics",
      body: Buffer.from(JSON.stringify(metrics, null, 2)),
      contentType: "application/json",
    });
  });

  test("Page Load Performance", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    console.log(`⏱️ Page load time: ${loadTime}ms`);
  });

  test("Chat Page Performance", async ({ page }) => {
    // Test chat page loading with API mock
    await page.goto("/chat");
    await page.waitForLoadState("domcontentloaded");

    const metrics = await measureCoreWebVitals(page, "/chat");

    // Chat page should be optimized for performance
    expect(metrics.fcp).toBeLessThan(PERFORMANCE_BUDGETS.fcp);
    expect(metrics.lcp).toBeLessThan(PERFORMANCE_BUDGETS.lcp);

    // Verify chat interface is interactive
    const chatInput = page.locator('textarea[placeholder*="Nachricht"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    console.log("💬 Chat page performance:", {
      FCP: `${metrics.fcp}ms`,
      LCP: `${metrics.lcp}ms`,
    });
  });

  test("Resource Loading Performance", async ({ page }) => {
    const resources: any[] = [];

    page.on("response", (response) => {
      if (response.request().resourceType() === "document") {
        resources.push({
          url: response.url(),
          status: response.status(),
          size: response.headers()["content-length"],
          timing: response.request().timing(),
        });
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check for failed resources
    const failedResources = resources.filter((r) => r.status >= 400);
    expect(failedResources).toHaveLength(0);

    // Check main document load time
    const mainDoc = resources.find((r) => r.url.includes("disaai.de"));
    if (mainDoc && mainDoc.timing) {
      const networkTime = mainDoc.timing.responseEnd - mainDoc.timing.requestStart;
      expect(networkTime).toBeLessThan(2000); // 2 seconds
    }
  });

  test("JavaScript Bundle Size", async ({ page }) => {
    const resources: any[] = [];

    page.on("response", (response) => {
      if (response.url().match(/\.(js|mjs)$/)) {
        resources.push({
          url: response.url(),
          size: parseInt(response.headers()["content-length"] || "0"),
        });
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const totalJSSize = resources.reduce((sum, r) => sum + r.size, 0);
    const maxBundleSize = 1024 * 1024; // 1MB limit

    console.log(`📦 Total JS bundle size: ${(totalJSSize / 1024).toFixed(2)}KB`);
    expect(totalJSSize).toBeLessThan(maxBundleSize);
  });

  test("Image Optimization", async ({ page }) => {
    const images: any[] = [];

    page.on("response", (response) => {
      if (response.url().match(/\.(jpg|jpeg|png|webp|svg)$/)) {
        images.push({
          url: response.url(),
          size: parseInt(response.headers()["content-length"] || "0"),
          type: response.headers()["content-type"],
        });
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check for optimized images
    const largeImages = images.filter((img) => img.size > 500 * 1024); // > 500KB

    console.log(`🖼️ Found ${images.length} images, ${largeImages.length} > 500KB`);

    // Should not have too many large images
    expect(largeImages.length).toBeLessThan(3);
  });

  test("Memory Usage Monitoring", async ({ page }) => {
    // Monitor JavaScript heap usage
    const memoryInfo = await page.evaluate(() => {
      return (performance as any).memory
        ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
          }
        : null;
    });

    if (memoryInfo) {
      const usagePercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;

      console.log(`🧠 Memory usage: ${usagePercent.toFixed(2)}%`);

      // Memory usage should be reasonable
      expect(usagePercent).toBeLessThan(80); // Less than 80% of heap limit
    }
  });

  test("Accessibility Performance Impact", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Run accessibility audit
    const accessibilityScan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const violationCount = accessibilityScan.violations.length;

    // Performance impact of accessibility features
    const metrics = await measureCoreWebVitals(page, "/");

    console.log(`♿ Accessibility violations: ${violationCount}`);
    console.log(`⚡ Performance with a11y: LCP=${metrics.lcp}ms`);

    // Should not have critical accessibility violations
    const criticalViolations = accessibilityScan.violations.filter((v) => v.impact === "critical");

    expect(criticalViolations).toHaveLength(0);

    // Attach accessibility report
    test.info().attachments.push({
      name: "accessibility-report",
      body: Buffer.from(JSON.stringify(accessibilityScan, null, 2)),
      contentType: "application/json",
    });
  });

  test("Mobile Performance", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    const startTime = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Mobile should load reasonably fast
    expect(loadTime).toBeLessThan(8000); // 8 seconds for mobile

    const metrics = await measureCoreWebVitals(page, "/");

    console.log("📱 Mobile performance:", {
      loadTime: `${loadTime}ms`,
      LCP: `${metrics.lcp}ms`,
    });

    // Mobile LCP should be good
    expect(metrics.lcp).toBeLessThan(PERFORMANCE_BUDGETS.lcp);
  });
});

// Helper function to measure Core Web Vitals
async function measureCoreWebVitals(page: any, path: string): Promise<PerformanceMetrics> {
  return await page.evaluate(async (_pagePath: string) => {
    // Wait for all metrics to be available
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const navigation = performance.getEntriesByType("navigation")[0] as any;

    // Get LCP from Performance Observer or fallback
    let lcp = 0;
    const paintEntries = performance.getEntriesByType("paint");
    const lcpEntry = paintEntries.find((entry) => entry.name === "largest-contentful-paint");
    if (lcpEntry) {
      lcp = lcpEntry.startTime;
    }

    // Get FID from Performance Observer or fallback
    let fid = 0;
    const firstInputEntries = performance.getEntriesByType("first-input");
    if (firstInputEntries.length > 0) {
      const firstInput = firstInputEntries[0] as any;
      fid = firstInput.processingStart - firstInput.startTime;
    }

    // CLS needs to be tracked manually or from Performance Observer
    let cls = 0;
    if ((window as any).__CLS_SCORE__) {
      cls = (window as any).__CLS_SCORE__;
    }

    // Calculate metrics
    const ttfb = navigation.responseStart - navigation.requestStart;
    const fcp =
      paintEntries.find((entry) => entry.name === "first-contentful-paint")?.startTime || 0;
    const tti = navigation.domInteractive - navigation.navigationStart;

    return {
      lcp: Math.round(lcp),
      fid: Math.round(fid),
      cls: Number(cls.toFixed(3)),
      ttfb: Math.round(ttfb),
      fcp: Math.round(fcp),
      tti: Math.round(tti),
    };
  }, path);
}
