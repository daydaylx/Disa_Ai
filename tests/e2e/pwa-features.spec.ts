import { expect, test } from "@playwright/test";

const skipIf = (condition: boolean, reason: string) => {
  if (condition) {
    test.skip(reason);
  }
};

test.describe("PWA Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("composer-input")).toBeVisible();
  });

  test("Manifest-Link vorhanden (falls konfiguriert)", async ({ page }) => {
    const manifest = page.locator('link[rel="manifest"]');
    const count = await manifest.count();
    skipIf(count === 0, "Manifest nicht konfiguriert");
    expect(await manifest.first().getAttribute("href")).toContain("manifest.webmanifest");
  });

  test("Service-Worker-Unterstützung vorhanden", async ({ page }) => {
    const swRegistered = await page.evaluate(() => "serviceWorker" in navigator);
    expect(swRegistered).toBe(true);
  });

  test.skip("Weitere PWA-Features werden separat abgedeckt", () => {
    /* Legacy-Szenarien (Share Target, Protocol Handler) werden zu einem späteren Zeitpunkt reaktiviert. */
  });
});
