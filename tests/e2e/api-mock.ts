import { type APIRequestContext, type Page } from "@playwright/test";

/**
 * Sets up API key storage in sessionStorage to prevent "NO_API_KEY_IN_TESTS" error
 * This ensures the app can initialize properly before API calls are made
 */
export async function setupApiKeyStorage(page: Page) {
  // Set the API key directly in sessionStorage
  await page.addInitScript(() => {
    // Set the API key in sessionStorage before the app initializes
    sessionStorage.setItem("openrouter-key", "sk-1234567890abcdef");
  });
}

/**
 * Sets up API response mocking for the chat endpoint
 * This intercepts requests to the chat API and returns a mock response
 */
export async function setupChatApiMock(page: Page | APIRequestContext) {
  // Mock the OpenRouter API endpoint
  await page.route("**/openrouter.ai/api/v1/chat/completions", async (route) => {
    // Send a mock response that matches what the test expects
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "mock-id",
        object: "chat.completion.chunk",
        created: Date.now(),
        model: "mock-model",
        choices: [
          {
            index: 0,
            delta: {
              content: "Hallo das ist eine Test-Antwort",
            },
            finish_reason: "stop",
          },
        ],
      }),
    });
  });
}

/**
 * Sets up API response mocking for the chat endpoint with streaming response
 * This simulates the NDJSON streaming response that the app expects
 */
export async function setupChatApiStreamingMock(page: Page) {
  await page.route("**/openrouter.ai/api/v1/chat/completions", async (route) => {
    // Create a streaming response similar to OpenRouter's NDJSON format
    const responseBody = [
      `data: ${JSON.stringify({
        id: "mock-id-1",
        object: "chat.completion.chunk",
        created: Date.now(),
        model: "mock-model",
        choices: [
          {
            index: 0,
            delta: { content: "Hallo" },
            finish_reason: null,
          },
        ],
      })}`,
      `data: ${JSON.stringify({
        id: "mock-id-2",
        object: "chat.completion.chunk",
        created: Date.now(),
        model: "mock-model",
        choices: [
          {
            index: 1,
            delta: { content: " das ist" },
            finish_reason: null,
          },
        ],
      })}`,
      `data: ${JSON.stringify({
        id: "mock-id-3",
        object: "chat.completion.chunk",
        created: Date.now(),
        model: "mock-model",
        choices: [
          {
            index: 2,
            delta: { content: " eine Test-Antwort" },
            finish_reason: null,
          },
        ],
      })}`,
      "data: [DONE]",
    ].join("\n");

    await route.fulfill({
      status: 200,
      contentType: "text/plain",
      body: responseBody,
    });
  });
}
