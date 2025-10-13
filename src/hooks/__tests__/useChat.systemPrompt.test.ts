import { act, renderHook } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("nanoid", () => ({
  nanoid: () => "user-id",
}));

let chatStreamMock: ReturnType<typeof vi.fn>;
let useChat: typeof import("../useChat").useChat;

vi.mock("../../api/openrouter", () => {
  chatStreamMock = vi.fn();
  return {
    chatStream: (...args: unknown[]) => chatStreamMock(...args),
  };
});

describe("useChat system prompt handling", () => {
  beforeAll(async () => {
    ({ useChat } = await import("../useChat"));
  });

  beforeEach(() => {
    if (!chatStreamMock) {
      throw new Error("chatStreamMock not initialized");
    }
    chatStreamMock.mockReset();
    chatStreamMock.mockImplementation(
      async (
        messages: Array<{ role: string; content: string }>,
        onDelta?: (
          delta: string,
          meta?: { id?: string; role?: string; timestamp?: number; model?: string },
        ) => void,
        opts?: { onDone?: (full: string) => void },
      ) => {
        onDelta?.("assistant response", {
          id: "assistant-id",
          role: "assistant",
          timestamp: Date.now(),
        });
        opts?.onDone?.("assistant response");
        return Promise.resolve(messages);
      },
    );
  });

  it("uses the latest system prompt for subsequent requests", async () => {
    const { result, rerender } = renderHook(
      ({ systemPrompt }: { systemPrompt?: string }) => useChat({ systemPrompt }),
      { initialProps: { systemPrompt: undefined } },
    );

    await act(async () => {
      await result.current.append({
        role: "user",
        content: "First message",
      });
    });

    expect(chatStreamMock).toHaveBeenCalledTimes(1);
    let messagesArg = chatStreamMock.mock.calls[0]?.[0] ?? [];
    expect(messagesArg[0]).toEqual({ role: "user", content: "First message" });

    chatStreamMock.mockClear();

    rerender({ systemPrompt: "Be concise" });

    await act(async () => {
      await result.current.append({
        role: "user",
        content: "Second message",
      });
    });

    expect(chatStreamMock).toHaveBeenCalledTimes(1);
    messagesArg = chatStreamMock.mock.calls[0]?.[0] ?? [];
    expect(messagesArg[0]).toEqual({ role: "system", content: "Be concise" });
    expect(messagesArg.at(-1)).toEqual({ role: "user", content: "Second message" });

    chatStreamMock.mockClear();

    rerender({ systemPrompt: "" });

    await act(async () => {
      await result.current.append({
        role: "user",
        content: "Third message",
      });
    });

    expect(chatStreamMock).toHaveBeenCalledTimes(1);
    messagesArg = chatStreamMock.mock.calls[0]?.[0] ?? [];
    expect(messagesArg[0]).toEqual({ role: "user", content: "First message" });
    expect(messagesArg.some((msg) => msg.role === "system")).toBe(false);
    expect(messagesArg.at(-1)).toEqual({ role: "user", content: "Third message" });
  });
});
