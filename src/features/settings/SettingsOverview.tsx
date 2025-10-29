import { BookOpenCheck, KeyRound, Palette, Shield, Upload, Waves } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useMemory } from "../../hooks/useMemory";
import { useSettings } from "../../hooks/useSettings";
import { useTheme } from "../../hooks/useTheme";
import { getConversationStats } from "../../lib/conversation-manager";

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
  const { preference } = useTheme();
  const { isEnabled: memoryEnabled } = useMemory();
  const [hasApiKey, setHasApiKey] = useState(false);
  const stats = useMemo(() => getConversationStats(), []);

  useEffect(() => {
    try {
      const storedKey = sessionStorage.getItem("openrouter-key");
      setHasApiKey(Boolean(storedKey && storedKey.trim().length > 0));
    } catch {
      setHasApiKey(false);
    }
  }, []);

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
      description: "Theme, Kontraste und Bewegungspräferenzen einstellen.",
      to: "/settings/appearance",
      icon: Palette,
      statusLabel:
        preference === "system"
          ? "System folgt"
          : preference === "dark"
            ? "Dunkles Theme"
            : "Helles Theme",
      statusVariant: preference === "system" ? "info" : "muted",
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
      <section className="rounded-[var(--radius-card)] border border-brand/30 bg-brand/10 px-4 py-4 text-[var(--color-brand-strong)]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-strong)]">
          Schnellstart
        </h2>
        <p className="mt-2 text-sm text-[var(--color-brand-strong)]/90">
          Richte zuerst deinen API-Key ein, aktiviere anschließend das Gedächtnis und wähle dein
          Lieblings-Theme. Du kannst jederzeit wieder hierher zurückkehren.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="brand-soft">
            <Link to="/settings/api">API-Key speichern</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link to="/settings/memory">Gedächtnis konfigurieren</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <header>
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-text-tertiary">
            Einstellungen
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Eine klare Übersicht über die wichtigsten Bereiche. Tippe auf eine Karte, um direkt zum
            Detail zu springen.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.id} interactive="lift" className="group">
                <Link to={card.to} className="flex h-full flex-col focus-visible:outline-none">
                  <CardHeader className="flex flex-row items-start gap-3">
                    <span className="grid h-10 w-10 place-content-center rounded-full bg-surface-subtle text-brand">
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
                  </CardHeader>
                  <CardContent className="mt-auto flex items-center justify-between text-sm text-brand">
                    <span className="font-medium">Details anzeigen</span>
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] border border-border-subtle bg-surface-subtle px-4 py-4">
        <header className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-brand" aria-hidden />
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
            <strong className="text-text-primary">Swipe nach oben mit drei Fingern</strong> wechselt
            das Theme – perfekt zum schnellen Check.
          </li>
        </ul>
      </section>
    </div>
  );
}
