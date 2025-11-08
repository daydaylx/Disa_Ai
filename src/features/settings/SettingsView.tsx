import {
  BookOpenCheck,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  Shield,
  Sparkles,
  Upload,
} from "../../lib/icons";
import { type ComponentType, type ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Badge, type BadgeProps } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/Switch";
import { useToasts } from "../../components/ui/toast/ToastsProvider";
import { useMemory } from "../../hooks/useMemory";
import { useSettings } from "../../hooks/useSettings";
import {
  cleanupOldConversations,
  exportConversations,
  getConversationStats,
  importConversations,
} from "../../lib/conversation-manager";
import { hasApiKey as hasStoredApiKey, readApiKey, writeApiKey } from "../../lib/openrouter/key";

export type SettingsSectionKey = "api" | "memory" | "filters" | "appearance" | "data";

interface SettingsSectionConfig {
  id: SettingsSectionKey;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  content: ReactNode;
}

export function SettingsView({ section }: { section?: SettingsSectionKey }) {
  const toasts = useToasts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { settings, toggleNSFWContent, toggleAnalytics, toggleNotifications } = useSettings();
  const { toggleMemory, clearAllMemory, isEnabled: memoryEnabled } = useMemory();
  const [hasApiKey, setHasApiKey] = useState(() => hasStoredApiKey());
  const [apiKey, setApiKey] = useState(() => {
    try {
      return readApiKey() ?? "";
    } catch {
      return "";
    }
  });
  const [showKey, setShowKey] = useState(false);
  const [stats, setStats] = useState(() => getConversationStats());

  useEffect(() => {
    setHasApiKey(hasStoredApiKey());
  }, []);

  const refreshStats = () => {
    setStats(getConversationStats());
  };

  const handleSaveKey = () => {
    try {
      const trimmed = apiKey.trim();
      if (!trimmed) {
        writeApiKey("");
        setHasApiKey(false);
        toasts.push({
          kind: "success",
          title: "API-Key entfernt",
          message: "Es wird wieder der öffentliche Proxy genutzt.",
        });
        return;
      }
      if (!trimmed.startsWith("sk-or-")) {
        toasts.push({
          kind: "error",
          title: "Ungültiger Schlüssel",
          message: "OpenRouter Schlüssel beginnen mit 'sk-or-'",
        });
        return;
      }
      writeApiKey(trimmed);
      setHasApiKey(true);
      toasts.push({
        kind: "success",
        title: "API-Key gespeichert",
        message: "Der Schlüssel wird nur in dieser Session gehalten.",
      });
    } catch (error) {
      console.error(error);
      toasts.push({
        kind: "error",
        title: "Speichern fehlgeschlagen",
        message: "SessionStorage nicht verfügbar.",
      });
    }
  };

  const handleExport = () => {
    try {
      exportConversations();
      toasts.push({
        kind: "success",
        title: "Export gestartet",
        message: "JSON-Datei wurde heruntergeladen.",
      });
    } catch (error) {
      console.error(error);
      toasts.push({
        kind: "error",
        title: "Export fehlgeschlagen",
        message: "Konversationen konnten nicht exportiert werden.",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const result = importConversations(payload, { merge: true, overwrite: false });
      if (result.success) {
        refreshStats();
        toasts.push({
          kind: "success",
          title: "Import abgeschlossen",
          message: `${result.importedCount} Konversationen aus ${file.name} übernommen.`,
        });
      } else {
        toasts.push({
          kind: "error",
          title: "Import fehlgeschlagen",
          message: result.errors.join(", "),
        });
      }
    } catch (error) {
      console.error(error);
      toasts.push({
        kind: "error",
        title: "Import fehlgeschlagen",
        message: error instanceof Error ? error.message : "Datei konnte nicht gelesen werden.",
      });
    }
  };

  const handleCleanup = () => {
    if (!window.confirm("Alle Konversationen älter als 30 Tage löschen?")) return;
    const deleted = cleanupOldConversations(30);
    refreshStats();
    toasts.push({
      kind: "info",
      title: "Verlauf reduziert",
      message:
        deleted > 0 ? `${deleted} Konversationen entfernt.` : "Keine alten Verläufe gefunden.",
    });
  };

  const sectionConfigs: SettingsSectionConfig[] = [
    {
      id: "api",
      title: "API-Key & Verbindung",
      description: "Optionaler OpenRouter API-Key für persönliche Limits.",
      icon: KeyRound,
      content: (
        <div className="space-y-3">
          <Label
            htmlFor="openrouter-key"
            className="text-xs font-semibold uppercase tracking-[0.3em]"
          >
            OpenRouter Key
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="openrouter-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="sk-or-..."
              className="flex-1"
            />
            <Button
              variant="secondary"
              size="icon"
              aria-label={showKey ? "Key verbergen" : "Key anzeigen"}
              onClick={() => setShowKey((prev) => !prev)}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Button variant="accent" size="sm" onClick={handleSaveKey}>
              Speichern
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setApiKey("");
                handleSaveKey();
              }}
            >
              Entfernen
            </Button>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Schlüssel wird nur im aktuellen Browser-Tab gespeichert. Bei leerem Feld nutzt Disa den
            öffentlichen Proxy.
          </p>
        </div>
      ),
    },
    {
      id: "memory",
      title: "Verlauf & Gedächtnis",
      description: "Steuere lokale Speicherung und Gedächtnisfunktionen.",
      icon: BookOpenCheck,
      content: (
        <div className="space-y-4">
          <ToggleRow
            id="memory-toggle"
            label="Globales Gedächtnis"
            description={
              memoryEnabled
                ? "Antworten berücksichtigen letzte Kontexte."
                : "Deaktiviert – Antworten sind stateless."
            }
            checked={memoryEnabled}
            onChange={() => toggleMemory()}
          />
          <ToggleRow
            id="analytics-toggle"
            label="Anonyme Nutzungsdaten"
            description="Hilft, UI-Fehler früh zu erkennen."
            checked={settings.enableAnalytics}
            onChange={() => toggleAnalytics()}
          />
          <ToggleRow
            id="notifications-toggle"
            label="Benachrichtigungen"
            description="Push Hinweise bei langen Läufen."
            checked={settings.enableNotifications}
            onChange={() => toggleNotifications()}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="accent" className="justify-between" onClick={handleCleanup}>
              Verlauf komprimieren
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="justify-between text-[var(--color-status-danger-fg)]"
              onClick={() => {
                clearAllMemory();
                refreshStats();
                toasts.push({
                  kind: "success",
                  title: "Gedächtnis geleert",
                  message: "Alle gespeicherten Personas entfernt.",
                });
              }}
            >
              Gedächtnis leeren
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
          <Card
            tone="neo-floating"
            elevation="subtle"
            intent="accent"
            className="rounded-[var(--radius-card-inner)] border border-[var(--color-accent-border)] bg-[var(--color-accent-surface)]/90 p-3 text-xs text-[var(--color-text-on-accent)] glass-panel"
          >
            <p>
              {stats.totalConversations} gespeicherte Verläufe · {stats.totalMessages} Nachrichten ·{" "}
              {stats.modelsUsed.length} Modelle
            </p>
          </Card>
        </div>
      ),
    },
    {
      id: "filters",
      title: "Inhalte & Filter",
      description: "Steuere NSFW-Filter und Sicherheitsoptionen.",
      icon: Shield,
      content: (
        <ToggleRow
          id="nsfw-toggle"
          label="NSFW Inhalte zulassen"
          description="Nur aktivieren, wenn du explizite Antworten erwartest."
          checked={settings.showNSFWContent}
          onChange={() => toggleNSFWContent()}
        />
      ),
    },
    {
      id: "appearance",
      title: "Darstellung",
      description: "Das dunkle Design ist dauerhaft aktiv.",
      icon: Sparkles,
      content: (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-[0.3em]">Farbschema</Label>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Der Dunkelmodus ist standardmäßig aktiv und kann nicht deaktiviert werden. Alle
              Oberflächen, Tokens und Kontraste sind auf die dunkle Darstellung optimiert.
            </p>
          </div>
          <Card
            tone="neo-floating"
            elevation="subtle"
            className="space-y-3 border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-floating)] glass-panel"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="brand-chip inline-flex w-fit text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-brand-strong)]">
                  Designsystem
                </span>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Fluent-2 Soft-Depth · Dark
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Sanfte Layer, klare Typografie und performante Schatten – optimiert für geringe
                  Umgebungshelligkeit und OLED/AMOLED-Displays.
                </p>
              </div>
              <div className="hidden h-14 w-24 rounded-[var(--radius-card-inner)] border border-[var(--color-border-subtle)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--bg1) 95%,transparent) 0%,color-mix(in_srgb,var(--bg1) 75%,var(--bg2)) 40%,color-mix(in_srgb,var(--bg2) 80%,transparent) 100%)] sm:block" />
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
              <span>Lesbarkeit 5.6 : 1</span>
              <span>Blur-frei</span>
              <span>OLED-optimiert</span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Farb- und Tiefeneffekte respektieren automatisch deine Geräteeinstellungen wie
              <code className="mx-1 rounded bg-[var(--surface-neumorphic-pressed)] px-1 text-[10px]">
                prefers-reduced-motion
              </code>
              oder Kontrastverbesserungen.
            </p>
          </Card>
        </div>
      ),
    },
    {
      id: "data",
      title: "Import & Export",
      description: "Verwalte Konversationen lokal.",
      icon: Upload,
      content: (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="accent" className="justify-between" onClick={handleExport}>
              Export als JSON
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="neo-subtle" className="justify-between" onClick={handleImportClick}>
              Importieren
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleImport(file);
                event.target.value = "";
              }
            }}
          />
          <p className="text-xs text-[var(--color-text-secondary)]">
            Daten bleiben ausschließlich lokal. Import ersetzt vorhandene Chats nicht, sondern
            ergänzt sie.
          </p>
        </>
      ),
    },
  ];

  const sectionsToRender = section
    ? sectionConfigs.filter((config) => config.id === section)
    : sectionConfigs;
  const sectionStatuses: Record<
    SettingsSectionKey,
    { label: string; variant: BadgeProps["variant"] }
  > = {
    api: {
      label: hasApiKey ? "Key aktiv" : "Nicht gesetzt",
      variant: hasApiKey ? "success" : "warning",
    },
    memory: {
      label: memoryEnabled ? "Gedächtnis aktiv" : "Neutral",
      variant: memoryEnabled ? "success" : "muted",
    },
    filters: {
      label: settings.showNSFWContent ? "Explizit" : "Gefiltert",
      variant: settings.showNSFWContent ? "warning" : "success",
    },
    appearance: {
      label: "Dunkles Theme",
      variant: "success",
    },
    data: {
      label:
        stats.totalConversations > 0
          ? `${stats.totalConversations} Verläufe`
          : "Keine lokalen Daten",
      variant: stats.totalConversations > 0 ? "muted" : "info",
    },
  };
  const headerTitle = section ? (sectionsToRender[0]?.title ?? "Einstellungen") : "Einstellungen";

  return (
    <div className="flex min-h-dvh flex-1 flex-col overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-[color-mix(in_srgb,var(--color-border-focus)_30%,transparent)] bg-gradient-to-r from-[var(--acc2)]/12 via-[var(--surface-neumorphic-floating)] to-transparent px-4 py-3 shadow-[var(--shadow-neumorphic-sm)]">
        <div className="flex items-center justify-between text-sm">
          <div className="space-y-1">
            {section ? (
              <Button asChild variant="ghost" size="sm" className="px-0 text-xs font-medium">
                <Link
                  to="/settings"
                  className="inline-flex items-center gap-1 text-xs text-[var(--color-border-focus)]"
                >
                  ← Übersicht
                </Link>
              </Button>
            ) : null}
            <span className="brand-chip inline-flex w-fit items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-border-focus)]/70">
              Kontrolle
            </span>
            <h1 className="text-token-h1 text-[var(--color-text-primary)] font-semibold">
              {headerTitle}
            </h1>
          </div>
          <div className="text-right text-xs text-text-muted leading-5">
            <p>{stats.totalMessages} Nachrichten</p>
            <p>{stats.totalConversations} Verläufe</p>
          </div>
        </div>
      </header>

      <div className="space-y-6 px-4 py-4 pb-10">
        {sectionsToRender.map((config) => (
          <SettingsSection
            key={config.id}
            id={config.id}
            icon={config.icon}
            title={config.title}
            description={config.description}
            status={sectionStatuses[config.id]}
          >
            {config.content}
          </SettingsSection>
        ))}
      </div>
    </div>
  );
}

function SettingsSection({
  id,
  icon: Icon,
  title,
  description,
  children,
  status,
}: {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: ReactNode;
  status?: { label: string; variant: BadgeProps["variant"] };
}) {
  return (
    <section id={id}>
      <Card
        tone="neo-floating"
        elevation="subtle"
        className="shadow-[var(--shadow-depth-1)] glass-panel"
      >
        <div className="flex items-start gap-3 border-b border-[var(--color-border-subtle)] px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-card-small)] border border-[var(--color-accent-border)] bg-[var(--color-accent-surface)] text-[var(--color-text-on-accent)] shadow-[var(--shadow-glow-accent-subtle)]">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h2>
              {status ? (
                <Badge variant={status.variant} size="sm">
                  {status.label}
                </Badge>
              ) : null}
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
          </div>
        </div>
        <div className="space-y-4 px-4 py-4 text-[var(--color-text-primary)]">{children}</div>
      </Card>
    </section>
  );
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Card
      tone="neo-subtle"
      padding="sm"
      className="flex items-start justify-between gap-4 rounded-[var(--radius-card-inner)] p-3 glass-panel"
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
        <p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
      </div>
      <Switch id={id} checked={checked} onChange={onChange} aria-label={label} />
    </Card>
  );
}
