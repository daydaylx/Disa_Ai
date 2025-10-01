import { expect, test } from "@playwright/test";

test.describe("Navigation Tests", () => {
  test("loads chat landing", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Disa AI/);
    await expect(page.getByText("Was möchtest du heute erschaffen?")).toBeVisible();
  });

  test("navigates between bottom tabs", async ({ page }) => {
    await page.goto("/");

    const modelsTab = page.getByRole("link", { name: /Zu Modelle wechseln/i });
    await expect(modelsTab).toBeVisible();
    await modelsTab.click();
    await expect(page).toHaveURL(/\/models$/);

    const settingsTab = page.getByRole("link", { name: /Zu Einstellungen wechseln/i });
    await expect(settingsTab).toBeVisible();
    await settingsTab.click();
    await expect(page).toHaveURL(/\/settings$/);

    const chatTab = page.getByRole("link", { name: /Zu Chat wechseln/i });
    await expect(chatTab).toBeVisible();
    await chatTab.click();
    await expect(page).toHaveURL(/\/?$/);
  });
});
