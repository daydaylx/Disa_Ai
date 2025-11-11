import { useCallback, useEffect, useRef } from "react";

import { ChatComposer } from "../components/chat/ChatComposer";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { useChat } from "../hooks/useChat";
import { useConversationManager } from "../hooks/useConversationManager";
import { saveConversation, updateConversation } from "../lib/conversation-manager-modern";

export default function Chat() {
  const toasts = useToasts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSavedSignatureRef = useRef<string | null>(null);

  // --- Core Hooks ---
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

  const { newConversation, activeConversationId, setActiveConversationId, refreshConversations } =
    useConversationManager({
      setMessages,
      setCurrentSystemPrompt,
      onNewConversation: () => {}, // Reset discussion on new chat
    });

  // --- Effects ---

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length === 0) {
      lastSavedSignatureRef.current = null;
    }
  }, [messages.length]);

  // Auto-save conversation on finish
  useEffect(() => {
    const saveConversationIfNeeded = async () => {
      const lastMessage = messages[messages.length - 1];

      if (!isLoading && messages.length > 0 && lastMessage?.role === "assistant") {
        const finalMessages = messages;

        const storageMessages = finalMessages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          model: msg.model,
        }));

        try {
          const signature = `${storageMessages.length}:${lastMessage.id}:${lastMessage.content}`;
          if (lastSavedSignatureRef.current === signature) {
            return;
          }

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
  ]); // Reruns when loading is finished

  // --- Handlers ---
  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    void append({ role: "user", content: input.trim() });
    setInput("");
  }, [input, append, setInput]);

  return (
    <div className="chat-page flex min-h-[100dvh] flex-col bg-surface-bg text-text-primary">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(120%_100%_at_50%_0%,hsl(var(--brand-1)/0.06)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col px-4">
        {messages.length === 0 ? (
          <div className="aurora-hero-mobile">
            <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 aurora-text-glow">
                Willkommen bei Disa AI
              </h1>
              <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 text-[color:var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                Erleben Sie die Zukunft der KI-Kommunikation. Beginnen Sie Ihre erste Konversation
                und entdecken Sie grenzenlose Möglichkeiten.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-6 sm:mb-8">
                <button
                  onClick={newConversation}
                  className="w-full sm:w-auto rounded-2xl bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-neo-sm transition-all duration-200 hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base touch-target"
                >
                  <span className="flex items-center justify-center gap-2.5">
                    <span className="text-lg">✨</span>
                    <span>Neue Konversation starten</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
                <div className="text-sm text-[color:var(--text-secondary)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  KI-System bereit
                </div>
              </div>

              <div className="mobile-feature-grid">
                <div className="aurora-card-elevated rounded-xl p-4 text-center group mobile-feature-card">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-[color:var(--brand-1)] to-[color:var(--brand-2)] flex items-center justify-center text-xl">
                    🧠
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-[color:var(--text-primary)]">
                    Intelligente Antworten
                  </h3>
                  <p className="text-xs text-[color:var(--text-secondary)] leading-snug">
                    Fortschrittliche KI für natürliche Konversationen
                  </p>
                </div>

                <div className="aurora-card-elevated rounded-xl p-4 text-center group mobile-feature-card">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-[color:var(--brand-2)] to-[color:var(--brand-3)] flex items-center justify-center text-xl">
                    ⚡
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-[color:var(--text-primary)]">
                    Schnelle Antworten
                  </h3>
                  <p className="text-xs text-[color:var(--text-secondary)] leading-snug">
                    Blitzschnelle Reaktionszeiten
                  </p>
                </div>

                <div className="aurora-card-elevated rounded-xl p-4 text-center group mobile-feature-card">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-[color:var(--brand-3)] to-[color:var(--brand-4)] flex items-center justify-center text-xl">
                    🔒
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-[color:var(--text-primary)]">
                    Datenschutz
                  </h3>
                  <p className="text-xs text-[color:var(--text-secondary)] leading-snug">
                    Ihre Gespräche bleiben sicher
                  </p>
                </div>
              </div>
            </div>
          </div>
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

      {/* Unified Composer Input */}
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
