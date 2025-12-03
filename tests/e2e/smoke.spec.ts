import { expect, test } from "@playwright/test";

import { setupApiKeyStorage, setupChatApiStreamingMock } from "./api-mock";
import { skipOnboarding } from "./utils";

test.describe("Smoke Tests", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test("App loads, shows hero, and quickstart overview", async ({ page }) => {
    // Set up API key storage to prevent NO_API_KEY error
    await setupApiKeyStorage(page);

    await page.goto("/chat", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(/disa ai/i);

    // First check for ChatStartCard (empty chat state)
    const chatStartCard = page.locator('[data-testid="chat-start-card"]').first();
    if (await chatStartCard.isVisible({ timeout: 5000 })) {
      await expect(chatStartCard).toBeVisible();

      // Check for themen button in start card
      const themenButton = page.getByRole("button", { name: /themen auswählen|choose topics/i });
      if (await themenButton.isVisible()) {
        await expect(themenButton).toBeVisible();
      }
    } else {
      // If no start card, check for message list (existing conversation)
      const messageList = page.locator('[data-testid="chat-message-list"]').first();
      await expect(messageList).toBeVisible({ timeout: 10000 });

      // If we have a message list, composer should be visible
      const composer = page.getByTestId("composer-input");
      await expect(composer).toBeVisible({ timeout: 5000 });
    }
  });

  test("Can send a message and receive a streamed response", async ({ page }) => {
    // Set up API key storage and API mock for this specific test
    await setupApiKeyStorage(page);
    await setupChatApiStreamingMock(page);

    await page.goto("/chat");

    // Wait a bit more to ensure app has fully loaded with API key
    await page.waitForTimeout(2000);

    // Check if we're in empty chat state and need to start a conversation
    const chatStartCard = page.locator('[data-testid="chat-start-card"]').first();
    if (await chatStartCard.isVisible({ timeout: 5000 })) {
      // Click any available button to start a conversation
      const anyButton = page.locator("button").first();
      if (await anyButton.isVisible()) {
        await anyButton.tap();
        await page.waitForTimeout(1000);
      }
    }

    // Now composer should be visible
    const composer = page.getByTestId("composer-input");
    await expect(composer).toBeVisible({ timeout: 10000 });

    // Type a message and send it
    await composer.fill("Hallo Welt");
    await composer.press("Enter");

    // Wait for messages to appear
    await page.waitForTimeout(2000);

    // Check for user message
    const userMessage = page
      .locator("[data-testid='message.item']")
      .filter({ hasText: "Hallo Welt" });
    await expect(userMessage).toBeVisible();

    // Check for assistant response
    const assistantMessage = page.locator("[data-testid='message.item']").filter({
      hasText: "Hallo das ist eine Test-Antwort",
    });
    await expect(assistantMessage).toBeVisible();
  });
});
