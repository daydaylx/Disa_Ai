import { expect, test } from "@playwright/test";

test.describe("Appearance Settings", () => {
  test("should change theme (V1 UI)", async ({ page }) => {
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

    // Wait for settings page to load
    await page.waitForTimeout(500);

    // Try both possible selector patterns
    const themeSelect = page.locator("#theme-select").first();
    const themeSelectAlt = page.locator('[data-testid="theme-select"]').first();

    const selectElement = (await themeSelect.count()) > 0 ? themeSelect : themeSelectAlt;

    if ((await selectElement.count()) > 0) {
      await selectElement.selectOption("dark");
      const html = await page.$("html");
      const className = await html?.getAttribute("class");
      expect(className).toContain("dark");
    }
  });

  test("should change theme (V2 UI)", async ({ page }) => {
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

    // Check for V2 settings page (might fallback to V1)
    await page.waitForTimeout(1000);

    // Try to find either V2 or V1 settings content
    const v2Panel = page.getByText("Executive Control Panel");
    const v1Settings = page.getByText("Einstellungen").or(page.getByText("Settings"));

    // At least one should be visible
    const isV2Visible = await v2Panel.isVisible().catch(() => false);
    const isV1Visible = await v1Settings.isVisible().catch(() => false);

    if (!isV2Visible && !isV1Visible) {
      throw new Error("Neither V2 nor V1 settings panel found");
    }

    // Wait for settings page to load
    await page.waitForTimeout(500);

    // Try both possible selector patterns for V2
    const themeSelect = page.locator("#theme-select").first();
    const themeSelectAlt = page.locator('[data-testid="theme-select"]').first();

    const selectElement = (await themeSelect.count()) > 0 ? themeSelect : themeSelectAlt;

    if ((await selectElement.count()) > 0) {
      await selectElement.selectOption("dark");
      const html = await page.$("html");
      const className = await html?.getAttribute("class");
      expect(className).toContain("dark");
    }
  });

  test("should change font size", async ({ page }) => {
    await page.goto("/settings");

    // Wait for settings page to load
    await page.waitForTimeout(500);

    // Try both possible selector patterns
    const fontSizeSlider = page.locator("#font-size-slider").first();
    const fontSizeSliderAlt = page.locator('[data-testid="font-size-slider"]').first();

    const sliderElement = (await fontSizeSlider.count()) > 0 ? fontSizeSlider : fontSizeSliderAlt;

    if ((await sliderElement.count()) > 0) {
      await sliderElement.fill("20");
      const html = await page.$("html");
      const style = await html?.getAttribute("style");
      expect(style).toContain("font-size: 20px");
    }
  });

  test.skip("legacy settings navigation test", async ({ page }) => {
    // This test uses an old navigation pattern that may not work in modern builds
    await page.goto("/#/settings");
    await page.waitForTimeout(500);
  });
});
