import { expect, test } from "@playwright/test";
const routes = ["/quickstart", "/models", "/settings"];
for (const route of routes) {
  test(`SPA deep link + reload: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('[data-testid="app-root"]')).toBeVisible();
    await page.reload();
    await expect(page.locator('[data-testid="app-root"]')).toBeVisible();
  });
}

test("should navigate back and forward between pages", async ({ page }) => {
  await page.goto("/models");
  await expect(page).toHaveURL(/.*models/);

  await page.goto("/settings");
  await expect(page).toHaveURL(/.*settings/);

  await page.goBack();
  await expect(page).toHaveURL(/.*models/);

  await page.goForward();
  await expect(page).toHaveURL(/.*settings/);
});
