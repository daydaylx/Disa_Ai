import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { SectionCard } from "../../components/ui/SectionCard";
import { SettingsLink } from "../../components/ui/SettingsLink";
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
    <div className="space-y-6 pb-12 text-style-body">
      <div className="space-y-1">
        <h1 className="text-style-heading-lg">Einstellungen</h1>
        <p className="text-style-body text-text-secondary">
          Verwalte API-Zugang, Gedächtnis, Filter und Daten zentral an einem Ort.
        </p>
      </div>

      <SectionCard
        title="Schnellstart"
        subtitle="Richte zuerst deinen API-Key ein und aktiviere anschließend das Gedächtnis. Das dunkle Design ist bereits aktiv – passe Details jederzeit später an."
      >
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="accent">
            <Link to="/settings/api">API-Key speichern</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/settings/memory">Gedächtnis konfigurieren</Link>
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Einstellungen"
        subtitle="Eine klare Übersicht über die wichtigsten Bereiche."
        padding="sm"
      >
        <div className="flex flex-col">
          {cards.map((card) => (
            <SettingsLink
              key={card.id}
              to={card.to}
              icon={<card.icon className="h-5 w-5" />}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Gesten & Shortcuts" headerActions={<Waves className="h-5 w-5" />}>
        <ul className="mt-3 space-y-2 text-style-body text-text-primary/85">
          <li className="leading-[var(--line-height-body)]">
            <span className="text-style-body-strong text-text-primary">
              Langes Drücken mit drei Fingern
            </span>{" "}
            öffnet die Einstellungen – jederzeit erreichbar.
          </li>
          <li className="leading-[var(--line-height-body)]">
            <span className="text-style-body-strong text-text-primary">
              Doppeltippen am oberen Rand
            </span>{" "}
            scrollt zurück zum Anfang der aktuellen Ansicht.
          </li>
          <li className="leading-[var(--line-height-body)]">
            <span className="text-style-body-strong text-text-primary">
              Swipe nach oben mit drei Fingern
            </span>{" "}
            wechselt das Theme – perfekt zum schnellen Check.
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}
