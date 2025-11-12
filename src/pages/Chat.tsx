import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { ChatComposer } from "../components/chat/ChatComposer";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { useChat } from "../hooks/useChat";
import { useConversationManager } from "../hooks/useConversationManager";
import { saveConversation, updateConversation } from "../lib/conversation-manager-modern";

export default function Chat() {
  const toasts = useToasts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSavedSignatureRef = useRef<string | null>(null);

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

  const { activeConversationId, setActiveConversationId, refreshConversations } =
    useConversationManager({
      setMessages,
      setCurrentSystemPrompt,
      onNewConversation: () => {},
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length === 0) {
      lastSavedSignatureRef.current = null;
    }
  }, [messages.length]);

  useEffect(() => {
    const saveConversationIfNeeded = async () => {
      const lastMessage = messages[messages.length - 1];

      if (!isLoading && messages.length > 0 && lastMessage?.role === "assistant") {
        const storageMessages = messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          model: msg.model,
        }));

        try {
          const signature = `${storageMessages.length}:${lastMessage.id}:${lastMessage.content}`;
          if (lastSavedSignatureRef.current === signature) return;

          const now = new Date().toISOString();

          if (activeConversationId) {
            await updateConversation(activeConversationId, {
              messages: storageMessages,
              updatedAt: now,
              messageCount: storageMessages.length,
            });
          } else {
            const conversationId = crypto.randomUUID();
            const conversation = {
              id: conversationId,
              title: `Conversation ${new Date().toLocaleDateString()}`,
              messages: storageMessages,
              createdAt: now,
              updatedAt: now,
              model: "default",
              messageCount: storageMessages.length,
            };
            await saveConversation(conversation);
            setActiveConversationId(conversationId);
          }

          lastSavedSignatureRef.current = signature;
          await refreshConversations();
        } catch (error) {
          console.error("Failed to auto-save:", error);
          toasts.push({
            kind: "warning",
            title: "Speichern fehlgeschlagen",
            message: "Die Konversation konnte nicht automatisch gespeichert werden",
          });
        }
      }
    };

    void saveConversationIfNeeded();
  }, [
    isLoading,
    messages,
    activeConversationId,
    setActiveConversationId,
    refreshConversations,
    toasts,
  ]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    void append({ role: "user", content: input.trim() });
    setInput("");
  }, [input, append, setInput]);

  const startWithPreset = (system: string, user?: string) => {
    void append({ role: "system", content: system });
    if (user) {
      void append({ role: "user", content: user });
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="chat-page relative flex min-h-[100dvh] flex-col bg-surface-bg text-text-primary">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(120%_100%_at_50%_0%,hsl(var(--brand-1)/0.06)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-4">
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

            <section className="grid gap-3 md:grid-cols-3">
              <Card className="border-line-subtle bg-surface-base/95 shadow-neo-xs transition-colors hover:bg-surface-muted/90">
                <CardHeader className="pb-1">
                  <CardTitle className="flex items-center gap-2 text-xs font-semibold">
                    🧠 Research
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-[10px] text-text-secondary">
                  <p>Tiefe Recherchen, Quellencheck, Pro/Contra-Analysen.</p>
                  <Button
                    size="sm"
                    className="w-full justify-center"
                    onClick={() =>
                      startWithPreset(
                        "Du bist ein strukturierter Research-Assistent. Fasse Quellen, Argumente und Risiken sachlich zusammen.",
                        "Hilf mir bei einer tiefen Recherche zu einem Thema meiner Wahl.",
                      )
                    }
                  >
                    Research-Chat starten
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-line-subtle bg-surface-base/95 shadow-neo-xs transition-colors hover:bg-surface-muted/90">
                <CardHeader className="pb-1">
                  <CardTitle className="flex items-center gap-2 text-xs font-semibold">
                    ✍️ Schreiben
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-[10px] text-text-secondary">
                  <p>Klare Mails, Support-Texte, Social Posts auf Knopfdruck.</p>
                  <Button
                    size="sm"
                    className="w-full justify-center"
                    onClick={() =>
                      startWithPreset(
                        "Du unterstützt beim Schreiben klarer, freundlicher Nachrichten und E-Mails.",
                      )
                    }
                  >
                    Schreib-Assistent starten
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-line-subtle bg-surface-base/95 shadow-neo-xs transition-colors hover:bg-surface-muted/90">
                <CardHeader className="pb-1">
                  <CardTitle className="flex items-center gap-2 text-xs font-semibold">
                    💻 Code & Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-[10px] text-text-secondary">
                  <p>Erklärungen, Refactors und sichere Vorschläge für deinen Code.</p>
                  <Button
                    size="sm"
                    className="w-full justify-center"
                    onClick={() =>
                      startWithPreset(
                        "Du bist ein gewissenhafter Coding-Partner. Erkläre Code knapp und schlage sichere Verbesserungen vor.",
                      )
                    }
                  >
                    Code-Review starten
                  </Button>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-3 md:grid-cols-2">
              <Card className="border-line-subtle bg-surface-base/95 shadow-neo-xs">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-semibold">Studio-Verknüpfungen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 text-[10px] text-text-secondary">
                  <Link
                    to="/models"
                    className="flex items-center justify-between rounded-xl px-2 py-1.75 hover:bg-surface-muted/80"
                  >
                    <span>Modelle vergleichen & wählen</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-[9px]">
                      Öffnen
                    </Button>
                  </Link>
                  <Link
                    to="/roles"
                    className="flex items-center justify-between rounded-xl px-2 py-1.75 hover:bg-surface-muted/80"
                  >
                    <span>Rollenbibliothek erkunden</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-[9px]">
                      Öffnen
                    </Button>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center justify-between rounded-xl px-2 py-1.75 hover:bg-surface-muted/80"
                  >
                    <span>Einstellungen & API-Key prüfen</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-[9px]">
                      Öffnen
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-line-subtle bg-surface-base/95 shadow-neo-xs">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-semibold">Hinweise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 text-[10px] text-text-secondary">
                  <p>• Keine sensiblen Daten oder API-Keys direkt im Prompt teilen.</p>
                  <p>• Modelle, Limits & Verhalten steuerst du zentral im Studio.</p>
                  <p>• PWA-ready, mobile-first, designed für ruhige Sessions.</p>
                </CardContent>
              </Card>
            </section>
          </>
        ) : (
          <VirtualizedMessageList
            messages={messages}
            isLoading={isLoading}
            onCopy={(content) => {
              navigator.clipboard.writeText(content).catch((err) => {
                console.error("Failed to copy content:", err);
              });
            }}
            onRetry={(messageId) => {
              console.warn("Retry functionality not implemented for messageId:", messageId);
            }}
          />
        )}
      </main>

      <ChatComposer
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onStop={stop}
        isLoading={isLoading}
        canSend={!isLoading}
        placeholder="Nachricht an Disa AI schreiben..."
      />

      <div ref={messagesEndRef} />
    </div>
  );
}
