import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";

import type { BookNavigationState, ChatSession } from "../types/BookNavigation";
import { useSettings } from "./useSettings";

const MAX_STACK_SIZE = 5;

// Mock initial state for dev/testing if empty
const INITIAL_STATE: BookNavigationState = {
  allChats: [],
  activeChatId: null,
  swipeStack: [],
};

export function useBookNavigation() {
  const [state, setState] = useState<BookNavigationState>(INITIAL_STATE);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { settings } = useSettings();

  // Initialize: Load from storage
  useEffect(() => {
    // This part requires access to the storage layer to load all chats and the swipe stack.
    // For now, we assume we have methods to get this data.

    const loadState = () => {
      // TODO: Load real data from storage
      // For now, we initialize with a single empty chat if nothing exists
      if (state.activeChatId === null) {
        startNewChat(false); // Don't animate initial load
      }
    };
    loadState();
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
      setTimeout(() => setIsTransitioning(false), 300); // Reset after animation
    }
  }, []);

  const navigateToChat = useCallback((chatId: string) => {
    setState((prev) => {
      // If already active, do nothing
      if (prev.activeChatId === chatId) return prev;

      // Check if in stack
      const isInStack = prev.swipeStack.includes(chatId);

      let newStack = prev.swipeStack;

      if (!isInStack) {
         // Add to front of stack
         newStack = [chatId, ...prev.swipeStack];
         if (newStack.length > MAX_STACK_SIZE) {
           newStack = newStack.slice(0, MAX_STACK_SIZE);
         }
      }

      return {
        ...prev,
        activeChatId: chatId,
        swipeStack: newStack
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      const currentIndex = prev.swipeStack.indexOf(prev.activeChatId || "");
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

  // Sync with Storage (Effect)
  useEffect(() => {
    if (state.activeChatId) {
        localStorage.setItem("disa_book_state", JSON.stringify({
            activeChatId: state.activeChatId,
            swipeStack: state.swipeStack
        }));
    }
  }, [state.activeChatId, state.swipeStack]);

  return {
    ...state,
    startNewChat,
    navigateToChat,
    goBack,
    isTransitioning,
    settings // Just to avoid unused var warning for now
  };
}
