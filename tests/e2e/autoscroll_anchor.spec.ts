import { expect, test } from "@playwright/test";

test.describe("Autoscroll anchor", () => {
  test("shows anchor when user scrolls up and returns to bottom on tap", async ({ page }) => {
    await page.addInitScript(() => {
      const now = Date.now();
      const messages = Array.from({ length: 80 }, (_, idx) => ({
        id: `msg-${idx}`,
        ts: now + idx,
        role: idx % 2 === 0 ? "assistant" : "user",
        content: `Langer Testeintrag ${idx} – ${"Text ".repeat(50)}`, // More content to ensure scrolling
      }));

      // Inject test messages directly into ChatApp state
      (window as any).__testMessages = messages;
    });

    await page.goto(`/#/chat`);

    const log = page.locator('[aria-label="Chat messages"]');
    await log.waitFor();

    // Debug: Check if messages are loaded
    const messageCount = await page.locator(".chat-bubble").count();
    console.log(`Found ${messageCount} messages`);

    // Wait for messages to load
    await page.waitForFunction(
      () => {
        const messages = document.querySelectorAll(".chat-bubble");
        return messages.length > 50; // Wait for at least 50 messages to load
      },
      { timeout: 5000 },
    );

    // Force a fixed height to ensure overflow and trigger scrollbar
    await log.evaluate((el) => {
      el.style.height = "300px";
      el.style.overflow = "auto";
      console.log(`Scroll height: ${el.scrollHeight}, Client height: ${el.clientHeight}`);
    });

    // Wait for scroll state initialization
    await page.waitForTimeout(300);

    // Force scroll to position > 200 to trigger FAB (as per VirtualMessageList logic)
    await log.evaluate((el) => {
      el.scrollTop = 250; // Must be > 200 for FAB to show
      // Force scroll events to fire
      el.dispatchEvent(new Event("scroll", { bubbles: true }));
      // Validate scroll position
      console.log(`After scroll - scrollTop: ${el.scrollTop}, scrollHeight: ${el.scrollHeight}`);
    });

    // Wait for scroll state to update
    await page.waitForTimeout(500);

    const fab = page.locator('button[aria-label="Zum Ende scrollen"]');
    await expect(fab).toBeVisible();

    await fab.click();

    await expect
      .poll(async () => {
        return await log.evaluate((el) => el.scrollHeight - el.scrollTop - el.clientHeight);
      })
      .toBeLessThan(8);

    await expect(fab).toBeHidden();
  });
});
