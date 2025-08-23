import { test, expect } from "@playwright/test";

test("settings -> set key -> chat streams one token", async ({ page, context }) => {
  // Stub OpenRouter: Eine minimal gültige SSE-Antwort
  await context.route("https://openrouter.ai/api/v1/chat/completions", async (route) => {
    const body = [
      'data: {"choices":[{"delta":{"content":"Hi"}}]}\n\n',
      "data: [DONE]\n\n",
    ].join("");
    await route.fulfill({
      status: 200,
      headers: { "content-type": "text/event-stream" },
      body,
    });
  });

  await page.goto("/settings");
  await page.locator('input[placeholder="sk-or-…"]').fill("sk-test");
  await page.getByRole("button", { name: "Speichern" }).click();

  await page.goto("/chat");
  await page.getByPlaceholder("Schreibe hier …").fill("Sag hi");
  await page.getByRole("button", { name: "Senden" }).click();

  await expect(page.getByText("Hi")).toBeVisible();
});
