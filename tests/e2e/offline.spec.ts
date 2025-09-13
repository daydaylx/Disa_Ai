import { expect, test } from "@playwright/test";

import { setupRequestInterception } from "./setup/intercept";

test.describe("E2E Offline Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure all network requests are intercepted
    await page.route("**/*", (route) => {
      const url = route.request().url();
      if (!url.includes("localhost") && !url.includes("127.0.0.1")) {
        route.abort("blockedbyclient");
      } else {
        route.continue();
      }
    });
  });

  test("Smoke: Successful prompt-response flow", async ({ page }) => {
    await setupRequestInterception(page, "success");
    await page.goto("/#/");

    const input = page.getByTestId("composer-input");
    await input.fill("Test prompt");
    await page.getByTestId("composer-send").click();

    await expect(page.locator(".msg")).toHaveCount(3, { timeout: 5000 });
    await expect(input).toHaveValue("");
  });

  test("Error handling: Rate limit", async ({ page }) => {
    await setupRequestInterception(page, "rate-limit");
    await page.goto("/#/");

    await page.getByTestId("composer-input").fill("Test");
    await page.getByTestId("composer-send").click();

    await expect(page.getByText("Rate limit exceeded")).toBeVisible({ timeout: 3000 });
  });

  test("Error handling: Request timeout", async ({ page }) => {
    await setupRequestInterception(page, "timeout");
    await page.goto("/#/");

    await page.getByTestId("composer-input").fill("Test");
    await page.getByTestId("composer-send").click();

    await expect(page.getByText("Request timed out")).toBeVisible({ timeout: 3000 });
  });

  test("Key flow: Stop button functionality", async ({ page }) => {
    await setupRequestInterception(page, "success");
    await page.goto("/#/");

    const bubbles = page.locator(".msg");
    const before = await bubbles.count();

    await page.getByTestId("composer-input").fill("Test");
    await page.getByTestId("composer-send").click();

    const stop = page.getByTestId("composer-stop");
    await expect(stop).toBeVisible({ timeout: 1000 });
    await stop.click();

    await expect(page.getByTestId("composer-send")).toBeVisible();

    const after = await bubbles.count();
    expect(after).toBe(before + 1);
  });
});
