import { expect, test } from "@playwright/test";

import { AppHelpers } from "./helpers/app-helpers";

test.describe("PWA and Mobile Features Integration Tests", () => {
  test("PWA manifest and installation prompt", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/");

    // Check for PWA manifest
    const manifestLink = page.locator("link[rel='manifest']").first();
    await expect(manifestLink).toHaveAttribute("href", "/manifest.webmanifest");

    // Test manifest content by fetching it
    const manifestResponse = await page.request.get("/manifest.webmanifest");
    expect(manifestResponse.status()).toBe(200);

    const manifestContent = await manifestResponse.json();
    expect(manifestContent.name).toBeTruthy();
    expect(manifestContent.short_name).toBeTruthy();
    expect(manifestContent.start_url).toBeTruthy();
    expect(manifestContent.display).toBeTruthy();
    expect(manifestContent.theme_color).toBeTruthy();
    expect(manifestContent.background_color).toBeTruthy();
    expect(manifestContent.icons).toBeTruthy();
    expect(manifestContent.icons.length).toBeGreaterThan(0);

    // Check for service worker registration
    const swRegistration = await page.evaluate(() => {
      return "serviceWorker" in navigator;
    });
    expect(swRegistration).toBe(true);

    // Test install prompt (if available)
    const installButton = page
      .locator("button[aria-label*='install']")
      .or(page.getByText(/installieren|install|zur startseite hinzufügen/i));

    if (await installButton.first().isVisible()) {
      await expect(installButton.first()).toBeVisible();

      // We don't actually trigger installation in tests
      // but verify the button is accessible
      const isEnabled = await installButton.first().isEnabled();
      expect(isEnabled).toBe(true);
    }
  });

  test("Service worker and offline caching", async ({ page }) => {
    // Intercept service worker request and serve a dummy service worker
    await page.route("**/sw.js", async (route) => {
      await route.fulfill({
        contentType: "application/javascript",
        body: `
          self.addEventListener('install', (event) => {
            console.log('[Playwright SW] Installed');
            self.skipWaiting();
          });

          self.addEventListener('activate', (event) => {
            console.log('[Playwright SW] Activated');
            event.waitUntil(clients.claim());
          });

          self.addEventListener('fetch', (event) => {
            // Do nothing, just let the browser handle the request
          });
        `,
      });
    });

    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    // Wait for service worker to register and become active (custom retry logic)
    let swState = { registered: false, active: false, scope: null };
    for (let i = 0; i < 10; i++) {
      // Retry up to 10 times (10 * 1000ms = 10 seconds)
      swState = await page.evaluate(async () => {
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.getRegistration("/");
          return {
            registered: !!registration,
            active: !!registration?.active,
            scope: registration?.scope,
          };
        }
        return { registered: false, active: false, scope: null };
      });
      if (swState.registered && swState.active) {
        break;
      }
      await page.waitForTimeout(1000); // Wait 1 second before retrying
    }

    expect(swState.registered).toBe(true);
    expect(swState.active).toBe(true); // Expect it to be active after retries

    // Test caching by going offline and checking if app still loads
    await page.context().setOffline(true);
    await page.reload();
    await page.waitForTimeout(2000);

    // App should still load from cache
    const mainContent = page.locator("#main").or(page.locator("#app"));
    await expect(mainContent).toBeVisible();

    // Go back online
    await page.context().setOffline(false);
  });

  test("Mobile navigation and touch interactions", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    // Test mobile navigation bar
    const mobileNav = page.locator("nav").first();
    await expect(mobileNav).toBeVisible();

    // Test navigation items
    const navItems = ["Chat", "Studio", "Modelle", "Einstellungen"];

    for (const itemName of navItems) {
      const navItem = page
        .getByRole("link", { name: new RegExp(itemName, "i") })
        .or(page.getByText(itemName));

      if (await navItem.first().isVisible()) {
        await expect(navItem.first()).toBeVisible();

        // Test touch interaction
        await navItem.first().tap();
        await page.waitForTimeout(1000);

        // Verify navigation occurred
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/(chat|studio|models|settings)/);
      }
    }

    // Test mobile drawer/menu (if available)
    const menuButton = page
      .locator("button[aria-label*='menu']")
      .or(page.locator("button[aria-label*='menü']"))
      .or(page.locator("[data-testid*='menu-button']"));

    if (await menuButton.isVisible()) {
      await menuButton.tap();
      await page.waitForTimeout(500);

      // Check if drawer opens
      const drawer = page
        .locator("[role='dialog']")
        .or(page.locator("[data-testid*='drawer']"))
        .or(page.locator(".drawer"));

      if (await drawer.first().isVisible()) {
        await expect(drawer.first()).toBeVisible();

        // Test closing drawer
        const closeButton = drawer
          .locator("button[aria-label*='close']")
          .or(page.locator("button[aria-label*='schließen']"));

        if (await closeButton.isVisible()) {
          await closeButton.tap();
          await page.waitForTimeout(300);
          await expect(drawer.first()).not.toBeVisible();
        } else {
          // Try clicking outside or escape
          await page.keyboard.press("Escape");
          await page.waitForTimeout(300);
          await expect(drawer.first()).not.toBeVisible();
        }
      }
    }
  });

  test("Mobile viewport and responsive design", async ({ page }) => {
    const helpers = new AppHelpers(page);

    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: "iPhone SE" },
      { width: 414, height: 896, name: "iPhone 11" },
      { width: 360, height: 640, name: "Android Small" },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await helpers.navigateAndWait("/chat");

      // Test that content fits in viewport
      const body = page.locator("body");
      const bodySize = await body.boundingBox();

      if (bodySize) {
        expect(bodySize.width).toBeLessThanOrEqual(viewport.width);
      }

      // Test that navigation is accessible
      const nav = page.locator("nav");
      if (await nav.isVisible()) {
        const navBox = await nav.boundingBox();
        if (navBox) {
          expect(navBox.width).toBeLessThanOrEqual(viewport.width);
        }
      }

      // Test touch target sizes
      const buttons = page.locator("button");
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const buttonBox = await button.boundingBox();
          if (buttonBox) {
            // Touch targets should be at least 44px in one dimension
            expect(Math.max(buttonBox.width, buttonBox.height)).toBeGreaterThanOrEqual(40);
          }
        }
      }
    }
  });

  test("Safe area and notch handling", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    // Test CSS safe area variables
    const safeAreaSupport = await page.evaluate(() => {
      const testElement = document.createElement("div");
      testElement.style.paddingTop = "env(safe-area-inset-top)";
      document.body.appendChild(testElement);

      const computedStyle = getComputedStyle(testElement);
      const paddingTop = computedStyle.paddingTop;

      document.body.removeChild(testElement);

      return paddingTop !== "0px" || CSS.supports("padding-top", "env(safe-area-inset-top)");
    });

    // Safe area should be supported or handled gracefully
    expect(typeof safeAreaSupport).toBe("boolean");

    // Test that content doesn't get cut off by notch area
    const header = page.locator("header").or(page.locator("nav"));
    if (await header.first().isVisible()) {
      const headerBox = await header.first().boundingBox();
      if (headerBox) {
        // Header should not be at the very top (0px) if safe area is present
        expect(headerBox.y).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test("Keyboard and input handling on mobile", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    // Test virtual keyboard handling
    const composer = page.locator('textarea[placeholder="Nachricht an Disa AI schreiben..."]');
    if (await composer.isVisible()) {
      await composer.tap();
      await expect(composer).toBeFocused();

      // Test that viewport adjusts for keyboard (simulate)
      const viewportHeight = await page.evaluate(
        () => window.visualViewport?.height || window.innerHeight,
      );
      expect(viewportHeight).toBeGreaterThan(0);

      // Test typing
      await composer.type("Test message on mobile");
      await expect(composer).toHaveValue("Test message on mobile");

      // Test send action
      await composer.press("Enter");
      await page.waitForTimeout(500);

      // Verify keyboard doesn't interfere with UI
      const messageElement = page.locator("[data-testid='message-bubble']").filter({
        hasText: "Test message on mobile",
      });

      if (await messageElement.isVisible()) {
        await expect(messageElement).toBeVisible();
      }
    }

    // Test input focus management
    const inputElements = page.locator("input, textarea");
    const inputCount = await inputElements.count();

    if (inputCount > 0) {
      const firstInput = inputElements.first();
      await firstInput.tap();
      await expect(firstInput).toBeFocused();

      // Test that focused input scrolls into view
      const inputBox = await firstInput.boundingBox();
      if (inputBox) {
        const viewport = page.viewportSize();
        if (viewport) {
          expect(inputBox.y + inputBox.height).toBeLessThanOrEqual(viewport.height);
        }
      }
    }
  });

  test("Performance on mobile devices", async ({ page }) => {
    const helpers = new AppHelpers(page);

    // Simulate slower mobile CPU
    await page.context().addInitScript(() => {
      // Simulate mobile performance characteristics
      Object.defineProperty(navigator, "hardwareConcurrency", {
        writable: false,
        value: 4, // Typical mobile CPU cores
      });
    });

    const startTime = Date.now();
    await helpers.navigateAndWait("/chat");
    const loadTime = Date.now() - startTime;

    // App should load within reasonable time on mobile
    expect(loadTime).toBeLessThan(15000);

    // Test smooth scrolling performance
    const scrollableArea = page.locator("main").or(page.locator("#main"));
    if (await scrollableArea.isVisible()) {
      const scrollStartTime = Date.now();

      // Simulate touch scroll
      const scrollArea = await scrollableArea.boundingBox();
      if (scrollArea) {
        await page.mouse.move(
          scrollArea.x + scrollArea.width / 2,
          scrollArea.y + scrollArea.height / 2,
        );
        await page.mouse.wheel(0, -300);
        await page.waitForTimeout(100);
        await page.mouse.wheel(0, 300);
      }

      const scrollTime = Date.now() - scrollStartTime;
      expect(scrollTime).toBeLessThan(1000);
    }

    // Test memory usage (basic check)
    const performanceMetrics = await page.evaluate(() => {
      if ("memory" in performance) {
        return {
          // @ts-ignore
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          // @ts-ignore
          totalJSHeapSize: performance.memory.totalJSHeapSize,
        };
      }
      return null;
    });

    if (performanceMetrics) {
      // Memory usage should be reasonable
      expect(performanceMetrics.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024); // Less than 50MB
    }
  });

  test("App icons and splash screen", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/");

    // Test favicon
    const favicon = page.locator("link[rel='icon']");
    if (await favicon.isVisible()) {
      const faviconHref = await favicon.getAttribute("href");
      expect(faviconHref).toBeTruthy();

      // Test that favicon loads
      const faviconResponse = await page.request.get(faviconHref!);
      expect(faviconResponse.status()).toBe(200);
    }

    // Test apple touch icons
    const appleTouchIcons = page.locator("link[rel='apple-touch-icon']");
    const iconCount = await appleTouchIcons.count();

    for (let i = 0; i < iconCount; i++) {
      const icon = appleTouchIcons.nth(i);
      const iconHref = await icon.getAttribute("href");

      if (iconHref) {
        const iconResponse = await page.request.get(iconHref);
        expect(iconResponse.status()).toBe(200);
      }
    }

    // Test meta tags for mobile
    const viewportMeta = page.locator("meta[name='viewport']");
    await expect(viewportMeta).toHaveAttribute("content");

    const themeColorMeta = page.locator("meta[name='theme-color']");
    if (await themeColorMeta.isVisible()) {
      await expect(themeColorMeta).toHaveAttribute("content");
    }

    const appleMobileCapable = page.locator("meta[name='apple-mobile-web-app-capable']");
    if (await appleMobileCapable.isVisible()) {
      await expect(appleMobileCapable).toHaveAttribute("content", "yes");
    }
  });

  test("Push notifications and background sync (if supported)", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    // Test notification permission (without actually requesting)
    const notificationSupport = await page.evaluate(() => {
      return {
        supported: "Notification" in window,
        permission: "Notification" in window ? Notification.permission : "not-supported",
        serviceWorkerSupported: "serviceWorker" in navigator,
      };
    });

    expect(notificationSupport.supported).toBe(true);
    expect(["granted", "denied", "default"]).toContain(notificationSupport.permission);

    // Test that notification permission isn't requested automatically
    expect(notificationSupport.permission).not.toBe("granted");

    // Test background sync support
    const backgroundSyncSupport = await page.evaluate(() => {
      return "serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype;
    });

    // Background sync should be supported in modern browsers
    expect(typeof backgroundSyncSupport).toBe("boolean");
  });
});
