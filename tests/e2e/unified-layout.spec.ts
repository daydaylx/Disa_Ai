import { expect, test } from "@playwright/test";

import { skipOnboarding } from "./utils";

test.describe("Unified Layout Tests", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  const pages = [
    { path: "/", name: "Chat" },
    { path: "/models", name: "Models" },
    { path: "/roles", name: "Roles" },
    { path: "/settings", name: "Settings" },
    { path: "/feedback", name: "Feedback" },
  ];

  test("should have consistent header across all pages", async ({ page }) => {
    for (const { path } of pages) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // Mobile-only UI is enforced on all screen sizes (no desktop sidebar)
      // Some pages render multiple "Menü öffnen" buttons (hidden + visible). Prefer the visible one.
      await expect(page.locator('button[aria-label="Menü öffnen"]:visible').first()).toBeVisible();
      await expect(page.locator('button[aria-label="Verlauf öffnen"]')).toBeVisible();

      // Brand/logo should be present (may have multiple instances - sidebar + header)
      // Check that at least one is visible
      await expect(page.locator('[data-testid="brand-logo"]:visible').first()).toBeVisible();
    }
  });

  test("should have proper layout zones for chat page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check for header zone
    const header = page.locator("header").or(page.getByRole("banner"));
    await expect(header).toBeVisible();

    // Check for content area
    const main = page.locator("main").or(page.getByRole("main"));
    await expect(main).toBeVisible();

    // Check for input zone at bottom
    const inputArea = page.getByTestId("composer-input").locator("..").locator("..");
    await expect(inputArea).toBeVisible();

    // Verify the input is at the bottom of the viewport
    const inputBox = await inputArea.boundingBox();
    if (inputBox) {
      const viewportHeight = page.viewportSize()?.height || 0;
      // Input should be in the bottom portion of the screen
      expect(inputBox.y + inputBox.height).toBeGreaterThan(viewportHeight * 0.7);
    }
  });

  test("should have proper layout zones for non-chat pages", async ({ page }) => {
    const nonChatPages = [
      { path: "/models", name: "Models" },
      { path: "/roles", name: "Roles" },
      { path: "/settings", name: "Settings" },
    ];

    for (const { path } of nonChatPages) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // Check for page header with title
      const pageHeader = page.getByRole("heading", { level: 1 });
      await expect(pageHeader).toBeVisible();

      // Check for scrollable content area
      const main = page.locator("main").or(page.getByRole("main"));
      await expect(main).toBeVisible();

      // Should have some padding on standard pages (measure the header itself)
      const headerBox = await pageHeader.boundingBox();
      if (headerBox) {
        expect(headerBox.x).toBeGreaterThan(10);
      }
    }
  });

  test("should respect safe areas on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X dimensions

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that elements don't overlap with safe area indicators
    const header = page.locator("header").or(page.getByRole("banner"));
    const headerBox = await header.boundingBox();
    if (headerBox) {
      // Header should account for safe area at top
      expect(headerBox.y).toBeLessThan(100);
    }

    // Bottom input area should be above safe area
    const inputArea = page.getByTestId("composer-input").locator("..").locator("..");
    const inputBox = await inputArea.boundingBox();
    if (inputBox) {
      const viewportHeight = page.viewportSize()?.height || 812;
      // Input should not overflow the viewport
      expect(inputBox.y + inputBox.height).toBeLessThanOrEqual(viewportHeight + 2);
    }
  });

  test("should have consistent navigation behavior", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const menuButton = page.locator('button[aria-label="Menü öffnen"]:visible').first();

    // Navigate to different pages and check they load
    const navigationTests = [
      { linkText: "Einstellungen", expectedPath: /\/settings/ },
      { linkText: "Modelle", expectedPath: /\/models/ },
      { linkText: "Rollen", expectedPath: /\/roles/ },
    ];

    for (const { linkText, expectedPath } of navigationTests) {
      // Mobile-only UI: always use drawer navigation
      await menuButton.click();

      const menuDrawer = page.getByRole("dialog", { name: "Navigationsmenü" });
      await expect(menuDrawer).toBeVisible();

      const link = menuDrawer.getByRole("link", { name: new RegExp(`^${linkText}\\b`, "i") });
      await expect(link).toBeVisible();
      await link.click();

      await expect(page).toHaveURL(expectedPath);
      await page.waitForLoadState("networkidle");
    }
  });

  test("should maintain mobile-only layout on all screen sizes", async ({ page }) => {
    const viewports = [
      { width: 375, height: 812, name: "Mobile" },
      { width: 768, height: 1024, name: "Tablet" },
      { width: 1366, height: 768, name: "Desktop" },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Mobile-only UI enforced: always show mobile menu button (never desktop sidebar)
      await expect(page.locator('button[aria-label="Menü öffnen"]:visible').first()).toBeVisible();

      // Desktop sidebar should never be visible (mobile-only layout)
      await expect(page.locator("aside").first()).not.toBeVisible();

      await expect(page.getByTestId("composer-input")).toBeVisible();

      // Check that content is accessible without overlapping
      const input = page.getByTestId("composer-input");
      await expect(input).toBeVisible();
      await expect(input).toBeEnabled();

      // Verify phone frame constraint on desktop
      if (viewport.width >= 1024) {
        const main = page.locator("main").or(page.getByRole("main"));
        const mainBox = await main.boundingBox();
        if (mainBox) {
          // Content should be constrained to mobile width (max 430px)
          expect(mainBox.width).toBeLessThanOrEqual(450); // 430px + some tolerance
        }
      }
    }
  });

  test("should handle dark/light theme switching", async ({ page }) => {
    await page.goto("/settings/appearance");
    await page.waitForLoadState("networkidle");

    const root = page.locator("html");
    const initialTheme = await root.getAttribute("data-theme");

    const darkButton = page.getByRole("button", { name: "Dunkel" });
    const lightButton = page.getByRole("button", { name: "Hell" });
    await expect(darkButton).toBeVisible();
    await expect(lightButton).toBeVisible();

    // Prefer flipping to a different value than the initial one to make the assertion stable.
    if (initialTheme === "dark") {
      await lightButton.click();
      await expect(root).toHaveAttribute("data-theme", "light");
    } else {
      await darkButton.click();
      await expect(root).toHaveAttribute("data-theme", "dark");
    }
  });

  test("should show proper loading states", async ({ page }) => {
    // Test models page loading
    await page.goto("/models");

    // Initially might show loading state
    await page.waitForTimeout(1000);

    // Should eventually show content
    await expect(page.getByRole("heading", { level: 1, name: /Modelle/i })).toBeVisible();

    // Test roles page loading
    await page.goto("/roles");

    await page.waitForTimeout(1000);

    await expect(page.getByRole("heading", { level: 1, name: /Rollen/i })).toBeVisible();
  });

  test("should handle error states gracefully", async ({ page }) => {
    // This test would require mocking failed API calls
    // For now, just verify the pages don't crash
    const testPages = ["/models", "/roles", "/settings"];

    for (const path of testPages) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // Page should show some content, not just crash
      const bodyText = await page.locator("body").textContent();
      expect(bodyText?.length).toBeGreaterThan(100);
    }
  });
});
