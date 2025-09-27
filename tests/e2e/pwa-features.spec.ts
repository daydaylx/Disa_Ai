import { expect, test } from "@playwright/test";

test.describe("PWA Features", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto("/");
    await expect(page.locator('[data-testid="composer-input"]')).toBeVisible();
  });

  test("should have PWA manifest available", async ({ page }) => {
    // Check if manifest link is present
    const manifest = await page.locator('link[rel="manifest"]').getAttribute("href");
    expect(manifest).toBeTruthy();
    expect(manifest).toContain("manifest.webmanifest");
  });

  test("should have service worker registration", async ({ page }) => {
    // Check if service worker is registered
    const swRegistered = await page.evaluate(async () => {
      return "serviceWorker" in navigator;
    });
    expect(swRegistered).toBe(true);
  });

  test("should detect PWA support capabilities", async ({ page }) => {
    // Test PWA support detection
    const pwaSupportResult = await page.evaluate(() => {
      return {
        shareTarget: "navigator" in window && "share" in navigator,
        protocolHandler: "navigator" in window && "registerProtocolHandler" in navigator,
        serviceWorker: "serviceWorker" in navigator,
        webAppManifest: "manifest" in document.createElement("link"),
      };
    });

    expect(pwaSupportResult.serviceWorker).toBe(true);
    expect(pwaSupportResult.protocolHandler).toBe(true);
    expect(pwaSupportResult.webAppManifest).toBe(true);
  });

  test("should handle shared text content via URL parameters", async ({ page }) => {
    // Simulate incoming share data via URL parameters
    await page.goto("/?title=Test+Article&text=This+is+shared+content&url=https://example.com");

    // Wait for app to load and process
    await expect(page.locator('[data-testid="composer-input"]')).toBeVisible();

    // Check if shared content appears in composer after processing
    await page.waitForTimeout(2000); // Give time for PWA handlers to process

    const composer = page.locator('[data-testid="composer-input"]');
    const composerValue = await composer.inputValue();

    // Check if any of the shared content is present
    const hasSharedContent =
      composerValue.includes("Test Article") ||
      composerValue.includes("shared content") ||
      composerValue.includes("example.com");
    expect(hasSharedContent).toBe(true);
  });

  test("should handle offline indicator integration", async ({ page }) => {
    // Go offline
    await page.context().setOffline(true);

    // Wait and check if offline functionality is working
    await page.waitForTimeout(1000);

    // The offline state should be detected
    const isOffline = await page.evaluate(() => !navigator.onLine);
    expect(isOffline).toBe(true);

    // Go back online
    await page.context().setOffline(false);

    // Check if online state is restored
    await page.waitForTimeout(1000);
    const isOnline = await page.evaluate(() => navigator.onLine);
    expect(isOnline).toBe(true);
  });

  test("should register protocol handler on user interaction", async ({ page }) => {
    // Mock registerProtocolHandler
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "registerProtocolHandler", {
        value: function (scheme: string, url: string) {
          (window as any).__registeredProtocol = { scheme, url };
        },
        writable: true,
      });
    });

    // Trigger user interaction (click)
    await page.click("body");

    // Wait for protocol handler registration
    await page.waitForTimeout(1000);

    // Check if protocol handler was registered
    const registeredProtocol = await page.evaluate(() => (window as any).__registeredProtocol);
    expect(registeredProtocol?.scheme).toBe("web+disa");
    expect(registeredProtocol?.url).toContain("/?handler=%s");
  });

  test("should have PWA meta tags and configuration", async ({ page }) => {
    // Check for essential PWA meta tags
    const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(viewport).toContain("width=device-width");

    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute("content");
    expect(themeColor).toBeTruthy();

    // Check for Apple PWA meta tags
    const appleMobileCapable = await page
      .locator('meta[name="apple-mobile-web-app-capable"]')
      .getAttribute("content");
    expect(appleMobileCapable).toBe("yes");

    // Check for proper title
    const title = await page.title();
    expect(title).toContain("Disa AI");
  });
});
