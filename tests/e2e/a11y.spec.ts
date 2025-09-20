import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("quickstart has no axe violations", async ({ page }) => {
  await page.goto("/#/quickstart");

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
