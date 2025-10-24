import { useCallback, useRef, useState } from "react";

import { logDiscussionAnalytics } from "../analytics/discussion";
import { DISCUSSION_MODEL_PROFILE } from "../config/models/discussionProfile";
import {
  getDiscussionMaxSentences,
  getDiscussionPreset,
  getDiscussionStrictMode,
  setDiscussionPreset as setDiscussionPresetStorage,
} from "../config/settings";
import {
  DISCUSSION_FALLBACK_QUESTIONS,
  shapeDiscussionResponse,
} from "../features/discussion/shape";
import type { ChatRequestOptions } from "../hooks/useChat";
import { buildDiscussionSystemPrompt } from "../prompts/discussion/base";
import { type DiscussionPresetKey } from "../prompts/discussion/presets";
import type { ChatMessageType } from "../types/chatMessage";

const MIN_DISCUSSION_SENTENCES = 5;

interface DiscussionSession {
  topic: string;
  preset: DiscussionPresetKey;
  maxSentences: number;
  strictMode: boolean;
}

export interface UseDiscussionOptions {
  onSystemPromptChange: (prompt: string | undefined) => void;
  onRequestOptionsChange: (options: ChatRequestOptions | null) => void;
  onToast: (toast: { kind: string; title: string; message: string }) => void;
}

export interface UseDiscussionReturn {
  // State
  discussionPreset: DiscussionPresetKey;
  isDiscussionActive: boolean;

  // Actions
  startDiscussion: (topicPrompt: string) => ChatRequestOptions;
  handleDiscussionPresetChange: (value: DiscussionPresetKey) => void;
  resetDiscussion: () => void;
  processDiscussionResponse: (
    message: ChatMessageType,
    currentMessages: ChatMessageType[],
  ) => {
    updatedMessage: ChatMessageType;
    updatedMessages: ChatMessageType[];
  };
  getRequestOptions: () => ChatRequestOptions | null;
}

/**
 * Custom hook for managing discussion mode
 *
 * Handles:
 * - Starting and stopping discussions
 * - Managing discussion presets and settings
 * - Shaping discussion responses (validating sentence count, adding questions)
 * - Tracking discussion sessions
 * - Configuring model parameters for discussions
 *
 * @example
 * ```tsx
 * const {
 *   discussionPreset,
 *   startDiscussion,
 *   processDiscussionResponse
 * } = useDiscussion({
 *   onSystemPromptChange: setSystemPrompt,
 *   onRequestOptionsChange: setRequestOptions,
 *   onToast: (toast) => toasts.push(toast)
 * });
 * ```
 */
export function useDiscussion({
  onSystemPromptChange,
  onRequestOptionsChange,
  onToast,
}: UseDiscussionOptions): UseDiscussionReturn {
  const [discussionPreset, setDiscussionPresetState] =
    useState<DiscussionPresetKey>(getDiscussionPreset);

  const discussionSessionRef = useRef<DiscussionSession | null>(null);
  const requestOptionsRef = useRef<ChatRequestOptions | null>(null);
  const strictRetryTracker = useRef<Set<string>>(new Set());
  const discussionPresetRef = useRef<DiscussionPresetKey>(discussionPreset);

  const isDiscussionActive = discussionSessionRef.current !== null;

  const resetDiscussion = useCallback(() => {
    discussionSessionRef.current = null;
    requestOptionsRef.current = null;
    strictRetryTracker.current.clear();
    onSystemPromptChange(undefined);
    onRequestOptionsChange(null);
  }, [onSystemPromptChange, onRequestOptionsChange]);

  const handleDiscussionPresetChange = useCallback(
    (value: DiscussionPresetKey) => {
      if (value === discussionPresetRef.current) return;
      discussionPresetRef.current = value;
      setDiscussionPresetState(value);
      setDiscussionPresetStorage(value);

      onToast({
        kind: "info",
        title: "Stil aktualisiert",
        message: value,
      });
    },
    [onToast],
  );

  const startDiscussion = useCallback(
    (topicPrompt: string): ChatRequestOptions => {
      try {
        const preset = discussionPresetRef.current ?? getDiscussionPreset();
        const strictMode = getDiscussionStrictMode();
        const maxSentences = getDiscussionMaxSentences();

        const { prompt, presetKey } = buildDiscussionSystemPrompt({
          preset,
          minSentences: MIN_DISCUSSION_SENTENCES,
          maxSentences,
          strictMode,
        });

        resetDiscussion();

        discussionSessionRef.current = {
          topic: topicPrompt,
          preset: presetKey,
          maxSentences,
          strictMode,
        };

        const baseParams = DISCUSSION_MODEL_PROFILE.parameters;
        const baseMaxTokens = baseParams.max_tokens ?? 480;
        const tunedMaxTokens = strictMode ? Math.min(baseMaxTokens, 420) : baseMaxTokens;

        const requestOptions: ChatRequestOptions = {
          model: DISCUSSION_MODEL_PROFILE.id,
          temperature: baseParams.temperature,
          top_p: baseParams.top_p,
          presence_penalty: baseParams.presence_penalty,
          max_tokens: tunedMaxTokens,
        };

        requestOptionsRef.current = requestOptions;
        onSystemPromptChange(prompt);
        onRequestOptionsChange(requestOptions);

        onToast({
          kind: "info",
          title: "Diskussionsmodus aktiv",
          message: `${presetKey} • ${MIN_DISCUSSION_SENTENCES}-${maxSentences} Sätze`,
        });

        return requestOptions;
      } catch (error) {
        console.error("Failed to initialise discussion", error);
        onToast({
          kind: "error",
          title: "Diskussionsstart fehlgeschlagen",
          message: "Bitte versuche es erneut.",
        });
        throw error;
      }
    },
    [resetDiscussion, onSystemPromptChange, onRequestOptionsChange, onToast],
  );

  const processDiscussionResponse = useCallback(
    (
      message: ChatMessageType,
      currentMessages: ChatMessageType[],
    ): {
      updatedMessage: ChatMessageType;
      updatedMessages: ChatMessageType[];
    } => {
      const session = discussionSessionRef.current;
      let workingMessage = message;
      let updatedMessages = currentMessages;

      if (session && message.role === "assistant") {
        const shaped = shapeDiscussionResponse(message.content, {
          minSentences: MIN_DISCUSSION_SENTENCES,
          maxSentences: session.maxSentences,
          strictMode: session.strictMode,
          fallbackQuestions: DISCUSSION_FALLBACK_QUESTIONS,
        });

        // Log analytics
        logDiscussionAnalytics({
          topic: session.topic,
          preset: session.preset,
          sentenceCount: shaped.sentenceCount,
          hasQuestion: shaped.hasQuestion,
          isValid: shaped.isValid,
          strictMode: session.strictMode,
        });

        // Handle strict mode validation
        if (session.strictMode && !shaped.isValid) {
          const messageKey = `${message.id}-${shaped.sentenceCount}`;

          if (!strictRetryTracker.current.has(messageKey)) {
            strictRetryTracker.current.add(messageKey);
            console.warn("Invalid discussion response, triggering retry:", {
              sentenceCount: shaped.sentenceCount,
              hasQuestion: shaped.hasQuestion,
            });
          }
        }

        workingMessage = {
          ...message,
          content: shaped.content,
        };

        updatedMessages = currentMessages.map((msg) =>
          msg.id === message.id ? workingMessage : msg,
        );
      }

      return {
        updatedMessage: workingMessage,
        updatedMessages,
      };
    },
    [],
  );

  const getRequestOptions = useCallback(() => {
    return requestOptionsRef.current;
  }, []);

  return {
    discussionPreset,
    isDiscussionActive,
    startDiscussion,
    handleDiscussionPresetChange,
    resetDiscussion,
    processDiscussionResponse,
    getRequestOptions,
  };
}
