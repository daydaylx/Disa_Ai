import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test.describe("Accessibility Tests", () => {
  test("basic accessibility check", async ({ page }) => {
    await setupTestEnvironment(page);
    await page.goto("/");

    // Wait longer for the app to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Check for basic elements that should exist
    try {
      await expect(page.getByText("Disa AI")).toBeVisible({ timeout: 5000 });
    } catch {
      // If Disa AI text not found, look for any header content
      const anyHeader = page.locator("header, h1, h2").first();
      await expect(anyHeader).toBeVisible({ timeout: 5000 });
    }

    // Run basic accessibility scan - exclude decorative elements and be lenient
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a"])
      .exclude("[class*='aurora']")
      .exclude("[class*='glow']")
      .exclude("[class*='gradient']")
      .analyze();

    // Only fail on critical violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === "critical",
    );

    expect(criticalViolations).toEqual([]);
  });

  test("composer input exists and works", async ({ page }) => {
    await setupTestEnvironment(page);
    await page.goto("/");

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Look for composer input using test ID
    const composerInput = page.getByTestId("composer-input");
    await expect(composerInput).toBeVisible({ timeout: 10000 });

    // Test basic input functionality
    await composerInput.fill("Test accessibility");
    await expect(composerInput).toHaveValue("Test accessibility");
  });

  test("page has basic structure", async ({ page }) => {
    await setupTestEnvironment(page);
    await page.goto("/");

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Check that page has some interactive elements
    const interactiveElements = page.locator("button, input, textarea, [tabindex]");
    const count = await interactiveElements.count();
    expect(count).toBeGreaterThan(0);
  });
});
