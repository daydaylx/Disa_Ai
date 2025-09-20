import { checkA11y, injectAxe } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("quickstart has no axe violations", async ({ page }) => {
  await page.goto("/#/quickstart");
  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });
  await expect(true).toBe(true);
});
