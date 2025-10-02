import { Book, Code, MessageSquare } from "lucide-react";

import { GlassTile } from "../ui/GlassTile";

const startTiles = [
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
    action: { type: "set-persona", persona: "developer" },
  },
  {
    id: "creative-role",
    title: "Kreativ-Rolle",
    subtitle: "Starte einen Chat als kreativer Autor",
    icon: <Book />,
    action: { type: "set-persona", persona: "creative" },
  },
];

interface StartTilesProps {
  onTileClick: (action: any) => void;
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
