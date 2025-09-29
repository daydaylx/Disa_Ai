import React, { useEffect, useState } from "react";

import { useStudio } from "../app/state/StudioContext";
import { ChatComposer } from "../components/chat/ChatComposer";
import { ChatList } from "../components/chat/ChatList";
import { TokenBadge } from "../components/chat/TokenBadge";
import { Button } from "../components/ui/button";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { chooseDefaultModel, loadModelCatalog } from "../config/models";
import { useChat } from "../hooks/useChat";
import { humanError } from "../lib/errors/humanError";
import ModelSelectionSheet from "../ui/ModelSheet";
import type { Model } from "../ui/types";

/** ====== UI: Header ====== */
function Header({
  title,
  modelName,
  onOpenModels,
  activePersonaName,
  tokenCount,
}: {
  title: string;
  modelName: string;
  onOpenModels: () => void;
  activePersonaName: string | null;
  tokenCount?: number;
}) {
  return (
    <header className="sticky top-0 z-20 -mx-1 px-1 pt-2" role="banner">
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 px-5 py-6 shadow-[0_28px_70px_rgba(12,16,35,0.65)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -top-28 right-[-10%] h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(236,72,153,0.35),_transparent_65%)]" />
          <div className="pointer-events-none absolute -bottom-24 left-[-5%] h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.35),_transparent_65%)]" />

          <div className="relative flex items-start justify-between gap-5">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/60">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1">
                  Live Chat
                </span>
                {activePersonaName && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] normal-case tracking-normal text-white/70">
                    Persona: {activePersonaName}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-semibold leading-tight text-white">{title}</h2>
                <p className="mt-2 max-w-[18rem] text-sm text-white/70">
                  Bereit für deine nächste Idee. Stelle Fragen, plane Projekte oder lass dir Inhalte
                  generieren.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 text-right">
              {tokenCount !== undefined && (
                <TokenBadge
                  current={tokenCount}
                  className="border-white/10 bg-white/10 px-3 py-1 text-[11px] text-white/80 backdrop-blur"
                />
              )}
              <Button
                onClick={onOpenModels}
                data-testid="model.select"
                variant="ghost"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white"
              >
                {modelName}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/** ====== ChatPageV2 ====== */
export default function ChatPageV2() {
  const [models, setModels] = useState<Model[]>([]);
  const [model, setModel] = useState<Model | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
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

  const handleRetry = () => {
    void reload();
  };

  // Calculate token count from all messages
  const tokenCount = messages.reduce((acc, msg) => acc + msg.content.length, 0);

  return (
    <>
      <Header
        title="Disa AI"
        modelName={model?.label ?? "Lädt …"}
        onOpenModels={() => setSheetOpen(true)}
        activePersonaName={activePersona?.name ?? null}
        tokenCount={tokenCount}
      />

      <main className="relative z-10 flex h-full flex-col overflow-hidden pb-4">
        {/* Chat Area */}
        <section className="flex-1 overflow-hidden" aria-label="Chat History">
          <div className="h-full px-1">
            <div className="mx-auto h-full w-full max-w-md">
              <ChatList
                messages={messages}
                onCopy={handleCopy}
                onRetry={handleRetry}
                isLoading={isLoading}
              />
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section role="region" aria-label="Message Input" className="safe-pb">
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
