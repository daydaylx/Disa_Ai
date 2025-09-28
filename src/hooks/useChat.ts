import { nanoid } from "nanoid";
import { useCallback, useReducer, useRef } from "react";

import { chatStream } from "../api/openrouter";
import type { ChatMessage } from "../components/chat/ChatMessage";
import { mapError } from "../lib/errors";

export interface UseChatOptions {
  api?: string;
  id?: string;
  initialMessages?: ChatMessage[];
  onResponse?: (response: Response) => void | Promise<void>;
  onFinish?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
  headers?: Record<string, string> | Headers;
  body?: object;
}

interface ChatState {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  error: Error | null;
  abortController: AbortController | null;
}

type ChatAction =
  | { type: "SET_MESSAGES"; messages: ChatMessage[] }
  | { type: "ADD_MESSAGE"; message: ChatMessage }
  | { type: "UPDATE_MESSAGE"; id: string; content: string }
  | { type: "SET_INPUT"; input: string }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_ERROR"; error: Error | null }
  | { type: "SET_ABORT_CONTROLLER"; controller: AbortController | null }
  | { type: "RESET" };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
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
    case "RESET":
      return {
        ...state,
        messages: [],
        input: "",
        isLoading: false,
        error: null,
        abortController: null,
      };
    default:
      return state;
  }
}

export function useChat({
  api: _api = "/api/chat",
  id: _id,
  initialMessages = [],
  onResponse,
  onFinish,
  onError,
  headers: _headers,
  body,
}: UseChatOptions = {}) {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: initialMessages,
    input: "",
    isLoading: false,
    error: null,
    abortController: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const append = useCallback(
    async (message: Omit<ChatMessage, "id" | "timestamp">) => {
      const userMessage: ChatMessage = {
        id: nanoid(),
        timestamp: Date.now(),
        ...message,
      };

      dispatch({ type: "ADD_MESSAGE", message: userMessage });
      dispatch({ type: "SET_LOADING", isLoading: true });
      dispatch({ type: "SET_ERROR", error: null });

      // Create abort controller
      const controller = new AbortController();
      abortControllerRef.current = controller;
      dispatch({ type: "SET_ABORT_CONTROLLER", controller });

      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      dispatch({ type: "ADD_MESSAGE", message: assistantMessage });

      try {
        let accumulatedContent = "";

        // Convert messages to the format expected by OpenRouter API
        const apiMessages = [...state.messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        await chatStream(
          apiMessages,
          (delta: string) => {
            accumulatedContent += delta;
            dispatch({
              type: "UPDATE_MESSAGE",
              id: assistantMessage.id,
              content: accumulatedContent,
            });
          },
          {
            signal: controller.signal,
            model: (body as any)?.model,
            onStart: () => {
              // Optionally trigger onResponse callback with a mock response
              if (onResponse) {
                const mockResponse = new Response(null, {
                  status: 200,
                  statusText: "OK",
                });
                const result = onResponse(mockResponse);
                if (result && typeof result.catch === "function") {
                  result.catch(() => {
                    // Ignore errors from onResponse callback
                  });
                }
              }
            },
            onDone: () => {
              const finalMessage: ChatMessage = {
                ...assistantMessage,
                content: accumulatedContent,
              };

              if (onFinish) {
                onFinish(finalMessage);
              }
            },
          },
        );
      } catch (error) {
        const mappedError = mapError(error);

        if (mappedError.name === "AbortError") {
          // Remove the incomplete assistant message on abort
          dispatch({
            type: "SET_MESSAGES",
            messages: [...state.messages, userMessage].filter(
              (msg) => msg.id !== assistantMessage.id,
            ),
          });
        } else {
          dispatch({ type: "SET_ERROR", error: mappedError });
          if (onError) {
            onError(mappedError);
          }
        }
      } finally {
        dispatch({ type: "SET_LOADING", isLoading: false });
        dispatch({ type: "SET_ABORT_CONTROLLER", controller: null });
        abortControllerRef.current = null;
      }
    },
    [state.messages, onResponse, onFinish, onError, body],
  );

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const reload = useCallback(async () => {
    if (state.messages.length === 0) return;

    const lastUserMessageIndex = state.messages.findLastIndex((msg) => msg.role === "user");

    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = state.messages[lastUserMessageIndex];

    // Remove all messages after the last user message
    const messagesToRetry = state.messages.slice(0, lastUserMessageIndex);

    dispatch({ type: "SET_MESSAGES", messages: messagesToRetry });

    await append({
      role: lastUserMessage.role,
      content: lastUserMessage.content,
    });
  }, [state.messages, append]);

  const setMessages = useCallback((messages: ChatMessage[]) => {
    dispatch({ type: "SET_MESSAGES", messages });
  }, []);

  const setInput = useCallback((input: string) => {
    dispatch({ type: "SET_INPUT", input });
  }, []);

  return {
    messages: state.messages,
    input: state.input,
    setInput,
    append,
    reload,
    stop,
    setMessages,
    isLoading: state.isLoading,
    error: state.error,
  };
}
