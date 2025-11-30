import { expect, test } from "@playwright/test";

test.describe.skip("Chat Swipe Navigation (deprecated in favor of tab navigation)", () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage to start fresh
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("should navigate to new chat on swipe left", async ({ page }) => {
    // 1. Initial State: Chat 1
    const firstChatId = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("disa_book_state") || "{}");
      return state.activeChatId;
    });
    expect(firstChatId).toBeTruthy();

    // Simulate typing to make it a "real" chat (optional but good for realism)
    await page.getByRole("textbox").fill("Hello Chat 1");
    await page.getByTestId("composer-send").click(); // Assuming send button has this ID, or similar
    // Wait for message to appear (basic check)
    await expect(page.getByText("Hello Chat 1")).toBeVisible();

    // 2. Swipe Left (New Chat)
    // We need to swipe on the container. BookPageAnimator wraps the content.
    // Coordinates: Center right -> Center left
    const viewport = page.viewportSize();
    if (!viewport) throw new Error("No viewport");

    await page.mouse.move(viewport.width * 0.9, viewport.height / 2);
    await page.mouse.down();
    await page.mouse.move(viewport.width * 0.1, viewport.height / 2, { steps: 10 });
    await page.mouse.up();

    // 3. Verify New Chat
    await expect(page.getByRole("textbox")).toBeEmpty(); // Input should be cleared
    // Check storage for new ID
    const secondChatId = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("disa_book_state") || "{}");
      return state.activeChatId;
    });
    expect(secondChatId).not.toBe(firstChatId);
    expect(secondChatId).toBeTruthy();
  });

  test("should navigate back to previous chat on swipe right", async ({ page }) => {
    // 1. Create Chat 1
    await page.getByRole("textbox").fill("Chat A");
    await page.getByTestId("composer-send").click();
    const idA = await page.evaluate(
      () => JSON.parse(localStorage.getItem("disa_book_state") || "{}").activeChatId,
    );

    // 2. Swipe Left -> Create Chat 2
    const viewport = page.viewportSize();
    if (!viewport) return;
    await page.mouse.move(viewport.width * 0.9, viewport.height / 2);
    await page.mouse.down();
    await page.mouse.move(viewport.width * 0.1, viewport.height / 2, { steps: 10 });
    await page.mouse.up();

    // Wait for animation/state update
    await page.waitForTimeout(500);
    const idB = await page.evaluate(
      () => JSON.parse(localStorage.getItem("disa_book_state") || "{}").activeChatId,
    );
    expect(idB).not.toBe(idA);

    // 3. Swipe Right -> Back to Chat 1
    // Coordinates: Center left -> Center right
    await page.mouse.move(viewport.width * 0.1, viewport.height / 2);
    await page.mouse.down();
    await page.mouse.move(viewport.width * 0.9, viewport.height / 2, { steps: 10 });
    await page.mouse.up();

    // 4. Verify we are back at Chat 1
    await page.waitForTimeout(500);
    const currentId = await page.evaluate(
      () => JSON.parse(localStorage.getItem("disa_book_state") || "{}").activeChatId,
    );
    expect(currentId).toBe(idA);

    // Verify content is restored (if persistence works)
    // Note: This depends on useConversationManager persistence which might need IndexedDB mocking or just work
    await expect(page.getByText("Chat A")).toBeVisible();
  });

  test("should respect stack limit of 5", async ({ page }) => {
    const viewport = page.viewportSize();
    if (!viewport) return;

    // Swipe left 6 times
    for (let i = 0; i < 6; i++) {
      await page.mouse.move(viewport.width * 0.9, viewport.height / 2);
      await page.mouse.down();
      await page.mouse.move(viewport.width * 0.1, viewport.height / 2, { steps: 5 });
      await page.mouse.up();
      await page.waitForTimeout(300); // Wait for transition
    }

    const stackSize = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("disa_book_state") || "{}");
      return state.swipeStack?.length;
    });

    expect(stackSize).toBe(5);
  });
});
