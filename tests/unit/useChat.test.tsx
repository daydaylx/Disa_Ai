import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { chatStream } from "../../src/api/openrouter";
import { useChat } from "../../src/hooks/useChat";

// Mock the dependencies
vi.mock("../../src/api/openrouter", () => ({
  chatStream: vi.fn(),
}));

// Mock crypto.randomUUID
Object.defineProperty(global.crypto, "randomUUID", {
  value: vi.fn(() => "mocked-uuid"),
});

describe("useChat", () => {
  let mockChatStream: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockChatStream = vi.mocked(chatStream);
  });

  it("should initialize with empty messages", () => {
    const { result } = renderHook(() => useChat());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should add a user message when appending", async () => {
    const { result } = renderHook(() => useChat());

    const testMessage = { role: "user" as const, content: "Hello, world!" };
    result.current.append(testMessage);

    // Check that the user message was added
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0]?.role).toBe("user");
      expect(result.current.messages[0]?.content).toBe(testMessage.content);
    });
  });

  it("should handle streaming response correctly", async () => {
    // Mock the chatStream to simulate a response
    mockChatStream.mockImplementation((_messages, onDelta, opts) => {
      opts?.onStart?.();

      // Initialize the assistant message
      onDelta("", {
        id: "assistant-123",
        role: "assistant",
        timestamp: Date.now(),
      });

      // Stream the content
      onDelta("Hello");
      onDelta(" world!");

      opts?.onDone?.("Hello world!");
    });

    const { result } = renderHook(() => useChat());

    const testMessage = { role: "user" as const, content: "Hello" };

    await act(async () => {
      await result.current.append(testMessage);
    });

    // Check that we have both user and assistant messages
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]?.role).toBe("user");
    expect(result.current.messages[1]?.role).toBe("assistant");
    expect(result.current.messages[1]?.content).toBe("Hello world!");
  });

  it("should handle errors during streaming", async () => {
    // Mock the chatStream to simulate an error
    const error = new Error("RATE_LIMITED");
    mockChatStream.mockRejectedValue(error);

    const { result } = renderHook(() => useChat());

    const testMessage = { role: "user" as const, content: "Hello" };
    result.current.append(testMessage);

    // Wait for the error to be handled
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
