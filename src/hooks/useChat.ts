import { nanoid } from "nanoid";
import { useCallback, useReducer, useRef } from "react";

import { chatStream } from "../api/openrouter";
import { mapError } from "../lib/errors";
import { RateLimitError } from "../lib/errors/types";
import type { ChatMessageType } from "../types/chatMessage";

export interface UseChatOptions {
  api?: string;
  id?: string;
  initialMessages?: ChatMessageType[];
  onResponse?: (response: Response) => void | Promise<void>;
  onFinish?: (message: ChatMessageType) => void;
  onError?: (error: Error) => void;
  headers?: Record<string, string> | Headers;
  body?: object;
  prepareMessages?: (history: ChatMessageType[]) => ChatMessageType[];
}

interface ChatState {
  messages: ChatMessageType[];
  input: string;
  isLoading: boolean;
  error: Error | null;
  abortController: AbortController | null;
}

type ChatAction =
  | { type: "SET_MESSAGES"; messages: ChatMessageType[] }
  | { type: "ADD_MESSAGE"; message: ChatMessageType }
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
  prepareMessages: prepareMessagesOpt,
}: UseChatOptions = {}) {
  const prepareMessages = useCallback(
    (history: ChatMessageType[]): ChatMessageType[] => {
      if (prepareMessagesOpt) {
        return prepareMessagesOpt([...history]);
      }
      return history;
    },
    [prepareMessagesOpt],
  );
  const [state, dispatch] = useReducer(chatReducer, {
    messages: initialMessages,
    input: "",
    isLoading: false,
    error: null,
    abortController: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const rateLimitUntilRef = useRef<number>(0);

  const append = useCallback(
    async (
      message: Omit<ChatMessageType, "id" | "timestamp">,
      customMessages?: ChatMessageType[],
    ) => {
      const now = Date.now();
      if (rateLimitUntilRef.current > now) {
        const remainingSeconds = Math.ceil((rateLimitUntilRef.current - now) / 1000);
        const cooldownError = new RateLimitError(
          remainingSeconds > 1
            ? `Rate-Limit aktiv. Warte bitte ${remainingSeconds} Sekunden, bevor du es erneut versuchst.`
            : "Rate-Limit aktiv. Einen Moment bitte …",
          429,
          "Too Many Requests",
        );
        dispatch({ type: "SET_ERROR", error: cooldownError });
        if (onError) {
          onError(cooldownError);
        }
        return;
      }

      const userMessage: ChatMessageType = {
        id: nanoid(),
        timestamp: Date.now(),
        ...message,
      };

      // ATOMIC OPERATION: Capture current state before any async operations
      // This prevents race conditions by freezing the state at function call time
      const baseHistory: ChatMessageType[] = customMessages
        ? [...customMessages]
        : [...state.messages];
      const requestHistory = prepareMessages(baseHistory);

      dispatch({ type: "ADD_MESSAGE", message: userMessage });
      dispatch({ type: "SET_LOADING", isLoading: true });
      dispatch({ type: "SET_ERROR", error: null });
      dispatch({ type: "SET_INPUT", input: "" });

      // Create abort controller
      const controller = new AbortController();
      abortControllerRef.current = controller;
      dispatch({ type: "SET_ABORT_CONTROLLER", controller });

      // Assistant message will be created with server-provided ID
      let assistantMessage: ChatMessageType | null = null;

      try {
        let accumulatedContent = "";

        // Use captured messages to prevent race conditions during async operations
        const apiMessages = [...requestHistory, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        await chatStream(
          apiMessages,
          (
            delta: string,
            messageData?: { id?: string; role?: string; timestamp?: number; model?: string },
          ) => {
            // Initialize assistant message with server-provided metadata on first delta
            if (!assistantMessage) {
              if (messageData?.id) {
                // Use server-provided ID and metadata
                assistantMessage = {
                  id: messageData.id,
                  role: "assistant",
                  content: "",
                  timestamp: messageData.timestamp || Date.now(),
                  model: messageData.model,
                };
              } else if (delta) {
                // Fallback: create with client-generated ID if we have content but no server metadata
                assistantMessage = {
                  id: `fallback-${nanoid()}`,
                  role: "assistant",
                  content: "",
                  timestamp: Date.now(),
                };
              }

              if (assistantMessage) {
                dispatch({ type: "ADD_MESSAGE", message: assistantMessage });
              }
            }

            if (delta) {
              accumulatedContent += delta;

              // Update message if we have one
              if (assistantMessage) {
                dispatch({
                  type: "UPDATE_MESSAGE",
                  id: assistantMessage.id,
                  content: accumulatedContent,
                });
              }
            }
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
              if (assistantMessage) {
                const finalMessage: ChatMessageType = {
                  ...assistantMessage,
                  content: accumulatedContent,
                };

                if (onFinish) {
                  onFinish(finalMessage);
                }
              }
            },
          },
        );
      } catch (error) {
        const mappedError = mapError(error);

        if (mappedError instanceof RateLimitError) {
          const retryAfterSeconds = Math.max(mappedError.retryAfterSeconds ?? 8, 3);
          const cooldownMs = retryAfterSeconds * 1000;
          rateLimitUntilRef.current = Date.now() + cooldownMs;

          const friendlyError = new RateLimitError(
            retryAfterSeconds > 1
              ? `Rate-Limit aktiv. Bitte warte ${retryAfterSeconds} Sekunden.`
              : "Rate-Limit aktiv. Einen Moment bitte …",
            mappedError.status,
            mappedError.statusText,
            { headers: mappedError.headers },
          );

          dispatch({ type: "SET_ERROR", error: friendlyError });
          if (onError) {
            onError(friendlyError);
          }
        } else if (mappedError.name === "AbortError") {
          // Remove the incomplete assistant message on abort
          const baseWithUser: ChatMessageType[] = [...baseHistory, userMessage];
          const assistantId = (assistantMessage as { id?: string } | null)?.id;
          if (assistantId) {
            const assistantIndex = (baseWithUser as Array<{ id: string }>).findIndex(
              (msg) => msg.id === assistantId,
            );
            if (assistantIndex !== -1) {
              baseWithUser.splice(assistantIndex, 1);
            }
          }
          dispatch({ type: "SET_MESSAGES", messages: baseWithUser });
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
    [onResponse, onFinish, onError, body, state.messages, prepareMessages],
  );

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const reload = useCallback(async () => {
    try {
      // ATOMIC OPERATION: Capture current messages at function start
      const currentMessages = [...state.messages];

      if (currentMessages.length === 0) return;

      let lastUserMessageIndex = -1;
      for (let i = currentMessages.length - 1; i >= 0; i -= 1) {
        if (currentMessages[i]?.role === "user") {
          lastUserMessageIndex = i;
          break;
        }
      }

      if (lastUserMessageIndex === -1) return;

      const lastUserMessage = currentMessages[lastUserMessageIndex];
      if (!lastUserMessage) return;

      // Use captured messages to prevent race conditions
      const messagesToRetry = currentMessages.slice(0, lastUserMessageIndex);

      dispatch({ type: "SET_MESSAGES", messages: messagesToRetry });

      // Pass the captured and sliced messages to append for consistency
      await append(
        {
          role: lastUserMessage.role,
          content: lastUserMessage.content,
        },
        messagesToRetry,
      );
    } catch (error) {
      const mappedError = mapError(error);
      dispatch({ type: "SET_ERROR", error: mappedError });
      if (onError) {
        onError(mappedError);
      }
    }
  }, [append, onError, state.messages]); // Include state.messages dependency as required

  const setMessages = useCallback((messages: ChatMessageType[]) => {
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
