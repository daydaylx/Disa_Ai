import { Book, Code, MessageSquare } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";

export type StartTileAction = { type: "new-chat" } | { type: "set-role"; roleId: string };

const startTiles: Array<{
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  action: StartTileAction;
}> = [
  {
    id: "new-chat",
    title: "Neuer Chat",
    subtitle: "Starte ein neues Gespräch",
    icon: <MessageSquare />,
    action: { type: "new-chat" },
  },
  {
    id: "developer-role",
    title: "Entwickler-Rolle",
    subtitle: "Starte einen Chat als Entwickler",
    icon: <Code />,
    action: { type: "set-role", roleId: "productivity_helper" },
  },
  {
    id: "creative-role",
    title: "Kreativ-Rolle",
    subtitle: "Starte einen Chat als kreativer Autor",
    icon: <Book />,
    action: { type: "set-role", roleId: "creative_writer" },
  },
];

interface StartTilesProps {
  onTileClick: (action: StartTileAction) => void;
}

export function StartTiles({ onTileClick }: StartTilesProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {startTiles.map((tile) => (
        <button
          key={tile.id}
          type="button"
          onClick={() => onTileClick(tile.action)}
          className={cn(
            "group flex h-full flex-col gap-3 rounded-base border border-border bg-surface-1 p-4 text-left transition-all duration-150",
            "hover:border-brand hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-weak focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1",
          )}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-base bg-brand/15 text-brand">
            {tile.icon}
          </span>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-text-0">{tile.title}</div>
            <p className="text-xs leading-snug text-text-1">{tile.subtitle}</p>
          </div>
          <div className="mt-auto flex items-center gap-2 text-xs text-text-1">
            <Badge variant="outline">Schnellstart</Badge>
            <span aria-hidden="true">•</span>
            <span className="text-text-muted">Tippen zum Öffnen</span>
          </div>
        </button>
      ))}
    </div>
  );
}
