import { History, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { ChatComposer } from "../components/chat/ChatComposer";
import { ChatHistorySidebar } from "../components/chat/ChatHistorySidebar";
import { MessageBubbleCard } from "../components/chat/MessageBubbleCard";
import { MobileChatHistorySidebar } from "../components/chat/MobileChatHistorySidebar";
import SettingsFAB from "../components/nav/SettingsFAB";
import Accordion from "../components/ui/Accordion";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";
import { getDiscussionMaxSentences } from "../config/settings";
import { useChat } from "../hooks/useChat";
import { useConversationManager } from "../hooks/useConversationManager";
import { useDiscussion } from "../hooks/useDiscussion";
import { useIsMobile } from "../hooks/useMediaQuery";
import { saveConversation } from "../lib/conversation-manager";
import { discussionPresetOptions } from "../prompts/discussion/presets";
import type { ChatMessageType } from "../types";

const DISCUSSION_CARD_HINT = "Kurze Spekulationsrunde (5–10 Sätze, Abschlussfrage inklusive).";

// This component will be much cleaner now
export default function Chat() {
  const toasts = useToasts();
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // --- Hardcoded Config (could be moved) ---
  const discussionTopicConfig = useMemo(
    () => [
      {
        title: "Gibt es Außerirdische?",
        prompt: "Gibt es Außerirdische?",
        category: "curiosity",
      },
      // ... other topics
    ],
    [],
  );

  const discussionSections = useMemo(
    () =>
      [
        {
          id: "curiosity",
          title: "Neugier & Sinnfragen",
          description: "Philosophische Warm-ups und lockere Brainstormings.",
        },
        // ... other sections
      ].map((section) => ({
        ...section,
        topics: discussionTopicConfig
          .filter((topic) => topic.category === section.id)
          .map((topic) => ({ ...topic, hint: DISCUSSION_CARD_HINT })),
      })),
    [discussionTopicConfig],
  );

  // --- Render Logic ---

  const renderWelcomeScreen = () => (
    <>
      <header className="mobile-chat-header space-y-stack-gap">
        {/* Welcome Header */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">
            Chat-Start
          </p>
          <h1 className="text-token-h1 text-text-strong text-balance font-semibold">
            Disa&nbsp;AI Chat
          </h1>
          <p className="text-sm leading-6 text-text-muted">
            Starte eine Unterhaltung oder nutze die Schnellstarts für wiederkehrende Aufgaben.
          </p>
        </div>
        <div
          className="flex flex-wrap items-center gap-2 sm:justify-end"
          role="toolbar"
          aria-label="Chat-Aktionen"
        >
          <Button
            onClick={newConversation}
            variant="brand"
            size="lg"
            className="shadow-neon mobile-btn mobile-btn-primary touch-target"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Neuer Chat</span>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={openHistory}
                variant="secondary"
                size="icon"
                aria-label="Chat-Verlauf öffnen"
                className="mobile-btn mobile-btn-secondary touch-target"
              >
                <History className="h-5 w-5" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Verlauf öffnen</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <section aria-labelledby="discussion-heading" className="pb-8">
        {/* Discussion Section */}
        <div className="bg-surface-0/70 border-border/45 mb-5 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-1">
            <span
              id="discussion-heading"
              className="text-text-subtle text-[11px] font-semibold uppercase tracking-[0.24em]"
            >
              Diskussionen
            </span>
            <p className="text-xs leading-6 text-text-muted">
              Ein Absatz, 5–{getDiscussionMaxSentences()} Sätze, Abschlussfrage inklusive.
            </p>
          </div>
          <div className="w-full sm:w-60" role="group" aria-labelledby="discussion-style-label">
            <Label
              id="discussion-style-label"
              htmlFor="discussion-style"
              className="mb-1 block text-xs font-semibold uppercase tracking-[0.24em] text-text-muted"
            >
              Stil auswählen
            </Label>
            <Select value={discussionPreset} onValueChange={handleDiscussionPresetChange}>
              <SelectTrigger id="discussion-style" className="mobile-form-select touch-target">
                <SelectValue placeholder="Stil wählen" />
              </SelectTrigger>
              <SelectContent>
                {discussionPresetOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Accordion
          single
          items={discussionSections.map((section, index) => ({
            id: section.id,
            title: section.title,
            meta: `${section.topics.length} Themen`,
            defaultOpen: index === 0,
            content: (
              <div className="space-y-3">
                <p className="text-text-subtle text-xs leading-5">{section.description}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {section.topics.map((topic) => (
                    <button
                      key={topic.title}
                      type="button"
                      onClick={() => startDiscussion(topic.prompt)}
                      title={topic.hint}
                      className="mobile-card touch-target group flex flex-col gap-1 rounded-md border px-3 py-2 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                      <span className="text-text-strong text-sm font-medium [hyphens:auto]">
                        {topic.title}
                      </span>
                      <span className="text-text-subtle text-xs">{topic.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
            ),
          }))}
        />
      </section>
    </>
  );

  const renderChatView = () => (
    <>
      <header className="mobile-chat-header space-y-stack-gap">
        {/* Chat Header */}
        <div className="space-y-1">
          <h2 className="text-token-h2 text-text-strong text-balance font-semibold">
            Unterhaltung
          </h2>
          <p className="text-sm leading-6 text-text-muted">
            Aktuelle Unterhaltung mit Disa&nbsp;AI.
          </p>
        </div>
        <div
          className="mobile-chat-toolbar flex flex-wrap items-center gap-2 sm:justify-end"
          role="toolbar"
        >
          <Button
            onClick={newConversation}
            variant="brand"
            size="lg"
            className="shadow-neon mobile-btn mobile-btn-primary touch-target"
          >
            <Plus className="h-4 w-4" />
            <span>Neue Unterhaltung</span>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={openHistory}
                variant="secondary"
                size="icon"
                className="mobile-btn mobile-btn-secondary touch-target"
              >
                <History className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Verlauf öffnen</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <div className="mobile-chat-messages">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="mobile-chat-loading animate-fade-in flex justify-start">
            {/* Loading Indicator */}
            <div className="border-border mr-12 max-w-[85%] rounded-lg border bg-surface-card p-4">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-brand-primary motion-safe:animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-brand-primary [animation-delay:0.15s] motion-safe:animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-brand-primary [animation-delay:0.3s] motion-safe:animate-bounce"></div>
                </div>
                <span className="text-sm text-text-muted motion-safe:animate-pulse">
                  Disa denkt nach...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );

  return (
    <div className="mobile-chat-container text-text-0 relative min-h-dvh overflow-hidden bg-[var(--surface-bg)]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(150%_120%_at_12%_10%,rgba(var(--color-surface-base),0.18)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_110%_at_88%_18%,rgba(var(--color-brand-strong-rgb),0.12)_0%,transparent_60%)]" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4">
        {messages.length === 0 ? renderWelcomeScreen() : renderChatView()}
      </main>

      {/* Unified Composer Input */}
      <ChatComposer
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onStop={stop}
        isLoading={isLoading}
        canSend={!isLoading}
      />

      {/* Responsive History Sidebar */}
      {isMobile ? (
        <MobileChatHistorySidebar
          isOpen={isHistoryOpen}
          onClose={closeHistory}
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={selectConversation}
          onDelete={deleteConversation}
        />
      ) : (
        <ChatHistorySidebar
          isOpen={isHistoryOpen}
          onClose={closeHistory}
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={selectConversation}
          onDelete={deleteConversation}
        />
      )}

      <SettingsFAB />
    </div>
  );
}

// Helper component, can be moved to its own file
function MessageBubble({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <MessageBubbleCard
        author={isUser ? "Du" : "Disa AI"}
        body={message.content}
        timestamp={message.timestamp}
        variant={isUser ? "user" : "assistant"}
        className={`max-w-[85%] ${isUser ? "ml-12" : "mr-12"}`}
      />
    </div>
  );
}
