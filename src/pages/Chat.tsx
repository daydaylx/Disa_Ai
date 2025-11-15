import { useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ChatComposer } from "../components/chat/ChatComposer";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { Button } from "../components/ui/button";
import { Card, CardTitle } from "../components/ui/card";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { useChat } from "../hooks/useChat";
import { useConversationManager } from "../hooks/useConversationManager";
import { useRoles } from "../hooks/useRoles";
import { useSettings } from "../hooks/useSettings";
import { Settings } from "../lib/icons";
import { MAX_PROMPT_LENGTH, validatePrompt } from "../lib/chat/validation";

export default function Chat() {
  const toasts = useToasts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { activeRole } = useRoles();
  const { settings } = useSettings();

  const {
    messages,
    append,
    isLoading,
    setMessages,
    input,
    setInput,
    stop,
    setCurrentSystemPrompt,
  } = useChat({
    onError: (error) => {
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: error.message || "Ein Fehler ist aufgetreten",
      });
    },
  });

  useConversationManager({
    messages,
    isLoading,
    setMessages,
    setCurrentSystemPrompt,
    onNewConversation: () => {},
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

    void append({ role: "user", content: validation.sanitized }).catch((error: Error) => {
      toasts.push({
        kind: "error",
        title: "Senden fehlgeschlagen",
        message: error.message || "Die Nachricht konnte nicht gesendet werden.",
      });
    });
    setInput("");
  }, [append, input, isLoading, setInput, toasts]);

  const startWithPreset = (system: string, user?: string) => {
    void append({ role: "system", content: system });
    if (user) {
      void append({ role: "user", content: user });
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="chat-page-background relative flex min-h-[100dvh] flex-col text-text-primary">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(120%_100%_at_50%_0%,hsl(var(--brand-1)/0.18)_0%,transparent_70%)]" />
      </div>

      {/* Header with model, role, and settings */}
      <header className="sticky top-0 z-20 border-b border-[var(--glass-border-soft)] bg-surface-base/60 backdrop-blur-xl px-page-padding-x py-3 safe-area-top">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0"> {/* Added min-w-0 to prevent overflow */}
            {activeRole && (
              <div className="flex items-center gap-2">
                <span className="text-lg flex-shrink-0">{activeRole.emoji || "🤖"}</span>
                <span className="font-medium text-text-primary truncate">{activeRole.name}</span>
              </div>
            )}
            <span className="hidden sm:block text-xs text-text-secondary truncate">
              Modell: {settings.preferredModelId?.split('/')[1]?.replace('-', ' ') || 'Standard'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            aria-label="Einstellungen"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-page-padding-x py-space-md pb-32 safe-area-horizontal">
        {isEmpty ? (
          <>
            <section className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent/80">
                Schnellstart
              </p>
              <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">
                Was möchtest du heute mit Disa AI erledigen?
              </h1>
              <p className="max-w-2xl text-sm text-text-secondary">
                Wähle einen Einstieg oder starte direkt eine Nachricht. Optimiert für Android, PWA
                und ruhiges, fokussiertes Arbeiten.
              </p>
            </section>

            <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <Card
                tone="glass-primary"
                elevation="surface"
                padding="md"
                interactive="gentle"
                clickable
                onClick={() =>
                  startWithPreset(
                    "Du bist ein strukturierter Research-Assistent. Fasse Quellen, Argumente und Risiken sachlich zusammen.",
                    "Hilf mir bei einer tiefen Recherche zu einem Thema meiner Wahl.",
                  )
                }
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-lg">
                  <span>🧠</span>
                  <CardTitle className="text-base font-semibold">Research</CardTitle>
                </div>
                <p className="text-sm text-text-secondary flex-1">
                  Tiefe Recherchen, Quellencheck, Pro/Contra-Analysen.
                </p>
              </Card>

              <Card
                tone="glass-primary"
                elevation="surface"
                padding="md"
                interactive="gentle"
                clickable
                onClick={() =>
                  startWithPreset(
                    "Du unterstützt beim Schreiben klarer, freundlicher Nachrichten und E-Mails.",
                  )
                }
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-lg">
                  <span>✍️</span>
                  <CardTitle className="text-base font-semibold">Schreiben</CardTitle>
                </div>
                <p className="text-sm text-text-secondary flex-1">
                  Klare Mails, Support-Texte, Social Posts auf Knopfdruck.
                </p>
              </Card>

              <Card
                tone="glass-primary"
                elevation="surface"
                padding="md"
                interactive="gentle"
                clickable
                onClick={() =>
                  startWithPreset(
                    "Du bist ein gewissenhafter Coding-Partner. Erkläre Code knapp und schlage sichere Verbesserungen vor.",
                  )
                }
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-lg">
                  <span>💻</span>
                  <CardTitle className="text-base font-semibold">Code & Reviews</CardTitle>
                </div>
                <p className="text-sm text-text-secondary flex-1">
                  Erklärungen, Refactors und sichere Vorschläge für deinen Code.
                </p>
              </Card>
            </section>

            <section className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card tone="glass-primary" elevation="surface" padding="md">
                <CardTitle className="text-base font-semibold mb-3">Studio-Verknüpfungen</CardTitle>
                <div className="space-y-2">
                  <Link
                    to="/models"
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-surface-muted/80 transition-colors min-h-[44px]"
                  >
                    <span className="text-sm text-text-secondary">
                      Modelle vergleichen & wählen
                    </span>
                  </Link>
                  <Link
                    to="/roles"
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-surface-muted/80 transition-colors min-h-[44px]"
                  >
                    <span className="text-sm text-text-secondary">Rollenbibliothek erkunden</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-surface-muted/80 transition-colors min-h-[44px]"
                  >
                    <span className="text-sm text-text-secondary">
                      Einstellungen & API-Key prüfen
                    </span>
                  </Link>
                </div>
              </Card>

              <Card tone="glass-primary" elevation="surface" padding="md">
                <CardTitle className="text-base font-semibold mb-3">Hinweise</CardTitle>
                <div className="space-y-2 text-sm text-text-secondary">
                  <p>• Keine sensiblen Daten oder API-Keys direkt im Prompt teilen.</p>
                  <p>• Modelle, Limits & Verhalten steuerst du zentral im Studio.</p>
                  <p>• PWA-ready, mobile-first, designed für ruhige Sessions.</p>
                </div>
              </Card>
            </section>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <VirtualizedMessageList
              messages={messages}
              isLoading={isLoading}
              className="rounded-[var(--radius-xl)] border border-[color:var(--glass-border-soft)] bg-[color-mix(in_srgb,var(--layer-glass-panel) 94%,transparent)] shadow-[var(--shadow-lg)] p-4"
              onCopy={(content) => {
                navigator.clipboard.writeText(content).catch((err) => {
                  console.error("Failed to copy content:", err);
                });
              }}
              onRetry={(messageId) => {
                console.warn("Retry functionality not implemented for messageId:", messageId);
              }}
            />
          </div>
        )}
      </main>

      <div className="sticky bottom-0 bg-gradient-to-t from-surface-base to-transparent pt-4 z-10 safe-area-bottom">
        <div className="px-page-padding-x safe-area-horizontal">
          <ChatComposer
            value={input}
            onChange={setInput}
            onSend={handleSend}
            onStop={stop}
            isLoading={isLoading}
            canSend={!isLoading}
            placeholder="Nachricht an Disa AI schreiben..."
          />
        </div>
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}
