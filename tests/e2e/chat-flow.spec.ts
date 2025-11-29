import { expect, test } from "@playwright/test";

import { setupApiKeyStorage, setupChatApiStreamingMock } from "./api-mock";
import { AppHelpers } from "./helpers/app-helpers";
import { skipOnboarding } from "./utils";

test.describe("Chat Flow Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await setupApiKeyStorage(page);
    await setupChatApiStreamingMock(page);
  });

  test("Complete chat conversation flow", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    // Test new chat interface - should show ChatStartCard or message list
    const chatStartCard = page.locator('[data-testid="chat-start-card"]').first();
    const messageList = page.locator('[data-testid="chat-message-list"]').first();

    // Either start card (empty chat) or message list (with content) should be visible
    const hasStartCard = await chatStartCard.isVisible();
    const hasMessageList = await messageList.isVisible();

    if (hasStartCard) {
      // Test ChatStartCard functionality
      await expect(chatStartCard).toBeVisible();

      // Test themen button in start card area
      const themenButton = page.getByRole("button", { name: /themen auswählen|choose topics/i });
      if (await themenButton.isVisible()) {
        await themenButton.tap();
        await page.waitForTimeout(500);
      }
    } else if (hasMessageList) {
      // Already has messages, test composer
      await expect(messageList).toBeVisible();
    }

    // Test manual message sending with new composer
    const composer = page.getByTestId("composer-input");
    await expect(composer).toBeVisible();

    await composer.fill("Was denkst du über künstliche Intelligenz?");
    await composer.press("Enter");

    // Verify user message appears
    const userMessage = page
      .locator("[data-testid='message.item']")
      .filter({ hasText: "Was denkst du über künstliche Intelligenz?" });
    await expect(userMessage).toBeVisible();

    // Verify AI response appears
    const aiResponse = page
      .locator("[data-testid='message.item']")
      .filter({ hasText: "Hallo das ist eine Test-Antwort" });
    await expect(aiResponse).toBeVisible();

    // Test message operations (copy functionality)
    const copyButton = userMessage.locator("button[aria-label*='kopieren']").first();
    if (await copyButton.isVisible()) {
      await copyButton.tap();
      // Note: Clipboard API testing is limited in headless browsers
      // We just verify the button exists and is clickable
    }
  });

  test("Chat history and conversation management", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    // Send multiple messages to create history
    const composer = page.getByTestId("composer-input");

    const messages = ["Erste Nachricht", "Zweite Nachricht", "Dritte Nachricht"];

    for (const message of messages) {
      await composer.fill(message);
      await composer.press("Enter");
      await page.waitForTimeout(500);

      // Verify each message appears
      const messageElement = page
        .locator("[data-testid='message.item']")
        .filter({ hasText: message });
      await expect(messageElement).toBeVisible();
    }

    // Test conversation clearing via new chat button
    const newChatButton = page.getByRole("button", { name: /neuer chat|new chat/i });
    if (await newChatButton.isVisible()) {
      await newChatButton.tap();
      await page.waitForTimeout(500);

      // Verify new chat started
      const chatStartCard = page.locator('[data-testid="chat-start-card"]').first();
      if (await chatStartCard.isVisible()) {
        await expect(chatStartCard).toBeVisible();
      }
    }
  });

  test("Chat composer functionality and accessibility", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    const composer = page.getByTestId("composer-input");

    // Test composer accessibility
    await expect(composer).toHaveAttribute("aria-label");
    await expect(composer).toHaveAttribute("placeholder");

    // Test multiline input
    const longMessage =
      "Das ist eine sehr lange Nachricht, die mehrere Zeilen umfassen sollte, um zu testen, ob der Composer richtig mit längeren Texten umgeht.";
    await composer.fill(longMessage);

    // Verify content is preserved
    await expect(composer).toHaveValue(longMessage);

    // Test submission methods
    await composer.press("Enter");
    await page.waitForTimeout(500);

    // Verify message was sent
    const sentMessage = page
      .locator("[data-testid='message.item']")
      .filter({ hasText: longMessage });
    await expect(sentMessage).toBeVisible();

    // Verify composer is cleared after sending
    await expect(composer).toHaveValue("");

    // Test Shift+Enter for line breaks (if supported)
    await composer.fill("Erste Zeile");
    await composer.press("Shift+Enter");
    await composer.type("Zweite Zeile");

    const currentValue = await composer.inputValue();
    expect(currentValue).toContain("Erste Zeile");
    expect(currentValue).toContain("Zweite Zeile");
  });

  test("Mobile chat interface and touch interactions", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    // Test composer on mobile
    const composer = page.getByTestId("composer-input");
    await composer.tap();

    // Verify composer is focused and keyboard accessible
    await expect(composer).toBeFocused();

    // Test touch scrolling in message area
    const messageArea = page.locator('[data-testid="chat-message-list"]').first();

    if (await messageArea.isVisible()) {
      // Send enough messages to enable scrolling
      for (let i = 0; i < 3; i++) {
        await composer.fill(`Touch test message ${i + 1}`);
        await composer.press("Enter");
        await page.waitForTimeout(300);
      }

      // Test scrolling behavior
      const scrollableArea = await messageArea.boundingBox();
      if (scrollableArea) {
        // Simulate touch scroll
        await page.mouse.move(
          scrollableArea.x + scrollableArea.width / 2,
          scrollableArea.y + scrollableArea.height / 2,
        );
        await page.mouse.wheel(0, -200);
        await page.waitForTimeout(500);
        await page.mouse.wheel(0, 200);
      }
    }

    // Test accessibility of touch targets
    const touchTargets = page.locator("button, [role='button'], a, input, textarea");
    const count = await touchTargets.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const target = touchTargets.nth(i);
      if (await target.isVisible()) {
        const box = await target.boundingBox();
        if (box) {
          // Verify minimum touch target size (44px recommended)
          expect(Math.max(box.width, box.height)).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });
});
