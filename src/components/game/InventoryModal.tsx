import { Backpack, Box, Package, Scroll, Shield, Skull } from "@/lib/icons";
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

import type { GameState, Item } from "../../hooks/useGameState";

interface InventoryModalProps {
  state: GameState;
  trigger?: React.ReactNode;
}

const itemTypeIcons = {
  weapon: Skull,
  armor: Shield,
  consumable: Package,
  quest: Scroll,
  misc: Box,
};

const itemTypeLabels = {
  weapon: "Waffe",
  armor: "Rüstung",
  consumable: "Verbrauchsgegenstand",
  quest: "Quest",
  misc: "Sonstiges",
};

const itemTypeColors = {
  weapon: "text-red-400",
  armor: "text-blue-400",
  consumable: "text-green-400",
  quest: "text-purple-400",
  misc: "text-gray-400",
};

function ItemCard({ item }: { item: Item }) {
  const Icon = itemTypeIcons[item.type];

  return (
    <div className="rounded-lg border border-white/10 bg-surface-2/40 p-4 space-y-2 hover:bg-surface-2/60 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Icon className={`h-5 w-5 flex-shrink-0 ${itemTypeColors[item.type]}`} />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-ink-primary truncate">{item.name}</h4>
            {item.description && (
              <p className="text-sm text-ink-tertiary mt-1 line-clamp-2">{item.description}</p>
            )}
          </div>
        </div>
        {item.quantity > 1 && (
          <Badge variant="secondary" className="flex-shrink-0">
            ×{item.quantity}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {itemTypeLabels[item.type]}
        </Badge>
      </div>
    </div>
  );
}

export function InventoryModal({ state, trigger }: InventoryModalProps) {
  const groupedItems = state.inventory.reduce(
    (acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    },
    {} as Record<Item["type"], Item[]>,
  );

  const totalItems = state.inventory.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItems = state.inventory.length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <Backpack className="h-4 w-4" />
            Inventar ({uniqueItems})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Backpack className="h-5 w-5" />
            Inventar
          </DialogTitle>
          <DialogDescription>
            {totalItems} {totalItems === 1 ? "Gegenstand" : "Gegenstände"} ({uniqueItems}{" "}
            {uniqueItems === 1 ? "eindeutiger" : "eindeutige"})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {state.inventory.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-surface-2/20 p-8 text-center">
              <Backpack className="mx-auto h-12 w-12 text-ink-tertiary/50 mb-3" />
              <p className="text-sm text-ink-tertiary">Dein Inventar ist leer</p>
              <p className="text-xs text-ink-tertiary/70 mt-1">
                Sammle Gegenstände auf deinem Abenteuer
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {(Object.entries(groupedItems) as [Item["type"], Item[]][]).map(([type, items]) => (
                <div key={type} className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary flex items-center gap-2">
                    {itemTypeLabels[type]} ({items.length})
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
