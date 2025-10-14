import { History, MessageSquare, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { logDiscussionAnalytics } from "../analytics/discussion";
import { ChatHistorySidebar } from "../components/chat/ChatHistorySidebar";
import { MessageBubbleCard } from "../components/chat/MessageBubbleCard";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { DISCUSSION_MODEL_PROFILE } from "../config/models/discussionProfile";
import {
  getDiscussionMaxSentences,
  getDiscussionPreset,
  getDiscussionStrictMode,
  setDiscussionPreset,
} from "../config/settings";
import {
  DISCUSSION_FALLBACK_QUESTIONS,
  shapeDiscussionResponse,
} from "../features/discussion/shape";
import {
  GAME_SYSTEM_PROMPTS,
  type GameType,
  getGameStartPrompt,
  getGameSystemPrompt,
} from "../features/prompt/gamePrompts";
import { type ChatRequestOptions, useChat } from "../hooks/useChat";
import {
  deleteConversation,
  getAllConversations,
  getConversation,
  saveConversation,
} from "../lib/conversation-manager";
import { buildDiscussionSystemPrompt } from "../prompts/discussion/base";
import { type DiscussionPresetKey, discussionPresetOptions } from "../prompts/discussion/presets";
import type { ChatMessageType } from "../types/chatMessage";

const MIN_DISCUSSION_SENTENCES = 5;
const DISCUSSION_CARD_HINT = "Kurze Spekulationsrunde (5–10 Sätze, Abschlussfrage inklusive).";

interface DiscussionSession {
  topic: string;
  preset: DiscussionPresetKey;
  maxSentences: number;
  strictMode: boolean;
}

export default function ChatV2() {
  const [input, setInput] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState(() => getAllConversations());
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentSystemPrompt, setCurrentSystemPrompt] = useState<string | undefined>(undefined);
  const [discussionPreset, setDiscussionPresetState] =
    useState<DiscussionPresetKey>(getDiscussionPreset);
  const toasts = useToasts();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const discussionSessionRef = useRef<DiscussionSession | null>(null);
  const requestOptionsRef = useRef<ChatRequestOptions | null>(null);
  const strictRetryTracker = useRef<Set<string>>(new Set());
  const discussionPresetRef = useRef<DiscussionPresetKey>(discussionPreset);

  const onFinishRef = useRef<(message: ChatMessageType) => void>(() => {});
  const messagesRef = useRef<ChatMessageType[]>([]);

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
    getRequestOptions: () => requestOptionsRef.current ?? {},
  });

  const location = useLocation();
  const { gameId } = (location.state as { gameId?: GameType }) || {};

  useEffect(() => {
    discussionPresetRef.current = discussionPreset;
  }, [discussionPreset]);

  const resetDiscussionContext = useCallback(() => {
    discussionSessionRef.current = null;
    requestOptionsRef.current = null;
    strictRetryTracker.current.clear();
  }, []);

  const handleDiscussionPresetChange = useCallback(
    (value: DiscussionPresetKey) => {
      if (value === discussionPresetRef.current) return;
      discussionPresetRef.current = value;
      setDiscussionPresetState(value);
      setDiscussionPreset(value);
      const label =
        discussionPresetOptions.find((option) => option.key === value)?.label ?? "Diskussion";
      toasts.push({
        kind: "info",
        title: "Stil aktualisiert",
        message: label,
      });
    },
    [toasts],
  );

  const startGame = useCallback(
    (gameType: GameType) => {
      const systemPrompt = getGameSystemPrompt(gameType);
      const startMessage = getGameStartPrompt(gameType);

      resetDiscussionContext();
      setCurrentSystemPrompt(systemPrompt);

      setMessages([]);
      void append({
        role: "user",
        content: startMessage,
      }).catch((error) => {
        console.error("Failed to start game:", error);
      });
    },
    [append, resetDiscussionContext, setCurrentSystemPrompt, setMessages],
  );

  const startDiscussion = useCallback(
    (topicPrompt: string) => {
      try {
        const preset = discussionPresetRef.current ?? getDiscussionPreset();
        const strictMode = getDiscussionStrictMode();
        const maxSentences = getDiscussionMaxSentences();
        const { prompt, presetKey } = buildDiscussionSystemPrompt({
          preset,
          minSentences: MIN_DISCUSSION_SENTENCES,
          maxSentences,
          strictMode,
        });

        resetDiscussionContext();
        discussionSessionRef.current = {
          topic: topicPrompt,
          preset: presetKey,
          maxSentences,
          strictMode,
        };
        const baseParams = DISCUSSION_MODEL_PROFILE.parameters;
        const baseMaxTokens = baseParams.max_tokens ?? 480;
        const tunedMaxTokens = strictMode ? Math.min(baseMaxTokens, 420) : baseMaxTokens;
        requestOptionsRef.current = {
          model: DISCUSSION_MODEL_PROFILE.id,
          temperature: baseParams.temperature,
          top_p: baseParams.top_p,
          presence_penalty: baseParams.presence_penalty,
          max_tokens: tunedMaxTokens,
        } satisfies ChatRequestOptions;
        setMessages([]);
        setActiveConversationId(null);
        setCurrentSystemPrompt(prompt);
        const presetLabel =
          discussionPresetOptions.find((option) => option.key === presetKey)?.label ?? "Diskussion";
        toasts.push({
          kind: "info",
          title: "Diskussionsmodus aktiv",
          message: `${presetLabel} • ${MIN_DISCUSSION_SENTENCES}-${maxSentences} Sätze`,
        });

        void append({
          role: "user",
          content: topicPrompt,
        }).catch((error) => {
          console.error("Failed to start discussion:", error);
        });
      } catch (error) {
        console.error("Failed to initialise discussion", error);
        toasts.push({
          kind: "error",
          title: "Diskussionsstart fehlgeschlagen",
          message: "Bitte versuche es erneut.",
        });
      }
    },
    [append, resetDiscussionContext, setCurrentSystemPrompt, setMessages, toasts],
  );

  useEffect(() => {
    if (gameId) {
      startGame(gameId);
    }
  }, [gameId, startGame]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    onFinishRef.current = (message: ChatMessageType) => {
      const currentMessages = messagesRef.current;
      const session = discussionSessionRef.current;
      let workingMessage = message;
      let updatedMessages = currentMessages;

      if (session && message.role === "assistant") {
        const shaped = shapeDiscussionResponse(message.content, {
          minSentences: MIN_DISCUSSION_SENTENCES,
          maxSentences: session.maxSentences,
          fallbackQuestions: DISCUSSION_FALLBACK_QUESTIONS,
        });

        if (shaped.text !== message.content) {
          workingMessage = { ...message, content: shaped.text };
        }

        const merged = mergeMessageList(currentMessages, workingMessage);
        if (merged !== currentMessages) {
          setMessages(merged);
        }
        updatedMessages = merged;

        logDiscussionAnalytics({
          timestamp: Date.now(),
          topic: session.topic,
          preset: session.preset,
          sentenceCount: shaped.sentences.length,
          wordCount: countWords(shaped.text),
          trimmed: shaped.trimmed,
          fallbackUsed: shaped.fallbackUsed,
          questionTrimmed: shaped.questionTrimmed,
          strictMode: session.strictMode,
        });

        if (
          session.strictMode &&
          shaped.trimmed &&
          !strictRetryTracker.current.has(workingMessage.id)
        ) {
          strictRetryTracker.current.add(workingMessage.id);
          setTimeout(() => {
            void append({
              role: "user",
              content: "Kürzer, bitte maximal 10 Sätze.",
            }).catch((error) => {
              console.error("Strict retry failed", error);
            });
          }, 120);
        }
      } else {
        updatedMessages = mergeMessageList(currentMessages, message);
      }

      if (updatedMessages.length >= 1) {
        const storageMessages = updatedMessages.map((msg) => ({
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
  }, [activeConversationId, append, setMessages, toasts]);

  useEffect(() => {
    if (isHistoryOpen) {
      setConversations(getAllConversations());
    }
  }, [isHistoryOpen]);

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
    resetDiscussionContext();

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
      setCurrentSystemPrompt(undefined);
      setMessages([]);
      resetDiscussionContext();
    }
    toasts.push({
      kind: "success",
      title: "Gel\u00f6scht",
      message: "Konversation wurde gel\u00f6scht",
    });
  };

  const handleNewConversation = () => {
    resetDiscussionContext();
    setMessages([]);
    setActiveConversationId(null);
    setCurrentSystemPrompt(undefined);
    toasts.push({
      kind: "info",
      title: "Neue Unterhaltung",
      message: "Bereit für eine neue Unterhaltung",
    });
  };

  const discussionTopics = [
    {
      title: "Gibt es Außerirdische?",
      prompt: "Gibt es Außerirdische?",
    },
    {
      title: "Wie wird die Zukunft aussehen?",
      prompt: "Wie stellst du dir die nächsten 20 Jahre vor?",
    },
    {
      title: "Wird KI die Weltherrschaft übernehmen?",
      prompt: "Wird KI irgendwann zu viel Macht haben?",
    },
    {
      title: "Gibt es ein Leben nach dem Tod?",
      prompt: "Gibt es deiner Meinung nach ein Leben nach dem Tod?",
    },
    {
      title: "Warum glauben Menschen an Schicksal?",
      prompt: "Warum glauben manche so fest an Schicksal?",
    },
    {
      title: "Brauchen wir ein Grundeinkommen?",
      prompt: "Sollte es ein bedingungsloses Grundeinkommen geben?",
    },
    {
      title: "Wie retten wir das Klima?",
      prompt: "Welche Maßnahmen helfen deiner Meinung nach dem Klima am meisten?",
    },
    {
      title: "Welche Rolle spielen soziale Medien?",
      prompt: "Wie beeinflussen soziale Medien unser Denken und Verhalten?",
    },
    {
      title: "Gestalten wir die Zukunft der Arbeit?",
      prompt: "Wie werden Automatisierung und KI die Arbeitswelt verändern?",
    },
  ].map((topic) => ({ ...topic, hint: DISCUSSION_CARD_HINT }));

  return (
    <div className="relative flex h-full flex-col px-5 pb-8 pt-5">
      <div className="relative z-10">
        {messages.length === 0 ? (
          <>
            <header className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-text-0">Chat</h2>
                <p className="mt-1 text-sm leading-6 text-text-1">
                  Starte eine Unterhaltung oder wähle einen Schnellstart für häufige Aufgaben.
                </p>
              </div>
              <Button
                onClick={() => setIsHistoryOpen(true)}
                variant="ghost"
                size="icon"
                aria-label="Chat-Verlauf öffnen"
              >
                <History className="h-5 w-5" />
              </Button>
            </header>

            <div className="grid grid-cols-1 gap-3 pb-8 sm:grid-cols-2 xl:grid-cols-3">
              <div className="mb-4 flex flex-col gap-3 px-1 sm:col-span-2 sm:flex-row sm:items-start sm:justify-between xl:col-span-3">
                <div className="flex-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-text-1">
                    Diskussionen
                  </h3>
                  <p className="text-xs text-text-1">
                    Ein Absatz, 5–{getDiscussionMaxSentences()} Sätze, Abschlussfrage inklusive.
                  </p>
                </div>
                <div className="w-full sm:w-48 md:w-56">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-1">
                    Stil auswählen
                  </span>
                  <Select
                    value={discussionPreset}
                    onValueChange={(value) =>
                      handleDiscussionPresetChange(value as DiscussionPresetKey)
                    }
                  >
                    <SelectTrigger>
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
              {discussionTopics.map((topic) => {
                const tileBadge =
                  discussionPresetOptions.find((option) => option.key === discussionPreset)
                    ?.label ?? "Diskussion";
                return (
                  <div
                    key={topic.title}
                    className="rounded-lg border border-border bg-surface-1 p-4"
                  >
                    <h4 className="font-semibold text-text-0">{topic.title}</h4>
                    <p className="text-sm text-text-1">{topic.hint}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startDiscussion(topic.prompt)}
                      className="mt-4"
                    >
                      Diskutieren
                    </Button>
                  </div>
                );
              })}
            </div>

            {currentSystemPrompt === GAME_SYSTEM_PROMPTS["wer-bin-ich"] && (
              <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-text-0">
                <p className="font-medium">Spiel-Hinweis:</p>
                <p>
                  Denke dir eine Entität aus und antworte auf die Fragen der KI nur mit{" "}
                  <strong>ja</strong>, <strong>nein</strong>, <strong>unklar</strong> oder{" "}
                  <strong>teilweise</strong>.
                </p>
                <p>Die KI wird versuchen, deine gewählte Entität zu erraten!</p>
              </div>
            )}

            {currentSystemPrompt === GAME_SYSTEM_PROMPTS["quiz"] && (
              <div className="mb-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-text-0">
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
          <>
            <header className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-0">Unterhaltung</h2>
              <div className="flex gap-2">
                <Button
                  onClick={handleNewConversation}
                  variant="ghost"
                  size="icon"
                  aria-label="Neue Unterhaltung starten"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => setIsHistoryOpen(true)}
                  variant="ghost"
                  size="icon"
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
                      <div className="rounded-lg border border-border bg-surface-1 p-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-text-1"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-text-1 [animation-delay:0.15s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-text-1 [animation-delay:0.3s]"></div>
                          </div>
                          <span className="text-sm text-text-1">Denkt nach...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="safe-px sticky bottom-0 z-40 border-t border-border bg-surface-0 pb-4 pt-2">
          <div className="mx-auto w-full max-w-[var(--max-content-width)]">
            <div className="rounded-lg border border-border bg-surface-1 p-2">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nachricht an Disa AI schreiben..."
                    className="max-h-[200px] min-h-[60px] w-full resize-none border-0 bg-transparent px-4 py-3 text-sm text-text-0 placeholder:text-text-1 focus:ring-0"
                    rows={1}
                    aria-label="Nachricht an Disa AI eingeben"
                    aria-describedby="input-help-text"
                  />
                </div>

                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="h-12 w-12 shrink-0"
                  aria-label={isLoading ? "Nachricht wird gesendet..." : "Nachricht senden"}
                  title={isLoading ? "Nachricht wird gesendet..." : "Nachricht senden (Enter)"}
                >
                  <Send className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-text-1">
                <span id="input-help-text">↵ Senden • Shift+↵ Neue Zeile</span>
                {isLoading && (
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-brand"></span>
                    Tippt...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <ChatHistorySidebar
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={handleSelectConversation}
          onDelete={handleDeleteConversation}
        />
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  const alignmentClass = isUser ? "justify-end" : "justify-start";
  const offsetClass = isUser ? "ml-12" : "mr-12";

  return (
    <div className={`flex ${alignmentClass}`}>
      <MessageBubbleCard
        author={isUser ? "Du" : "Disa AI"}
        body={message.content}
        timestamp={message.timestamp}
        variant={isUser ? "user" : "assistant"}
        className={`max-w-[85%] ${offsetClass}`}
      />
    </div>
  );
}

function mergeMessageList(list: ChatMessageType[], next: ChatMessageType): ChatMessageType[] {
  const index = list.findIndex((item) => item.id === next.id);
  if (index === -1) {
    return [...list, next];
  }
  const copy = [...list];
  const existing = copy[index];
  if (
    existing &&
    existing.content === next.content &&
    existing.role === next.role &&
    existing.timestamp === next.timestamp &&
    existing.model === next.model
  ) {
    return list;
  }
  copy[index] = next;
  return copy;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
