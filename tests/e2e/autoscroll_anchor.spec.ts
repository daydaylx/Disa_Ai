import { expect, test } from "@playwright/test";

test.describe("Autoscroll anchor", () => {
  test("shows anchor when user scrolls up and returns to bottom on tap", async ({ page }) => {
    await page.goto("/chat");

    const log = page.getByTestId("chat-log");
    await log.waitFor({ state: "visible" });

    // Seed künstliche Nachrichten, damit genügend Scroll-Höhe entsteht
    await page.evaluate(() => {
      const logEl = document.querySelector('[data-testid="chat-log"]');
      if (!logEl) return;
      for (let i = 0; i < 80; i += 1) {
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble";
        bubble.textContent = `Testeintrag ${i} – ${"Lorem ipsum ".repeat(20)}`;
        logEl.appendChild(bubble);
      }
    });

    await log.evaluate((el) => {
      (el as HTMLElement).style.height = "320px";
      (el as HTMLElement).style.overflow = "auto";
    });

    await page.waitForTimeout(200);

    await log.evaluate((el) => {
      el.scrollTop = 260;
      el.dispatchEvent(new Event("scroll", { bubbles: true }));
    });

    await page.waitForTimeout(200);

    const fab = page.locator('button[aria-label="Zum Ende scrollen"]');
    await expect(fab).toBeVisible();

    await fab.click();

    await expect
      .poll(async () => log.evaluate((el) => el.scrollHeight - el.scrollTop - el.clientHeight))
      .toBeLessThan(5);

    await expect(fab).toBeHidden();
  });
});
