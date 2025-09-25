import { expect, test } from "@playwright/test";

import { clearServiceWorkerCache, setupApiMocking } from "./global-setup";

test.describe("Visual Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Clear cache and setup environment for consistent visuals
    await clearServiceWorkerCache(page);
    await setupApiMocking(page);

    // Set API key for authenticated views
    await page.addInitScript(() => {
      sessionStorage.setItem("disa:api-key", "mock-api-key-for-testing");
    });
  });

  // STRICT baselines - exact pixel matching for critical UI
  test("Chat Interface - Strict Baseline", async ({ page }) => {
    await page.goto("/"); // Root route for chat

    // Wait for complete load and composer to be ready
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000); // Allow for any animations

    // Ensure composer is visible before screenshot
    await page.getByTestId("composer-input").waitFor({ state: "visible" });

    // Chat view must match exactly
    await expect(page).toHaveScreenshot("chat-view-strict.png", {
      threshold: 0.1, // Very strict - 10% threshold
      fullPage: true,
    });
  });

  test("Settings View - Strict Baseline", async ({ page }) => {
    await page.goto("/settings"); // Direct route

    // Wait for settings to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Settings must match exactly
    await expect(page).toHaveScreenshot("settings-view-strict.png", {
      threshold: 0.1, // Very strict
      fullPage: true,
    });
  });

  test("Model Picker - Strict Baseline", async ({ page }) => {
    await page.goto("/models"); // Direct route

    // Wait for model list to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500); // Extra time for API calls

    // Model picker must match exactly
    await expect(page).toHaveScreenshot("model-picker-strict.png", {
      threshold: 0.1, // Very strict
      fullPage: true,
    });
  });

  // MODERATE baselines - more tolerance for other views
  test("Home/Landing View - Moderate Baseline", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("home-view-moderate.png", {
      threshold: 0.3, // More tolerant - 30% threshold
      fullPage: true,
    });
  });

  test("Profile/About View - Moderate Baseline", async ({ page }) => {
    await page.goto("/#/about");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("about-view-moderate.png", {
      threshold: 0.3, // More tolerant
      fullPage: true,
    });
  });

  // Component-specific visual tests
  test("Composer Component Visual Consistency", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Focus on composer component for visual testing
    const composer = page.getByTestId("composer-input");
    await composer.waitFor({ state: "visible" });

    // Test empty state and filled state
    await expect(composer).toHaveScreenshot("composer-empty.png", {
      threshold: 0.2,
    });

    // Fill and test filled state
    await composer.fill("Sample message for visual testing");
    await expect(composer).toHaveScreenshot("composer-filled.png", {
      threshold: 0.2,
    });
  });
});
