import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

const routes = [
  { path: "/chat", name: "Chat" },
  { path: "/models", name: "Modelle" },
  { path: "/settings", name: "Einstellungen" },
];

test.describe("@a11y Grundseiten", () => {
  test.beforeEach(async ({ page }) => {
    await setupTestEnvironment(page);
  });

  for (const route of routes) {
    test(route.name, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("body")).toBeVisible();

      const results = await new AxeBuilder({ page })
        .include("body")
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const critical = results.violations.filter(({ impact }) => impact === "critical");
      expect(critical).toEqual([]);
    });
  }
});
