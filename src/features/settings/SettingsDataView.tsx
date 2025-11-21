import { useState } from "react";

import { AppHeader, Button, PremiumCard, PrimaryButton, useToasts } from "@/ui";

import { useConversationStats } from "../../hooks/use-storage";
import { Download, Trash2, Upload } from "../../lib/icons";

export function SettingsDataView() {
  const toasts = useToasts();
  const { stats } = useConversationStats();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExportData = async () => {
    try {
      // Get all conversations from IndexedDB
      const db = await openConversationsDB();
      const tx = db.transaction("conversations", "readonly");
      const store = tx.objectStore("conversations");
      const allConversationsRequest = store.getAll();
      const allConversations = await new Promise<any[]>((resolve, reject) => {
        allConversationsRequest.onsuccess = () => resolve(allConversationsRequest.result);
        allConversationsRequest.onerror = () => reject(allConversationsRequest.error);
      });

      // Create export data
      const exportData = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        conversations: allConversations,
        stats: stats || { totalConversations: 0, totalMessages: 0 },
      };

      // Create download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `disa-ai-export-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toasts.push({
        kind: "success",
        title: "Export erfolgreich",
        message: "Deine Konversationen wurden heruntergeladen.",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toasts.push({
        kind: "error",
        title: "Export fehlgeschlagen",
        message: "Daten konnten nicht exportiert werden.",
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!data.conversations || !Array.isArray(data.conversations)) {
          throw new Error("Ungültiges Datenformat");
        }

        // Import conversations to IndexedDB
        const db = await openConversationsDB();
        const tx = db.transaction("conversations", "readwrite");
        const store = tx.objectStore("conversations");

        await Promise.all(
          data.conversations.map(
            (conv: any) =>
              new Promise((resolve, reject) => {
                const request = store.put(conv);
                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(request.error);
              }),
          ),
        );

        toasts.push({
          kind: "success",
          title: "Import erfolgreich",
          message: `${data.conversations.length} Konversationen wurden importiert.`,
        });

        // Reload page to show imported data
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        console.error("Import failed:", error);
        toasts.push({
          kind: "error",
          title: "Import fehlgeschlagen",
          message: "Die Datei konnte nicht gelesen werden.",
        });
      }
    };
    input.click();
  };

  const handleClearAllData = async () => {
    try {
      // Clear IndexedDB
      const db = await openConversationsDB();
      const tx = db.transaction("conversations", "readwrite");
      const clearRequest = tx.objectStore("conversations").clear();
      await new Promise<void>((resolve, reject) => {
        clearRequest.onsuccess = () => resolve();
        clearRequest.onerror = () => reject(clearRequest.error);
      });

      // Clear LocalStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("disa-") || key?.startsWith("openrouter-")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      setShowClearConfirm(false);
      toasts.push({
        kind: "success",
        title: "Daten gelöscht",
        message: "Alle lokalen Daten wurden entfernt.",
      });

      // Reload page to reflect cleared state
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Clear failed:", error);
      toasts.push({
        kind: "error",
        title: "Löschen fehlgeschlagen",
        message: "Daten konnten nicht gelöscht werden.",
      });
    }
  };

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <AppHeader pageTitle="Daten" />

      <div className="space-y-4 px-4 py-4 sm:px-6">
        {/* Storage Stats */}
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Lokaler Speicher</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-md bg-surface-inset shadow-inset">
                <div className="text-2xl font-bold text-brand">
                  {stats?.totalConversations ?? 0}
                </div>
                <div className="text-sm text-text-secondary">Konversationen</div>
              </div>
              <div className="p-4 rounded-md bg-surface-inset shadow-inset">
                <div className="text-2xl font-bold text-brand">{stats?.totalMessages ?? 0}</div>
                <div className="text-sm text-text-secondary">Nachrichten</div>
              </div>
            </div>
          </div>
        </PremiumCard>

        {/* Export/Import */}
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">Daten sichern</h3>
              <p className="text-sm text-text-secondary">
                Exportiere deine Konversationen als JSON-Datei oder importiere zuvor gesicherte
                Daten.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <PrimaryButton
                onClick={handleExportData}
                className="flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </PrimaryButton>
              <Button
                variant="secondary"
                onClick={handleImportData}
                className="flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </PremiumCard>

        {/* Clear Data */}
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">Alle Daten löschen</h3>
              <p className="text-sm text-text-secondary">
                Entferne alle lokalen Konversationen, Einstellungen und gespeicherten Informationen.
                Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
            </div>

            {!showClearConfirm ? (
              <Button
                variant="secondary"
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Alle Daten löschen
              </Button>
            ) : (
              <div className="space-y-3 p-4 rounded-md bg-error/10 border border-error/20">
                <p className="text-sm text-text-primary font-medium text-center">
                  Möchtest du wirklich alle Daten löschen?
                </p>
                <p className="text-sm text-text-secondary text-center">
                  Dies entfernt alle Konversationen, Einstellungen und das Gedächtnis.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1"
                  >
                    Abbrechen
                  </Button>
                  <PrimaryButton
                    onClick={handleClearAllData}
                    className="flex-1 bg-error hover:bg-error"
                  >
                    Jetzt löschen
                  </PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </PremiumCard>

        {/* Data Privacy Info */}
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-text-primary">Datenschutz</h4>
            <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
              <li>Alle Daten bleiben lokal im Browser (IndexedDB + LocalStorage)</li>
              <li>Keine automatische Cloud-Synchronisation</li>
              <li>Export-Dateien sind unverschlüsselt - sicher aufbewahren</li>
              <li>Browser-Daten löschen entfernt alle Informationen</li>
            </ul>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

// Helper function to open IndexedDB
function openConversationsDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("disa-conversations", 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("conversations")) {
        db.createObjectStore("conversations", { keyPath: "id" });
      }
    };
  });
}
