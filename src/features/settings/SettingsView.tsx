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
} from "lucide-react";
import { type ComponentType, type ReactNode, useRef, useState } from "react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/Switch";
import { useToasts } from "../../components/ui/toast/ToastsProvider";
import { useMemory } from "../../hooks/useMemory";
import { useSettings } from "../../hooks/useSettings";
import { useTheme } from "../../hooks/useTheme";
import {
  cleanupOldConversations,
  exportConversations,
  getConversationStats,
  importConversations,
} from "../../lib/conversation-manager";

const themeOptions = [
  { value: "system", label: "System" },
  { value: "light", label: "Hell" },
  { value: "dark", label: "Dunkel" },
];

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
  const { settings, toggleNSFWContent, toggleAnalytics, toggleNotifications, setTheme } =
    useSettings();
  const { preference, setPreference } = useTheme();
  const { toggleMemory, clearAllMemory, isEnabled: memoryEnabled } = useMemory();
  const [apiKey, setApiKey] = useState(() => {
    try {
      return sessionStorage.getItem("openrouter-key") ?? "";
    } catch {
      return "";
    }
  });
  const [showKey, setShowKey] = useState(false);
  const [stats, setStats] = useState(() => getConversationStats());

  const refreshStats = () => {
    setStats(getConversationStats());
  };

  const handleSaveKey = () => {
    try {
      const trimmed = apiKey.trim();
      if (!trimmed) {
        sessionStorage.removeItem("openrouter-key");
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
      sessionStorage.setItem("openrouter-key", trimmed);
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

  const handleThemeChange = (value: string) => {
    setPreference(value as typeof preference);
    setTheme(value === "system" ? "auto" : (value as "light" | "dark"));
    toasts.push({ kind: "success", title: "Theme aktualisiert", message: `Modus: ${value}` });
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
            <Button variant="brand" size="sm" onClick={handleSaveKey}>
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
            <Button variant="secondary" className="justify-between" onClick={handleCleanup}>
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
          <div className="rounded-[var(--radius-card-inner)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-subtle)] p-3 text-xs text-[var(--color-text-secondary)]">
            <p>
              {stats.totalConversations} gespeicherte Verläufe · {stats.totalMessages} Nachrichten ·{" "}
              {stats.modelsUsed.length} Modelle
            </p>
          </div>
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
      description: "Wähle Theme und respektiere Systempräferenzen.",
      icon: Sparkles,
      content: (
        <div className="space-y-3">
          <Label
            htmlFor="theme-select"
            className="text-xs font-semibold uppercase tracking-[0.3em]"
          >
            Farbschema
          </Label>
          <Select value={preference} onValueChange={handleThemeChange}>
            <SelectTrigger id="theme-select">
              <SelectValue placeholder="System" />
            </SelectTrigger>
            <SelectContent>
              {themeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Tokens werden live aktualisiert. Blur-Intensität respektiert prefers-reduced-motion.
          </p>
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
            <Button variant="brand" className="justify-between" onClick={handleExport}>
              Export als JSON
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="secondary" className="justify-between" onClick={handleImportClick}>
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

  const visibleSections = section
    ? sectionConfigs.filter((config) => config.id === section)
    : sectionConfigs;
  const sectionsToRender = visibleSections.length > 0 ? visibleSections : sectionConfigs;
  const headerTitle = section ? (sectionsToRender[0]?.title ?? "Einstellungen") : "Einstellungen";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-[var(--color-border-hairline)] bg-[var(--color-surface-base)]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-tertiary)]">
              Kontrolle
            </p>
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {headerTitle}
            </h1>
          </div>
          <div className="text-right text-xs text-[var(--color-text-secondary)]">
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
}: {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-[var(--radius-card)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-card)] shadow-[var(--shadow-surface)]"
    >
      <div className="flex items-start gap-3 border-b border-[var(--color-border-hairline)] px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-card-small)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-strong)]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
        </div>
      </div>
      <div className="space-y-4 px-4 py-4 text-[var(--color-text-primary)]">{children}</div>
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
    <div className="flex items-start justify-between gap-4 rounded-[var(--radius-card-inner)] border border-[var(--color-border-hairline)] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
        <p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
      </div>
      <Switch id={id} checked={checked} onChange={onChange} aria-label={label} />
    </div>
  );
}
