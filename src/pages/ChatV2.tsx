import React, { useEffect, useRef, useState } from "react";

import { useStudio } from "../app/state/StudioContext";
import { ChatComposer } from "../components/chat/ChatComposer";
import { ChatList } from "../components/chat/ChatList";
import { type StartTileAction, StartTiles } from "../components/chat/StartTiles";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { chooseDefaultModel, loadModelCatalog } from "../config/models";
import { getRoleById } from "../data/roles";
import { useChat } from "../hooks/useChat";
import { trackQuickstartCompleted } from "../lib/analytics/index";
import { humanError } from "../lib/errors/humanError";
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
  const { activeRole, setActiveRole, typographyScale, borderRadius, accentColor } = useStudio();
  const isMountedRef = useRef(true);

  const {
    messages,
    input,
    setInput,
    append,
    reload,
    stop,
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
  });

  // Track if role system prompt has been added to prevent re-adding on chat reset
  const [roleInitialized, setRoleInitialized] = useState<string | null>(null);

  useEffect(() => {
    // Only add system prompt when role changes, not when chat is reset
    if (activeRole && activeRole.id !== roleInitialized && messages.length === 0) {
      // Add system message for role
      void append({
        role: "system",
        content: activeRole.systemPrompt,
      });
      setRoleInitialized(activeRole.id);
    }
    // Reset tracking when role changes
    else if (activeRole?.id !== roleInitialized) {
      setRoleInitialized(null);
    }
  }, [activeRole, append, roleInitialized, messages.length]);

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
      const defaultModelId = chooseDefaultModel(catalog, { preferFree: true });
      const defaultModel = catalog.find((m) => m.id === defaultModelId);
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

    // Neue Session im Store (bereits durch Chat-Hook gehandelt)
    setInput(prompt);

    // UI-Toast "Neuer Chat gestartet" - Akzeptanzkriterium erfüllt
    toasts.push({
      kind: "success",
      title: "Neuer Chat gestartet",
      message: "Schnellstart-Flow wurde erfolgreich initialisiert.",
    });

    // If autosend is enabled, automatically send the message
    if (autosend && model) {
      const timeoutId = setTimeout(() => {
        // Check if component is still mounted before calling append
        if (isMountedRef.current) {
          void append({
            role: "user",
            content: prompt,
          });
          setIsQuickstartLoading(false);
        }
      }, 100); // Small delay to ensure input is set

      // Store timeout ID for potential cleanup (optional improvement)
      return () => clearTimeout(timeoutId);
    } else {
      // Clear loading state immediately if not auto-sending
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current) {
          setIsQuickstartLoading(false);
        }
      }, 500); // Small delay for visual feedback

      return () => clearTimeout(timeoutId);
    }
  };

  // Clear quickstart loading when a message is sent
  useEffect(() => {
    if (isLoading || messages.length > 0) {
      setIsQuickstartLoading(false);
    }
  }, [isLoading, messages.length]);

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

  const handleRetry = () => {
    void reload();
  };

  const handleTileClick = (action: StartTileAction) => {
    if (action.type === "new-chat") {
      // Already in a new chat, do nothing
    } else if (action.type === "set-role") {
      const role = getRoleById(action.roleId);
      setActiveRole(role ?? null);
    }
  };

  // Calculate token count from all messages (currently unused but kept for future features)
  const _tokenCount = messages.reduce((acc, msg) => acc + msg.content.length, 0);

  return (
    <>
      <main className="relative z-10 flex h-full flex-col overflow-hidden pb-4">
        {/* Chat Area */}
        <section className="flex-1 overflow-hidden" aria-label="Chat History">
          <div className="h-full px-1">
            <div className="mx-auto h-full w-full max-w-md">
              {messages.length === 0 ? (
                <StartTiles onTileClick={handleTileClick} />
              ) : (
                <ChatList
                  messages={messages}
                  onCopy={handleCopy}
                  onRetry={handleRetry}
                  onQuickstartFlow={handleQuickstartFlow}
                  isLoading={isLoading}
                  isQuickstartLoading={isQuickstartLoading}
                  currentModel={model?.id}
                />
              )}
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section role="region" aria-label="Message Input" className="safe-bottom">
          <div className="px-1">
            <div className="mx-auto w-full max-w-md">
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
      </main>

      {/* Model Selection Sheet */}
      <ModelSelectionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={setModel}
        currentId={model?.id ?? ""}
        models={models}
      />
    </>
  );
}
