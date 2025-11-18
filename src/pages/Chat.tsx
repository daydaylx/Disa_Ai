import { useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useToasts } from "@/ui";
import { Button } from "@/ui/Button";
import { Card, CardTitle } from "@/ui/Card";
import { Typography } from "@/ui/Typography";

import { ChatComposer } from "../components/chat/ChatComposer";
import { QuickstartGrid } from "../components/chat/QuickstartGrid";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { PageContainer } from "../components/layout/PageContainer";
import { useConversationStats } from "../hooks/use-storage";
import { useChat } from "../hooks/useChat";
import { useConversationManager } from "../hooks/useConversationManager";
import { useMemory } from "../hooks/useMemory";
import { useRoles } from "../hooks/useRoles";
import { useSettings } from "../hooks/useSettings";
import { MAX_PROMPT_LENGTH, validatePrompt } from "../lib/chat/validation";
import {
  BookOpenCheck,
  KeyRound,
  MessageCircle,
  Settings,
  Shield,
  Sparkles,
  Waves,
} from "../lib/icons";

export default function Chat() {
  const toasts = useToasts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const composerContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { activeRole } = useRoles();
  const { settings } = useSettings();
  const { isEnabled: memoryEnabled } = useMemory();
  const { stats } = useConversationStats();

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

  useConversationManager({
    messages,
    isLoading,
    setMessages,
    setCurrentSystemPrompt,
    onNewConversation: () => {},
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = useCallback(() => {
    if (isLoading) {
      toasts.push({
        kind: "warning",
        title: "Verarbeitung läuft",
        message: "Bitte warte einen Moment, bis die aktuelle Antwort fertig ist.",
      });
      return;
    }

    const validation = validatePrompt(input);

    if (!validation.valid) {
      if (validation.reason === "too_long") {
        toasts.push({
          kind: "error",
          title: "Nachricht zu lang",
          message: `Die Eingabe darf maximal ${MAX_PROMPT_LENGTH.toLocaleString("de-DE")} Zeichen enthalten. Wir haben sie entsprechend gekürzt.`,
        });
        setInput(validation.sanitized);
      } else {
        toasts.push({
          kind: "warning",
          title: "Leere Nachricht",
          message: "Bitte gib eine Nachricht ein, bevor du sendest.",
        });
      }
      return;
    }

    void append({ role: "user", content: validation.sanitized }).catch((error: Error) => {
      toasts.push({
        kind: "error",
        title: "Senden fehlgeschlagen",
        message: error.message || "Die Nachricht konnte nicht gesendet werden.",
      });
    });
    setInput("");
  }, [append, input, isLoading, setInput, toasts]);

  const startWithPreset = (system: string, user?: string) => {
    void append({ role: "system", content: system });
    if (user) {
      void append({ role: "user", content: user });
    }
  };

  const focusComposer = () => {
    const textarea = composerContainerRef.current?.querySelector("textarea");
    if (textarea instanceof HTMLTextAreaElement) {
      textarea.focus();
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      composerContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatNumber = (value: number) => new Intl.NumberFormat("de-DE").format(value);
  const modelLabel = settings.preferredModelId?.split("/")[1]?.replace(/-/g, " ") ?? "Automatisch";
  const heroStatus = [
    { label: "Modell", value: modelLabel },
    { label: "Gedächtnis", value: memoryEnabled ? "Aktiviert" : "Neutral" },
    { label: "Rolle", value: activeRole?.name ?? "Freier Modus" },
  ];

  const totalConversations = stats?.totalConversations ?? 0;
  const averageMessages = stats?.averageMessagesPerConversation ?? 0;
  const totalMessages = stats?.totalMessages ?? 0;

  const insightCards = [
    {
      id: "conversations",
      label: "Verläufe",
      value: formatNumber(totalConversations),
      caption: "lokal gespeichert",
      icon: BookOpenCheck,
    },
    {
      id: "messages",
      label: "Durchschnitt",
      value: `${averageMessages.toFixed(1)} Nachrichten`,
      caption: "pro Verlauf",
      icon: MessageCircle,
    },
    {
      id: "uptime",
      label: "Studio-Status",
      value: "Bereit",
      caption: `${formatNumber(totalMessages)} gesendete Nachrichten`,
      icon: Shield,
    },
  ];

  const studioCards = [
    {
      id: "models",
      title: "Modell- & Rollenstudio",
      description: "Vergleiche Modelle, aktiviere Presets und verwalte Rollenbibliotheken.",
      href: "/models",
      icon: Sparkles,
    },
    {
      id: "settings",
      title: "Einstellungen & API",
      description: "API-Key, Privacy-Filter, Darstellungen und Speicher in einem Bereich.",
      href: "/settings",
      icon: Settings,
    },
    {
      id: "safety",
      title: "Speicher & Sicherheit",
      description: "Backups exportieren, lokales Gedächtnis aufräumen oder komplett löschen.",
      href: "/settings/data",
      icon: KeyRound,
    },
  ];

  const helperShortcuts = [
    "Drei-Finger-Langdruck öffnet jederzeit die Einstellungen.",
    "Doppeltippen am oberen Rand bringt dich nach ganz oben.",
    "Swipe nach oben mit drei Fingern wechselt das Theme.",
  ];

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex flex-col text-text-primary">
      {/* Hintergrund für die Hero-Section */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(120%_100%_at_50%_0%,hsl(var(--brand-1)/0.18)_0%,transparent_70%)]" />
      </div>

      <main className="relative flex-1">
        {isEmpty ? (
          <PageContainer
            width="max"
            className="relative z-10 flex flex-col gap-4"
            data-testid="chat-hero"
          >
            <section className="overflow-hidden rounded-2xl bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)] border border-[var(--aurora-green-400)] shadow-[var(--shadow-glow-green)] p-4 text-text-primary aurora-bg sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="space-y-3 lg:flex-1">
                  <Typography
                    variant="caption"
                    as="span"
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-semibold uppercase tracking-[0.35em] text-white/80"
                  >
                    Studio
                  </Typography>
                  <div>
                    <h1 className="text-[var(--text-2xl)] font-[var(--font-medium)] leading-[var(--leading-tight)] text-white sm:text-[var(--text-3xl)]">
                      Konzentrierte KI-Arbeit in einer ruhigen Oberfläche.
                    </h1>
                    <p className="mt-2 max-w-2xl text-[var(--text-sm)] text-white/80">
                      Starte mit einem klaren Ziel, nutze vorbereitete Flows und schalte Modelle
                      sowie Rollen per Shortcut.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="default" variant="primary" onClick={focusComposer}>
                      Unterhaltung starten
                    </Button>
                    <Button size="default" variant="secondary">
                      <Link to="/settings">Studio öffnen</Link>
                    </Button>
                  </div>
                </div>
                <div className="grid w-full flex-shrink-0 gap-2 sm:grid-cols-3 lg:max-w-md">
                  {heroStatus.map((status) => (
                    <div
                      key={status.label}
                      className="rounded-xl border border-white/30 bg-white/10 p-2 backdrop-blur"
                    >
                      <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">
                        {status.label}
                      </p>
                      <Typography variant="h5" as="p" className="mt-1 text-white">
                        {status.value}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-3">
              {insightCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <Typography
                          variant="caption"
                          className="uppercase tracking-[0.35em] text-text-muted"
                        >
                          {card.label}
                        </Typography>
                        <Typography variant="h5" className="text-text-primary">
                          {card.value}
                        </Typography>
                      </div>
                    </div>
                    <Typography variant="body" className="text-text-secondary">
                      {card.caption}
                    </Typography>
                  </Card>
                );
              })}
            </section>

            <QuickstartGrid
              onStart={startWithPreset}
              title="Fokus-Workflows"
              description="Vorbereitete Presets für Recherche, Schreiben und Pair Programming – starte ohne Setup."
            />

            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Typography
                    variant="caption"
                    className="uppercase tracking-[0.32em] text-text-muted"
                    style={{ fontSize: "10px" }}
                  >
                    Studio
                  </Typography>
                  <Typography variant="h4" as="h2" className="text-text-primary">
                    Bereiche & Einstellungen
                  </Typography>
                </div>
                <Button variant="ghost" size="sm">
                  <Link to="/settings">Alle Einstellungen</Link>
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {studioCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <Card
                      key={card.id}
                      className="flex h-full flex-col justify-between"
                      role="link"
                      tabIndex={0}
                      onClick={() => {
                        void navigate(card.href);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          void navigate(card.href);
                        }
                      }}
                    >
                      <div className="space-y-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)]/40 text-[var(--accent)]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <Typography variant="h6" className="text-text-primary">
                            {card.title}
                          </Typography>
                          <Typography variant="body-sm" className="text-text-secondary">
                            {card.description}
                          </Typography>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 w-fit"
                        onClick={(event) => {
                          event.stopPropagation();
                          void navigate(card.href);
                        }}
                      >
                        Bereich öffnen
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-2">
              <Card>
                <CardTitle>
                  <Typography variant="h6" as="span" className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-[var(--accent)]" />
                    Gesten & Shortcuts
                  </Typography>
                </CardTitle>
                <ul className="mt-3 space-y-2">
                  {helperShortcuts.map((shortcut) => (
                    <li key={shortcut} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                      <Typography variant="body-sm" as="span" className="text-text-secondary">
                        {shortcut}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <CardTitle>
                  <Typography variant="h6" as="span" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[var(--accent)]" />
                    Hinweise
                  </Typography>
                </CardTitle>
                <div className="mt-3 space-y-1.5">
                  <Typography variant="body-sm" as="p" className="text-text-secondary">
                    • Teile keine sensiblen Daten oder API-Keys im Prompt.
                  </Typography>
                  <Typography variant="body-sm" as="p" className="text-text-secondary">
                    • Speichere längere Recherchen regelmäßig im Studio.
                  </Typography>
                  <Typography variant="body-sm" as="p" className="text-text-secondary">
                    • Installiere die PWA für stabile mobile Sessions.
                  </Typography>
                </div>
              </Card>
            </section>
          </PageContainer>
        ) : (
          <PageContainer width="max" className="relative z-10 flex h-full flex-col">
            <div
              className="flex-1 overflow-y-auto rounded-[var(--radius-xl)] border border-[color:var(--glass-border-soft)] bg-[color-mix(in_srgb,var(--layer-glass-panel)_94%,transparent)] p-4 shadow-[var(--shadow-lg)]"
              data-testid="chat-message-list"
            >
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
                className="h-full"
              />
            </div>
          </PageContainer>
        )}
      </main>

      <div className="sticky bottom-0 bg-gradient-to-t from-surface-base to-transparent pt-4 z-10 safe-area-bottom">
        <div className="px-page-padding-x safe-area-horizontal" ref={composerContainerRef}>
          <ChatComposer
            value={input}
            onChange={setInput}
            onSend={handleSend}
            onStop={stop}
            isLoading={isLoading}
            canSend={!isLoading}
            placeholder="Nachricht an Disa AI schreiben..."
          />
        </div>
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}
