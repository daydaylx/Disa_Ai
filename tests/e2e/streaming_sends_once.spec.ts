import { expect, test } from "@playwright/test";

test.describe("Streaming stability", () => {
  test("prevents double send and aborts cleanly on navigation", async ({ page }) => {
    await page.goto("/#/chat");

    const composer = page.locator('[data-testid="composer-input"]');
    await composer.fill("Streaming Test – einmal senden");

    const sendButton = page.locator('[data-testid="composer-send"]');
    await sendButton.click();

    const stopButton = page.locator('[data-testid="composer-stop"]');
    await expect(stopButton).toBeVisible();
    await expect(sendButton).toBeHidden();

    // Enter should not trigger another send while streaming
    await page.keyboard.press("Enter");
    await expect(
      page.locator(".chat-bubble", { hasText: "Streaming Test – einmal senden" }),
    ).toHaveCount(1);

    // Navigating away should abort the stream and hide the stop button
    // Force click on navigation to bypass composer interference
    await page.locator('[data-testid="nav-bottom-models"]').click({ force: true });
    await stopButton.waitFor({ state: "detached" });

    // Return to chat and ensure composer is ready again
    await page.locator('[data-testid="nav-bottom-chat"]').click({ force: true });
    await expect(page.locator('[data-testid="composer-send"]')).toBeVisible();
  });
});
