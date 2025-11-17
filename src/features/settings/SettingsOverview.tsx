import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { ChevronRight } from "@/lib/icons";

import { useConversationStats } from "../../hooks/use-storage";
import { useMemory } from "../../hooks/useMemory";
import { useSettings } from "../../hooks/useSettings";
import {
  BookOpenCheck,
  ChevronUp,
  KeyRound,
  Moon,
  Palette,
  Settings,
  Shield,
  Upload,
  Waves,
} from "../../lib/icons";
import { hasApiKey as hasStoredApiKey } from "../../lib/openrouter/key";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/Card";

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

  const gestureTips = [
    {
      id: "gesture-settings",
      title: "Einstellungen öffnen",
      description: "Langes Drücken mit drei Fingern öffnet jederzeit das Studio.",
      icon: Settings,
    },
    {
      id: "gesture-scroll",
      title: "Zurück zum Anfang",
      description: "Doppeltippen am oberen Rand scrollt an den Seitenanfang.",
      icon: ChevronUp,
    },
    {
      id: "gesture-theme",
      title: "Theme wechseln",
      description: "Swipe nach oben mit drei Fingern toggelt Hell/Dunkel.",
      icon: Moon,
    },
  ];

  return (
    <div className="space-y-6 pb-12 text-style-body">
      <div className="space-y-1">
        <h1 className="text-style-heading-lg">Einstellungen</h1>
        <p className="text-style-body text-text-secondary">
          Verwalte API-Zugang, Gedächtnis, Filter und Daten zentral an einem Ort.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schnellstart</CardTitle>
          <CardDescription>
            Richte zuerst deinen API-Key ein und aktiviere anschließend das Gedächtnis. Das dunkle
            Design ist bereits aktiv – passe Details jederzeit später an.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Link to="/settings/api">
              <Button size="sm" variant="primary">
                API-Key speichern
              </Button>
            </Link>
            <Link to="/settings/memory">
              <Button size="sm" variant="secondary">
                Gedächtnis konfigurieren
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Einstellungen</CardTitle>
          <CardDescription>Eine klare Übersicht über die wichtigsten Bereiche.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((cardData) => (
              <Link to={cardData.to} key={cardData.id} className="hover:no-underline">
                <Card
                  variant="outline"
                  className="h-full transition-colors hover:border-primary/50 hover:bg-surface-soft"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                        <cardData.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{cardData.title}</CardTitle>
                        <CardDescription>{cardData.description}</CardDescription>
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-text-muted" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gesten & Shortcuts
            <Waves className="h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {gestureTips.map((gesture) => {
              const Icon = gesture.icon;
              return (
                <Card key={gesture.id} padding="sm">
                  <CardContent>
                    <Icon className="mb-3 h-5 w-5 text-accent" aria-hidden="true" />
                    <p className="text-sm font-semibold text-text-primary">{gesture.title}</p>
                    <p className="text-sm text-text-secondary">{gesture.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
