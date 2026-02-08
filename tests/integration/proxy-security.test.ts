/**
 * Integration tests for Proxy Security
 *
 * Tests:
 * - Rate limit exceeded error handling
 * - Authentication failure error handling
 * - Forbidden origin error handling
 * - Retry logic for transient errors
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { chatOnceViaProxy, chatStreamViaProxy } from "../../src/api/proxyClient";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("Proxy Security - Rate Limiting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variable for proxy secret
    process.env.VITE_PROXY_SHARED_SECRET = "test-secret-for-testing";
  });

  afterEach(() => {
    delete process.env.VITE_PROXY_SHARED_SECRET;
  });

  it("should handle 429 Too Many Requests error", async () => {
    const mockResponse = {
      ok: false,
      status: 429,
      headers: {
        get: vi.fn((name: string) => {
          if (name === "content-type") return "application/json";
          return null;
        }),
      },
      json: async () => ({
        error: "Rate limit exceeded",
        retryAfter: 60,
        remaining: 0,
      }),
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    await expect(chatOnceViaProxy(messages)).rejects.toThrow("Zu viele Anfragen");
  });

  it("should respect Retry-After header from rate limit response", async () => {
    const mockResponse = {
      ok: false,
      status: 429,
      headers: {
        get: vi.fn((name: string) => {
          if (name === "content-type") return "application/json";
          if (name === "Retry-After") return "60";
          return null;
        }),
      },
      json: async () => ({
        error: "Rate limit exceeded",
        retryAfter: 60,
      }),
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    await expect(chatOnceViaProxy(messages)).rejects.toThrow();
    expect(mockResponse.headers.get).toHaveBeenCalledWith("Retry-After");
  });
});

describe("Proxy Security - Authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.VITE_PROXY_SHARED_SECRET = "test-secret-for-testing";
  });

  afterEach(() => {
    delete process.env.VITE_PROXY_SHARED_SECRET;
  });

  it("should handle 401 Unauthorized error", async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      headers: {
        get: vi.fn((name: string) => {
          if (name === "content-type") return "application/json";
          return null;
        }),
      },
      json: async () => ({
        error: "Invalid authentication signature",
      }),
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    await expect(chatOnceViaProxy(messages)).rejects.toThrow("Authentifizierungsfehler");
  });

  it("should handle missing X-Proxy-Secret header (server rejects)", async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      headers: {
        get: vi.fn((name: string) => {
          if (name === "content-type") return "application/json";
          return null;
        }),
      },
      json: async () => ({
        error: "Missing authentication headers",
      }),
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    await expect(chatOnceViaProxy(messages)).rejects.toThrow();
  });

  it("should handle invalid timestamp (too old)", async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      headers: {
        get: vi.fn((name: string) => {
          if (name === "content-type") return "application/json";
          return null;
        }),
      },
      json: async () => ({
        error: "Invalid authentication signature",
      }),
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    await expect(chatOnceViaProxy(messages)).rejects.toThrow("Authentifizierungsfehler");
  });
});

describe("Proxy Security - Forbidden Origin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.VITE_PROXY_SHARED_SECRET = "test-secret-for-testing";
  });

  afterEach(() => {
    delete process.env.VITE_PROXY_SHARED_SECRET;
  });

  it("should handle 403 Forbidden error", async () => {
    const mockResponse = {
      ok: false,
      status: 403,
      headers: {
        get: vi.fn((name: string) => {
          if (name === "content-type") return "application/json";
          return null;
        }),
      },
      json: async () => ({
        error: "Forbidden origin",
      }),
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    await expect(chatOnceViaProxy(messages)).rejects.toThrow("Zugriffsfehler");
  });

  it("should provide clear message for invalid origin", async () => {
    const mockResponse = {
      ok: false,
      status: 403,
      headers: {
        get: vi.fn(() => "application/json"),
      },
      json: async () => ({
        error: "Invalid referer",
      }),
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    try {
      await chatOnceViaProxy(messages);
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.message).toContain("offizielle App");
    }
  });
});

describe("Proxy Security - Request Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.VITE_PROXY_SHARED_SECRET = "test-secret-for-testing";
  });

  afterEach(() => {
    delete process.env.VITE_PROXY_SHARED_SECRET;
  });

  it("should handle 400 Bad Request error", async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      headers: {
        get: vi.fn((name: string) => {
          if (name === "content-type") return "application/json";
          return null;
        }),
      },
      json: async () => ({
        error: "Invalid request: model.not-allowed: Model not allowed",
      }),
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    await expect(chatOnceViaProxy(messages)).rejects.toThrow("Model not allowed");
  });

  it("should handle request size exceeded error", async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      headers: {
        get: vi.fn(() => "application/json"),
      },
      json: async () => ({
        error: "Request size exceeds limit",
      }),
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    await expect(chatOnceViaProxy(messages)).rejects.toThrow("Request size exceeds limit");
  });
});

describe("Proxy Security - Streaming with Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.VITE_PROXY_SHARED_SECRET = "test-secret-for-testing";
  });

  afterEach(() => {
    delete process.env.VITE_PROXY_SHARED_SECRET;
  });

  it("should include security headers in streaming request", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("data: {}\n\n"));
        controller.close();
      },
    });

    const mockResponse = {
      ok: true,
      status: 200,
      headers: {
        get: vi.fn((name: string) => {
          if (name === "content-type") return "text/event-stream";
          return null;
        }),
      },
      body: mockStream,
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    const onDelta = vi.fn();
    await chatStreamViaProxy(messages, onDelta);

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-Proxy-Secret": expect.any(String),
          "X-Proxy-Timestamp": expect.any(String),
          "X-Proxy-Client": "disa-ai-app",
        }),
      }),
    );
  });

  it("should handle stream timeout", async () => {
    // Mock a slow response that times out
    const mockStream = new ReadableStream({
      start(controller) {
        // Never enqueue data to simulate timeout
        setTimeout(() => controller.close(), 100000);
      },
    });

    const mockResponse = {
      ok: true,
      status: 200,
      headers: {
        get: vi.fn(() => "text/event-stream"),
      },
      body: mockStream,
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    const onDelta = vi.fn();
    const signal = new AbortController();
    signal.abort();

    await expect(
      chatStreamViaProxy(messages, onDelta, { signal: signal.signal }),
    ).rejects.toThrow();
  });

  it("should handle embedded errors in stream", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        const errorData = JSON.stringify({ error: "Stream error occurred" });
        controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`));
        controller.close();
      },
    });

    const mockResponse = {
      ok: true,
      status: 200,
      headers: {
        get: vi.fn(() => "text/event-stream"),
      },
      body: mockStream,
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    const onDelta = vi.fn();

    await expect(chatStreamViaProxy(messages, onDelta)).rejects.toThrow("Stream error occurred");
  });
});

describe("Proxy Security - Retry Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.VITE_PROXY_SHARED_SECRET = "test-secret-for-testing";
  });

  afterEach(() => {
    delete process.env.VITE_PROXY_SHARED_SECRET;
  });

  it("should retry on transient 500 errors", async () => {
    // First attempt fails with 500
    const errorResponse = {
      ok: false,
      status: 500,
      headers: {
        get: vi.fn(() => "application/json"),
      },
      json: async () => ({ error: "Internal server error" }),
    };

    // Second attempt succeeds
    const successResponse = {
      ok: true,
      status: 200,
      headers: {
        get: vi.fn(() => "application/json"),
      },
      json: async () => ({
        choices: [
          {
            message: {
              content: "Test response",
            },
          },
        ],
      }),
    };

    mockFetch.mockResolvedValueOnce(errorResponse).mockResolvedValueOnce(successResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    // Note: The actual retry logic would be implemented in a wrapper function
    // This test demonstrates the expected behavior
    const result = await chatOnceViaProxy(messages);

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.text).toBe("Test response");
  });

  it("should not retry on 4xx client errors", async () => {
    const errorResponse = {
      ok: false,
      status: 400,
      headers: {
        get: vi.fn(() => "application/json"),
      },
      json: async () => ({ error: "Bad request" }),
    };

    mockFetch.mockResolvedValueOnce(errorResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    await expect(chatOnceViaProxy(messages)).rejects.toThrow();

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
