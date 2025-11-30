import { expect, test } from "@playwright/test";

import { setupApiKeyStorage, setupChatApiStreamingMock } from "./api-mock";
import { AppHelpers } from "./helpers/app-helpers";
import { skipOnboarding } from "./utils";

test.describe("Chat Smoke", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await setupApiKeyStorage(page);
    await setupChatApiStreamingMock(page);
  });

  test("Hero lädt und Nachrichtenfluss funktioniert", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");
    await helpers.verifyChatInterface();

    await expect(page.getByText("Dein digitales Notizbuch für Gespräche.")).toBeVisible();

    const composer = page.getByTestId("composer-input");
    await composer.fill("Hallo Welt");
    await composer.press("Enter");

    const messageItems = page
      .getByTestId("virtualized-chat-log")
      .locator("[data-testid='message.item']");
    await expect(
      messageItems.filter({ hasText: "Hallo Welt" }).first(),
      "User Nachricht taucht auf",
    ).toBeVisible();
    await expect(
      messageItems.filter({ hasText: "Hallo das ist eine Test-Antwort" }).first(),
      "Streaming-Antwort sichtbar",
    ).toBeVisible();

    await expect(page.locator(".fallback-content")).toHaveCount(0);
  });
});
