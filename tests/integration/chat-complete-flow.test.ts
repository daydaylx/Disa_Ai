/**
 * Integration test for Chat Complete Flow
 *
 * Tests the complete chat flow:
 * - Send message → Stream response → Stop gracefully
 * - Tests proxy client streaming behavior
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { chatStreamViaProxy } from "../../src/api/proxyClient";
import type { ChatMessage } from "../../src/types/chat";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("Chat Complete Flow - Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    // Mock environment variable for proxy secret
    process.env.VITE_PROXY_SHARED_SECRET = "test-secret-for-testing";
  });

  afterEach(() => {
    delete process.env.VITE_PROXY_SHARED_SECRET;
  });

  describe("Send Message and Stream Response", () => {
    it("should send user message and stream assistant response with multiple deltas", async () => {
      const deltas: string[] = [];
      let onDoneCalled = false;

      const mockResponse = new Response(
        new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            for (const delta of ["Hello", " ", "world", "!"]) {
              await new Promise((resolve) => setTimeout(resolve, 10));
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ choices: [{ delta: { content: delta } }] })}\n\n`,
                ),
              );
            }
            controller.close();
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "text/event-stream",
          },
        },
      );

      mockFetch.mockResolvedValueOnce(mockResponse);

      const messages: ChatMessage[] = [{ role: "user", content: "Hi there!" }];

      await chatStreamViaProxy(
        messages,
        (delta, messageData) => {
          deltas.push(delta);
          if (delta === "Hello" && messageData) {
            expect(messageData.id).toBeTruthy();
            expect(messageData.role).toBe("assistant");
          }
        },
        {
          onDone: (full) => {
            onDoneCalled = true;
            expect(full).toBe("Hello world!");
          },
        },
      );

      expect(deltas).toHaveLength(4);
      expect(onDoneCalled).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should create assistant message with server-provided ID", async () => {
      let messageIdReceived: string | null = null;

      const mockResponse = new Response(
        new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  choices: [
                    {
                      delta: { content: "Response" },
                      message: { id: "server-msg-123", role: "assistant" },
                    },
                  ],
                })}\n\n`,
              ),
            );
            controller.close();
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "text/event-stream",
          },
        },
      );

      mockFetch.mockResolvedValueOnce(mockResponse);

      const messages: ChatMessage[] = [{ role: "user", content: "Test" }];

      await chatStreamViaProxy(messages, (_delta, messageData) => {
        if (messageData?.id) {
          messageIdReceived = messageData.id;
        }
      });

      expect(messageIdReceived).toBe("server-msg-123");
    });
  });

  describe("Stop Streaming Gracefully", () => {
    it("should stop streaming when abort signal is triggered", async () => {
      const deltas: string[] = [];
      const abortController = new AbortController();

      const mockResponse = new Response(
        new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            for (let i = 0; i < 10; i++) {
              if (abortController.signal.aborted) {
                controller.close();
                return;
              }
              await new Promise((resolve) => setTimeout(resolve, 10));
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ choices: [{ delta: { content: `${i}` } }] })}\n\n`,
                ),
              );
            }
            controller.close();
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "text/event-stream",
          },
        },
      );

      mockFetch.mockResolvedValueOnce(mockResponse);

      const messages: ChatMessage[] = [{ role: "user", content: "Count" }];

      // Abort after receiving a few deltas
      setTimeout(() => {
        abortController.abort();
      }, 30);

      try {
        await chatStreamViaProxy(
          messages,
          (delta) => {
            deltas.push(delta);
          },
          { signal: abortController.signal },
        );
      } catch (error) {
        expect(error).toBeInstanceOf(DOMException);
        expect((error as DOMException).name).toBe("AbortError");
      }

      expect(deltas.length).toBeLessThan(10);
      expect(deltas.length).toBeGreaterThan(0);
    });

    it("should handle multiple rapid requests with abort", async () => {
      const firstDeltas: string[] = [];
      const secondDeltas: string[] = [];
      const firstController = new AbortController();
      const secondController = new AbortController();

      let responseCount = 0;
      mockFetch.mockImplementation(
        () =>
          new Response(
            new ReadableStream({
              async start(controller) {
                const encoder = new TextEncoder();
                const delta = responseCount === 0 ? "First" : "Second";
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ choices: [{ delta: { content: delta } }] })}\n\n`,
                  ),
                );
                await new Promise((resolve) => setTimeout(resolve, 10));
                controller.close();
              },
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "text/event-stream",
              },
            },
          ),
      );

      const messages: ChatMessage[] = [{ role: "user", content: "Test" }];

      const firstRequest = chatStreamViaProxy(messages, (delta) => firstDeltas.push(delta), {
        signal: firstController.signal,
      });
      responseCount++;

      await new Promise((resolve) => setTimeout(resolve, 5));

      const secondRequest = chatStreamViaProxy(messages, (delta) => secondDeltas.push(delta), {
        signal: secondController.signal,
      });
      responseCount++;

      await Promise.all([firstRequest, secondRequest]);

      expect(firstDeltas).toHaveLength(1);
      expect(secondDeltas).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("Error Handling in Complete Flow", () => {
    it("should handle network errors gracefully", async () => {
      const networkError = new Error("Network connection failed");
      mockFetch.mockRejectedValueOnce(networkError);

      const messages: ChatMessage[] = [{ role: "user", content: "Error test" }];

      await expect(chatStreamViaProxy(messages, vi.fn())).rejects.toThrow(
        "Network connection failed",
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should handle server errors (500 Internal Server Error)", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          get: vi.fn((name: string) => {
            if (name === "content-type") return "application/json";
            return null;
          }),
        },
        json: async () => ({
          error: "Internal server error",
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const messages: ChatMessage[] = [{ role: "user", content: "Test" }];

      await expect(chatStreamViaProxy(messages, vi.fn())).rejects.toThrow();
    });
  });
});
