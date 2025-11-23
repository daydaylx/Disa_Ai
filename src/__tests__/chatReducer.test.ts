import { describe, expect, it } from "vitest";

import { chatReducer, type ChatState } from "../state/chatReducer";
import type { ChatMessageType } from "../types/chatMessage";

const initialState: ChatState = {
  messages: [],
  input: "",
  isLoading: false,
  error: null,
  abortController: null,
  currentSystemPrompt: undefined,
  requestOptions: null,
};

describe("chatReducer", () => {
  it("should handle ADD_MESSAGE", () => {
    const message: ChatMessageType = {
      id: "1",
      role: "user",
      content: "Hello",
      timestamp: 123456,
    };
    const newState = chatReducer(initialState, { type: "ADD_MESSAGE", message });
    expect(newState.messages).toHaveLength(1);
    expect(newState.messages[0]).toEqual(message);
  });

  it("should handle UPDATE_MESSAGE", () => {
    const message: ChatMessageType = {
      id: "1",
      role: "assistant",
      content: "Initial",
      timestamp: 123456,
    };
    const stateWithMsg: ChatState = { ...initialState, messages: [message] };

    const newState = chatReducer(stateWithMsg, {
      type: "UPDATE_MESSAGE",
      id: "1",
      content: "Updated",
    });

    expect(newState.messages[0]?.content).toBe("Updated");
  });

  it("should ignore UPDATE_MESSAGE if id not found", () => {
    const message: ChatMessageType = {
      id: "1",
      role: "assistant",
      content: "Initial",
      timestamp: 123456,
    };
    const stateWithMsg: ChatState = { ...initialState, messages: [message] };

    const newState = chatReducer(stateWithMsg, {
      type: "UPDATE_MESSAGE",
      id: "999",
      content: "Updated",
    });

    expect(newState.messages[0]?.content).toBe("Initial");
  });

  it("should handle RESET", () => {
    const stateDirty: ChatState = {
      messages: [{ id: "1", role: "user", content: "Hi", timestamp: 1 }],
      input: "foo",
      isLoading: true,
      error: new Error("oops"),
      abortController: new AbortController(),
      currentSystemPrompt: "sys",
      requestOptions: { model: "gpt-4" },
    };

    const newState = chatReducer(stateDirty, { type: "RESET" });

    expect(newState.messages).toHaveLength(0);
    expect(newState.input).toBe("");
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBeNull();
    expect(newState.currentSystemPrompt).toBeUndefined();
  });
});
