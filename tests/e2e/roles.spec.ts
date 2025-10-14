import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { AppHelpers } from "./helpers/app-helpers";

test.describe("Rollen-Screen", () => {
  test("cards are accessible and have interactive states", async ({ page }) => {
    const helpers = new AppHelpers(page);
    const monitor = helpers.setupConsoleMonitoring();

    await helpers.navigateAndWait("/roles");

    const grid = page.getByTestId("role-card-grid");
    await expect(grid).toBeVisible();

    const cards = grid.getByRole("button");
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(4);

    const firstCard = cards.first();
    await expect(firstCard).toBeVisible();

    await firstCard.tap();
    await expect(firstCard).toHaveAttribute("aria-pressed", "true");

    const boundingBox = await firstCard.boundingBox();
    expect(boundingBox?.height ?? 0).toBeGreaterThanOrEqual(48);
    expect(boundingBox?.width ?? 0).toBeGreaterThanOrEqual(48);

    await firstCard.focus();
    const borderColor = await firstCard.evaluate((el) => getComputedStyle(el).borderColor);
    expect(borderColor).not.toBe("rgba(0, 0, 0, 0)");

    const axe = new AxeBuilder({ page })
      .include("[data-testid='role-card-grid']")
      .withTags(["wcag2a", "wcag2aa"]);
    const results = await axe.analyze();

    expect(results.violations).toEqual([]);

    const relevantErrors = monitor
      .getErrors()
      .filter(
        (message) =>
          !message.includes("Environment Warnings") && !message.includes("ERR_INVALID_URL"),
      );
    expect(relevantErrors).toHaveLength(0);
  });
});
