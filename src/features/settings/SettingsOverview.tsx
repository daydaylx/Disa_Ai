import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardDescription, CardTitle } from "../../components/ui/card";
import { useConversationStats } from "../../hooks/use-storage";
import { useMemory } from "../../hooks/useMemory";
import { useSettings } from "../../hooks/useSettings";
import { BookOpenCheck, KeyRound, Palette, Shield, Upload, Waves } from "../../lib/icons";
import { hasApiKey as hasStoredApiKey } from "../../lib/openrouter/key";

interface OverviewCard {
  id: string;
  title: string;
  description: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  statusLabel: string;
  statusVariant: "success" | "warning" | "muted" | "info" | "error";
  meta?: string;
}

export function SettingsOverview() {
  const { settings } = useSettings();
  const { isEnabled: memoryEnabled } = useMemory();
  const [hasApiKey, setHasApiKey] = useState(() => hasStoredApiKey());
  const location = useLocation();
  const { stats } = useConversationStats();

  useEffect(() => {
    setHasApiKey(hasStoredApiKey());
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const cards: OverviewCard[] = [
    {
      id: "api",
      title: "API-Key & Verbindung",
      description: "OpenRouter-Schlüssel verwalten und Proxy-Status prüfen.",
      to: "/settings/api",
      icon: KeyRound,
      statusLabel: hasApiKey ? "Key aktiv" : "Nicht gesetzt",
      statusVariant: hasApiKey ? "success" : "warning",
    },
    {
      id: "memory",
      title: "Verlauf & Gedächtnis",
      description: "Lokales Gedächtnis und Datenschutzoptionen steuern.",
      to: "/settings/memory",
      icon: BookOpenCheck,
      statusLabel: memoryEnabled ? "Gedächtnis aktiv" : "Neutral",
      statusVariant: memoryEnabled ? "success" : "muted",
      meta: `${stats?.totalConversations ?? 0} Verläufe`,
    },
    {
      id: "filters",
      title: "Inhalte & Filter",
      description: "Sicherheitsfilter und Jugendschutz für Antworten anpassen.",
      to: "/settings/filters",
      icon: Shield,
      statusLabel: settings.showNSFWContent ? "Explizite Inhalte erlaubt" : "Gefiltert",
      statusVariant: settings.showNSFWContent ? "warning" : "success",
    },
    {
      id: "appearance",
      title: "Darstellung",
      description: "Dunkles Design – optimiert für geringe Umgebungshelligkeit.",
      to: "/settings/appearance",
      icon: Palette,
      statusLabel: "Dunkles Theme",
      statusVariant: "success",
    },
    {
      id: "data",
      title: "Import & Export",
      description: "Konversationen sichern, zusammenführen oder aufräumen.",
      to: "/settings/data",
      icon: Upload,
      statusLabel:
        (stats?.totalConversations ?? 0) > 0
          ? `${stats?.totalConversations ?? 0} Verläufe`
          : "Noch keine lokalen Daten",
      statusVariant: (stats?.totalConversations ?? 0) > 0 ? "muted" : "info",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <section>
        <Card
          tone="neo-floating"
          elevation="subtle"
          intent="accent"
          className="rounded-[var(--radius-xl)] border border-[var(--color-accent-border)] bg-[var(--color-accent-surface)] px-5 py-4 text-[var(--color-text-on-accent)] shadow-[var(--shadow-glow-accent-subtle)]"
        >
          <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-text-on-accent)]/70">
            Schnellstart
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-on-accent)]/90">
            Richte zuerst deinen API-Key ein und aktiviere anschließend das Gedächtnis. Das dunkle
            Design ist bereits aktiv – passe Details jederzeit später an.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="accent">
              <Link to="/settings/api">API-Key speichern</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/settings/memory">Gedächtnis konfigurieren</Link>
            </Button>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <header>
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-text-tertiary">
            Einstellungen
          </h2>
          <p className="mt-1 text-sm text-text-secondary leading-6">
            Eine klare Übersicht über die wichtigsten Bereiche. Tippe auf eine Karte, um direkt zum
            Detail zu springen.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link to={card.to} className="focus-visible:outline-none">
                <Card
                  key={card.id}
                  tone="neo-glass"
                  interactive="glow-accent"
                  padding="none"
                  className="h-full group"
                  clickable
                >
                  <div className="flex h-full flex-col p-4">
                    <div className="flex flex-row items-start gap-3">
                      <span className="grid h-10 w-10 place-content-center rounded-full border border-[var(--color-accent-border)] bg-[var(--surface-neumorphic-raised)] text-[var(--color-border-focus)] shadow-neo-sm">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-base font-semibold text-text-primary">
                            {card.title}
                          </CardTitle>
                          <Badge variant={card.statusVariant} size="sm">
                            {card.statusLabel}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm text-text-secondary">
                          {card.description}
                        </CardDescription>
                        {card.meta ? (
                          <p className="text-xs text-text-tertiary">{card.meta}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-4 flex grow items-end justify-between border-t border-[var(--color-border-subtle)] pt-3 text-sm text-[var(--color-border-focus)]">
                      <span className="font-medium">Details anzeigen</span>
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="settings-shortcuts" tabIndex={-1}>
        <Card
          tone="neo-floating"
          elevation="subtle"
          intent="accent"
          className="rounded-[var(--radius-xl)] border border-[var(--color-accent-border)] bg-[var(--color-accent-surface)] px-4 py-4 text-[var(--color-text-on-accent)] shadow-[var(--shadow-glow-accent-subtle)]"
        >
          <header className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-[var(--color-text-on-accent)]" aria-hidden />
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-text-on-accent)]/70">
              Gesten & Shortcuts
            </h2>
          </header>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-on-accent)]/85">
            <li>
              <strong className="text-[var(--color-text-on-accent)]">
                Langes Drücken mit drei Fingern
              </strong>{" "}
              öffnet die Einstellungen – jederzeit erreichbar.
            </li>
            <li>
              <strong className="text-[var(--color-text-on-accent)]">
                Doppeltippen am oberen Rand
              </strong>{" "}
              scrollt zurück zum Anfang der aktuellen Ansicht.
            </li>
            <li>
              <strong className="text-[var(--color-text-on-accent)]">
                Swipe nach oben mit drei Fingern
              </strong>{" "}
              wechselt das Theme – perfekt zum schnellen Check.
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
