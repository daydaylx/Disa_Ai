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
    <div className="grid grid-cols-1 gap-3 p-3 xs:grid-cols-2 sm:grid-cols-3">
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
              "card-depth group relative flex h-full min-h-[var(--touch-comfortable)] flex-col gap-2.5 overflow-hidden rounded-base border border-border bg-surface-1 p-3 text-left transition-all duration-150",
              "hover:border-brand hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-weak focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1",
              "touch-target active:scale-95 active:bg-surface-2",
            )}
          >
            {backgroundIcon && (
              <span className="pointer-events-none absolute -right-8 -top-8 opacity-5 transition-opacity duration-200 group-hover:opacity-10">
                {backgroundIcon}
              </span>
            )}
            <span className="flex h-8 w-8 items-center justify-center rounded-base bg-brand/15 text-brand">
              {tile.icon}
            </span>
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-text-0 sm:text-sm">{tile.title}</div>
              <p className="text-xs leading-snug text-text-1">{tile.subtitle}</p>
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-xs text-text-1">
              <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                Start
              </Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
}
