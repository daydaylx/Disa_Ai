import { ArrowRight, Clock, Coins, Heart, Store, User } from "@/lib/icons";
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

import type { GameState, TradeHistory, TradeOffer } from "../../hooks/useGameState";

interface TradeModalProps {
  state: GameState;
  trigger?: React.ReactNode;
}

function TradeOfferCard({ offer }: { offer: TradeOffer }) {
  const isExpired = offer.expiresAt && offer.expiresAt < Date.now();
  const timeLeft = offer.expiresAt ? Math.max(0, offer.expiresAt - Date.now()) : null;
  const hoursLeft = timeLeft ? Math.floor(timeLeft / (1000 * 60 * 60)) : null;

  return (
    <div
      className={`rounded-lg border p-4 space-y-4 ${
        isExpired
          ? "border-ink-tertiary/30 bg-surface-2/20 opacity-60"
          : offer.completed
            ? "border-status-success/30 bg-status-success/5"
            : "border-white/10 bg-surface-2/40 hover:bg-surface-2/60 transition-colors"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <User className="h-5 w-5 text-cyan-300 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-ink-primary">{offer.npcName}</h4>
            {offer.npcDialogue && (
              <p className="text-xs text-ink-tertiary italic mt-0.5">"{offer.npcDialogue}"</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpired && (
            <Badge variant="destructive" className="text-xs">
              Abgelaufen
            </Badge>
          )}
          {offer.completed && (
            <Badge variant="success" className="text-xs">
              Abgeschlossen
            </Badge>
          )}
          {!isExpired && !offer.completed && hoursLeft !== null && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {hoursLeft}h
            </Badge>
          )}
        </div>
      </div>

      {/* Trade Items */}
      <div className="grid grid-cols-3 gap-3 items-center">
        {/* What NPC Offers */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-status-success font-semibold">
            Du erhältst
          </p>
          <div className="space-y-1">
            {offer.offeredItems.map((item) => (
              <div
                key={item.id}
                className="text-xs text-ink-secondary flex items-center justify-between"
              >
                <span className="truncate">{item.name}</span>
                {item.quantity > 1 && (
                  <span className="text-ink-tertiary ml-1">×{item.quantity}</span>
                )}
              </div>
            ))}
            {offer.goldOffered > 0 && (
              <div className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                <Coins className="h-3 w-3" />
                {offer.goldOffered}G
              </div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight className="h-5 w-5 text-ink-tertiary" />
        </div>

        {/* What NPC Wants */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-status-error font-semibold">
            Du gibst
          </p>
          <div className="space-y-1">
            {offer.requestedItems.map((item) => (
              <div
                key={item.id}
                className="text-xs text-ink-secondary flex items-center justify-between"
              >
                <span className="truncate">{item.name}</span>
                {item.quantity > 1 && (
                  <span className="text-ink-tertiary ml-1">×{item.quantity}</span>
                )}
              </div>
            ))}
            {offer.goldRequested > 0 && (
              <div className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                <Coins className="h-3 w-3" />
                {offer.goldRequested}G
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TradeHistoryCard({ history }: { history: TradeHistory }) {
  const date = new Date(history.timestamp).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = new Date(history.timestamp).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-lg border border-white/5 bg-surface-2/20 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-cyan-300" />
          <span className="text-sm font-medium text-ink-primary">{history.npcName}</span>
        </div>
        <div className="text-xs text-ink-tertiary">
          {date} • {time}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-ink-tertiary mb-1">Erhalten:</p>
          <div className="space-y-0.5">
            {history.itemsGained.map((item) => (
              <div key={item.id} className="text-status-success">
                +{item.name} {item.quantity > 1 && `×${item.quantity}`}
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-ink-tertiary mb-1">Gegeben:</p>
          <div className="space-y-0.5">
            {history.itemsLost.map((item) => (
              <div key={item.id} className="text-status-error">
                -{item.name} {item.quantity > 1 && `×${item.quantity}`}
              </div>
            ))}
          </div>
        </div>
      </div>

      {history.goldChange !== 0 && (
        <div
          className={`text-xs font-medium ${history.goldChange > 0 ? "text-status-success" : "text-status-error"}`}
        >
          {history.goldChange > 0 ? "+" : ""}
          {history.goldChange}G
        </div>
      )}
    </div>
  );
}

export function TradeModal({ state, trigger }: TradeModalProps) {
  const { trade } = state;
  const activeOffers = trade.activeOffers.filter((o) => !o.completed);
  const completedOffers = trade.activeOffers.filter((o) => o.completed);
  const reputationPercent = trade.reputation;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <Store className="h-4 w-4" />
            Handel ({activeOffers.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-emerald-400" />
            Handelszentrum
          </DialogTitle>
          <DialogDescription>
            {activeOffers.length} aktive Angebote • Reputation: {trade.reputation}/100
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reputation Bar */}
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-semibold text-ink-primary">Händler-Reputation</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">{trade.reputation}/100</span>
            </div>
            <Progress value={reputationPercent} className="h-2" />
            <p className="text-xs text-ink-tertiary">
              Höhere Reputation schaltet bessere Handelsangebote frei
            </p>
          </div>

          {/* Active Offers */}
          {activeOffers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
                Aktive Angebote
              </h3>
              <div className="space-y-2">
                {activeOffers.map((offer) => (
                  <TradeOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Offers */}
          {completedOffers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
                Abgeschlossene Angebote
              </h3>
              <div className="space-y-2">
                {completedOffers.map((offer) => (
                  <TradeOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          )}

          {/* Trade History */}
          {trade.history.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
                Handelshistorie (Letzte {Math.min(5, trade.history.length)})
              </h3>
              <div className="space-y-2">
                {trade.history
                  .slice(-5)
                  .reverse()
                  .map((history) => (
                    <TradeHistoryCard key={history.id} history={history} />
                  ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {activeOffers.length === 0 &&
            completedOffers.length === 0 &&
            trade.history.length === 0 && (
              <div className="rounded-lg border border-white/10 bg-surface-2/20 p-8 text-center">
                <Store className="mx-auto h-12 w-12 text-ink-tertiary/50 mb-3" />
                <p className="text-sm text-ink-tertiary">Keine Handelsangebote verfügbar</p>
                <p className="text-xs text-ink-tertiary/70 mt-1">
                  Sprich mit Händlern, um Angebote zu erhalten
                </p>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
