import * as React from "react";
import { useMemo, useState } from "react";

import { GlassButton } from "../../components/glass/GlassButton";
import { GlassCard } from "../../components/glass/GlassCard";
import Switch from "../../components/Switch";
import Accordion, { type AccordionItem } from "../../components/ui/Accordion";
import BottomSheet from "../../components/ui/BottomSheet";
import Card from "../../components/ui/Card";
import { useToasts } from "../../components/ui/Toast";
import {
  getNSFW,
  getStyle,
  getUseRoleStyle,
  setNSFW,
  setStyle,
  setUseRoleStyle,
  type StyleKey,
} from "../../config/settings";

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

export default function SettingsStyle() {
  const [currentStyle, setCurrentStyle] = useState<StyleKey>(() => getStyle());
  const [nsfwEnabled, setNsfwEnabled] = useState(() => getNSFW());
  const [useRoleStyleEnabled, setUseRoleStyleEnabled] = useState(() => getUseRoleStyle());
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheet, setSheet] = useState<{
    title: string;
    description: string;
    style?: StyleKey;
  } | null>(null);
  const toasts = useToasts();

  const handleStyleChange = (style: StyleKey) => {
    setCurrentStyle(style);
    setStyle(style);
    toasts.push({
      kind: "success",
      title: "🎯 Stil geändert",
      message: `Antwortstil auf "${STYLE_LABELS[style].name}" gesetzt.`,
    });
  };

  const handleNsfwToggle = (enabled: boolean) => {
    setNsfwEnabled(enabled);
    setNSFW(enabled);
    toasts.push({
      kind: "info",
      title: enabled ? "🔓 NSFW aktiviert" : "🔒 NSFW deaktiviert",
      message: enabled ? "Inhaltsfilterung deaktiviert" : "Inhaltsfilterung aktiviert",
    });
  };

  const handleUseRoleStyleToggle = (enabled: boolean) => {
    setUseRoleStyleEnabled(enabled);
    setUseRoleStyle(enabled);
    toasts.push({
      kind: "info",
      title: enabled ? "👤 Rollen-Stil aktiviert" : "📝 Rollen-Stil deaktiviert",
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
      title: "↩️ Stil zurückgesetzt",
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

  const allStylesGrouped = React.useMemo(() => {
    return [
      { title: "Grundstile", emoji: "📄", styles: basicStyles },
      { title: "Kreative Stile", emoji: "🎨", styles: creativeStyles },
      { title: "Technische Stile", emoji: "⚙️", styles: technicalStyles },
      { title: "Persönlichkeit", emoji: "👤", styles: personalityStyles },
    ];
  }, [basicStyles, creativeStyles, technicalStyles, personalityStyles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return Object.keys(STYLE_LABELS) as StyleKey[];

    return (Object.keys(STYLE_LABELS) as StyleKey[]).filter((styleKey) => {
      const style = STYLE_LABELS[styleKey];
      return (style.name + " " + style.description).toLowerCase().includes(q);
    });
  }, [query]);

  const sections: AccordionItem[] = allStylesGrouped
    .map(({ title, emoji, styles }) => {
      const filteredStyles = styles.filter((style) => filtered.includes(style));

      return {
        title: `${emoji} ${title}`,
        meta: `${filteredStyles.length} Stile verfügbar`,
        content: (
          <div className="space-y-2">
            {filteredStyles.map((styleKey) => {
              const style = STYLE_LABELS[styleKey];
              const isActive = currentStyle === styleKey;

              return (
                <Card
                  key={styleKey}
                  title={`${style.emoji} ${style.name}`}
                  meta={style.description}
                  active={isActive}
                  onClick={() => {
                    setSheet({
                      title: style.name,
                      description: style.description,
                      style: styleKey,
                    });
                    setSheetOpen(true);
                  }}
                />
              );
            })}
          </div>
        ),
        defaultOpen: true,
      };
    })
    .filter((section) => section.content.props.children.length > 0);

  return (
    <section className="space-y-4">
      {/* Current Style Display */}
      <GlassCard variant="subtle" className="p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{STYLE_LABELS[currentStyle].emoji}</span>
          <div>
            <div className="flex items-center gap-2 font-medium text-white">
              <span className="text-accent-400">✓</span>
              {STYLE_LABELS[currentStyle].name}
            </div>
            <div className="text-sm text-gray-400">{STYLE_LABELS[currentStyle].description}</div>
          </div>
        </div>
      </GlassCard>

      {/* Style Options */}
      <div className="space-y-3">
        <h4 className="font-semibold text-white">Stil-Optionen</h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-white">NSFW-Inhalte</h5>
              <p className="text-sm text-gray-400">Erlaubt explizite und unzensierte Antworten</p>
            </div>
            <Switch checked={nsfwEnabled} onChange={handleNsfwToggle} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-white">Rollen-Stil kombinieren</h5>
              <p className="text-sm text-gray-400">Kombiniert Grundstil mit ausgewählter Rolle</p>
            </div>
            <Switch checked={useRoleStyleEnabled} onChange={handleUseRoleStyleToggle} />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Stile suchen…"
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        />
      </div>

      {/* Style Categories */}
      <Accordion items={sections} single={false} />

      {/* Actions */}
      <div className="flex gap-3">
        <GlassButton variant="ghost" size="sm" onClick={resetToDefaults} className="flex-1">
          Standard wiederherstellen
        </GlassButton>
      </div>

      {/* Style Detail Sheet */}
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={sheet?.title ?? "Details"}
      >
        <div className="space-y-4">
          <div className="max-measure whitespace-pre-wrap text-sm">{sheet?.description}</div>
          {sheet?.style && (
            <div className="flex gap-2">
              <GlassButton
                variant={currentStyle === sheet.style ? "accent" : "primary"}
                size="sm"
                onClick={() => {
                  if (sheet.style) {
                    handleStyleChange(sheet.style);
                  }
                  setSheetOpen(false);
                }}
                className="flex-1"
              >
                {currentStyle === sheet.style ? "Bereits aktiv" : "Stil aktivieren"}
              </GlassButton>
            </div>
          )}
        </div>
      </BottomSheet>
    </section>
  );
}
