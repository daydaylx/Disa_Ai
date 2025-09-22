import { expect, test } from "@playwright/test";

test.describe("Autoscroll anchor", () => {
  test("shows anchor when user scrolls up and returns to bottom on tap", async ({ page }) => {
    const convId = "autoscroll-e2e";
    await page.addInitScript(
      ({ id }) => {
        const now = Date.now();
        const messages = Array.from({ length: 80 }, (_, idx) => ({
          id: `msg-${idx}`,
          createdAt: now + idx,
          role: idx % 2 === 0 ? "assistant" : "user",
          content: `Langer Testeintrag ${idx} – ${"Text ".repeat(15)}`,
        }));
        const meta = {
          id,
          title: "Autoscroll Test",
          createdAt: now,
          updatedAt: now,
        };
        window.localStorage.setItem(`disa:conv:${id}:msgs`, JSON.stringify(messages));
        window.localStorage.setItem(`disa:conv:${id}:meta`, JSON.stringify(meta));
      },
      { id: convId },
    );

    await page.goto(`/#/chat`);

    const log = page.locator('[aria-label="Chat messages"]');
    await log.waitFor();
    await page.waitForTimeout(150);

    // Force a fixed height to ensure overflow
    await log.evaluate((el) => {
      el.style.height = "400px";
      el.style.overflow = "auto";
    });

    // Simulate user scrolling away from the bottom
    await log.evaluate((el) => {
      el.scrollTop = 0;
    });

    // Wait a bit for scroll state to update
    await page.waitForTimeout(100);

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
