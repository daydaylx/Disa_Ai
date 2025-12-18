import { expect, test } from "@playwright/test";

test.describe("Chat Mobile Interaction", () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE dimensions
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    hasTouch: true,
    isMobile: true,
  });

  test("Send button should be accessible and functional on mobile", async ({ page }) => {
    await page.goto("/chat");

    // Wait for input to be ready
    const input = page.getByPlaceholder("Schreibe eine Nachricht...");
    await expect(input).toBeVisible();

    // Type a message
    const testMessage = "Mobile Test Message";
    await input.fill(testMessage);

    // Get the send button
    const sendButton = page.getByRole("button", { name: "Senden" });
    await expect(sendButton).toBeVisible();
    await expect(sendButton).toBeEnabled();

    // Verify button size is adequate for touch (approx > 40px)
    const box = await sendButton.boundingBox();
    expect(box?.width).toBeGreaterThan(40);
    expect(box?.height).toBeGreaterThan(40);

    // Send the message
    await sendButton.tap();

    // Verify message appears in the list
    const messageLocator = page
      .locator('[data-testid="message-row"]')
      .filter({ hasText: testMessage });
    await expect(messageLocator).toBeVisible({ timeout: 10000 });
  });

  test("Layout should respect mobile constraints", async ({ page }) => {
    await page.goto("/chat");
    const inputBar = page.getByLabel("Eingabebereich");
    await expect(inputBar).toBeVisible();

    // Basic visibility check of critical elements
    await expect(page.locator("header")).toBeVisible(); // ChatLayout header
    await expect(page.getByTestId("brand-logo")).toBeVisible();
  });
});
