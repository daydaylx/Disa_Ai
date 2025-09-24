import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test("should enable send button when model is loaded", async ({ page }) => {
  await setupTestEnvironment(page);
  await page.waitForTimeout(5000);
  await expect(page.getByRole("button", { name: "Senden" })).toBeEnabled();
});
