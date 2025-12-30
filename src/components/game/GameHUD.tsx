import React from "react";

import { Backpack, Coins, Heart, MapPin } from "@/lib/icons";

import type { GameState } from "../../hooks/useGameState";

export function GameHUD({ state }: { state: GameState }) {
  const hpPercent = Math.min(100, Math.max(0, (state.hp / state.maxHp) * 100));

  return (
    <div className="bg-surface-800 text-white p-4 shadow-lg border-b border-white/10 sticky top-0 z-20">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[180px]">
          <div className="flex justify-between text-xs text-gray-400 mb-1 uppercase tracking-wider font-bold">
            <span className="flex items-center gap-1">
              <Heart size={12} className="text-red-500" />
              Vitalität
            </span>
            <span>
              {state.hp} / {state.maxHp}
            </span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden border border-white/5 relative">
            <div className="absolute inset-0 bg-red-900/50" />
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        <div className="flex gap-3 text-sm font-medium flex-wrap justify-end">
          <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <Coins size={16} />
            <span>{state.gold} G</span>
          </div>
          <div className="flex items-center gap-2 text-blue-300 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
            <MapPin size={16} />
            <span className="truncate max-w-[200px]" title={state.location}>
              {state.location}
            </span>
          </div>
          {state.inventory.length > 0 && (
            <div className="flex items-center gap-2 text-emerald-300 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
              <Backpack size={16} />
              <span className="truncate max-w-[200px]" title={state.inventory.join(", ")}>
                {state.inventory.join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
