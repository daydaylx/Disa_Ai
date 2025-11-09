import { expect, test } from "@playwright/test";

import { setupApiKeyStorage, setupChatApiStreamingMock } from "./api-mock";
import { AppHelpers } from "./helpers/app-helpers";

test.describe("Chat Flow Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiKeyStorage(page);
    await setupChatApiStreamingMock(page);
  });

  test("Complete chat conversation flow", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    // Test welcome screen is visible initially
    const welcomeText = page.getByText(
      "Starte eine Unterhaltung oder nutze die Schnellstarts für wiederkehrende Aufgaben.",
    );
    await expect(welcomeText).toBeVisible();

    // Test quickstart discussion topics
    const discussionCard = page.getByRole("button", { name: "Gibt es Außerirdische?" });
    await expect(discussionCard).toBeVisible();
    await discussionCard.tap();

    // Verify message was sent and response received
    await page.waitForTimeout(1000);
    const messageList = page.locator("[data-testid='message-list']");
    await expect(messageList).toBeVisible();

    // Test manual message sending
    const composer = page.locator('textarea[placeholder="Nachricht an Disa AI schreiben..."]');
    await expect(composer).toBeVisible();

    await composer.fill("Was denkst du über künstliche Intelligenz?");
    await composer.press("Enter");

    // Verify user message appears
    const userMessage = page
      .locator("[data-testid='message-bubble']")
      .filter({ hasText: "Was denkst du über künstliche Intelligenz?" });
    await expect(userMessage).toBeVisible();

    // Verify AI response appears
    const aiResponse = page
      .locator("[data-testid='message-bubble']")
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
    const composer = page.locator('textarea[placeholder="Nachricht an Disa AI schreiben..."]');

    const messages = ["Erste Nachricht", "Zweite Nachricht", "Dritte Nachricht"];

    for (const message of messages) {
      await composer.fill(message);
      await composer.press("Enter");
      await page.waitForTimeout(500);

      // Verify each message appears
      const messageElement = page
        .locator("[data-testid='message-bubble']")
        .filter({ hasText: message });
      await expect(messageElement).toBeVisible();
    }

    // Test conversation clearing (if available)
    const menuButton = page.locator("button[aria-label*='Menü']").first();
    if (await menuButton.isVisible()) {
      await menuButton.tap();
      await page.waitForTimeout(500);

      // Look for clear/reset conversation option
      const clearOption = page.getByText("Unterhaltung löschen").or(page.getByText("Neu starten"));
      if (await clearOption.isVisible()) {
        await clearOption.tap();

        // Confirm if dialog appears
        const confirmButton = page
          .getByRole("button", { name: "Bestätigen" })
          .or(page.getByRole("button", { name: "Löschen" }));
        if (await confirmButton.isVisible()) {
          await confirmButton.tap();
        }

        // Verify conversation is cleared
        await expect(
          page.getByText(
            "Starte eine Unterhaltung oder nutze die Schnellstarts für wiederkehrende Aufgaben.",
          ),
        ).toBeVisible();
      }
    }
  });

  test("Chat composer functionality and accessibility", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    const composer = page.locator('textarea[placeholder="Nachricht an Disa AI schreiben..."]');

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
      .locator("[data-testid='message-bubble']")
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

    // Test mobile navigation
    const mobileNav = page.locator("nav").first();
    await expect(mobileNav).toBeVisible();

    // Test composer on mobile
    const composer = page.locator('textarea[placeholder="Nachricht an Disa AI schreiben..."]');
    await composer.tap();

    // Verify composer is focused and keyboard accessible
    await expect(composer).toBeFocused();

    // Test touch scrolling in message area
    const messageArea = page.locator("[data-testid='message-list']").or(page.locator("main"));

    if (await messageArea.isVisible()) {
      // Send enough messages to enable scrolling
      for (let i = 0; i < 5; i++) {
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
