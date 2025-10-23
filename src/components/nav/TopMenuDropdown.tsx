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
import { useEffect, useMemo, useRef, useState } from "react";
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
    // Redirect to the secure Advanced Settings Modal for API key management
    onOpenAdvancedSettings?.();
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
    // Redirect to Advanced Settings Modal for full import functionality
    onOpenAdvancedSettings?.();
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

  // Get conversation stats for quick info (memoized for performance)
  const stats = useMemo(() => getConversationStats(), []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        id="menu-button"
        aria-controls="menu-dropdown"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
        className="touch-target border-border bg-surface-1 text-text-0 hover:bg-surface-2 fixed right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border transition active:scale-95"
        style={{ top: `max(16px, calc(env(safe-area-inset-top, 0px) + 16px))` }}
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
          {/* WCAG AA compliant scrim overlay */}
          <div
            className="scrim-overlay fixed inset-0 z-40"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Optimized glass panel with no double-blur */}
          <div
            id="menu-dropdown"
            ref={menuRef}
            className="glass-panel fixed right-4 z-50 w-72 max-w-[90vw] rounded-xl"
            style={{ top: `max(72px, calc(env(safe-area-inset-top, 0px) + 72px))` }}
            role="menu"
            aria-labelledby="menu-button"
          >
            <div className="p-1">
              {/* Header - no additional backdrop-blur to prevent double transparency */}
              <div className="border-b border-[var(--glass-border)] p-3 bg-black/5">
                <h2 className="text-strong text-lg font-semibold">Disa AI</h2>
                <p className="text-xs text-muted">
                  {stats.totalConversations} Chats • {stats.totalMessages} Nachrichten
                </p>
              </div>

              {/* Quick Navigation */}
              <div className="p-2">
                <div className="mb-3">
                  <h3 className="text-strong px-2 py-1 text-xs font-semibold uppercase tracking-wider">
                    Navigation
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigation("/chat")}
                      className="touch-target-preferred flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring truncate"
                      role="menuitem"
                    >
                      <MessageSquare className="h-4 w-4 text-[var(--fg)]" />
                      <span className="text-standard text-sm truncate">Chat</span>
                    </button>
                    <button
                      onClick={() => handleNavigation("/models")}
                      className="touch-target-preferred flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring truncate"
                      role="menuitem"
                    >
                      <Cpu className="h-4 w-4 text-[var(--fg)]" />
                      <span className="text-standard text-sm truncate">Modelle</span>
                    </button>
                    <button
                      onClick={() => handleNavigation("/roles")}
                      className="touch-target-preferred flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring truncate"
                      role="menuitem"
                    >
                      <User className="h-4 w-4 text-[var(--fg)]" />
                      <span className="text-standard text-sm truncate">Rollen</span>
                    </button>
                  </div>
                </div>

                {/* Quick Settings */}
                <div className="mb-3">
                  <h3 className="text-strong px-2 py-1 text-xs font-semibold uppercase tracking-wider">
                    Schnellzugriff
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={handleApiKeySettings}
                      className="touch-target-preferred flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring truncate"
                      role="menuitem"
                    >
                      <Key className="h-4 w-4 text-[var(--fg)]" />
                      <div className="flex-1">
                        <span className="text-standard text-sm truncate">API-Schlüssel</span>
                        <div className="mt-0.5 flex items-center gap-1">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${
                              apiKeyStatus === "present" ? "bg-green-500" : "bg-gray-500"
                            }`}
                          />
                          <span className="text-xs text-muted truncate">
                            {apiKeyStatus === "present" ? "Gesetzt" : "Nicht gesetzt"}
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleExportChats}
                      className="touch-target-preferred flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring truncate"
                      role="menuitem"
                    >
                      <Download className="h-4 w-4 text-[var(--fg)]" />
                      <span className="text-standard text-sm truncate">Chats exportieren</span>
                    </button>

                    <button
                      onClick={handleImportChats}
                      className="touch-target-preferred flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring truncate"
                      role="menuitem"
                    >
                      <Upload className="h-4 w-4 text-[var(--fg)]" />
                      <span className="text-standard text-sm truncate">Chats importieren</span>
                    </button>

                    {canInstall && !isInstalled && (
                      <button
                        onClick={handleInstallPWA}
                        className="touch-target-preferred flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring truncate"
                        role="menuitem"
                      >
                        <Smartphone className="h-4 w-4 text-[var(--fg)]" />
                        <div className="flex-1">
                          <span className="text-standard text-sm truncate">App installieren</span>
                          <div className="text-xs text-muted truncate">Als native App nutzen</div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="mb-3">
                  <h3 className="text-strong px-2 py-1 text-xs font-semibold uppercase tracking-wider">
                    Erweitert
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={handleAdvancedSettings}
                      className="touch-target-preferred flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring truncate"
                      role="menuitem"
                    >
                      <Settings className="h-4 w-4 text-[var(--fg)]" />
                      <span className="text-standard text-sm truncate">Alle Einstellungen</span>
                    </button>
                  </div>
                </div>

                {/* Legal & Info */}
                <div className="border-t border-[var(--glass-border)] pt-2">
                  <h3 className="text-strong px-2 py-1 text-xs font-semibold uppercase tracking-wider">
                    Information
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigation("/impressum")}
                      className="touch-target-preferred flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring truncate"
                      role="menuitem"
                    >
                      <FileText className="h-4 w-4 text-[var(--fg)]" />
                      <span className="text-standard text-sm truncate">Impressum</span>
                    </button>
                    <button
                      onClick={() => handleNavigation("/datenschutz")}
                      className="touch-target-preferred flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring truncate"
                      role="menuitem"
                    >
                      <FileText className="h-4 w-4 text-[var(--fg)]" />
                      <span className="text-standard text-sm truncate">Datenschutz</span>
                    </button>
                  </div>
                </div>

                {/* App Info */}
                <div className="mt-2 border-t border-[var(--glass-border)] pt-2">
                  <div className="px-2 py-1">
                    <div className="text-center text-xs text-muted">
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
