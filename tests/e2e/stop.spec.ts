import { test, expect } from "@playwright/test";

test("Stop-Button erscheint beim Laden und wechselt zurück zu Senden", async ({ page }) => {
  await page.goto("/");
  const input = page.getByTestId("composer-input");
  await input.fill("Lange Antwort bitte …");
  await page.getByTestId("composer-send").click();

  // Während "Streaming" → Stop sichtbar
  const stop = page.getByTestId("composer-stop");
  await expect(stop).toBeVisible();

  // Stop anklicken → sollte wieder auf Senden wechseln
  await stop.click();
  await expect(page.getByTestId("composer-send")).toBeVisible();
});
