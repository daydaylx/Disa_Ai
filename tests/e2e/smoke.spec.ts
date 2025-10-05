import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test.describe("Smoke Tests", () => {
  test("App loads, shows hero, and quickstart overview", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(/disa ai/i);

    const hasMain = await page.locator("#main").count();
    const target = hasMain ? page.locator("#main") : page.locator("#app");
    await expect(target).toBeVisible();

    await expect(page.getByText("Was möchtest du heute erschaffen?")).toBeVisible();
    await expect(page.locator('[data-testid^="quickstart-"]').first()).toBeVisible();
  });

  test("Can send a message and receive a streamed response", async ({ page }) => {
    // Set up complete test environment with API mocking
    await setupTestEnvironment(page);
    await page.goto("/chat");

    // Check if composer is visible
    const composer = page.locator('[data-testid="composer-input"]');
    await expect(composer).toBeVisible();

    // Type a message and send it
    await composer.fill("Hallo Welt");
    await page.locator('[data-testid="composer-send"]').click();

    // The user message should be visible
    await expect(page.getByText("Hallo Welt")).toBeVisible();

    // The stop button should appear during streaming
    const stopButton = page.locator('[data-testid="composer-stop"]');
    await expect(stopButton).toBeVisible({ timeout: 15000 });

    // The mocked response "Hallo das ist eine Test-Antwort" should be visible
    await expect(page.getByText("Hallo das ist eine Test-Antwort")).toBeVisible();

    // After streaming, the stop button should disappear
    await expect(stopButton).toBeHidden();
  });
});
