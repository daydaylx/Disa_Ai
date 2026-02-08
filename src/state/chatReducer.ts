import type { ChatRequestOptions } from "../types";
import type { ChatMessageType } from "../types/chatMessage";

export interface ChatState {
  messages: ChatMessageType[];
  input: string;
  isLoading: boolean;
  error: Error | null;
  abortController: AbortController | null;
  currentSystemPrompt: string | undefined;
  requestOptions: ChatRequestOptions | null;
  // Performance optimization: track the index of the currently streaming assistant message
  currentAssistantMessageIndex: number | null;
}

export type ChatAction =
  | { type: "SET_MESSAGES"; messages: ChatMessageType[] }
  | { type: "ADD_MESSAGE"; message: ChatMessageType }
  | { type: "UPDATE_MESSAGE"; id: string; content: string }
  | { type: "SET_INPUT"; input: string }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_ERROR"; error: Error | null }
  | { type: "SET_ABORT_CONTROLLER"; controller: AbortController | null }
  | { type: "SET_CURRENT_SYSTEM_PROMPT"; prompt: string | undefined }
  | { type: "SET_REQUEST_OPTIONS"; options: ChatRequestOptions | null }
  | { type: "RESET" };

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_MESSAGES":
      return { ...state, messages: action.messages, currentAssistantMessageIndex: null };

    case "ADD_MESSAGE": {
      const newMessages = [...state.messages, action.message];
      // If adding an assistant message, track its index for efficient updates
      const newIndex =
        action.message.role === "assistant"
          ? newMessages.length - 1
          : state.currentAssistantMessageIndex;

      return {
        ...state,
        messages: newMessages,
        currentAssistantMessageIndex: newIndex,
      };
    }

    case "UPDATE_MESSAGE": {
      // Performance optimization: use cached index if available and valid
      let targetIndex = -1;

      // Fast path: check if the cached index points to the right message
      if (
        state.currentAssistantMessageIndex !== null &&
        state.currentAssistantMessageIndex >= 0 &&
        state.currentAssistantMessageIndex < state.messages.length &&
        state.messages[state.currentAssistantMessageIndex]?.id === action.id
      ) {
        targetIndex = state.currentAssistantMessageIndex;
      } else {
        // Slow path: search for the message (fallback for edge cases)
        // Use findLastIndex for better performance with assistant messages at the end
        for (let i = state.messages.length - 1; i >= 0; i--) {
          if (state.messages[i]?.id === action.id) {
            targetIndex = i;
            break;
          }
        }
      }

      if (targetIndex === -1) {
        return state;
      }

      const target = state.messages[targetIndex];

      // Skip update if content hasn't changed
      if (!target || target.content === action.content) {
        return state;
      }

      // Create new messages array with updated content
      const messages = state.messages.slice();
      messages[targetIndex] = { ...target, content: action.content };

      return {
        ...state,
        messages,
        currentAssistantMessageIndex: targetIndex, // Update cached index
      };
    }

    case "SET_INPUT":
      return { ...state, input: action.input };

    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };

    case "SET_ERROR":
      return { ...state, error: action.error };

    case "SET_ABORT_CONTROLLER":
      return { ...state, abortController: action.controller };

    case "SET_CURRENT_SYSTEM_PROMPT":
      return { ...state, currentSystemPrompt: action.prompt };

    case "SET_REQUEST_OPTIONS":
      return { ...state, requestOptions: action.options };

    case "RESET":
      return {
        ...state,
        messages: [],
        input: "",
        isLoading: false,
        error: null,
        abortController: null,
        currentSystemPrompt: undefined,
        requestOptions: null,
        currentAssistantMessageIndex: null,
      };

    default:
      return state;
  }
}
