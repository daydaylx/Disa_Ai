import { Award, Star, TrendingUp, User } from "@/lib/icons";
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

import type { GameState } from "../../hooks/useGameState";

interface CharacterSheetProps {
  state: GameState;
  trigger?: React.ReactNode;
}

const statNames: Record<keyof GameState["stats"], string> = {
  strength: "Stärke",
  dexterity: "Geschicklichkeit",
  constitution: "Konstitution",
  intelligence: "Intelligenz",
  wisdom: "Weisheit",
  charisma: "Charisma",
};

function getStatModifier(value: number): number {
  return Math.floor((value - 10) / 2);
}

function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function CharacterSheet({ state, trigger }: CharacterSheetProps) {
  const xpPercent = state.xpToNextLevel > 0 ? (state.xp / state.xpToNextLevel) * 100 : 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            Charakter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Charakterbogen
          </DialogTitle>
          <DialogDescription>Deine Werte und Fortschritte</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Level & XP */}
          <div className="space-y-3 rounded-xl border border-white/10 bg-surface-2/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400" />
                <span className="font-semibold text-ink-primary">Level {state.level}</span>
              </div>
              <span className="text-sm text-ink-tertiary">
                {state.xp} / {state.xpToNextLevel} XP
              </span>
            </div>
            <Progress value={xpPercent} className="h-2" />
          </div>

          {/* Stats Grid */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-secondary">
              <TrendingUp className="h-4 w-4" />
              Attribute
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(state.stats) as [keyof typeof state.stats, number][]).map(
                ([stat, value]) => {
                  const modifier = getStatModifier(value);
                  return (
                    <div
                      key={stat}
                      className="rounded-lg border border-white/10 bg-surface-2/30 p-3 space-y-1"
                    >
                      <div className="text-xs uppercase tracking-wider text-ink-tertiary">
                        {statNames[stat]}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-ink-primary">{value}</span>
                        <span
                          className={`text-sm font-medium ${
                            modifier >= 0 ? "text-status-success" : "text-status-error"
                          }`}
                        >
                          {formatModifier(modifier)}
                        </span>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* Achievements */}
          {state.achievements.length > 0 && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-secondary">
                <Award className="h-4 w-4" />
                Errungenschaften ({state.achievements.length})
              </h3>
              <div className="space-y-2">
                {state.achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface-2/30 p-3"
                  >
                    <Award className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <span className="text-sm text-ink-primary">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {state.achievements.length === 0 && (
            <div className="rounded-lg border border-white/10 bg-surface-2/20 p-4 text-center">
              <Award className="mx-auto h-8 w-8 text-ink-tertiary/50 mb-2" />
              <p className="text-sm text-ink-tertiary">Noch keine Errungenschaften</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
