import React from "react";

export default function HeroCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-2xl p-[2px]" style={{ backgroundImage: "var(--grad)" }}>
      <div className="glass rounded-2xl px-6 py-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div
            aria-hidden
            className="h-20 w-20 shrink-0 rounded-full border border-white/10 bg-gradient-to-br from-[#ff00ff33] via-[#00ffff26] to-transparent shadow-[0_0_30px_#ff00ff55]"
          />
          <div className="flex-1">
            <div className="text-lg font-semibold">Triff Disa</div>
            <div className="text-sm opacity-80">Dein KI-Assistent. Direkt, ehrlich, schnell.</div>
            <div className="mt-4">
              <button onClick={onStart} className="button-accent rounded-xl px-4 py-2 text-sm">
                Los geht’s
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
