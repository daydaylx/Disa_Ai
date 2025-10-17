import { Book, Code, MessageSquare } from "lucide-react";
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

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
    <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3">
      {startTiles.map((tile) => {
        const backgroundIcon = isValidElement(tile.icon)
          ? cloneElement(tile.icon as ReactElement<{ className?: string }>, {
              className: cn(
                "h-28 w-28 text-brand",
                (tile.icon.props as { className?: string } | undefined)?.className,
              ),
            })
          : null;

        return (
          <button
            key={tile.id}
            type="button"
            onClick={() => onTileClick(tile.action)}
            className={cn(
              "card-depth border-border bg-surface-1 group relative flex h-full flex-col gap-2.5 overflow-hidden rounded-base border p-3 text-left transition-all duration-150",
              "hover:border-brand hover:bg-surface-2 focus-visible:ring-brand-weak focus-visible:ring-offset-surface-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            )}
          >
            {backgroundIcon && (
              <span className="pointer-events-none absolute -right-8 -top-8 opacity-5 transition-opacity duration-200 group-hover:opacity-10">
                {backgroundIcon}
              </span>
            )}
            <span className="bg-brand/15 text-brand flex h-8 w-8 items-center justify-center rounded-base">
              {tile.icon}
            </span>
            <div className="space-y-0.5">
              <div className="text-text-0 text-xs font-semibold sm:text-sm">{tile.title}</div>
              <p className="text-text-1 text-xs leading-snug">{tile.subtitle}</p>
            </div>
            <div className="text-text-1 mt-auto flex items-center gap-1.5 text-xs">
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">Start</Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
}
