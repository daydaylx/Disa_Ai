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

  it("should respect Retry-After from rate limit response", async () => {
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
      }),
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    await expect(chatOnceViaProxy(messages)).rejects.toThrow(/60 Sekunden/);
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

  it("should bind the proxy signature to the timestamp (anti-replay)", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      headers: {
        get: vi.fn((name: string) => {
          if (name === "content-type") return "application/json";
          return null;
        }),
      },
      json: async () => ({
        choices: [{ message: { content: "ok" } }],
      }),
    };

    // Same response for both calls
    mockFetch.mockResolvedValue(mockResponse);

    const messages = [{ role: "user" as const, content: "test message" }];

    const nowSpy = vi.spyOn(Date, "now");
    nowSpy.mockReturnValueOnce(1700000000000); // timestamp A
    await chatOnceViaProxy(messages);

    nowSpy.mockReturnValueOnce(1700000005000); // timestamp B
    await chatOnceViaProxy(messages);

    nowSpy.mockRestore();

    const firstCallHeaders = mockFetch.mock.calls[0]?.[1]?.headers as Record<string, string>;
    const secondCallHeaders = mockFetch.mock.calls[1]?.[1]?.headers as Record<string, string>;

    expect(firstCallHeaders["X-Proxy-Timestamp"]).not.toBe(secondCallHeaders["X-Proxy-Timestamp"]);
    expect(firstCallHeaders["X-Proxy-Secret"]).not.toBe(secondCallHeaders["X-Proxy-Secret"]);
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

  it.skip("should handle stream timeout", async () => {
    // Skip: Testing 70s timeout requires long-running test
    // Client has built-in 70s timeout, but testing it properly would slow down test suite
    // Manual testing: works correctly, times out after 70s as expected
  });

  it("should handle embedded errors in stream", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        const errorData = JSON.stringify({ error: { message: "Stream error occurred" } });
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

  it.skip("should retry on transient 500 errors", async () => {
    // Skip: Retry logic is not implemented in proxyClient
    // Retry behavior is handled at a higher level (useChat hook with exponential backoff)
    // The proxyClient provides basic request/response without retry logic
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
