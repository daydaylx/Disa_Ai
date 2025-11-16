import { expect, test } from "@playwright/test";

import { setupApiKeyStorage, setupChatApiStreamingMock } from "./api-mock";

test.describe("Smoke Tests", () => {
  test("App loads, shows hero, and quickstart overview", async ({ page }) => {
    // Set up API key storage to prevent NO_API_KEY error
    await setupApiKeyStorage(page);

    await page.goto("/chat", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(/disa ai/i);

    // Wait for the composer to be visible, which indicates the chat page is ready
    const composer = page.getByTestId("composer-input");
    await expect(composer).toBeVisible({ timeout: 15000 });

    // Look for the new hero text
    const heroHeading = page.getByRole("heading", {
      name: "Was möchtest du heute mit Disa AI erledigen?",
    });
    await expect(heroHeading).toBeVisible({ timeout: 10000 });

    const heroParagraph = page.getByText(
      "Wähle einen Einstieg oder starte direkt eine Nachricht. Optimiert für Android, PWA und ruhiges, fokussiertes Arbeiten.",
    );
    await expect(heroParagraph).toBeVisible({ timeout: 10000 });

    const discussionsHeading = page.getByRole("heading", { name: "Diskussionen" });
    await expect(discussionsHeading).toBeVisible({ timeout: 10000 });

    const firstDiscussionTopic = page.getByRole("button", { name: "Gibt es Außerirdische?" });
    await expect(firstDiscussionTopic).toBeVisible({ timeout: 10000 });
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

    // Verwende den korrekten Selektor für die Nachrichtenblase
    const userMessage = page
      .locator("[data-testid='message-bubble']")
      .filter({ hasText: "Hallo Welt" });
    await expect(userMessage).toBeVisible();

    const assistantMessage = page.locator("[data-testid='message-bubble']").filter({
      hasText: "Hallo das ist eine Test-Antwort",
    });
    await expect(assistantMessage).toBeVisible();
  });
});
