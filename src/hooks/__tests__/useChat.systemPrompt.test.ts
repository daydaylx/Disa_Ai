import { act, renderHook } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("nanoid", () => ({
  nanoid: () => "user-id",
}));

let chatStreamMock: ReturnType<typeof vi.fn>;
let useChat: typeof import("../useChat").useChat;

function extractMessages(callIndex: number): Array<{ role: string; content: string }> {
  const raw = chatStreamMock.mock.calls[callIndex]?.[0];
  if (Array.isArray(raw)) {
    return raw as Array<{ role: string; content: string }>;
  }
  return [];
}

type HookProps = {
  systemPrompt?: string;
};

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
      ({ systemPrompt }: HookProps) => useChat({ systemPrompt }),
      {
        initialProps: { systemPrompt: undefined } as HookProps,
      },
    );

    await act(async () => {
      await result.current.append({
        role: "user",
        content: "First message",
      });
    });

    expect(chatStreamMock).toHaveBeenCalledTimes(1);
    let messagesArg = extractMessages(0);
    expect(messagesArg.length).toBeGreaterThan(0);
    const firstRunFirst = messagesArg[0];
    if (!firstRunFirst) {
      throw new Error("Expected first message to be defined");
    }
    expect(firstRunFirst).toEqual({ role: "user", content: "First message" });

    chatStreamMock.mockClear();

    rerender({ systemPrompt: "Be concise" });

    await act(async () => {
      await result.current.append({
        role: "user",
        content: "Second message",
      });
    });

    expect(chatStreamMock).toHaveBeenCalledTimes(1);
    messagesArg = extractMessages(0);
    expect(messagesArg.length).toBeGreaterThan(1);
    const secondRunFirst = messagesArg[0];
    if (!secondRunFirst) {
      throw new Error("Expected system prompt message to be defined");
    }
    expect(secondRunFirst).toEqual({ role: "system", content: "Be concise" });
    const secondRunLast = messagesArg[messagesArg.length - 1];
    expect(secondRunLast).toEqual({ role: "user", content: "Second message" });

    chatStreamMock.mockClear();

    rerender({ systemPrompt: "" });

    await act(async () => {
      await result.current.append({
        role: "user",
        content: "Third message",
      });
    });

    expect(chatStreamMock).toHaveBeenCalledTimes(1);
    messagesArg = extractMessages(0);
    expect(messagesArg.length).toBeGreaterThan(1);
    const finalRunFirst = messagesArg[0];
    if (!finalRunFirst) {
      throw new Error("Expected first message to remain defined");
    }
    expect(finalRunFirst).toEqual({ role: "user", content: "First message" });
    expect(messagesArg.some((msg) => msg.role === "system")).toBe(false);
    const finalMessage = messagesArg[messagesArg.length - 1];
    expect(finalMessage).toEqual({ role: "user", content: "Third message" });
  });
});
