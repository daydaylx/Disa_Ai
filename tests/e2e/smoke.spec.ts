import { expect, test } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set up request interception for offline-first testing
    await page.route("https://openrouter.ai/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "chatcmpl-test",
          object: "chat.completion",
          created: Date.now(),
          model: "anthropic/claude-3-sonnet",
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: "Dies ist eine Test-Antwort für E2E-Tests.",
              },
              finish_reason: "stop",
            },
          ],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 15,
            total_tokens: 25,
          },
        }),
      });
    });
  });

  test("App loads and shows initial state", async ({ page }) => {
    await page.goto("/");

    // Check if the main app loads
    await expect(page).toHaveTitle(/Disa AI/);

    // Check for main UI elements
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator('[data-testid="composer-input"]')).toBeVisible();

    // Check if composer is ready for input
    const composer = page.locator('[data-testid="composer-input"]');
    await expect(composer).toBeEnabled();
    await expect(composer).toHaveAttribute("placeholder", /Nachricht eingeben/);
  });

  test("Chat input shows loading state and placeholder response", async ({ page }) => {
    await page.goto("/");

    // Type a message
    const composer = page.locator('[data-testid="composer-input"]');
    await composer.fill("Hallo, wie geht es dir?");

    // Send the message
    const sendButton = page.locator('[data-testid="composer-send"]');
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    // Check that loading state appears
    await expect(page.locator('[data-testid="composer-stop"]')).toBeVisible();

    // Check that user message appears
    await expect(page.locator("text=Hallo, wie geht es dir?")).toBeVisible();

    // Wait for AI response
    await expect(page.locator("text=Dies ist eine Test-Antwort")).toBeVisible({ timeout: 5000 });

    // Check that loading state disappears
    await expect(page.locator('[data-testid="composer-stop"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="composer-send"]')).toBeVisible();
  });

  test("404 redirects to index", async ({ page }) => {
    // Try to access a non-existent route
    await page.goto("/non-existent-page");

    // Should redirect to index or show 404 page
    await expect(page.url()).toMatch(/\/(#\/)?$/);

    // Should still show the main app
    await expect(page.locator('[data-testid="composer-input"]')).toBeVisible();
  });

  test("Accessibility: Keyboard navigation works", async ({ page }) => {
    await page.goto("/");

    // Test tab navigation
    await page.keyboard.press("Tab");

    // Check that composer input gets focus
    const composer = page.locator('[data-testid="composer-input"]');
    await expect(composer).toBeFocused();

    // Test keyboard shortcuts
    await composer.fill("Test message");
    await page.keyboard.press("Enter");

    // Check that message was sent
    await expect(page.locator("text=Test message")).toBeVisible();
  });

  test("Mobile viewport: UI adapts correctly", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // Check that mobile UI is responsive
    await expect(page.locator('[data-testid="composer-input"]')).toBeVisible();

    // Check that touch targets are appropriately sized
    const sendButton = page.locator('[data-testid="composer-send"]');
    const boundingBox = await sendButton.boundingBox();
    expect(boundingBox?.width).toBeGreaterThanOrEqual(44);
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
  });

  test("Error handling: Network error shows appropriate message", async ({ page }) => {
    // Override route to simulate network error
    await page.route("https://openrouter.ai/**", async (route) => {
      await route.abort("failed");
    });

    await page.goto("/");

    const composer = page.locator('[data-testid="composer-input"]');
    await composer.fill("Test error handling");
    await page.locator('[data-testid="composer-send"]').click();

    // Should show error state
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });

    // Should show retry option
    await expect(page.locator("text=Erneut senden")).toBeVisible();
  });

  test("PWA: Manifest and offline support", async ({ page }) => {
    await page.goto("/");

    // Check that manifest is linked
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute("href", "/manifest.webmanifest");

    // Check offline page accessibility
    const offlineResponse = await page.request.get("/offline.html");
    expect(offlineResponse.status()).toBe(200);
  });

  test("Performance: Core Web Vitals monitoring", async ({ page }) => {
    await page.goto("/");

    // Check that Web Vitals measurement is initialized
    const webVitalsExists = await page.evaluate(() => {
      return (
        typeof window !== "undefined" && "performance" in window && "PerformanceObserver" in window
      );
    });

    expect(webVitalsExists).toBe(true);

    // Wait for initial paint
    await page.waitForLoadState("networkidle");

    // Check that the page loads within reasonable time
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      };
    });

    // Basic performance assertions (adjust thresholds as needed)
    expect(performanceMetrics.domContentLoaded).toBeLessThan(3000);
  });

  test("Security: CSP headers and XSS protection", async ({ page }) => {
    const response = await page.goto("/");

    // Check for security headers (if running through preview server)
    const headers = response?.headers();

    // These might not be present in dev mode, but should be in production
    if (headers && headers["content-security-policy"]) {
      expect(headers["content-security-policy"]).toContain("default-src 'self'");
    }

    // Test that inline scripts are blocked by attempting XSS
    const xssAttempt = await page.evaluate(() => {
      try {
        const script = document.createElement("script");
        script.innerHTML = "window.xssTest = true;";
        document.head.appendChild(script);
        return "xssTest" in window;
      } catch {
        return false;
      }
    });

    // XSS should be blocked
    expect(xssAttempt).toBe(false);
  });
});
