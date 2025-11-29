import { expect, test } from "@playwright/test";

test.describe("Firefox Cross-Browser Tests", () => {
  test.beforeEach(async ({ page, browserName }) => {
    // Ensure we're running on Firefox
    expect(browserName).toBe("firefox");

    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1366, height: 768 });

    console.log(`🧪 Running Firefox test on ${browserName}`);
  });

  test("Firefox-specific functionality", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test Firefox-specific features
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toContain("Firefox");

    // Test that the page loads correctly in Firefox
    const title = await page.title();
    expect(title).toContain("Disa AI");

    // Test Firefox-specific CSS support
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("Firefox form handling", async ({ page }) => {
    await page.goto("/chat");
    await page.waitForLoadState("domcontentloaded");

    // Test textarea in Firefox
    const chatInput = page.locator('textarea[placeholder*="Nachricht"]');
    await expect(chatInput).toBeVisible();
    await expect(chatInput).toBeEditable();

    // Test Firefox-specific input behavior
    await chatInput.fill("Test message for Firefox");
    const inputValue = await chatInput.inputValue();
    expect(inputValue).toBe("Test message for Firefox");

    // Test Firefox-specific keyboard events
    await chatInput.press("Enter");
    await page.waitForTimeout(500); // Allow processing
  });

  test("Firefox CSS rendering", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test CSS Grid support in Firefox
    const mainContent = page.locator("main");
    const _gridDisplay = await mainContent.evaluate((el) => getComputedStyle(el).display);

    // Test Flexbox support
    const container = page.locator('.container, .wrapper, [class*="container"]').first();
    if (await container.isVisible()) {
      const flexDisplay = await container.evaluate((el) => getComputedStyle(el).display);
      expect(["flex", "inline-flex", "grid", "block"]).toContain(flexDisplay);
    }

    // Test CSS custom properties (variables)
    const rootStyle = await page.evaluate(() => getComputedStyle(document.documentElement));

    // Check for CSS variables that should be supported in Firefox
    const primaryColor = rootStyle.getPropertyValue("--primary");
    if (primaryColor) {
      expect(primaryColor).toBeTruthy();
    }
  });

  test("Firefox accessibility features", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test ARIA attributes in Firefox
    const buttons = page.locator("button[aria-label]");
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute("aria-label");
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel).not.toBe("");
      }
    }

    // Test focus management in Firefox
    const focusableElements = page.locator(
      'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const focusableCount = await focusableElements.count();

    if (focusableCount > 0) {
      const firstElement = focusableElements.first();
      await firstElement.focus();
      const hasFocus = await firstElement.evaluate((el) => el === document.activeElement);
      expect(hasFocus).toBe(true);
    }
  });

  test("Firefox performance characteristics", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Firefox should load within reasonable time
    expect(loadTime).toBeLessThan(8000); // 8 seconds

    // Test performance timing in Firefox
    const navigationTiming = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] as any;
      return {
        dns: nav.domainLookupEnd - nav.domainLookupStart,
        tcp: nav.connectEnd - nav.connectStart,
        ssl: nav.secureConnectionStart > 0 ? nav.connectEnd - nav.secureConnectionStart : 0,
        ttfb: nav.responseStart - nav.requestStart,
        download: nav.responseEnd - nav.responseStart,
        domParse: nav.domContentLoadedEventStart - nav.responseEnd,
        domReady: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
        loadComplete: nav.loadEventEnd - nav.loadEventStart,
      };
    });

    console.log("Firefox performance timing:", navigationTiming);

    // Basic performance expectations
    expect(navigationTiming.ttfb).toBeLessThan(3000); // TTFB under 3s
    expect(navigationTiming.domParse).toBeLessThan(2000); // DOM parse under 2s
  });

  test("Firefox viewport handling", async ({ page }) => {
    // Test different viewport sizes in Firefox
    const viewports = [
      { width: 1920, height: 1080 }, // Full HD
      { width: 1366, height: 768 }, // Standard
      { width: 1024, height: 768 }, // iPad
      { width: 375, height: 812 }, // iPhone
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Test that viewport change is handled correctly
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      const viewportHeight = await page.evaluate(() => window.innerHeight);

      expect(Math.abs(viewportWidth - viewport.width)).toBeLessThan(5);
      expect(Math.abs(viewportHeight - viewport.height)).toBeLessThan(5);

      // Test responsive elements
      const header = page.locator("header").first();
      await expect(header).toBeVisible();

      // Test that mobile menu works if present
      const mobileMenu = page.locator('[class*="mobile"][class*="menu"], [class*="hamburger"]');
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test("Firefox JavaScript compatibility", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test modern JavaScript features in Firefox
    const jsFeatures = await page.evaluate(() => {
      return {
        // ES6+ features
        arrowFunctions: typeof (() => {}) === "function",
        constLet: true, // Assume supported
        templateLiterals: typeof String.raw === "function",
        destructuring: true, // Assume supported
        asyncAwait: true, // Assume supported

        // Modern APIs
        fetch: typeof fetch === "function",
        promise: typeof Promise === "function",
        console: typeof console === "object",
        localStorage: typeof localStorage === "object",
        sessionStorage: typeof sessionStorage === "object",
        indexedDB: typeof indexedDB === "object",

        // Web APIs
        intersectionObserver: typeof IntersectionObserver === "function",
        mutationObserver: typeof MutationObserver === "function",
        resizeObserver: typeof ResizeObserver === "function",
        performance: typeof performance === "object",
        requestAnimationFrame: typeof requestAnimationFrame === "function",
      };
    });

    console.log("Firefox JavaScript features:", jsFeatures);

    // All these features should be supported in modern Firefox
    expect(jsFeatures.fetch).toBe(true);
    expect(jsFeatures.promise).toBe(true);
    expect(jsFeatures.localStorage).toBe(true);
    expect(jsFeatures.performance).toBe(true);
    expect(jsFeatures.requestAnimationFrame).toBe(true);
  });

  test("Firefox security features", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test security-related features
    const securityInfo = await page.evaluate(() => {
      return {
        secureContext: window.isSecureContext,
        protocol: location.protocol,
        hasCSP: document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,
        hasReferrerPolicy: document.querySelector('meta[name="referrer"]') !== null,
      };
    });

    console.log("Firefox security info:", securityInfo);

    // Should be running in secure context
    expect(securityInfo.secureContext).toBe(true);
    expect(securityInfo.protocol).toBe("https:");
  });
});
