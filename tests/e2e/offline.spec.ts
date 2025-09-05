import { test, expect } from "@playwright/test";

test("Offline-Banner erscheint im Offline-Modus", async ({ page }) => {
  await page.goto("/");
  await page.context().setOffline(true);
  // Ein wenig Zeit geben, damit der Event feuert
  await page.waitForTimeout(100);
  await expect(page.getByText("Offline – Eingaben werden gepuffert")).toBeVisible();
  await page.context().setOffline(false);
});
