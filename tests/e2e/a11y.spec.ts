import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("chat view has no axe violations", async ({ page }) => {
  await page.goto("/#/chat");

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
