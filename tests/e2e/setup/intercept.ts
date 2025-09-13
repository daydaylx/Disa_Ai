import { Page } from "@playwright/test";

import baseResponse from "../fixtures/base-response.json" with { type: "json" };
import rateLimit from "../fixtures/rate-limit.json" with { type: "json" };
import serverError from "../fixtures/server-error.json" with { type: "json" };

export type InterceptScenario = "success" | "rate-limit" | "timeout" | "abort" | "server-error";

export async function setupRequestInterception(
  page: Page,
  scenario: InterceptScenario = "success",
) {
  // Block all external network by default, allow only local dev server
  await page.route("**/*", (route) => {
    try {
      const url = new URL(route.request().url());
      const isLocal =
        ((url.hostname === "127.0.0.1" || url.hostname === "localhost") &&
          (url.port === "5173" || url.port === "")) ||
        url.protocol === "data:" ||
        url.protocol === "about:";
      if (!isLocal) return route.abort();
      return route.continue();
    } catch {
      return route.abort();
    }
  });

  // Mock OpenRouter Chat Completions endpoint
  await page.route("**/v1/chat/completions", async (route) => {
    switch (scenario) {
      case "timeout":
        await route.abort("timedout");
        return;

      case "abort":
        await route.abort("aborted");
        return;

      case "rate-limit":
        await route.fulfill({
          status: 429,
          contentType: "application/json",
          body: JSON.stringify(rateLimit),
        });
        return;

      case "server-error":
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify(serverError),
        });
        return;

      case "success":
      default:
        // Simulate minimal SSE/NDJSON streaming that ChatView can parse
        // Send two chunks followed by [DONE]
        const chunk1 = {
          ...baseResponse,
          choices: [{ index: 0, delta: { content: "Offline-" }, finish_reason: null }],
        };
        const chunk2 = {
          ...baseResponse,
          choices: [{ index: 0, delta: { content: "Testantwort" }, finish_reason: null }],
        };
        const sse =
          `data: ${JSON.stringify(chunk1)}\n` +
          `data: ${JSON.stringify(chunk2)}\n` +
          `data: [DONE]\n`;
        await route.fulfill({
          status: 200,
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache",
          },
          body: sse,
        });
        return;
    }
  });
}
