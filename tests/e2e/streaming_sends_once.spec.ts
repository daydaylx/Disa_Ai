import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test.describe("Streaming stability", () => {
  test.skip("prevents double send and aborts cleanly on navigation", async ({ page }) => {
    // Set up complete test environment
    await setupTestEnvironment(page);
    await page.goto("/chat");

    const composer = page.locator('[data-testid="composer-input"]');
    await composer.fill("Streaming Test – einmal senden");

    await page.locator('[data-testid="composer-send"]').click();

    // Wait a moment for the streaming state to be set
    await page.waitForTimeout(100);

    const stopButton = page.locator('[data-testid="composer-stop"]');
    await expect(stopButton).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="composer-send"]')).toBeHidden();

    // Enter should not trigger another send while streaming
    await page.keyboard.press("Enter");
    await expect(
      page.locator(".chat-bubble", { hasText: "Streaming Test – einmal senden" }),
    ).toHaveCount(1);

    // Navigating away should abort the stream and hide the stop button
    // Force click on navigation to bypass composer interference
    await page.getByTestId("nav.models").click({ force: true });
    await stopButton.waitFor({ state: "detached" });

    // Return to chat and ensure composer is ready again
    await page.getByTestId("nav.chat").click({ force: true });
    await expect(page.locator('[data-testid="composer-mic"]')).toBeVisible();
  });
});
