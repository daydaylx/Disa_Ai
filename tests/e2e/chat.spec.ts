import { test, expect } from "@playwright/test";
import { setupRequestInterception } from "./setup/intercept";

test.describe("Chat Smoke Tests", () => {
  test("Accessibility: Skip link navigation", async ({ page }) => {
    await page.goto("/#/");
    await page.keyboard.press("Tab");
    
    const skip = page.locator("a.skip-link");
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("Core: Message copy functionality", async ({ page }) => {
    await page.goto("/#/");
    
    await page.getByRole("button", { name: "Nachricht kopieren" }).first().click();
    await expect(page.getByText("Nachricht kopiert.")).toBeVisible();
  });
});
