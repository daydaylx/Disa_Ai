import { expect, test } from "@playwright/test";

test.describe("UI-V2 smoke", () => {
  test("welcome page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Willkommen")).toBeVisible();
  });

  test("settings page loads", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByText("Settings")).toBeVisible();
  });

  test("chat route guard redirects when no key", async ({ page }) => {
    // Session ohne Key
    await page.context().clearCookies();
    await page.goto("/chat");
    await expect(page).toHaveURL(/\/settings/);
  });
});
