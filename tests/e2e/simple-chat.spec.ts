import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test.describe("Composer Basics", () => {
  test("send button wird nach Texteingabe aktiv", async ({ page }) => {
    await setupTestEnvironment(page);
    await page.goto("/chat");

    // Wait for the models to be loaded
    await page.waitForResponse("**/api/v1/models");

    await expect(page.getByTestId("composer-input")).toBeVisible();

    // solange kein Text, ist das Mikrofon sichtbar und deaktiviert
    const micButton = page.getByTestId("composer-mic");
    await expect(micButton).toBeVisible();
    await expect(micButton).toBeDisabled();
    await expect(page.getByTestId("composer-send")).toHaveCount(0);

    await page.getByTestId("composer-input").fill("Testnachricht");

    const sendButton = page.getByTestId("composer-send");
    await expect(sendButton).toBeVisible();
    await expect(sendButton).toBeEnabled();
    await expect(page.getByTestId("composer-mic")).toHaveCount(0);
  });
});
