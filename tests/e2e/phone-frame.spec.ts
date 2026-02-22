import { expect, test } from "@playwright/test";

import { skipOnboarding } from "./utils";

test.describe("Phone Frame - Mobile UI on Desktop", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test("should enforce mobile-only layout on desktop viewport", async ({ page }) => {
    // Set large desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Mobile UI should be visible (menu button, not sidebar)
    const menuButton = page.locator('button[aria-label="Menü öffnen"]:visible').first();
    await expect(menuButton).toBeVisible();

    // Desktop sidebar should NOT be visible
    const sidebar = page.locator("aside").first();
    await expect(sidebar).not.toBeVisible();

    // Phone frame wrapper should exist
    const phoneFrameWrapper = page.locator(".phone-frame-wrapper");
    await expect(phoneFrameWrapper).toBeVisible();

    // Content container should be constrained to mobile width
    const phoneFrameContent = page.locator(".phone-frame-content");
    await expect(phoneFrameContent).toBeVisible();

    const contentBox = await phoneFrameContent.boundingBox();
    if (contentBox) {
      // Width should be at most 430px (iPhone 14 Pro Max)
      expect(contentBox.width).toBe(430);
    }
  });

  test("should center phone frame on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const phoneFrameContent = page.locator(".phone-frame-content");
    const contentBox = await phoneFrameContent.boundingBox();

    if (contentBox) {
      const viewportWidth = 1440;
      const centerOffset = (viewportWidth - contentBox.width) / 2;

      // Content should be roughly centered (allow 20px tolerance)
      expect(Math.abs(contentBox.x - centerOffset)).toBeLessThan(20);
    }
  });

  test("should maintain single scroll container (no double scroll)", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto("/models");
    await page.waitForLoadState("networkidle");

    // Check that body doesn't have overflow-y scroll
    const bodyOverflowY = await page.locator("body").evaluate((el) => {
      return window.getComputedStyle(el).overflowY;
    });

    // Body should not be scrollable (content scrolls within phone frame)
    expect(bodyOverflowY).not.toBe("scroll");

    // Phone frame content should prevent double scroll (inner containers handle scrolling)
    const phoneFrameContent = page.locator(".phone-frame-content");
    const contentOverflowY = await phoneFrameContent.evaluate((el) => {
      return window.getComputedStyle(el).overflowY;
    });

    // Phone frame itself has overflow hidden to prevent double scroll
    // Inner containers (like chat messages list) handle their own scrolling
    expect(contentOverflowY).toBe("hidden");
  });

  test("should not show multi-column grids on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Test pages that previously had multi-column layouts
    const pagesWithGrids = [
      { path: "/models", selector: '[data-testid="models-grid"]' },
      { path: "/roles", selector: '[data-testid="roles-grid"]' },
      { path: "/themen", selector: ".grid" },
    ];

    for (const { path, selector } of pagesWithGrids) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);

      // Check if a content grid exists inside the main page area
      // (exclude shell elements like bottom navigation)
      const mainArea = page.locator("main");
      const grid = mainArea.locator(selector).first();
      const gridCount = await mainArea.locator(selector).count();

      if (gridCount > 0) {
        // Grid should exist but use single column (mobile layout)
        const gridColumns = await grid.evaluate((el) => {
          return window.getComputedStyle(el).gridTemplateColumns;
        });

        // Should be single column (e.g., "1fr" or similar, not "1fr 1fr")
        const columnCount = gridColumns.split(" ").filter((s) => s !== "").length;
        expect(columnCount).toBeLessThanOrEqual(1);
      }
    }
  });

  test("should handle modals and dialogs within phone frame", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Open menu drawer (modal)
    const menuButton = page.locator('button[aria-label="Menü öffnen"]:visible').first();
    await menuButton.click();

    const menuDrawer = page.getByRole("dialog", { name: "Navigationsmenü" });
    await expect(menuDrawer).toBeVisible();

    // Modal should not overflow phone frame boundaries
    const drawerBox = await menuDrawer.boundingBox();
    const phoneFrameContent = page.locator(".phone-frame-content");
    const contentBox = await phoneFrameContent.boundingBox();

    if (drawerBox && contentBox) {
      // Drawer should be within or equal to phone frame width
      expect(drawerBox.width).toBeLessThanOrEqual(contentBox.width + 10); // +10px tolerance
    }
  });

  test("should maintain mobile viewport on tablet size", async ({ page }) => {
    // Tablet viewport that would normally trigger md: breakpoint
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should still show mobile UI (not tablet multi-column)
    const menuButton = page.locator('button[aria-label="Menü öffnen"]:visible').first();
    await expect(menuButton).toBeVisible();

    // No desktop sidebar
    await expect(page.locator("aside").first()).not.toBeVisible();
  });

  test("should preserve touch interactions on mobile devices", async ({ page }) => {
    // Real mobile viewport
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12 Pro

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Phone frame should be full width on actual mobile
    const phoneFrameContent = page.locator(".phone-frame-content");
    const contentBox = await phoneFrameContent.boundingBox();

    if (contentBox) {
      // On mobile, should use full viewport width (within 10px tolerance)
      expect(contentBox.width).toBe(390);
    }

    // Touch elements should be accessible
    await expect(page.getByTestId("composer-input")).toBeVisible();
    await expect(page.getByTestId("composer-input")).toBeEnabled();
  });
});
