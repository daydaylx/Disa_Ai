import { expect, test } from "@playwright/test";

test.describe("Mobile safe-area", () => {
  test("composer and nav avoid overlap on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/chat");

    const composerInput = page.locator('[data-testid="composer-input"]');
    const nav = page.locator('nav[aria-label="Hauptnavigation"]');

    await expect(composerInput).toBeVisible();
    await expect(nav).toBeVisible();

    const metrics = await page.evaluate(() => {
      const composer = document.querySelector('[data-testid="composer-input"]');
      const navigation = document.querySelector('nav[aria-label="Hauptnavigation"]');
      if (!composer || !navigation) {
        return null;
      }
      const composerRect = composer.getBoundingClientRect();
      const navRect = navigation.getBoundingClientRect();
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      return {
        composerBottom: composerRect.bottom,
        navTop: navRect.top,
        composerVisible: composerRect.bottom > 0 && composerRect.top < viewport.height,
        navVisible: navRect.bottom > 0 && navRect.top < viewport.height,
        viewport,
      };
    });

    expect(metrics).not.toBeNull();
    if (metrics) {
      // Ensure both composer and navigation are visible and within viewport
      expect(metrics.composerVisible).toBe(true);
      expect(metrics.navVisible).toBe(true);
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 2,
    );
    expect(overflow).toBeFalsy();
  });
});
