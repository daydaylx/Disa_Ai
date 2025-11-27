import AxeBuilder from "@axe-core/playwright";
import { test } from "@playwright/test";

import { skipOnboarding } from "../utils";

test.describe("Visual Audit", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  const pages = [
    { path: "/", name: "chat" },
    { path: "/settings", name: "settings" },
    { path: "/roles", name: "roles" },
    { path: "/models", name: "models" },
    { path: "/feedback", name: "feedback" },
  ];

  for (const { path, name } of pages) {
    test(`Audit ${name}`, async ({ page }) => {
      await page.goto(path);
      // await page.waitForLoadState("networkidle"); // Networkidle is sometimes flaky
      await page.waitForTimeout(2000); // Wait for animations and loading

      // Screenshot
      await page.screenshot({ path: `report/visual/${name}-mobile.png`, fullPage: true });

      // Accessibility
      try {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa"])
          .analyze();

        if (accessibilityScanResults.violations.length > 0) {
          console.log(`\n=== Accessibility Violations on ${path} ===`);
          accessibilityScanResults.violations.forEach((v) => {
            console.log(`- [${v.impact}] ${v.help} (${v.nodes.length} elements)`);
          });
        }
      } catch (e) {
        console.error("Axe check failed:", e);
      }
    });
  }
});
