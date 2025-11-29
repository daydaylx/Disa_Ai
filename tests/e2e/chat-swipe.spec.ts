import { expect, test } from "@playwright/test";

test.describe("Chat Swipe Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for chat to be ready
    await page.waitForSelector('[data-testid="composer-input"]');
  });

  test("should create new chat on swipe left", async ({ page }) => {
    // Initial State: Check for "Seite 1" or similar indicator if visible,
    // or just verify we can type.
    const composer = page.getByTestId("composer-input");
    await expect(composer).toBeVisible();

    // Type something to ensure current chat is "used" (optional but good practice)
    await composer.fill("Erste Nachricht");
    await page.getByTestId("composer-send").click();

    // Wait for message to appear to confirm chat is active
    await expect(page.getByText("Erste Nachricht")).toBeVisible();

    // Simulate Swipe Left (Drag from right to left)
    // We need to drag on the chat container

    // Fallback if list is empty (initial state might differ): drag on body or a wrapper

    const box = await page.locator("body").boundingBox();
    if (!box) return;

    const startX = box.width * 0.8;
    const endX = box.width * 0.2;
    const y = box.height / 2;

    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(endX, y, { steps: 10 });
    await page.mouse.up();

    // Verify Toast or New Chat State
    // "Neue Seite" toast is triggered in Chat.tsx
    await expect(page.getByText("Neue Seite")).toBeVisible();

    // Composer should be empty
    await expect(composer).toHaveValue("");
  });

  test("should go back on swipe right", async ({ page }) => {
    // 1. Create first chat content
    await page.getByTestId("composer-input").fill("Chat A");
    await page.getByTestId("composer-send").click();
    await expect(page.getByText("Chat A")).toBeVisible();

    // 2. Create new chat (Swipe Left)
    const box = await page.locator("body").boundingBox();
    if (!box) return;
    const y = box.height / 2;

    // Swipe Left
    await page.mouse.move(box.width * 0.8, y);
    await page.mouse.down();
    await page.mouse.move(box.width * 0.2, y, { steps: 10 });
    await page.mouse.up();

    await expect(page.getByText("Neue Seite")).toBeVisible();

    // 3. Create second chat content
    await page.getByTestId("composer-input").fill("Chat B");
    await page.getByTestId("composer-send").click();
    await expect(page.getByText("Chat B")).toBeVisible();

    // 4. Swipe Right (Go Back)
    await page.mouse.move(box.width * 0.2, y);
    await page.mouse.down();
    await page.mouse.move(box.width * 0.8, y, { steps: 10 });
    await page.mouse.up();

    // Verify we are back at Chat A
    await expect(page.getByText("Zurückgeblättert")).toBeVisible();
    // Content of Chat A should be visible again
    await expect(page.getByText("Chat A")).toBeVisible();
  });
});
