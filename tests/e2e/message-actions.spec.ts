import { expect, test } from "@playwright/test";

test.describe("Message Actions", () => {
  test("should copy message content to clipboard", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("composer-send")).toBeEnabled();
    await page.click("[data-testid=composer-send]");
    await page.hover("[data-testid=message.item]");
    await page.click("[data-testid=message.copy]");
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe("Hello, world!");
  });

  test("should delete a message after confirmation", async ({ page }) => {
    await page.goto("/");
    await page.fill("[data-testid=composer-input]", "This is a test message");
    await expect(page.getByTestId("composer-send")).toBeEnabled();
    await page.click("[data-testid=composer-send]");
    await page.hover("[data-testid=message.item]");
    page.on("dialog", (dialog) => dialog.accept());
    await page.click("[data-testid=message.delete]");
    const message = await page.$("[data-testid=message.item]");
    expect(message).toBeNull();
  });
});
