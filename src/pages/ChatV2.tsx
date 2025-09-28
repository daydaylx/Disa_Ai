import React, { useEffect, useState } from "react";

import { useStudio } from "../app/state/StudioContext";
import { Button } from "../components/ui/button";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { chooseDefaultModel, loadModelCatalog } from "../config/models";
import { useChat } from "../hooks/useChat";
import { humanError } from "../lib/errors/humanError";
import ModelSelectionSheet from "../ui/ModelSheet";
import type { Model } from "../ui/types";
import { ChatList } from "../components/chat/ChatList";
import { ChatComposer } from "../components/chat/ChatComposer";
import { TokenBadge } from "../components/chat/TokenBadge";

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
    <header className="safe-pt safe-px sticky top-0 z-20 backdrop-blur-2xl" role="banner">
      <div className="mx-auto max-w-4xl">
        <div className="group relative overflow-hidden rounded-2xl border-outline bg-surface-variant px-8 py-6 transition-all duration-300">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 via-slate-500/10 to-slate-600/10"></div>
            <div className="via-white/3 absolute inset-0 bg-gradient-to-br from-transparent to-transparent"></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-outline bg-surface shadow-[0_0_15px_rgba(71,85,105,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(71,85,105,0.3)]">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  className="text-on-surface drop-shadow-sm"
                >
                  <path
                    fill="currentColor"
                    d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8Z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-on-surface">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {activePersonaName && <span className="badge badge-accent">{activePersonaName}</span>}
              {tokenCount !== undefined && <TokenBadge current={tokenCount} />}
              <Button
                onClick={onOpenModels}
                variant="outline"
                data-testid="model.select"
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
    error: _error
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
      model: model?.id
    }
  });

  useEffect(() => {
    if (activePersona && messages.length === 0) {
      // Add system message for persona
      append({
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
      title: "Copied!",
      message: "Message copied to clipboard.",
    });
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    if (!model) {
      toasts.push({
        kind: "error",
        title: "No Model Available",
        message: "Please select a model before sending a message.",
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
        modelName={model?.label ?? "Loading..."}
        onOpenModels={() => setSheetOpen(true)}
        activePersonaName={activePersona?.name ?? null}
        tokenCount={tokenCount}
      />

      <main className="flex h-screen flex-col overflow-hidden bg-surface text-on-surface">
        {/* Chat Area */}
        <section className="flex-1 overflow-hidden" aria-label="Chat History">
          <div className="h-full px-3 sm:px-4">
            <div className="mx-auto h-full max-w-4xl">
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
          <div className="px-3 sm:px-4">
            <div className="mx-auto max-w-4xl">
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