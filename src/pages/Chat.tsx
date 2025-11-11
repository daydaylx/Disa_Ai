import { useCallback, useEffect, useRef } from "react";

import { ChatComposer } from "../components/chat/ChatComposer";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { useChat } from "../hooks/useChat";
import { useConversationManager } from "../hooks/useConversationManager";
import { saveConversation } from "../lib/conversation-manager-modern";

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

  const { newConversation, setActiveConversationId, refreshConversations } = useConversationManager(
    {
      setMessages,
      setCurrentSystemPrompt,
      onNewConversation: () => {}, // Reset discussion on new chat
    },
  );

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

          const conversation = {
            id: crypto.randomUUID(),
            title: `Conversation ${new Date().toLocaleDateString()}`,
            messages: storageMessages,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            model: "default",
            messageCount: storageMessages.length,
          };
          // saveConversation is now async, await it
          await saveConversation(conversation);
          lastSavedSignatureRef.current = signature;
          setActiveConversationId(conversation.id);
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
  }, [isLoading, messages, setActiveConversationId, refreshConversations, toasts]); // Reruns when loading is finished

  // --- Handlers ---
  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    void append({ role: "user", content: input.trim() });
    setInput("");
  }, [input, append, setInput]);

  return (
    <div className="mobile-chat-container text-text-primary relative min-h-dvh overflow-hidden bg-[color:var(--surface-base)]">
      {/* Enhanced Aurora Background */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(100%_80%_at_20%_10%,hsl(var(--brand-1)/0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_20%,hsl(var(--brand-2)/0.12)_0%,transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(110%_70%_at_50%_90%,hsl(var(--brand-3)/0.06)_0%,transparent_60%)]" />
        <div
          className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,hsl(var(--brand-1)/0.03)_0deg,hsl(var(--brand-2)/0.05)_120deg,hsl(var(--brand-3)/0.04)_240deg,hsl(var(--brand-1)/0.03)_360deg)] animate-spin"
          style={{ animationDuration: "30s" }}
        />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4">
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
                  className="w-full sm:w-auto aurora-card-elevated aurora-glow-strong rounded-2xl px-6 py-3.5 min-h-[44px] text-base font-semibold text-[color:var(--text-primary)] hover:text-white transition-all duration-300 group touch-target"
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
