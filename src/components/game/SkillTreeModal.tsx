import { CheckCircle2, Lock, Star, TrendingUp, Zap } from "@/lib/icons";
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

import type { GameState, Skill } from "../../hooks/useGameState";

interface SkillTreeModalProps {
  state: GameState;
  trigger?: React.ReactNode;
}

function SkillCard({ skill }: { skill: Skill }) {
  const progressPercent = skill.maxLevel > 0 ? (skill.currentLevel / skill.maxLevel) * 100 : 0;
  const isMaxLevel = skill.currentLevel >= skill.maxLevel;

  return (
    <div
      className={`rounded-lg border p-4 space-y-3 transition-all ${
        skill.unlocked
          ? "border-status-success/30 bg-status-success/5"
          : "border-white/10 bg-surface-2/40 opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {skill.unlocked ? (
            <CheckCircle2 className="h-5 w-5 text-status-success flex-shrink-0 mt-0.5" />
          ) : (
            <Lock className="h-5 w-5 text-ink-tertiary flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-ink-primary">{skill.name}</h4>
              <Badge variant="outline" className="text-xs">
                Stufe {skill.tier}
              </Badge>
              {isMaxLevel && skill.unlocked && (
                <Badge variant="success" className="text-xs">
                  Max
                </Badge>
              )}
            </div>
            <p className="text-sm text-ink-secondary mt-1">{skill.description}</p>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-sm font-semibold text-amber-400">{skill.cost} SP</div>
          <div className="text-xs text-ink-tertiary">
            {skill.currentLevel}/{skill.maxLevel}
          </div>
        </div>
      </div>

      {skill.unlocked && !isMaxLevel && (
        <div className="space-y-1">
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      )}

      {/* Skill Effects */}
      {skill.effects && (
        <div className="rounded-md bg-surface-3/30 border border-white/5 p-3 space-y-2">
          <p className="text-xs uppercase tracking-wider text-ink-tertiary font-semibold">
            Effekte
          </p>
          <div className="space-y-1">
            {skill.effects.statBonus && (
              <div className="text-xs text-ink-secondary space-y-0.5">
                {Object.entries(skill.effects.statBonus)
                  .filter(([_, value]) => value !== undefined && value !== 0)
                  .map(([stat, value]) => (
                    <div key={stat} className="flex items-center justify-between">
                      <span className="capitalize">{stat}</span>
                      <span className="text-status-success font-medium">+{value}</span>
                    </div>
                  ))}
              </div>
            )}
            {skill.effects.hpBonus !== undefined && skill.effects.hpBonus > 0 && (
              <div className="text-xs text-ink-secondary flex items-center justify-between">
                <span>Max HP</span>
                <span className="text-status-success font-medium">+{skill.effects.hpBonus}</span>
              </div>
            )}
            {skill.effects.damageBonus !== undefined && skill.effects.damageBonus > 0 && (
              <div className="text-xs text-ink-secondary flex items-center justify-between">
                <span>Schaden</span>
                <span className="text-status-success font-medium">
                  +{skill.effects.damageBonus}%
                </span>
              </div>
            )}
            {skill.effects.specialAbility && (
              <div className="text-xs text-purple-400 mt-2 font-medium">
                ✨ {skill.effects.specialAbility}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Requirements */}
      {skill.requirements.length > 0 && !skill.unlocked && (
        <div className="text-xs text-ink-tertiary">
          <span className="font-semibold">Voraussetzungen: </span>
          {skill.requirements.join(", ")}
        </div>
      )}
    </div>
  );
}

export function SkillTreeModal({ state, trigger }: SkillTreeModalProps) {
  const { skillTree } = state;
  const unlockedSkills = skillTree.skills.filter((s) => s.unlocked).length;
  const skillsByTier = skillTree.skills.reduce<Record<number, Skill[]>>((acc, skill) => {
    if (!acc[skill.tier]) acc[skill.tier] = [];
    acc[skill.tier]!.push(skill);
    return acc;
  }, {});

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <Zap className="h-4 w-4" />
            Fähigkeiten ({skillTree.availablePoints} SP)
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Fähigkeitenbaum
          </DialogTitle>
          <DialogDescription>
            {unlockedSkills} von {skillTree.skills.length} Fähigkeiten freigeschaltet •{" "}
            {skillTree.availablePoints} Skill-Punkte verfügbar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Skill Points Display */}
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-400/20 p-3">
                  <Star className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-primary">Verfügbare Skill-Punkte</p>
                  <p className="text-xs text-ink-tertiary">Erhältst du beim Level-Aufstieg</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-amber-400">{skillTree.availablePoints}</div>
            </div>
          </div>

          {/* Skills by Tier */}
          {skillTree.skills.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(skillsByTier)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([tier, skills]) =>
                  skills && skills.length > 0 ? (
                    <div key={tier} className="space-y-3">
                      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-secondary">
                        <TrendingUp className="h-4 w-4" />
                        Stufe {tier}
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {skills.map((skill) => (
                          <SkillCard key={skill.id} skill={skill} />
                        ))}
                      </div>
                    </div>
                  ) : null,
                )}
            </div>
          ) : (
            <div className="rounded-lg border border-white/10 bg-surface-2/20 p-8 text-center">
              <Zap className="mx-auto h-12 w-12 text-ink-tertiary/50 mb-3" />
              <p className="text-sm text-ink-tertiary">Keine Fähigkeiten verfügbar</p>
              <p className="text-xs text-ink-tertiary/70 mt-1">
                Schalte Fähigkeiten frei, indem du Level aufsteigst
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
