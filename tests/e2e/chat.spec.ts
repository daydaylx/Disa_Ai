import { expect, test } from "@playwright/test";

test.describe("Chat Core Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Block external network requests
    await page.route("**/*", (route) => {
      const url = route.request().url();
      if (!url.includes("localhost") && !url.includes("127.0.0.1")) {
        route.abort("blockedbyclient");
      } else {
        route.continue();
      }
    });
  });

  test("Accessibility: Skip link navigation", async ({ page }) => {
    await page.goto("/#/");
    await page.keyboard.press("Tab");

    const skip = page.locator("a.skip-link");
    await expect(skip).toBeVisible({ timeout: 2000 });
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("Core: Message copy functionality", async ({ page }) => {
    await page.goto("/#/");

    await page.getByRole("button", { name: "Nachricht kopieren" }).first().click();
    await expect(page.getByText("Nachricht kopiert.")).toBeVisible({ timeout: 2000 });
  });
});
