import { History, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ConversationHistorySheet } from "../components/chat/ConversationHistorySheet";
import { Button } from "../components/ui/button";
import { StaticGlassCard } from "../components/ui/StaticGlassCard";
import { Textarea } from "../components/ui/textarea";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { useChat } from "../hooks/useChat";
import { useGlassPalette } from "../hooks/useGlassPalette";
import { deleteConversation, getAllConversations } from "../lib/conversation-manager";
import type { GlassTint } from "../lib/theme/glass";
import type { ChatMessageType } from "../types/chatMessage";

const DEFAULT_TINT: GlassTint = {
  from: "hsl(210 45% 55% / 0.20)",
  to: "hsl(250 60% 52% / 0.18)",
};

export default function ChatV2() {
  const [input, setInput] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState(() => getAllConversations());
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const palette = useGlassPalette();
  const toasts = useToasts();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Main chat hook
  const { messages, append, isLoading } = useChat({
    onError: (error) => {
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: error.message || "Ein Fehler ist aufgetreten",
      });
    },
  });

  // Update conversations list when history opens
  useEffect(() => {
    if (isHistoryOpen) {
      setConversations(getAllConversations());
    }
  }, [isHistoryOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    void append({
      role: "user",
      content: input.trim(),
    });
    setInput("");
  }, [input, append]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setIsHistoryOpen(false);
    // TODO: Load conversation messages
    toasts.push({
      kind: "info",
      title: "Konversation geladen",
      message: `Konversation ${id} wurde geladen`,
    });
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    setConversations(getAllConversations());
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
    toasts.push({
      kind: "success",
      title: "Gel\u00f6scht",
      message: "Konversation wurde gel\u00f6scht",
    });
  };

  const quickstartOptions = [
    {
      title: "Code Review",
      description: "Lass deinen Code überprüfen und optimieren",
    },
    {
      title: "Brainstorming",
      description: "Entwickle kreative Ideen und Lösungsansätze",
    },
    {
      title: "Erklärung",
      description: "Verstehe komplexe Themen einfach erklärt",
    },
    {
      title: "Übersetzung",
      description: "Übersetze Texte präzise und natürlich",
    },
  ];

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col gap-4 p-4">
      {messages.length === 0 ? (
        /* Empty State - Im Stil der Models-Seite */
        <>
          <header className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white">Chat</h1>
              <p className="text-sm leading-relaxed text-white/60">
                Starte eine Unterhaltung oder wähle einen Schnellstart für häufige Aufgaben.
              </p>
            </div>
            <Button
              onClick={() => setIsHistoryOpen(true)}
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 p-0 text-white transition-all hover:bg-white/10"
              aria-label="Chat-Verlauf öffnen"
            >
              <History className="h-5 w-5" />
            </Button>
          </header>

          {/* Hero Card */}
          <StaticGlassCard tint={palette[0] ?? DEFAULT_TINT} padding="lg">
            <div className="space-y-3 text-center">
              <h2 className="text-xl font-semibold text-white">Willkommen bei Disa AI</h2>
              <p className="text-sm text-white/70">
                Dein intelligenter Assistent für Gespräche, Analysen und kreative Aufgaben
              </p>
            </div>
          </StaticGlassCard>

          {/* Quickstart Section */}
          <div className="space-y-3">
            <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              Schnellstart
            </h3>
            {quickstartOptions.map((option, index) => {
              const tint = palette[(index + 1) % palette.length] ?? DEFAULT_TINT;
              return (
                <div
                  key={option.title}
                  role="button"
                  tabIndex={0}
                  onClick={() => setInput(option.title + ": ")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setInput(option.title + ": ");
                    }
                  }}
                  className="rounded-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <StaticGlassCard tint={tint} padding="md" className="cursor-pointer">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-white">{option.title}</h4>
                      <p className="text-xs text-white/70">{option.description}</p>
                    </div>
                  </StaticGlassCard>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Chat Messages */
        <>
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Unterhaltung</h2>
            <Button
              onClick={() => setIsHistoryOpen(true)}
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 p-0 text-white transition-all hover:bg-white/10"
              aria-label="Chat-Verlauf öffnen"
            >
              <History className="h-5 w-5" />
            </Button>
          </header>
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto pb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <StaticGlassCard tint={palette[0] ?? DEFAULT_TINT} padding="sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-white/70"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:0.15s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:0.3s]"></div>
                        </div>
                        <span className="text-sm text-white/70">Denkt nach...</span>
                      </div>
                    </StaticGlassCard>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Input Composer - Im Stil der Models-Seite */}
      <StaticGlassCard tint={palette[palette.length - 1] ?? DEFAULT_TINT} padding="md">
        <div className="flex items-end gap-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nachricht schreiben..."
            className="max-h-[200px] min-h-[48px] flex-1 resize-none border-0 bg-transparent text-white placeholder:text-white/60 focus:outline-none focus:ring-0"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 shrink-0 rounded-xl border border-white/10 bg-white/10 p-0 text-white transition-all hover:border-white/20 hover:bg-white/15 active:scale-95 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </StaticGlassCard>

      {/* Conversation History Sheet */}
      <ConversationHistorySheet
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={handleSelectConversation}
        onDelete={handleDeleteConversation}
      />
    </div>
  );
}

// Message Bubbles - Im Stil der Models-Karten
function MessageBubble({ message }: { message: ChatMessageType }) {
  const palette = useGlassPalette();
  const isUser = message.role === "user";
  const tint = isUser ? (palette[2] ?? DEFAULT_TINT) : (palette[0] ?? DEFAULT_TINT);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${isUser ? "ml-12" : "mr-12"}`}>
        <StaticGlassCard tint={tint} padding="md">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isUser ? (
                <span className="text-xs font-medium text-white/70">Du</span>
              ) : (
                <span className="text-xs font-medium text-white/70">Disa AI</span>
              )}
              {message.timestamp && (
                <span className="text-xs text-white/50">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-white">
              {message.content}
            </div>
          </div>
        </StaticGlassCard>
      </div>
    </div>
  );
}
