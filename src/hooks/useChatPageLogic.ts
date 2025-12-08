import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useModelCatalog } from "../contexts/ModelCatalogContext";
import { useRoles } from "../contexts/RolesContext";
import { buildSystemPrompt } from "../lib/chat/prompt-builder";
import { MAX_PROMPT_LENGTH, validatePrompt } from "../lib/chat/validation";
import { mapCreativityToParams } from "../lib/creativity";
import { humanErrorToToast } from "../lib/errors/humanError";
import { getSamplingCapabilities } from "../lib/modelCapabilities";
import type { ChatMessageType } from "../types/chatMessage";
import { useToasts } from "../ui";
import { useChat } from "./useChat";
import { useConversationHistory } from "./useConversationHistory";
import { useConversationManager } from "./useConversationManager";
import { useMemory } from "./useMemory";
import { useSettings } from "./useSettings";

interface ChatPageLogicOptions {
  onStartWithPreset: (system: string, user?: string) => void;
}

/**
 * Encapsulates all business logic for the Chat page.
 * Handles message sending, editing, retrying, follow-ups, and conversation management.
 */
export function useChatPageLogic({ onStartWithPreset }: ChatPageLogicOptions) {
  const toasts = useToasts();
  const navigate = useNavigate();
  const { activeRole, setActiveRole } = useRoles();
  const { settings } = useSettings();
  const { isEnabled: memoryEnabled } = useMemory();
  const { models: modelCatalog } = useModelCatalog();

  // Request options based on current settings
  const requestOptions = useMemo(() => {
    const capabilities = getSamplingCapabilities(settings.preferredModelId, modelCatalog ?? null);
    const params = mapCreativityToParams(settings.creativity ?? 45, settings.preferredModelId);
    return {
      model: settings.preferredModelId,
      temperature: capabilities.temperature ? params.temperature : undefined,
      top_p: capabilities.top_p ? params.top_p : undefined,
      presence_penalty: capabilities.presence_penalty ? params.presence_penalty : undefined,
    };
  }, [modelCatalog, settings.creativity, settings.preferredModelId]);

  // Error handler
  const handleError = useCallback(
    (error: Error) => {
      toasts.push(humanErrorToToast(error));
    },
    [toasts],
  );

  // Chat hook
  const {
    messages,
    append,
    isLoading,
    setMessages,
    input,
    setInput,
    setCurrentSystemPrompt,
    setRequestOptions,
    apiStatus,
    rateLimitInfo,
    error,
  } = useChat({
    onError: handleError,
  });

  // Update system prompt when role or settings change
  useEffect(() => {
    const combinedPrompt = buildSystemPrompt(settings, activeRole);
    setCurrentSystemPrompt(combinedPrompt || undefined);
  }, [activeRole, settings, setCurrentSystemPrompt]);

  // Update request options
  useEffect(() => {
    setRequestOptions(requestOptions);
  }, [requestOptions, setRequestOptions]);

  // NSFW filter: Deactivate mature roles if NSFW is disabled
  useEffect(() => {
    if (!settings.showNSFWContent && activeRole) {
      const isMature =
        activeRole.category === "erwachsene" ||
        activeRole.tags?.some((t) => ["nsfw", "adult", "18+", "erotic"].includes(t.toLowerCase()));

      if (isMature) {
        setActiveRole(null);
        toasts.push({
          kind: "warning",
          title: "Rolle deaktiviert",
          message: "Diese Rolle ist aufgrund deiner Jugendschutz-Einstellungen nicht verfügbar.",
        });
      }
    }
  }, [activeRole, settings.showNSFWContent, setActiveRole, toasts]);

  // Conversation manager
  const { activeConversationId, newConversation, conversations, selectConversation } =
    useConversationManager({
      messages,
      isLoading,
      setMessages,
      setCurrentSystemPrompt,
      onNewConversation: () => {
        setInput("");
      },
      saveEnabled: memoryEnabled,
      restoreEnabled: settings.restoreLastConversation && memoryEnabled,
    });

  // Handle send
  const handleSend = useCallback(() => {
    if (isLoading) {
      toasts.push({
        kind: "warning",
        title: "Verarbeitung läuft",
        message: "Bitte warte einen Moment, bis die aktuelle Antwort fertig ist.",
      });
      return;
    }

    const validation = validatePrompt(input);

    if (!validation.valid) {
      if (validation.reason === "too_long") {
        toasts.push({
          kind: "error",
          title: "Nachricht zu lang",
          message: `Die Eingabe darf maximal ${MAX_PROMPT_LENGTH.toLocaleString("de-DE")} Zeichen enthalten. Wir haben sie entsprechend gekürzt.`,
        });
        setInput(validation.sanitized);
      } else {
        toasts.push({
          kind: "warning",
          title: "Leere Nachricht",
          message: "Bitte gib eine Nachricht ein, bevor du sendest.",
        });
      }
      return;
    }

    void append({ role: "user", content: validation.sanitized }).catch((error: unknown) => {
      // Use humanErrorToToast for consistent error handling
      const mappedError = error instanceof Error ? error : new Error(String(error));
      toasts.push(humanErrorToToast(mappedError));
    });
    setInput("");
  }, [append, input, isLoading, setInput, toasts]);

  // Handle edit
  const handleEdit = useCallback(
    (messageId: string, newContent: string) => {
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return;
      const newMessages = messages.slice(0, messageIndex);
      setMessages(newMessages);
      void append({ role: "user", content: newContent }, newMessages);
    },
    [messages, setMessages, append],
  );

  // Handle follow-up
  const handleFollowUp = useCallback(
    (prompt: string) => {
      if (isLoading) {
        toasts.push({
          kind: "warning",
          title: "Antwort läuft",
          message: "Warte kurz, bis die aktuelle Antwort fertig ist.",
        });
        return;
      }
      setInput(prompt);
      setTimeout(() => {
        const validation = validatePrompt(prompt);
        if (validation.valid) {
          void append({ role: "user", content: validation.sanitized });
          setInput("");
        }
      }, 100);
    },
    [setInput, append, isLoading, toasts],
  );

  // Handle retry
  const handleRetry = useCallback(
    (messageId: string) => {
      // Find the assistant message that needs to be retried
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return;

      // Find the last user message before this assistant message
      let lastUserMessage: ChatMessageType | null = null;
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (messages[i]?.role === "user") {
          lastUserMessage = messages[i] ?? null;
          break;
        }
      }

      if (!lastUserMessage) return;

      // Remove the assistant message and retry with the user message
      const newMessages = messages.slice(0, messageIndex);
      setMessages(newMessages);
      void append({ role: "user", content: lastUserMessage.content }, newMessages);
    },
    [messages, setMessages, append],
  );

  // Handle new conversation
  const handleStartNewChat = useCallback(() => {
    newConversation();
    setInput("");
  }, [newConversation, setInput]);

  // Handle starter click (auto-send)
  const handleStarterClick = useCallback(
    (prompt: string) => {
      setInput(prompt);
      // Auto-send after brief delay to allow input to update
      setTimeout(() => {
        handleSend();
      }, 100);
    },
    [setInput, handleSend],
  );

  // Get active conversation info
  const { activeConversation } = useConversationHistory(conversations, activeConversationId);

  // Compute derived state
  const hasActiveConversation = !!activeConversationId;
  const isEmpty = !hasActiveConversation && messages.length === 0;

  return {
    // State
    messages,
    isLoading,
    input,
    setInput,
    apiStatus,
    rateLimitInfo,
    error,
    isEmpty,
    activeConversation,
    activeConversationId,
    conversations,

    // Handlers
    handleSend,
    handleEdit,
    handleFollowUp,
    handleRetry,
    handleStartNewChat,
    handleStarterClick,
    selectConversation,
    navigate,

    // Preset handler
    startWithPreset: onStartWithPreset,
  };
}
