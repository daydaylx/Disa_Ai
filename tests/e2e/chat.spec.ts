import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test("Composer send/stop, Model-Sheet", async ({ page }) => {
  await setupTestEnvironment(page);
  await page.goto("/");
  // Composer tippen und senden
  const ta = page.locator("textarea");
  await ta.fill("Test 123");
  await page.getByRole("button", { name: "Senden" }).click();

  // Message erscheint
  await expect(page.locator("text=Test 123")).toBeVisible();

  // Model-Sheet öffnen/schließen
  await page.getByRole("button", { name: "Modell auswählen" }).click();
  await expect(page.getByRole("dialog", { name: "Modell-Auswahl" })).toBeVisible();
  await page.getByRole("button", { name: "Schließen" }).click();
});
