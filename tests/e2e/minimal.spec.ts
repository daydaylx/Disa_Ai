import { expect, test } from "./fixtures";

test.describe("Minimal Debug Test", () => {
  test("Can load homepage without crash", async ({ page }) => {
    // NO setup - just raw goto
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // If we get here, page didn't crash
    await expect(page).toHaveTitle(/disa ai/i);
  });

  test("Can load /chat without crash", async ({ page }) => {
    // NO setup - just raw goto
    await page.goto("/chat", { waitUntil: "domcontentloaded" });

    // If we get here, page didn't crash
    await expect(page).toHaveTitle(/disa ai/i);
  });
});
