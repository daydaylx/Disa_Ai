import * as React from "react";

import {
  getNSFW,
  getStyle,
  getUseRoleStyle,
  setNSFW,
  setStyle,
  setUseRoleStyle,
  type StyleKey,
} from "../../config/settings";
import { GlassButton } from "../glass/GlassButton";
import { GlassCard } from "../glass/GlassCard";
import Switch from "../Switch";
import { useToasts } from "../ui/Toast";

const STYLE_LABELS: Record<StyleKey, { name: string; description: string; emoji: string }> = {
  neutral: { name: "Neutral", description: "Sachlich und strukturiert", emoji: "📝" },
  blunt_de: { name: "Direkt", description: "Kritisch und klar, ohne Schönfärberei", emoji: "🎯" },
  concise: { name: "Prägnant", description: "Maximal 5 Sätze oder 7 Punkte", emoji: "⚡" },
  friendly: { name: "Freundlich", description: "Höflicher Ton, trotzdem präzise", emoji: "😊" },
  creative_light: {
    name: "Kreativ",
    description: "Bildhafte Metaphern und Beispiele",
    emoji: "🎨",
  },
  minimal: { name: "Minimal", description: "Nur die Antwort, kein Meta-Text", emoji: "🔹" },
  technical_precise: { name: "Technisch", description: "Präzise mit Edge-Cases", emoji: "⚙️" },
  socratic: { name: "Sokratisch", description: "Arbeitet mit gezielten Rückfragen", emoji: "❓" },
  bullet: { name: "Bullet-Points", description: "Primär in Aufzählungen", emoji: "📋" },
  step_by_step: {
    name: "Schritt-für-Schritt",
    description: "Nummerierte Anleitungen",
    emoji: "📈",
  },
  formal_de: { name: "Formell", description: "Sie-Form, höflich und direkt", emoji: "🎩" },
  casual_de: { name: "Locker", description: "Du-Form, kurze Sätze", emoji: "👋" },
  detailed: { name: "Detailliert", description: "Ausführlich mit Kontext", emoji: "📚" },
  no_taboos: { name: "Unzensiert", description: "Direkt ohne Euphemismen", emoji: "🔓" },
};

export function StyleSettings() {
  const [currentStyle, setCurrentStyle] = React.useState<StyleKey>(() => getStyle());
  const [nsfwEnabled, setNsfwEnabled] = React.useState(() => getNSFW());
  const [useRoleStyleEnabled, setUseRoleStyleEnabled] = React.useState(() => getUseRoleStyle());
  const toasts = useToasts();

  const handleStyleChange = (style: StyleKey) => {
    setCurrentStyle(style);
    setStyle(style);
    toasts.push({
      kind: "success",
      title: "Stil geändert",
      message: `Antwortstil auf "${STYLE_LABELS[style].name}" gesetzt.`,
    });
  };

  const handleNsfwToggle = (enabled: boolean) => {
    setNsfwEnabled(enabled);
    setNSFW(enabled);
    toasts.push({
      kind: "info",
      title: enabled ? "NSFW aktiviert" : "NSFW deaktiviert",
      message: enabled ? "Inhaltsfilterung deaktiviert" : "Inhaltsfilterung aktiviert",
    });
  };

  const handleUseRoleStyleToggle = (enabled: boolean) => {
    setUseRoleStyleEnabled(enabled);
    setUseRoleStyle(enabled);
    toasts.push({
      kind: "info",
      title: enabled ? "Rollen-Stil aktiviert" : "Rollen-Stil deaktiviert",
      message: enabled
        ? "Rollenstil wird mit Grundstil kombiniert"
        : "Nur Grundstil wird verwendet",
    });
  };

  const resetToDefaults = () => {
    const defaultStyle: StyleKey = "blunt_de";
    setCurrentStyle(defaultStyle);
    setStyle(defaultStyle);
    setNsfwEnabled(false);
    setNSFW(false);
    setUseRoleStyleEnabled(true);
    setUseRoleStyle(true);

    toasts.push({
      kind: "success",
      title: "Stil zurückgesetzt",
      message: "Alle Stileinstellungen auf Standard zurückgesetzt.",
    });
  };

  // Group styles by category
  const basicStyles = React.useMemo(() => {
    return ["neutral", "blunt_de", "concise", "friendly"] as StyleKey[];
  }, []);

  const creativeStyles = React.useMemo(() => {
    return ["creative_light", "minimal", "detailed"] as StyleKey[];
  }, []);

  const technicalStyles = React.useMemo(() => {
    return ["technical_precise", "socratic", "bullet", "step_by_step"] as StyleKey[];
  }, []);

  const personalityStyles = React.useMemo(() => {
    return ["formal_de", "casual_de", "no_taboos"] as StyleKey[];
  }, []);

  const renderStyleGroup = (title: string, emoji: string, styles: StyleKey[]) => (
    <div key={title} className="space-y-3">
      <h5 className="text-white flex items-center gap-2 font-medium">
        <span>{emoji}</span>
        {title}
      </h5>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((style) => {
          const styleData = STYLE_LABELS[style];
          const isActive = currentStyle === style;
          return (
            <GlassButton
              key={style}
              variant={isActive ? "primary" : "secondary"}
              size="sm"
              onClick={() => handleStyleChange(style)}
              className="flex h-auto flex-col items-start gap-1 p-3 text-left"
            >
              <div className="flex w-full items-center gap-2">
                <span className="text-sm">{styleData.emoji}</span>
                <span className="flex-1 text-xs font-medium">{styleData.name}</span>
                {isActive && <span className="text-cyan-400 text-xs">✓</span>}
              </div>
              <span className="line-clamp-2 text-xs opacity-75">{styleData.description}</span>
            </GlassButton>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Current Style Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold">Antwortstil</h4>
            <p className="text-gray-400 text-sm">
              Aktuell: {STYLE_LABELS[currentStyle].name} {STYLE_LABELS[currentStyle].emoji}
            </p>
          </div>
        </div>

        <GlassCard variant="subtle" className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{STYLE_LABELS[currentStyle].emoji}</span>
            <div>
              <div className="text-white font-medium">{STYLE_LABELS[currentStyle].name}</div>
              <div className="text-gray-400 text-sm">{STYLE_LABELS[currentStyle].description}</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Style Groups */}
      <div className="space-y-6">
        {renderStyleGroup("Grundstile", "📄", basicStyles)}
        {renderStyleGroup("Kreative Stile", "🎨", creativeStyles)}
        {renderStyleGroup("Technische Stile", "⚙️", technicalStyles)}
        {renderStyleGroup("Persönlichkeit", "👤", personalityStyles)}
      </div>

      {/* Style Options */}
      <div className="space-y-4">
        <h4 className="text-white font-semibold">Stil-Optionen</h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-white font-medium">NSFW-Inhalte</h5>
              <p className="text-gray-400 text-sm">Erlaubt explizite und unzensierte Antworten</p>
            </div>
            <Switch checked={nsfwEnabled} onChange={handleNsfwToggle} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-white font-medium">Rollen-Stil kombinieren</h5>
              <p className="text-gray-400 text-sm">Kombiniert Grundstil mit ausgewählter Rolle</p>
            </div>
            <Switch checked={useRoleStyleEnabled} onChange={handleUseRoleStyleToggle} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-semibold">Aktionen</h4>
        </div>

        <div className="flex gap-3">
          <GlassButton variant="ghost" size="sm" onClick={resetToDefaults} className="flex-1">
            Standard wiederherstellen
          </GlassButton>
        </div>

        {/* Live Style Info */}
        <GlassCard variant="subtle" className="p-3">
          <div className="text-gray-400 space-y-1 text-xs">
            <div>
              Aktueller Stil: <span className="text-cyan-400">{currentStyle}</span>
            </div>
            <div>
              NSFW:{" "}
              <span className="text-cyan-400">{nsfwEnabled ? "Aktiviert" : "Deaktiviert"}</span>
            </div>
            <div>
              Rollen-Stil:{" "}
              <span className="text-cyan-400">{useRoleStyleEnabled ? "An" : "Aus"}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
