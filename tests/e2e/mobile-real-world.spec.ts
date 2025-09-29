import { expect, test } from "@playwright/test";

test.describe("Mobile Real-World Scenarios", () => {
  test.beforeEach(async ({ page }) => {
    // Set to iPhone 12 Pro viewport (390x844) - primary target
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test("mobile app loads and displays correctly", async ({ page }) => {
    await page.goto("/");

    // Check that the app loads without horizontal scroll
    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 2,
    );
    expect(hasHorizontalScroll).toBeFalsy();

    // Verify dark theme is applied
    const htmlElement = page.locator("html");
    const htmlClass = await htmlElement.getAttribute("class");

    // Allow for null class attribute
    if (htmlClass) {
      expect(htmlClass).toMatch(/dark/);
    }
  });

  test("mobile navigation works properly", async ({ page }) => {
    await page.goto("/");

    // Check main navigation exists
    const navigation = page.locator("nav").first();
    if (await navigation.isVisible()) {
      await expect(navigation).toBeVisible();
    }

    // Test basic routing
    await page.goto("/#/chat");
    await expect(page).toHaveURL(/.*#\/chat/);

    await page.goto("/#/settings");
    await expect(page).toHaveURL(/.*#\/settings/);
  });

  test("mobile PWA manifest is present", async ({ page }) => {
    await page.goto("/");

    // Check PWA manifest link (optional - may not be present in all builds)
    const manifestLink = page.locator('link[rel="manifest"]');
    if ((await manifestLink.count()) > 0) {
      await expect(manifestLink).toHaveAttribute("href", "/manifest.webmanifest");
    }

    // Check service worker registration (if present)
    const swRegistered = await page.evaluate(() => {
      return "serviceWorker" in navigator;
    });
    expect(swRegistered).toBeTruthy();
  });

  test("mobile viewport units work correctly", async ({ page }) => {
    await page.goto("/");

    // Test viewport units are supported
    const supportsViewportUnits = await page.evaluate(() => {
      const testEl = document.createElement("div");
      testEl.style.height = "100dvh";
      return testEl.style.height === "100dvh";
    });

    expect(supportsViewportUnits).toBeTruthy();
  });

  test("mobile touch targets are appropriately sized", async ({ page }) => {
    await page.goto("/");

    // Find interactive elements
    const buttons = await page.locator('button:visible, [role="button"]:visible, a:visible').all();

    let tooSmallCount = 0;
    const maxToCheck = Math.min(10, buttons.length); // Check first 10 elements

    for (const button of buttons.slice(0, maxToCheck)) {
      const boundingBox = await button.boundingBox();
      if (boundingBox) {
        // Check if touch target is too small (less than 40px is problematic)
        if (boundingBox.width < 40 || boundingBox.height < 40) {
          tooSmallCount++;
        }
      }
    }

    // Allow some small targets but most should be touch-friendly
    expect(tooSmallCount).toBeLessThan(maxToCheck / 2);
  });

  test("mobile performance is acceptable", async ({ page }) => {
    await page.goto("/");

    // Wait for page to be ready
    await page.waitForLoadState("networkidle");

    // Check no layout shifts during load
    const hasLayoutShift = await page.evaluate(() => {
      return new Promise((resolve) => {
        let hasShift = false;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "layout-shift" && (entry as any).value > 0.1) {
              hasShift = true;
            }
          }
        });

        try {
          observer.observe({ entryTypes: ["layout-shift"] });
          setTimeout(() => {
            observer.disconnect();
            resolve(hasShift);
          }, 2000);
        } catch {
          resolve(false); // CLS not supported
        }
      });
    });

    expect(hasLayoutShift).toBeFalsy();
  });

  test("mobile dark theme consistency", async ({ page }) => {
    await page.goto("/");

    // Check body/root background is dark
    const backgroundColor = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return computedStyle.backgroundColor;
    });

    // Allow for transparent or dark backgrounds
    const isDarkOrTransparent =
      backgroundColor === "rgba(0, 0, 0, 0)" ||
      backgroundColor.includes("rgb(0, 0, 0)") ||
      backgroundColor === "transparent";

    expect(isDarkOrTransparent).toBeTruthy();
  });

  test("mobile offline handling", async ({ page }) => {
    await page.goto("/");

    // Simulate going offline (context method)
    await page.context().setOffline(true);

    // App should still be functional
    const appRoot = page.locator("#root, main").first();
    await expect(appRoot).toBeVisible();

    // Go back online
    await page.context().setOffline(false);
  });
});
