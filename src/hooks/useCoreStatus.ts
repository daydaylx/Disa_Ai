import { useMemo } from "react";

import type { ChatMessageType } from "@/types/chatMessage";
import type { CoreStatus } from "@/types/orb";

export interface UseCoreStatusOptions {
  isLoading: boolean;
  error: Error | null;
  messages: ChatMessageType[];
}

/**
 * Central derivation of CoreStatus based on chat state.
 *
 * Logic:
 * - If error exists → 'error'
 * - Else if loading:
 *   - If last message is assistant → 'streaming' (tokens arriving)
 *   - Else → 'thinking' (request pending, no response yet)
 * - Else → 'idle'
 */
export function useCoreStatus({ isLoading, error, messages }: UseCoreStatusOptions): CoreStatus {
  return useMemo(() => {
    if (error) return "error";

    if (isLoading) {
      const lastMsg = messages[messages.length - 1];
      // If we have an assistant message that is streaming, it's 'streaming'.
      // Otherwise (user msg is last, or empty msg list but loading), it's 'thinking'.
      if (lastMsg?.role === "assistant") return "streaming";
      return "thinking";
    }

    return "idle";
  }, [error, isLoading, messages]);
}
