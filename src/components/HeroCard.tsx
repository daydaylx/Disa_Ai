import React from "react"
import Orb from "./Orb"
export default function HeroCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="p-[2px] rounded-2xl" style={{ backgroundImage: "var(--grad)" }}>
      <div className="rounded-2xl glass px-6 py-6 shadow-sm">
        <div className="flex items-center gap-6">
          <Orb size={84} />
          <div className="flex-1">
            <div className="text-lg font-semibold">Triff Disa</div>
            <div className="text-sm opacity-80">Dein KI-Assistent. Direkt, ehrlich, schnell.</div>
            <div className="mt-4">
              <button onClick={onStart} className="button-accent px-4 py-2 rounded-xl text-sm">Los geht’s</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
