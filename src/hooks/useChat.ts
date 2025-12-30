import { nanoid } from "nanoid";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { chatStream } from "../api/openrouter";
import { analytics } from "../lib/analytics";
import { mapError } from "../lib/errors";
import { RateLimitError } from "../lib/errors/types";
import { chatReducer } from "../state/chatReducer";
import type { ChatRequestOptions } from "../types";
import type { ChatMessageType } from "../types/chatMessage";

const MS_IN_SECOND = 1000;
const DEFAULT_RATE_LIMIT_RETRY_AFTER_SECONDS = 8;
const MIN_RATE_LIMIT_COOLDOWN_SECONDS = 3;

// Request ID counter for deduplication
let requestIdCounter = 0;

function calculateExponentialBackoff(attempt: number): number {
  const baseDelay = 1000; // 1s base delay
  const jitter = Math.random() * 500; // add jitter to avoid thundering herd
  const delay = baseDelay * 2 ** attempt + jitter;
  const maxDelay = 30 * MS_IN_SECOND;
  return Math.min(delay, maxDelay);
}

export type ChatApiStatus = "ok" | "rate_limited" | "missing_key" | "error" | "idle";

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

type AppendOverrides = {
  systemPrompt?: string;
  requestOptions?: ChatRequestOptions | null;
};

export function useChat({
  api: _api = "/api/chat",
  id: _id,
  initialMessages = [],
  onResponse,
  onFinish,
  onError,
  headers: _headers,
  body: _body,
  prepareMessages: prepareMessagesOpt,
  systemPrompt: _systemPrompt,
  getRequestOptions,
}: UseChatOptions = {}) {
  const [rateLimitInfo, setRateLimitInfo] = useState({
    isLimited: false,
    retryAfter: 0,
  });
  const [apiStatus, setApiStatus] = useState<ChatApiStatus>("idle");
  const retryAttemptsRef = useRef(0);
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

  // Cleanup on unmount: Abort any ongoing requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const append = useCallback(
    async (
      message: Omit<ChatMessageType, "id" | "timestamp">,
      customMessages?: ChatMessageType[],
      overrides?: AppendOverrides,
    ) => {
      // Abort previous request if active
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      // Track this request to prevent race conditions
      const currentRequestId = ++requestIdCounter;

      // Handle rate limiting with exponential backoff
      const now = Date.now();

      if (rateLimitUntilRef.current <= now) {
        setRateLimitInfo((info) => (info.isLimited ? { isLimited: false, retryAfter: 0 } : info));
      }
      if (rateLimitUntilRef.current > now) {
        const remainingSeconds = Math.ceil((rateLimitUntilRef.current - now) / MS_IN_SECOND);
        const cooldownError = new RateLimitError(
          remainingSeconds > 1
            ? `Rate-Limit aktiv. Warte bitte ${remainingSeconds} Sekunden, bevor du es erneut versuchst.`
            : "Rate-Limit aktiv. Einen Moment bitte …",
          429,
          "Too Many Requests",
        );
        setRateLimitInfo({ isLimited: true, retryAfter: remainingSeconds });
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

      // ATOMIC CAPTURE: Snapshot messages at function entry to prevent race conditions
      // This ensures we work with a consistent message history throughout the async operation
      const currentMessages = customMessages ?? [...stateRef.current.messages];
      const requestHistory = prepareMessages(currentMessages);

      dispatch({ type: "ADD_MESSAGE", message: userMessage });
      dispatch({ type: "SET_LOADING", isLoading: true });
      dispatch({ type: "SET_ERROR", error: null });
      dispatch({ type: "SET_INPUT", input: "" });
      setApiStatus("ok"); // Optimistically set to ok

      // Create abort controller
      const controller = new AbortController();
      abortControllerRef.current = controller;
      dispatch({ type: "SET_ABORT_CONTROLLER", controller });

      // Assistant message will be created with server-provided ID
      let assistantMessage: ChatMessageType | null = null;

      let rateLimitedThisCall = false;
      const startTime = Date.now();
      let firstTokenReceived = false;

      try {
        let accumulatedContent = "";

        // Use captured messages to prevent race conditions during async operations
        let apiMessages = [...requestHistory, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // Add system prompt as the first message if it exists and not already present
        const systemPrompt =
          overrides?.systemPrompt ||
          stateRef.current.currentSystemPrompt ||
          systemPromptRef.current;
        if (systemPrompt && apiMessages.length > 0 && apiMessages[0]?.role !== "system") {
          apiMessages = [{ role: "system", content: systemPrompt }, ...apiMessages];
        }

        const requestOptions =
          overrides?.requestOptions ?? stateRef.current.requestOptions ?? getRequestOptions?.();

        // Use the new Cloudflare Worker endpoint instead of direct OpenRouter call
        await chatStream(
          apiMessages,
          (
            delta: string,
            messageData?: { id?: string; role?: string; timestamp?: number; model?: string },
          ) => {
            if (controller.signal.aborted) return;

            // CRITICAL FIX: Always create assistant message on first delta, even if empty
            // This ensures "KI schreibt" doesn't show without a message being created
            if (!assistantMessage) {
              if (!firstTokenReceived) {
                const ttfa = Date.now() - startTime;
                const model = messageData?.model || requestOptions?.model || "unknown";
                analytics.trackTTFA(ttfa, model);
                firstTokenReceived = true;
              }

              assistantMessage = {
                id: messageData?.id || `assistant-${nanoid()}`,
                role: "assistant",
                content: "",
                timestamp: messageData?.timestamp || Date.now(),
                model: messageData?.model,
              };

              dispatch({ type: "ADD_MESSAGE", message: assistantMessage });
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
            model: requestOptions?.model,
            params: {
              temperature: requestOptions?.temperature,
              top_p: requestOptions?.top_p,
              presence_penalty: requestOptions?.presence_penalty,
              max_tokens: requestOptions?.max_tokens,
            },
            onStart: () => {
              if (controller.signal.aborted) return;
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
              if (controller.signal.aborted) return;
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
        retryAttemptsRef.current = 0;
        setRateLimitInfo((info) => (info.isLimited ? { isLimited: false, retryAfter: 0 } : info));
      } catch (error) {
        const mappedError = mapError(error);

        // IGNORE ABORT ERRORS
        if (mappedError.name === "AbortError" || controller.signal.aborted) {
          // Just stop loading, do not set error state
          // Restore messages state if needed, or just leave as is (partial response)
          // Actually, if we abort, we might want to keep partial response?
          // The original code restored state. Let's stick to safe cleanup.
          setApiStatus("idle");
          return;
        }

        const model = stateRef.current.requestOptions?.model || "unknown";
        analytics.trackApiError(mappedError.name || "UnknownError", model);

        if (mappedError instanceof RateLimitError) {
          // ... existing rate limit logic ...
          // Get retry-after header value if available
          const retryAfterHeader = mappedError.headers?.get("retry-after");
          const parsedHeader = retryAfterHeader ? Number.parseInt(retryAfterHeader, 10) : undefined;
          const retryAfterSeconds = Math.max(
            parsedHeader ?? mappedError.retryAfterSeconds ?? DEFAULT_RATE_LIMIT_RETRY_AFTER_SECONDS,
            MIN_RATE_LIMIT_COOLDOWN_SECONDS,
          );

          // Calculate backoff time with exponential strategy
          const backoffTime = calculateExponentialBackoff(retryAttemptsRef.current);
          const retryAfterWithBackoff = Math.max(retryAfterSeconds, Math.ceil(backoffTime / 1000));

          const friendlyError = new RateLimitError(
            retryAfterWithBackoff > 1
              ? `Rate-Limit aktiv. Warte bitte ${retryAfterWithBackoff} Sekunden.`
              : "Rate-Limit aktiv. Einen Moment bitte …",
            mappedError.status,
            mappedError.statusText,
            {
              headers: mappedError.headers,
              retryAfter: retryAfterWithBackoff,
              backoffDelay: backoffTime,
            },
          );

          // Update rate limit timestamp
          rateLimitUntilRef.current = Date.now() + retryAfterWithBackoff * MS_IN_SECOND;
          retryAttemptsRef.current++;
          rateLimitedThisCall = true;
          setRateLimitInfo({ isLimited: true, retryAfter: retryAfterWithBackoff });
          setApiStatus("rate_limited");

          dispatch({ type: "SET_ERROR", error: friendlyError });
          if (onError) {
            onError(friendlyError);
          }
        } else {
          // Check if it's a "missing key" error
          if (mappedError.message?.includes("NO_API_KEY")) {
            setApiStatus("missing_key");
          } else {
            setApiStatus("error");
          }
          dispatch({ type: "SET_ERROR", error: mappedError });
          if (onError) {
            onError(mappedError);
          }
        }
      } finally {
        // Only update state if this is still the most recent request
        if (requestIdCounter === currentRequestId) {
          if (abortControllerRef.current === controller) {
            dispatch({ type: "SET_LOADING", isLoading: false });
            dispatch({ type: "SET_ABORT_CONTROLLER", controller: null });
            abortControllerRef.current = null;
          }

          if (!rateLimitedThisCall && !controller.signal.aborted) {
            retryAttemptsRef.current = 0;
            setRateLimitInfo((info) =>
              info.isLimited ? { isLimited: false, retryAfter: 0 } : info,
            );
          }
        }
      }
    },

    [onResponse, onFinish, onError, prepareMessages, getRequestOptions], // Refs are stable and don't need to be in deps
  );

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const reload = useCallback(async () => {
    // ATOMIC SNAPSHOT: Capture all state at function entry to prevent race conditions
    const currentState = stateRef.current;
    const currentSystemPrompt = currentState.currentSystemPrompt ?? systemPromptRef.current;
    const currentRequestOptions = currentState.requestOptions;

    try {
      // ATOMIC OPERATION: Capture current messages at function start
      const currentMessages = [...currentState.messages];

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

      // Pass the captured messages plus fresh options to append
      await append(
        {
          role: lastUserMessage.role,
          content: lastUserMessage.content,
        },
        messagesToRetry,
        {
          systemPrompt: currentSystemPrompt,
          requestOptions: currentRequestOptions,
        },
      );
    } catch (error) {
      const mappedError = mapError(error);
      dispatch({ type: "SET_ERROR", error: mappedError });
      if (onError) {
        onError(mappedError);
      }
    }
  }, [append, onError]); // Using stateRef for message access - no need for state deps

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
    rateLimitInfo, // Füge die Rate-Limit-Info dem Return-Wert hinzu
    apiStatus, // Expliziter Status für UI-Anzeige
  };
}
