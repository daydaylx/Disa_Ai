import { Book, Code, MessageSquare } from "lucide-react";
import type { ReactNode } from "react";

import { GlassTile } from "../ui/GlassTile";

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
        <GlassTile
          key={tile.id}
          title={tile.title}
          subtitle={tile.subtitle}
          icon={tile.icon}
          onPress={() => onTileClick(tile.action)}
        />
      ))}
    </div>
  );
}
