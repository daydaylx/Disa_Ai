import { type ComponentType, type ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Badge, Button, GlassPanel, Input, Label, Switch, Typography, useToasts } from "@/ui";

import { useMemory } from "../../hooks/useMemory";
import { useSettings } from "../../hooks/useSettings";
import {
  cleanupOldConversations,
  type ConversationStats,
  exportConversations,
  getConversationStats,
  importConversations,
} from "../../lib/conversation-manager-modern";
import {
  BookOpenCheck,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  Shield,
  Sparkles,
  Upload,
} from "../../lib/icons";
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
  const [stats, setStats] = useState<ConversationStats>({
    totalConversations: 0,
    totalMessages: 0,
    averageMessagesPerConversation: 0,
    modelsUsed: [],
    storageSize: 0,
  });

  useEffect(() => {
    setHasApiKey(hasStoredApiKey());
    // Load stats asynchronously
    getConversationStats().then(setStats).catch(console.error);
  }, []);

  const refreshStats = async () => {
    try {
      const newStats = await getConversationStats();
      setStats(newStats);
    } catch (error) {
      console.error("Failed to refresh stats:", error);
    }
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

  const handleExport = async () => {
    try {
      await exportConversations();
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
      const result = await importConversations(payload, { merge: true, overwrite: false });
      if (result.success) {
        await refreshStats();
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

  const handleCleanup = async () => {
    if (!window.confirm("Alle Konversationen älter als 30 Tage löschen?")) return;
    try {
      const deleted = await cleanupOldConversations(30);
      await refreshStats();
      toasts.push({
        kind: "info",
        title: "Verlauf reduziert",
        message:
          deleted > 0 ? `${deleted} Konversationen entfernt.` : "Keine alten Verläufe gefunden.",
      });
    } catch (error) {
      console.error("Cleanup failed:", error);
      toasts.push({
        kind: "error",
        title: "Bereinigung fehlgeschlagen",
        message: "Alte Konversationen konnten nicht entfernt werden.",
      });
    }
  };

  const sectionConfigs: SettingsSectionConfig[] = [
    {
      id: "api",
      title: "API-Key & Verbindung",
      description: "Optionaler OpenRouter API-Key für persönliche Limits.",
      icon: KeyRound,
      content: (
        <div className="space-y-3">
          <Label htmlFor="openrouter-key">OpenRouter Key</Label>
          <div className="flex items-center gap-2">
            <Input
              id="openrouter-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setApiKey(event.target.value)
              }
              placeholder="sk-or-..."
              className="flex-1"
            />
            <Button
              variant="secondary"
              size="icon"
              aria-label={showKey ? "Key verbergen" : "Key anzeigen"}
              onClick={() => setShowKey((prev) => !prev)}
            >
              {showKey ? (
                <EyeOff className="h-4 w-4 shadow-[var(--shadow-glow-soft)]" />
              ) : (
                <Eye className="h-4 w-4 shadow-[var(--shadow-glow-soft)]" />
              )}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Button variant="primary" size="sm" onClick={handleSaveKey}>
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
          <Typography variant="caption" className="text-[var(--color-text-secondary)]">
            Schlüssel wird nur im aktuellen Browser-Tab gespeichert. Bei leerem Feld nutzt Disa den
            öffentlichen Proxy.
          </Typography>
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
            <Button variant="primary" className="justify-between" onClick={handleCleanup}>
              Verlauf komprimieren
              <RefreshCw className="h-4 w-4 shadow-[var(--shadow-glow-soft)]" />
            </Button>
            <Button
              variant="ghost"
              className="justify-between text-[var(--color-status-danger-fg)]"
              onClick={() => {
                void clearAllMemory();
                void refreshStats();
                toasts.push({
                  kind: "success",
                  title: "Gedächtnis geleert",
                  message: "Alle gespeicherten Personas entfernt.",
                });
              }}
            >
              Gedächtnis leeren
              <Sparkles className="h-4 w-4 shadow-[var(--shadow-glow-soft)]" />
            </Button>
          </div>
          <GlassPanel>
            <Typography variant="caption" className="text-text-muted">
              {stats.totalConversations} gespeicherte Verläufe · {stats.totalMessages} Nachrichten ·{" "}
              {stats.modelsUsed.length} Modelle
            </Typography>
          </GlassPanel>
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
            <Label>Farbschema</Label>
            <Typography variant="caption" className="text-[var(--color-text-secondary)]">
              Der Dunkelmodus ist standardmäßig aktiv und kann nicht deaktiviert werden. Alle
              Oberflächen, Tokens und Kontraste sind auf die dunkle Darstellung optimiert.
            </Typography>
          </div>
          <GlassPanel className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <Typography
                  variant="caption"
                  className="font-semibold uppercase tracking-[0.3em] text-accent"
                  style={{ fontSize: "10px" }}
                >
                  Designsystem
                </Typography>
                <Typography variant="body" className="font-semibold text-text-primary">
                  Fluent-2 Soft-Depth · Dark
                </Typography>
                <Typography variant="caption" className="text-text-secondary">
                  Sanfte Layer, klare Typografie und performante Schatten – optimiert für geringe
                  Umgebungshelligkeit und OLED/AMOLED-Displays.
                </Typography>
              </div>
              <div className="hidden h-14 w-24 rounded-lg border border-line bg-gradient-to-br from-surface-base to-surface-card sm:block" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Typography variant="caption" className="text-text-secondary">
                Lesbarkeit 5.6 : 1
              </Typography>
              <Typography variant="caption" className="text-text-secondary">
                Blur-frei
              </Typography>
              <Typography variant="caption" className="text-text-secondary">
                OLED-optimiert
              </Typography>
            </div>
            <Typography variant="caption" className="text-text-secondary">
              Farb- und Tiefeneffekte respektieren automatisch deine Geräteeinstellungen wie
              <code className="mx-1 rounded bg-surface-muted px-1 text-[10px]">
                prefers-reduced-motion
              </code>
              oder Kontrastverbesserungen.
            </Typography>
          </GlassPanel>
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
            <Button variant="primary" className="justify-between" onClick={handleExport}>
              Export als JSON
              <Download className="h-4 w-4 shadow-[var(--shadow-glow-soft)]" />
            </Button>
            <Button variant="secondary" className="justify-between" onClick={handleImportClick}>
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-text-secondary" />
                <div className="text-left">
                  <Typography variant="body" className="font-medium text-text-primary">
                    Einstellungen importieren
                  </Typography>
                  <Typography variant="body" className="text-text-secondary">
                    Vorhandene Einstellungen aus einer Datei laden
                  </Typography>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-text-secondary" />
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
          <Typography variant="caption" className="text-[var(--color-text-secondary)]">
            Daten bleiben ausschließlich lokal. Import ersetzt vorhandene Chats nicht, sondern
            ergänzt sie.
          </Typography>
        </>
      ),
    },
  ];

  const sectionsToRender = section
    ? sectionConfigs.filter((config) => config.id === section)
    : sectionConfigs;
  const sectionStatuses: Record<
    SettingsSectionKey,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
  > = {
    api: {
      label: hasApiKey ? "Key aktiv" : "Nicht gesetzt",
      variant: hasApiKey ? "secondary" : "destructive",
    },
    memory: {
      label: memoryEnabled ? "Gedächtnis aktiv" : "Neutral",
      variant: memoryEnabled ? "secondary" : "default",
    },
    filters: {
      label: settings.showNSFWContent ? "Explizit" : "Gefiltert",
      variant: settings.showNSFWContent ? "destructive" : "secondary",
    },
    appearance: {
      label: "Dunkles Theme",
      variant: "secondary",
    },
    data: {
      label:
        stats.totalConversations > 0
          ? `${stats.totalConversations} Verläufe`
          : "Keine lokalen Daten",
      variant: stats.totalConversations > 0 ? "default" : "outline",
    },
  };
  const headerTitle = section ? (sectionsToRender[0]?.title ?? "Einstellungen") : "Einstellungen";

  return (
    <div className="flex min-h-dvh flex-1 flex-col overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-[var(--glass-border-soft)] bg-[color-mix(in_srgb,var(--bg0)_92%,transparent)]/95 backdrop-blur-xl">
        <div className="flex items-center gap-4 px-4 py-3">
          {section ? (
            <Button variant="ghost" size="sm" className="px-0 text-sm">
              <Link to="/settings" className="inline-flex items-center gap-1 text-text-secondary">
                ← Übersicht
              </Link>
            </Button>
          ) : null}
          <Typography variant="h5" as="h1" className="text-text-primary">
            {headerTitle}
          </Typography>
        </div>
      </header>

      <div className="space-y-6 px-4 py-4 pb-10">
        {sectionsToRender.map((config) => {
          return (
            <GlassPanel key={config.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Typography variant="h6" className="text-text-primary">
                    {config.title}
                  </Typography>
                  <Typography variant="body" className="text-text-muted">
                    {config.description}
                  </Typography>
                </div>
                <Badge variant={sectionStatuses[config.id].variant}>
                  {sectionStatuses[config.id].label}
                </Badge>
              </div>
              <div className="mt-4 space-y-4">{config.content}</div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
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
  onChange: React.ChangeEventHandler<HTMLButtonElement>;
}) {
  return (
    <div className="bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)] border border-[var(--glass-border-medium)] shadow-[var(--shadow-glow-soft)] flex items-start justify-between gap-6 px-6 py-4 rounded-3xl hover:shadow-[var(--shadow-glow-primary)] transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]">
      <div className="flex-1">
        <Typography variant="h6" className="text-primary">
          {label}
        </Typography>
        <Typography variant="body" className="text-text-secondary">
          {description}
        </Typography>
      </div>
      <Switch id={id} checked={checked} onChange={onChange} aria-label={label} />
    </div>
  );
}
