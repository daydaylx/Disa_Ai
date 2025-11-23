import { expect, test } from "@playwright/test";

import { blockExternalResources } from "./helpers/block-external-resources";

test.describe("Test Font Fix", () => {
  test("Can load page with blocked fonts", async ({ page }) => {
    // Block external resources BEFORE goto
    await blockExternalResources(page);

    console.log("Attempting to load / with blocked fonts...");
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30000 });

    console.log("SUCCESS: Page loaded!");
    await expect(page).toHaveTitle(/disa ai/i);
  });

  test("Can load /chat with blocked fonts", async ({ page }) => {
    await blockExternalResources(page);

    console.log("Attempting to load /chat with blocked fonts...");
    await page.goto("/chat", { waitUntil: "domcontentloaded", timeout: 30000 });

    console.log("SUCCESS: /chat loaded!");
    await expect(page).toHaveTitle(/disa ai/i);
  });
});
