import { useCallback, useRef, useState } from "react";

import { logDiscussionAnalytics } from "../analytics/discussion";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { DISCUSSION_MODEL_PROFILE } from "../config/models/discussionProfile";
import {
  getDiscussionMaxSentences,
  getDiscussionPreset,
  getDiscussionStrictMode,
  setDiscussionPreset as saveDiscussionPreset,
} from "../config/settings";
import {
  DISCUSSION_FALLBACK_QUESTIONS,
  shapeDiscussionResponse,
} from "../features/discussion/shape";
import { buildDiscussionSystemPrompt } from "../prompts/discussion/base";
import type { DiscussionPresetKey } from "../prompts/discussion/presets";
import type { ChatMessageType, ChatRequestOptions } from "../types";

const MIN_DISCUSSION_SENTENCES = 5;

interface DiscussionSession {
  topic: string;
  preset: DiscussionPresetKey;
  maxSentences: number;
  strictMode: boolean;
}

interface DiscussionHookProps {
  append: (message: { role: "user"; content: string }) => Promise<void>;
  setMessages: (messages: ChatMessageType[]) => void;
  setSystemPrompt: (prompt: string | undefined) => void;
  setRequestOptions: (options: ChatRequestOptions | null) => void;
}

export function useDiscussion({
  append,
  setMessages,
  setSystemPrompt,
  setRequestOptions,
}: DiscussionHookProps) {
  const [preset, setPreset] = useState<DiscussionPresetKey>(getDiscussionPreset);
  const sessionRef = useRef<DiscussionSession | null>(null);
  const strictRetryTracker = useRef<Set<string>>(new Set());
  const toasts = useToasts();

  const handlePresetChange = useCallback(
    (newPreset: DiscussionPresetKey) => {
      if (newPreset === preset) return;
      setPreset(newPreset);
      saveDiscussionPreset(newPreset);
    },
    [preset],
  );

  const resetDiscussion = useCallback(() => {
    sessionRef.current = null;
    setRequestOptions(null);
    strictRetryTracker.current.clear();
  }, [setRequestOptions]);

  const startDiscussion = useCallback(
    (topicPrompt: string) => {
      try {
        const strictMode = getDiscussionStrictMode();
        const maxSentences = getDiscussionMaxSentences();
        const { prompt, presetKey } = buildDiscussionSystemPrompt({
          preset,
          minSentences: MIN_DISCUSSION_SENTENCES,
          maxSentences,
          strictMode,
        });

        resetDiscussion();
        sessionRef.current = {
          topic: topicPrompt,
          preset: presetKey,
          maxSentences,
          strictMode,
        };

        const baseParams = DISCUSSION_MODEL_PROFILE.parameters;
        const baseMaxTokens = baseParams.max_tokens ?? 480;
        const tunedMaxTokens = strictMode ? Math.min(baseMaxTokens, 420) : baseMaxTokens;

        setRequestOptions({
          model: DISCUSSION_MODEL_PROFILE.id,
          temperature: baseParams.temperature,
          top_p: baseParams.top_p,
          presence_penalty: baseParams.presence_penalty,
          max_tokens: tunedMaxTokens,
        });

        setMessages([]);
        setSystemPrompt(prompt);

        void append({ role: "user", content: topicPrompt });
      } catch (error) {
        console.error("Failed to initialise discussion", error);
        toasts.push({
          kind: "error",
          title: "Diskussionsstart fehlgeschlagen",
          message: "Bitte versuche es erneut.",
        });
      }
    },
    [preset, resetDiscussion, setRequestOptions, setMessages, setSystemPrompt, append, toasts],
  );

  const onDiscussionFinish = useCallback(
    (message: ChatMessageType, currentMessages: ChatMessageType[]) => {
      const session = sessionRef.current;
      if (!session || message.role !== "assistant") {
        return currentMessages; // Return original messages if not in a discussion
      }

      const shaped = shapeDiscussionResponse(message.content, {
        minSentences: MIN_DISCUSSION_SENTENCES,
        maxSentences: session.maxSentences,
        fallbackQuestions: DISCUSSION_FALLBACK_QUESTIONS,
      });

      const workingMessage = { ...message, content: shaped.text };

      logDiscussionAnalytics({
        timestamp: Date.now(),
        topic: session.topic,
        preset: session.preset,
        sentenceCount: shaped.sentences.length,
        wordCount: workingMessage.content.trim().split(/\s+/).length,
        trimmed: shaped.trimmed,
        fallbackUsed: shaped.fallbackUsed,
        questionTrimmed: shaped.questionTrimmed,
        strictMode: session.strictMode,
      });

      if (
        session.strictMode &&
        shaped.trimmed &&
        !strictRetryTracker.current.has(workingMessage.id)
      ) {
        strictRetryTracker.current.add(workingMessage.id);
        setTimeout(() => {
          append({ role: "user", content: "Kürzer, bitte maximal 10 Sätze." }).catch((err) =>
            console.error("Strict retry append failed:", err),
          );
        }, 120);
      }

      // Update the message list with the shaped message
      const index = currentMessages.findIndex((item) => item.id === workingMessage.id);
      if (index !== -1) {
        const newMessages = [...currentMessages];
        newMessages[index] = workingMessage;
        return newMessages;
      }
      return [...currentMessages, workingMessage];
    },
    [append],
  );

  const isDiscussionActive = useCallback(() => !!sessionRef.current, []);

  return {
    discussionPreset: preset,
    handleDiscussionPresetChange: handlePresetChange,
    startDiscussion,
    onDiscussionFinish,
    resetDiscussion,
    isDiscussionActive,
  };
}
