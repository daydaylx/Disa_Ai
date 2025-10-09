/**
 * Goldstandard Design-Beispiele
 *
 * Diese Komponente zeigt, wie die Goldstandard-Konfiguration
 * korrekt verwendet wird.
 */

import { GOLDSTANDARD } from "../../lib/design/goldstandard";

export function GoldstandardExample() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold text-white">Goldstandard Design-System</h2>

      {/* Punktmuster-Hintergrund Beispiel */}
      <div className="relative h-32 overflow-hidden rounded-xl">
        <div style={GOLDSTANDARD.utils.createDotPatternStyle()} />
        <div className="relative z-10 flex h-full items-center justify-center">
          <span className="font-medium text-white">Punktmuster-Hintergrund</span>
        </div>
      </div>

      {/* Glassmorphismus-Beispiele */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Glassmorphismus-Stufen</h3>

        <div className="rounded-xl p-4" style={GOLDSTANDARD.utils.createGlassStyle("strong")}>
          <span className="text-white">Glass Strong (4% Transparenz)</span>
        </div>

        <div className="rounded-xl p-4" style={GOLDSTANDARD.utils.createGlassStyle("medium")}>
          <span className="text-white">Glass Medium (3% Transparenz)</span>
        </div>

        <div className="rounded-xl p-4" style={GOLDSTANDARD.utils.createGlassStyle("soft")}>
          <span className="text-white">Glass Soft (2% Transparenz)</span>
        </div>
      </div>

      {/* Kategorie-Farben Beispiel */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Statische Kategorie-Farben</h3>
        <div className="grid grid-cols-2 gap-3">
          {GOLDSTANDARD.categoryTints.map((tint, index) => (
            <div
              key={index}
              className="flex h-16 items-end rounded-xl p-3"
              style={{
                background: `linear-gradient(135deg, ${tint.from} 0%, ${tint.to} 100%)`,
              }}
            >
              <span className="text-sm font-medium text-white">Kategorie {index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verwendungshinweise */}
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="mb-2 text-sm font-semibold text-white">💡 Verwendungshinweise</h4>
        <ul className="space-y-1 text-sm text-white/70">
          <li>• Immer GOLDSTANDARD.utils.createGlassStyle() für Glassmorphismus verwenden</li>
          <li>• Kategorie-Farben über GOLDSTANDARD.utils.getCategoryTint() abrufen</li>
          <li>• Transparenzwerte nicht manuell ändern - Goldstandard verwenden</li>
          <li>• Punktmuster nur über createDotPatternStyle() implementieren</li>
        </ul>
      </div>
    </div>
  );
}

export default GoldstandardExample;
