import { nanoid } from "nanoid";
import { useCallback, useEffect, useReducer, useRef } from "react";

import { chatStream } from "../api/openrouter";
import { mapError } from "../lib/errors";
import { RateLimitError } from "../lib/errors/types";
import { chatReducer } from "../state/chatReducer";
import type { ChatRequestOptions } from "../types";
import type { ChatMessageType } from "../types/chatMessage";

const MS_IN_SECOND = 1000;
const DEFAULT_RATE_LIMIT_RETRY_AFTER_SECONDS = 8;
const MIN_RATE_LIMIT_COOLDOWN_SECONDS = 3;

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
  systemPrompt?: string;
  getRequestOptions?: () => ChatRequestOptions;
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
  systemPrompt: _systemPrompt,
  getRequestOptions,
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
    currentSystemPrompt: _systemPrompt,
    requestOptions: null,
  });

  const systemPromptRef = useRef<string | undefined>(_systemPrompt);

  useEffect(() => {
    systemPromptRef.current = _systemPrompt ?? undefined;
  }, [_systemPrompt]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const rateLimitUntilRef = useRef<number>(0);
  const stateRef = useRef(state);

  // Update ref when state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const append = useCallback(
    async (
      message: Omit<ChatMessageType, "id" | "timestamp">,
      customMessages?: ChatMessageType[],
    ) => {
      const now = Date.now();
      if (rateLimitUntilRef.current > now) {
        const remainingSeconds = Math.ceil((rateLimitUntilRef.current - now) / MS_IN_SECOND);
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

      // Capture current messages to avoid stale closures
      const currentMessages = customMessages || [...stateRef.current.messages];
      const requestHistory = prepareMessages(currentMessages);

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
        let apiMessages = [...requestHistory, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // Add system prompt as the first message if it exists and not already present
        const systemPrompt = stateRef.current.currentSystemPrompt || systemPromptRef.current;
        if (systemPrompt && apiMessages.length > 0 && apiMessages[0]?.role !== "system") {
          apiMessages = [{ role: "system", content: systemPrompt }, ...apiMessages];
        }

        const requestOptions = stateRef.current.requestOptions || getRequestOptions?.();

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
            model: requestOptions?.model ?? (body as any)?.model,
            params: {
              temperature: requestOptions?.temperature,
              top_p: requestOptions?.top_p,
              presence_penalty: requestOptions?.presence_penalty,
              max_tokens: requestOptions?.max_tokens,
            },
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
          const retryAfterSeconds = Math.max(
            mappedError.retryAfterSeconds ?? DEFAULT_RATE_LIMIT_RETRY_AFTER_SECONDS,
            MIN_RATE_LIMIT_COOLDOWN_SECONDS,
          );
          const cooldownMs = retryAfterSeconds * MS_IN_SECOND;
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
          // On abort, restore to the original baseHistory state
          // Do not include userMessage or any assistant messages that were added during this operation
          dispatch({
            type: "SET_MESSAGES",
            messages: customMessages || [...stateRef.current.messages],
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

    [onResponse, onFinish, onError, body, prepareMessages, stateRef, getRequestOptions], // Remove state.messages from dependencies to prevent stale closures
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

  const setCurrentSystemPrompt = useCallback((prompt: string | undefined) => {
    dispatch({ type: "SET_CURRENT_SYSTEM_PROMPT", prompt });
    systemPromptRef.current = prompt;
  }, []);

  const setRequestOptions = useCallback((options: ChatRequestOptions | null) => {
    dispatch({ type: "SET_REQUEST_OPTIONS", options });
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
    setCurrentSystemPrompt,
    setRequestOptions,
  };
}
