import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test.describe("Composer Basics", () => {
  test("send button wird nach Texteingabe aktiv", async ({ page }) => {
    await setupTestEnvironment(page);
    await page.goto("/chat");

    // Wait for the models to be loaded
    await page.waitForResponse("**/api/v1/models");

    await expect(page.getByTestId("composer-input")).toBeVisible();

    // solange kein Text, ist senden deaktiviert
    await expect(page.getByTestId("composer-send")).toBeDisabled();

    await page.getByTestId("composer-input").fill("Testnachricht");
    await expect(page.getByTestId("composer-send")).toBeEnabled();
  });
});
