import { ArrowRight, Package, Shield, Skull, Swords, TrendingUp, Zap } from "@/lib/icons";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/Dialog";
import { Progress } from "@/ui/Progress";

import type { CombatAction, Enemy, GameState } from "../../hooks/useGameState";

interface CombatTrackerProps {
  state: GameState;
  trigger?: React.ReactNode;
}

const actionIcons = {
  attack: Swords,
  defend: Shield,
  spell: Zap,
  item: Package,
  flee: ArrowRight,
};

const actionLabels = {
  attack: "Angriff",
  defend: "Verteidigung",
  spell: "Zauber",
  item: "Gegenstand",
  flee: "Flucht",
};

function EnemyCard({ enemy }: { enemy: Enemy }) {
  const hpPercent =
    enemy.maxHp > 0 ? Math.min(100, Math.max(0, (enemy.hp / enemy.maxHp) * 100)) : 0;

  return (
    <div
      className={`rounded-lg border p-4 space-y-3 ${
        enemy.isBoss
          ? "border-status-error/50 bg-status-error/5"
          : "border-white/10 bg-surface-2/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Skull
            className={`h-5 w-5 flex-shrink-0 ${enemy.isBoss ? "text-status-error" : "text-ink-tertiary"}`}
          />
          <div>
            <h4 className="font-semibold text-ink-primary flex items-center gap-2">
              {enemy.name}
              {enemy.isBoss && (
                <Badge variant="destructive" className="text-xs">
                  Boss
                </Badge>
              )}
            </h4>
            <p className="text-xs text-ink-tertiary">Level {enemy.level}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-ink-secondary">
          <span>HP</span>
          <span>
            {enemy.hp} / {enemy.maxHp}
          </span>
        </div>
        <Progress value={hpPercent} className="h-2" />
      </div>
    </div>
  );
}

function CombatActionLog({ action }: { action: CombatAction }) {
  const Icon = actionIcons[action.action];
  const timestamp = new Date(action.timestamp).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/5 bg-surface-2/20 p-3">
      <Icon
        className={`h-4 w-4 flex-shrink-0 mt-0.5 ${action.success ? "text-status-success" : "text-status-error"}`}
      />
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-ink-primary truncate">{action.actor}</span>
          <span className="text-xs text-ink-tertiary flex-shrink-0">{timestamp}</span>
        </div>
        <div className="text-xs text-ink-secondary">
          <span className="font-medium">{actionLabels[action.action]}</span>
          {action.target && (
            <>
              {" → "}
              <span>{action.target}</span>
            </>
          )}
          {action.damage !== undefined && action.damage > 0 && (
            <span className="text-status-error ml-2">-{action.damage} HP</span>
          )}
          {action.healing !== undefined && action.healing > 0 && (
            <span className="text-status-success ml-2">+{action.healing} HP</span>
          )}
          {action.effect && <span className="text-purple-400 ml-2">({action.effect})</span>}
        </div>
      </div>
    </div>
  );
}

export function CombatTracker({ state, trigger }: CombatTrackerProps) {
  const { combat } = state;
  const recentActions = combat.actions.slice(-10).reverse();

  if (!combat.active) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <Swords className="h-4 w-4" />
            Kampf (Runde {combat.roundNumber})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-status-error" />
            Kampf-Tracker
          </DialogTitle>
          <DialogDescription>
            Runde {combat.roundNumber}, Zug {combat.turn + 1}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enemies */}
          {combat.enemies.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-secondary">
                <Skull className="h-4 w-4" />
                Gegner ({combat.enemies.filter((e) => e.hp > 0).length} aktiv)
              </h3>
              <div className="space-y-2">
                {combat.enemies.map((enemy) => (
                  <EnemyCard key={enemy.id} enemy={enemy} />
                ))}
              </div>
            </div>
          )}

          {combat.enemies.length === 0 && (
            <div className="rounded-lg border border-white/10 bg-surface-2/20 p-8 text-center">
              <Skull className="mx-auto h-12 w-12 text-ink-tertiary/50 mb-3" />
              <p className="text-sm text-ink-tertiary">Keine Gegner im Kampf</p>
            </div>
          )}

          {/* Combat Log */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-secondary">
              <TrendingUp className="h-4 w-4" />
              Kampfprotokoll (Letzte {recentActions.length} Aktionen)
            </h3>
            {recentActions.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {recentActions.map((action) => (
                  <CombatActionLog key={action.id} action={action} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-white/10 bg-surface-2/20 p-6 text-center">
                <p className="text-sm text-ink-tertiary">Noch keine Aktionen</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
