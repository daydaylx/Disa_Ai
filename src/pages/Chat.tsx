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
    <div className="mobile-chat-container text-text-primary relative min-h-dvh overflow-hidden bg-[var(--surface-bg)]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(150%_120%_at_12%_10%,rgba(var(--color-surface-base),0.18)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_110%_at_88%_18%,rgba(var(--color-brand-strong-rgb),0.12)_0%,transparent_60%)]" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4">
        {messages.length === 0 ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <h1 className="mb-4 text-3xl font-bold text-[var(--color-text-primary)]">
              Willkommen bei Disa AI
            </h1>
            <p className="mb-8 text-[var(--color-text-secondary)]">
              Beginnen Sie eine neue Konversation oder wählen Sie aus den verfügbaren Modellen.
            </p>
            <button
              onClick={newConversation}
              className="rounded-lg bg-[var(--color-brand-primary)] px-6 py-3 text-white hover:bg-[var(--color-brand-primary-hover)]"
            >
              Neue Konversation starten
            </button>
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
