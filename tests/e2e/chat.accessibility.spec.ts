import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { skipOnboarding } from "./utils";

test.describe("Chat Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await page.goto("/chat");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByTestId("composer-input")).toBeVisible({ timeout: 30000 });
  });

  test("has no critical or serious accessibility violations", async ({ page }, testInfo) => {
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

    await testInfo.attach("axe-chat", {
      body: Buffer.from(JSON.stringify(results, null, 2)),
      contentType: "application/json",
    });

    const blockingViolations = results.violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious",
    );

    expect(blockingViolations).toEqual([]);
  });
});
