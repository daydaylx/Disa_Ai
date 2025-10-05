import { Brain } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useStudio } from "../app/state/StudioContext";
import { ChatComposer } from "../components/chat/ChatComposer";
import { ChatList } from "../components/chat/ChatList";
import { MemoryPanel } from "../components/memory/MemoryPanel";
import { Button } from "../components/ui/button";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { chooseDefaultModel, loadModelCatalog } from "../config/models";
import { useChat } from "../hooks/useChat";
import { useMemory } from "../hooks/useMemory";
import { humanError } from "../lib/errors/humanError";
import ModelSelectionSheet from "../ui/ModelSheet";
import type { Model } from "../ui/types";

// Header component removed - now handled by AppShell

/** ====== ChatPageV2 ====== */
export default function ChatPageV2() {
  const [models, setModels] = useState<Model[]>([]);
  const [model, setModel] = useState<Model | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isQuickstartLoading, setIsQuickstartLoading] = useState(false);
  const [memoryPanelVisible, setMemoryPanelVisible] = useState(true);
  const [showMemoryPanel, setShowMemoryPanel] = useState(true);
  const toasts = useToasts();
  const { activePersona, typographyScale, borderRadius, accentColor } = useStudio();

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

  const {
    memory,
    isUpdating: isMemoryUpdating,
    addNote,
    updateFromMessages,
  } = useMemory({
    threadId: "default",
    model: model?.id,
  });

  useEffect(() => {
    if (activePersona && messages.length === 0) {
      // Add system message for persona
      void append({
        role: "system",
        content: activePersona.systemPrompt,
      });
    }
  }, [activePersona, messages.length, append]);

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

  const handleQuickstartFlow = (prompt: string, autosend: boolean) => {
    // Set loading state
    setIsQuickstartLoading(true);

    // Set the input field with the quickstart prompt
    setInput(prompt);

    // If autosend is enabled, automatically send the message
    if (autosend && model) {
      setTimeout(() => {
        void append({
          role: "user",
          content: prompt,
        });
      }, 100); // Small delay to ensure input is set
    } else {
      // Clear loading state immediately if not auto-sending
      setTimeout(() => {
        setIsQuickstartLoading(false);
      }, 500); // Small delay for visual feedback
    }
  };

  // Clear quickstart loading when a message is sent
  useEffect(() => {
    if (isLoading || messages.length > 0) {
      setIsQuickstartLoading(false);
    }
  }, [isLoading, messages.length]);

  const handleRetry = () => {
    void reload();
  };

  const handleAddMemoryNote = async (note: string) => {
    try {
      await addNote(note);
      toasts.push({
        kind: "success",
        title: "Notiz gespeichert",
        message: "Die Notiz wurde erfolgreich zum Gedächtnis hinzugefügt.",
      });
    } catch (error) {
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: "Die Notiz konnte nicht gespeichert werden.",
      });
    }
  };

  const handleUpdateMemoryFromChat = async () => {
    if (messages.length > 0) {
      try {
        await updateFromMessages(messages);
        toasts.push({
          kind: "success",
          title: "Gedächtnis aktualisiert",
          message: "Das Gedächtnis wurde aus dem Chat-Verlauf aktualisiert.",
        });
      } catch (error) {
        toasts.push({
          kind: "error",
          title: "Fehler",
          message: "Das Gedächtnis konnte nicht aktualisiert werden.",
        });
      }
    }
  };

  // Calculate token count from all messages (currently unused but kept for future features)
  const _tokenCount = messages.reduce((acc, msg) => acc + msg.content.length, 0);

  return (
    <>
      <main className="relative z-10 flex h-full overflow-hidden pb-4">
        {/* Memory Toggle Button - Mobile */}
        <div className="fixed right-4 top-16 z-20 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMemoryPanel(!showMemoryPanel)}
            className="border-white/20 bg-white/10 backdrop-blur"
          >
            <Brain className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex h-full">
          {/* Chat Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <section className="flex-1 overflow-hidden" aria-label="Chat History">
              <div className="h-full px-1">
                <div
                  className={`mx-auto h-full w-full ${showMemoryPanel ? "max-w-sm md:max-w-md" : "max-w-md"}`}
                >
                  <ChatList
                    messages={messages}
                    onCopy={handleCopy}
                    onRetry={handleRetry}
                    onQuickstartFlow={handleQuickstartFlow}
                    isLoading={isLoading}
                    isQuickstartLoading={isQuickstartLoading}
                  />
                </div>
              </div>
            </section>

            {/* Input Section */}
            <section role="region" aria-label="Message Input" className="safe-bottom">
              <div className="px-1">
                <div
                  className={`mx-auto w-full ${showMemoryPanel ? "max-w-sm md:max-w-md" : "max-w-md"}`}
                >
                  <ChatComposer
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    onStop={stop}
                    onRetry={handleRetry}
                    isLoading={isLoading}
                    canSend={Boolean(model && input.trim())}
                    canRetry={Boolean(messages.length > 0)}
                  />

                  {/* Memory Quick Actions */}
                  {showMemoryPanel && messages.length > 0 && (
                    <div className="mt-2 flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUpdateMemoryFromChat}
                        disabled={isMemoryUpdating}
                        className="border-white/10 bg-white/5 text-xs"
                      >
                        {isMemoryUpdating ? "Aktualisiere..." : "Gedächtnis aktualisieren"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Memory Panel - Desktop sidebar */}
          {showMemoryPanel && (
            <div className="hidden w-80 overflow-hidden border-l border-white/10 bg-black/20 md:block">
              <div className="h-full p-4">
                <MemoryPanel
                  memory={memory}
                  threadTitle="Aktueller Chat"
                  isVisible={memoryPanelVisible}
                  onToggle={() => setMemoryPanelVisible(!memoryPanelVisible)}
                  onAddNote={handleAddMemoryNote}
                  isLoading={isMemoryUpdating}
                />
              </div>
            </div>
          )}
        </div>

        {/* Memory Panel - Mobile overlay */}
        {showMemoryPanel && (
          <div className="fixed inset-0 z-30 flex items-end bg-black/50 backdrop-blur-sm md:hidden">
            <div className="max-h-[70vh] w-full overflow-hidden rounded-t-lg border-t border-white/10 bg-black/90">
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Gedächtnis</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMemoryPanel(false)}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
                <MemoryPanel
                  memory={memory}
                  threadTitle="Aktueller Chat"
                  isVisible={true}
                  onToggle={() => {}}
                  onAddNote={handleAddMemoryNote}
                  isLoading={isMemoryUpdating}
                />
              </div>
            </div>
          </div>
        )}
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
