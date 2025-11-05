import { lazy, Suspense, useCallback, useEffect, useRef } from "react";

import { ChatComposer } from "../components/chat/ChatComposer";
import { ChatList } from "../components/chat/ChatList";
import { DiscussionStarter } from "../components/chat/DiscussionStarter";
import { WelcomeScreen } from "../components/chat/WelcomeScreen";
import { Button } from "../components/ui/button";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { DISCUSSION_CARD_HINT, discussionTopicConfig } from "../config/discussion-topics";
import { useChat } from "../hooks/useChat";
import { useConversationManager } from "../hooks/useConversationManager";
import { useDiscussion } from "../hooks/useDiscussion";
import { saveConversation } from "../lib/conversation-manager";
const ChatHistorySidebar = lazy(() =>
  import("../components/chat/ChatHistorySidebar").then((module) => ({
    default: module.ChatHistorySidebar,
  })),
);

const DISCUSSION_SECTIONS = [
  {
    id: "curiosity",
    title: "Neugier & Sinnfragen",
    description: "Philosophische Warm-ups und lockere Brainstormings.",
  },
  {
    id: "future",
    title: "Zukunft & Technologie",
    description: "Blick nach vorn auf Innovation, Automatisierung und KI.",
  },
  {
    id: "society",
    title: "Gesellschaft & Alltag",
    description: "Diskussionen rund um Klima, Wirtschaft und soziale Dynamiken.",
  },
].map((section) => ({
  ...section,
  topics: discussionTopicConfig
    .filter((topic) => topic.category === section.id)
    .map((topic) => ({ ...topic, hint: DISCUSSION_CARD_HINT })),
}));

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
    setRequestOptions,
  } = useChat({
    onError: (error) => {
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: error.message || "Ein Fehler ist aufgetreten",
      });
    },
  });

  const {
    isHistoryOpen,
    openHistory,
    closeHistory,
    conversations,
    activeConversationId,
    selectConversation,
    deleteConversation,
    newConversation,
    setActiveConversationId,
    refreshConversations,
  } = useConversationManager({
    setMessages,
    setCurrentSystemPrompt,
    onNewConversation: () => resetDiscussion(), // Reset discussion on new chat
  });

  const {
    discussionPreset,
    handleDiscussionPresetChange,
    startDiscussion,
    onDiscussionFinish,
    resetDiscussion,
    isDiscussionActive,
  } = useDiscussion({
    append,
    setMessages,
    setSystemPrompt: setCurrentSystemPrompt,
    setRequestOptions,
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
    const lastMessage = messages[messages.length - 1];

    if (!isLoading && messages.length > 0 && lastMessage?.role === "assistant") {
      let finalMessages = messages;
      if (isDiscussionActive()) {
        finalMessages = onDiscussionFinish(lastMessage, messages);
      }

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
          id: activeConversationId || crypto.randomUUID(),
          title: `Conversation ${new Date().toLocaleDateString()}`,
          messages: storageMessages,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          model: "default",
          messageCount: storageMessages.length,
        };
        // saveConversation is synchronous, no await needed.
        saveConversation(conversation);
        lastSavedSignatureRef.current = signature;
        if (!activeConversationId) {
          setActiveConversationId(conversation.id);
        }
        refreshConversations();
      } catch (error) {
        console.error("Failed to auto-save:", error);
        toasts.push({
          kind: "warning",
          title: "Speichern fehlgeschlagen",
          message: "Die Konversation konnte nicht automatisch gespeichert werden",
        });
      }
    }
  }, [
    isLoading,
    messages,
    isDiscussionActive,
    onDiscussionFinish,
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
    <div className="mobile-chat-container text-text-primary relative min-h-dvh overflow-hidden bg-[var(--surface-bg)]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(150%_120%_at_12%_10%,rgba(var(--color-surface-base),0.18)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_110%_at_88%_18%,rgba(var(--color-brand-strong-rgb),0.12)_0%,transparent_60%)]" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4">
        {messages.length === 0 ? (
          <WelcomeScreen newConversation={newConversation} openHistory={openHistory} />
        ) : (
          <ChatList
            messages={messages}
            isLoading={isLoading}
            onShowHistory={openHistory}
            onRetry={(messageId) => {
              // Implement retry logic if needed
              console.warn("Retry functionality not implemented for messageId:", messageId);
            }}
            onCopy={(content) => {
              navigator.clipboard.writeText(content).catch((err) => {
                console.error("Failed to copy content:", err);
              });
            }}
          />
        )}
      </main>

      <div className="fixed bottom-20 right-4 z-20">
        <DiscussionStarter
          discussionPreset={discussionPreset}
          handleDiscussionPresetChange={handleDiscussionPresetChange}
          startDiscussion={startDiscussion}
          discussionSections={DISCUSSION_SECTIONS}
        >
          <Button variant="brand" size="lg" dramatic>
            Start Discussion
          </Button>
        </DiscussionStarter>
      </div>

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

      {/* Responsive History Sidebar */}
      <Suspense fallback={<div>Lade Verlauf...</div>}>
        <ChatHistorySidebar
          isOpen={isHistoryOpen}
          onClose={closeHistory}
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={selectConversation}
          onDelete={deleteConversation}
        />
      </Suspense>
    </div>
  );
}
