import { expect, test } from "@playwright/test";

import { setupApiKeyStorage, setupChatApiStreamingMock } from "./api-mock";

test.describe("Smoke Tests", () => {
  test("App loads, shows hero, and quickstart overview", async ({ page }) => {
    // Set up API key storage to prevent NO_API_KEY error
    await setupApiKeyStorage(page);

    await page.goto("/chat", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(/disa ai/i);

    const hasMain = await page.locator("#main").count();
    const target = hasMain ? page.locator("#main") : page.locator("#app");
    await expect(target).toBeVisible();

    // Wait a bit more to ensure app has fully loaded
    await page.waitForTimeout(2000);

    // Look for the actual text shown when there are no messages
    const heroTextLocator = page.getByText(
      "Starte eine Unterhaltung oder nutze die Schnellstarts für wiederkehrende Aufgaben.",
    );
    await expect(heroTextLocator).toBeVisible({ timeout: 10000 });

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
    const composer = page.locator('textarea[placeholder="Nachricht an Disa AI schreiben..."]');
    await expect(composer).toBeVisible({ timeout: 10000 });

    // Type a message and send it
    await composer.fill("Hallo Welt");
    await composer.press("Enter");

    const userMessage = page.getByRole("article").filter({ hasText: "Hallo Welt" });
    await expect(userMessage).toBeVisible();

    const assistantMessage = page.getByRole("article").filter({
      hasText: "Hallo das ist eine Test-Antwort",
    });
    await expect(assistantMessage).toBeVisible();
  });
});
