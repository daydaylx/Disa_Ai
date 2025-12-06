import { useCallback, useEffect, useRef, useState } from "react";

import { Button, Input, Label, PremiumCard, PrimaryButton, useToasts } from "@/ui";

import { StorageMigration } from "../../components/StorageMigration";
import { STORAGE_KEYS } from "../../config/storageKeys";
import { useConversationStats } from "../../hooks/use-storage";
import { Download, Eye, EyeOff, HardDrive, KeyRound, Upload } from "../../lib/icons";
import { hasApiKey as hasStoredApiKey, readApiKey, writeApiKey } from "../../lib/openrouter/key";
import type { ExportData } from "../../lib/storage-layer";
import { ModernStorageLayer } from "../../lib/storage-layer";
import { SettingsLayout } from "./SettingsLayout";

const storageLayer = new ModernStorageLayer();

export function SettingsApiDataView() {
  const toasts = useToasts();
  const { stats, refresh } = useConversationStats();

  const [hasApiKey, setHasApiKey] = useState(() => hasStoredApiKey());
  const [apiKey, setApiKey] = useState(() => {
    try {
      return readApiKey() ?? "";
    } catch {
      return "";
    }
  });

  const [baseUrl, setBaseUrl] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.API_BASE_URL) || "https://openrouter.ai/api/v1";
    } catch {
      return "https://openrouter.ai/api/v1";
    }
  });
  const [showKey, setShowKey] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setHasApiKey(hasStoredApiKey());
  }, []);

  // Debounced sessionStorage sync to prevent performance issues during typing
  const debouncedStorageSync = useCallback((value: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      try {
        sessionStorage.setItem("openrouter-key", value);
        // Remove from localStorage to maintain security (only use sessionStorage)
        localStorage.removeItem("openrouter-key");
      } catch {
        /* ignore */
      }
    }, 300); // 300ms delay
  }, []);

  // Handle API key input change with debounced storage
  const handleApiKeyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setApiKey(value);
      debouncedStorageSync(value);
    },
    [debouncedStorageSync],
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
          kind: "info",
          title: "Ungeprüfter Schlüssel",
          message: "Schlüssel aktualisiert (Prefix nicht geprüft – nur Testbetrieb).",
        });
      }
      writeApiKey(trimmed);
      setHasApiKey(true);
      toasts.push({
        kind: "success",
        title: "API-Key gespeichert",
        message: "Der Schlüssel wird nur in dieser Session gehalten.",
      });

      // Immediate sync on save
      try {
        sessionStorage.setItem("openrouter-key", trimmed);
        // Remove from localStorage to maintain security (only use sessionStorage)
        localStorage.removeItem("openrouter-key");
      } catch {
        /* ignore */
      }

      try {
        localStorage.setItem(
          STORAGE_KEYS.API_BASE_URL,
          baseUrl.trim() || "https://openrouter.ai/api/v1",
        );
      } catch {
        /* ignore */
      }
    } catch (error) {
      console.error(error);
      toasts.push({
        kind: "error",
        title: "Speichern fehlgeschlagen",
        message: "SessionStorage nicht verfügbar.",
      });
    }
  };

  const handleRemoveKey = () => {
    setApiKey("");
    writeApiKey("");
    setHasApiKey(false);
    toasts.push({
      kind: "info",
      title: "API-Key entfernt",
      message: "Es wird wieder der öffentliche Proxy genutzt.",
    });
  };

  const handleExportConversations = async () => {
    setIsExporting(true);
    try {
      const exportData = await storageLayer.exportConversations();

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `disa-ai-conversations-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toasts.push({
        kind: "success",
        title: "Export erfolgreich",
        message: `${exportData.conversations.length} Gespräche exportiert`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toasts.push({
        kind: "error",
        title: "Export fehlgeschlagen",
        message: "Konnte Gespräche nicht exportieren",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportConversations = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data: ExportData = JSON.parse(text);

      if (!data.conversations || !Array.isArray(data.conversations)) {
        throw new Error("Invalid file format");
      }

      const result = await storageLayer.importConversations(data, {
        overwrite: false,
        merge: true,
      });

      if (result.success) {
        toasts.push({
          kind: "success",
          title: "Import erfolgreich",
          message: `${result.importedCount} Gespräche importiert`,
        });
        await refresh();
      } else {
        throw new Error("Import failed");
      }
    } catch (error) {
      console.error("Import failed:", error);
      toasts.push({
        kind: "error",
        title: "Import fehlgeschlagen",
        message: "Ungültige Datei oder Importfehler",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <SettingsLayout
      activeTab="api-data"
      title="API & Daten"
      description="OpenRouter verbinden, Backups exportieren/importieren und lokale Speicher nutzen."
    >
      <div className="space-y-4 pb-4xl">
        <PremiumCard variant="default" className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-brand" />
                <h3 className="text-sm font-semibold text-text-primary">Schlüssel & Verbindung</h3>
              </div>

              {hasApiKey && (
                <div className="flex items-center gap-2 px-2xs py-3xs rounded-md bg-brand/10 border border-brand/20">
                  <div className="w-2 h-2 rounded-full bg-brand shadow-brandGlow" />
                  <span className="text-sm font-medium text-brand">API-Key aktiv</span>
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="api-key" className="text-sm font-semibold text-text-primary">
                  OpenRouter Key
                </Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="sk-or-..."
                    className="pr-2xl"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3xs rounded-sm text-text-muted hover:text-brand hover:bg-brand/10 transition-all duration-fast"
                    aria-label={showKey ? "Key verbergen" : "Key anzeigen"}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-base-url" className="text-sm font-semibold text-text-primary">
                  OpenRouter Base URL
                </Label>
                <Input
                  id="api-base-url"
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://openrouter.ai"
                  autoComplete="off"
                  aria-label="OpenRouter Basis-URL"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <PrimaryButton
                  onClick={handleSaveKey}
                  className="w-full sm:w-auto shadow-brandGlow"
                >
                  Speichern
                </PrimaryButton>
                {hasApiKey && (
                  <Button
                    variant="secondary"
                    onClick={handleRemoveKey}
                    className="w-full sm:w-auto"
                  >
                    Entfernen
                  </Button>
                )}
              </div>

              <div className="rounded-md bg-surface-inset shadow-inset p-3">
                <p className="text-xs text-text-secondary leading-relaxed">
                  🔒 Der API-Key bleibt lokal (Session Storage). Ohne Key nutzt Disa AI den
                  kostenlosen Service. Für fortgeschrittene Nutzer: eigene Modelle und höhere
                  Limits.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-brand" />
                <h3 className="text-sm font-semibold text-text-primary">Speicherstatistiken</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-md bg-surface-inset">
                  <div className="text-lg font-bold text-brand">
                    {stats?.totalConversations || 0}
                  </div>
                  <div className="text-xs text-text-muted">Gespräche</div>
                </div>
                <div className="p-3 rounded-md bg-surface-inset">
                  <div className="text-lg font-bold text-brand">{stats?.totalMessages || 0}</div>
                  <div className="text-xs text-text-muted">Nachrichten</div>
                </div>
                <div className="p-3 rounded-md bg-surface-inset">
                  <div className="text-lg font-bold text-brand">
                    {stats?.averageMessagesPerConversation?.toFixed(1) || "0.0"}
                  </div>
                  <div className="text-xs text-text-muted">⌀ Nachrichten</div>
                </div>
                <div className="p-3 rounded-md bg-surface-inset">
                  <div className="text-lg font-bold text-brand">
                    {formatFileSize(stats?.storageSize || 0)}
                  </div>
                  <div className="text-xs text-text-muted">Speicher</div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-brand" />
                <h3 className="text-sm font-semibold text-text-primary">Export</h3>
              </div>
              <PrimaryButton
                onClick={handleExportConversations}
                disabled={isExporting}
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isExporting ? "Exportiere..." : "Alle Gespräche exportieren"}
              </PrimaryButton>
              <p className="text-xs text-text-muted">
                Erstellt eine JSON-Datei mit allen Gesprächen. Sicher für Backups oder Umzug auf ein
                neues Gerät.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-brand" />
                <h3 className="text-sm font-semibold text-text-primary">Import</h3>
              </div>
              <Button
                variant="secondary"
                onClick={handleImportConversations}
                disabled={isImporting}
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {isImporting ? "Importiere..." : "Gespräche-Datei auswählen"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelection}
                className="hidden"
              />
              <p className="text-xs text-text-muted">
                Unterstützt JSON-Dateien im Disa AI Format. Bestehende Gespräche bleiben erhalten.
              </p>
            </section>

            <section className="space-y-4 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Migration & Recovery</h3>
                <Button variant="secondary" size="sm" onClick={() => setShowMigration((v) => !v)}>
                  {showMigration ? "Schließen" : "Öffnen"}
                </Button>
              </div>
              {showMigration && (
                <StorageMigration
                  onMigrationComplete={refresh}
                  onClose={() => setShowMigration(false)}
                />
              )}
            </section>

            <div className="rounded-md bg-surface-inset shadow-inset p-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                💾 Exportdateien enthalten alle Nachrichten, Metadaten und verwendete Modelle.
                Import mergt neue Gespräche, ohne bestehende zu überschreiben.
              </p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </SettingsLayout>
  );
}
