import {
  ChevronDown,
  Cpu,
  FileText,
  Key,
  Keyboard,
  Menu,
  MessageSquare,
  Palette,
  Settings,
  SlidersHorizontal,
  Smartphone,
  Upload,
  User,
  X,
} from "lucide-react";
import type { ComponentType } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePWAInstall } from "../../hooks/usePWAInstall";
import { getConversationStats } from "../../lib/conversation-manager";
import { readApiKey } from "../../lib/openrouter/key";
import { hapticFeedback } from "../../lib/touch/haptics";
import { useToasts } from "../ui/toast/ToastsProvider";

interface TopMenuDropdownProps {
  onOpenAdvancedSettings?: () => void;
}

interface SettingsMenuItem {
  id: string;
  label: string;
  description?: string;
  icon: ComponentType<{ className?: string }>;
  action: () => void;
  meta?: string;
  metaClassName?: string;
}

export default function TopMenuDropdown({ onOpenAdvancedSettings }: TopMenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
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
        const storedKey = readApiKey();
        setApiKeyStatus(storedKey ? "present" : "empty");
      } catch {
        setApiKeyStatus("empty");
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    hapticFeedback.tap();
    setIsOpen((prev) => !prev);
    setIsSettingsMenuOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSettingsMenuOpen(false);
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

  const toggleSettingsMenu = () => {
    hapticFeedback.tap();
    setIsSettingsMenuOpen((prev) => !prev);
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

  const settingsMenuItems: SettingsMenuItem[] = [
    {
      id: "general",
      label: "Allgemein",
      description: "Übersicht & Grundeinstellungen",
      icon: SlidersHorizontal,
      action: () => handleNavigation("/settings"),
    },
    {
      id: "appearance",
      label: "Darstellung",
      description: "Theme, Kontrast & Bewegung festlegen",
      icon: Palette,
      action: () => handleNavigation("/settings/appearance"),
    },
    {
      id: "shortcuts",
      label: "Tastaturkürzel",
      description: "Gesten & Shortcuts konfigurieren",
      icon: Keyboard,
      action: () => handleNavigation("/settings#settings-shortcuts"),
    },
    {
      id: "api",
      label: "API-Schlüssel",
      description: "OpenRouter-Schlüssel verwalten",
      icon: Key,
      action: handleApiKeySettings,
      meta: apiKeyStatus === "present" ? "Gesetzt" : "Nicht gesetzt",
      metaClassName: apiKeyStatus === "present" ? "text-green-500" : "text-muted",
    },
    {
      id: "data",
      label: "Import & Export",
      description: "Konversationen sichern oder wiederherstellen",
      icon: Upload,
      action: () => handleNavigation("/settings/data"),
    },
    {
      id: "advanced",
      label: "Alle Einstellungen",
      description: "Erweiterte Optionen und Spezialfunktionen",
      icon: Settings,
      action: handleAdvancedSettings,
    },
  ];

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

                {/* Settings Submenu */}
                <div className="mb-3">
                  <h3 className="text-strong px-2 py-1 text-xs font-semibold uppercase tracking-wider">
                    Einstellungen
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={toggleSettingsMenu}
                      className="touch-target-preferred flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring"
                      role="menuitem"
                      aria-expanded={isSettingsMenuOpen}
                      aria-controls="settings-submenu"
                    >
                      <Settings className="h-4 w-4 text-[var(--fg)]" aria-hidden="true" />
                      <div className="flex flex-1 flex-col text-left">
                        <span className="text-standard text-sm font-medium">Einstellungen</span>
                        <span className="text-xs text-muted">Alle Optionen an einem Ort</span>
                      </div>
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-4 w-4 text-muted transition-transform ${
                          isSettingsMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isSettingsMenuOpen && (
                      <div
                        id="settings-submenu"
                        className="space-y-1 rounded-lg border border-[var(--glass-border)] bg-black/5 px-2 py-2"
                        role="group"
                        aria-label="Einstellungen Untermenü"
                      >
                        {settingsMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={item.action}
                              className="touch-target-preferred flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring"
                              role="menuitem"
                            >
                              <Icon className="h-4 w-4 text-[var(--fg)]" aria-hidden="true" />
                              <div className="flex flex-1 flex-col">
                                <span className="text-standard text-sm font-medium">
                                  {item.label}
                                </span>
                                {item.description ? (
                                  <span className="text-xs text-muted">{item.description}</span>
                                ) : null}
                                {item.meta ? (
                                  <span
                                    className={`text-xs ${
                                      item.metaClassName ? item.metaClassName : "text-muted"
                                    }`}
                                  >
                                    {item.meta}
                                  </span>
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* App Aktionen */}
                {canInstall && !isInstalled && (
                  <div className="mb-3">
                    <h3 className="text-strong px-2 py-1 text-xs font-semibold uppercase tracking-wider">
                      App
                    </h3>
                    <div className="space-y-1">
                      <button
                        onClick={handleInstallPWA}
                        className="touch-target-preferred flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left leading-relaxed transition-all duration-180 ease-out motion-reduce:transition-none hover-state focus-ring"
                        role="menuitem"
                      >
                        <Smartphone className="h-4 w-4 text-[var(--fg)]" aria-hidden="true" />
                        <div className="flex flex-1 flex-col text-left">
                          <span className="text-standard text-sm font-medium">
                            App installieren
                          </span>
                          <span className="text-xs text-muted">Als native App nutzen</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

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
