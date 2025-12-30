import { CheckCircle2, Circle, Scroll } from "@/lib/icons";
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

import type { GameState, Quest } from "../../hooks/useGameState";

interface QuestTrackerProps {
  state: GameState;
  trigger?: React.ReactNode;
}

function QuestCard({ quest }: { quest: Quest }) {
  return (
    <div
      className={`rounded-lg border p-4 space-y-3 transition-colors ${
        quest.completed
          ? "border-status-success/30 bg-status-success/5"
          : "border-white/10 bg-surface-2/40 hover:bg-surface-2/60"
      }`}
    >
      <div className="flex items-start gap-3">
        {quest.completed ? (
          <CheckCircle2 className="h-5 w-5 text-status-success flex-shrink-0 mt-0.5" />
        ) : (
          <Circle className="h-5 w-5 text-ink-tertiary flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`font-semibold ${
                quest.completed ? "text-status-success line-through" : "text-ink-primary"
              }`}
            >
              {quest.title}
            </h4>
            {quest.completed && (
              <Badge variant="default" className="flex-shrink-0 bg-status-success text-white">
                Abgeschlossen
              </Badge>
            )}
          </div>
          <p className="text-sm text-ink-secondary">{quest.description}</p>
          {!quest.completed && quest.progress > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-ink-tertiary">
                <span>Fortschritt</span>
                <span>{quest.progress}%</span>
              </div>
              <Progress value={quest.progress} className="h-1.5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function QuestTracker({ state, trigger }: QuestTrackerProps) {
  const activeQuests = state.quests.filter((q) => !q.completed);
  const completedQuests = state.quests.filter((q) => q.completed);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <Scroll className="h-4 w-4" />
            Quests ({activeQuests.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scroll className="h-5 w-5" />
            Questbuch
          </DialogTitle>
          <DialogDescription>
            {activeQuests.length} aktiv, {completedQuests.length} abgeschlossen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {activeQuests.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
                Aktive Quests
              </h3>
              <div className="space-y-2">
                {activeQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </div>
          )}

          {completedQuests.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
                Abgeschlossene Quests
              </h3>
              <div className="space-y-2">
                {completedQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </div>
          )}

          {state.quests.length === 0 && (
            <div className="rounded-lg border border-white/10 bg-surface-2/20 p-8 text-center">
              <Scroll className="mx-auto h-12 w-12 text-ink-tertiary/50 mb-3" />
              <p className="text-sm text-ink-tertiary">Keine Quests verfügbar</p>
              <p className="text-xs text-ink-tertiary/70 mt-1">
                Sprich mit NPCs, um Quests zu erhalten
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
