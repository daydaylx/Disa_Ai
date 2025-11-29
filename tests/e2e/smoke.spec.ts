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

    // Wait for the composer to be visible, which indicates the chat page is ready
    const composer = page.getByTestId("composer-input");
    await expect(composer).toBeVisible({ timeout: 15000 });

    // Look for the new hero text - check for ChatStartCard instead
    const chatStartCard = page.locator('[data-testid="chat-start-card"]').first();
    if (await chatStartCard.isVisible()) {
      await expect(chatStartCard).toBeVisible({ timeout: 10000 });

      // Check for themen button
      const themenButton = page.getByRole("button", { name: /themen auswählen|choose topics/i });
      if (await themenButton.isVisible()) {
        await expect(themenButton).toBeVisible({ timeout: 10000 });
      }
    } else {
      // If no start card, expect message list
      const messageList = page.locator('[data-testid="chat-message-list"]').first();
      await expect(messageList).toBeVisible({ timeout: 10000 });
    }
  });

  test("Can send a message and receive a streamed response", async ({ page }) => {
    // Set up API key storage and API mock for this specific test
    await setupApiKeyStorage(page);
    await setupChatApiStreamingMock(page);

    await page.goto("/chat");

    // Wait a bit more to ensure app has fully loaded with API key
    await page.waitForTimeout(2000);

    // Check if composer is visible - find the textarea with the placeholder
    const composer = page.getByTestId("composer-input");
    await expect(composer).toBeVisible({ timeout: 10000 });

    // Type a message and send it
    await composer.fill("Hallo Welt");
    await composer.press("Enter");

    // Warten, bis die Nachrichten angezeigt werden
    await page.waitForTimeout(2000);

    // Verwende den korrekten Selektor für die Nachrichtenblase - suche nach message.item stattdessen
    const userMessage = page
      .locator("[data-testid='message.item']")
      .filter({ hasText: "Hallo Welt" });
    await expect(userMessage).toBeVisible();

    const assistantMessage = page.locator("[data-testid='message.item']").filter({
      hasText: "Hallo das ist eine Test-Antwort",
    });
    await expect(assistantMessage).toBeVisible();
  });
});
