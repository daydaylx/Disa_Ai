import { test, expect } from "@playwright/test";

test.describe("Disa AI – Chat happy path", () => {
  test.beforeEach(async ({ page }) => {
    // API-Key & Modell vor dem App-Load setzen
    await page.addInitScript(() => {
      localStorage.setItem("disa_api_key", '"sk-test-123"'); // mit Quotes, wie im Code getrimmt
      localStorage.setItem("disa_model", "meta-llama/llama-3.3-70b-instruct:free");
    });

    // OpenRouter stubben (JSON & SSE)
    await page.route("**/api/v1/chat/completions", async (route, request) => {
      let body: any = {};
      try { body = request.postDataJSON(); } catch {}
      const isStream = !!body?.stream;

      if (isStream) {
        // Einfacher SSE-Stream: "Hallo Disa"
        await route.fulfill({
          status: 200,
          headers: { "content-type": "text/event-stream; charset=utf-8" },
          body: [
            'data: {"choices":[{"delta":{"content":"Hallo"}}]}',
            '',
            'data: {"choices":[{"delta":{"content":" Disa"}}]}',
            '',
            'data: [DONE]',
            ''
          ].join("\n")
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ choices: [{ message: { content: "Hallo Disa" } }] })
        });
      }
    });
  });

  test("sendet Nachricht und empfängt Antwort", async ({ page }) => {
    await page.goto("/chat");

    // Eingabefeld finden (robust gegen Platzhalteränderungen)
    const input = page.locator('textarea, input[type="text"]').first();
    await expect(input).toBeVisible();

    await input.fill("Ping");
    await page.keyboard.press("Enter");

    // Antwort erscheint
    await expect(page.getByText(/Hallo Disa|Hallo\s+Disa|Hallo/)).toBeVisible();
  });
});
