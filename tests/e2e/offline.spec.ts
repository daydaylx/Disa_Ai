import { expect,test } from "@playwright/test";

import { setupRequestInterception } from "./setup/intercept";

test.describe("E2E Offline Tests", () => {
  test("Smoke: Successful prompt-response flow @flaky", async ({ page }) => {
    await setupRequestInterception(page, "success");
    await page.goto("/#/");

    const input = page.getByTestId("composer-input");
    await input.fill("Test prompt");
    await page.getByTestId("composer-send").click();

    await expect(page.locator(".msg")).toHaveCount(3, { timeout: 5000 });
    await expect(input).toHaveValue("");
  });

  test("Error handling: Rate limit with retry @flaky", async ({ page }) => {
    await setupRequestInterception(page, "rate-limit");
    await page.goto("/#/");

    await page.getByTestId("composer-input").fill("Test");
    await page.getByTestId("composer-send").click();

    await expect(page.getByText("Rate limit exceeded")).toBeVisible();
  });

  test("Error handling: Request timeout @flaky", async ({ page }) => {
    await setupRequestInterception(page, "timeout");
    await page.goto("/#/");

    await page.getByTestId("composer-input").fill("Test");
    await page.getByTestId("composer-send").click();

    await expect(page.getByText("Request timed out")).toBeVisible();
  });

  test("Error handling: Server error @flaky", async ({ page }) => {
    await setupRequestInterception(page, "server-error");
    await page.goto("/#/");

    await page.getByTestId("composer-input").fill("Test");
    await page.getByTestId("composer-send").click();

    await expect(page.getByText("Internal server error")).toBeVisible();
  });

  test("Key flow: Stop button functionality @flaky", async ({ page }) => {
    await setupRequestInterception(page, "success");
    await page.goto("/#/");

    const bubbles = page.locator(".msg");
    const before = await bubbles.count();

    await page.getByTestId("composer-input").fill("Test");
    await page.getByTestId("composer-send").click();
    
    const stop = page.getByTestId("composer-stop");
    await expect(stop).toBeVisible();
    await stop.click();

    await expect(page.getByTestId("composer-send")).toBeVisible();
    
    const after = await bubbles.count();
    expect(after).toBe(before + 1);
  });

  test("Key flow: Offline mode banner @flaky", async ({ page }) => {
    await page.goto("/#/");
    await page.context().setOffline(true);
    await page.waitForTimeout(100);
    
    await expect(page.getByText("Offline – Eingaben werden gepuffert")).toBeVisible();
    
    await page.context().setOffline(false);
  });

  test("Key flow: Composer keyboard shortcuts @flaky", async ({ page }) => {
    await setupRequestInterception(page, "success");
    await page.goto("/#/");
    
    const input = page.getByTestId("composer-input");
    await input.click();
    
    await input.type("Line 1");
    await page.keyboard.down("Shift");
    await page.keyboard.press("Enter");
    await page.keyboard.up("Shift");
    await input.type("Line 2");
    
    await expect(input).toHaveValue(/Line 1\nLine 2/);
    
    await page.keyboard.press("Enter");
    await expect(input).toHaveValue("");
  });
});
