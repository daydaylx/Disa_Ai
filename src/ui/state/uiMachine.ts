export type ChatState = "idle" | "streaming" | "aborting" | "error" | "offline" | "rate_limited";

export interface UIState {
  chatState: ChatState;
  currentError?: string;
  streamingMessageId?: string;
  abortController?: AbortController;
}

export type UIAction =
  | { type: "START_STREAMING"; messageId: string; abortController: AbortController }
  | { type: "STOP_STREAMING" }
  | { type: "ABORT_STREAMING" }
  | { type: "SET_ERROR"; error: string; chatState?: ChatState }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_OFFLINE" }
  | { type: "SET_ONLINE" };

export function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case "START_STREAMING":
      return {
        ...state,
        chatState: "streaming",
        streamingMessageId: action.messageId,
        abortController: action.abortController,
        currentError: undefined,
      };

    case "STOP_STREAMING":
      return {
        ...state,
        chatState: "idle",
        streamingMessageId: undefined,
        abortController: undefined,
        currentError: undefined,
      };

    case "ABORT_STREAMING":
      // Signal abort and set state to aborting
      if (state.abortController) {
        state.abortController.abort();
      }
      return {
        ...state,
        chatState: "aborting",
      };

    case "SET_ERROR":
      return {
        ...state,
        chatState: action.chatState || "error",
        currentError: action.error,
        streamingMessageId: undefined,
        abortController: undefined,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        chatState: "idle",
        currentError: undefined,
      };

    case "SET_OFFLINE":
      return {
        ...state,
        chatState: "offline",
        currentError: "No internet connection",
      };

    case "SET_ONLINE":
      // Only clear offline state if we were offline
      if (state.chatState === "offline") {
        return {
          ...state,
          chatState: "idle",
          currentError: undefined,
        };
      }
      return state;

    default:
      return state;
  }
}

export const initialUIState: UIState = {
  chatState: "idle",
};

// Helper functions for state checks
export const isStreaming = (state: UIState): boolean => state.chatState === "streaming";

export const canSendMessage = (state: UIState): boolean => state.chatState === "idle";

export const canAbort = (state: UIState): boolean => state.chatState === "streaming";

export const isAborting = (state: UIState): boolean => state.chatState === "aborting";

export const hasError = (state: UIState): boolean =>
  state.chatState === "error" ||
  state.chatState === "offline" ||
  state.chatState === "rate_limited";

export const getStatusBadgeText = (state: UIState): string => {
  switch (state.chatState) {
    case "streaming":
      return "Streaming...";
    case "aborting":
      return "Stopping...";
    case "offline":
      return "Offline";
    case "rate_limited":
      return "Rate Limited";
    case "error":
      return "Error";
    default:
      return "Ready";
  }
};

export const getStatusBadgeVariant = (state: UIState): "muted" | "accent" => {
  switch (state.chatState) {
    case "streaming":
    case "aborting":
      return "accent";
    default:
      return "muted";
  }
};
