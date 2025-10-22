import {
  Cpu,
  Download,
  FileText,
  Key,
  Menu,
  MessageSquare,
  Settings,
  Smartphone,
  Upload,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePWAInstall } from "../../hooks/usePWAInstall";
import { exportConversations, getConversationStats } from "../../lib/conversation-manager";
import { hapticFeedback } from "../../lib/touch/haptics";
import { useToasts } from "../ui/toast/ToastsProvider";

interface TopMenuDropdownProps {
  onOpenAdvancedSettings?: () => void;
}

export default function TopMenuDropdown({ onOpenAdvancedSettings }: TopMenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<"empty" | "present">("empty");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const toasts = useToasts();
  const { canInstall, installed: isInstalled, requestInstall: promptInstall } = usePWAInstall();

  // Check API key status on mount and when menu opens
  useEffect(() => {
    if (isOpen) {
      try {
        const storedKey = sessionStorage.getItem("openrouter-key") ?? "";
        setApiKeyStatus(storedKey.length > 0 ? "present" : "empty");
      } catch {
        setApiKeyStatus("empty");
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    hapticFeedback.tap();
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    void navigate(path);
    handleClose();
  };

  const handleApiKeySettings = () => {
    // Open API key in a simple prompt for quick access
    const currentKey = sessionStorage.getItem("openrouter-key") ?? "";
    const newKey = prompt("OpenRouter API-Schlüssel eingeben:", currentKey);

    if (newKey !== null) {
      try {
        const trimmedKey = newKey.trim();

        if (trimmedKey) {
          if (!trimmedKey.startsWith("sk-or-")) {
            toasts.push({
              kind: "error",
              title: "Ungültiger Schlüssel",
              message: "OpenRouter-Schlüssel beginnen mit 'sk-or-'",
            });
            return;
          }
          sessionStorage.setItem("openrouter-key", trimmedKey);
          setApiKeyStatus("present");
          toasts.push({
            kind: "success",
            title: "Schlüssel gespeichert",
            message: "API-Schlüssel wurde erfolgreich gespeichert.",
          });
        } else {
          sessionStorage.removeItem("openrouter-key");
          setApiKeyStatus("empty");
          toasts.push({
            kind: "success",
            title: "Schlüssel entfernt",
            message: "API-Schlüssel wurde gelöscht.",
          });
        }
      } catch {
        toasts.push({
          kind: "error",
          title: "Speichern fehlgeschlagen",
          message: "Der Schlüssel konnte nicht gesichert werden.",
        });
      }
    }
    handleClose();
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
    handleClose();
  };

  const handleImportChats = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          JSON.parse(content); // Parse to validate JSON format

          // Import logic would be handled here
          // For now, just show success message
          toasts.push({
            kind: "info",
            title: "Import vorbereitet",
            message: "Import-Funktionalität wird verarbeitet...",
          });
        } catch {
          toasts.push({
            kind: "error",
            title: "Import fehlgeschlagen",
            message: "Die Datei konnte nicht gelesen werden.",
          });
        }
      };
      reader.readAsText(file);
    };

    input.click();
    handleClose();
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
    handleClose();
  };

  const handleAdvancedSettings = () => {
    onOpenAdvancedSettings?.();
    handleClose();
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close menu when pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Get conversation stats for quick info
  const stats = getConversationStats();

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
        className="touch-target border-border bg-surface-1 text-text-0 hover:bg-surface-2 fixed right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border transition active:scale-95"
        style={{ top: `calc(var(--inset-t) + 16px)` }}
        data-no-zoom
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/20"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Dropdown Menu */}
          <div
            ref={menuRef}
            className="border-border fixed right-4 z-50 w-72 max-w-[90vw] rounded-xl border bg-surface-card shadow-xl"
            style={{ top: `calc(var(--inset-t) + 72px)` }}
            role="menu"
            aria-label="Hauptmenü"
          >
            <div className="p-1">
              {/* Header */}
              <div className="border-border border-b p-3">
                <h2 className="text-text-strong text-lg font-semibold">Disa AI</h2>
                <p className="text-xs text-text-muted">
                  {stats.totalConversations} Chats • {stats.totalMessages} Nachrichten
                </p>
              </div>

              {/* Quick Navigation */}
              <div className="p-2">
                <div className="mb-3">
                  <h3 className="text-text-subtle px-2 py-1 text-xs font-semibold uppercase tracking-wide">
                    Navigation
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigation("/chat")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-surface-subtle focus:bg-surface-subtle focus:outline-none"
                      role="menuitem"
                    >
                      <MessageSquare className="h-4 w-4 text-text-muted" />
                      <span className="text-text-strong text-sm">Chat</span>
                    </button>
                    <button
                      onClick={() => handleNavigation("/models")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-surface-subtle focus:bg-surface-subtle focus:outline-none"
                      role="menuitem"
                    >
                      <Cpu className="h-4 w-4 text-text-muted" />
                      <span className="text-text-strong text-sm">Modelle</span>
                    </button>
                    <button
                      onClick={() => handleNavigation("/roles")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-surface-subtle focus:bg-surface-subtle focus:outline-none"
                      role="menuitem"
                    >
                      <User className="h-4 w-4 text-text-muted" />
                      <span className="text-text-strong text-sm">Rollen</span>
                    </button>
                  </div>
                </div>

                {/* Quick Settings */}
                <div className="mb-3">
                  <h3 className="text-text-subtle px-2 py-1 text-xs font-semibold uppercase tracking-wide">
                    Schnellzugriff
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={handleApiKeySettings}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-surface-subtle focus:bg-surface-subtle focus:outline-none"
                      role="menuitem"
                    >
                      <Key className="h-4 w-4 text-text-muted" />
                      <div className="flex-1">
                        <span className="text-text-strong text-sm">API-Schlüssel</span>
                        <div className="mt-0.5 flex items-center gap-1">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${
                              apiKeyStatus === "present" ? "bg-green-500" : "bg-gray-500"
                            }`}
                          />
                          <span className="text-xs text-text-muted">
                            {apiKeyStatus === "present" ? "Gesetzt" : "Nicht gesetzt"}
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleExportChats}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-surface-subtle focus:bg-surface-subtle focus:outline-none"
                      role="menuitem"
                    >
                      <Download className="h-4 w-4 text-text-muted" />
                      <span className="text-text-strong text-sm">Chats exportieren</span>
                    </button>

                    <button
                      onClick={handleImportChats}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-surface-subtle focus:bg-surface-subtle focus:outline-none"
                      role="menuitem"
                    >
                      <Upload className="h-4 w-4 text-text-muted" />
                      <span className="text-text-strong text-sm">Chats importieren</span>
                    </button>

                    {canInstall && !isInstalled && (
                      <button
                        onClick={handleInstallPWA}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-surface-subtle focus:bg-surface-subtle focus:outline-none"
                        role="menuitem"
                      >
                        <Smartphone className="h-4 w-4 text-text-muted" />
                        <div className="flex-1">
                          <span className="text-text-strong text-sm">App installieren</span>
                          <div className="text-xs text-text-muted">Als native App nutzen</div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="mb-3">
                  <h3 className="text-text-subtle px-2 py-1 text-xs font-semibold uppercase tracking-wide">
                    Erweitert
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={handleAdvancedSettings}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-surface-subtle focus:bg-surface-subtle focus:outline-none"
                      role="menuitem"
                    >
                      <Settings className="h-4 w-4 text-text-muted" />
                      <span className="text-text-strong text-sm">Alle Einstellungen</span>
                    </button>
                  </div>
                </div>

                {/* Legal & Info */}
                <div className="border-border border-t pt-2">
                  <h3 className="text-text-subtle px-2 py-1 text-xs font-semibold uppercase tracking-wide">
                    Information
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigation("/impressum")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-surface-subtle focus:bg-surface-subtle focus:outline-none"
                      role="menuitem"
                    >
                      <FileText className="h-4 w-4 text-text-muted" />
                      <span className="text-text-strong text-sm">Impressum</span>
                    </button>
                    <button
                      onClick={() => handleNavigation("/datenschutz")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-surface-subtle focus:bg-surface-subtle focus:outline-none"
                      role="menuitem"
                    >
                      <FileText className="h-4 w-4 text-text-muted" />
                      <span className="text-text-strong text-sm">Datenschutz</span>
                    </button>
                  </div>
                </div>

                {/* App Info */}
                <div className="border-border mt-2 border-t pt-2">
                  <div className="px-2 py-1">
                    <div className="text-center text-xs text-text-muted">
                      Disa AI v1.0.0
                      {isInstalled && (
                        <div className="font-medium text-green-400">✓ Installiert</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
