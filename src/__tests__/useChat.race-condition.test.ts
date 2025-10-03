import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { type ChatMessageType } from "../components/chat/ChatMessage";
import { useChat } from "../hooks/useChat";

// Mock the chatStream function
vi.mock("../api/openrouter", () => ({
  chatStream: vi.fn(async (messages, onDelta, options) => {
    // Simulate streaming response
    await new Promise((resolve) => setTimeout(resolve, 10));
    onDelta("Hello");
    await new Promise((resolve) => setTimeout(resolve, 10));
    onDelta(" World");
    options?.onDone?.();
  }),
}));

describe("useChat Race Condition Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should capture state atomically at function call time", () => {
    const { result } = renderHook(() => useChat());

    // Set initial messages
    act(() => {
      result.current.setMessages([
        { id: "1", role: "user", content: "Initial message", timestamp: Date.now() },
        { id: "2", role: "assistant", content: "Initial response", timestamp: Date.now() },
      ]);
    });

    const _initialMessageCount = result.current.messages.length;

    // Verify that append captures state atomically
    act(() => {
      // Start append operation
      const appendPromise = result.current.append({
        role: "user" as const,
        content: "Test message",
      });

      // The append function should have captured the state at call time
      // Even if we modify the state now, the API call should use the captured state
      result.current.setMessages([]);

      await appendPromise;
    });

    // The append operation should have completed successfully
    // using the captured state, not the empty state we set
    expect(result.current.messages.length).toBeGreaterThan(0);

    // Should contain both user and assistant messages
    const userMessages = result.current.messages.filter((msg) => msg.role === "user");
    const assistantMessages = result.current.messages.filter((msg) => msg.role === "assistant");

    expect(userMessages.length).toBeGreaterThan(0);
    expect(assistantMessages.length).toBeGreaterThan(0);
  });

  it("should handle reload operation with atomic state capture", () => {
    const { result } = renderHook(() => useChat());

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
    act(() => {
      result.current.reload();
    });

    // The reload should have re-triggered from the last user message
    const userMessages = result.current.messages.filter((msg) => msg.role === "user");
    const lastUserMessage = userMessages[userMessages.length - 1];

    // Should still contain "Question 2" as the last user message
    expect(lastUserMessage?.content).toBe("Question 2");

    // Should have assistant responses
    const assistantMessages = result.current.messages.filter((msg) => msg.role === "assistant");
    expect(assistantMessages.length).toBeGreaterThan(0);
  });

  it("should prevent stale state access in error handling", () => {
    const { result } = renderHook(() => useChat());

    // Mock chatStream to throw an AbortError
    const { chatStream } = await import("../api/openrouter");
    vi.mocked(chatStream).mockRejectedValueOnce(new DOMException("Aborted", "AbortError"));

    const initialMessages: ChatMessageType[] = [
      { id: "1", role: "user", content: "Base message", timestamp: Date.now() },
    ];

    act(() => {
      result.current.setMessages(initialMessages);
    });

    // Start append operation that will be aborted
    act(() => {
      try {
        result.current.append({
          role: "user" as const,
          content: "Message that will be aborted",
        });
      } catch {
        // Expected to be aborted
      }
    });

    // Verify that error handling used captured state, not current state
    const messages = result.current.messages;
    expect(messages.every((msg) => msg && msg.id && msg.content)).toBe(true);

    // Should still have the original base message
    expect(messages.some((msg) => msg.content === "Base message")).toBe(true);
  });
});
