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
    for (const { path, name } of pages) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // Check for consistent header elements
      await expect(page.locator('button[aria-label="Menü öffnen"]')).toBeVisible();
      await expect(page.locator('button[aria-label="Verlauf öffnen"]')).toBeVisible();

      // Brand/logo should be present
      const brandElement = page.getByText("Disa AI").or(page.locator('[data-testid="brand-logo"]'));
      await expect(brandElement).toBeVisible();
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

      // Should have padding on standard pages
      const mainElement = main.first();
      const mainBox = await mainElement.boundingBox();
      if (mainBox) {
        // Should have some padding from the left edge
        expect(mainBox.x).toBeGreaterThan(10);
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
      // Input should not be at the very bottom accounting for safe area
      expect(inputBox.y + inputBox.height).toBeLessThan(viewportHeight - 10);
    }
  });

  test("should have consistent navigation behavior", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Open main menu
    const menuButton = page.locator('button[aria-label="Menü öffnen"]');
    await menuButton.click();

    const menuDrawer = page.getByRole("dialog", { name: "Navigationsmenü" });
    await expect(menuDrawer).toBeVisible();

    // Navigate to different pages and check they load
    const navigationTests = [
      { linkText: "Einstellungen", expectedPath: /\/settings/ },
      { linkText: "Modelle", expectedPath: /\/models/ },
      { linkText: "Rollen", expectedPath: /\/roles/ },
    ];

    for (const { linkText, expectedPath } of navigationTests) {
      const link = menuDrawer.getByRole("link", { name: linkText });
      await expect(link).toBeVisible();
      await link.click();

      await expect(page).toHaveURL(expectedPath);
      await page.waitForLoadState("networkidle");

      // Reopen menu for next iteration if not on first page
      if (linkText !== "Einstellungen") {
        await menuButton.click();
        await expect(menuDrawer).toBeVisible();
      }
    }
  });

  test("should maintain responsive layout on different screen sizes", async ({ page }) => {
    const viewports = [
      { width: 375, height: 812, name: "Mobile" },
      { width: 768, height: 1024, name: "Tablet" },
      { width: 1366, height: 768, name: "Desktop" },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Check that key elements are visible and properly positioned
      await expect(page.locator('button[aria-label="Menü öffnen"]')).toBeVisible();
      await expect(page.getByTestId("composer-input")).toBeVisible();

      // Check that content is accessible without overlapping
      const input = page.getByTestId("composer-input");
      await expect(input).toBeVisible();
      await expect(input).toBeEnabled();
    }
  });

  test("should handle dark/light theme switching", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    // Look for theme toggle (implementation dependent)
    const themeToggle = page
      .getByRole("switch", { name: /Dark|Light|Theme/i })
      .or(page.getByRole("button", { name: /Dark|Light|Theme/i }));

    if (await themeToggle.isVisible()) {
      // Get initial state
      const initialState = await themeToggle.getAttribute("aria-checked");

      // Toggle theme
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Check that state changed (optional, as implementation may vary)
      const newState = await themeToggle.getAttribute("aria-checked");
      expect(newState).not.toBe(initialState);
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
