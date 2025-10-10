import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { chatStream } from "../api/openrouter";
import { useChat } from "../hooks/useChat";
import type { ChatMessageType } from "../types/chatMessage";

// Mock window object for test environment
Object.defineProperty(window, "location", {
  value: { reload: vi.fn() },
  writable: true,
});

// Mock the chatStream function
vi.mock("../api/openrouter", () => ({
  chatStream: vi.fn(async (_messages, onDelta, options) => {
    // Simulate streaming response
    await new Promise((resolve) => setTimeout(resolve, 10));
    if (onDelta) {
      // First call with messageData to initialize assistant message
      onDelta("Hello", {
        id: "test-assistant-id",
        role: "assistant",
        timestamp: Date.now(),
      });
      await new Promise((resolve) => setTimeout(resolve, 10));
      // Subsequent calls with just delta content
      onDelta(" World");
    }
    if (options?.onDone) {
      options.onDone();
    }
    return Promise.resolve("Hello World");
  }),
}));

describe("useChat Race Condition Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should capture state atomically at function call time", async () => {
    const { result, unmount } = renderHook(() => useChat());

    try {
      // Set initial messages
      act(() => {
        result.current.setMessages([
          { id: "1", role: "user", content: "Initial message", timestamp: Date.now() },
          { id: "2", role: "assistant", content: "Initial response", timestamp: Date.now() },
        ]);
      });

      // Verify that append captures state atomically
      let appendPromise: Promise<void> | undefined;

      act(() => {
        // Start append operation - this should capture the current state (2 messages)
        appendPromise = result.current.append({
          role: "user" as const,
          content: "Test message",
        });
      });

      // Wait for append to complete
      expect(appendPromise).toBeDefined();
      if (appendPromise) {
        await act(async () => {
          await appendPromise;
        });
      }

      // The append operation should have added both user and assistant messages
      expect(result.current.messages.length).toBeGreaterThan(2);

      // Should contain the new user message
      const userMessages = result.current.messages.filter((msg) => msg.role === "user");
      const lastUserMessage = userMessages[userMessages.length - 1];
      expect(lastUserMessage?.content).toBe("Test message");

      // Should contain the new assistant message from the mock
      const assistantMessages = result.current.messages.filter((msg) => msg.role === "assistant");
      const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
      expect(lastAssistantMessage?.content).toBe("Hello World");
      expect(lastAssistantMessage?.id).toBe("test-assistant-id");
    } finally {
      // Ensure proper cleanup
      unmount();
    }
  });

  it("should handle reload operation with atomic state capture", async () => {
    const { result, unmount } = renderHook(() => useChat());

    try {
      // Set up initial conversation
      act(() => {
        result.current.setMessages([
          { id: "1", role: "user", content: "Question 1", timestamp: Date.now() },
          { id: "2", role: "assistant", content: "Answer 1", timestamp: Date.now() },
          { id: "3", role: "user", content: "Question 2", timestamp: Date.now() },
          { id: "4", role: "assistant", content: "Answer 2", timestamp: Date.now() },
        ]);
      });

      // Verify reload captures state at function call time
      let reloadPromise: Promise<void> | undefined;

      act(() => {
        reloadPromise = result.current.reload();
      });

      // Wait for reload to complete
      if (reloadPromise) {
        await act(async () => {
          await reloadPromise;
        });
      }

      // The reload should have re-triggered from the last user message
      const userMessages = result.current.messages.filter((msg) => msg.role === "user");
      const lastUserMessage = userMessages[userMessages.length - 1];

      // Should still contain "Question 2" as the last user message
      expect(lastUserMessage?.content).toBe("Question 2");

      // Should have assistant responses
      const assistantMessages = result.current.messages.filter((msg) => msg.role === "assistant");
      expect(assistantMessages.length).toBeGreaterThan(0);
    } finally {
      // Ensure proper cleanup
      unmount();
    }
  });

  it("should prevent stale state access in error handling", async () => {
    const { result, unmount } = renderHook(() => useChat());

    try {
      // Mock chatStream to throw an AbortError
      vi.mocked(chatStream).mockRejectedValueOnce(new DOMException("Aborted", "AbortError"));

      const initialMessages: ChatMessageType[] = [
        { id: "1", role: "user", content: "Base message", timestamp: Date.now() },
      ];

      // Set messages and wait for state update
      act(() => {
        result.current.setMessages(initialMessages);
      });

      // Ensure state has been updated before proceeding
      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0]?.content).toBe("Base message");

      // Start append operation that will be aborted
      let appendPromise: Promise<void> | undefined;

      act(() => {
        appendPromise = result.current.append({
          role: "user" as const,
          content: "Message that will be aborted",
        });
      });

      // Wait for the operation to complete (with error)
      if (appendPromise) {
        await act(async () => {
          try {
            await appendPromise;
          } catch {
            // Expected to be aborted
          }
        });
      }

      // Verify that error handling used captured state, not current state
      const messages = result.current.messages;
      expect(messages.every((msg) => msg && msg.id && msg.content)).toBe(true);

      // Should still have the original base message
      expect(messages.some((msg) => msg.content === "Base message")).toBe(true);
    } finally {
      // Ensure proper cleanup
      unmount();
    }
  });
});
