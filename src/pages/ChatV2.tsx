import { useEffect, useRef, useState } from "react";

import { useStudio } from "../app/state/StudioContext";
import { ChatComposer } from "../components/chat/ChatComposer";
import { ChatList } from "../components/chat/ChatList";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { chooseDefaultModel, loadModelCatalog } from "../config/models";
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
  const { activeRole, typographyScale, borderRadius, accentColor } = useStudio();
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

  return (
    <>
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {/* Willkommen zurück Bereich */}
            <div className="mb-8">
              <h2 className="mb-2 text-lg font-medium text-white/80">WILLKOMMEN ZURÜCK</h2>
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Was möchtest du heute erschaffen?
                </h3>
                <p className="text-white/70">
                  Nutze die vorgeschlagenen Flows oder stelle einfach deine Frage. Disa AI reagiert
                  in Sekunden.
                </p>
              </div>
            </div>

            {/* AI Flow Kacheln */}
            <div className="space-y-4">
              {/* Kurze Antwort verfassen */}
              <button
                onClick={() =>
                  handleQuickstartFlow(
                    "Schreibe eine freundliche Antwort auf diese E-Mail: ",
                    false,
                  )
                }
                className="group w-full rounded-2xl border border-white/10 bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-blue-500/10 p-6 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-left">
                    <h4 className="mb-1 font-medium text-white">Kurzantwort verfassen</h4>
                    <p className="text-sm text-white/60">
                      Professionelle Antworten auf kurze Nachrichten
                    </p>
                  </div>
                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors group-hover:bg-white/20">
                    Schnellstart
                  </div>
                </div>
              </button>

              {/* Ideen-Generator */}
              <button
                onClick={() =>
                  handleQuickstartFlow(
                    "Gib mir 10 kreative Ideen in Bulletpoints zu folgendem Thema: ",
                    false,
                  )
                }
                className="group w-full rounded-2xl border border-white/10 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 p-6 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-left">
                    <h4 className="mb-1 font-medium text-white">Ideen-Generator (DE)</h4>
                    <p className="text-sm text-white/60">10 kreative Ideen in Bulletpoints</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors group-hover:bg-white/20">
                    Auto-Start
                  </div>
                </div>
              </button>

              {/* Faktencheck */}
              <button
                onClick={() =>
                  handleQuickstartFlow(
                    "Führe einen Faktencheck durch und liste 3 vertrauenswürdige Quellen auf für folgende Behauptung: ",
                    false,
                  )
                }
                className="group w-full rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 p-6 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-left">
                    <h4 className="mb-1 font-medium text-white">Faktencheck (mit Quellen)</h4>
                    <p className="text-sm text-white/60">Prüft Behauptungen, listet 3 Quellen</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors group-hover:bg-white/20">
                    Schnellstart
                  </div>
                </div>
              </button>

              {/* Code-Snippet erklären */}
              <button
                onClick={() =>
                  handleQuickstartFlow(
                    "Erkläre diesen Code und liefere eine vereinfachte Version: ",
                    false,
                  )
                }
                className="group w-full rounded-2xl border border-white/10 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 p-6 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-left">
                    <h4 className="mb-1 font-medium text-white">Code-Snippet erklären</h4>
                    <p className="text-sm text-white/60">
                      Erklärt Code und liefert vereinfachte Version
                    </p>
                  </div>
                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors group-hover:bg-white/20">
                    Schnellstart
                  </div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <div className="h-full px-1">
              <div className="mx-auto h-full w-full max-w-md">
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
          </div>
        )}

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
      </div>

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
