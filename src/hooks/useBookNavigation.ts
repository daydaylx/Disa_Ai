import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";

import type { BookNavigationState, ChatSession } from "../types/BookNavigation";
import { useSettings } from "./useSettings";

const MAX_STACK_SIZE = 5;
const STORAGE_KEY = "disa_book_state";

const INITIAL_STATE: BookNavigationState = {
  allChats: [],
  activeChatId: null,
  swipeStack: [],
};

export function useBookNavigation() {
  const [state, setState] = useState<BookNavigationState>(INITIAL_STATE);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTimer, setTransitionTimer] = useState<NodeJS.Timeout | null>(null);
  const { settings } = useSettings();
  const [isInitialized, setIsInitialized] = useState(false);

  // Cleanup transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimer) clearTimeout(transitionTimer);
    };
  }, [transitionTimer]);

  // Initialize: Load from storage
  useEffect(() => {
    if (isInitialized) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.activeChatId && Array.isArray(parsed.swipeStack)) {
          // Reconstruct state from storage
          setState((prev) => ({
            ...prev,
            activeChatId: parsed.activeChatId,
            swipeStack: parsed.swipeStack,
            // allChats we reconstruct based on stack or fetch separately,
            // but for pure navigation logic, stack is primary.
            // We create "stub" sessions for the stack items if needed
            allChats: parsed.swipeStack.map((id: string) => ({
              id,
              title: "Gespeicherte Sitzung",
              createdAt: Date.now(),
              updatedAt: Date.now(),
            })),
          }));
          setIsInitialized(true);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to load book state", e);
    }

    // Fallback: Start new chat
    startNewChat(false);
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewChat = useCallback((animate = true) => {
    const newChatId = nanoid();
    const newChat: ChatSession = {
      id: newChatId,
      title: "Neue Seite",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setState((prev) => {
      // Add to allChats
      const updatedAllChats = [newChat, ...prev.allChats];

      // Update Stack: Add new ID to front
      let newStack = [newChatId, ...prev.swipeStack];

      // Trim Stack if > 5
      if (newStack.length > MAX_STACK_SIZE) {
        newStack = newStack.slice(0, MAX_STACK_SIZE);
      }

      return {
        allChats: updatedAllChats,
        activeChatId: newChatId,
        swipeStack: newStack,
      };
    });

    if (animate) {
      // Trigger transition logic here (or return a flag)
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      setTransitionTimer(timer);
    }
  }, []);

  const navigateToChat = useCallback((chatId: string) => {
    setState((prev) => {
      // If already active, do nothing
      if (prev.activeChatId === chatId) return prev;

      let newStack = prev.swipeStack;
      const existingIndex = newStack.indexOf(chatId);

      if (existingIndex !== -1) {
        // If already in stack, keep it at its position (do NOT reorder)
        return {
          ...prev,
          activeChatId: chatId,
        };
      }

      // Add to front of stack
      newStack = [chatId, ...newStack];

      // Trim Stack if > MAX_STACK_SIZE
      if (newStack.length > MAX_STACK_SIZE) {
        newStack = newStack.slice(0, MAX_STACK_SIZE);
      }

      return {
        ...prev,
        activeChatId: chatId,
        swipeStack: newStack,
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (!prev.activeChatId) return prev;

      const currentIndex = prev.swipeStack.indexOf(prev.activeChatId);
      if (currentIndex === -1 || currentIndex >= prev.swipeStack.length - 1) {
        // Cannot go back (already at end of stack or not in stack)
        return prev;
      }

      const nextId = prev.swipeStack[currentIndex + 1];
      return {
        ...prev,
        activeChatId: nextId ?? null,
      };
    });
  }, []);

  const updateChatId = useCallback((oldId: string, newId: string) => {
    setState((prev) => {
      // Update swipeStack
      const newStack = prev.swipeStack.map((id) => (id === oldId ? newId : id));

      // Update activeChatId if needed
      const newActiveId = prev.activeChatId === oldId ? newId : prev.activeChatId;

      // Update allChats
      const newAllChats = prev.allChats.map((chat) =>
        chat.id === oldId ? { ...chat, id: newId } : chat,
      );

      return {
        ...prev,
        swipeStack: newStack,
        activeChatId: newActiveId,
        allChats: newAllChats,
      };
    });
  }, []);

  // Sync with Storage (Effect)
  useEffect(() => {
    if (state.activeChatId && isInitialized) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeChatId: state.activeChatId,
          swipeStack: state.swipeStack,
        }),
      );
    }
  }, [state.activeChatId, state.swipeStack, isInitialized]);

  return {
    ...state,
    startNewChat,
    navigateToChat,
    goBack,
    updateChatId,
    isTransitioning,
    isInitialized, // Expose initialization status for tests
    settings, // Just to avoid unused var warning for now
  };
}
