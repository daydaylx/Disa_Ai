import * as React from "react";

import { getRoleById } from "../../config/roleStore";
import {
  getStyle,
  getTemplateId,
  getUseRoleStyle,
  setStyle,
  setTemplateId,
  setUseRoleStyle,
  type StyleKey,
} from "../../config/settings";
import { GlassButton } from "../glass/GlassButton";
import { GlassCard } from "../glass/GlassCard";
import { useToasts } from "../ui/Toast";

const QUICK_STYLES: Array<{ key: StyleKey; name: string; emoji: string }> = [
  { key: "neutral", name: "Neutral", emoji: "📝" },
  { key: "blunt_de", name: "Direkt", emoji: "🎯" },
  { key: "concise", name: "Kurz", emoji: "⚡" },
  { key: "friendly", name: "Freundlich", emoji: "😊" },
  { key: "creative_light", name: "Kreativ", emoji: "🎨" },
  { key: "technical_precise", name: "Technisch", emoji: "⚙️" },
];

interface QuickStylesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickStylesPanel = React.memo<QuickStylesPanelProps>(({ isOpen, onClose }) => {
  const [currentStyle, setCurrentStyle] = React.useState<StyleKey>(() => getStyle());
  const [currentRoleId, setCurrentRoleId] = React.useState<string | null>(() => getTemplateId());
  const [useRoleStyleEnabled, setUseRoleStyleEnabled] = React.useState(() => getUseRoleStyle());
  const toasts = useToasts();

  const currentRole = React.useMemo(() => {
    return currentRoleId ? getRoleById(currentRoleId) : null;
  }, [currentRoleId]);

  const handleStyleChange = React.useCallback(
    (style: StyleKey) => {
      setCurrentStyle(style);
      setStyle(style);
      toasts.push({
        kind: "success",
        title: "⚡ Stil geändert",
        message: `Auf "${QUICK_STYLES.find((s) => s.key === style)?.name}" gesetzt`,
      });
      onClose();
    },
    [toasts, onClose],
  );

  const clearRole = () => {
    setCurrentRoleId(null);
    setTemplateId(null);
    toasts.push({
      kind: "info",
      title: "🚫 Rolle entfernt",
      message: "Standard KI-Verhalten aktiv",
    });
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key >= "1" && e.key <= "6") {
        const index = parseInt(e.key) - 1;
        if (QUICK_STYLES[index]) {
          handleStyleChange(QUICK_STYLES[index].key);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleStyleChange]);

  const toggleUseRoleStyle = () => {
    const newValue = !useRoleStyleEnabled;
    setUseRoleStyleEnabled(newValue);
    setUseRoleStyle(newValue);
    toasts.push({
      kind: "info",
      title: newValue ? "🔗 Rollen-Stil aktiviert" : "🔗 Rollen-Stil deaktiviert",
      message: newValue ? "Rolle + Stil kombiniert" : "Nur Grundstil",
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="bg-black/20 fixed inset-0 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed z-50 mx-auto max-w-lg"
        style={{
          bottom: `max(80px, calc(env(safe-area-inset-bottom) + 80px))`,
          left: `max(16px, env(safe-area-inset-left))`,
          right: `max(16px, env(safe-area-inset-right))`,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-styles-title"
      >
        <GlassCard variant="elevated" className="space-y-4 p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 id="quick-styles-title" className="text-white font-semibold">
              Schnell-Anpassung
            </h3>
            <GlassButton variant="ghost" size="sm" onClick={onClose}>
              ✕
            </GlassButton>
          </div>

          {/* Current Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Stil:</span>
              <span className="text-cyan-400">
                {QUICK_STYLES.find((s) => s.key === currentStyle)?.name || currentStyle}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Rolle:</span>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">{currentRole?.name || "Keine"}</span>
                {currentRole && (
                  <GlassButton variant="ghost" size="sm" onClick={clearRole}>
                    ✕
                  </GlassButton>
                )}
              </div>
            </div>
          </div>

          {/* Quick Style Buttons */}
          <div>
            <h4 className="text-white mb-4 text-base font-semibold">Stil wechseln:</h4>
            <div className="lg:grid-cols-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {QUICK_STYLES.map((style, index) => {
                const isActive = currentStyle === style.key;
                return (
                  <GlassButton
                    key={style.key}
                    variant={isActive ? "accent" : "secondary"}
                    size="lg"
                    onClick={() => handleStyleChange(style.key)}
                    className="group relative flex h-auto flex-col items-center gap-2 p-4 transition-all duration-300 hover:scale-105"
                  >
                    <div
                      className={`rounded-lg p-2 transition-colors ${
                        isActive ? "bg-accent-500/20" : "bg-white/10 group-hover:bg-white/15"
                      }`}
                    >
                      <span className="text-lg">{style.emoji}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-white text-sm font-medium">{style.name}</span>
                      {isActive && (
                        <div className="mt-1">
                          <span className="text-accent-400 text-xs">✓ Aktiv</span>
                        </div>
                      )}
                    </div>
                    {/* Keyboard shortcut indicator */}
                    <div className="absolute right-2 top-2">
                      <span className="bg-black/30 text-gray-300 rounded px-1 text-xs">
                        {index + 1}
                      </span>
                    </div>
                  </GlassButton>
                );
              })}
            </div>
          </div>

          {/* Role Style Toggle */}
          {currentRole && (
            <div className="bg-white/5 space-y-3 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/20 rounded-lg p-2">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <span className="text-white text-sm font-semibold">Rollen-Stil</span>
                    <p className="text-gray-400 text-xs">Rolle mit Grundstil kombinieren</p>
                  </div>
                </div>
                <GlassButton
                  variant={useRoleStyleEnabled ? "success" : "ghost"}
                  size="md"
                  onClick={toggleUseRoleStyle}
                  className="px-4"
                >
                  {useRoleStyleEnabled ? "✓ An" : "Aus"}
                </GlassButton>
              </div>
              <div className="text-gray-400 text-xs">
                Aktuelle Rolle:{" "}
                <span className="text-cyan-400 font-medium">{currentRole.name}</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-white/10 flex gap-2 border-t pt-2">
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => {
                window.location.hash = "#/settings";
                onClose();
              }}
              className="flex-1"
            >
              Alle Einstellungen
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </>
  );
});

// Hook for managing quick styles panel
export function useQuickStylesPanel() {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
