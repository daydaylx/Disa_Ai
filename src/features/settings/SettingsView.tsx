import { type ComponentType, type ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  AppHeader,
  Badge,
  Button,
  GlassCard,
  Input,
  Label,
  PrimaryButton,
  QuickStartCard,
  SectionHeader,
  Switch,
  Typography,
  useToasts,
} from "@/ui";

import { useConversationStats } from "../../hooks/use-storage";
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
  Palette,
  RefreshCw,
  Shield,
  Sparkles,
  Upload,
} from "../../lib/icons";
import { hasApiKey as hasStoredApiKey, readApiKey, writeApiKey } from "../../lib/openrouter/key";

export function SettingsView() {
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
  const location = useLocation();

  useEffect(() => {
    setHasApiKey(hasStoredApiKey());
    // Load stats asynchronously
    getConversationStats().then(setStats).catch(console.error);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

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

  const cards = [
    {
      id: "api",
      title: "API-Key & Verbindung",
      description: "OpenRouter-Schlüssel verwalten und Proxy-Status prüfen",
      to: "/settings/api",
      icon: KeyRound,
    },
    {
      id: "memory",
      title: "Verlauf & Gedächtnis",
      description: "Lokales Gedächtnis und Datenschutzoptionen steuern",
      to: "/settings/memory",
      icon: BookOpenCheck,
    },
    {
      id: "filters",
      title: "Inhalte & Filter",
      description: "Sicherheitsfilter und Jugendschutz anpassen",
      to: "/settings/filters",
      icon: Shield,
    },
    {
      id: "appearance",
      title: "Darstellung",
      description: "Dunkles Design und Interface-Optionen",
      to: "/settings/appearance",
      icon: Palette,
    },
    {
      id: "data",
      title: "Import & Export",
      description: "Konversationen sichern und verwalten",
      to: "/settings/data",
      icon: Upload,
    },
  ];

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <AppHeader pageTitle="Einstellungen" />

      <div className="space-y-4 sm:space-y-6 px-[var(--spacing-4)] py-3 sm:py-[var(--spacing-6)]">
        <QuickStartCard
          primaryAction={{
            label: "API-Key speichern",
            to: "/settings/api"
          }}
          secondaryAction={{
            label: "Gedächtnis konfigurieren",
            to: "/settings/memory"
          }}
        />

        <div className="space-y-4">
          <SectionHeader
            variant="compact"
            title="Einstellungen"
            subtitle="Verwalte deine Daten, APIs und Darstellung"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((cardData) => {
              const Icon = cardData.icon;
              return (
                <GlassCard
                  key={cardData.id}
                  className="group cursor-pointer transition-transform hover:scale-105"
                >
                  <Link
                    to={cardData.to}
                    className="block p-4 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-2xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_8px_24px_rgba(97,231,255,0.2)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="text-base font-semibold text-text-primary group-hover:text-pink-300 transition-colors">
                          {cardData.title}
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {cardData.description}
                        </p>
                        <span className="text-xs font-medium text-accent">
                          Details anzeigen →
                        </span>
                      </div>
                    </div>
                  </Link>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
