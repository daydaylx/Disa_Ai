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

const STYLE_LABELS: Record<StyleKey, { name: string; description: string; category: string }> = {
  neutral: { name: "Neutral", description: "Sachlich und strukturiert", category: "basic" },
  blunt_de: {
    name: "Direkt",
    description: "Kritisch und klar, ohne Schönfärberei",
    category: "basic",
  },
  concise: { name: "Prägnant", description: "Maximal 5 Sätze oder 7 Punkte", category: "basic" },
  friendly: {
    name: "Freundlich",
    description: "Höflicher Ton, trotzdem präzise",
    category: "basic",
  },
  creative_light: {
    name: "Kreativ",
    description: "Bildhafte Metaphern und Beispiele",
    category: "creative",
  },
  minimal: {
    name: "Minimal",
    description: "Nur die Antwort, kein Meta-Text",
    category: "creative",
  },
  technical_precise: {
    name: "Technisch",
    description: "Präzise mit Edge-Cases",
    category: "technical",
  },
  socratic: {
    name: "Sokratisch",
    description: "Arbeitet mit gezielten Rückfragen",
    category: "technical",
  },
  bullet: { name: "Bullet-Points", description: "Primär in Aufzählungen", category: "technical" },
  step_by_step: {
    name: "Schritt-für-Schritt",
    description: "Nummerierte Anleitungen",
    category: "technical",
  },
  formal_de: {
    name: "Formell",
    description: "Sie-Form, höflich und direkt",
    category: "personality",
  },
  casual_de: { name: "Locker", description: "Du-Form, kurze Sätze", category: "personality" },
  detailed: { name: "Detailliert", description: "Ausführlich mit Kontext", category: "creative" },
  no_taboos: {
    name: "Unzensiert",
    description: "Direkt ohne Euphemismen",
    category: "personality",
  },
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
      title: "Style Changed",
      message: `Response style set to "${STYLE_LABELS[style].name}".`,
    });
  };

  const handleNsfwToggle = (enabled: boolean) => {
    setNsfwEnabled(enabled);
    setNSFW(enabled);
    toasts.push({
      kind: "info",
      title: enabled ? "NSFW Content Enabled" : "NSFW Content Disabled",
      message: enabled ? "Content filtering disabled" : "Content filtering enabled",
    });
  };

  const handleUseRoleStyleToggle = (enabled: boolean) => {
    setUseRoleStyleEnabled(enabled);
    setUseRoleStyle(enabled);
    toasts.push({
      kind: "info",
      title: enabled ? "Role Style Enabled" : "Role Style Disabled",
      message: enabled
        ? "Role style will be combined with base style"
        : "Only base style will be used",
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
      title: "Settings Reset",
      message: "All style settings have been reset to default.",
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

  const renderStyleGroup = (title: string, styles: StyleKey[]) => (
    <div key={title} className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 p-2">
          <div className="h-3 w-3 rounded-sm bg-white/40"></div>
        </div>
        <div className="flex-1">
          <h5 className="text-lg font-semibold text-white">{title}</h5>
          <p className="text-sm text-gray-400">{styles.length} styles available</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {styles.map((style) => {
          const styleData = STYLE_LABELS[style];
          const isActive = currentStyle === style;
          return (
            <GlassButton
              key={style}
              variant={isActive ? "accent" : "secondary"}
              size="lg"
              onClick={() => handleStyleChange(style)}
              className="flex h-auto w-full flex-col items-start gap-3 p-4 text-left transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg p-2 ${isActive ? "bg-accent-500/20" : "bg-white/10"}`}
                  >
                    <div
                      className={`h-3 w-3 rounded-sm ${isActive ? "bg-accent-400" : "bg-white/40"}`}
                    ></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-semibold text-white">{styleData.name}</span>
                    {isActive && (
                      <div className="mt-1 flex items-center gap-1">
                        <div className="bg-accent-500 h-2 w-2 rounded-full"></div>
                        <span className="text-accent-400 text-xs font-medium">Active</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-gray-300">{styleData.description}</p>
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
            <h4 className="font-semibold text-white">Response Style</h4>
            <p className="text-sm text-gray-400">Current: {STYLE_LABELS[currentStyle].name}</p>
          </div>
        </div>

        <GlassCard variant="subtle" className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent-500/20 flex h-10 w-10 items-center justify-center rounded-lg p-2">
              <div className="bg-accent-400 h-4 w-4 rounded-sm"></div>
            </div>
            <div>
              <div className="font-medium text-white">{STYLE_LABELS[currentStyle].name}</div>
              <div className="text-sm text-gray-400">{STYLE_LABELS[currentStyle].description}</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Style Groups */}
      <div className="space-y-6">
        {renderStyleGroup("Basic Styles", basicStyles)}
        {renderStyleGroup("Creative Styles", creativeStyles)}
        {renderStyleGroup("Technical Styles", technicalStyles)}
        {renderStyleGroup("Personality Styles", personalityStyles)}
      </div>

      {/* Style Options */}
      <div className="space-y-4">
        <h4 className="font-semibold text-white">Style Options</h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-white">NSFW Content</h5>
              <p className="text-sm text-gray-400">Allow explicit and uncensored responses</p>
            </div>
            <Switch checked={nsfwEnabled} onChange={handleNsfwToggle} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-white">Combine Role Style</h5>
              <p className="text-sm text-gray-400">Combine base style with selected role</p>
            </div>
            <Switch checked={useRoleStyleEnabled} onChange={handleUseRoleStyleToggle} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white">Actions</h4>
        </div>

        <div className="flex gap-3">
          <GlassButton variant="ghost" size="sm" onClick={resetToDefaults} className="flex-1">
            Reset to Default
          </GlassButton>
        </div>

        {/* Live Style Info */}
        <GlassCard variant="subtle" className="p-3">
          <div className="space-y-1 text-xs text-gray-400">
            <div>
              Current Style: <span className="text-cyan-400">{currentStyle}</span>
            </div>
            <div>
              NSFW: <span className="text-cyan-400">{nsfwEnabled ? "Enabled" : "Disabled"}</span>
            </div>
            <div>
              Role Style:{" "}
              <span className="text-cyan-400">{useRoleStyleEnabled ? "On" : "Off"}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
