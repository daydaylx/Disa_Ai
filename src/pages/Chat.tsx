import { useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ChatComposer } from "../components/chat/ChatComposer";
import { QuickstartGrid } from "../components/chat/QuickstartGrid";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import {
  AppMenuDrawer,
  defaultMenuSections,
  MenuIcon,
  useMenuDrawer,
} from "../components/layout/AppMenuDrawer";
import { PageContainer } from "../components/layout/PageContainer";
import { ChatPageShell } from "../components/layout/PageShell";
import { Button } from "../components/ui/button";
import { Card, CardTitle } from "../components/ui/card";
import { useToasts } from "../components/ui/toast/ToastsProvider";
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
  const { isOpen, openMenu, closeMenu } = useMenuDrawer();

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
    <ChatPageShell actions={<MenuIcon onClick={openMenu} />}>
      <div className="chat-page-background relative flex min-h-[100dvh] flex-col text-text-primary">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(120%_100%_at_50%_0%,hsl(var(--brand-1)/0.18)_0%,transparent_70%)]" />
        </div>

        <main className="relative flex-1">
          {isEmpty ? (
            <PageContainer width="max" className="relative z-10 flex flex-col gap-8">
              <section className="overflow-hidden rounded-[2.5rem] border border-[var(--glass-border-strong)] bg-[radial-gradient(circle_at_top,hsl(var(--accent-hue)_80%_50%)_0%,rgba(12,19,36,0.85)_45%)] p-6 text-white shadow-[0_45px_120px_rgba(5,6,18,0.65)] sm:p-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                  <div className="space-y-5 lg:flex-1">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                      Studio
                    </span>
                    <div>
                      <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                        Konzentrierte KI-Arbeit in einer ruhigen Oberfläche.
                      </h1>
                      <p className="mt-3 max-w-2xl text-base text-white/80">
                        Starte mit einem klaren Ziel, nutze vorbereitete Flows und schalte Modelle
                        sowie Rollen per Shortcut. Alles offline-fähig, PWA-optimiert und ohne
                        ablenkende Frames.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button size="lg" variant="accent" onClick={focusComposer}>
                        Unterhaltung starten
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/settings">Studio öffnen</Link>
                      </Button>
                      <Button size="lg" variant="glass-ghost" asChild>
                        <Link to="/models">Modelle & Rollen</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="grid w-full flex-shrink-0 gap-3 sm:grid-cols-3 lg:max-w-md">
                    {heroStatus.map((status) => (
                      <div
                        key={status.label}
                        className="rounded-2xl border border-white/30 bg-white/10 p-3 backdrop-blur"
                      >
                        <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">
                          {status.label}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">{status.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                {insightCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <Card
                      key={card.id}
                      tone="glass-floating"
                      padding="lg"
                      className="space-y-2"
                      elevation="surface"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-text-muted">
                            {card.label}
                          </p>
                          <p className="text-lg font-semibold text-text-primary">{card.value}</p>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary">{card.caption}</p>
                    </Card>
                  );
                })}
              </section>

              <QuickstartGrid
                onStart={startWithPreset}
                title="Fokus-Workflows"
                description="Vorbereitete Presets für Recherche, Schreiben und Pair Programming – starte ohne Setup."
              />

              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-text-muted">
                      Studio
                    </p>
                    <h2 className="text-xl font-semibold text-text-primary">
                      Bereiche & Einstellungen
                    </h2>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/settings">Alle Einstellungen</Link>
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {studioCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <Card
                        key={card.id}
                        tone="glass-floating"
                        interactive="gentle"
                        padding="lg"
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
                        <div className="space-y-3">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)]/40 text-[var(--accent)]">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-base font-semibold text-text-primary">
                              {card.title}
                            </p>
                            <p className="text-sm text-text-secondary">{card.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="glass-ghost"
                          size="sm"
                          className="mt-4 w-fit"
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

              <section className="grid gap-4 md:grid-cols-2">
                <Card tone="glass-primary" elevation="surface" padding="lg">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Waves className="h-4 w-4 text-[var(--accent)]" />
                    Gesten & Shortcuts
                  </CardTitle>
                  <ul className="mt-4 space-y-3 text-sm text-text-secondary">
                    {helperShortcuts.map((shortcut) => (
                      <li key={shortcut} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                        <span>{shortcut}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card tone="glass-primary" elevation="surface" padding="lg">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Shield className="h-4 w-4 text-[var(--accent)]" />
                    Hinweise
                  </CardTitle>
                  <div className="mt-4 space-y-2 text-sm text-text-secondary">
                    <p>• Teile keine sensiblen Daten oder API-Keys im Prompt.</p>
                    <p>• Speichere längere Recherchen regelmäßig im Studio.</p>
                    <p>• Installiere die PWA für stabile mobile Sessions.</p>
                  </div>
                </Card>
              </section>
            </PageContainer>
          ) : (
            <PageContainer width="max" className="relative z-10 flex h-full flex-col">
              <div className="flex-1 overflow-y-auto rounded-[var(--radius-xl)] border border-[color:var(--glass-border-soft)] bg-[color-mix(in_srgb,var(--layer-glass-panel)_94%,transparent)] p-4 shadow-[var(--shadow-lg)]">
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

        {/* Menu Drawer */}
        <AppMenuDrawer isOpen={isOpen} onClose={closeMenu} sections={defaultMenuSections} />
      </div>
    </ChatPageShell>
  );
}
