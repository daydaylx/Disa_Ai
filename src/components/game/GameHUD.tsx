import { Backpack, Coins, Heart, MapPin, Scroll, Star, Swords } from "@/lib/icons";

import type { GameState, Item } from "../../hooks/useGameState";
import { CombatTracker } from "./CombatTracker";
import { InventoryModal } from "./InventoryModal";
import { QuestTracker } from "./QuestTracker";

interface GameHUDProps {
  state: GameState;
  onUseItem?: (item: Item) => void;
  onCombatAction?: (action: string) => void;
}

export function GameHUD({ state, onUseItem, onCombatAction }: GameHUDProps) {
  const hpPercent =
    state.maxHp > 0 ? Math.min(100, Math.max(0, (state.hp / state.maxHp) * 100)) : 0;

  const xpPercent =
    state.xpToNextLevel > 0
      ? Math.min(100, Math.max(0, (state.xp / state.xpToNextLevel) * 100))
      : 0;

  const totalItems = state.inventory.reduce((sum, item) => sum + item.quantity, 0);
  const activeQuests = state.quests.filter((q) => !q.completed).length;

  return (
    <div className="w-full pt-3 pb-2">
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="rounded-2xl border border-white/10 bg-surface-1/70 px-4 py-3 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-3">
            {/* HP Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-ink-tertiary">
                <span className="flex items-center gap-1 text-ink-secondary">
                  <Heart className="h-3 w-3 text-status-error" />
                  Bio-Status
                </span>
                <span className="text-ink-secondary">
                  {state.hp} / {state.maxHp}
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-2/80 border border-white/10 overflow-hidden">
                <div
                  className="h-full bg-status-error transition-[width] duration-500 ease-out"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            {/* XP Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-ink-tertiary">
                <span className="flex items-center gap-1 text-ink-secondary">
                  <Star className="h-3 w-3 text-amber-400" />
                  Rang {state.level}
                </span>
                <span className="text-ink-secondary">
                  {state.xp} / {state.xpToNextLevel} XP
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-2/80 border border-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-[width] duration-500 ease-out"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Survival Bars - DISABLED (simplified to HP-only system) */}
            {/* <SurvivalBars survival={state.survival} /> */}

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-surface-2/70 px-3 py-1.5">
                <Coins className="h-4 w-4 text-amber-300" />
                <span className="text-ink-primary">{state.gold} G</span>
              </div>
              <div
                className="flex items-center gap-2 rounded-full border border-white/10 bg-surface-2/70 px-3 py-1.5"
                title={state.location}
              >
                <MapPin className="h-4 w-4 text-sky-300" />
                <span className="max-w-[120px] truncate text-ink-secondary">{state.location}</span>
              </div>

              {/* Interactive Buttons */}
              <InventoryModal
                state={state}
                onUseItem={onUseItem}
                trigger={
                  <button className="flex items-center gap-2 rounded-full border border-white/10 bg-surface-2/70 px-3 py-1.5 hover:bg-surface-2/90 transition-colors">
                    <Backpack className="h-4 w-4 text-emerald-300" />
                    <span className="text-ink-secondary">{totalItems}</span>
                  </button>
                }
              />

              {activeQuests > 0 && (
                <QuestTracker
                  state={state}
                  trigger={
                    <button className="flex items-center gap-2 rounded-full border border-white/10 bg-surface-2/70 px-3 py-1.5 hover:bg-surface-2/90 transition-colors">
                      <Scroll className="h-4 w-4 text-purple-300" />
                      <span className="text-ink-secondary">{activeQuests}</span>
                    </button>
                  }
                />
              )}

              {state.combat.active && (
                <CombatTracker
                  state={state}
                  onAction={onCombatAction}
                  trigger={
                    <button className="flex items-center gap-2 rounded-full border border-status-error/30 bg-status-error/10 px-3 py-1.5 hover:bg-status-error/20 transition-colors animate-pulse">
                      <Swords className="h-4 w-4 text-status-error" />
                      <span className="text-status-error font-semibold">
                        R{state.combat.roundNumber}
                      </span>
                    </button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
