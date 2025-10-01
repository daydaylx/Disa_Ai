import { expect, test } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("App loads and shows hero", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(/disa ai/i);

    const hasMain = await page.locator("#main").count();
    const target = hasMain ? page.locator("#main") : page.locator("#app");
    await expect(target).toBeVisible();

    await expect(page.getByText("Was möchtest du heute erschaffen?")).toBeVisible();
    await expect(page.getByText("Willkommen zurück")).toBeVisible();
  });

  test("App loads quickstart overview", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(/disa ai/i);

    await expect(page.locator('[data-testid^="quickstart-"]').first()).toBeVisible();
    await expect(page.getByText("Kurzantwort verfassen")).toBeVisible();
  });
});
