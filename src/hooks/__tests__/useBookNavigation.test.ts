import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useBookNavigation } from "../useBookNavigation";

// Mock useSettings
vi.mock("../useSettings", () => ({
  useSettings: () => ({
    settings: {
      creativity: 45,
    },
  }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useBookNavigation", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useBookNavigation());

    // It might start a new chat automatically on mount if state is empty
    expect(result.current.activeChatId).toBeTruthy();
    expect(result.current.swipeStack.length).toBe(1);
    expect(result.current.allChats.length).toBe(1);
  });

  it("should start a new chat and add it to the stack", () => {
    const { result } = renderHook(() => useBookNavigation());
    const initialId = result.current.activeChatId;

    act(() => {
      result.current.startNewChat();
    });

    const newId = result.current.activeChatId;

    expect(newId).not.toBe(initialId);
    expect(result.current.swipeStack[0]).toBe(newId);
    // Stack should contain [newId, initialId] (if initial was valid)
    expect(result.current.swipeStack).toContain(newId);
    expect(result.current.allChats.find((c) => c.id === newId)).toBeTruthy();
  });

  it("should limit stack size to 5", () => {
    const { result } = renderHook(() => useBookNavigation());

    // Create 6 chats (1 initial + 5 new)
    for (let i = 0; i < 6; i++) {
      act(() => {
        result.current.startNewChat();
      });
    }

    expect(result.current.swipeStack.length).toBe(5);
    // allChats should keep growing
    expect(result.current.allChats.length).toBeGreaterThan(5);
  });

  it("should navigate back correctly (goBack)", () => {
    const { result } = renderHook(() => useBookNavigation());
    const firstId = result.current.activeChatId;

    act(() => {
      result.current.startNewChat();
    });
    const secondId = result.current.activeChatId;

    // Stack should be [secondId, firstId]
    expect(result.current.swipeStack[0]).toBe(secondId);
    expect(result.current.swipeStack[1]).toBe(firstId);

    act(() => {
      result.current.goBack();
    });

    expect(result.current.activeChatId).toBe(firstId);
  });

  it("should update chat ID correctly", () => {
    const { result } = renderHook(() => useBookNavigation());
    const oldId = result.current.activeChatId!;

    const newId = "saved-id-123";

    act(() => {
      result.current.updateChatId(oldId, newId);
    });

    expect(result.current.activeChatId).toBe(newId);
    expect(result.current.swipeStack).toContain(newId);
    expect(result.current.swipeStack).not.toContain(oldId);
    expect(result.current.allChats.find((c) => c.id === newId)).toBeTruthy();
  });

  it("should navigate to an archived chat and bring it to stack front", () => {
    const { result } = renderHook(() => useBookNavigation());

    // Fill stack
    act(() => {
      result.current.startNewChat();
    });
    act(() => {
      result.current.startNewChat();
    });
    act(() => {
      result.current.startNewChat();
    });
    act(() => {
      result.current.startNewChat();
    });
    act(() => {
      result.current.startNewChat();
    });
    // At this point we have 6 chats total (1 initial + 5 new).
    // Stack has 5. The initial one is kicked out (archived).

    // Let's find a chat that is NOT in the stack.
    // Since we create them sequentially, the oldest (last in allChats) should be out.
    const allChatIds = result.current.allChats.map((c) => c.id);
    const stackIds = result.current.swipeStack;
    const archivedId = allChatIds.find((id) => !stackIds.includes(id));

    expect(archivedId).toBeDefined();

    if (archivedId) {
      act(() => {
        result.current.navigateToChat(archivedId);
      });

      expect(result.current.activeChatId).toBe(archivedId);
      expect(result.current.swipeStack[0]).toBe(archivedId);
      expect(result.current.swipeStack.length).toBe(5); // Should remain max 5
    }
  });
});
