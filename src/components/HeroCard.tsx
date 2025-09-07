import React from "react";

export default function HeroCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-2xl p-[2px]">
      <div className="glass rounded-2xl px-6 py-6 shadow-soft">
        <div className="flex items-center gap-6">
          <div aria-hidden className="h-20 w-20 shrink-0 rounded-full border border-white/30 bg-gradient-to-br from-[#F5F3FF] via-[#EEF2FF] to-transparent shadow-soft" />
          <div className="flex-1">
            <div className="text-lg font-semibold">Triff Disa</div>
            <div className="text-sm text-slate-600">Dein KI-Assistent. Direkt, ehrlich, schnell.</div>
            <div className="mt-4">
              <button onClick={onStart} className="btn-primary rounded-[14px] px-4 py-2 text-sm">
                Los geht’s
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
