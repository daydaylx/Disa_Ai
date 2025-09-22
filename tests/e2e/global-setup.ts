import type { Page } from "@playwright/test";

/**
 * Set up complete test environment with API mocking and authentication
 */
export async function setupTestEnvironment(page: Page) {
  // Set up API key before navigation
  await page.addInitScript(() => {
    sessionStorage.setItem("disa:api-key", "mock-api-key-for-testing");
  });

  // Set up API mocking
  await setupApiMocking(page);
}

/**
 * Set up API mocking for E2E tests to ensure offline-first testing
 */
export async function setupApiMocking(page: Page) {
  // Block all external requests by default
  await page.route("https://**", (route) => {
    const url = route.request().url();

    // Allow OpenRouter API calls but mock them
    if (url.includes("openrouter.ai/api/v1/chat/completions")) {
      return handleStreamingResponse(route);
    }

    // Allow models endpoint
    if (url.includes("openrouter.ai/api/v1/models")) {
      return handleModelsResponse(route);
    }

    // Block all other external requests
    route.abort();
  });
}

/**
 * Mock streaming chat response with realistic delay
 */
async function handleStreamingResponse(route: any) {
  const request = route.request();
  const headers = {
    "content-type": "text/plain; charset=utf-8",
    "access-control-allow-origin": "*",
  };

  // Simulate streaming response - start immediately but continue streaming
  const streamBody =
    'data: {"id":"chatcmpl-mock","object":"chat.completion.chunk","created":1234567890,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{"role":"assistant","content":"Hallo"},"finish_reason":null}]}\n\n' +
    'data: {"id":"chatcmpl-mock","object":"chat.completion.chunk","created":1234567890,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{"content":" das"},"finish_reason":null}]}\n\n' +
    'data: {"id":"chatcmpl-mock","object":"chat.completion.chunk","created":1234567890,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{"content":" ist"},"finish_reason":null}]}\n\n' +
    'data: {"id":"chatcmpl-mock","object":"chat.completion.chunk","created":1234567890,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{"content":" eine"},"finish_reason":null}]}\n\n' +
    'data: {"id":"chatcmpl-mock","object":"chat.completion.chunk","created":1234567890,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{"content":" Test"},"finish_reason":null}]}\n\n' +
    'data: {"id":"chatcmpl-mock","object":"chat.completion.chunk","created":1234567890,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{"content":"-Antwort"},"finish_reason":null}]}\n\n' +
    'data: {"id":"chatcmpl-mock","object":"chat.completion.chunk","created":1234567890,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}\n\n' +
    "data: [DONE]\n\n";

  // Add a delay to make sure streaming state is visible
  await new Promise((resolve) => setTimeout(resolve, 50));

  await route.fulfill({
    status: 200,
    headers,
    body: streamBody,
  });
}

/**
 * Mock models endpoint response
 */
async function handleModelsResponse(route: any) {
  const mockModels = {
    data: [
      {
        id: "gpt-3.5-turbo",
        object: "model",
        created: 1677610602,
        owned_by: "openai",
        pricing: { prompt: "0.0015", completion: "0.002" },
        context_length: 4096,
      },
    ],
  };

  await route.fulfill({
    status: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(mockModels),
  });
}
