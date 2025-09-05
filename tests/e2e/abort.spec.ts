import { test, expect } from "@playwright/test";

test("Abort: Stop verhindert Bot-Antwort", async ({ page }) => {
  await page.goto("/");

  // Ausgangszahl der Bubbles merken (eine Assi-Startnachricht)
  const bubbles = page.locator(".msg");
  const before = await bubbles.count();

  // Nachricht senden
  const input = page.getByTestId("composer-input");
  await input.fill("Bitte antworte lang …");
  await page.getByTestId("composer-send").click();

  // Sofort stoppen
  await page.getByTestId("composer-stop").click();

  // Kurze Wartezeit – es darf KEINE neue Bot-Bubble hinzukommen
  await page.waitForTimeout(900);
  const after = await bubbles.count();

  // Erwartung: nur die User-Nachricht kam dazu, keine Bot-Antwort
  expect(after).toBe(before + 1);
});
