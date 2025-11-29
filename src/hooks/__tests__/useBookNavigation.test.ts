import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useBookNavigation } from "../useBookNavigation";

// Mock useSettings
vi.mock("../useSettings", () => ({
  useSettings: () => ({
    settings: { reduceMotion: false },
  }),
}));

describe("useBookNavigation", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });
  it("should initialize with default state", () => {
    const { result } = renderHook(() => useBookNavigation());

    // Initially starts a new chat if empty
    expect(result.current.allChats).toHaveLength(1);
    expect(result.current.swipeStack).toHaveLength(1);
    expect(result.current.activeChatId).toBeDefined();
  });

  it("should start a new chat and add to stack", () => {
    const { result } = renderHook(() => useBookNavigation());
    const initialId = result.current.activeChatId;

    act(() => {
      result.current.startNewChat();
    });

    expect(result.current.activeChatId).not.toBe(initialId);
    expect(result.current.swipeStack).toHaveLength(2);
    expect(result.current.swipeStack[0]).toBe(result.current.activeChatId);
  });

  it("should limit stack size to 5", () => {
    const { result } = renderHook(() => useBookNavigation());

    // Add 6 chats (initial + 5 new)
    for (let i = 0; i < 6; i++) {
      act(() => {
        result.current.startNewChat();
      });
    }

    expect(result.current.swipeStack).toHaveLength(5);
    expect(result.current.allChats.length).toBeGreaterThan(5); // All chats should be kept
  });

  it("should navigate back correctly", () => {
    const { result } = renderHook(() => useBookNavigation());

    // Create Chat A
    const idA = result.current.activeChatId;

    // Create Chat B
    act(() => {
      result.current.startNewChat();
    });
    const idB = result.current.activeChatId;

    // Check Stack: [B, A]
    expect(result.current.swipeStack[0]).toBe(idB);
    expect(result.current.swipeStack[1]).toBe(idA);

    // Go Back
    act(() => {
      result.current.goBack();
    });

    expect(result.current.activeChatId).toBe(idA);
  });

  it("should not go back if at end of stack", () => {
    const { result } = renderHook(() => useBookNavigation());
    act(() => {
      result.current.startNewChat(); // Chat B
    });
    // Stack: [B, A]
    act(() => {
      result.current.goBack(); // Go back to A
    });
    const currentActiveId = result.current.activeChatId; // This should be A

    act(() => {
      result.current.goBack(); // Try to go back again
    });

    expect(result.current.activeChatId).toBe(currentActiveId);
  });

  it("should update chat ID correctly", () => {
    const { result } = renderHook(() => useBookNavigation());
    const oldId = result.current.activeChatId!;
    const newId = "persistent-id-123";

    act(() => {
      result.current.updateChatId(oldId, newId);
    });

    expect(result.current.activeChatId).toBe(newId);
    expect(result.current.swipeStack).toContain(newId);
    expect(result.current.swipeStack).not.toContain(oldId);
  });

  it("should handle navigation to existing chat", () => {
    const { result } = renderHook(() => useBookNavigation());
    const idA = result.current.activeChatId!;

    act(() => {
      result.current.startNewChat();
    });
    const idB = result.current.activeChatId!;

    // Stack: [B, A]

    act(() => {
      // Simulate navigating to A via some other UI (e.g. history)
      // Ideally navigateToChat handles stack reordering if logic requires it,
      // but current implementation pushes to front if not in stack, or just activates.
      // Let's see current implementation:
      // "If already active, do nothing"
      // "Check if in stack... if !isInStack add to front"
      // If in stack, it just sets activeChatId but DOES NOT reorder stack?
      // Let's check code behavior.
      result.current.navigateToChat(idA);
    });

    expect(result.current.activeChatId).toBe(idA);
    // Stack should remain [B, A] if we don't reorder on navigation?
    // Or should it move A to front?
    // The requirement says: "Wenn bereits enthalten -> an Position belassen."
    expect(result.current.swipeStack).toEqual([idA, idB]);
  });
});
