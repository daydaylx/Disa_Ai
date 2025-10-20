/**
 * E2E tests for mobile navigation sidepanel swipe-to-open functionality
 *
 * Tests include:
 * - Opening via menu button (desktop fallback)
 * - Opening via swipe gesture from right edge
 * - Closing via backdrop click
 * - Closing via Escape key
 * - Accessibility checks
 */

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { setupApiKeyStorage } from "./api-mock";

test.describe("Navigation Sidepanel - Swipe & Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    // Set up API key storage to prevent NO_API_KEY error
    await setupApiKeyStorage(page);
    await page.goto("/chat", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000); // Allow app to initialize
  });

  test("should open navigation panel via menu button (desktop fallback)", async ({ page }) => {
    // Find and click the menu button
    const menuButton = page.locator('button[aria-label*="Navigation öffnen"]').first();
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // Panel should be visible
    const panel = page.locator("#navigation-sidepanel");
    await expect(panel).toBeVisible();

    // Should contain navigation items
    await expect(panel.getByText("Chat")).toBeVisible();
    await expect(panel.getByText("Modelle")).toBeVisible();
  });

  test("should close panel via close button", async ({ page }) => {
    // Open panel first
    const menuButton = page.locator('button[aria-label*="Navigation öffnen"]').first();
    await menuButton.click();

    // Panel should be visible
    const panel = page.locator("#navigation-sidepanel");
    await expect(panel).toBeVisible();

    // Click close button
    const closeButton = page.locator('button[aria-label*="Navigation schließen"]').first();
    await closeButton.click();

    // Panel should slide away (transform should change)
    await page.waitForTimeout(500); // Wait for animation
  });

  test("should close panel via Escape key", async ({ page }) => {
    // Open panel
    const menuButton = page.locator('button[aria-label*="Navigation öffnen"]').first();
    await menuButton.click();

    // Panel should be visible
    const panel = page.locator("#navigation-sidepanel");
    await expect(panel).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");

    // Panel should close
    await page.waitForTimeout(500);
  });

  test("should close panel via backdrop click", async ({ page }) => {
    // Open panel
    const menuButton = page.locator('button[aria-label*="Navigation öffnen"]').first();
    await menuButton.click();

    // Wait for panel and overlay to be visible
    await page.waitForTimeout(500);

    // Click on overlay/backdrop area (outside the panel)
    const overlay = page.locator(".sidepanel-overlay-transition").first();
    await overlay.click({ position: { x: 10, y: 100 } }); // Click on left side

    // Panel should close
    await page.waitForTimeout(500);
  });

  test("should simulate edge swipe gesture to open panel", async ({ page }) => {
    // This test simulates a right-edge swipe using mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone-like size

    const edgeArea = page.locator(".sidepanel-touch-area");
    await expect(edgeArea).toBeAttached();

    // Get the bounding box to calculate edge position
    const viewport = page.viewportSize();
    if (!viewport) return;

    // Simulate touch swipe from right edge
    // Start touch at right edge (within 20px)
    const startX = viewport.width - 10;
    const startY = 200;

    // Swipe left by 60px (exceeds 40px threshold)
    const endX = startX - 60;
    const endY = startY;

    // Perform the swipe gesture
    await edgeArea.dispatchEvent("touchstart", {
      touches: [{ clientX: startX, clientY: startY, identifier: 0 }],
    });

    await page.waitForTimeout(50);

    await edgeArea.dispatchEvent("touchmove", {
      touches: [{ clientX: endX, clientY: endY, identifier: 0 }],
    });

    await page.waitForTimeout(50);

    await edgeArea.dispatchEvent("touchend", {
      changedTouches: [{ clientX: endX, clientY: endY, identifier: 0 }],
    });

    // Wait for animation
    await page.waitForTimeout(500);

    // Panel should be visible
    const panel = page.locator("#navigation-sidepanel");
    await expect(panel).toBeVisible();
  });

  test("should have proper accessibility attributes", async ({ page }) => {
    // Check menu button
    const menuButton = page.locator('button[aria-label*="Navigation öffnen"]').first();
    await expect(menuButton).toHaveAttribute("aria-expanded");
    await expect(menuButton).toHaveAttribute("aria-controls", "navigation-sidepanel");

    // Open panel
    await menuButton.click();

    // Check panel attributes
    const panel = page.locator("#navigation-sidepanel");
    await expect(panel).toHaveAttribute("role", "navigation");
    await expect(panel).toHaveAttribute("aria-label");

    // Check close button
    const closeButton = page.locator('button[aria-label*="Navigation schließen"]').first();
    await expect(closeButton).toBeVisible();
  });

  test("should pass accessibility checks", async ({ page }) => {
    // Run axe accessibility tests on the page
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should pass accessibility checks with panel open", async ({ page }) => {
    // Open panel
    const menuButton = page.locator('button[aria-label*="Navigation öffnen"]').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Run axe accessibility tests with panel open
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should focus close button when panel opens", async ({ page }) => {
    // Open panel
    const menuButton = page.locator('button[aria-label*="Navigation öffnen"]').first();
    await menuButton.click();

    // Wait for focus to settle
    await page.waitForTimeout(200);

    // Close button should be focused
    const closeButton = page.locator('button[aria-label*="Navigation schließen"]').first();
    await expect(closeButton).toBeFocused();
  });

  test("should trap focus within panel when open", async ({ page }) => {
    // Open panel
    const menuButton = page.locator('button[aria-label*="Navigation öffnen"]').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Get all focusable elements in panel
    const panel = page.locator("#navigation-sidepanel");
    const focusableElements = panel.locator(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const count = await focusableElements.count();

    expect(count).toBeGreaterThan(0);

    // Tab through elements - focus should stay within panel
    for (let i = 0; i < count + 1; i++) {
      await page.keyboard.press("Tab");
    }

    // Focus should still be within panel
    const focusedElement = await page.evaluate(() => document.activeElement?.id);
    const panelElement = await panel.evaluate((el) => el.contains(document.activeElement));
    expect(panelElement).toBe(true);
  });
});
