import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test.describe("Chat Composer", () => {
  test.beforeEach(async ({ page }) => {
    await setupTestEnvironment(page);
    await page.goto("/chat");
    await expect(page.getByTestId("composer-input")).toBeVisible();
  });

  test("behält eingegebene Nachricht vor dem Senden", async ({ page }) => {
    const text = "Persistente Testnachricht";
    await page.getByTestId("composer-input").fill(text);
    await expect(page.getByTestId("composer-input")).toHaveValue(text);
  });
});
