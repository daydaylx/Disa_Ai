import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getModelFallback } from "../api/openrouter";
import { useStudio } from "../app/state/StudioContext";
import { ChatComposer } from "../components/chat/ChatComposer";
import { ChatList } from "../components/chat/ChatList";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { chooseDefaultModel, loadModelCatalog } from "../config/models";
import { buildSystemPrompt } from "../config/promptStyles";
import { getStyle, getUseRoleStyle } from "../config/settings";
import { generateRoleStyleText } from "../config/styleEngine";
import { useChat } from "../hooks/useChat";
import { useMemory } from "../hooks/useMemory";
import { useSettings } from "../hooks/useSettings";
import { trackQuickstartCompleted } from "../lib/analytics/index";
import { humanError } from "../lib/errors/humanError";
import type { ChatMessageType } from "../types/chatMessage";
import ModelSelectionSheet from "../ui/ModelSheet";
import type { Model } from "../ui/types";

// Header component removed - now handled by AppShell

/** ====== ChatPageV2 ====== */
// Interface for tracking active quickstarts
interface ActiveQuickstart {
  id: string;
  flowId: string;
  startTime: number;
  model?: string;
}

export default function ChatPageV2() {
  const [models, setModels] = useState<Model[]>([]);
  const [model, setModel] = useState<Model | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isQuickstartLoading, setIsQuickstartLoading] = useState(false);
  const activeQuickstartRef = useRef<ActiveQuickstart | null>(null);
  const toasts = useToasts();
  const { activeRole, typographyScale, borderRadius, accentColor } = useStudio();
  const isMountedRef = useRef(true);

  const location = useLocation();
  const navigate = useNavigate();
  const newChatTokenRef = useRef<number | null>(null);

  const {
    updateFromMessages,
    updateSettings,
    globalMemory,
    settings: memorySettings,
  } = useMemory();
  const { settings: userSettings } = useSettings();

  const memoryContext = useMemo(() => {
    if (!memorySettings.enabled || !globalMemory) {
      return null;
    }

    const segments: string[] = [];
    if (globalMemory.summary) {
      segments.push(globalMemory.summary);
    }
    if (globalMemory.name) {
      segments.push(`Name: ${globalMemory.name}`);
    }
    if (globalMemory.background) {
      segments.push(`Hintergrund: ${globalMemory.background}`);
    }
    if (Array.isArray(globalMemory.hobbies) && globalMemory.hobbies.length > 0) {
      segments.push(`Hobbys: ${globalMemory.hobbies.join(", ")}`);
    }
    if (globalMemory.preferences && Object.keys(globalMemory.preferences).length > 0) {
      segments.push(`Präferenzen: ${JSON.stringify(globalMemory.preferences)}`);
    }

    if (segments.length === 0) {
      return null;
    }

    return `Merk dir folgende Nutzer-Informationen für künftige Antworten:\n${segments.join(
      "\n\n",
    )}`;
  }, [globalMemory, memorySettings.enabled]);

  const buildSystemContext = useCallback(
    (history: ChatMessageType[]) => {
      const context: ChatMessageType[] = [];
      const styleKey = getStyle();
      const useRoleStyle = getUseRoleStyle();
      const basePrompt = buildSystemPrompt({
        nsfw: userSettings.showNSFWContent,
        style: styleKey,
      });
      const styleText = generateRoleStyleText(
        activeRole?.id ?? null,
        styleKey,
        useRoleStyle,
      ).trim();
      const combinedBase = [basePrompt, styleText].filter(Boolean).join("\n\n").trim();
      const timestamp = Date.now();

      if (combinedBase) {
        context.push({
          id: "system-base",
          role: "system",
          content: combinedBase,
          timestamp,
        });
      }

      if (activeRole?.systemPrompt) {
        context.push({
          id: "system-role",
          role: "system",
          content: activeRole.systemPrompt,
          timestamp,
        });
      }

      if (memoryContext) {
        context.push({
          id: "system-memory",
          role: "system",
          content: memoryContext,
          timestamp,
        });
      }

      return [...context, ...history];
    },
    [activeRole, memoryContext, userSettings.showNSFWContent],
  );

  const {
    messages,
    input,
    setInput,
    append,
    reload,
    stop,
    setMessages,
    isLoading,
    error: _error,
  } = useChat({
    onError: (error) => {
      const { title, message } = humanError(error);
      toasts.push({
        kind: "error",
        title,
        message,
      });
    },
    body: {
      model: model?.id,
    },
    prepareMessages: buildSystemContext,
  });

  // Auto-enable memory system in background
  useEffect(() => {
    void updateSettings({ enabled: true });
  }, [updateSettings]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", `${typographyScale}`);
    document.documentElement.style.setProperty("--border-radius", `${borderRadius}rem`);
    document.documentElement.style.setProperty("--accent-color", accentColor);
  }, [typographyScale, borderRadius, accentColor]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const catalog = await loadModelCatalog();
      if (!alive) return;
      setModels(catalog);
      const storedModelId = getModelFallback();
      const defaultModelId = chooseDefaultModel(catalog, {
        allow: storedModelId ? [storedModelId] : null,
        preferFree: true,
      });
      const defaultModel =
        catalog.find((m) => m.id === defaultModelId) ??
        (storedModelId ? catalog.find((m) => m.id === storedModelId) : null);
      setModel(defaultModel ?? catalog[0] ?? null);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Cleanup effect to prevent race conditions on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleCopy = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .catch((err) => console.error("Could not copy text: ", err));
    toasts.push({
      kind: "success",
      title: "Kopiert!",
      message: "Nachricht wurde in die Zwischenablage kopiert.",
    });
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    if (!model) {
      toasts.push({
        kind: "error",
        title: "Kein Modell verfügbar",
        message: "Bitte wählen Sie vor dem Senden ein Modell aus.",
      });
      return;
    }

    void append({
      role: "user",
      content: text,
    });
  };

  const handleQuickstartFlow = (
    prompt: string,
    autosend: boolean,
    quickstartInfo?: { id: string; flowId: string },
  ) => {
    // Fix für Issue #79: Vollständige Schnellstart-Funktionalität
    setIsQuickstartLoading(true);

    // Store quickstart info for completion tracking (Issue #71)
    if (quickstartInfo) {
      activeQuickstartRef.current = {
        id: quickstartInfo.id,
        flowId: quickstartInfo.flowId,
        startTime: Date.now(),
        model: model?.id,
      };
    }

    // Set input immediately - React batches state updates
    setInput(prompt);

    // UI-Toast "Neuer Chat gestartet" - Akzeptanzkriterium erfüllt
    toasts.push({
      kind: "success",
      title: "Neuer Chat gestartet",
      message: "Schnellstart-Flow wurde erfolgreich initialisiert.",
    });

    if (autosend && model) {
      // Use microtask to ensure state updates are processed
      void Promise.resolve().then(() => {
        if (isMountedRef.current) {
          void append({
            role: "user",
            content: prompt,
          });
          // Loading state will be cleared by useEffect when isLoading changes
        }
      });
    } else {
      // No autosend - clear loading state immediately since user needs to manually send
      setIsQuickstartLoading(false);
    }
  };

  // Clear quickstart loading when a message is sent
  useEffect(() => {
    if (isLoading || messages.length > 0) {
      setIsQuickstartLoading(false);
    }
  }, [isLoading, messages.length]);

  const handleNewChat = useCallback(() => {
    const hadConversation = messages.length > 0 || input.trim().length > 0;

    stop();
    activeQuickstartRef.current = null;
    setIsQuickstartLoading(false);
    setMessages([]);
    setInput("");

    if (hadConversation) {
      toasts.push({
        kind: "success",
        title: "Neuer Chat gestartet",
        message: "Chatverlauf wurde zurückgesetzt.",
      });
    }
  }, [input, messages.length, setInput, setMessages, stop, toasts]);

  useEffect(() => {
    const state = (location.state as { newChat?: number } | null) ?? null;
    const newChatValue = state?.newChat;

    if (newChatValue && newChatValue !== newChatTokenRef.current) {
      newChatTokenRef.current = newChatValue;
      handleNewChat();

      const nextState: Record<string, unknown> = { ...(state ?? {}) };
      delete nextState.newChat;
      void navigate(location.pathname, {
        replace: true,
        state: Object.keys(nextState).length > 0 ? nextState : null,
      });
    }
  }, [handleNewChat, location.pathname, location.state, navigate]);

  // Track quickstart completion (Issue #71)
  useEffect(() => {
    // Check if we have an active quickstart and received a response
    if (activeQuickstartRef.current && messages.length >= 2) {
      const lastMessage = messages[messages.length - 1];

      // If the last message is from assistant, quickstart is completed
      if (lastMessage?.role === "assistant") {
        const quickstart = activeQuickstartRef.current;
        const duration = Date.now() - quickstart.startTime;

        trackQuickstartCompleted({
          id: quickstart.id,
          flowId: quickstart.flowId,
          model: quickstart.model,
          duration_ms: duration,
        });

        // Quickstart completion tracked

        // Clear the active quickstart
        activeQuickstartRef.current = null;
      }
    }
  }, [messages]);

  // Auto-update memory from chat messages in background
  useEffect(() => {
    if (messages.length >= 2) {
      const lastMessage = messages[messages.length - 1];
      // Only update memory when assistant responds (conversation is complete)
      if (lastMessage?.role === "assistant") {
        updateFromMessages(messages, model?.id).catch(console.warn);
      }
    }
  }, [messages, model?.id, updateFromMessages]);

  const handleRetry = () => {
    void reload();
  };

  // Calculate token count from all messages (currently unused but kept for future features)
  // const _tokenCount = messages.reduce((acc, msg) => acc + msg.content.length, 0);

  const handleSelectModel = useCallback((next: Model) => {
    setModel(next);
    try {
      localStorage.setItem("disa_model", next.id);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <>
      <main className="relative z-10 mx-auto flex h-full max-w-screen-2xl overflow-hidden pb-4">
        <div className="flex h-full w-full">
          {/* Chat Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <section className="flex-1 overflow-hidden" aria-label="Chat History">
              <div className="h-full px-1">
                <div className="h-full w-full">
                  <ChatList
                    messages={messages}
                    onCopy={handleCopy}
                    onRetry={handleRetry}
                    onQuickstartFlow={handleQuickstartFlow}
                    isLoading={isLoading}
                    isQuickstartLoading={isQuickstartLoading}
                    currentModel={model?.id}
                  />
                </div>
              </div>
            </section>

            {/* Input Section */}
            <section role="region" aria-label="Message Input" className="safe-bottom">
              <div className="px-1">
                <div className="w-full">
                  <ChatComposer
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    onStop={stop}
                    onRetry={handleRetry}
                    isLoading={isLoading}
                    canSend={Boolean(model && input.trim())}
                    canRetry={Boolean(messages.length > 0)}
                    isQuickstartLoading={isQuickstartLoading}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Model Selection Sheet */}
      <ModelSelectionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={handleSelectModel}
        currentId={model?.id ?? ""}
        models={models}
      />
    </>
  );
}
