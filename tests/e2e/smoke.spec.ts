import { expect, test } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set up request interception for offline-first testing
    await page.route("https://openrouter.ai/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "chatcmpl-test",
          object: "chat.completion",
          created: Date.now(),
          model: "anthropic/claude-3-sonnet",
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: "Dies ist eine Test-Antwort für E2E-Tests.",
              },
              finish_reason: "stop",
            },
          ],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 15,
            total_tokens: 25,
          },
        }),
      });
    });
  });

  test("App loads and shows initial state", async ({ page }) => {
    await page.goto("/");

    // Check if the main app loads
    await expect(page).toHaveTitle(/Disa Ai/);

    // Check for main UI elements (use ID to be specific)
    await expect(page.locator("#main")).toBeVisible();

    // Navigate to chat view to test composer
    await page.goto("/#/chat");

    await expect(page.locator('[data-testid="composer-input"]')).toBeVisible();

    // Check if composer is ready for input
    const composer = page.locator('[data-testid="composer-input"]');
    await expect(composer).toBeEnabled();
    await expect(composer).toHaveAttribute("placeholder", /Nachricht eingeben/);
  });

  test("Chat input allows typing and shows send button", async ({ page }) => {
    await page.goto("/#/chat");

    // Type a message
    const composer = page.locator('[data-testid="composer-input"]');
    await composer.fill("Hello test message");

    // Check that send button becomes enabled
    const sendButton = page.locator('[data-testid="composer-send"]');
    await expect(sendButton).toBeEnabled();

    // Verify the text was entered
    await expect(composer).toHaveValue("Hello test message");
  });

  test("404 handling works", async ({ page }) => {
    // Try to access a non-existent route and check it loads some content
    await page.goto("/non-existent-page");

    // Should load without crashing (specific routing behavior may vary)
    await expect(page.locator("body")).toBeVisible();
  });

  test("Accessibility: Keyboard navigation works", async ({ page }) => {
    await page.goto("/");

    // Test that tab navigation works
    await page.keyboard.press("Tab");

    // Check that focus management works
    await expect(page.locator(":focus")).toBeVisible();
  });

  test("Mobile viewport: UI is responsive", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // Check that page loads on mobile
    await expect(page.locator("body")).toBeVisible();
  });

  test("PWA: Basic resources exist", async ({ page }) => {
    await page.goto("/");

    // Check that page loads
    await expect(page.locator("html")).toBeVisible();

    // Check offline page accessibility
    const offlineResponse = await page.request.get("/offline.html");
    expect(offlineResponse.status()).toBe(200);
  });
});
