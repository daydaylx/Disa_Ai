import { expect, test } from "@playwright/test";

import { setupRequestInterception } from "./setup/intercept";

test.describe("Core E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Block external network requests
    await page.route("**/*", (route) => {
      const url = route.request().url();
      if (!url.includes("localhost") && !url.includes("127.0.0.1")) {
        route.abort("blockedbyclient");
      } else {
        route.continue();
      }
    });
  });

  test("Smoke: App loads", async ({ page }) => {
    await page.goto("/");

    // Wait for React app to render
    await page.waitForLoadState("networkidle");

    // App should have loaded
    await expect(page.locator("html")).toBeVisible();

    // Should have some basic UI elements
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("Offline: Basic navigation", async ({ page }) => {
    await setupRequestInterception(page, "success");
    await page.goto("/");

    await page.waitForLoadState("networkidle");

    // Should show some content
    await expect(page.locator("body")).toContainText("Disa", { timeout: 5000 });
  });
});