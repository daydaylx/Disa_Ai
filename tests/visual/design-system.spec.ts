import { expect, test } from "@playwright/test";

test.describe("Design System Visual Regression", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the new design system showcase page
    await page.goto("/test/design-system");

    // Wait for fonts and styles to load completely
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500); // Extra wait for any animations to settle
  });

  test("Button component variants", async ({ page }) => {
    const buttonShowcase = page.getByTestId("showcase-buttons");
    await expect(buttonShowcase).toHaveScreenshot("buttons.png");
  });

  test("Card component variants", async ({ page }) => {
    const cardShowcase = page.getByTestId("showcase-cards");
    await expect(cardShowcase).toHaveScreenshot("cards.png");
  });

  test("Input component variants", async ({ page }) => {
    const inputShowcase = page.getByTestId("showcase-inputs");
    await expect(inputShowcase).toHaveScreenshot("inputs.png");
  });
});
