import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Label, PremiumCard, PrimaryButton, useToasts } from "@/ui";

import { StorageMigration } from "../../components/StorageMigration";
import { useConversationStats } from "../../hooks/use-storage";
import { useSettings } from "../../hooks/useSettings";
import { Download, HardDrive, Trash2, Upload } from "../../lib/icons";
import type { ExportData } from "../../lib/storage-layer";
import { ModernStorageLayer } from "../../lib/storage-layer";

const storageLayer = new ModernStorageLayer();

export function SettingsDataView() {
  const toasts = useToasts();
  const { stats, refresh } = useConversationStats();
  const { resetSettings } = useSettings();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteAllConversations = async () => {
    if (
      confirm(
        "ACHTUNG: Wirklich ALLE Gespräche unwiderruflich löschen? Dies kann nicht rückgängig gemacht werden.",
      )
    ) {
      try {
        await storageLayer.clearAllData();
        await refresh();
        toasts.push({
          kind: "success",
          title: "Daten gelöscht",
          message: "Alle Gespräche wurden erfolgreich gelöscht.",
        });
      } catch (error) {
        console.error("Delete all failed:", error);
        toasts.push({
          kind: "error",
          title: "Fehler",
          message: "Konnte Daten nicht löschen.",
        });
      }
    }
  };

  const handleExportConversations = async () => {
    setIsExporting(true);
    try {
      const exportData = await storageLayer.exportConversations();

      // Create and download file
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

      // Validate data structure
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
      // Reset file input
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
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Link to="/settings">
          <Button variant="ghost" size="sm">
            ← Zurück zu Einstellungen
          </Button>
        </Link>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-6">
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary">Import & Export</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Gespräche sichern, wiederherstellen und verwalten
              </p>
            </div>

            {/* Storage Statistics */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Speicherstatistiken</h3>

              <div className="grid grid-cols-2 gap-4">
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

              {stats?.modelsUsed && stats.modelsUsed.length > 0 && (
                <div className="p-3 rounded-md bg-surface-inset">
                  <Label className="text-sm font-medium text-text-primary mb-2 block">
                    Verwendete Modelle
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {stats.modelsUsed.map((model) => (
                      <span
                        key={model}
                        className="px-2 py-1 rounded-sm bg-brand/10 text-xs text-brand"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Gespräche exportieren</h3>

              <div className="space-y-3">
                <PrimaryButton
                  onClick={handleExportConversations}
                  disabled={isExporting || (stats?.totalConversations || 0) === 0}
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? "Exportiere..." : "Alle Gespräche exportieren"}
                </PrimaryButton>

                <p className="text-xs text-text-muted">
                  Erstellt eine JSON-Datei mit allen gespeicherten Gesprächen und Metadaten. Diese
                  Datei kann später wieder importiert werden.
                </p>
              </div>
            </div>

            {/* Import Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Gespräche importieren</h3>

              <div className="space-y-3">
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
                  Unterstützt JSON-Dateien im Disa AI Export-Format. Bestehende Gespräche werden
                  nicht überschrieben.
                </p>
              </div>
            </div>

            {/* Data Management */}
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-text-primary">Datenverwaltung</h3>

              <div className="space-y-3">
                <div className="p-3 rounded-md bg-surface-inset">
                  <div className="flex items-start gap-2">
                    <HardDrive className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-text-primary">Lokale Speicherung</p>
                      <p className="text-xs text-text-muted leading-relaxed">
                        Alle Gespräche werden lokal in deinem Browser gespeichert (IndexedDB). Daten
                        werden niemals an externe Server übertragen.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-md bg-surface-inset">
                  <div className="text-sm font-medium text-text-primary mb-1">
                    Backup-Empfehlung
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Erstelle regelmäßig Backups deiner Gespräche durch Export. Browser-Daten können
                    bei Browserwechsel oder Systemreset verloren gehen.
                  </p>
                </div>
              </div>
            </div>

            {/* Migration & Backup */}
            <div className="space-y-4 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Migration & Backup</h3>
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
            </div>

            {/* Reset Settings */}
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-text-primary">
                Einstellungen zurücksetzen
              </h3>

              <div className="space-y-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (
                      confirm(
                        "Möchtest du alle Einstellungen auf die Standardwerte zurücksetzen?\n\nGespräche und Daten bleiben erhalten.",
                      )
                    ) {
                      resetSettings();
                      toasts.push({
                        kind: "success",
                        title: "Einstellungen zurückgesetzt",
                        message: "Alle Einstellungen wurden auf die Standardwerte zurückgesetzt",
                      });
                    }
                  }}
                  className="w-full sm:w-auto"
                >
                  Auf Standardwerte zurücksetzen
                </Button>

                <p className="text-xs text-text-muted">
                  Setzt Theme, Modellwahl, Kreativität und alle anderen Einstellungen auf
                  Standardwerte zurück. Gespräche und Daten werden nicht gelöscht.
                </p>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-4 border-t border-red-200 dark:border-red-900/30 pt-4 mt-8">
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>

              <div className="space-y-3 p-4 rounded-md border border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/30">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Alle Gespräche löschen
                </h4>
                <p className="text-xs text-red-600/80 dark:text-red-400/80 leading-relaxed mb-3">
                  Dies löscht unwiderruflich alle gespeicherten Gespräche und Metadaten aus der
                  lokalen Datenbank.
                </p>
                <Button
                  variant="secondary"
                  onClick={handleDeleteAllConversations}
                  className="w-full sm:w-auto flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-100 border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Alle Gespräche endgültig löschen
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-md bg-surface-inset shadow-inset p-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                💾 Exportdateien enthalten alle Nachrichten, Metadaten und verwendete Modelle.
                Import mergt neue Gespräche ohne bestehende zu überschreiben.
              </p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
