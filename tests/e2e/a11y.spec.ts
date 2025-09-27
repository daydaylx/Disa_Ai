import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Accessibility Tests", () => {
  test("chat view has no axe violations (V1)", async ({ page }) => {
    // Force V1 UI
    await page.addInitScript(() => {
      Object.defineProperty(window, "import", {
        value: {
          meta: {
            env: {
              VITE_UI_V2: "false",
            },
          },
        },
      });
    });

    await page.goto("/");
    await page.waitForTimeout(500); // Allow UI to stabilize

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("chat view has no axe violations (V2)", async ({ page }) => {
    // Force V2 UI
    await page.addInitScript(() => {
      Object.defineProperty(window, "import", {
        value: {
          meta: {
            env: {
              VITE_UI_V2: "true",
            },
          },
        },
      });
    });

    await page.goto("/");

    // Ensure V2 UI is loaded
    await expect(page.getByText("Corporate AI Intelligence")).toBeVisible();
    await page.waitForTimeout(500); // Allow UI to stabilize

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("settings view has no axe violations (V1)", async ({ page }) => {
    // Force V1 UI
    await page.addInitScript(() => {
      Object.defineProperty(window, "import", {
        value: {
          meta: {
            env: {
              VITE_UI_V2: "false",
            },
          },
        },
      });
    });

    await page.goto("/settings");
    await page.waitForTimeout(500); // Allow UI to stabilize

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("settings view has no axe violations (V2)", async ({ page }) => {
    // Force V2 UI
    await page.addInitScript(() => {
      Object.defineProperty(window, "import", {
        value: {
          meta: {
            env: {
              VITE_UI_V2: "true",
            },
          },
        },
      });
    });

    await page.goto("/settings");

    // Ensure V2 UI is loaded
    await expect(page.getByText("Executive Control Panel")).toBeVisible();
    await page.waitForTimeout(500); // Allow UI to stabilize

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test.skip("legacy chat navigation", async ({ page }) => {
    // Old navigation pattern that may not work with modern builds
    await page.goto("/#/chat");
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
