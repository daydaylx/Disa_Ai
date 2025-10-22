import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useChat } from "../../src/hooks/useChat";

// Mock the dependencies
vi.mock("../../src/lib/openrouter", () => ({
  chatStream: vi.fn(),
}));

// Mock crypto.randomUUID
Object.defineProperty(global.crypto, "randomUUID", {
  value: vi.fn(() => "mocked-uuid"),
});

describe("useChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty messages", () => {
    const { result } = renderHook(() => useChat());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should add a user message when appending", async () => {
    const { result } = renderHook(() => useChat());

    const testMessage = { role: "user", content: "Hello, world!" };
    result.current.append(testMessage);

    // Check that the user message was added
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].role).toBe("user");
      expect(result.current.messages[0].content).toBe(testMessage.content);
    });
  });

  it("should handle streaming response correctly", async () => {
    // Mock the chatStream to simulate a response
    const mockStream = await vi.importMock("../../src/lib/openrouter");
    const mockResponse = {
      [Symbol.asyncIterator]: () => {
        const chunks = [
          { type: "content", content: "Hello" },
          { type: "content", content: " world!" },
          { type: "done" },
        ];
        let index = 0;
        return {
          next: async () => {
            if (index < chunks.length) {
              return { value: chunks[index++], done: false };
            }
            return { value: undefined, done: true };
          },
        };
      },
    };
    mockStream.chatStream.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChat());

    const testMessage = { role: "user", content: "Hello" };
    result.current.append(testMessage);

    // Wait for the stream to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check that we have both user and assistant messages
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].role).toBe("user");
    expect(result.current.messages[1].role).toBe("assistant");
    expect(result.current.messages[1].content).toBe("Hello world!");
  });

  it("should handle errors during streaming", async () => {
    // Mock the chatStream to simulate an error
    const mockStream = await vi.importMock("../../src/lib/openrouter");
    const mockErrorStream = {
      [Symbol.asyncIterator]: () => {
        return {
          next: async () => {
            return { value: { type: "error", error: "RATE_LIMITED" }, done: true };
          },
        };
      },
    };
    mockStream.chatStream.mockResolvedValue(mockErrorStream);

    const { result } = renderHook(() => useChat());

    const testMessage = { role: "user", content: "Hello" };
    result.current.append(testMessage);

    // Wait for the error to be handled
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
