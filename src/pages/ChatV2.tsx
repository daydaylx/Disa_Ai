import { History, MessageSquare, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ConversationHistorySheet } from "../components/chat/ConversationHistorySheet";
import { RoleCard } from "../components/studio/RoleCard";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import {
  GAME_SYSTEM_PROMPTS,
  type GameType,
  getGameStartPrompt,
  getGameSystemPrompt,
} from "../features/prompt/gamePrompts";
import { useChat } from "../hooks/useChat";
import { useGlassPalette } from "../hooks/useGlassPalette";
import {
  deleteConversation,
  getAllConversations,
  getConversation,
  saveConversation,
} from "../lib/conversation-manager";
import type { GlassTint } from "../lib/theme/glass";
import { FRIENDLY_TINTS } from "../lib/theme/glass";
import type { ChatMessageType } from "../types/chatMessage";

const DEFAULT_TINT: GlassTint = FRIENDLY_TINTS[0]!;

export default function ChatV2() {
  const [input, setInput] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState(() => getAllConversations());
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentSystemPrompt, setCurrentSystemPrompt] = useState<string | undefined>(undefined);
  const palette = useGlassPalette();
  const friendlyPalette = palette.length > 0 ? palette : FRIENDLY_TINTS;
  const toasts = useToasts();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Callback Refs für stabile Closures
  const onFinishRef = useRef<(message: ChatMessageType) => void>(() => {});
  const messagesRef = useRef<ChatMessageType[]>([]);

  // Main chat hook
  const { messages, append, isLoading, setMessages } = useChat({
    onError: (error) => {
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: error.message || "Ein Fehler ist aufgetreten",
      });
    },
    onFinish: (message) => onFinishRef.current?.(message),
    systemPrompt: currentSystemPrompt,
  });

  // Function to start a game
  const startGame = (gameType: GameType) => {
    const systemPrompt = getGameSystemPrompt(gameType);
    const startMessage = getGameStartPrompt(gameType);

    // Set the system prompt for the new game
    setCurrentSystemPrompt(systemPrompt);

    // Reset messages and start the game with the start message
    setMessages([]);
    void append({
      role: "user",
      content: startMessage,
    });
  };

  // Update ref bei messages-Änderungen
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Stable onFinish callback
  useEffect(() => {
    onFinishRef.current = (message: ChatMessageType) => {
      const currentMessages = messagesRef.current;
      if (currentMessages.length >= 1) {
        const allMessages = [...currentMessages, message];
        const storageMessages = allMessages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          model: msg.model,
        }));

        try {
          const conversationId = saveConversation(
            storageMessages,
            activeConversationId || undefined,
          );
          if (!activeConversationId) {
            setActiveConversationId(conversationId);
          }
          setConversations(getAllConversations());
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
  }, [activeConversationId, toasts]);

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
    const conversation = getConversation(id);

    if (!conversation?.messages || !Array.isArray(conversation.messages)) {
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: "Konversation ist beschädigt oder konnte nicht geladen werden",
      });
      return;
    }

    // Filter und konvertiere Messages - nur gültige Rollen
    const chatMessages: ChatMessageType[] = conversation.messages
      .filter((msg) => ["user", "assistant", "system"].includes(msg.role))
      .map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
        timestamp: msg.timestamp,
        model: msg.model,
      }));

    if (chatMessages.length === 0) {
      toasts.push({
        kind: "warning",
        title: "Konversation leer",
        message: "Diese Konversation enthält keine gültigen Nachrichten",
      });
      return;
    }

    setMessages(chatMessages);
    setActiveConversationId(id);

    // Check if there's a system prompt in the conversation and set it
    const systemMessage = chatMessages.find((msg) => msg.role === "system");
    if (systemMessage) {
      setCurrentSystemPrompt(systemMessage.content);
    } else {
      setCurrentSystemPrompt(undefined);
    }

    setIsHistoryOpen(false);

    toasts.push({
      kind: "success",
      title: "Konversation geladen",
      message: `${conversation.title} wurde geladen`,
    });
  };

  const handleDeleteConversation = (id: string) => {
    if (
      !confirm(
        "Möchtest du diese Konversation wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
      )
    ) {
      return;
    }

    deleteConversation(id);
    setConversations(getAllConversations());
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setCurrentSystemPrompt(undefined); // Clear system prompt as well
      setMessages([]); // Clear current messages if active conversation is deleted
    }
    toasts.push({
      kind: "success",
      title: "Gel\u00f6scht",
      message: "Konversation wurde gel\u00f6scht",
    });
  };

  const handleNewConversation = () => {
    setMessages([]);
    setActiveConversationId(null);
    setCurrentSystemPrompt(undefined); // Clear the system prompt when starting a new conversation
    toasts.push({
      kind: "info",
      title: "Neue Unterhaltung",
      message: "Bereit für eine neue Unterhaltung",
    });
  };

  const quickstartOptions = [
    {
      title: "Wer bin ich?",
      description: "Errate die von mir gedachte Entität in 20 Ja/Nein-Fragen",
    },
    {
      title: "Quiz",
      description: "Teste dein Wissen mit Multiple-Choice-Fragen",
    },
    {
      title: "Wahrheit oder Fiktion",
      description: "Entscheide, ob Geschichten wahr oder erfunden sind",
    },
    {
      title: "Black Story",
      description: "Löse mysteriöse Szenarien durch Ja/Nein-Fragen",
    },
    {
      title: "Fakten-Duell",
      description: "Prüfe Behauptungen auf Richtigkeit",
    },
    {
      title: "Zwei Wahrheiten, eine Lüge",
      description: "Finde die falsche Aussage unter dreien",
    },
    {
      title: "Spurensuche",
      description: "Ermittle die Lösung durch gezielte Fragen",
    },
    {
      title: "Film oder Fake",
      description: "Entscheide, ob Filmhandlungen echt oder erfunden sind",
    },
  ];

  return (
    <div className="flex h-full flex-col px-5 pb-8 pt-5">
      {messages.length === 0 ? (
        /* Empty State - Im Stil der Models-Seite */
        <>
          <header className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Chat</h2>
              <p className="mt-1 text-sm leading-6 text-white/70">
                Starte eine Unterhaltung oder wähle einen Schnellstart für häufige Aufgaben.
              </p>
            </div>
            <Button
              onClick={() => setIsHistoryOpen(true)}
              variant="ghost"
              size="sm"
              className="glass-button h-10 w-10 rounded-xl p-0 text-white transition-all"
              aria-label="Chat-Verlauf öffnen"
            >
              <History className="h-5 w-5" />
            </Button>
          </header>

          {/* Hero Card */}
          <RoleCard
            title="Willkommen bei Disa AI"
            description="Dein intelligenter Assistent für Gespräche, Analysen und kreative Aufgaben"
            tint={friendlyPalette[0] ?? DEFAULT_TINT}
            onClick={() => {}}
            className="min-h-[152px] text-center"
          />

          {/* Quickstart Section */}
          <div className="grid grid-cols-1 gap-3 pb-8">
            <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              Schnellstart
            </h3>
            {quickstartOptions.map((option, index) => {
              const tint = friendlyPalette[(index + 1) % friendlyPalette.length] ?? DEFAULT_TINT;
              return (
                <RoleCard
                  key={option.title}
                  title={option.title}
                  description={option.description}
                  tint={tint}
                  onClick={() => {
                    if (option.title === "Wer bin ich?") {
                      startGame("wer-bin-ich");
                    } else if (option.title === "Quiz") {
                      startGame("quiz");
                    } else if (option.title === "Wahrheit oder Fiktion") {
                      startGame("wahrheit-oder-fiktion");
                    } else if (option.title === "Black Story") {
                      startGame("black-story");
                    } else if (option.title === "Fakten-Duell") {
                      startGame("fakten-duell");
                    } else if (option.title === "Zwei Wahrheiten, eine Lüge") {
                      startGame("zwei-wahrheiten-eine-lüge");
                    } else if (option.title === "Spurensuche") {
                      startGame("spurensuche");
                    } else if (option.title === "Film oder Fake") {
                      startGame("film-oder-fake");
                    } else {
                      setInput(option.title + ": ");
                    }
                  }}
                  className="min-h-[152px] cursor-pointer"
                />
              );
            })}
          </div>

          {/* Game Hints - shown when game system prompts are active */}
          {currentSystemPrompt === GAME_SYSTEM_PROMPTS["wer-bin-ich"] && (
            <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-white">
              <p className="font-medium">Spiel-Hinweis:</p>
              <p>
                Antworte nur mit <strong>ja</strong>, <strong>nein</strong> oder{" "}
                <strong>unklar</strong>.
              </p>
              <p>
                Wenn die KI rät: Antwort mit <strong>richtig</strong> oder <strong>falsch</strong>.
              </p>
            </div>
          )}

          {currentSystemPrompt === GAME_SYSTEM_PROMPTS["quiz"] && (
            <div className="mb-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-white">
              <p className="font-medium">Spiel-Hinweis:</p>
              <p>
                Antworte mit <strong>A</strong>, <strong>B</strong>, <strong>C</strong> oder{" "}
                <strong>D</strong>.
              </p>
              <p>
                Schreibe <strong>„weiter“</strong>, um die nächste Frage zu erhalten.
              </p>
            </div>
          )}
        </>
      ) : (
        /* Chat Messages */
        <>
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Unterhaltung</h2>
            <div className="flex gap-2">
              <Button
                onClick={handleNewConversation}
                variant="ghost"
                size="sm"
                className="glass-button h-10 w-10 rounded-xl p-0 text-white transition-all"
                aria-label="Neue Unterhaltung starten"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => setIsHistoryOpen(true)}
                variant="ghost"
                size="sm"
                className="glass-button h-10 w-10 rounded-xl p-0 text-white transition-all"
                aria-label="Chat-Verlauf öffnen"
              >
                <History className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto pb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <RoleCard
                      title=""
                      description="Denkt nach..."
                      tint={friendlyPalette[0] ?? DEFAULT_TINT}
                      onClick={() => {}}
                      className="min-h-[152px] flex-col justify-center"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-white/70"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:0.15s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:0.3s]"></div>
                        </div>
                        <span className="text-sm text-white/70">Denkt nach...</span>
                      </div>
                    </RoleCard>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Input Composer - Prominent und gut erkennbar */}
      <div className="relative">
        {/* Hintergrund-Blur Effekt */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-80 blur-sm"></div>

        {/* Haupt-Container */}
        <div className="card-glass relative p-4">
          {/* Glanz-Effekt oben */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          <div className="flex items-end gap-3">
            <div className="relative flex-1">
              {/* Input-Bereich */}
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nachricht an Disa AI schreiben..."
                className="glass-input max-h-[200px] min-h-[52px] w-full resize-none rounded-xl px-4 py-3 text-white transition-all duration-200 placeholder:text-white/50 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                rows={1}
                aria-label="Nachricht an Disa AI eingeben"
                aria-describedby="input-help-text"
              />

              {/* Typing Indicator */}
              {input.trim() && (
                <div className="absolute bottom-2 right-3">
                  <div className="flex space-x-1">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400"></div>
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400 [animation-delay:0.2s]"></div>
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-pink-400 [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 shrink-0 rounded-xl border border-blue-400/30 bg-gradient-to-r from-blue-500/80 to-purple-500/80 p-0 text-white transition-all duration-200 hover:scale-105 hover:from-blue-500 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] focus:outline-none focus:ring-2 focus:ring-blue-400/50 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
              aria-label={isLoading ? "Nachricht wird gesendet..." : "Nachricht senden"}
              title={isLoading ? "Nachricht wird gesendet..." : "Nachricht senden (Enter)"}
            >
              <Send className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>

          {/* Info Text */}
          <div className="mt-2 flex items-center justify-between text-xs text-white/50">
            <span id="input-help-text">↵ Senden • Shift+↵ Neue Zeile</span>
            {isLoading && (
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
                Tippt...
              </span>
            )}
          </div>
        </div>
      </div>

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
  const friendlyPalette = palette.length > 0 ? palette : FRIENDLY_TINTS;
  const isUser = message.role === "user";
  const targetIndex = isUser ? 2 : 0;
  const tint =
    friendlyPalette[targetIndex % friendlyPalette.length] ?? friendlyPalette[0] ?? DEFAULT_TINT;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${isUser ? "ml-12" : "mr-12"}`}>
        <RoleCard
          title={isUser ? "Du" : "Disa AI"}
          description={message.content}
          tint={tint}
          onClick={() => {}}
          badge={message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : undefined}
          className="min-h-[152px]"
        />
      </div>
    </div>
  );
}
