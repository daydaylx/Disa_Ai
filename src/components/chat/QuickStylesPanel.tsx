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
            <h4 className="text-white mb-2 text-sm font-medium">Stil wechseln:</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {QUICK_STYLES.map((style) => {
                const isActive = currentStyle === style.key;
                return (
                  <GlassButton
                    key={style.key}
                    variant={isActive ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleStyleChange(style.key)}
                    className="flex h-auto flex-col items-center gap-1 p-2"
                  >
                    <span className="text-sm">{style.emoji}</span>
                    <span className="text-xs">{style.name}</span>
                  </GlassButton>
                );
              })}
            </div>
          </div>

          {/* Role Style Toggle */}
          {currentRole && (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white text-sm font-medium">Rollen-Stil</span>
                <p className="text-gray-400 text-xs">Rolle mit Grundstil kombinieren</p>
              </div>
              <GlassButton
                variant={useRoleStyleEnabled ? "primary" : "ghost"}
                size="sm"
                onClick={toggleUseRoleStyle}
              >
                {useRoleStyleEnabled ? "An" : "Aus"}
              </GlassButton>
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
