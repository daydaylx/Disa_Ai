import { BookOpenCheck, KeyRound, Palette, Shield, Upload, Waves } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardDescription, CardTitle } from "../../components/ui/card";
import { useMemory } from "../../hooks/useMemory";
import { useSettings } from "../../hooks/useSettings";
import { getConversationStats } from "../../lib/conversation-manager";
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
  const stats = useMemo(() => getConversationStats(), []);

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
      meta: `${stats.totalConversations} Verläufe`,
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
        stats.totalConversations > 0
          ? `${stats.totalConversations} Verläufe`
          : "Noch keine lokalen Daten",
      statusVariant: stats.totalConversations > 0 ? "muted" : "info",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <section>
        <Card
          tone="neo-floating"
          elevation="subtle"
          className="rounded-[var(--radius-xl)] border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-floating)] px-5 py-4 text-[var(--color-text-primary)] shadow-neo-sm"
        >
          <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-text-tertiary)]">
            Schnellstart
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Richte zuerst deinen API-Key ein und aktiviere anschließend das Gedächtnis. Das dunkle
            Design ist bereits aktiv – passe Details jederzeit später an.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="brand">
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
              <Card
                key={card.id}
                tone="neo-glass"
                elevation="subtle"
                interactive="gentle"
                className="group"
              >
                <Link
                  to={card.to}
                  className="flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-floating)] p-4 shadow-neo-sm transition-shadow duration-200 focus-visible:outline-none focus-visible:shadow-focus-neo hover:shadow-neo-md"
                >
                  <div className="flex flex-row items-start gap-3">
                    <span className="grid h-10 w-10 place-content-center rounded-full border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-[var(--acc1)] shadow-neo-sm">
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
                      {card.meta ? <p className="text-xs text-text-tertiary">{card.meta}</p> : null}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--border-neumorphic-subtle)] pt-3 text-sm text-[var(--acc1)]">
                    <span className="font-medium">Details anzeigen</span>
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="settings-shortcuts" tabIndex={-1}>
        <Card
          tone="neo-floating"
          elevation="subtle"
          className="rounded-[var(--radius-xl)] border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-floating)] px-4 py-4 shadow-neo-sm"
        >
          <header className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-[var(--acc1)]" aria-hidden />
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-text-tertiary">
              Gesten & Shortcuts
            </h2>
          </header>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li>
              <strong className="text-text-primary">Langes Drücken mit drei Fingern</strong> öffnet
              die Einstellungen – jederzeit erreichbar.
            </li>
            <li>
              <strong className="text-text-primary">Doppeltippen am oberen Rand</strong> scrollt
              zurück zum Anfang der aktuellen Ansicht.
            </li>
            <li>
              <strong className="text-text-primary">Swipe nach oben mit drei Fingern</strong>{" "}
              wechselt das Theme – perfekt zum schnellen Check.
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
