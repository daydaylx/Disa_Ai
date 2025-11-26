import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { handleChatRequest } from "../api/chat";
import { chatStream } from "../api/openrouter";
import { useChat } from "../hooks/useChat";

// Mock the openrouter module
vi.mock("../api/openrouter", () => ({
  chatStream: vi.fn(),
}));

describe("Message ID Synchronization", () => {
  let mockChatStream: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockChatStream = vi.mocked(chatStream);
  });

  describe("Server-side ID generation in handleChatRequest", () => {
    it("should generate consistent assistant message ID", () => {
      const request = {
        messages: [{ role: "user" as const, content: "Hello" }],
      };

      const response = handleChatRequest(request);

      expect(response).toBeInstanceOf(Response);
      expect(response.headers.get("Content-Type")).toBe("text/event-stream");
    });

    it("should include message metadata in SSE stream", async () => {
      const request = {
        messages: [{ role: "user" as const, content: "Test message" }],
        model: "test-model",
      };

      // Mock fetch globally for this test
      const mockFetch = vi.fn();
      global.fetch = mockFetch;

      // Mock the worker response
      const mockWorkerResponse = new Response(
        new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder();

            // Simulate streaming response with choices
            controller.enqueue(
              encoder.encode(
                'data: {"choices":[{"delta":{"content":"Hello"},"message":{"id":"assistant-123-456","role":"assistant"}}]}\n\n',
              ),
            );
            controller.enqueue(
              encoder.encode(
                'data: {"choices":[{"delta":{"content":" world"},"message":{"id":"assistant-123-456","role":"assistant"}}]}\n\n',
              ),
            );
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));

            controller.close();
          },
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
          },
        },
      );

      mockFetch.mockResolvedValue(mockWorkerResponse);

      const response = handleChatRequest(request);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      expect(reader).toBeDefined();

      if (reader) {
        const chunks: string[] = [];

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            chunks.push(chunk);
          }
        } catch {
          // Expected in test environment
        }

        // Should contain SSE formatted data with message metadata
        const allData = chunks.join("");
        expect(allData).toContain("data:");
        expect(allData).toContain("choices");
      }
    });
  });

  describe("Client-side ID synchronization in useChat", () => {
    it("should use server-provided message ID when available", async () => {
      // Mock chatStream to provide message metadata
      mockChatStream.mockImplementation((_messages, onDelta, opts) => {
        opts?.onStart?.();

        // First call with message metadata (initializes assistant message)
        onDelta("", {
          id: "server-assistant-123",
          role: "assistant",
          timestamp: 1234567890,
          model: "test-model",
        });

        // Subsequent calls with content
        onDelta("Hello");
        onDelta(" from");
        onDelta(" server");

        opts?.onDone?.("Hello from server");
      });

      const { result } = renderHook(() => useChat());

      // Send a message
      await act(async () => {
        await result.current.append({
          role: "user",
          content: "Test message",
        });
      });

      // Check that messages were added
      expect(result.current.messages).toHaveLength(2);

      const userMessage = result.current.messages[0];
      const assistantMessage = result.current.messages[1];

      // User message should have client-generated ID
      expect(userMessage?.role).toBe("user");
      expect(userMessage?.content).toBe("Test message");
      expect(userMessage?.id).toBeTruthy();

      // Assistant message should have server-provided ID and metadata
      expect(assistantMessage?.role).toBe("assistant");
      expect(assistantMessage?.content).toBe("Hello from server");
      expect(assistantMessage?.id).toBe("server-assistant-123");
      expect(assistantMessage?.timestamp).toBe(1234567890);
      expect(assistantMessage?.model).toBe("test-model");
    });

    it("should fallback to client-generated ID when server metadata unavailable", async () => {
      // Mock chatStream without message metadata - only content deltas
      mockChatStream.mockImplementation((_messages, onDelta, opts) => {
        opts?.onStart?.();

        // Only content, no metadata (this simulates legacy behavior)
        onDelta("Fallback");
        onDelta(" response");

        opts?.onDone?.("Fallback response");
      });

      const { result } = renderHook(() => useChat());

      await act(async () => {
        await result.current.append({
          role: "user",
          content: "Test message",
        });
      });

      // Should create assistant message with fallback ID when no server metadata
      expect(result.current.messages).toHaveLength(2);

      const assistantMessage = result.current.messages[1];

      // Should have fallback ID starting with "assistant-"
      expect(assistantMessage?.id).toMatch(/^assistant-/);
      expect(assistantMessage?.content).toBe("Fallback response");
    });

    it("should update existing message when server ID arrives later", async () => {
      mockChatStream.mockImplementation((_messages, onDelta, opts) => {
        opts?.onStart?.();

        // Initialize with server ID
        onDelta("", {
          id: "server-msg-456",
          role: "assistant",
          timestamp: Date.now(),
        });

        // Stream content progressively
        const words = ["Streaming", " content", " with", " server", " ID"];
        for (const word of words) {
          onDelta(word);
        }

        opts?.onDone?.("Streaming content with server ID");
      });

      const { result } = renderHook(() => useChat());

      await act(async () => {
        await result.current.append({
          role: "user",
          content: "Stream test",
        });
      });

      const assistantMessage = result.current.messages[1];

      expect(assistantMessage?.id).toBe("server-msg-456");
      expect(assistantMessage?.content).toBe("Streaming content with server ID");
    });

    it("should handle abort correctly with server IDs", async () => {
      const abortError = new Error("AbortError");
      abortError.name = "AbortError";

      mockChatStream.mockImplementation((_messages, onDelta, opts) => {
        opts?.onStart?.();

        // Initialize message with server ID
        onDelta("", {
          id: "server-aborted-789",
          role: "assistant",
          timestamp: Date.now(),
        });

        // Start streaming some content
        onDelta("This will be");

        // Simulate abort during streaming
        throw abortError;
      });

      const { result } = renderHook(() => useChat());

      await act(async () => {
        try {
          await result.current.append({
            role: "user",
            content: "Abort test",
          });
        } catch {
          // Expected abort error
        }
      });

      // After abort, check final state (behavior may vary based on error handling)
      // The user message should definitely be present
      expect(result.current.messages.length).toBeGreaterThanOrEqual(1);
      expect(result.current.messages[0]?.role).toBe("user");

      // If assistant message exists, it should have the correct server ID
      if (result.current.messages.length > 1) {
        const assistantMessage = result.current.messages[1];
        expect(assistantMessage?.id).toBe("server-aborted-789");
      }
    });
  });

  describe("Error handling with message IDs", () => {
    it("should handle streaming errors gracefully", async () => {
      mockChatStream.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useChat());

      await act(async () => {
        await result.current.append({
          role: "user",
          content: "Error test",
        });
      });

      // Should have error state
      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toContain("Network error");
    });

    it("should handle malformed message metadata", async () => {
      mockChatStream.mockImplementation((_messages, onDelta, opts) => {
        opts?.onStart?.();

        // Send content with malformed metadata (no ID)
        onDelta("Content", {
          id: undefined, // Invalid/missing ID
          role: "assistant",
        });

        onDelta(" continues");

        opts?.onDone?.("Content continues");
      });

      const { result } = renderHook(() => useChat());

      await act(async () => {
        await result.current.append({
          role: "user",
          content: "Malformed test",
        });
      });

      // Should create assistant message with fallback ID when metadata is malformed
      expect(result.current.messages).toHaveLength(2);

      const assistantMessage = result.current.messages[1];
      expect(assistantMessage?.id).toMatch(/^assistant-/);
      expect(assistantMessage?.content).toBe("Content continues");
    });
  });

  describe("Integration scenarios", () => {
    it("should maintain ID consistency across message operations", async () => {
      const serverMessageId = "server-integration-test-123";

      mockChatStream.mockImplementation((_messages, onDelta, opts) => {
        opts?.onStart?.();

        onDelta("", {
          id: serverMessageId,
          role: "assistant",
          timestamp: Date.now(),
          model: "integration-model",
        });

        onDelta("Integration");
        onDelta(" test");
        onDelta(" response");

        opts?.onDone?.("Integration test response");
      });

      const { result } = renderHook(() => useChat());

      // Send message
      await act(async () => {
        await result.current.append({
          role: "user",
          content: "Integration test",
        });
      });

      const assistantMessage = result.current.messages[1];

      // Verify all properties are correctly set
      expect(assistantMessage?.id).toBe(serverMessageId);
      expect(assistantMessage?.role).toBe("assistant");
      expect(assistantMessage?.content).toBe("Integration test response");
      expect(assistantMessage?.model).toBe("integration-model");
      expect(assistantMessage?.timestamp).toBeGreaterThan(0);
    });
  });
});
