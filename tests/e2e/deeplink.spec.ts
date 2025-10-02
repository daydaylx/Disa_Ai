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
