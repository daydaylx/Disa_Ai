import { expect, test } from "@playwright/test";

test.describe("Appearance Settings", () => {
  test("should change theme", async ({ page }) => {
    await page.goto("/settings");
    await page.selectOption("#theme-select", "dark");
    const html = await page.$("html");
    const className = await html?.getAttribute("class");
    expect(className).toContain("dark");
  });

  test("should change font size", async ({ page }) => {
    await page.goto("/#/settings");
    await page.fill("#font-size-slider", "20");
    const html = await page.$("html");
    const style = await html?.getAttribute("style");
    expect(style).toContain("font-size: 20px");
  });
});
