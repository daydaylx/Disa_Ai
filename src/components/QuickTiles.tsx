import React from "react"
type Tile = { id: string; label: string; prompt: string }
const TILES: Tile[] = [
  { id: "daily", label: "Alltag", prompt: "Gib mir 5 Ideen, wie ich heute produktiver werde – knapp, umsetzbar." },
  { id: "health", label: "Gesundheit", prompt: "Erstelle mir einen 3-Tage-Plan für ausgewogene Mahlzeiten (ohne Fisch)." },
  { id: "dev", label: "Dev", prompt: "Fasse Clean-Code-Prinzipien in 7 Bulletpoints zusammen, mit kurzem Beispiel je Punkt." },
  { id: "biz", label: "Business", prompt: "Skizziere eine kurze SWOT für einen Coffeeshop in einer Unistadt." },
]
export default function QuickTiles({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {TILES.map(t => (
        <button key={t.id} onClick={() => onPick(t.prompt)}
          className="rounded-2xl glass px-4 py-4 text-left hover:brightness-110 transition">
          <div className="text-sm font-medium">{t.label}</div>
          <div className="text-xs opacity-70 mt-1 line-clamp-2">{t.prompt}</div>
        </button>
      ))}
    </div>
  )
}
