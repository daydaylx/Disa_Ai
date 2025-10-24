import { History, Plus, Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { logDiscussionAnalytics } from "../analytics/discussion";
import { MessageBubbleCard } from "../components/chat/MessageBubbleCard";
import { MobileChatHistorySidebar } from "../components/chat/MobileChatHistorySidebar";
import SettingsFAB from "../components/nav/SettingsFAB";
import Accordion from "../components/ui/Accordion";
import { BottomSheet } from "../components/ui/bottom-sheet";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";
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

export default function MobileChatV2() {
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
  const navigate = useNavigate();
  const locationState = useMemo(() => {
    return (
      (location.state as {
        gameId?: GameType;
        openHistory?: boolean;
        conversationId?: string;
      }) ?? {}
    );
  }, [location.state]);
  const { gameId, openHistory, conversationId } = locationState;
  const stateWithoutHistory = useMemo(() => {
    const { openHistory: _open, ...rest } = locationState;
    return rest;
  }, [locationState]);
  const stateWithoutConversation = useMemo(() => {
    const { conversationId: _omit, ...rest } = locationState;
    return rest;
  }, [locationState]);

  useEffect(() => {
    discussionPresetRef.current = discussionPreset;
  }, [discussionPreset]);

  useEffect(() => {
    if (!openHistory) return;
    setIsHistoryOpen(true);
    void navigate(location.pathname, { replace: true, state: stateWithoutHistory });
  }, [openHistory, navigate, location.pathname, stateWithoutHistory]);

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
          const conversation = {
            id: activeConversationId || crypto.randomUUID(),
            title: `Conversation ${new Date().toLocaleDateString()}`,
            messages: storageMessages,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            model: "default",
            messageCount: storageMessages.length,
          };
          saveConversation(conversation);
          if (!activeConversationId) {
            setActiveConversationId(conversation.id);
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

  const handleSelectConversation = useCallback(
    (id: string) => {
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
    },
    [
      resetDiscussionContext,
      setActiveConversationId,
      setCurrentSystemPrompt,
      setIsHistoryOpen,
      setMessages,
      toasts,
    ],
  );

  useEffect(() => {
    if (!conversationId) return;
    handleSelectConversation(conversationId);
    void navigate(location.pathname, { replace: true, state: stateWithoutConversation });
  }, [
    conversationId,
    handleSelectConversation,
    navigate,
    location.pathname,
    stateWithoutConversation,
  ]);

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
      title: "Gelöscht",
      message: "Konversation wurde gelöscht",
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

  const discussionTopicConfig = [
    {
      title: "Gibt es Außerirdische?",
      prompt: "Gibt es Außerirdische?",
      category: "curiosity",
    },
    {
      title: "Wie wird die Zukunft aussehen?",
      prompt: "Wie stellst du dir die nächsten 20 Jahre vor?",
      category: "future",
    },
    {
      title: "Wird KI die Weltherrschaft übernehmen?",
      prompt: "Wird KI irgendwann zu viel Macht haben?",
      category: "future",
    },
    {
      title: "Gibt es ein Leben nach dem Tod?",
      prompt: "Gibt es deiner Meinung nach ein Leben nach dem Tod?",
      category: "curiosity",
    },
    {
      title: "Warum glauben Menschen an Schicksal?",
      prompt: "Warum glauben manche so fest an Schicksal?",
      category: "curiosity",
    },
    {
      title: "Brauchen wir ein Grundeinkommen?",
      prompt: "Sollte es ein bedingungsloses Grundeinkommen geben?",
      category: "society",
    },
    {
      title: "Wie retten wir das Klima?",
      prompt: "Welche Maßnahmen helfen deiner Meinung nach dem Klima am meisten?",
      category: "society",
    },
    {
      title: "Welche Rolle spielen soziale Medien?",
      prompt: "Wie beeinflussen soziale Medien unser Denken und Verhalten?",
      category: "society",
    },
    {
      title: "Gestalten wir die Zukunft der Arbeit?",
      prompt: "Wie werden Automatisierung und KI die Arbeitswelt verändern?",
      category: "future",
    },
  ] as const;

  const discussionSections = [
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

  return (
    <div className="mobile-chat-container text-text-0 relative min-h-dvh overflow-hidden bg-[var(--surface-bg)]">
      {/* Background gradients - soft depth aura */}
      <div className="pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(150%_120%_at_12%_10%,rgba(var(--color-surface-base),0.18)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_110%_at_88%_18%,rgba(var(--color-brand-strong-rgb),0.12)_0%,transparent_60%)]" />
      </div>

      {messages.length === 0 ? (
        <>
          <header className="mobile-chat-header space-y-stack-gap">
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
                onClick={handleNewConversation}
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
                    onClick={() => setIsHistoryOpen(true)}
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
                <p id="discussion-style-hint" className="text-text-subtle mb-2 text-xs leading-5">
                  Steuert Tonalität und Strenge der Argumentation. Auswahl wird gespeichert.
                </p>
                <Select
                  value={discussionPreset}
                  onValueChange={(value) =>
                    handleDiscussionPresetChange(value as DiscussionPresetKey)
                  }
                >
                  <SelectTrigger
                    id="discussion-style"
                    aria-describedby="discussion-style-hint"
                    aria-label="Diskussionsstil wählen"
                    className="mobile-form-select touch-target"
                  >
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
                meta: section.topics.length === 1 ? "1 Thema" : `${section.topics.length} Themen`,
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
                          <span
                            className="text-text-strong text-sm font-medium [hyphens:auto]"
                            lang="de"
                          >
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

          {currentSystemPrompt === GAME_SYSTEM_PROMPTS["wer-bin-ich"] && (
            <div className="text-text-0 mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm">
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
            <div className="text-text-0 mb-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 text-sm">
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
          <header className="mobile-chat-header space-y-stack-gap">
            <div className="space-y-1">
              <h2 className="text-token-h2 text-text-strong text-balance font-semibold">
                Unterhaltung
              </h2>
              <p className="text-sm leading-6 text-text-muted">
                Aktuelle Unterhaltung mit Disa&nbsp;AI. Aktionen stehen als Tastaturkürzel bereit.
              </p>
            </div>
            <div
              className="mobile-chat-toolbar flex flex-wrap items-center gap-2 sm:justify-end"
              role="toolbar"
              aria-label="Chat-Aktionen"
            >
              <Button
                onClick={handleNewConversation}
                variant="brand"
                size="lg"
                className="shadow-neon mobile-btn mobile-btn-primary touch-target"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Neue Unterhaltung</span>
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsHistoryOpen(true)}
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

          <div className="mobile-chat-messages bg-surface-0/70 border-border/45 mx-auto flex h-full w-full max-w-[var(--max-content-width)] flex-col gap-4 rounded-lg border p-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="mobile-chat-loading animate-fade-in flex justify-start">
                <div className="border-border mr-12 max-w-[85%] rounded-lg border bg-surface-card p-4">
                  <div className="mobile-chat-loading-content flex items-center space-x-3">
                    <div className="mobile-chat-loading-dots flex space-x-1">
                      <div className="bg-accent1 h-2 w-2 rounded-full motion-safe:animate-bounce"></div>
                      <div className="bg-accent2 h-2 w-2 rounded-full [animation-delay:0.15s] motion-safe:animate-bounce"></div>
                      <div className="bg-accent1 h-2 w-2 rounded-full [animation-delay:0.3s] motion-safe:animate-bounce"></div>
                    </div>
                    <span className="text-text-1 text-sm motion-safe:animate-pulse">
                      Disa denkt nach...
                    </span>
                    <div className="bg-accent1 h-2 w-2 rounded-full motion-safe:animate-pulse"></div>
                  </div>
                  {/* Subtle shimmer effect */}
                  <div className="from-accent1/20 via-accent1/40 to-accent1/20 animate-shimmer mt-2 h-1 rounded-full bg-gradient-to-r"></div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div
        className="mobile-chat-input-container safe-px bg-surface-0/90 border-border sticky bottom-0 z-40 border-t pt-2"
        style={{ paddingBottom: "calc(var(--mobile-safe-bottom) + var(--spacing-lg))" }}
      >
        <div className="mx-auto w-full max-w-[var(--max-content-width)]">
          <div className="mobile-chat-input-form border-border bg-surface-1 rounded-lg border p-2">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nachricht an Disa AI schreiben..."
                className="mobile-chat-textarea text-text-0 placeholder:text-text-1 max-h-[200px] min-h-[60px] w-full resize-none border-0 bg-transparent px-4 py-3 text-sm focus:ring-0 touch-target"
                rows={1}
                aria-label="Nachricht an Disa AI eingeben"
                aria-describedby="input-help-text"
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="mobile-chat-send-btn h-12 w-12 shrink-0 touch-target"
              aria-label={isLoading ? "Nachricht wird gesendet..." : "Nachricht senden"}
              title={isLoading ? "Nachricht wird gesendet..." : "Nachricht senden (Enter)"}
            >
              <Send className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>

          <div className="text-text-1 mt-2 flex items-center justify-between text-xs">
            <span id="input-help-text">↵ Senden • Shift+↵ Neue Zeile</span>
            {isLoading && (
              <span className="animate-fade-in flex items-center gap-2" aria-live="polite">
                <span className="bg-accent1 inline-flex h-2 w-2 rounded-full motion-safe:animate-pulse"></span>
                <span className="text-text-1">Disa tippt...</span>
                <div className="flex space-x-1">
                  <div className="bg-accent2 h-1 w-1 rounded-full motion-safe:animate-bounce"></div>
                  <div className="bg-accent1 h-1 w-1 rounded-full [animation-delay:0.1s] motion-safe:animate-bounce"></div>
                  <div className="bg-accent2 h-1 w-1 rounded-full [animation-delay:0.2s] motion-safe:animate-bounce"></div>
                </div>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Chat History Sidebar using BottomSheet */}
      <BottomSheet
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="Chat-Verlauf"
        className="mobile-chat-history-sidebar"
      >
        <div className="mobile-chat-history-content">
          <MobileChatHistorySidebar
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={handleSelectConversation}
            onDelete={handleDeleteConversation}
          />
        </div>
      </BottomSheet>

      {/* Mobile Settings FAB Button - bottom left */}
      <SettingsFAB />
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  const alignmentClass = isUser ? "justify-end" : "justify-start";
  const offsetClass = isUser ? "ml-12" : "mr-12";

  return (
    <div
      className={`mobile-message-bubble flex ${alignmentClass} group`}
      data-testid="message-bubble"
    >
      <MessageBubbleCard
        author={isUser ? "Du" : "Disa AI"}
        body={message.content}
        timestamp={message.timestamp}
        variant={isUser ? "user" : "assistant"}
        className={`max-w-[85%] ${offsetClass} transition-all duration-200 hover:scale-[1.02]`}
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
  return text.trim().split(/\\s+/).filter(Boolean).length;
}
