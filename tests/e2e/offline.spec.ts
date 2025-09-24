import { expect, test } from "@playwright/test";

test.describe("Offline Indicator", () => {
  test("should show offline indicator when offline", async ({ page }) => {
    await page.goto("/");
    await page.context().setOffline(true);
    const offlineIndicator = await page.$(".fixed.bottom-24");
    expect(offlineIndicator).not.toBeNull();
  });

  test("should hide offline indicator when online", async ({ page }) => {
    await page.goto("/");
    await page.context().setOffline(true);
    await page.context().setOffline(false);
    const offlineIndicator = await page.$(".fixed.bottom-24");
    expect(offlineIndicator).toBeNull();
  });
});
