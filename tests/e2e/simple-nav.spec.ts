import { expect, test } from "@playwright/test";

test("should navigate to the chat page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Disa AI/);
});
