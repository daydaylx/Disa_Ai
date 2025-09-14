import { Page } from "@playwright/test";

import baseResponse from "../fixtures/base-response.json" with { type: "json" };
import rateLimit from "../fixtures/rate-limit.json" with { type: "json" };
import serverError from "../fixtures/server-error.json" with { type: "json" };

export type InterceptScenario = "success" | "rate-limit" | "timeout" | "abort" | "server-error";

async function handleApiRoute(route: any, scenario: InterceptScenario) {
  console.log(`[E2E] Handling API route with scenario: ${scenario}`);

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
      // Small delay to ensure UI renders "Stop" button and test can click it
      await new Promise((r) => setTimeout(r, 250));
      const chunk1 = {
        ...baseResponse,
        choices: [{ index: 0, delta: { content: "Offline-" }, finish_reason: null }],
      };
      const chunk2 = {
        ...baseResponse,
        choices: [{ index: 0, delta: { content: "Testantwort" }, finish_reason: null }],
      };
      const finalChunk = {
        ...baseResponse,
        choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
      };
      const sse =
        `data: ${JSON.stringify(chunk1)}\n` +
        `data: ${JSON.stringify(chunk2)}\n` +
        `data: ${JSON.stringify(finalChunk)}\n` +
        `data: [DONE]\n`;
      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
        body: sse,
      });
      console.log(`[E2E] SSE response sent: ${sse.length} bytes`);
      return;
  }
}

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

      if (!isLocal) {
        console.log(`[E2E] Blocking external request: ${url.href}`);
        return route.abort();
      }
      return route.continue();
    } catch {
      return route.abort();
    }
  });

  // Mock OpenRouter Chat Completions endpoint - try multiple patterns
  await page.route("**/v1/chat/completions", async (route) => {
    console.log(`[E2E] Intercepting v1 API call: ${route.request().url()}`);
    await handleApiRoute(route, scenario);
  });

  await page.route("**/api/v1/chat/completions", async (route) => {
    console.log(`[E2E] Intercepting API call: ${route.request().url()}`);
    await handleApiRoute(route, scenario);
  });

  await page.route("https://openrouter.ai/api/v1/chat/completions", async (route) => {
    console.log(`[E2E] Intercepting full URL API call: ${route.request().url()}`);
    await handleApiRoute(route, scenario);
  });
}
