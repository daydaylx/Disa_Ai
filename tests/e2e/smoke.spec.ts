import { expect, test } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("App loads and shows initial state", async ({ page }) => {
    // Starte die App. Passe ggf. baseURL in playwright.config an.
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Titel: robust und case-insensitive
    await expect(page).toHaveTitle(/disa ai/i);

    // Root-Container: akzeptiere #main oder #root, je nach Build/HTML
    const hasMain = await page.locator("#main").count();
    const target = hasMain ? page.locator("#main") : page.locator("#root");
    await expect(target).toBeVisible();

    // Optional sinnvolle Minimalchecks – kommentiert lassen, wenn dich das nervt
    // await expect(page.getByRole("button", { name: /senden|send/i })).toBeVisible();
    // await expect(page.getByPlaceholder(/prompt|nachricht|message/i)).toBeVisible();
  });
});
