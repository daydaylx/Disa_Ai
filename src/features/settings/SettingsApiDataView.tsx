import { useCallback, useEffect, useRef, useState } from "react";

import { Badge, Button, Card, Input, Label, useToasts } from "@/ui";

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
  const panelClassName =
    "rounded-[26px] border-white/[0.10] bg-surface-1/82 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.76)] ring-1 ring-inset ring-white/[0.04] sm:backdrop-blur-xl";
  const insetPanelClassName =
    "rounded-[20px] border border-white/[0.08] bg-black/[0.10] px-4 py-4 shadow-inner";

  return (
    <SettingsLayout
      activeTab="api-data"
      title="API & Daten"
      description="OpenRouter verbinden, Backups exportieren/importieren und lokale Speicher nutzen."
    >
      <div className="mx-auto w-full max-w-3xl space-y-3 pb-4xl">
        <Card
          variant="surface"
          accent="settings"
          className={panelClassName}
          data-testid="model-card"
        >
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-accent-settings-border/40 bg-accent-settings-surface text-accent-settings shadow-inner">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-ink-primary">Schlüssel & Verbindung</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                    Lege fest, ob Disa den kostenlosen Zugang oder deinen eigenen OpenRouter-Key
                    nutzt.
                  </p>
                </div>
              </div>
              <Badge
                variant={hasApiKey ? "settings" : "secondary"}
                className="w-fit rounded-full px-3 py-1.5"
              >
                {hasApiKey ? "Key aktiv" : "Proxy aktiv"}
              </Badge>
            </div>

            {hasApiKey && (
              <div className="flex w-fit items-center gap-2 rounded-full border border-accent-settings-border/40 bg-accent-settings-dim/35 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-accent-settings" />
                <span className="text-sm font-medium text-ink-primary">API-Key aktiv</span>
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="api-key" className="text-sm font-semibold text-ink-primary">
                OpenRouter Key
              </Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="sk-or-..."
                  className="rounded-[20px] border-white/[0.12] bg-black/[0.10] pr-12"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-transparent text-ink-tertiary transition-colors hover:border-white/[0.08] hover:bg-accent-settings-dim/40 hover:text-accent-settings"
                  aria-label={showKey ? "Key verbergen" : "Key anzeigen"}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-base-url" className="text-sm font-semibold text-ink-primary">
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
                className="rounded-[20px] border-white/[0.12] bg-black/[0.10]"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={handleSaveKey} variant="primary" className="w-full gap-2 sm:w-auto">
                Speichern
              </Button>
              {hasApiKey && (
                <Button variant="secondary" onClick={handleRemoveKey} className="w-full sm:w-auto">
                  Entfernen
                </Button>
              )}
            </div>

            <div className={insetPanelClassName}>
              <p className="text-sm leading-relaxed text-ink-secondary">
                Der API-Key bleibt lokal (Session Storage). Ohne Key nutzt Disa AI den kostenlosen
                Service. Mit eigenem Key sind eigene Modelle und höhere Limits nutzbar.
              </p>
            </div>
          </section>
        </Card>

        <Card variant="surface" className={panelClassName}>
          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-accent-settings-border/40 bg-accent-settings-surface text-accent-settings shadow-inner">
                <HardDrive className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ink-primary">Speicherstatistiken</h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                  Überblick über lokal gespeicherte Chats und das belegte Volumen auf diesem Gerät.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className={insetPanelClassName}>
                <div className="text-lg font-bold text-accent-settings">
                  {stats?.totalConversations || 0}
                </div>
                <div className="text-xs text-ink-tertiary">Gespräche</div>
              </div>
              <div className={insetPanelClassName}>
                <div className="text-lg font-bold text-accent-settings">
                  {stats?.totalMessages || 0}
                </div>
                <div className="text-xs text-ink-tertiary">Nachrichten</div>
              </div>
              <div className={insetPanelClassName}>
                <div className="text-lg font-bold text-accent-settings">
                  {stats?.averageMessagesPerConversation?.toFixed(1) || "0.0"}
                </div>
                <div className="text-xs text-ink-tertiary">Ø Nachrichten</div>
              </div>
              <div className={insetPanelClassName}>
                <div className="text-lg font-bold text-accent-settings">
                  {formatFileSize(stats?.storageSize || 0)}
                </div>
                <div className="text-xs text-ink-tertiary">Speicher</div>
              </div>
            </div>
          </section>
        </Card>

        <Card variant="surface" className={panelClassName}>
          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-accent-settings-border/40 bg-accent-settings-surface text-accent-settings shadow-inner">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ink-primary">Export</h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                  Erstelle eine JSON-Datei mit allen Gesprächen für Backup oder Gerätewechsel.
                </p>
              </div>
            </div>
            <Button
              onClick={handleExportConversations}
              disabled={isExporting}
              variant="primary"
              className="w-full gap-2 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              <span>{isExporting ? "Exportiere..." : "Alle Gespräche exportieren"}</span>
            </Button>
          </section>
        </Card>

        <Card variant="surface" className={panelClassName}>
          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-accent-settings-border/40 bg-accent-settings-surface text-accent-settings shadow-inner">
                <Upload className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ink-primary">Import</h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                  Führe exportierte Gespräche zusammen, ohne bestehende Daten zu überschreiben.
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={handleImportConversations}
              disabled={isImporting}
              className="w-full gap-2 sm:w-auto"
            >
              <Upload className="h-4 w-4" />
              <span>{isImporting ? "Importiere..." : "Gespräche-Datei auswählen"}</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelection}
              className="hidden"
            />
          </section>
        </Card>

        <Card variant="surface" padding="sm" className={panelClassName}>
          <p className="text-sm leading-relaxed text-ink-secondary">
            Exportdateien enthalten Nachrichten, Metadaten und verwendete Modelle. Der Import führt
            neue Gespräche zusammen, ohne bestehende zu überschreiben.
          </p>
        </Card>
      </div>
    </SettingsLayout>
  );
}
