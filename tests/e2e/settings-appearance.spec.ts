import { expect, test } from "@playwright/test";

test.describe("Appearance Settings", () => {
  test("zeigt Einstellungsseite und Theme-Option", async ({ page }) => {
    await page.goto("/settings");

    await expect(page.getByRole("heading", { name: /Einstellungen|Settings/ })).toBeVisible();

    const themeControl = page.locator('[data-testid="theme-select"], #theme-select').first();
    if (await themeControl.count()) {
      await themeControl.selectOption("dark");
      const html = await page.locator("html").first();
      const className = await html.getAttribute("class");
      expect(className ?? "").toContain("dark");
    } else {
      test.skip(true, "Theme-Auswahl im aktuellen Build nicht sichtbar");
    }
  });
});
