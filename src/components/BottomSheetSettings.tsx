import { ChevronDown, Key, MessageSquare, Shield, Smartphone, Trash2, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useMemory } from "../hooks/useMemory";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { useSettings } from "../hooks/useSettings";
import {
  cleanupOldConversations,
  deleteConversation,
  exportConversations,
  getAllConversations,
  getConversationStats,
} from "../lib/conversation-manager";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/Switch";
import { useToasts } from "./ui/toast/ToastsProvider";

// Define sections for the settings
type SettingsSection = "api" | "filter" | "memory" | "chat" | "pwa" | "info";

// Function to get saved state from localStorage
const getSavedExpandedSections = (): SettingsSection[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("disa-settings-expanded-sections");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Function to save state to localStorage
const saveExpandedSections = (sections: SettingsSection[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("disa-settings-expanded-sections", JSON.stringify(sections));
  } catch {
    // Fail silently if localStorage is not available
  }
};

interface BottomSheetSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const BottomSheetSettings: React.FC<BottomSheetSettingsProps> = ({ isOpen, onClose }) => {
  const [activeSections, setActiveSections] = useState<SettingsSection[]>([]);

  // Load saved state on mount
  useEffect(() => {
    if (isOpen) {
      const savedSections = getSavedExpandedSections();
      setActiveSections(savedSections);
    }
  }, [isOpen]);
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
  React.useEffect(() => {
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

  // Toggle a section - if it's already open, close it; otherwise open it
  const toggleSection = (section: SettingsSection) => {
    const newActiveSections = activeSections.includes(section)
      ? activeSections.filter((s) => s !== section)
      : [...activeSections, section];

    setActiveSections(newActiveSections);
    saveExpandedSections(newActiveSections);
  };

  // Get chat statistics
  const chatStats = getConversationStats();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      {/* Scrim overlay */}
      <div className="scrim-overlay absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Bottom Sheet Container */}
      <div className="glass-panel relative mt-6 w-[min(92vw,680px)] max-h-[85dvh] overflow-y-auto rounded-2xl flex flex-col">
        <div className="flex flex-1 flex-col min-h-0">
          {/* Header - no additional backdrop-blur to prevent double transparency */}
          <div className="border-b border-[var(--glass-border)] flex flex-shrink-0 items-center justify-between p-4 bg-black/5">
            <h2 id="settings-title" className="text-text-strong text-lg font-semibold">
              Alle Einstellungen
            </h2>
            <button
              onClick={onClose}
              className="touch-target-preferred rounded-lg p-2 text-text-muted hover:text-text-strong transition focus-ring"
              aria-label="Einstellungen schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* TOC / Tab Navigation */}
          <div className="flex overflow-x-auto border-b border-[var(--glass-border)] bg-[var(--glass-surface)] bg-opacity-70 backdrop-blur-lg p-2">
            <button
              onClick={() => toggleSection("api")}
              className={`touch-target-preferred flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm rounded-full mr-2 min-h-[40px] min-w-[100px] text-center ${
                activeSections.includes("api")
                  ? "bg-[var(--brand-primary)] text-[var(--text-on-brand)]"
                  : "bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--surface-raised)]"
              }`}
              aria-expanded={activeSections.includes("api")}
            >
              <Key className="h-4 w-4" />
              <span>API-Schlüssel</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  activeSections.includes("api") ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              onClick={() => toggleSection("filter")}
              className={`touch-target-preferred flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm rounded-full mr-2 min-h-[40px] min-w-[100px] text-center ${
                activeSections.includes("filter")
                  ? "bg-[var(--brand-primary)] text-[var(--text-on-brand)]"
                  : "bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--surface-raised)]"
              }`}
              aria-expanded={activeSections.includes("filter")}
            >
              <Shield className="h-4 w-4" />
              <span>Inhaltsfilter</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  activeSections.includes("filter") ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              onClick={() => toggleSection("memory")}
              className={`touch-target-preferred flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm rounded-full mr-2 min-h-[40px] min-w-[100px] text-center ${
                activeSections.includes("memory")
                  ? "bg-[var(--brand-primary)] text-[var(--text-on-brand)]"
                  : "bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--surface-raised)]"
              }`}
              aria-expanded={activeSections.includes("memory")}
            >
              <User className="h-4 w-4" />
              <span>Gedächtnis</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  activeSections.includes("memory") ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              onClick={() => toggleSection("chat")}
              className={`touch-target-preferred flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm rounded-full mr-2 min-h-[40px] min-w-[100px] text-center ${
                activeSections.includes("chat")
                  ? "bg-[var(--brand-primary)] text-[var(--text-on-brand)]"
                  : "bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--surface-raised)]"
              }`}
              aria-expanded={activeSections.includes("chat")}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat-Verwaltung</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  activeSections.includes("chat") ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              onClick={() => toggleSection("pwa")}
              className={`touch-target-preferred flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm rounded-full mr-2 min-h-[40px] min-w-[100px] text-center ${
                activeSections.includes("pwa")
                  ? "bg-[var(--brand-primary)] text-[var(--text-on-brand)]"
                  : "bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--surface-raised)]"
              }`}
              aria-expanded={activeSections.includes("pwa")}
            >
              <Smartphone className="h-4 w-4" />
              <span>App-Installation</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  activeSections.includes("pwa") ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Settings Content - Scrollable */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* API Key Section - Accordion */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  activeSections.includes("api") ? "block" : "hidden"
                }`}
              >
                <div className="space-y-3">
                  <h3 className="text-text-strong flex items-center gap-2 text-lg font-semibold">
                    <Key className="h-5 w-5" />
                    API-Schlüssel
                  </h3>
                  <p className="text-sm text-text-muted">
                    Wird nur in der aktuellen Session gespeichert. Nie an unsere Server übertragen.
                  </p>

                  <div className="space-y-2">
                    <Label
                      htmlFor="apiKey"
                      className="text-text-strong font-semibold tracking-wider text-sm"
                    >
                      API-Schlüssel
                    </Label>
                    <div className="relative">
                      <Input
                        id="apiKey"
                        type={showKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(event) => setApiKey(event.target.value)}
                        placeholder="sk-or-..."
                        className="bg-[var(--glass-surface)] border-[var(--glass-border)] text-[var(--fg)] placeholder:text-[var(--fg-muted)] pr-10 font-mono text-base"
                        style={{ backdropFilter: "var(--glass-blur-subtle)" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        aria-label={showKey ? "API-Schlüssel ausblenden" : "API-Schlüssel anzeigen"}
                        className="touch-target bg-[var(--hover-overlay)] focus-ring hover:text-[var(--fg-strong)] absolute right-2 top-1/2 grid -translate-y-1/2 place-items-center rounded-full text-[var(--fg)] transition-all duration-180 ease-out motion-reduce:transition-none"
                      >
                        {showKey ? <X className="h-4 w-4" /> : <Key className="h-4 w-4" />}
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

                  <Button
                    type="button"
                    onClick={handleSaveKey}
                    className="touch-target-preferred bg-[var(--glass-surface)] border border-[var(--glass-border)] text-[var(--fg)] w-full hover:bg-[var(--hover-overlay)] transition-all duration-180 ease-out motion-reduce:transition-none text-base"
                  >
                    Schlüssel speichern
                  </Button>

                  <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                    <div className="text-sm text-blue-200">
                      <p className="mb-1 font-medium">Datenschutz:</p>
                      <p>
                        Dein Schlüssel wird nur in der Browser-Session gespeichert und automatisch
                        beim Schließen gelöscht.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Filter Section - Accordion */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  activeSections.includes("filter") ? "block" : "hidden"
                }`}
              >
                <div className="space-y-3">
                  <h3 className="text-text-strong flex items-center gap-2 text-lg font-semibold">
                    <Shield className="h-5 w-5" />
                    Inhaltsfilter
                  </h3>
                  <p className="text-sm text-text-muted">
                    Verwalte die Sichtbarkeit verschiedener Inhaltsarten.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="nsfw-toggle" className="text-text-strong text-base">
                          18+ / NSFW-Content anzeigen
                        </Label>
                        <p id="nsfw-description" className="text-sm text-text-muted">
                          Ermöglicht die Anzeige von Adult-Content-Personas und entsprechenden
                          Rollen.
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
                      <div className="text-sm text-orange-200">
                        <p className="mb-1 font-medium">Hinweis:</p>
                        <p>
                          Diese Einstellung wird nur lokal in deinem Browser gespeichert. 18+
                          Inhalte werden standardmäßig ausgeblendet.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Memory Settings Section - Accordion */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  activeSections.includes("memory") ? "block" : "hidden"
                }`}
              >
                <div className="space-y-3">
                  <h3 className="text-text-strong flex items-center gap-2 text-lg font-semibold">
                    <User className="h-5 w-5" />
                    Gedächtnis
                  </h3>
                  <p className="text-sm text-text-muted">
                    Speichere Chat-Verläufe und persönliche Informationen für zukünftige Gespräche.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="memory-toggle" className="text-text-strong text-base">
                          Gedächtnis aktivieren
                        </Label>
                        <p id="memory-description" className="text-sm text-text-muted">
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
                        <div className="border-t border-[var(--glass-border)] space-y-3 pt-4">
                          <Label htmlFor="memory-name" className="text-text-strong text-base">
                            Persönliche Informationen
                          </Label>
                          <div className="space-y-2">
                            <Input
                              id="memory-name"
                              placeholder="Dein Name (optional)"
                              value={globalMemory?.name || ""}
                              onChange={(e) => updateGlobalMemory({ name: e.target.value })}
                              className="bg-[var(--glass-surface)] border-[var(--glass-border)] text-[var(--fg)] placeholder:text-[var(--fg-muted)] text-base"
                              aria-label="Dein Name für persönliche Informationen"
                              style={{ backdropFilter: "var(--glass-blur-subtle)" }}
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
                              className="bg-[var(--glass-surface)] border-[var(--glass-border)] text-[var(--fg)] placeholder:text-[var(--fg-muted)] text-base"
                              aria-label="Deine Hobbys und Interessen"
                              style={{ backdropFilter: "var(--glass-blur-subtle)" }}
                            />
                            <Input
                              id="memory-background"
                              placeholder="Hintergrund, Beruf (optional)"
                              value={globalMemory?.background || ""}
                              onChange={(e) => updateGlobalMemory({ background: e.target.value })}
                              className="bg-[var(--glass-surface)] border-[var(--glass-border)] text-[var(--fg)] placeholder:text-[var(--fg-muted)] text-base"
                              aria-label="Dein beruflicher Hintergrund"
                              style={{ backdropFilter: "var(--glass-blur-subtle)" }}
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
                            className="touch-target-preferred w-full border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 text-base"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Alle Erinnerungen löschen
                          </Button>
                        </div>
                      </>
                    )}

                    <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                      <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                      <div className="text-sm text-blue-200">
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
              </div>

              {/* Chat Management Section - Accordion */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  activeSections.includes("chat") ? "block" : "hidden"
                }`}
              >
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
                      <Label className="text-text-strong text-base">Statistiken</Label>
                      <div className="grid grid-cols-2 gap-4 text-base">
                        <div className="space-y-1">
                          <span className="text-text-muted">Konversationen:</span>
                          <div className="text-text-strong font-medium">
                            {chatStats.totalConversations}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-text-muted">Nachrichten:</span>
                          <div className="text-text-strong font-medium">
                            {chatStats.totalMessages}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-text-muted">Ø pro Chat:</span>
                          <div className="text-text-strong font-medium">
                            {chatStats.averageMessagesPerConversation}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-text-muted">Verwendete Modelle:</span>
                          <div className="text-text-strong font-medium">
                            {chatStats.modelsUsed.length}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Export/Import Actions */}
                    <div className="border-border space-y-3 border-t pt-4">
                      <Label className="text-text-strong text-base">Import & Export</Label>
                      <div className="space-y-3">
                        <Button
                          onClick={handleExportChats}
                          variant="outline"
                          className="touch-target-preferred w-full border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-base"
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
                            className="mr-2 h-4 w-4"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                          </svg>
                          Konversationen exportieren
                        </Button>
                      </div>
                    </div>

                    {/* Cleanup Actions */}
                    <div className="border-border space-y-3 border-t pt-4">
                      <Label className="text-text-strong text-base">Aufräumen</Label>
                      <div className="space-y-2">
                        <Button
                          onClick={handleCleanupOldChats}
                          variant="outline"
                          className="touch-target-preferred w-full border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 text-base"
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
                            className="mr-2 h-4 w-4"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                          Alte Chats löschen (30+ Tage)
                        </Button>

                        <Button
                          onClick={handleDeleteAllChats}
                          variant="outline"
                          className="touch-target-preferred w-full border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 text-base"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Alle Chats löschen
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                      <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                      <div className="text-sm text-blue-200">
                        <p className="mb-1 font-medium">Sicherheit:</p>
                        <p>
                          Alle Chat-Daten werden nur lokal gespeichert. Export-Dateien enthalten
                          vollständige Konversationsverläufe - behandle sie entsprechend
                          vertraulich.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PWA Install Section - Accordion */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  activeSections.includes("pwa") ? "block" : "hidden"
                }`}
              >
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
                      <span className="text-text-strong text-base font-medium">
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
                        className="touch-target-preferred w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white transition-transform hover:scale-105 hover:from-blue-600 hover:to-purple-600 text-base"
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
                          className="mr-2 h-4 w-4"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
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

                    <div className="space-y-2 text-sm text-text-muted">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheetSettings;
