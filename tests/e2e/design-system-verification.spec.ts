import { expect, test } from "@playwright/test";

test.describe("Design System Verification", () => {
  test("Application loads with new CSS layer structure", async ({ page }) => {
    await page.goto("http://localhost:5173");

    // Wait for app to load
    await page.waitForTimeout(2000);

    // Verify main elements are visible
    await expect(page.locator("body")).toBeVisible();

    // Check if glass styles are applied by looking for composer
    const composer = page.locator('[data-testid="composer-input"]');
    await expect(composer).toBeVisible();

    // Verify glass backdrop classes are working
    const styles = await composer.evaluate((el) => {
      return window.getComputedStyle(el);
    });

    // Basic verification that CSS is loaded and working
    expect(styles.borderRadius).not.toBe("0px");
  });

  test("Legacy button classes still work", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.waitForTimeout(2000);

    // Check if legacy button mapping works
    const sendButton = page.locator('[data-testid="composer-send"]');
    await expect(sendButton).toBeVisible();

    const buttonStyles = await sendButton.evaluate((el) => {
      return window.getComputedStyle(el);
    });

    // Verify button has proper styling
    expect(buttonStyles.display).toBe("inline-flex");
  });

  test("Professional color palette is applied", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.waitForTimeout(2000);

    // Check body background color (should be dark)
    const bodyStyles = await page.evaluate(() => {
      return window.getComputedStyle(document.body);
    });

    // Verify dark theme is active
    expect(bodyStyles.backgroundColor).toContain("rgb(15, 23, 42)");
  });
});
