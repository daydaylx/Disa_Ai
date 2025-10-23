import {
  Download,
  Eye,
  EyeOff,
  FileText,
  Info,
  Key,
  MessageSquare,
  Shield,
  Smartphone,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useMemory } from "../../hooks/useMemory";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import { useSettings } from "../../hooks/useSettings";
import {
  cleanupOldConversations,
  deleteConversation,
  exportConversations,
  getAllConversations,
  getConversationStats,
  importConversations,
} from "../../lib/conversation-manager";
import { BUILD_ID } from "../../lib/pwa/registerSW";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/Switch";
import { useToasts } from "../ui/toast/ToastsProvider";

interface AdvancedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChatStats() {
  const [stats, setStats] = useState(() => getConversationStats());

  const refreshStats = () => {
    setStats(getConversationStats());
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="space-y-1">
        <span className="text-text-muted">Konversationen:</span>
        <div className="text-text-strong font-medium">{stats.totalConversations}</div>
      </div>
      <div className="space-y-1">
        <span className="text-text-muted">Nachrichten:</span>
        <div className="text-text-strong font-medium">{stats.totalMessages}</div>
      </div>
      <div className="space-y-1">
        <span className="text-text-muted">Ø pro Chat:</span>
        <div className="text-text-strong font-medium">{stats.averageMessagesPerConversation}</div>
      </div>
      <div className="space-y-1">
        <span className="text-text-muted">Verwendete Modelle:</span>
        <div className="text-text-strong font-medium">{stats.modelsUsed.length}</div>
      </div>
    </div>
  );
}

export default function AdvancedSettingsModal({ isOpen, onClose }: AdvancedSettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<"empty" | "present" | "invalid">("empty");
  const toasts = useToasts();
  const { canInstall, installed: isInstalled, requestInstall: promptInstall } = usePWAInstall();
  const { settings, toggleNSFWContent } = useSettings();
  const {
    toggleMemory,
    globalMemory,
    updateGlobalMemory,
    clearAllMemory,
    isEnabled: memoryEnabled,
  } = useMemory();

  // Load API key on mount
  useEffect(() => {
    if (isOpen) {
      try {
        const storedKey = sessionStorage.getItem("openrouter-key") ?? "";
        setApiKey(storedKey);
        setKeyStatus(storedKey.length > 0 ? "present" : "empty");
      } catch {
        toasts.push({
          kind: "error",
          title: "Einstellungen nicht verfügbar",
          message: "Browser-Storage nicht zugänglich.",
        });
      }
    }
  }, [isOpen, toasts]);

  const handleSaveKey = () => {
    try {
      const trimmedKey = apiKey.trim();

      if (trimmedKey) {
        // Basic validation
        if (!trimmedKey.startsWith("sk-or-")) {
          setKeyStatus("invalid");
          toasts.push({
            kind: "error",
            title: "Ungültiger Schlüssel",
            message: "OpenRouter-Schlüssel beginnen mit 'sk-or-'",
          });
          return;
        }

        sessionStorage.setItem("openrouter-key", trimmedKey);
        setKeyStatus("present");
        toasts.push({
          kind: "success",
          title: "Schlüssel gespeichert",
          message: "Der API-Schlüssel wird sicher in der Session gespeichert.",
        });
      } else {
        sessionStorage.removeItem("openrouter-key");
        setKeyStatus("empty");
        toasts.push({
          kind: "success",
          title: "Schlüssel entfernt",
          message: "Der API-Schlüssel wurde gelöscht.",
        });
      }
    } catch {
      toasts.push({
        kind: "error",
        title: "Speichern fehlgeschlagen",
        message: "Der Schlüssel konnte nicht gesichert werden.",
      });
    }
  };

  const handleInstallPWA = async () => {
    try {
      await promptInstall();
      toasts.push({
        kind: "success",
        title: "Installation gestartet",
        message: "Befolge die Anweisungen deines Browsers.",
      });
    } catch {
      toasts.push({
        kind: "error",
        title: "Installation fehlgeschlagen",
        message: "Die App konnte nicht installiert werden.",
      });
    }
  };

  const handleExportChats = () => {
    try {
      const exportData = exportConversations();
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `disa-ai-chats-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toasts.push({
        kind: "success",
        title: "Export erfolgreich",
        message: `${exportData.metadata.totalConversations} Konversationen exportiert`,
      });
    } catch {
      toasts.push({
        kind: "error",
        title: "Export fehlgeschlagen",
        message: "Die Chats konnten nicht exportiert werden.",
      });
    }
  };

  const handleImportChats = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);

        const result = importConversations(importData, {
          merge: true,
          overwrite: false,
        });

        if (result.success) {
          toasts.push({
            kind: "success",
            title: "Import erfolgreich",
            message: `${result.importedCount} neue Konversationen importiert`,
          });
        } else {
          toasts.push({
            kind: "error",
            title: "Import fehlgeschlagen",
            message: result.errors.join(", "),
          });
        }
      } catch {
        toasts.push({
          kind: "error",
          title: "Import fehlgeschlagen",
          message: "Die Datei konnte nicht gelesen werden.",
        });
      }
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = "";
  };

  const handleCleanupOldChats = () => {
    if (!confirm("Alle Konversationen älter als 30 Tage löschen?")) return;

    try {
      const deletedCount = cleanupOldConversations(30);
      toasts.push({
        kind: "success",
        title: "Aufräumen abgeschlossen",
        message: `${deletedCount} alte Konversationen gelöscht`,
      });
    } catch {
      toasts.push({
        kind: "error",
        title: "Aufräumen fehlgeschlagen",
        message: "Die alten Chats konnten nicht gelöscht werden.",
      });
    }
  };

  const handleDeleteAllChats = () => {
    if (
      !confirm(
        "ALLE Konversationen unwiderruflich löschen? Diese Aktion kann nicht rückgängig gemacht werden!",
      )
    )
      return;

    try {
      const conversations = getAllConversations();
      conversations.forEach((conv) => deleteConversation(conv.id));

      toasts.push({
        kind: "success",
        title: "Alle Chats gelöscht",
        message: "Alle Konversationen wurden entfernt",
      });
    } catch {
      toasts.push({
        kind: "error",
        title: "Löschen fehlgeschlagen",
        message: "Die Chats konnten nicht gelöscht werden.",
      });
    }
  };

  const handleHardReload = () => {
    import("../../lib/utils/reload-manager")
      .then(({ reloadHelpers }) => {
        reloadHelpers.userRequested();
      })
      .catch(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      });
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="border-border relative h-full max-h-[90vh] w-full max-w-md rounded-xl border bg-surface-card shadow-xl sm:h-auto sm:max-h-[80vh]">
        <div className="flex h-full flex-col">
          {/* Header - Fixed */}
          <div className="border-border flex flex-shrink-0 items-center justify-between border-b p-4">
            <h2 className="text-text-strong text-lg font-semibold">Erweiterte Einstellungen</h2>
            <button
              onClick={onClose}
              className="hover:text-text-strong rounded-lg p-1 text-text-muted transition"
              aria-label="Einstellungen schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Settings Content - Scrollable */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* API Key Section */}
              <div className="space-y-3">
                <h3 className="text-text-strong flex items-center gap-2 text-lg font-semibold">
                  <Key className="h-5 w-5" />
                  API-Schlüssel
                </h3>
                <p className="text-sm text-text-muted">
                  Wird nur in der aktuellen Session gespeichert. Nie an unsere Server übertragen.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="text-text-muted">
                    API-Schlüssel
                  </Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(event) => setApiKey(event.target.value)}
                      placeholder="sk-or-..."
                      className="pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      aria-label={showKey ? "API-Schlüssel ausblenden" : "API-Schlüssel anzeigen"}
                      className="hover:text-text-strong absolute right-2 top-1/2 grid -translate-y-1/2 place-items-center rounded-full text-text-muted transition"
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      keyStatus === "present"
                        ? "bg-green-500"
                        : keyStatus === "invalid"
                          ? "bg-red-500"
                          : "bg-gray-500"
                    }`}
                  />
                  <span className="text-sm text-text-muted">
                    {keyStatus === "present"
                      ? "Schlüssel vorhanden"
                      : keyStatus === "invalid"
                        ? "Ungültiger Schlüssel"
                        : "Kein Schlüssel"}
                  </span>
                </div>

                <Button type="button" onClick={handleSaveKey} className="w-full">
                  Schlüssel speichern
                </Button>

                <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                  <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                  <div className="text-xs text-blue-200">
                    <p className="mb-1 font-medium">Datenschutz:</p>
                    <p>
                      Dein Schlüssel wird nur in der Browser-Session gespeichert und automatisch
                      beim Schließen gelöscht.
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Filter Section */}
              <div className="space-y-3">
                <h3 className="text-text-strong flex items-center gap-2 text-lg font-semibold">
                  <User className="h-5 w-5" />
                  Inhaltsfilter
                </h3>
                <p className="text-sm text-text-muted">
                  Verwalte die Sichtbarkeit verschiedener Inhaltsarten.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="nsfw-toggle" className="text-text-strong">
                        18+ / NSFW-Content anzeigen
                      </Label>
                      <p id="nsfw-description" className="text-xs text-text-muted">
                        Ermöglicht die Anzeige von Adult-Content-Personas und entsprechenden Rollen.
                      </p>
                    </div>
                    <Switch
                      checked={settings.showNSFWContent}
                      onChange={toggleNSFWContent}
                      id="nsfw-toggle"
                      aria-describedby="nsfw-description"
                    />
                  </div>

                  <div className="flex items-start gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 p-3">
                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-400" />
                    <div className="text-xs text-orange-200">
                      <p className="mb-1 font-medium">Hinweis:</p>
                      <p>
                        Diese Einstellung wird nur lokal in deinem Browser gespeichert. 18+ Inhalte
                        werden standardmäßig ausgeblendet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Memory Settings Section */}
              <div className="space-y-3">
                <h3 className="text-text-strong flex items-center gap-2 text-lg font-semibold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Gedächtnis
                </h3>
                <p className="text-sm text-text-muted">
                  Speichere Chat-Verläufe und persönliche Informationen für zukünftige Gespräche.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="memory-toggle" className="text-text-strong">
                        Gedächtnis aktivieren
                      </Label>
                      <p id="memory-description" className="text-xs text-text-muted">
                        Wenn aktiviert, werden Chat-Verläufe und globale Infos lokal gespeichert.
                      </p>
                    </div>
                    <Switch
                      checked={memoryEnabled}
                      onChange={toggleMemory}
                      id="memory-toggle"
                      aria-describedby="memory-description"
                    />
                  </div>

                  {memoryEnabled && (
                    <>
                      {/* Global Memory Input */}
                      <div className="border-border space-y-3 border-t pt-4">
                        <Label htmlFor="memory-name" className="text-text-strong">
                          Persönliche Informationen
                        </Label>
                        <div className="space-y-2">
                          <Input
                            id="memory-name"
                            placeholder="Dein Name (optional)"
                            value={globalMemory?.name || ""}
                            onChange={(e) => updateGlobalMemory({ name: e.target.value })}
                            aria-label="Dein Name für persönliche Informationen"
                          />
                          <Input
                            id="memory-hobbies"
                            placeholder="Hobbys, Interessen (optional)"
                            value={globalMemory?.hobbies?.join(", ") || ""}
                            onChange={(e) =>
                              updateGlobalMemory({
                                hobbies: e.target.value
                                  ? e.target.value.split(",").map((h) => h.trim())
                                  : [],
                              })
                            }
                            aria-label="Deine Hobbys und Interessen"
                          />
                          <Input
                            id="memory-background"
                            placeholder="Hintergrund, Beruf (optional)"
                            value={globalMemory?.background || ""}
                            onChange={(e) => updateGlobalMemory({ background: e.target.value })}
                            aria-label="Dein beruflicher Hintergrund"
                          />
                        </div>
                      </div>

                      {/* Clear Memory */}
                      <div className="border-border border-t pt-4">
                        <Button
                          onClick={() => {
                            if (
                              confirm(
                                "Alle gespeicherten Erinnerungen löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
                              )
                            ) {
                              clearAllMemory();
                              toasts.push({
                                kind: "success",
                                title: "Gedächtnis gelöscht",
                                message:
                                  "Alle gespeicherten Chat-Verläufe und Infos wurden entfernt.",
                              });
                            }
                          }}
                          variant="outline"
                          className="w-full border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Alle Erinnerungen löschen
                        </Button>
                      </div>
                    </>
                  )}

                  <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                    <div className="text-xs text-blue-200">
                      <p className="mb-1 font-medium">Datenschutz:</p>
                      <p>
                        Alle Daten werden nur lokal in deinem Browser gespeichert und niemals an
                        Server übertragen. Das Gedächtnis kann jederzeit deaktiviert oder gelöscht
                        werden.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Management Section */}
              <div className="space-y-3">
                <h3 className="text-text-strong flex items-center gap-2 text-lg font-semibold">
                  <MessageSquare className="h-5 w-5" />
                  Chat-Verwaltung
                </h3>
                <p className="text-sm text-text-muted">
                  Exportiere, importiere und verwalte deine gespeicherten Konversationen.
                </p>

                <div className="space-y-6">
                  {/* Chat Statistics */}
                  <div className="space-y-3">
                    <Label className="text-text-strong">Statistiken</Label>
                    <ChatStats />
                  </div>

                  {/* Export/Import Actions */}
                  <div className="border-border space-y-3 border-t pt-4">
                    <Label className="text-text-strong">Import & Export</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleExportChats}
                        variant="outline"
                        className="w-full border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Exportieren
                      </Button>

                      <div className="relative">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportChats}
                          className="absolute inset-0 cursor-pointer opacity-0"
                          id="import-chats"
                        />
                        <Button
                          variant="outline"
                          className="w-full border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20"
                          asChild
                        >
                          <label htmlFor="import-chats" className="cursor-pointer">
                            <span className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Importieren
                            </span>
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Cleanup Actions */}
                  <div className="border-border space-y-3 border-t pt-4">
                    <Label className="text-text-strong">Aufräumen</Label>
                    <div className="space-y-2">
                      <Button
                        onClick={handleCleanupOldChats}
                        variant="outline"
                        className="w-full border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Alte Chats löschen (30+ Tage)
                      </Button>

                      <Button
                        onClick={handleDeleteAllChats}
                        variant="outline"
                        className="w-full border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Alle Chats löschen
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                    <div className="text-xs text-blue-200">
                      <p className="mb-1 font-medium">Sicherheit:</p>
                      <p>
                        Alle Chat-Daten werden nur lokal gespeichert. Export-Dateien enthalten
                        vollständige Konversationsverläufe - behandle sie entsprechend vertraulich.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PWA Install Section */}
              <div className="space-y-3">
                <h3 className="text-text-strong flex items-center gap-2 text-lg font-semibold">
                  <Smartphone className="h-5 w-5" />
                  App-Installation
                </h3>
                <p className="text-sm text-text-muted">
                  Installiere Disa AI als native App für bessere Performance und schnelleren
                  Zugriff.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        isInstalled
                          ? "bg-green-500"
                          : canInstall
                            ? "animate-pulse bg-blue-500"
                            : "bg-gray-500"
                      }`}
                    />
                    <span className="text-text-strong text-sm font-medium">
                      {isInstalled
                        ? "✅ App ist installiert"
                        : canInstall
                          ? "📱 Installation verfügbar"
                          : "❌ Installation nicht verfügbar"}
                    </span>
                  </div>

                  {canInstall && (
                    <Button
                      type="button"
                      onClick={handleInstallPWA}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white transition-transform hover:scale-105 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Jetzt als App installieren
                    </Button>
                  )}

                  {isInstalled && (
                    <div className="py-4 text-center">
                      <div className="mb-2 text-lg font-medium text-green-400">
                        🎉 App erfolgreich installiert!
                      </div>
                      <p className="text-sm text-text-muted">
                        Du kannst Disa AI jetzt direkt vom Home-Screen starten und wie eine native
                        App verwenden.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 text-xs text-text-muted">
                    <p>
                      <span className="font-medium">Vorteile:</span>
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li>• Schnellerer Start ohne Browser-UI</li>
                      <li>• Offline-Funktionalität</li>
                      <li>• Push-Benachrichtigungen möglich</li>
                      <li>• Bessere Performance</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Build Info */}
              <div className="space-y-3">
                <h3 className="text-text-strong flex items-center gap-2 text-lg font-semibold">
                  <Info className="h-5 w-5" />
                  Build Information
                </h3>
                <p className="text-sm text-text-muted">
                  Build-Version und Deployment-Informationen
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    {/* Build ID nur in Entwicklung anzeigen */}
                    {import.meta.env.DEV && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">Build ID:</span>
                        <span className="text-accent font-mono">{BUILD_ID}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Version:</span>
                      <span className="text-text-strong">v1.0.0</span>
                    </div>
                    {/* Environment nur in Entwicklung anzeigen */}
                    {import.meta.env.DEV && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">Environment:</span>
                        <span className="text-text-strong">
                          {import.meta.env.DEV ? "Development" : "Production"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="rounded bg-surface-subtle p-3 text-xs">
                    <p className="text-text-muted">
                      <span className="font-medium">Cache-Hinweis:</span> Bei Updates kann ein
                      harter Reload (Strg+Shift+R) erforderlich sein, um die neue Version zu laden.
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleHardReload}
                    variant="outline"
                    className="flex w-full items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M3 21v-5h5" />
                    </svg>
                    Seite vollständig neu laden
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
