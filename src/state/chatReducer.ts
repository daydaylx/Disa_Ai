
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
      return { ...state, messages: action.messages };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };
    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.id ? { ...msg, content: action.content } : msg,
        ),
      };
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
      };
    default:
      return state;
  }
}
