import { beforeEach, describe, expect, it, vi } from "vitest";

import { chatOnce, chatStream } from "../api/openrouter";
import * as proxyClient from "../api/proxyClient";
import * as keyModule from "../lib/openrouter/key";

// Mock the proxy client
vi.mock("../api/proxyClient", () => ({
  chatStreamViaProxy: vi.fn(),
  chatOnceViaProxy: vi.fn(),
}));

// Mock the key module
vi.mock("../lib/openrouter/key", () => ({
  hasApiKey: vi.fn(),
  readApiKey: vi.fn(),
  writeApiKey: vi.fn(),
}));

// Mock fetch for direct API calls
global.fetch = vi.fn();

describe("Proxy Fallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe("chatStream", () => {
    it("should use proxy when no API key is present", async () => {
      // Mock: no API key
      vi.mocked(keyModule.hasApiKey).mockReturnValue(false);

      const messages = [{ role: "user" as const, content: "test" }];
      const onDelta = vi.fn();

      // Call chatStream (should route to proxy)
      await chatStream(messages, onDelta, { model: "test-model" });

      // Verify proxy was called
      expect(proxyClient.chatStreamViaProxy).toHaveBeenCalledWith(
        messages,
        onDelta,
        expect.objectContaining({
          model: "test-model",
        }),
      );

      // Verify direct API was not called
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should use direct API when API key is present", async () => {
      // Mock: API key is present
      vi.mocked(keyModule.hasApiKey).mockReturnValue(true);
      vi.mocked(keyModule.readApiKey).mockReturnValue("sk-or-test-key");

      // Mock fetch for successful streaming response
      const mockReader = {
        read: vi
          .fn()
          .mockResolvedValueOnce({
            value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"test"}}]}\n'),
            done: false,
          })
          .mockResolvedValueOnce({
            value: new TextEncoder().encode("data: [DONE]\n"),
            done: false,
          })
          .mockResolvedValueOnce({ done: true }),
        releaseLock: vi.fn(),
      };

      const mockResponse = {
        ok: true,
        body: {
          getReader: () => mockReader,
          cancel: vi.fn().mockResolvedValue(undefined),
        },
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const messages = [{ role: "user" as const, content: "test" }];
      const onDelta = vi.fn();

      // Call chatStream (should use direct API)
      await chatStream(messages, onDelta, { model: "test-model" });

      // Verify direct API was called
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("openrouter.ai"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer sk-or-test-key",
          }),
        }),
      );

      // Verify proxy was not called
      expect(proxyClient.chatStreamViaProxy).not.toHaveBeenCalled();
    });
  });

  describe("chatOnce", () => {
    it("should use proxy when no API key is present", async () => {
      // Mock: no API key
      vi.mocked(keyModule.hasApiKey).mockReturnValue(false);
      vi.mocked(proxyClient.chatOnceViaProxy).mockResolvedValue({
        text: "proxy response",
        raw: {},
      });

      const messages = [{ role: "user" as const, content: "test" }];

      // Call chatOnce (should route to proxy)
      const result = await chatOnce(messages, { model: "test-model" });

      // Verify proxy was called
      expect(proxyClient.chatOnceViaProxy).toHaveBeenCalledWith(
        messages,
        expect.objectContaining({
          model: "test-model",
        }),
      );

      // Verify result
      expect(result.text).toBe("proxy response");

      // Verify direct API was not called
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should use direct API when API key is present", async () => {
      // Mock: API key is present
      vi.mocked(keyModule.hasApiKey).mockReturnValue(true);
      vi.mocked(keyModule.readApiKey).mockReturnValue("sk-or-test-key");

      // Mock fetch for successful response with proper headers
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({
          "content-type": "application/json",
        }),
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: "direct response" } }],
          }),
      } as any);

      const messages = [{ role: "user" as const, content: "test" }];

      // Call chatOnce (should use direct API)
      const result = await chatOnce(messages, { model: "test-model" });

      // Verify direct API was called
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("openrouter.ai"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer sk-or-test-key",
          }),
        }),
      );

      // Verify result
      expect(result.text).toBe("direct response");

      // Verify proxy was not called
      expect(proxyClient.chatOnceViaProxy).not.toHaveBeenCalled();
    });
  });
});
